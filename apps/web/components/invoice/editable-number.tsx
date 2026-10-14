'use client'

import * as React from "react"

import { formatCurrency, formatNumber } from "@billy/invoice-core"
import { cn } from "@/lib/utils"
import { useReadOnly } from "@/components/invoice/render-mode"
import { useFieldSheet } from "@/components/invoice/field-sheet"

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

/**
 * Phone keypads in comma-decimal locales type "12,50". A lone comma followed
 * by one or two digits is the decimal point; any other comma is grouping.
 */
function normaliseDecimal(text: string) {
  const trimmed = text.trim()
  if (!trimmed.includes(".") && /^[^,]*,\d{1,2}$/.test(trimmed)) return trimmed.replace(",", ".")
  return trimmed.replace(/,/g, "")
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
  const readOnly = useReadOnly()
  const sheet = useFieldSheet()
  // Stable identity so the sheet can say which field it is editing.
  const [owner] = React.useState(() => ({}))
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
    if (sheet) {
      sheet.open(
        {
          label: ariaLabel ?? "Number",
          value: String(value),
          inputType: "text",
          inputMode: "decimal",
          onCommit: (text) => {
            const parsed = Number.parseFloat(normaliseDecimal(text))
            if (Number.isFinite(parsed) && parsed !== value) onCommit(parsed)
          },
        },
        owner,
      )
      return
    }
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

  if (readOnly || !isEditing) {
    const displayValue = currency
      ? formatCurrency(value, currency, decimals)
      : formatNumber(value, decimals)

    if (readOnly) {
      return (
        <span
          className={cn(
            "inline-flex min-w-[3ch] items-baseline justify-end text-right font-mono",
            className
          )}
          aria-label={ariaLabel}
        >
          {displayValue}
        </span>
      )
    }

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
          "invoice-field inline-flex min-w-[3ch] items-baseline justify-end rounded-sm px-1 -mx-1 text-right font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070D7]/40",
          sheet?.activeOwner === owner && "invoice-field--active",
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
        "invoice-input h-8 w-24 rounded-md bg-white px-1 -mx-1 text-right font-mono text-[var(--invoice-ink)] ring-1 ring-[#0070D7] shadow-[0_0_0_3px_rgba(0,112,215,0.14)]",
        className,
        inputClassName
      )}
    />
  )
}
