'use client'

import * as React from "react"

import { InvoiceCanvas } from "@/components/invoice/invoice-canvas"
import { InvoiceProvider, useInvoiceState } from "@/components/invoice/invoice-context"
import { Toolbar } from "@/components/invoice/toolbar"
import { calculateTotals, formatCurrency } from "@/lib/invoice"

function EditorWorkspace() {
  const state = useInvoiceState()
  const totals = React.useMemo(() => calculateTotals(state), [state])
  const lineItemCount = state.lineItems.length

  return (
    <div className="invoice-editor min-h-dvh">
      <Toolbar />
      <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[1fr_300px]">
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <InvoiceCanvas />
        </main>

        <aside className="editor-chrome border-l border-[var(--invoice-panel-border)] bg-[var(--invoice-panel)]">
          <div className="sticky top-16 divide-y divide-[var(--invoice-panel-border)]">
            <section className="p-5">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Summary
              </p>
              <div className="mt-5 space-y-1 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Subtotal</span>
                  <span className="font-mono text-[var(--invoice-ink)]">
                    {formatCurrency(totals.subtotal, state.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Tax</span>
                  <span className="font-mono text-[var(--invoice-ink)]">
                    {formatCurrency(totals.taxAmount, state.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Discount</span>
                  <span className="font-mono text-[var(--invoice-ink)]">
                    {formatCurrency(totals.discountAmount, state.currency)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-[var(--invoice-panel-border)] pt-4">
                <span className="text-sm font-semibold text-[var(--invoice-ink)]">
                  Total
                </span>
                <span className="font-mono text-lg font-semibold text-[var(--invoice-ink)]">
                  {formatCurrency(totals.total, state.currency)}
                </span>
              </div>
            </section>

            <section className="space-y-3 p-5">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Document
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Number</span>
                  <span className="text-[var(--invoice-ink)]">
                    {state.invoiceNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Client</span>
                  <span className="truncate text-[var(--invoice-ink)]">
                    {state.clientName}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Due</span>
                  <span className="text-[var(--invoice-ink)]">
                    {state.dueDate}
                  </span>
                </div>
              </div>
            </section>

            <section className="p-5">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Draft
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--invoice-muted)]">
                Saved in this browser with {lineItemCount} line item
                {lineItemCount === 1 ? "" : "s"}.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function InvoiceEditor() {
  return (
    <InvoiceProvider>
      <EditorWorkspace />
    </InvoiceProvider>
  )
}
