'use client'

import * as React from "react"

import { cn } from "@/lib/utils"

export interface EditableTextProps {
  value: string
  onCommit: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  inputClassName?: string
  displayAs?: keyof React.JSX.IntrinsicElements
  inputType?: React.HTMLInputTypeAttribute
  rows?: number
  ariaLabel?: string
  displayValue?: string
}

export function EditableText({
  value,
  onCommit,
  placeholder,
  multiline = false,
  className,
  inputClassName,
  displayAs,
  inputType = "text",
  rows = 3,
  ariaLabel,
  displayValue,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const skipBlurRef = React.useRef(false)
  const originalValue = React.useRef(value)

  React.useEffect(() => {
    if (!isEditing) {
      setDraft(value)
    }
  }, [value, isEditing])

  React.useEffect(() => {
    if (!isEditing) {
      return
    }

    const el = multiline ? textareaRef.current : inputRef.current
    if (!el) return

    const frame = requestAnimationFrame(() => {
      el.focus()
      if ("select" in el) {
        el.select()
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [isEditing])

  const startEditing = () => {
    originalValue.current = value
    setDraft(value)
    setIsEditing(true)
  }

  const commit = () => {
    skipBlurRef.current = true
    setIsEditing(false)
    if (draft !== value) {
      onCommit(draft)
    }
  }

  const cancel = () => {
    skipBlurRef.current = true
    setIsEditing(false)
    setDraft(originalValue.current)
  }

  const handleBlur = () => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false
      return
    }
    commit()
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Escape") {
      event.preventDefault()
      cancel()
      return
    }

    if (event.key === "Tab") {
      commit()
      return
    }

    if (!multiline && event.key === "Enter") {
      event.preventDefault()
      commit()
      return
    }

    if (multiline && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      commit()
    }
  }

  const DisplayTag = (displayAs ?? (multiline ? "p" : "span")) as keyof React.JSX.IntrinsicElements
  const displayText = displayValue ?? value
  const isEmpty = value.trim().length === 0

  if (!isEditing) {
    return (
      <DisplayTag
        tabIndex={0}
        onClick={startEditing}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            startEditing()
          }
        }}
        className={cn(
          "invoice-field inline-block min-w-[2ch] rounded-sm px-1 -mx-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/70",
          multiline && "whitespace-pre-line",
          isEmpty && "text-slate-400",
          className
        )}
        aria-label={ariaLabel}
      >
        {isEmpty ? placeholder ?? "" : displayText}
      </DisplayTag>
    )
  }

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "invoice-input w-full rounded-sm bg-white/80 px-1 -mx-1 text-slate-900 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-400/70",
          "min-h-[3.5rem] resize-none",
          className,
          inputClassName
        )}
      />
    )
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      type={inputType}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        "invoice-input h-8 w-full rounded-sm bg-white/80 px-1 -mx-1 text-slate-900 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-400/70",
        className,
        inputClassName
      )}
    />
  )
}
