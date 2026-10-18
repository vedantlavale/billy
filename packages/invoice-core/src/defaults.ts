import type { InvoiceData, LineItem } from "./types"
import { firstInvoiceNumber } from "./numbering"

/** A calendar date as the editor stores it: `YYYY-MM-DD`. */
export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** `date` moved by whole days, as a `YYYY-MM-DD` string. */
export function addDays(date: string, days: number): string {
  const next = new Date(`${date}T00:00:00Z`)
  next.setUTCDate(next.getUTCDate() + days)
  return toDateString(next)
}

/** The sample invoice a brand-new editor opens with. */
export function createDefaultInvoice(today: Date = new Date()): InvoiceData {
  const issued = toDateString(today)

  return {
    businessName: "Your Company",
    businessTagline: "Design & Product Studio",
    logoUrl: null,
    businessAddress: "123 Market Street\nSan Francisco, CA 94103",
    businessEmail: "hello@yourcompany.com",
    businessPhone: "+1 (555) 555-5555",
    gstin: "",
    clientName: "Acme Corp",
    clientAddress: "456 Mission Avenue\nSan Francisco, CA 94105",
    clientEmail: "finance@acme.com",
    poNumber: "",
    invoiceNumber: firstInvoiceNumber(today),
    invoiceDate: issued,
    dueDate: addDays(issued, 7),
    lineItems: [
      {
        id: "item-1",
        description: "Website redesign",
        hsnCode: "",
        quantity: 1,
        rate: 1200,
      },
      {
        id: "item-2",
        description: "Brand guidelines",
        hsnCode: "",
        quantity: 1,
        rate: 650,
      },
    ],
    taxRate: 8.25,
    taxLabel: "Tax",
    discountRate: 0,
    currency: "INR",
    templateId: "clean",
    stampUrl: null,
    notes: "Thank you for your business. Please reach out if you have any questions.",
    paymentTerms: "Payment due within 7 days via bank transfer or card.",
    bankName: "",
    bankAccount: "",
    bankIfsc: "",
    reverseChargeLabel: "Reverse charge applicable",
    options: {
      showGSTIN: false,
      showHSNCode: false,
      showCGST: false,
      showSGST: false,
      showIGST: false,
      showReverseCharge: false,
      showPONumber: false,
      showBankDetails: false,
      showDigitalStamp: false,
    },
  }
}

/**
 * An invoice with nothing filled in. Shared links store only what differs
 * from this, so it must never change once links are out in the world: add
 * new fields, but don't change what these ones hold.
 */
export function createBlankInvoice(): InvoiceData {
  return {
    businessName: "",
    businessTagline: "",
    logoUrl: null,
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
    gstin: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    poNumber: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    lineItems: [],
    taxRate: 0,
    taxLabel: "Tax",
    discountRate: 0,
    currency: "INR",
    templateId: "clean",
    stampUrl: null,
    notes: "",
    paymentTerms: "",
    bankName: "",
    bankAccount: "",
    bankIfsc: "",
    reverseChargeLabel: "Reverse charge applicable",
    options: {
      showGSTIN: false,
      showHSNCode: false,
      showCGST: false,
      showSGST: false,
      showIGST: false,
      showReverseCharge: false,
      showPONumber: false,
      showBankDetails: false,
      showDigitalStamp: false,
    },
  }
}

export function createLineItem(id: string): LineItem {
  return {
    id,
    description: "New line item",
    hsnCode: "",
    quantity: 1,
    rate: 0,
  }
}
