"use client"

import * as React from "react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: "default" | "danger"
}

/** Modal confirmation styled to root DESIGN.md. Escape and the backdrop cancel. */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
}: ConfirmDialogProps) {
  const confirmRef = React.useRef<HTMLButtonElement>(null)
  const titleId = React.useId()
  const descriptionId = React.useId()

  React.useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"
    const previouslyFocused = document.activeElement as HTMLElement | null
    confirmRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
      previouslyFocused?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#37352f]/30 animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="ed-chrome fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#E5E7EB] bg-white p-6 text-[#37352f] shadow-[0_16px_40px_-16px_rgba(55,53,47,0.3)] animate-in fade-in zoom-in-95 duration-150"
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <h3 id={titleId} className="text-lg font-semibold leading-7">
          {title}
        </h3>
        <p id={descriptionId} className="mt-1.5 text-sm leading-5">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-[7px] border border-[#E5E7EB] bg-white px-3.5 text-sm font-semibold transition-colors hover:bg-[#F3F4F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7]"
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`inline-flex h-10 items-center rounded-[7px] px-3.5 text-sm font-semibold !text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7] ${
              type === "danger"
                ? "bg-[#D92D20] hover:bg-[#B42318]"
                : "bg-[#0070D7] hover:bg-[#005FB8]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  )
}
