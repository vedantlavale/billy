'use client'

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon, Refresh01Icon, SlidersHorizontalIcon } from "@hugeicons/core-free-icons"
import { exportInvoicePdf } from "@/lib/pdf/client-export"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import posthog from "posthog-js"

interface ToolbarProps {
  customizeOpen?: boolean
  onToggleCustomize?: () => void
}

export function Toolbar({ customizeOpen, onToggleCustomize }: ToolbarProps) {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  const handleExportPdf = async () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    await new Promise((resolve) => requestAnimationFrame(resolve))

    try {
      await exportInvoicePdf(state)
      posthog.capture("invoice_pdf_exported", {
        template_id: state.templateId,
        invoice_number: state.invoiceNumber,
        method: "client",
      })
    } catch (error) {
      console.error("PDF export failed:", error)
      alert("Something went wrong generating the PDF. Please try again.")
    }
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
            className="shrink-0 font-serif text-[26px] leading-none text-[#37352f]"
          >
            billy*
          </Link>
          <span className="hidden h-5 w-px bg-[#E4E2DD] sm:block" />
          <span className="nav-chip hidden items-center px-2.5 py-0.5 text-[11px] font-medium text-[#898884] sm:inline-flex">
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
                  ? "!border-[#0070d7] !bg-[#e5f0fc] !text-[#0070d7]"
                  : "text-[#37352f]"
              }`}
            >
              <HugeiconsIcon icon={SlidersHorizontalIcon} size={15} />
              Customize
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="nav-control inline-flex h-9 items-center gap-1.5 px-3.5 text-xs font-medium text-[#37352f]"
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
        </div>
      </div>
    </header>
  )
}
