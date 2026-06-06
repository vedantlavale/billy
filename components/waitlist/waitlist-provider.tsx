"use client"

import * as React from "react"

import { WaitlistDialog } from "@/components/waitlist/waitlist-dialog"

interface WaitlistContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const WaitlistContext = React.createContext<WaitlistContextValue | null>(null)

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const value = React.useMemo<WaitlistContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  )

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <WaitlistDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </WaitlistContext.Provider>
  )
}

export function useWaitlist() {
  const ctx = React.useContext(WaitlistContext)
  if (!ctx) {
    throw new Error("useWaitlist must be used within <WaitlistProvider>")
  }
  return ctx
}
