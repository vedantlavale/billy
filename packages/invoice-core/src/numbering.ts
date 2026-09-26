/**
 * The number a fresh draft starts with: INV-<year>-001. Scoping the sequence
 * to the year keeps numbers short and unique per year, which is also what GST
 * invoicing expects.
 */
export function firstInvoiceNumber(date: Date = new Date()): string {
  return `INV-${date.getFullYear()}-001`
}

/**
 * The number that follows `current`, keeping any prefix and zero padding:
 * INV-2026-001 → INV-2026-002, 2026/009 → 2026/010. A number with no trailing
 * digits gets one ("Draft" → "Draft-2"), and an empty one starts a new
 * sequence, so a new invoice never silently reuses an earlier number.
 */
export function nextInvoiceNumber(current: string, date: Date = new Date()): string {
  const trimmed = current.trim()
  if (!trimmed) return firstInvoiceNumber(date)
  const match = trimmed.match(/^(.*?)(\d+)$/)
  if (!match) return `${trimmed}-2`
  const [, prefix, digits] = match
  const next = String(Number(digits) + 1).padStart(digits.length, "0")
  return `${prefix}${next}`
}
