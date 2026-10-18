import { z } from "zod"

import { CURRENCIES } from "../currencies"
import { addDays, createDefaultInvoice, toDateString } from "../defaults"
import { applyProfessionPreset, professionPresets } from "../presets"
import { SELECTABLE_TEMPLATES } from "../templates"
import type { InvoiceData } from "../types"

/*
 * The invoice shape agents fill in. It is nested and forgiving where
 * `InvoiceData` is flat and complete: an agent sends what the user said, and
 * `toInvoiceData` supplies everything else.
 */

const currencyCodes = CURRENCIES.map((c) => c.code) as [string, ...string[]]
const templateIds = SELECTABLE_TEMPLATES.map((t) => t.id) as [string, ...string[]]
const presetIds = Object.keys(professionPresets) as [
  keyof typeof professionPresets,
  ...(keyof typeof professionPresets)[],
]

const text = (description: string) => z.string().trim().max(2000).describe(description)
const date = (description: string) => z.iso.date().describe(`${description} (YYYY-MM-DD)`)

export const invoiceInputSchema = z.object({
  from: z
    .object({
      name: text("Business or freelancer name"),
      tagline: text("Short line under the name, e.g. 'Brand & Web Design'"),
      email: text("Sender email"),
      phone: text("Sender phone"),
      address: text("Sender address; use \\n between lines"),
      gstin: text("Indian GSTIN. Only for GST invoices"),
    })
    .partial()
    .optional()
    .describe("The person or business sending the invoice (the user)"),
  to: z
    .object({
      name: text("Client name or company").min(1),
      email: text("Client email").optional(),
      address: text("Client address; use \\n between lines").optional(),
    })
    .describe("The client being billed"),
  items: z
    .array(
      z.object({
        description: text("What was delivered").min(1),
        quantity: z.number().positive().default(1).describe("Hours, units, etc. Defaults to 1"),
        rate: z.number().min(0).describe("Price per unit, in the invoice currency"),
        hsnCode: text("HSN/SAC code, for Indian GST invoices").optional(),
      }),
    )
    .min(1)
    .max(100)
    .describe("Line items"),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .refine((code) => currencyCodes.includes(code), {
      message: `Unsupported currency. Use one of: ${currencyCodes.join(", ")}`,
    })
    .describe(`ISO currency code. Supported: ${currencyCodes.join(", ")}`),
  taxRate: z.number().min(0).max(100).optional().describe("Tax percent, e.g. 18. Defaults to 0"),
  taxLabel: text("Tax name shown on the invoice, e.g. 'VAT', 'GST', 'Sales tax'").optional(),
  gst: z
    .enum(["cgst_sgst", "igst"])
    .optional()
    .describe(
      "Indian GST split. cgst_sgst halves taxRate into CGST and SGST (same state); igst charges it as IGST (other state)",
    ),
  discountRate: z.number().min(0).max(100).optional().describe("Discount percent off the subtotal"),
  invoiceNumber: text("Invoice number, e.g. INV-042. Generated from the date if omitted").optional(),
  issueDate: date("Issue date. Defaults to today").optional(),
  dueDate: date("Due date").optional(),
  dueInDays: z.number().int().min(0).max(365).optional().describe("Due this many days after the issue date. Defaults to 7"),
  poNumber: text("Client purchase order number").optional(),
  notes: text("Note to the client, e.g. a thank-you").optional(),
  paymentTerms: text("Payment terms or instructions").optional(),
  bank: z
    .object({
      name: text("Bank name"),
      account: text("Account number or IBAN"),
      ifsc: text("IFSC, SWIFT or routing code"),
    })
    .partial()
    .optional()
    .describe("Bank details for payment"),
  templateId: z.enum(templateIds).optional().describe(`Design. One of: ${templateIds.join(", ")}. Defaults to clean`),
  preset: z
    .enum(presetIds)
    .optional()
    .describe("Profession preset that sets which sections show: freelancer, gst_vendor, agency, consultant, other"),
})

