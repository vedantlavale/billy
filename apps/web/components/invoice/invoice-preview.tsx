"use client"

import * as React from "react"
import { InvoicePage } from "@/components/invoice/invoice-page"
import { RenderModeProvider } from "@/components/invoice/render-mode"

const A4_WIDTH = 794

export function InvoicePreview() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const pageRef = React.useRef<HTMLElement>(null)
  const [scale, setScale] = React.useState(1)
  const [pageHeight, setPageHeight] = React.useState(1123)

  // Scale the A4 page to fit the available preview width.
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width - 48
        setScale(Math.min(width / A4_WIDTH, 1))
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Track the real rendered page height so the scaled wrapper reserves the
  // correct space (content can exceed one A4 page).
  React.useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPageHeight(entry.contentRect.height)
      }
    })

    observer.observe(page)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex items-center gap-2 border-b px-5 py-3"
        style={{ borderColor: "var(--invoice-panel-border)" }}
      >
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--invoice-muted)" }}
        >
          PDF Preview
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        style={{ backgroundColor: "var(--invoice-desk)" }}
      >
        <div
          className="mx-auto flex min-h-full items-start justify-center p-4"
          style={{ backgroundColor: "var(--invoice-desk)" }}
        >
          <div
            style={{
              width: A4_WIDTH * scale,
              height: pageHeight * scale,
              position: "relative",
            }}
          >
            <RenderModeProvider readOnly>
              <InvoicePage
                ref={pageRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </RenderModeProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
