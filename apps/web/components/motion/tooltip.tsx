"use client"
/*
 * Tooltip — surface animation adapted from beUI
 * (beui.dev/components/motion/tooltip), MIT License, Copyright (c) 2026
 * Saurabh Chauhan. See ./LICENSE.
 *
 * Billy changes: the trigger is a small hover/focus/tap wrapper instead of
 * beUI's gesture-hook stack, the surface is positioned with `fixed` viewport
 * coordinates clamped to the window, and colours follow DESIGN.md.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"
import { createPortal } from "react-dom"

import { EASE_OUT } from "@/lib/ease"

const GAP = 8
const SPRING = { type: "spring", stiffness: 380, damping: 30, mass: 0.7 } as const

export function Tooltip({
  content,
  children,
  className,
}: {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const id = React.useId()
  const reduce = useReducedMotion()
  const anchor = React.useRef<HTMLSpanElement>(null)
  const surface = React.useRef<HTMLSpanElement>(null)
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = React.useState({ top: 0, left: 0 })

  const place = React.useCallback(() => {
    const a = anchor.current?.getBoundingClientRect()
    if (!a) return
    const w = surface.current?.offsetWidth ?? 0
    const h = surface.current?.offsetHeight ?? 0
    const left = Math.max(GAP + w / 2, Math.min(a.left + a.width / 2, window.innerWidth - GAP - w / 2))
    const top = a.top - GAP - h < GAP ? a.bottom + GAP + h : a.top - GAP
    setPos({ top, left })
  }, [])

  React.useLayoutEffect(() => {
    if (!open) return
    place()
    window.addEventListener("scroll", place, true)
    window.addEventListener("resize", place)
    return () => {
      window.removeEventListener("scroll", place, true)
      window.removeEventListener("resize", place)
    }
  }, [open, place])

  // Close on Escape, and on a tap anywhere else (touch users have no hover).
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!anchor.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  return (
    <>
      <span
        ref={anchor}
        className={className}
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </span>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <span
                className="pointer-events-none fixed z-[9999]"
                style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -100%)" }}
              >
                <motion.span
                  ref={surface}
                  id={id}
                  role="tooltip"
                  className="lx-tooltip"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8, filter: "blur(5px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 5, filter: "blur(3px)" }}
                  transition={
                    reduce
                      ? { duration: 0.12 }
                      : { ...SPRING, opacity: { duration: 0.14, ease: EASE_OUT }, filter: { duration: 0.18, ease: EASE_OUT } }
                  }
                >
                  {content}
                </motion.span>
              </span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
