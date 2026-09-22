"use client"

import * as React from "react"
import { CheckIcon, InfoIcon, XIcon } from "@/components/icons/rune"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3.5 shadow-[0_12px_32px_-12px_rgba(55,53,47,0.25)] animate-in fade-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-center gap-3">
              {/* Type indicator — DESIGN.md: blue for success/info, #D92D20 for errors */}
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                  t.type === "error" ? "bg-[#D92D20]/10 text-[#D92D20]" : "bg-[#0070D7]/10 text-[#0070D7]"
                }`}
              >
                {t.type === "success" && <CheckIcon size={14} strokeWidth={2.5} />}
                {t.type === "error" && <XIcon size={14} strokeWidth={2.5} />}
                {t.type === "info" && <InfoIcon size={14} />}
              </span>
              <span className="text-sm font-semibold text-[#37352f]">{t.message}</span>
            </div>
            
            {/* Dismiss Button */}
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="rounded p-0.5 text-[#37352f] transition-colors hover:bg-[#F3F4F6] outline-none focus-visible:outline-2 focus-visible:outline-[#0070D7]"
            >
              <XIcon size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
