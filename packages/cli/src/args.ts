import type { InvoiceInput } from "@billy/invoice-core/agent"

/** Flags `billy new` accepts, as parsed by `node:util` parseArgs. */
export interface NewFlags {
  to?: string
  "to-email"?: string
  "to-address"?: string
  item?: string[]
  currency?: string
  tax?: string
  "tax-label"?: string
  gst?: string
  discount?: string
  number?: string
  date?: string
  due?: string
  po?: string
  notes?: string
  terms?: string
  template?: string
}

function toNumber(value: string, flag: string): number {
  const n = Number(value)
  if (!Number.isFinite(n)) throw new Error(`--${flag} needs a number, got "${value}"`)
  return n
}

/**
 * One `--item`: "Description:quantity:rate" or "Description:rate". Numbers
 * are read from the right, so descriptions may contain colons.
 */
export function parseItem(value: string): InvoiceInput["items"][number] {
  const parts = value.split(":")
  const numeric = (s: string | undefined) => s !== undefined && s.trim() !== "" && Number.isFinite(Number(s))

  if (parts.length >= 3 && numeric(parts.at(-1)) && numeric(parts.at(-2))) {
    return {
      description: parts.slice(0, -2).join(":").trim(),
      quantity: Number(parts.at(-2)),
      rate: Number(parts.at(-1)),
    }
  }
  if (parts.length >= 2 && numeric(parts.at(-1))) {
    return { description: parts.slice(0, -1).join(":").trim(), rate: Number(parts.at(-1)) }
  }
  throw new Error(`--item "${value}" should look like "Design:12:80" (description:quantity:rate) or "Logo:400"`)
}

/** `--due` as either a number of days or a YYYY-MM-DD date. */
function parseDue(value: string): Partial<Pick<InvoiceInput, "dueDate" | "dueInDays">> {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { dueDate: value }
  const days = Number(value.replace(/d(ays?)?$/i, ""))
  if (Number.isInteger(days) && days >= 0) return { dueInDays: days }
  throw new Error(`--due should be a number of days (14) or a date (2026-10-10), got "${value}"`)
}

/** Turn `billy new` flags into agent-style input. Unset flags stay unset. */
export function flagsToInput(flags: NewFlags): Partial<InvoiceInput> {
  const input: Partial<InvoiceInput> = {}

  if (flags.to || flags["to-email"] || flags["to-address"]) {
    input.to = {
      name: flags.to ?? "",
      ...(flags["to-email"] ? { email: flags["to-email"] } : {}),
      ...(flags["to-address"] ? { address: flags["to-address"].replaceAll("\\n", "\n") } : {}),
    }
  }
  if (flags.item?.length) input.items = flags.item.map(parseItem)
  if (flags.currency) input.currency = flags.currency
  if (flags.tax) input.taxRate = toNumber(flags.tax, "tax")
  if (flags["tax-label"]) input.taxLabel = flags["tax-label"]
  if (flags.gst) {
    if (flags.gst !== "cgst_sgst" && flags.gst !== "igst") throw new Error(`--gst is cgst_sgst or igst, got "${flags.gst}"`)
    input.gst = flags.gst
  }
  if (flags.discount) input.discountRate = toNumber(flags.discount, "discount")
  if (flags.number) input.invoiceNumber = flags.number
  if (flags.date) input.issueDate = flags.date
  if (flags.due) Object.assign(input, parseDue(flags.due))
  if (flags.po) input.poNumber = flags.po
  if (flags.notes) input.notes = flags.notes
  if (flags.terms) input.paymentTerms = flags.terms
  if (flags.template) input.templateId = flags.template

  return input
}
