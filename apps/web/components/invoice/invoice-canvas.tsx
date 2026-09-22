'use client'

import * as React from "react"

import { InvoicePage } from "@/components/invoice/invoice-page"

export const invoiceCanvasId = "invoice-canvas"

export function InvoiceCanvas() {
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
      <div
        style={{ 
          width: 794 * scale, 
          height: innerHeight * scale,
          position: "relative"
        }}
      >
        <InvoicePage
          id={invoiceCanvasId}
          ref={innerRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  )
}
