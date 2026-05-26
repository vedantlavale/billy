'use client'

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon, Refresh01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { useInvoiceDispatch } from "@/components/invoice/invoice-context"

export function Toolbar() {
  const dispatch = useInvoiceDispatch()

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleReset = () => {
    const shouldReset = window.confirm("Start a fresh invoice? This clears edits.")
    if (shouldReset) {
      dispatch({ type: "RESET_INVOICE" })
    }
  }

  return (
    <div className="toolbar sticky top-6 z-10 mx-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-slate-200/70 bg-white/90 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="text-sm font-medium text-slate-600">
        Direct-edit the invoice, then export to PDF.
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <HugeiconsIcon icon={Refresh01Icon} size={16} />
          New Invoice
        </Button>
        <Button size="sm" onClick={handlePrint} className="gap-2">
          <HugeiconsIcon icon={PrinterIcon} size={16} />
          Export PDF
        </Button>
      </div>
    </div>
  )
}
