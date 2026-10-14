"use client"
/*
 * Radio group — adapted from beUI (beui.dev/components/motion/radio), MIT
 * License, Copyright (c) 2026 Saurabh Chauhan. See ./LICENSE.
 *
 * Billy changes: DESIGN.md colours, an optional `description` line under each
 * label, and arrow-key navigation (roving tabindex) per the WAI-ARIA radio
 * group pattern.
 */

import { motion, MotionConfig, useReducedMotion } from "motion/react"
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease"
import { cn } from "@/lib/utils"

type RadioCtx = {
  value: string
  setValue: (value: string) => void
  layoutId: string
}

const RadioCtx = createContext<RadioCtx | null>(null)

function useRadioGroup() {
  const ctx = useContext(RadioCtx)
  if (!ctx) {
    throw new Error("RadioGroupItem must be used inside <RadioGroup>")
  }
  return ctx
}

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
  orientation?: "vertical" | "horizontal"
  "aria-label"?: string
}

export function RadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  children,
  className,
  orientation = "vertical",
  "aria-label": ariaLabel,
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue)
  const layoutId = useId()
  const reduce = useReducedMotion()
  const groupRef = useRef<HTMLDivElement>(null)
  const controlled = value !== undefined
  const current = controlled ? value : internal
  const setValue = useCallback(
    (next: string) => {
      if (!controlled) setInternal(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange],
  )
  const contextValue = useMemo(
    () => ({ value: current, setValue, layoutId }),
    [current, layoutId, setValue],
  )

  // Arrow keys move selection and focus together, wrapping at the ends.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"]
    if (!keys.includes(event.key)) return
    const radios = Array.from(
      groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [],
    )
    const index = radios.findIndex((radio) => radio === document.activeElement)
    if (index === -1) return
    event.preventDefault()
    const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1
    const next = radios[(index + step + radios.length) % radios.length]
    next.focus()
    next.click()
  }

  return (
    <MotionConfig transition={reduce ? { duration: 0 } : SPRING_LAYOUT}>
      <RadioCtx.Provider value={contextValue}>
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          className={cn(
            "flex gap-3",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
            className,
          )}
        >
          {children}
        </div>
      </RadioCtx.Provider>
    </MotionConfig>
  )
}

export interface RadioGroupItemProps {
  value: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function RadioGroupItem({
  value,
  label,
  description,
  disabled,
  className,
  id: idProp,
}: RadioGroupItemProps) {
  const { value: groupValue, setValue, layoutId } = useRadioGroup()
  const autoId = useId()
  const id = idProp ?? autoId
  const reduce = useReducedMotion()
  const selected = groupValue === value

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-start gap-3",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <motion.button
        id={id}
        type="button"
        role="radio"
        aria-checked={selected}
        tabIndex={selected ? 0 : -1}
        disabled={disabled}
        onClick={() => !disabled && setValue(value)}
        whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
        transition={SPRING_PRESS}
        data-state={selected ? "checked" : "unchecked"}
        className={cn(
          "relative mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-white outline-none transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          selected ? "border-[#0070D7]" : "border-[#D1D5DB] hover:border-[#9CA3AF]",
        )}
      >
        {selected ? (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-[3px] rounded-full bg-[#0070D7]"
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          />
        ) : null}
      </motion.button>
      {label ? (
        <span className={cn("min-w-0 select-none", disabled && "opacity-60")}>
          <span className="block text-sm font-medium leading-5">{label}</span>
          {description ? <span className="block text-xs leading-4">{description}</span> : null}
        </span>
      ) : null}
    </label>
  )
}
