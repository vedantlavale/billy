"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { claimFounderFromText } from "@/lib/founder"

interface FounderUnlockDialogProps {
  open: boolean
  onClose: () => void
  onUnlocked: (number: number) => void
}

/**
 * For an early bird on a device that hasn't opened their email link yet: paste
 * the link (or just its code) and the Early Bird template unlocks here. Checked
 * in the browser against the public key, so nothing is sent anywhere. Styled to
 * match ConfirmDialog; rendered into document.body so the editor rail's
 * transforms can't trap it.
 */
export function FounderUnlockDialog({ open, onClose, onUnlocked }: FounderUnlockDialogProps) {
  // Mounted only while open, so the field and error start fresh every time.
  if (!open) return null
  return createPortal(<UnlockForm onClose={onClose} onUnlocked={onUnlocked} />, document.body)
}

function UnlockForm({ onClose, onUnlocked }: Omit<FounderUnlockDialogProps, "open">) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)
  const [checking, setChecking] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const titleId = React.useId()
  const descriptionId = React.useId()

  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const previouslyFocused = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    // Capture phase, so Escape closes only this dialog and not the settings
    // drawer it opens from on a phone.
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.stopPropagation()
      onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey, true)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (checking || !value.trim()) return
    setChecking(true)
    const number = await claimFounderFromText(value)
    setChecking(false)
    if (number === null) {
      setError(true)
      inputRef.current?.focus()
      return
    }
    onUnlocked(number)
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#37352f]/30 animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={submit}
        className="ed-chrome fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#E5E7EB] bg-white p-6 text-[#37352f] shadow-[0_16px_40px_-16px_rgba(55,53,47,0.3)] animate-in fade-in zoom-in-95 duration-150"
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <h3 id={titleId} className="text-lg font-semibold leading-7">
          Early bird template
        </h3>
        <p id={descriptionId} className="mt-1.5 text-sm leading-5">
          This one is for billy&apos;s early birds. Paste the link from your launch email to unlock it on this device.
        </p>

        <input
          ref={inputRef}
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(false)
          }}
          placeholder="Paste your link here"
          aria-label="Early bird link"
          aria-invalid={error || undefined}
          aria-describedby={error ? `${descriptionId}-error` : undefined}
          className="mt-4 h-10 w-full rounded-[7px] border border-[#E5E7EB] bg-white px-3 text-sm placeholder:text-[#6B7280] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7] aria-[invalid=true]:border-[#D92D20]"
        />
        {error && (
          <p id={`${descriptionId}-error`} role="alert" className="mt-2 text-sm leading-5 text-[#D92D20]">
            That link didn&apos;t check out. Paste it exactly as it arrived in your email.
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-[7px] border border-[#E5E7EB] bg-white px-3.5 text-sm font-semibold transition-colors hover:bg-[#F3F4F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={checking || !value.trim()}
            className="inline-flex h-10 items-center rounded-[7px] bg-[#0070D7] px-3.5 text-sm font-semibold !text-white transition-colors hover:bg-[#005FB8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7] disabled:opacity-60"
          >
            Unlock
          </button>
        </div>
      </form>
    </>
  )
}
