"use client"

import * as React from "react"
import { useInvoiceState } from "@/components/invoice/invoice-context"
import { renderInvoiceDocument } from "@/lib/render-invoice-document"

const A4_RATIO = 297 / 210
const A4_WIDTH = 794

export function InvoicePreview() {
  const state = useInvoiceState()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  const html = React.useMemo(() => renderInvoiceDocument(state), [state])

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
              height: A4_WIDTH * A4_RATIO * scale,
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: A4_WIDTH,
                height: A4_WIDTH * A4_RATIO,
              }}
            >
              <iframe
                srcDoc={html}
                title="Invoice Preview"
                style={{
                  width: A4_WIDTH,
                  height: A4_WIDTH * A4_RATIO,
                  border: "none",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
