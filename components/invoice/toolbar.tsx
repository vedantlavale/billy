'use client'

import * as React from "react"
import Link from "next/link"
import { DropdownMenu } from "radix-ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon, Refresh01Icon } from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "@/app/auth/actions"

import { CurrencySelect } from "@/components/invoice/currency-select"
import { TemplateSelector } from "@/components/invoice/template-selector"
import { renderInvoiceDocument } from "@/lib/render-invoice-document"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import type { InvoiceData } from "@/lib/types"
import posthog from "posthog-js"

function sanitizeFileName(value: string) {
  return value.trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "")
}

function waitForFrameAssets(frameDocument: Document) {
  const imagePromises = Array.from(frameDocument.images).map((image) => {
    if (image.complete) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      image.addEventListener("load", () => resolve(), { once: true })
      image.addEventListener("error", () => resolve(), { once: true })
    })
  })

  return Promise.all(imagePromises)
}

async function clientSidePrint(data: InvoiceData) {
  const html = renderInvoiceDocument(data)

  await new Promise((resolve) => requestAnimationFrame(resolve))
  await new Promise((resolve) => requestAnimationFrame(resolve))

  const frame = document.createElement("iframe")

  frame.setAttribute("aria-hidden", "true")
  frame.style.position = "fixed"
  frame.style.left = "-10000px"
  frame.style.top = "0"
  frame.style.width = "210mm"
  frame.style.height = "297mm"
  frame.style.border = "0"

  document.body.appendChild(frame)

  const frameDocument = frame.contentDocument
  const frameWindow = frame.contentWindow

  if (!frameDocument || !frameWindow) {
    frame.remove()
    window.print()
    return
  }

  frameDocument.open()
  frameDocument.write(html)
  frameDocument.close()

  await waitForFrameAssets(frameDocument)

  if (frameDocument.fonts) {
    await frameDocument.fonts.ready
  }

  frameWindow.focus()
  frameWindow.addEventListener("afterprint", () => frame.remove(), { once: true })
  frameWindow.print()

  window.setTimeout(() => {
    frame.remove()
  }, 60000)
}

function getUserInitial(user: { email?: string; user_metadata?: { full_name?: string } }) {
  const source = user?.user_metadata?.full_name || user?.email || ""
  const initial = source.trim().charAt(0).toUpperCase()
  return initial || "?"
}

function AuthControls() {
  const { isAuthenticated, user } = useAuth()
  const [signingOut, setSigningOut] = React.useState(false)

  if (isAuthenticated && user) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className="nav-avatar"
          >
            {getUserInitial(user)}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={10}
            className="nav-menu z-50 min-w-[210px] p-1.5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2"
          >
            <div className="px-2.5 pb-1.5 pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--invoice-subtle)]">
                Signed in as
              </p>
              <p className="truncate text-xs font-medium text-[var(--invoice-ink)]">
                {user.email}
              </p>
            </div>
            <div className="my-1 h-px bg-[var(--invoice-panel-border)] opacity-60" />
            <DropdownMenu.Item asChild>
              <Link href="/dashboard" className="nav-menu-item">
                Dashboard
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="nav-menu-item text-[var(--invoice-muted)]"
              disabled={signingOut}
              onSelect={async (event) => {
                event.preventDefault()
                setSigningOut(true)
                await signOut()
              }}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    )
  }

  return (
    <Link
      href="/login"
      className="nav-primary inline-flex h-9 items-center gap-1.5 px-4 text-xs font-semibold"
    >
      Sign in
    </Link>
  )
}

export function Toolbar() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const { isAuthenticated } = useAuth()

  const handleExportPdf = async () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))

    if (isAuthenticated) {
      try {
        // Auto-save before rendering. POST /api/invoices inserts a new row when
        // there's no id and updates the existing row otherwise, incrementing the
        // free-plan count only on first save. This keeps the dashboard free of
        // duplicates and means re-exporting an invoice never consumes quota.
        const saveResponse = await fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceData: state }),
        })

        if (saveResponse.ok) {
          const { invoice } = await saveResponse.json()
          if (invoice?.id && invoice.id !== state.id) {
            dispatch({ type: "SET_ID", id: invoice.id })
          }
        } else {
          const saveErr = await saveResponse.json().catch(() => ({}))
          if (saveErr.code === "limit_reached") {
            alert(
              "You've reached the free plan limit of 5 invoices. Upgrade to Pro to create more.",
            )
            return
          }
          // Other save errors are non-blocking: still let the user get their PDF.
        }

        const response = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: state.templateId,
            invoiceData: state,
          }),
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `invoice-${sanitizeFileName(state.invoiceNumber) || "export"}.pdf`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          posthog.capture("invoice_pdf_exported", {
            template_id: state.templateId,
            invoice_number: state.invoiceNumber,
            method: "server",
          })
          return
        }

        const err = await response.json()
        if (err.code !== "auth_required") {
          alert(err.error || "Failed to generate PDF")
          return
        }
      } catch {
        void clientSidePrint(state)
        return
      }
    }

    posthog.capture("invoice_pdf_exported", {
      template_id: state.templateId,
      invoice_number: state.invoiceNumber,
      method: "client_print",
    })
    void clientSidePrint(state)
  }

  const handleReset = () => {
    const shouldReset = window.confirm("Start a fresh invoice? This clears edits.")
    if (shouldReset) {
      posthog.capture("invoice_reset", { template_id: state.templateId })
      dispatch({ type: "RESET_INVOICE" })
    }
  }

  return (
    <header className="toolbar editor-chrome premium-nav sticky top-0 z-20">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            aria-label="Billy home"
            className="shrink-0 font-serif text-[28px] italic leading-none text-[var(--invoice-ink)]"
          >
            billy
          </Link>
          <span className="hidden h-5 w-px bg-[var(--invoice-panel-border)] opacity-60 sm:block" />
          <div className="hidden min-w-0 sm:block">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-medium text-[var(--invoice-ink)]">
                Invoice editor
              </h1>
              <span className="nav-chip hidden items-center px-2.5 py-0.5 text-[11px] font-medium text-[var(--invoice-muted)] sm:inline-flex">
                {state.invoiceNumber}
              </span>
            </div>
            <p className="truncate text-xs text-[var(--invoice-muted)]">
              {state.clientName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
          <TemplateSelector />
          <CurrencySelect />
          <button
            type="button"
            onClick={handleReset}
            className="nav-control inline-flex h-9 items-center gap-1.5 px-3.5 text-xs font-medium text-[var(--invoice-ink)]"
          >
            <HugeiconsIcon icon={Refresh01Icon} size={15} />
            New
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="nav-primary inline-flex h-9 items-center gap-1.5 px-4 text-xs font-semibold"
          >
            <HugeiconsIcon icon={PrinterIcon} size={15} />
            Export PDF
          </button>
          <span className="mx-0.5 hidden h-6 w-px bg-[var(--invoice-panel-border)] opacity-60 sm:block" />
          <AuthControls />
        </div>
      </div>
    </header>
  )
}