export type InvoiceInput = z.input<typeof invoiceInputSchema>
type ParsedInput = z.output<typeof invoiceInputSchema>

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000)
}

/** Turn validated agent input into the complete invoice the editor renders. */
export function toInvoiceData(input: ParsedInput, today: Date = new Date()): InvoiceData {
  const base = createDefaultInvoice(today)
  const issueDate = input.issueDate ?? toDateString(today)
  const dueDate = input.dueDate ?? addDays(issueDate, input.dueInDays ?? 7)
  const dueIn = daysBetween(issueDate, dueDate)
  const from = input.from ?? {}
  const bank = input.bank ?? {}

  let data: InvoiceData = {
    ...base,
    businessName: from.name ?? "",
    businessTagline: from.tagline ?? "",
    businessAddress: from.address ?? "",
    businessEmail: from.email ?? "",
    businessPhone: from.phone ?? "",
    gstin: from.gstin ?? "",
    clientName: input.to.name,
    clientAddress: input.to.address ?? "",
    clientEmail: input.to.email ?? "",
    poNumber: input.poNumber ?? "",
    invoiceNumber: input.invoiceNumber || `INV-${issueDate.replaceAll("-", "")}`,
    invoiceDate: issueDate,
    dueDate,
    lineItems: input.items.map((item, index) => ({
      id: `item-${index + 1}`,
      description: item.description,
      hsnCode: item.hsnCode ?? "",
      quantity: item.quantity,
      rate: item.rate,
    })),
    taxRate: input.taxRate ?? 0,
    discountRate: input.discountRate ?? 0,
    currency: input.currency,
    templateId: input.templateId ?? "clean",
    notes: input.notes ?? "Thank you for your business.",
    paymentTerms:
      input.paymentTerms ?? (dueIn <= 0 ? "Payment due on receipt." : `Payment due within ${dueIn} days.`),
    bankName: bank.name ?? "",
    bankAccount: bank.account ?? "",
    bankIfsc: bank.ifsc ?? "",
  }

  data = applyProfessionPreset(data, input.preset ?? (input.gst ? "gst_vendor" : "freelancer"))

  const hasBank = Boolean(bank.name || bank.account || bank.ifsc)
  const gst = input.gst
  data.options = {
    ...data.options,
    showCGST: gst === "cgst_sgst",
    showSGST: gst === "cgst_sgst",
    showIGST: gst === "igst",
    showGSTIN: Boolean(data.gstin),
    showHSNCode: data.lineItems.some((item) => item.hsnCode),
    showPONumber: Boolean(data.poNumber),
    showBankDetails: hasBank,
    // An agent can't attach a stamp image, and reverse charge is a legal
    // declaration the user should switch on deliberately in the editor.
    showDigitalStamp: false,
    showReverseCharge: false,
  }
  data.taxLabel = input.taxLabel ?? (gst ? "GST" : data.taxLabel)

  return data
}

export type ParseResult =
  | { ok: true; data: InvoiceData; warnings: string[] }
  | { ok: false; errors: string[] }

/** Validate raw agent input and build the invoice, or explain what's wrong. */
export function parseInvoiceInput(raw: unknown, today?: Date): ParseResult {
  const parsed = invoiceInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => {
        const path = issue.path.join(".")
        return path ? `${path}: ${issue.message}` : issue.message
      }),
    }
  }

  const input = parsed.data
  const warnings: string[] = []
  if (!input.from?.name) warnings.push("No sender name, so the invoice doesn't say who it's from.")
  if (!input.from?.email) warnings.push("No sender email, so the client won't know where to reply.")
  if (input.dueDate && input.dueInDays !== undefined) warnings.push("Both dueDate and dueInDays were given; used dueDate.")
  if (input.issueDate && input.dueDate && input.dueDate < input.issueDate) {
    warnings.push("The due date is before the issue date.")
  }

  return { ok: true, data: toInvoiceData(input, today), warnings }
}
