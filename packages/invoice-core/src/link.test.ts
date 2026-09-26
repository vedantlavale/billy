import { describe, expect, test } from "bun:test"

import { parseInvoiceInput } from "./agent"
import { calculateTotals } from "./invoice"
import { buildInvoiceLink, decodeInvoicePayload, encodeInvoicePayload, readInvoiceFromHash } from "./link"

const today = new Date("2026-09-26T10:00:00Z")

function build(raw: unknown) {
  const result = parseInvoiceInput(raw, today)
  if (!result.ok) throw new Error(result.errors.join("; "))
  return result
}

const designWork = {
  from: { name: "Vedant Studio", email: "hi@vedant.studio", address: "Pune\nIndia" },
  to: { name: "Acme Corp", email: "ap@acme.com" },
  items: [{ description: "Design", quantity: 12, rate: 80 }],
  currency: "usd",
  dueInDays: 14,
}

describe("parseInvoiceInput", () => {
  test("fills in dates, number and terms from what the user said", () => {
    const { data, warnings } = build(designWork)
    expect(data.currency).toBe("USD")
    expect(data.invoiceDate).toBe("2026-09-26")
    expect(data.dueDate).toBe("2026-10-10")
    expect(data.invoiceNumber).toBe("INV-20260926")
    expect(data.paymentTerms).toBe("Payment due within 14 days.")
    expect(data.businessAddress).toBe("Pune\nIndia")
    expect(data.taxRate).toBe(0)
    expect(calculateTotals(data).total).toBe(960)
    expect(warnings).toEqual([])
  })

  test("never carries the editor's sample content", () => {
    const { data } = build({ to: { name: "Acme" }, items: [{ description: "Work", rate: 10 }], currency: "INR" })
    expect(data.businessName).toBe("")
    expect(data.clientAddress).toBe("")
    expect(data.lineItems).toHaveLength(1)
  })

  test("GST split turns on the matching columns", () => {
    const { data } = build({
      ...designWork,
      currency: "INR",
      taxRate: 18,
      gst: "cgst_sgst",
      from: { ...designWork.from, gstin: "27ABCDE1234F1Z5" },
      items: [{ description: "Design", quantity: 1, rate: 1000, hsnCode: "998391" }],
    })
    expect(data.options.showCGST && data.options.showSGST && !data.options.showIGST).toBe(true)
    expect(data.options.showGSTIN && data.options.showHSNCode).toBe(true)
    expect(data.taxLabel).toBe("GST")
    const totals = calculateTotals(data)
    expect(totals.cgstAmount).toBe(90)
    expect(totals.total).toBe(1180)
  })

  test("rejects input it can't turn into an invoice, saying where", () => {
    const result = parseInvoiceInput({ to: { name: "" }, items: [], currency: "XYZ" })
    expect(result.ok).toBe(false)
    if (result.ok) return
    const joined = result.errors.join("\n")
    expect(joined).toContain("to.name")
    expect(joined).toContain("items")
    expect(joined).toContain("currency")
  })

  test("warns when the sender is unknown", () => {
    const { warnings } = build({ ...designWork, from: undefined })
    expect(warnings.some((w) => w.includes("sender name"))).toBe(true)
  })
})

describe("invoice links", () => {
  test("round-trip through the URL hash", () => {
    const { data } = build(designWork)
    const link = buildInvoiceLink(data)
    expect(link.startsWith("https://trybilly.tech/editor#i=1.")).toBe(true)

    const decoded = readInvoiceFromHash(new URL(link).hash)
    expect(decoded).toEqual({ ok: true, data })
  })

  test("survive percent-encoding by a chat app", () => {
    const { data } = build(designWork)
    const payload = encodeInvoicePayload(data)
    const decoded = readInvoiceFromHash(`#i=${encodeURIComponent(payload)}`)
    expect(decoded?.ok).toBe(true)
  })

  test("report a single changed character as damaged", () => {
    const payload = encodeInvoicePayload(build(designWork).data)
    const at = payload.length - 10
    const flipped = payload.slice(0, at) + (payload[at] === "A" ? "B" : "A") + payload.slice(at + 1)
    expect(decodeInvoicePayload(flipped)).toEqual({ ok: false, reason: "damaged" })
    expect(decodeInvoicePayload(payload.slice(0, -20))).toEqual({ ok: false, reason: "damaged" })
  })

  test("reject an unknown version and ignore hashes without an invoice", () => {
    expect(decodeInvoicePayload("9.abc.def")).toEqual({ ok: false, reason: "unsupported" })
    expect(readInvoiceFromHash("")).toBeNull()
    expect(readInvoiceFromHash("#section")).toBeNull()
  })

  test("leave images out of the link", () => {
    const { data } = build(designWork)
    const payload = encodeInvoicePayload({ ...data, logoUrl: `data:image/png;base64,${"A".repeat(50_000)}` })
    expect(payload.length).toBeLessThan(1500)
  })

  test("stay short for a 30-line invoice", () => {
    const items = Array.from({ length: 30 }, (_, i) => ({
      description: `Consulting session ${i + 1}: roadmap review and follow-up notes`,
      quantity: (i % 5) + 1,
      rate: 120 + i * 7.5,
    }))
    const link = buildInvoiceLink(build({ ...designWork, items }).data)
    console.log(`30-line link: ${link.length} chars; 1-line link: ${buildInvoiceLink(build(designWork).data).length} chars`)
    expect(link.length).toBeLessThan(4000)
  })
})
