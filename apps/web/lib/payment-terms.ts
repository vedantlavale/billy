/** Payment-term quick picks: the due date is the issue date plus N days. */
export const PAYMENT_TERMS = [
  { days: 0, label: "On receipt" },
  { days: 7, label: "Net 7" },
  { days: 15, label: "Net 15" },
  { days: 30, label: "Net 30" },
] as const

/** `iso` (YYYY-MM-DD) plus `days`, computed in UTC so DST never shifts it. */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  const date = new Date(Date.UTC(y, m - 1, d + days))
  return date.toISOString().slice(0, 10)
}

/** The quick-pick matching the current dates, or undefined for a custom date. */
export function currentTermDays(invoiceDate: string, dueDate: string): number | undefined {
  return PAYMENT_TERMS.find((term) => addDays(invoiceDate, term.days) === dueDate)?.days
}
