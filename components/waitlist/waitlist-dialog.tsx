"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

type Status = "idle" | "submitting" | "success" | "error"

interface WaitlistDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistDialog({ isOpen, onClose }: WaitlistDialogProps) {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [savedEmail, setSavedEmail] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setEmail("")
        setStatus("idle")
        setError(null)
        setSavedEmail(null)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "submitting") return

    setStatus("submitting")
    setError(null)

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Please try again.")
        setStatus("error")
        return
      }
      setSavedEmail(email)
      setStatus("success")
    } catch {
      setError("Network error. Please try again.")
      setStatus("error")
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#0E1117]/35 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E4E4DC] bg-[#FAFAF7] p-7 shadow-[0_24px_64px_rgba(14,17,23,0.18)] animate-in fade-in zoom-in-95 duration-200"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D7377]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Waitlist
            </p>
            <h2
              id="waitlist-title"
              className="mt-1 text-2xl font-normal tracking-tight text-[#0E1117]"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
            >
              Join the billy <em className="italic">waitlist</em>.
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[#7C8090] transition-colors hover:bg-white hover:text-[#0E1117]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="rounded-xl border border-[#E4F2F2] bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#E4F2F2] text-[#0D7377]">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#0E1117]">You&apos;re on the list.</p>
            <p className="mt-1 text-xs text-[#7C8090]">
              We&apos;ll email <span className="font-medium text-[#0E1117]">{savedEmail}</span> the moment we open.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="mt-5 rounded-md border-[#E4E4DC] bg-white text-[#3A3F4B] hover:bg-[#FAFAF7] hover:text-[#0E1117]"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm leading-relaxed text-[#3A3F4B]">
              We&apos;re putting the finishing touches on billy. Drop your email and
              we&apos;ll let you know the moment we open the doors.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="waitlist-email"
                className="mb-1.5 block text-xs font-semibold tracking-wide text-[#3A3F4B] uppercase"
              >
                Email
              </label>
              <input
                ref={inputRef}
                id="waitlist-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === "error") {
                    setStatus("idle")
                    setError(null)
                  }
                }}
                placeholder="you@workmail.com"
                disabled={status === "submitting"}
                className="w-full rounded-lg border border-[#E4E4DC] bg-white px-4 py-2.5 text-sm text-[#0E1117] outline-none transition-colors placeholder:text-[#9CA0AC] focus:border-[#0D7377] disabled:opacity-60"
              />

              {error && (
                <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={status === "submitting" || !email}
                className="mt-4 w-full rounded-md bg-[#0D7377] py-2.5 text-sm font-semibold text-white hover:bg-[#0D7377]/95 disabled:opacity-50"
              >
                {status === "submitting" ? "Adding you…" : "Join the waitlist"}
              </Button>


            </form>
          </>
        )}
      </div>
    </>
  )
}
