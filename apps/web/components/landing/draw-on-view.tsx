"use client"

import { useInView } from "motion/react"
import { useRef, useSyncExternalStore, type ReactNode } from "react"

const noopSubscribe = () => () => {}
const hasObserver = () => typeof IntersectionObserver !== "undefined"

/**
 * Holds the `.lx-draw` pen animation of its children until they are actually
 * on screen. Unlike <Reveal>, there is no timed backstop — that backstop is
 * what made a doodle far down the page finish drawing before anyone reached
 * it. It still fails open: without IntersectionObserver it draws at once.
 */
export function DrawOnView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const supported = useSyncExternalStore(noopSubscribe, hasObserver, () => true)
  const drawn = inView || !supported

  return (
    <span ref={ref} className={className ? `lx-draw-view ${className}` : "lx-draw-view"} data-drawn={drawn || undefined}>
      {children}
    </span>
  )
}
