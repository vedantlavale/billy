import { calculateLineItemAmount, calculateTotals, formatCurrency, formatNumber } from "../invoice"
import type { InvoiceData } from "../types"

/** A plain-text rundown of the invoice, for an agent to relay or check. */
export function summarizeInvoice(data: InvoiceData): string {
  const money = (value: number) => formatCurrency(value, data.currency)
  const totals = calculateTotals(data)

  const lines = [
    `Invoice ${data.invoiceNumber} for ${data.clientName}`,
    `Issued ${data.invoiceDate}, due ${data.dueDate}`,
    "",
    ...data.lineItems.map(
      (item) =>
        `- ${item.description}: ${formatNumber(item.quantity, item.quantity % 1 ? 2 : 0)} × ${money(item.rate)} = ${money(calculateLineItemAmount(item))}`,
    ),
    "",
    `Subtotal: ${money(totals.subtotal)}`,
  ]

  if (totals.discountAmount) lines.push(`Discount (${data.discountRate}%): -${money(totals.discountAmount)}`)
  if (totals.cgstAmount) lines.push(`CGST (${data.taxRate / 2}%): ${money(totals.cgstAmount)}`)
  if (totals.sgstAmount) lines.push(`SGST (${data.taxRate / 2}%): ${money(totals.sgstAmount)}`)
  if (totals.igstAmount) lines.push(`IGST (${data.taxRate}%): ${money(totals.igstAmount)}`)
  if (!totals.cgstAmount && !totals.igstAmount && totals.taxAmount) {
    lines.push(`${data.taxLabel} (${data.taxRate}%): ${money(totals.taxAmount)}`)
  }
  lines.push(`Total: ${money(totals.total)}`)

  return lines.join("\n")
}
