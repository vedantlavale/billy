import { describe, expect, test } from "bun:test"

import { calculateTotals } from "./invoice"
import type { InvoiceData } from "./types"

const base: InvoiceData = {
  businessName: "", businessTagline: "", logoUrl: null, businessAddress: "", businessEmail: "", businessPhone: "", gstin: "",
  clientName: "", clientAddress: "", clientEmail: "", poNumber: "", invoiceNumber: "INV-1", invoiceDate: "2026-01-01", dueDate: "2026-01-08",
  lineItems: [
    { id: "a", description: "A", hsnCode: "", quantity: 2, rate: 3000 },
    { id: "b", description: "B", hsnCode: "", quantity: 1, rate: 4000 },
  ],
  taxRate: 18, taxLabel: "GST", discountRate: 0, currency: "INR", templateId: "clean", stampUrl: null,
  notes: "", paymentTerms: "", bankName: "", bankAccount: "", bankIfsc: "", reverseChargeLabel: "",
  options: { showGSTIN: false, showHSNCode: false, showCGST: false, showSGST: false, showIGST: false, showReverseCharge: false, showPONumber: false, showBankDetails: false, showDigitalStamp: false },
}

const withOptions = (o: Partial<InvoiceData["options"]>, extra: Partial<InvoiceData> = {}): InvoiceData =>
  ({ ...base, ...extra, options: { ...base.options, ...o } })

describe("calculateTotals", () => {
  test("single tax, no discount", () => {
    const t = calculateTotals(base)
    expect(t.subtotal).toBe(10000)
    expect(t.taxAmount).toBe(1800)
    expect(t.total).toBe(11800)
  })

  test("discount is applied before tax", () => {
    const t = calculateTotals({ ...base, discountRate: 10 })
    expect(t.discountAmount).toBe(1000)
    expect(t.taxAmount).toBe(1620) // 18% of 9000, not of 10000
    expect(t.total).toBe(10620)
  })

  test("CGST + SGST split the rate evenly on the taxable value", () => {
    const t = calculateTotals(withOptions({ showCGST: true, showSGST: true }, { discountRate: 10 }))
    expect(t.cgstAmount).toBe(810)
    expect(t.sgstAmount).toBe(810)
    expect(t.igstAmount).toBe(0)
    expect(t.taxAmount).toBe(1620)
    expect(t.total).toBe(10620)
  })

  test("IGST charges the full rate on the taxable value", () => {
    const t = calculateTotals(withOptions({ showIGST: true }, { discountRate: 10 }))
    expect(t.igstAmount).toBe(1620)
    expect(t.cgstAmount).toBe(0)
    expect(t.total).toBe(10620)
  })

  test("IGST and CGST/SGST give the same total for the same invoice", () => {
    const intra = calculateTotals(withOptions({ showCGST: true, showSGST: true }))
    const inter = calculateTotals(withOptions({ showIGST: true }))
    expect(intra.total).toBe(inter.total)
  })

  test("empty invoice is all zeros", () => {
    const t = calculateTotals({ ...base, lineItems: [] })
    expect(t.total).toBe(0)
  })
})
