'use client'

import * as React from "react"

import { formatCurrency, formatNumber } from "@/lib/invoice"
import { cn } from "@/lib/utils"

export interface EditableNumberProps {
  value: number
  onCommit: (value: number) => void
  currency?: string
  decimals?: number
  min?: number
  max?: number
  step?: number
  className?: string
  inputClassName?: string
  ariaLabel?: string
}

export function EditableNumber({
  value,
  onCommit,
  currency,
  decimals = 2,
  min,
  max,
  step = 0.01,
  className,
  inputClassName,
  ariaLabel,
}: EditableNumberProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(String(value))
  const inputRef = React.useRef<HTMLInputElement>(null)
  const skipBlurRef = React.useRef(false)
  const originalValue = React.useRef(value)

  React.useEffect(() => {
    if (!isEditing) {
      return
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })

    return () => cancelAnimationFrame(frame)
  }, [isEditing])

  const startEditing = () => {
    originalValue.current = value
    setDraft(String(value))
    setIsEditing(true)
  }

  const parseDraft = () => {
    const parsed = Number.parseFloat(draft)
    if (!Number.isFinite(parsed)) {
      return originalValue.current
    }
    return parsed
  }

  const commit = () => {
    skipBlurRef.current = true
    setIsEditing(false)

    const nextValue = parseDraft()
    if (nextValue !== value) {
      onCommit(nextValue)
    }
  }

  const cancel = () => {
    skipBlurRef.current = true
    setIsEditing(false)
    setDraft(String(originalValue.current))
  }

  const handleBlur = () => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false
      return
    }
    commit()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      cancel()
      return
    }

    if (event.key === "Tab") {
      commit()
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      commit()
    }
  }

  if (!isEditing) {
    const displayValue = currency
      ? formatCurrency(value, currency, decimals)
      : formatNumber(value, decimals)

    return (
      <span
        tabIndex={0}
        onClick={startEditing}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            startEditing()
          }
        }}
        className={cn(
          "invoice-field inline-flex min-w-[3ch] items-baseline justify-end rounded-sm px-1 -mx-1 text-right font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/70",
          className
        )}
        aria-label={ariaLabel}
      >
        {displayValue}
      </span>
    )
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      type="number"
      min={min}
      max={max}
      step={step}
      aria-label={ariaLabel}
      className={cn(
        "invoice-input h-8 w-24 rounded-sm bg-white/80 px-1 -mx-1 text-right font-mono text-slate-900 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-400/70",
        className,
        inputClassName
      )}
    />
  )
}
