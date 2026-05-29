"use client"

import * as React from "react"

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
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-[#E4E4DC] bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-center gap-3">
              {/* Type Indicator Icon */}
              {t.type === "success" && (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {t.type === "error" && (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </span>
              )}
              {t.type === "info" && (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E4F2F2] text-[#0D7377]">
                  <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              <span className="text-xs font-semibold tracking-tight text-[#0E1117]">{t.message}</span>
            </div>
            
            {/* Dismiss Button */}
            <button
              onClick={() => removeToast(t.id)}
              className="rounded p-0.5 text-[#7C8090] transition-colors hover:bg-[#FAFAF7] hover:text-[#0E1117] outline-none"
            >
              <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
