'use client'

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PrinterIcon,
  Refresh01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "@/app/auth/actions"

import { Button } from "@/components/ui/button"
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

function AuthControls() {
  const { isAuthenticated, user } = useAuth()
  const [signingOut, setSigningOut] = React.useState(false)

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-md border border-[var(--invoice-panel-border)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--invoice-ink)] transition-colors hover:bg-[var(--invoice-panel-soft)]"
        >
          Dashboard
        </Link>
        <span className="hidden text-sm text-[var(--invoice-muted)] sm:inline">
          {user.email}
        </span>
        <button
          onClick={async () => {
            setSigningOut(true)
            await signOut()
          }}
          disabled={signingOut}
          className="rounded-md px-2 py-1 text-xs text-[var(--invoice-muted)] transition-colors hover:bg-[var(--invoice-panel-border)]"
        >
          {signingOut ? "..." : "Sign out"}
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-md bg-[var(--invoice-ink)] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
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
    <header className="toolbar editor-chrome sticky top-0 z-20 border-b border-[var(--invoice-panel-border)] bg-[var(--invoice-toolbar)]">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="text-sm font-semibold tracking-tight text-[var(--invoice-ink)]">
            Billy
          </span>
          <span className="h-5 w-px bg-[var(--invoice-panel-border)]" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-medium text-[var(--invoice-ink)]">
                Invoice editor
              </h1>
              <span className="hidden border border-[var(--invoice-panel-border)] bg-[var(--invoice-panel-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--invoice-muted)] sm:inline-flex">
                {state.invoiceNumber}
              </span>
            </div>
            <p className="truncate text-xs text-[var(--invoice-muted)]">
              {state.clientName}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <AuthControls />
          <div className="flex items-center gap-2">
            <TemplateSelector />
            <CurrencySelect />
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-md border-[var(--invoice-panel-border)] bg-white text-[var(--invoice-ink)] hover:bg-[var(--invoice-panel-soft)]"
            >
              <HugeiconsIcon icon={Refresh01Icon} size={16} />
              New
            </Button>
            <Button
              size="sm"
              onClick={handleExportPdf}
              className="gap-2 rounded-md bg-[var(--invoice-ink)] text-white hover:bg-[var(--invoice-accent)]"
            >
              <HugeiconsIcon icon={PrinterIcon} size={16} />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
