'use client'

import * as React from "react"

import { EditableText } from "@/components/invoice/editable-text"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"

export function MetaSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  const columns = state.options.showPONumber ? 4 : 3

  return (
    <section
      data-break-block
      className="meta-section grid gap-4 border-b border-[var(--invoice-border)] pb-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      <div className="meta-item space-y-2">
        <p className="meta-label text-xs font-semibold uppercase tracking-[0.25em] text-[var(--invoice-subtle)]">
          Invoice No.
        </p>
        <EditableText
          value={state.invoiceNumber}
          onCommit={(value) =>
            dispatch({ type: "UPDATE_FIELD", field: "invoiceNumber", value })
          }
          placeholder="INV-0001"
          className="meta-value text-base font-semibold text-[var(--invoice-ink)]"
        />
      </div>
      <div className="meta-item space-y-2">
        <p className="meta-label text-xs font-semibold uppercase tracking-[0.25em] text-[var(--invoice-subtle)]">
          Issue Date
        </p>
        <EditableText
          value={state.invoiceDate}
          onCommit={(value) =>
            dispatch({ type: "UPDATE_FIELD", field: "invoiceDate", value })
          }
          inputType="date"
          className="meta-value text-base text-[var(--invoice-ink)]"
          displayValue={state.invoiceDate}
        />
      </div>
      <div className="meta-item space-y-2">
        <p className="meta-label text-xs font-semibold uppercase tracking-[0.25em] text-[var(--invoice-subtle)]">
          Due Date
        </p>
        <EditableText
          value={state.dueDate}
          onCommit={(value) =>
            dispatch({ type: "UPDATE_FIELD", field: "dueDate", value })
          }
          inputType="date"
          className="meta-value text-base text-[var(--invoice-ink)]"
          displayValue={state.dueDate}
        />
      </div>
      {state.options.showPONumber && (
        <div className="meta-item space-y-2">
          <p className="meta-label text-xs font-semibold uppercase tracking-[0.25em] text-[var(--invoice-subtle)]">
            PO Number
          </p>
          <EditableText
            value={state.poNumber}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "poNumber", value })
            }
            placeholder="PO-001"
            className="meta-value text-base text-[var(--invoice-ink)]"
          />
        </div>
      )}
    </section>
  )
}
