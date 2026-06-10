import { renderToBuffer } from "@react-pdf/renderer"
import * as React from "react"
import { InvoicePDF } from "./invoice-pdf"
import type { InvoiceData } from "@/lib/types"

/**
 * Renders an invoice template to a PDF Buffer.
 * Wraps rendering inside a 15-second clearable timeout to prevent resource hangs.
 */
export async function generatePdf(data: InvoiceData): Promise<Buffer> {
  let timeoutId: NodeJS.Timeout | undefined

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("PDF generation timed out after 15 seconds")), 15000)
  })

  try {
    const renderPromise = renderToBuffer(React.createElement(InvoicePDF, { data }) as any)
    const buffer = await Promise.race([renderPromise, timeoutPromise])
    return Buffer.from(buffer)
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}
