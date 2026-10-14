"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"

/**
 * Fires once when the element first enters the viewport.
 *
 * Degrades to "shown" rather than "hidden" in every failure case — reduced
 * motion, no IntersectionObserver, or an element that is already on screen at
 * mount. Content is never left invisible because an observer did not run.
 */
export function useInView<T extends HTMLElement>(rootMargin = "-12% 0px -6% 0px") {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced motion needs no special case here: the stylesheet already forces
    // every .lx-reveal visible in that mode.
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setInView(true), 0)
      return () => clearTimeout(t)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }
      },
      { rootMargin, threshold: 0.01 },
    )

    io.observe(el)

    // Backstop. A reveal is decorative, so nothing may depend on the observer
    // actually reporting — inside an inert/offscreen frame, under an odd
    // rootMargin, or if the callback is starved, it may never fire. Content
    // must never stay invisible because of that.
    const failsafe = setTimeout(() => setInView(true), 2200)

    return () => {
      io.disconnect()
      clearTimeout(failsafe)
    }
  }, [rootMargin])

  return { ref, inView }
}

interface RevealProps {
  children: ReactNode
  /** Stagger within a group, in ms. */
  delay?: number
  as?: ElementType
  className?: string
  id?: string
}

/** Fade + 18px rise as a block resolves into view. Decorative hierarchy cue. */
export function Reveal({ children, delay = 0, as, className, id }: RevealProps) {
  const Tag = (as ?? "div") as ElementType
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <Tag
      ref={ref}
      id={id}
      data-shown={inView ? "true" : undefined}
      className={className ? `lx-reveal ${className}` : "lx-reveal"}
      style={delay ? ({ "--lx-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
