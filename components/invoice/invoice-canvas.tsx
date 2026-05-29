'use client'

import * as React from "react"

import { ClientSection } from "@/components/invoice/client-section"
import { FooterSection } from "@/components/invoice/footer-section"
import { HeaderSection } from "@/components/invoice/header-section"
import { LineItemsTable } from "@/components/invoice/line-items-table"
import { MetaSection } from "@/components/invoice/meta-section"
import { OptionsPanel } from "@/components/invoice/OptionsPanel"
import { ProfessionPreset } from "@/components/invoice/ProfessionPreset"
import { TotalsSection } from "@/components/invoice/totals-section"
import { useInvoiceState } from "@/components/invoice/invoice-context"

export const invoiceCanvasId = "invoice-canvas"

export function InvoiceCanvas() {
  const state = useInvoiceState()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const innerRef = React.useRef<HTMLElement>(null)
  const [scale, setScale] = React.useState(1)
  const [innerHeight, setInnerHeight] = React.useState(1123)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScale(Math.min(entry.contentRect.width / 794, 1))
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const inner = innerRef.current
    if (!inner) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInnerHeight(entry.contentRect.height)
      }
    })

    observer.observe(inner)
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={containerRef} className="flex min-h-full w-full flex-col items-center gap-6 pb-12">
      {/* Editor settings bar above the actual A4 page sheet */}
      <div className="w-full max-w-[794px] bg-[var(--invoice-panel)] border border-[var(--invoice-panel-border)] rounded-xl p-5 space-y-4 shadow-sm">
        <ProfessionPreset />
        <div className="border-t border-[var(--invoice-panel-border)] pt-4">
          <OptionsPanel />
        </div>
      </div>

      <div 
        style={{ 
          width: 794 * scale, 
          height: innerHeight * scale,
          position: "relative"
        }}
      >
        <section
          id={invoiceCanvasId}
          ref={innerRef}
          className="invoice-canvas shrink-0 px-10 py-12"
          data-template={state.templateId}
          style={{ 
            fontFamily: "var(--invoice-font)",
            width: 794,
            minHeight: 1123,
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          <div className="invoice-canvas-inner space-y-8">
            <HeaderSection />
            <ClientSection />
            <MetaSection />
            <LineItemsTable />
            <TotalsSection />
            <FooterSection />
          </div>
        </section>
      </div>
    </div>
  )
}
