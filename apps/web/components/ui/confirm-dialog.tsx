"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

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
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-[#0E1117]/35 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Modal Container */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#E4E4DC] bg-[#FAFAF7] p-6 shadow-[0_16px_48px_rgba(14,17,23,0.12)] animate-in fade-in zoom-in-95 duration-200"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-lg font-semibold tracking-tight text-[#0E1117]">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[#3A3F4B] leading-relaxed">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-md border-[#E4E4DC] bg-white text-[#3A3F4B] hover:bg-[#FAFAF7] hover:text-[#0E1117]"
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`rounded-md text-white ${
              type === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-[#0D7377] hover:bg-[#0D7377]/95"
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </>
  )
}
