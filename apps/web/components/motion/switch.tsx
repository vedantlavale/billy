"use client"
/*
 * Switch — adapted from beUI (beui.dev/components/motion/switch), MIT License,
 * Copyright (c) 2026 Saurabh Chauhan. See ./LICENSE.
 *
 * Billy changes: DESIGN.md colours (#0070D7 on, #D1D5DB off), a smaller
 * 40×24 track for dense inspector rows, and an `id` prop so an external
 * <label htmlFor> can sit on the left of the control.
 */

import { animate, motion, MotionConfig, useReducedMotion } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Heavy, deliberate thumb — high mass keeps the travel weighty without wobble.
const THUMB_SPRING = { type: "spring", stiffness: 800, damping: 80, mass: 4 } as const

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  id: idProp,
  ariaLabel,
  ariaDescribedBy,
  className,
}: SwitchProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const thumbRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [isPressed, setIsPressed] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  // Disabled shake feedback when pressed.
  useEffect(() => {
    if (!thumbRef.current || reduce) return
    if (disabled && isPressed) {
      animate(thumbRef.current, { x: [0, -2, 2, -1, 0] }, { delay: 0.2, duration: 0.6 })
    }
  }, [disabled, isPressed, reduce])

  const squish = !disabled && isPointer && isPressed && !reduce

  return (
    <MotionConfig transition={reduce ? { duration: 0 } : THUMB_SPRING}>
      <motion.button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        onPointerDown={(e) => {
          setIsPressed(true)
          setIsPointer(e.type.startsWith("pointer"))
        }}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        initial={false}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full px-0.5 outline-none transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          checked ? "justify-end bg-[#0070D7]" : "justify-start bg-[#D1D5DB]",
          className,
        )}
      >
        <motion.div
          ref={thumbRef}
          layout
          animate={{ scale: squish ? 0.9 : 1 }}
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(55,53,47,0.3)]"
        >
          {/* Stretch toward the destination while active. */}
          <div className={cn("size-5", squish && (checked ? "ml-1" : "mr-1"))} />
        </motion.div>
      </motion.button>
    </MotionConfig>
  )
}
