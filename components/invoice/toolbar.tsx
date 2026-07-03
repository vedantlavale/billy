'use client'

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon, Refresh01Icon, SlidersHorizontalIcon } from "@hugeicons/core-free-icons"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "@/app/auth/actions"

import {
  UserDropdown,
  type UserDropdownAction,
} from "@/components/ui/user-dropdown"
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

function getUserDisplayName(user: {
  email?: string
  user_metadata?: {
    full_name?: string
    name?: string
    user_name?: string
    preferred_username?: string
  }
}) {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Billy user"
  )
}

function getUserInitials(name: string, email?: string) {
  const source = name || email || ""
  const parts = source.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.trim().charAt(0).toUpperCase() || "?"
}

function getUserAvatar(user: {
  user_metadata?: {
    avatar_url?: string
    picture?: string
  }
}) {
  return user.user_metadata?.avatar_url || user.user_metadata?.picture || null
}

function AuthControls() {
  const { isAuthenticated, user } = useAuth()
  const [signingOut, setSigningOut] = React.useState(false)

  const handleAction = async (action: UserDropdownAction) => {
    if (action === "dashboard") {
      return
    }

    if (action === "upgrade") {
      try {
        const response = await fetch("/api/billing/checkout", {
          method: "POST",
        })
        const data = await response.json()

        if (!response.ok || !data.url) {
          alert(data.error || "Unable to start checkout.")
          return
        }

        window.location.assign(data.url)
      } catch {
        alert("Unable to start checkout.")
      }
      return
    }

    if (action === "logout") {
      setSigningOut(true)
      await signOut()
    }
  }

  if (isAuthenticated && user) {
    const displayName = getUserDisplayName(user)

    return (
      <UserDropdown
        user={{
          name: displayName,
          email: user.email || "",
          avatar: getUserAvatar(user),
          initials: getUserInitials(displayName, user.email),
        }}
        signingOut={signingOut}
        onAction={handleAction}
      />
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

interface ToolbarProps {
  customizeOpen?: boolean
  onToggleCustomize?: () => void
}

export function Toolbar({ customizeOpen, onToggleCustomize }: ToolbarProps) {
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
            className="shrink-0 font-serif text-[26px] leading-none text-[#0B0B0F]"
          >
            billy*
          </Link>
          <span className="hidden h-5 w-px bg-[#EBEBEE] sm:block" />
          <span className="nav-chip hidden items-center px-2.5 py-0.5 text-[11px] font-medium text-[#82868F] sm:inline-flex">
            {state.invoiceNumber}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
          {onToggleCustomize && (
            <button
              type="button"
              onClick={onToggleCustomize}
              aria-pressed={customizeOpen}
              className={`nav-control inline-flex h-9 items-center gap-1.5 px-3.5 text-xs font-medium ${
                customizeOpen
                  ? "!border-[#0778F2] !bg-[#EAF3FE] !text-[#0778F2]"
                  : "text-[#0B0B0F]"
              }`}
            >
              <HugeiconsIcon icon={SlidersHorizontalIcon} size={15} />
              Customize
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="nav-control inline-flex h-9 items-center gap-1.5 px-3.5 text-xs font-medium text-[#0B0B0F]"
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
          <span className="mx-0.5 hidden h-6 w-px bg-[#EBEBEE] sm:block" />
          <AuthControls />
        </div>
      </div>
    </header>
  )
}
