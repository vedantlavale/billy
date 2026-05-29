import { generatePdf } from "../lib/pdf/generate"
import type { InvoiceData } from "../lib/types"
import fs from "fs"
import path from "path"

const mockData: InvoiceData = {
  businessName: "Your Company",
  businessTagline: "Design & Product Studio",
  logoUrl: null,
  businessAddress: "123 Market Street\nSan Francisco, CA 94103",
  businessEmail: "hello@yourcompany.com",
  businessPhone: "+1 (555) 555-5555",
  gstin: "123456789",
  clientName: "Acme Corp",
  clientAddress: "456 Mission Avenue\nSan Francisco, CA 94105",
  clientEmail: "finance@acme.com",
  poNumber: "",
  invoiceNumber: "INV-1024",
  invoiceDate: "2026-05-29",
  dueDate: "2026-06-05",
  lineItems: [
    { id: "1", description: "Website redesign", hsnCode: "", quantity: 1, rate: 1200 },
    { id: "2", description: "Brand guidelines", hsnCode: "", quantity: 1, rate: 650 },
  ],
  taxRate: 8.25,
  taxLabel: "Tax",
  discountRate: 0,
  currency: "INR", // Test Rupee symbol ₹
  notes: "Thank you for your business. Please reach out if you have any questions.",
  paymentTerms: "Payment due within 7 days via bank transfer or card.",
  bankName: "",
  bankAccount: "",
  bankIfsc: "",
  reverseChargeLabel: "",
  templateId: "modern-green",
  stampUrl: null,
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
  }
}

async function run() {
  console.log("Generating PDF...")
  try {
    const pdfBuffer = await generatePdf(mockData)
    const outPath = path.join(process.cwd(), "test-invoice.pdf")
    fs.writeFileSync(outPath, pdfBuffer)
    console.log("PDF generated successfully at:", outPath)
  } catch (err) {
    console.error("Failed to generate PDF:", err)
  }
}

run()
