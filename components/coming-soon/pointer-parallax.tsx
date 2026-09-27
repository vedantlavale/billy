"use client"

import * as React from "react"

/**
 * Exposes the pointer position as --mx / --my (-1..1) on its element, so
 * children can drift with CSS alone (`translate: calc(var(--mx) * ...)`).
 */
export function PointerParallax({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener("pointermove", onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
