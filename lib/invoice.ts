import type { InvoiceData, InvoiceTotals, LineItem } from "@/lib/types"
import { getCurrency, getCurrencyLocale, getCurrencySymbol } from "@/lib/currencies"

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
    return `${getCurrencySymbol(currency)}0`
  }

  try {
    const locale = getCurrencyLocale(currency)
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  } catch {
    const sign = value < 0 ? "-" : ""
    const formatted = formatNumber(Math.abs(value), decimals)
    return `${sign}${getCurrencySymbol(currency)}${formatted}`
  }
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

  const gstEnabled =
    data.options.showCGST ||
    data.options.showSGST ||
    data.options.showIGST

  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0
  let taxAmount = 0

  if (gstEnabled) {
    if (data.options.showIGST) {
      igstAmount = (subtotal * data.taxRate) / 100
    } else {
      cgstAmount = (subtotal * data.taxRate) / 200
      sgstAmount = (subtotal * data.taxRate) / 200
    }
    taxAmount = cgstAmount + sgstAmount + igstAmount
  } else {
    taxAmount = (subtotal * data.taxRate) / 100
  }

  const discountAmount = (subtotal * data.discountRate) / 100
  const total = subtotal + taxAmount - discountAmount

  return {
    subtotal,
    taxAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    discountAmount,
    total,
  }
}
