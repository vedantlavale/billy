import type { Metadata } from "next"
import InvoiceEditor from "@/components/invoice/invoice-editor"

export const metadata: Metadata = {
  title: "Free Invoice Editor — No Sign-up, No Watermark | Billy",
  description:
    "Edit an invoice like a document in your browser and download a print-ready PDF. No sign-up, no watermark, nothing uploaded.",
  alternates: { canonical: "/editor" },
}

export default function EditorPage() {
  return <InvoiceEditor />
}
