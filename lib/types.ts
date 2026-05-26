export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

export interface InvoiceData {
  businessName: string
  businessTagline: string
  logoUrl: string | null
  businessAddress: string
  businessEmail: string
  businessPhone: string
  clientName: string
  clientAddress: string
  clientEmail: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  lineItems: LineItem[]
  taxRate: number
  discountRate: number
  currency: string
  notes: string
  paymentTerms: string
}

export interface InvoiceTotals {
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
}
