'use client'

import * as React from "react"

import { InvoiceCanvas } from "@/components/invoice/invoice-canvas"
import { InvoiceProvider, useInvoiceState } from "@/components/invoice/invoice-context"
import { Toolbar } from "@/components/invoice/toolbar"
import { calculateTotals, formatCurrency } from "@/lib/invoice"
import { getTemplate } from "@/lib/templates"

function EditorWorkspace() {
  const state = useInvoiceState()
  const totals = React.useMemo(() => calculateTotals(state), [state])
  const lineItemCount = state.lineItems.length
  const template = React.useMemo(() => getTemplate(state.templateId), [state.templateId])

  return (
    <div
      className="invoice-editor min-h-dvh"
      style={{
        backgroundColor: template.colors.desk,
        color: template.colors.ink,
        "--invoice-ink": template.colors.ink,
        "--invoice-muted": template.colors.muted,
        "--invoice-subtle": template.colors.subtle,
        "--invoice-paper": template.colors.paper,
        "--invoice-border": template.colors.border,
        "--invoice-accent": template.colors.accent,
        "--invoice-desk": template.colors.desk,
        "--invoice-panel": template.colors.panel,
        "--invoice-panel-border": template.colors.panelBorder,
        "--invoice-toolbar": template.colors.toolbar,
        "--invoice-primary": template.colors.primary,
        "--invoice-secondary": template.colors.secondary,
        "--invoice-font": template.cssFontFamily,
      } as React.CSSProperties}
    >
      <Toolbar />
      <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[1fr_300px]">
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <InvoiceCanvas />
        </main>

        <aside className="editor-chrome border-l bg-[var(--invoice-panel)]" style={{ borderColor: "var(--invoice-panel-border)" }}>
          <div className="sticky top-16 divide-y" style={{ borderColor: "var(--invoice-panel-border)" }}>
            <section className="p-5">
              <p className="text-xs font-medium uppercase" style={{ color: "var(--invoice-muted)" }}>
                Summary
              </p>
              <div className="mt-5 space-y-1 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span style={{ color: "var(--invoice-muted)" }}>Subtotal</span>
                  <span className="font-mono" style={{ color: "var(--invoice-ink)" }}>
                    {formatCurrency(totals.subtotal, state.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span style={{ color: "var(--invoice-muted)" }}>Tax</span>
                  <span className="font-mono" style={{ color: "var(--invoice-ink)" }}>
                    {formatCurrency(totals.taxAmount, state.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span style={{ color: "var(--invoice-muted)" }}>Discount</span>
                  <span className="font-mono" style={{ color: "var(--invoice-ink)" }}>
                    {formatCurrency(totals.discountAmount, state.currency)}
                  </span>
                </div>
              </div>
              <div
                className="mt-4 flex items-center justify-between gap-4 border-t pt-4"
                style={{ borderColor: "var(--invoice-panel-border)" }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--invoice-ink)" }}>
                  Total
                </span>
                <span className="font-mono text-lg font-semibold" style={{ color: "var(--invoice-ink)" }}>
                  {formatCurrency(totals.total, state.currency)}
                </span>
              </div>
            </section>

            <section className="space-y-3 p-5">
              <p className="text-xs font-medium uppercase" style={{ color: "var(--invoice-muted)" }}>
                Document
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span style={{ color: "var(--invoice-muted)" }}>Number</span>
                  <span style={{ color: "var(--invoice-ink)" }}>
                    {state.invoiceNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span style={{ color: "var(--invoice-muted)" }}>Client</span>
                  <span className="truncate" style={{ color: "var(--invoice-ink)" }}>
                    {state.clientName}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span style={{ color: "var(--invoice-muted)" }}>Due</span>
                  <span style={{ color: "var(--invoice-ink)" }}>
                    {state.dueDate}
                  </span>
                </div>
              </div>
            </section>

            <section className="p-5">
              <p className="text-xs font-medium uppercase" style={{ color: "var(--invoice-muted)" }}>
                Draft
              </p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--invoice-muted)" }}>
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
