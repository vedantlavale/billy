"use client"

import * as React from "react"

interface ResizableSplitProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftPercent?: number
  minLeftPercent?: number
  maxLeftPercent?: number
  className?: string
}

export function ResizableSplit({
  left,
  right,
  defaultLeftPercent = 55,
  minLeftPercent = 30,
  maxLeftPercent = 80,
  className,
}: ResizableSplitProps) {
  const [leftPercent, setLeftPercent] = React.useState(defaultLeftPercent)
  const dragging = React.useRef(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = true
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = (x / rect.width) * 100

    setLeftPercent(Math.min(Math.max(percent, minLeftPercent), maxLeftPercent))
  }, [minLeftPercent, maxLeftPercent])

  const handlePointerUp = React.useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        userSelect: dragging.current ? "none" : undefined,
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        style={{
          width: `${leftPercent}%`,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {left}
      </div>

      <div
        style={{
          width: 12,
          cursor: "col-resize",
          flexShrink: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid var(--invoice-panel-border, #e2e8f0)",
          borderRight: "1px solid var(--invoice-panel-border, #e2e8f0)",
        }}
        onPointerDown={handlePointerDown}
      >
        <div
          style={{
            width: 4,
            height: 40,
            borderRadius: 2,
            transition: "background-color 0.15s, transform 0.15s",
          }}
          className="resizable-split-handle"
        />
        <style>{`
          .resizable-split-handle {
            background-color: var(--invoice-panel-border, #cbd5e1);
          }
          div:hover > .resizable-split-handle,
          div:active > .resizable-split-handle {
            background-color: var(--invoice-accent, #6366f1) !important;
            transform: scaleY(1.1);
          }
        `}</style>
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {right}
      </div>
    </div>
  )
}
