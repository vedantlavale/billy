import type { InvoiceData, InvoiceOptions, LineItem } from "./types"

type Loose = Record<string, unknown>

const STRING_FIELDS = [
  "businessName",
  "businessTagline",
  "businessAddress",
  "businessEmail",
  "businessPhone",
  "gstin",
  "clientName",
  "clientAddress",
  "clientEmail",
  "poNumber",
  "invoiceNumber",
  "invoiceDate",
  "dueDate",
  "taxLabel",
  "currency",
  "notes",
  "paymentTerms",
  "bankName",
  "bankAccount",
  "bankIfsc",
  "reverseChargeLabel",
  "templateId",
] as const satisfies readonly (keyof InvoiceData)[]

const NUMBER_FIELDS = ["taxRate", "discountRate"] as const satisfies readonly (keyof InvoiceData)[]

function isObject(value: unknown): value is Loose {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback
}

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

/**
 * Coerce untrusted JSON (a shared link, an old draft) onto a complete
 * `InvoiceData`. Anything missing or of the wrong type falls back to `base`,
 * so the editor never receives a shape it can't render. Returns null when
 * `raw` isn't an object at all.
 */
export function normalizeInvoiceData(raw: unknown, base: InvoiceData): InvoiceData | null {
  if (!isObject(raw)) return null

  const out: InvoiceData = { ...base, options: { ...base.options } }

  for (const field of STRING_FIELDS) out[field] = str(raw[field], base[field])
  for (const field of NUMBER_FIELDS) out[field] = num(raw[field], base[field])

  out.logoUrl = typeof raw.logoUrl === "string" ? raw.logoUrl : null
  out.stampUrl = typeof raw.stampUrl === "string" ? raw.stampUrl : null

  if (isObject(raw.options)) {
    for (const key of Object.keys(base.options) as (keyof InvoiceOptions)[]) {
      const value = raw.options[key]
      if (typeof value === "boolean") out.options[key] = value
    }
  }

  if (Array.isArray(raw.lineItems)) {
    out.lineItems = raw.lineItems.filter(isObject).map(
      (item, index): LineItem => ({
        id: str(item.id, "") || `item-${index + 1}`,
        description: str(item.description, ""),
        hsnCode: str(item.hsnCode, ""),
        quantity: num(item.quantity, 1),
        rate: num(item.rate, 0),
      }),
    )
  }

  return out
}
