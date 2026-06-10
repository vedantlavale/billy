import * as React from "react"
import { Document, Font } from "@react-pdf/renderer"
import path from "path"
import type { InvoiceData } from "@/lib/types"
import { CleanPage } from "./templates/clean"
import { MinimalTealPage } from "./templates/minimal-teal"
import { ModernGreenPage } from "./templates/modern-green"
import { CorporateBluePage } from "./templates/corporate-blue"

// ─── Font registration ────────────────────────────────────────────────────────
const fp = (f: string) => path.join(process.cwd(), "public", "fonts", f)

Font.register({
  family: "SourceSans3",
  fonts: [
    { src: fp("SourceSans3-400.ttf"), fontWeight: 400 },
    { src: fp("SourceSans3-600.ttf"), fontWeight: 600 },
    { src: fp("SourceSans3-700.ttf"), fontWeight: 700 },
  ],
})
Font.register({
  family: "Montserrat",
  fonts: [
    { src: fp("Montserrat-400.ttf"), fontWeight: 400 },
    { src: fp("Montserrat-500.ttf"), fontWeight: 500 },
    { src: fp("Montserrat-700.ttf"), fontWeight: 700 },
  ],
})
Font.register({
  family: "Outfit",
  fonts: [
    { src: fp("Outfit-400.ttf"), fontWeight: 400 },
    { src: fp("Outfit-500.ttf"), fontWeight: 500 },
    { src: fp("Outfit-700.ttf"), fontWeight: 700 },
  ],
})
Font.register({
  family: "Inter",
  fonts: [
    { src: fp("Inter-400.ttf"), fontWeight: 400 },
    { src: fp("Inter-500.ttf"), fontWeight: 500 },
    { src: fp("Inter-700.ttf"), fontWeight: 700 },
  ],
})
Font.register({
  family: "InstrumentSerif",
  fonts: [
    { src: fp("InstrumentSerif-400.ttf"), fontWeight: 400 },
    { src: fp("InstrumentSerif-400Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
  ],
})

/**
 * Root PDF Invoice renderer that maps design templates to corresponding render layouts.
 */
export function InvoicePDF({ data }: { data: InvoiceData }) {
  let page: React.ReactElement

  switch (data.templateId) {
    case "modern-green":
      page = <ModernGreenPage data={data} />
      break
    case "minimal-teal":
      page = <MinimalTealPage data={data} />
      break
    case "corporate-blue":
      page = <CorporateBluePage data={data} />
      break
    default:
      page = <CleanPage data={data} />
  }

  return <Document>{page}</Document>
}
