'use client'

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  Invoice03Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"

import { InvoiceCanvas } from "@/components/invoice/invoice-canvas"
import { InvoiceProvider, useInvoiceState } from "@/components/invoice/invoice-context"
import { Toolbar } from "@/components/invoice/toolbar"
import { calculateTotals, formatCurrency } from "@/lib/invoice"

function InspectorRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <HugeiconsIcon
          icon={icon}
          size={17}
          className="shrink-0 text-[var(--invoice-muted)]"
        />
        <span className="text-sm text-[var(--invoice-muted)]">{label}</span>
      </div>
      <span className="min-w-0 truncate text-right text-sm font-medium text-[var(--invoice-ink)]">
        {value}
      </span>
    </div>
  )
}

function EditorWorkspace() {
  const state = useInvoiceState()
  const totals = React.useMemo(() => calculateTotals(state), [state])

  return (
    <div className="invoice-editor min-h-dvh bg-invoice-canvas text-[var(--invoice-ink)]">
      <Toolbar />
      <div className="mx-auto grid w-full max-w-[1440px] gap-0 border-x border-[var(--invoice-stage-border)] bg-[var(--invoice-panel)] lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 bg-[var(--invoice-stage)] px-3 py-4 sm:px-6 sm:py-6 lg:min-h-[calc(100dvh-65px)] lg:px-8">
          <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Canvas
              </p>
              <h2 className="truncate text-sm font-semibold text-[var(--invoice-ink)]">
                {state.invoiceNumber} for {state.clientName}
              </h2>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Total
              </p>
              <p className="font-mono text-sm font-semibold">
                {formatCurrency(totals.total, state.currency)}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto border border-[var(--invoice-stage-border)] bg-[var(--invoice-stage)] p-3 sm:p-5">
            <InvoiceCanvas />
          </div>
        </main>

        <aside className="editor-chrome border-t border-[var(--invoice-panel-border)] bg-[var(--invoice-panel)] lg:border-l lg:border-t-0">
          <div className="sticky top-16 divide-y divide-[var(--invoice-panel-border)]">
            <section className="p-5">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Summary
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold text-[var(--invoice-ink)]">
                {formatCurrency(totals.total, state.currency)}
              </p>
              <div className="mt-5 space-y-1 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Subtotal</span>
                  <span className="font-mono">
                    {formatCurrency(totals.subtotal, state.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Tax</span>
                  <span className="font-mono">
                    {formatCurrency(totals.taxAmount, state.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--invoice-muted)]">Discount</span>
                  <span className="font-mono">
                    {formatCurrency(totals.discountAmount, state.currency)}
                  </span>
                </div>
              </div>
            </section>

            <section className="p-5">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Document
              </p>
              <div className="mt-2 divide-y divide-[var(--invoice-panel-border)]">
                <InspectorRow
                  icon={Invoice03Icon}
                  label="Number"
                  value={state.invoiceNumber}
                />
                <InspectorRow
                  icon={UserCircleIcon}
                  label="Client"
                  value={state.clientName}
                />
                <InspectorRow
                  icon={Calendar03Icon}
                  label="Due"
                  value={state.dueDate}
                />
              </div>
            </section>

            <section className="p-5">
              <p className="text-xs font-medium uppercase text-[var(--invoice-muted)]">
                Draft
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--invoice-muted)]">
                Saved in this browser with {state.lineItems.length} line item
                {state.lineItems.length === 1 ? "" : "s"}.
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
