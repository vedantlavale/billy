'use client'

import * as React from "react"

import { EditableText } from "@/components/invoice/editable-text"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"

export function ClientSection() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <section data-break-block className="client-section grid gap-4 border-b border-[var(--invoice-border)] pb-4 md:grid-cols-[140px_1fr]">
      <div className="client-label text-xs font-semibold uppercase tracking-[0.25em] text-[var(--invoice-subtle)]">
        Bill To
      </div>
      <div className="client-details flex flex-col space-y-3 text-sm text-[var(--invoice-muted)]">
        <div>
          <EditableText
            value={state.clientName}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "clientName", value })
            }
            placeholder="Client name"
            className="client-name text-base font-semibold text-[var(--invoice-ink)]"
          />
        </div>
        <div>
          <EditableText
            value={state.clientAddress}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "clientAddress", value })
            }
            placeholder="Client address"
            multiline
            rows={3}
            className="text-sm text-[var(--invoice-muted)]"
          />
        </div>
        <div>
          <EditableText
            value={state.clientEmail}
            onCommit={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "clientEmail", value })
            }
            placeholder="Client email"
            inputType="email"
            className="text-sm text-[var(--invoice-muted)]"
          />
        </div>
      </div>
    </section>
  )
}
