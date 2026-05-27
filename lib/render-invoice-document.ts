import { calculateLineItemAmount, calculateTotals, formatCurrency } from "@/lib/invoice"
import { getPdfTemplateCss, getTemplate } from "@/lib/templates"
import type { InvoiceData } from "@/lib/types"

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

export function renderInvoiceDocument(data: InvoiceData) {
  const totals = calculateTotals(data)
  const template = getTemplate(data.templateId)
  const pdfCss = getPdfTemplateCss(data.templateId)
  
  const showHSN = data.options.showHSNCode
  const lineItems = data.lineItems
    .map((item) => {
      const amount = calculateLineItemAmount(item)

      return `<tr>
        <td>${escapeHtml(item.description)}</td>
        ${showHSN ? `<td>${escapeHtml(item.hsnCode || "")}</td>` : ""}
        <td class="numeric">${item.quantity}</td>
        <td class="numeric">${formatCurrency(item.rate, data.currency)}</td>
        <td class="numeric">${formatCurrency(amount, data.currency)}</td>
      </tr>`
    })
    .join("")

  const gstEnabled =
    data.options.showCGST ||
    data.options.showSGST ||
    data.options.showIGST

  let taxRowsHtml = ""
  if (!gstEnabled) {
    const taxLabel = data.taxLabel || "Tax"
    taxRowsHtml = `
      <div class="total-row">
        <span>${escapeHtml(taxLabel)} (${data.taxRate.toFixed(2)}%)</span>
        <span class="numeric">${formatCurrency(totals.taxAmount, data.currency)}</span>
      </div>`
  } else {
    if (data.options.showIGST) {
      taxRowsHtml = `
        <div class="total-row">
          <span>IGST (${data.taxRate.toFixed(2)}%)</span>
          <span class="numeric">${formatCurrency(totals.igstAmount, data.currency)}</span>
        </div>`
    } else {
      if (data.options.showCGST) {
        taxRowsHtml += `
          <div class="total-row">
            <span>CGST (${(data.taxRate / 2).toFixed(2)}%)</span>
            <span class="numeric">${formatCurrency(totals.cgstAmount, data.currency)}</span>
          </div>`
      }
      if (data.options.showSGST) {
        taxRowsHtml += `
          <div class="total-row">
            <span>SGST (${(data.taxRate / 2).toFixed(2)}%)</span>
            <span class="numeric">${formatCurrency(totals.sgstAmount, data.currency)}</span>
          </div>`
      }
    }
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(data.invoiceNumber || "invoice")}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
    <style>
      :root { ${pdfCss} }

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
        background: var(--pdf-paper);
        color: var(--pdf-ink);
        font-family: ${template.fontFamily};
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
        background: var(--pdf-paper);
      }

      .top {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid var(--pdf-border);
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
        border: 1px solid var(--pdf-border);
        object-fit: contain;
      }

      .logo-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        background: oklch(0.97 0.005 260);
        color: var(--pdf-muted);
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.06em;
      }

      h1 {
        margin: 0;
        color: var(--pdf-ink);
        font-size: 24px;
        line-height: 1.2;
        font-weight: 700;
      }

      .tagline {
        margin-top: 8px;
        color: var(--pdf-muted);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .business {
        text-align: right;
        color: var(--pdf-muted);
        font-size: 12px;
        line-height: 1.55;
      }

      .section {
        padding: 24px 0;
        border-bottom: 1px solid var(--pdf-border);
      }

      .label {
        margin: 0 0 10px;
        color: var(--pdf-muted);
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
        color: var(--pdf-ink);
        font-size: 15px;
        font-weight: 700;
      }

      .text {
        color: var(--pdf-muted);
        font-size: 12px;
        line-height: 1.55;
      }

      .meta-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .meta-value {
        color: var(--pdf-ink);
        font-size: 14px;
        font-weight: 600;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        padding: 0 0 10px;
        color: var(--pdf-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-align: left;
        text-transform: uppercase;
        border-bottom: 1px solid var(--pdf-border);
      }

      td {
        padding: 14px 0;
        color: var(--pdf-ink);
        font-size: 12px;
        border-bottom: 1px solid var(--pdf-border);
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
        color: var(--pdf-muted);
        font-size: 12px;
      }

      .grand-total {
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px solid var(--pdf-border);
        color: var(--pdf-ink);
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

      .stamp-wrap {
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
      }

      .stamp-image {
        width: 96px;
        height: 96px;
        object-fit: contain;
      }

      .stamp-placeholder {
        width: 96px;
        height: 96px;
        border-radius: 8px;
        border: 1.5px dashed var(--pdf-border);
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
          ${data.options.showGSTIN && data.gstin ? `<br />GSTIN: ${escapeHtml(data.gstin)}` : ""}
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

      <section class="section meta-grid" style="grid-template-columns: repeat(${data.options.showPONumber ? 4 : 3}, minmax(0, 1fr));">
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
        ${data.options.showPONumber ? `
        <div>
          <p class="label">PO Number</p>
          <div class="meta-value">${escapeHtml(data.poNumber || "")}</div>
        </div>
        ` : ""}
      </section>

      <section class="section">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              ${showHSN ? `<th>HSN/SAC</th>` : ""}
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
            ${taxRowsHtml}
            <div class="total-row">
              <span>Discount (${data.discountRate.toFixed(2)}%)</span>
              <span class="numeric">${formatCurrency(totals.discountAmount, data.currency)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total</span>
              <span class="numeric">${formatCurrency(totals.total, data.currency)}</span>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-left">
          <div>
            <p class="label">Notes</p>
            <div class="text">${formatMultiline(data.notes)}</div>
          </div>
          <div style="margin-top: 16px;">
            <p class="label">Payment Terms</p>
            <div class="text">${formatMultiline(data.paymentTerms)}</div>
          </div>
          ${data.options.showBankDetails ? `
          <div style="margin-top: 16px;">
            <p class="label">Bank Details</p>
            <div class="text">
              ${escapeHtml(data.bankName || "")}<br />
              ${escapeHtml(data.bankAccount || "")}<br />
              ${escapeHtml(data.bankIfsc || "")}
            </div>
          </div>
          ` : ""}
        </div>
        <div class="stamp-wrap">
          ${data.options.showDigitalStamp ? `
          <p class="label">Stamp / Authorised Signatory</p>
          ${renderStamp(data)}
          ` : ""}
          ${data.options.showReverseCharge && data.reverseChargeLabel ? `
          <p class="text" style="margin-top: 12px; font-weight: 500; font-size: 11px;">${escapeHtml(data.reverseChargeLabel)}</p>
          ` : ""}
        </div>
      </footer>
    </main>
  </body>
</html>`
}

function renderStamp(data: InvoiceData) {
  if (data.stampUrl) {
    return `<img class="stamp-image" src="${escapeAttribute(data.stampUrl)}" alt="Stamp" />`
  }
  return `<div class="stamp-placeholder"></div>`
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
