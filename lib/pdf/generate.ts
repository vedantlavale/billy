import { renderToBuffer } from "@react-pdf/renderer"
import * as React from "react"
import { InvoicePDF } from "./invoice-pdf"
import type { InvoiceData } from "@/lib/types"

export async function generatePdf(data: InvoiceData): Promise<Buffer> {
  const buffer = await renderToBuffer(React.createElement(InvoicePDF, { data }) as any)
  return Buffer.from(buffer)
}
