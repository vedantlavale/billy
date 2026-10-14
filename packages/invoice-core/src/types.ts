export interface LineItem {
  id: string
  description: string
  hsnCode: string
  quantity: number
  rate: number
}

export interface InvoiceOptions {
  showGSTIN: boolean
  showHSNCode: boolean
  showCGST: boolean
  showSGST: boolean
  showIGST: boolean
  showReverseCharge: boolean
  showPONumber: boolean
  showBankDetails: boolean
  showDigitalStamp: boolean
}

export interface InvoiceData {
  /** Set once the invoice has been persisted; absent for a brand-new draft. */
  id?: string
  businessName: string
  businessTagline: string
  logoUrl: string | null
  businessAddress: string
  businessEmail: string
  businessPhone: string
  gstin: string
  clientName: string
  clientAddress: string
  clientEmail: string
  poNumber: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  lineItems: LineItem[]
  taxRate: number
  taxLabel: string
  discountRate: number
  currency: string
  notes: string
  paymentTerms: string
  bankName: string
  bankAccount: string
  bankIfsc: string
  reverseChargeLabel: string
  templateId: string
  stampUrl: string | null
  options: InvoiceOptions
}

export interface InvoiceTotals {
  subtotal: number
  taxAmount: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  discountAmount: number
  total: number
}
