'use client'

import * as React from "react"

import { InvoiceCanvas } from "@/components/invoice/invoice-canvas"
import { InvoiceProvider } from "@/components/invoice/invoice-context"
import { Toolbar } from "@/components/invoice/toolbar"

export default function InvoiceEditor() {
  return (
    <InvoiceProvider>
      <div className="invoice-editor min-h-screen bg-invoice-canvas px-4 pb-20 pt-10">
        <Toolbar />
        <div className="mx-auto mt-8 flex w-full max-w-6xl justify-center">
          <div className="w-full overflow-x-auto px-1 pb-4">
            <InvoiceCanvas />
          </div>
        </div>
      </div>
    </InvoiceProvider>
  )
}
