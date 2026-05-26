'use client'

import * as React from "react"

import { EditableText } from "@/components/invoice/editable-text"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"

export function MetaSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <section className="grid gap-4 border-b border-slate-200 pb-6 md:grid-cols-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Invoice No.
        </p>
        <EditableText
          value={state.invoiceNumber}
          onCommit={(value) =>
            dispatch({ type: "UPDATE_FIELD", field: "invoiceNumber", value })
          }
          placeholder="INV-0001"
          className="text-base font-semibold text-slate-900"
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Issue Date
        </p>
        <EditableText
          value={state.invoiceDate}
          onCommit={(value) =>
            dispatch({ type: "UPDATE_FIELD", field: "invoiceDate", value })
          }
          inputType="date"
          className="text-base text-slate-900"
          displayValue={state.invoiceDate}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Due Date
        </p>
        <EditableText
          value={state.dueDate}
          onCommit={(value) =>
            dispatch({ type: "UPDATE_FIELD", field: "dueDate", value })
          }
          inputType="date"
          className="text-base text-slate-900"
          displayValue={state.dueDate}
        />
      </div>
    </section>
  )
}
