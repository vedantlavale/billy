"use client"

import * as React from "react"

import { Button as StatefulButton } from "@/components/ui/stateful-button"
import posthog from "posthog-js"

type Status = "idle" | "submitting" | "success" | "error"

interface WaitlistDialogProps {
  isOpen: boolean
  onClose: () => void
}

const inputClass =
  "w-full rounded-xl border border-[#E4E4DC] bg-white px-4 py-3 text-sm text-[#0E1117] outline-none transition-colors placeholder:text-[#9CA0AC] focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/15 disabled:opacity-60"

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

  async function submit() {
    if (status === "submitting" || !email) return
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
      posthog.capture("waitlist_joined", { email })
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0D7377]">
              Waitlist
            </p>
            <h2
              id="waitlist-title"
              className="mt-1.5 text-2xl font-normal tracking-tight text-[#0E1117]"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
            >
              Join the  <em className="italic">billy</em> waitlist.
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-md p-1.5 text-[#7C8090] transition-colors hover:bg-white hover:text-[#0E1117]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-[#3A3F4B]">
          We&apos;re putting the finishing touches on billy. Drop your email
          and we&apos;ll let you know the moment we open the doors.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          noValidate
        >
          <label
            htmlFor="waitlist-email"
            className="mb-1.5 block text-[11px] font-semibold tracking-[0.12em] text-[#3A3F4B] uppercase"
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
            disabled={status === "submitting" || status === "success"}
            className={inputClass}
          />

          {error && (
            <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
          )}

          <StatefulButton
            type="button"
            disabled={!email || status === "success"}
            onClick={submit}
            className="mt-4 w-full min-w-full bg-[#0E1117] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(14,17,23,0.18)] hover:-translate-y-0.5 hover:bg-[#0D7377] hover:ring-[#0D7377] hover:shadow-[0_8px_30px_rgba(13,115,119,0.28)] disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[#0E1117]"
          >
            Join the waitlist
          </StatefulButton>

          <div className="mt-3 min-h-[2.5rem] text-center text-[11px] leading-relaxed">
            {status === "success" && savedEmail ? (
              <p className="text-sm text-[#3A3F4B] animate-in fade-in slide-in-from-bottom-2 duration-300">
                We&apos;ll email{" "}
                <span className="font-semibold text-[#0E1117]">{savedEmail}</span>{" "}
                the moment we open.
              </p>
            ) : (
              <p className="text-[11px] text-[#7C8090]">
                {/* No spam, ever. One email when we launch. */}
              </p>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
