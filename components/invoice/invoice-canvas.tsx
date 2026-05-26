'use client'

import * as React from "react"

import { ClientSection } from "@/components/invoice/client-section"
import { FooterSection } from "@/components/invoice/footer-section"
import { HeaderSection } from "@/components/invoice/header-section"
import { LineItemsTable } from "@/components/invoice/line-items-table"
import { MetaSection } from "@/components/invoice/meta-section"
import { TotalsSection } from "@/components/invoice/totals-section"

export const invoiceCanvasId = "invoice-canvas"

export function InvoiceCanvas() {
  return (
    <section
      id={invoiceCanvasId}
      className="invoice-canvas w-full min-w-[720px] max-w-5xl rounded-lg border bg-white px-10 py-12"
    >
      <div className="space-y-8">
        <HeaderSection />
        <ClientSection />
        <MetaSection />
        <LineItemsTable />
        <TotalsSection />
        <FooterSection />
      </div>
    </section>
  )
}
