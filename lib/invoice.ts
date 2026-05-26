import type { InvoiceData, InvoiceTotals, LineItem } from "@/lib/types"

const DEFAULT_DECIMALS = 2

export function formatNumber(value: number, decimals = DEFAULT_DECIMALS) {
  if (!Number.isFinite(value)) {
    return "0"
  }

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCurrency(
  value: number,
  currency: string,
  decimals = DEFAULT_DECIMALS
) {
  if (!Number.isFinite(value)) {
    return `${currency}0`
  }

  const sign = value < 0 ? "-" : ""
  const formatted = formatNumber(Math.abs(value), decimals)
  return `${sign}${currency}${formatted}`
}

export function formatPercent(value: number, decimals = DEFAULT_DECIMALS) {
  if (!Number.isFinite(value)) {
    return "0%"
  }

  return `${formatNumber(value, decimals)}%`
}

export function calculateLineItemAmount(item: LineItem) {
  return item.quantity * item.rate
}

export function calculateTotals(data: InvoiceData): InvoiceTotals {
  const subtotal = data.lineItems.reduce((sum, item) => {
    return sum + calculateLineItemAmount(item)
  }, 0)

  const taxAmount = (subtotal * data.taxRate) / 100
  const discountAmount = (subtotal * data.discountRate) / 100
  const total = subtotal + taxAmount - discountAmount

  return {
    subtotal,
    taxAmount,
    discountAmount,
    total,
  }
}
