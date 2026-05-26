'use client'

import * as React from "react"

import { EditableNumber } from "@/components/invoice/editable-number"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { calculateTotals, formatCurrency } from "@/lib/invoice"

export function TotalsSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const totals = React.useMemo(() => calculateTotals(state), [state])

  return (
    <section className="totals-section flex flex-col gap-4 border-t border-slate-200 pt-6">
      <div className="totals-box ml-auto w-full max-w-xs space-y-3 text-sm text-slate-600">
        <div className="total-row flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-mono text-slate-800">
            {formatCurrency(totals.subtotal, state.currency)}
          </span>
        </div>
        <div className="total-row grid grid-cols-[1fr_auto_auto] items-center gap-3">
          <span>Tax Rate</span>
          <div className="flex items-center gap-2">
            <EditableNumber
              value={state.taxRate}
              onCommit={(value) =>
                dispatch({ type: "UPDATE_FIELD", field: "taxRate", value })
              }
              min={0}
              step={0.1}
              decimals={2}
              className="text-sm"
            />
            <span className="font-mono text-slate-500">%</span>
          </div>
          <span className="text-right font-mono text-slate-800">
            {formatCurrency(totals.taxAmount, state.currency)}
          </span>
        </div>
        <div className="total-row grid grid-cols-[1fr_auto_auto] items-center gap-3">
          <span>Discount</span>
          <div className="flex items-center gap-2">
            <EditableNumber
              value={state.discountRate}
              onCommit={(value) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "discountRate",
                  value,
                })
              }
              min={0}
              step={0.1}
              decimals={2}
              className="text-sm"
            />
            <span className="font-mono text-slate-500">%</span>
          </div>
          <span className="text-right font-mono text-slate-800">
            {formatCurrency(totals.discountAmount, state.currency)}
          </span>
        </div>
        <div className="grand-total flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span className="font-mono">
            {formatCurrency(totals.total, state.currency)}
          </span>
        </div>
      </div>
    </section>
  )
}
