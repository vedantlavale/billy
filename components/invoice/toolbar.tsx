'use client'

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PrinterIcon,
  Refresh01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { calculateLineItemAmount, calculateTotals, formatCurrency } from "@/lib/invoice"
import type { InvoiceData } from "@/lib/types"

function sanitizeFileName(value: string) {
  return value.trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "")
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("`", "&#096;")
}

function formatMultiline(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />")
}

function renderLogo(data: InvoiceData) {
  if (data.logoUrl) {
    return `<img class="logo-image" src="${escapeAttribute(data.logoUrl)}" alt="" />`
  }

  const initials = data.businessName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")

  return `<div class="logo-fallback">${escapeHtml(initials || "BI")}</div>`
}

function renderInvoiceDocument(data: InvoiceData) {
  const totals = calculateTotals(data)
  const lineItems = data.lineItems
    .map((item) => {
      const amount = calculateLineItemAmount(item)

      return `<tr>
        <td>${escapeHtml(item.description)}</td>
        <td class="numeric">${item.quantity}</td>
        <td class="numeric">${formatCurrency(item.rate, data.currency)}</td>
        <td class="numeric">${formatCurrency(amount, data.currency)}</td>
      </tr>`
    })
    .join("")

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(sanitizeFileName(data.invoiceNumber) || "invoice")}</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        background: #ffffff;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body {
        width: 210mm;
        min-height: 297mm;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 18mm;
        background: #ffffff;
      }

      .top {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .brand {
        display: flex;
        gap: 18px;
        align-items: flex-start;
      }

      .logo-image,
      .logo-fallback {
        width: 72px;
        height: 72px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        object-fit: contain;
      }

      .logo-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8fafc;
        color: #334155;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.06em;
      }

      h1 {
        margin: 0;
        color: #111827;
        font-size: 24px;
        line-height: 1.2;
        font-weight: 700;
      }

      .tagline {
        margin-top: 8px;
        color: #64748b;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .business {
        text-align: right;
        color: #475569;
        font-size: 12px;
        line-height: 1.55;
      }

      .section {
        padding: 24px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .label {
        margin: 0 0 10px;
        color: #94a3b8;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .client-grid {
        display: grid;
        grid-template-columns: 34mm 1fr;
        gap: 18px;
      }

      .client-name {
        margin: 0 0 8px;
        color: #111827;
        font-size: 15px;
        font-weight: 700;
      }

      .text {
        color: #475569;
        font-size: 12px;
        line-height: 1.55;
      }

      .meta-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .meta-value {
        color: #111827;
        font-size: 14px;
        font-weight: 600;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        padding: 0 0 10px;
        color: #94a3b8;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-align: left;
        text-transform: uppercase;
        border-bottom: 1px solid #e5e7eb;
      }

      td {
        padding: 14px 0;
        color: #1f2937;
        font-size: 12px;
        border-bottom: 1px solid #f1f5f9;
      }

      .numeric {
        text-align: right;
        font-family: "Courier New", Courier, monospace;
        white-space: nowrap;
      }

      .totals {
        display: grid;
        justify-content: end;
        padding-top: 22px;
      }

      .totals-box {
        width: 76mm;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 5px 0;
        color: #475569;
        font-size: 12px;
      }

      .grand-total {
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px solid #e5e7eb;
        color: #111827;
        font-size: 15px;
        font-weight: 700;
      }

      .footer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        padding-top: 24px;
      }

      .footer .text {
        min-height: 36px;
      }

      tr,
      .section,
      .footer {
        break-inside: avoid;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="top">
        <div class="brand">
          ${renderLogo(data)}
          <div>
            <h1>${escapeHtml(data.businessName)}</h1>
            <div class="tagline">${escapeHtml(data.businessTagline)}</div>
          </div>
        </div>
        <div class="business">
          ${formatMultiline(data.businessAddress)}<br />
          ${escapeHtml(data.businessEmail)}<br />
          ${escapeHtml(data.businessPhone)}
        </div>
      </header>

      <section class="section client-grid">
        <p class="label">Bill To</p>
        <div>
          <p class="client-name">${escapeHtml(data.clientName)}</p>
          <div class="text">${formatMultiline(data.clientAddress)}</div>
          <div class="text" style="margin-top: 8px;">${escapeHtml(data.clientEmail)}</div>
        </div>
      </section>

      <section class="section meta-grid">
        <div>
          <p class="label">Invoice No.</p>
          <div class="meta-value">${escapeHtml(data.invoiceNumber)}</div>
        </div>
        <div>
          <p class="label">Issue Date</p>
          <div class="meta-value">${escapeHtml(data.invoiceDate)}</div>
        </div>
        <div>
          <p class="label">Due Date</p>
          <div class="meta-value">${escapeHtml(data.dueDate)}</div>
        </div>
      </section>

      <section class="section">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="numeric">Qty</th>
              <th class="numeric">Rate</th>
              <th class="numeric">Amount</th>
            </tr>
          </thead>
          <tbody>${lineItems}</tbody>
        </table>

        <div class="totals">
          <div class="totals-box">
            <div class="total-row">
              <span>Subtotal</span>
              <span class="numeric">${formatCurrency(totals.subtotal, data.currency)}</span>
            </div>
            <div class="total-row">
              <span>Tax Rate</span>
              <span class="numeric">${data.taxRate.toFixed(2)}% / ${formatCurrency(totals.taxAmount, data.currency)}</span>
            </div>
            <div class="total-row">
              <span>Discount</span>
              <span class="numeric">${data.discountRate.toFixed(2)}% / ${formatCurrency(totals.discountAmount, data.currency)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total</span>
              <span class="numeric">${formatCurrency(totals.total, data.currency)}</span>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div>
          <p class="label">Notes</p>
          <div class="text">${formatMultiline(data.notes)}</div>
        </div>
        <div>
          <p class="label">Payment Terms</p>
          <div class="text">${formatMultiline(data.paymentTerms)}</div>
        </div>
      </footer>
    </main>
  </body>
</html>`
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

async function exportInvoicePdf(data: InvoiceData) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

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
  frameDocument.write(renderInvoiceDocument(data))
  frameDocument.close()

  await waitForFrameAssets(frameDocument)

  frameWindow.focus()
  frameWindow.addEventListener("afterprint", () => frame.remove(), { once: true })
  frameWindow.print()

  window.setTimeout(() => {
    frame.remove()
  }, 60000)
}

export function Toolbar() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  const handleExportPdf = () => {
    void exportInvoicePdf(state)
  }

  const handleReset = () => {
    const shouldReset = window.confirm("Start a fresh invoice? This clears edits.")
    if (shouldReset) {
      dispatch({ type: "RESET_INVOICE" })
    }
  }

  return (
    <header className="toolbar editor-chrome sticky top-0 z-20 border-b border-[var(--invoice-panel-border)] bg-[var(--invoice-toolbar)]">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="text-sm font-semibold tracking-tight text-[var(--invoice-ink)]">
            Billy
          </span>
          <span className="h-5 w-px bg-[var(--invoice-panel-border)]" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-medium text-[var(--invoice-ink)]">
                Invoice editor
              </h1>
              <span className="hidden border border-[var(--invoice-panel-border)] bg-[var(--invoice-panel-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--invoice-muted)] sm:inline-flex">
                {state.invoiceNumber}
              </span>
            </div>
            <p className="truncate text-xs text-[var(--invoice-muted)]">
              {state.clientName}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <div className="flex items-center gap-2 text-sm text-[var(--invoice-muted)]">
            <HugeiconsIcon
              icon={SecurityCheckIcon}
              size={16}
              className="text-emerald-600"
            />
            <span>Saved locally</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-md border-[var(--invoice-panel-border)] bg-white text-[var(--invoice-ink)] hover:bg-[var(--invoice-panel-soft)]"
            >
              <HugeiconsIcon icon={Refresh01Icon} size={16} />
              New
            </Button>
            <Button
              size="sm"
              onClick={handleExportPdf}
              className="gap-2 rounded-md bg-[var(--invoice-ink)] text-white hover:bg-[var(--invoice-accent)]"
            >
              <HugeiconsIcon icon={PrinterIcon} size={16} />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
