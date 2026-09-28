"use client"

import type { CSSProperties } from "react"
import * as React from "react"

/**
 * The early-bird signup. Posts straight to a Loops form, so there is no
 * server or database here. Override with NEXT_PUBLIC_LOOPS_FORM_ID if the
 * form is ever recreated (Loops > Forms > your form > the ID in its endpoint
 * URL, app.loops.so/forms/<id>).
 *
 * A name is optional: people who give one are asking to be on the early bird
 * wall (userGroup "early-bird-wall"); everyone else is "early-bird".
 * Numbers and unlock links are sent on launch day (scripts/founders on
 * launch-alpha).
 */
const FORM_ID = process.env.NEXT_PUBLIC_LOOPS_FORM_ID || "cmujkeahx0k1w0j4adtzmompe"

/** The canonical site, so a share always points at the real thing. */
const SITE_URL = "https://trybilly.tech"

/**
 * The post the share button opens. Held here rather than in the href so the
 * wording stays in one reviewable place. No link in the text: the intent URL's
 * `url` param attaches the card itself.
 */
const SHARE_TEXT =
  "I just joined the waitlist for billy, a free invoice editor that runs entirely in your browser. Launching soon, with a surprise for the early birds."

const SHARE_HREF = `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SITE_URL)}`

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties

/** The X mark, inline so the button needs no icon dependency. */
function XMark() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden focusable="false">
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  )
}

type Status = "idle" | "sending" | "done" | "error"

export function WaitlistForm() {
  const [email, setEmail] = React.useState("")
  const [name, setName] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [message, setMessage] = React.useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "sending") return
    if (!FORM_ID) {
      setStatus("error")
      setMessage("Signups open very soon.")
      return
    }
    setStatus("sending")
    try {
      // Loops' own embed names the email field "newsletter-form-input" rather
      // than "email"; send both so the signup lands whichever one it reads.
      const body = new URLSearchParams({
        email: email.trim(),
        "newsletter-form-input": email.trim(),
        firstName: name.trim(),
        userGroup: name.trim() ? "early-bird-wall" : "early-bird",
        source: "coming-soon",
      })
      const res = await fetch(`https://app.loops.so/api/newsletter-form/${FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })
      if (res.status === 429) throw new Error("Lots of people signing up. Try again in a minute.")
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string }
      if (!res.ok || !data.success) throw new Error(data.message || "That didn't go through. Try again?")
      setStatus("done")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "That didn't go through. Try again?")
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center">
        <p className="rounded-full bg-[#eaf3fc] px-5 py-2.5 text-sm font-semibold text-[#0070d7] sm:text-base" role="status">
          You&apos;re on the list. Your early bird surprise lands on launch day.
        </p>
        <div className="cs-rise mt-4 flex flex-col items-center gap-2" style={delay(0.2)}>
          <a
            href={SHARE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#37352f] transition-colors hover:border-[#0070d7] hover:text-[#0070d7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070d7]/25"
          >
            <XMark />
            Share on X
          </a>
          <p className="text-balance text-xs text-[#6b6a65]">X opens with the post ready to send. Nothing goes out without you.</p>
        </div>
      </div>
    )
  }

  const showName = email.includes("@")

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col items-center gap-3">
      <p className="text-sm font-semibold text-[#37352f] sm:text-base">Join the waitlist for a surprise at launch</p>
      <div className="flex w-full gap-2">
        <label className="sr-only" htmlFor="cs-email">
          Email
        </label>
        <input
          id="cs-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 min-w-0 flex-1 rounded-[8px] border border-[#e5e7eb] bg-white px-3.5 text-base text-[#37352f] outline-none placeholder:text-[#a3a29d] focus:border-[#0070d7] focus:ring-2 focus:ring-[#0070d7]/20"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-11 shrink-0 rounded-[8px] bg-[#0070d7] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#005fb8] disabled:opacity-70"
        >
          {status === "sending" ? "Joining…" : "Join"}
        </button>
      </div>
      {showName && (
        <div className="w-full">
          <label className="sr-only" htmlFor="cs-name">
            Name for the early bird wall
          </label>
          <input
            id="cs-name"
            type="text"
            autoComplete="name"
            maxLength={40}
            placeholder="Name for the early bird wall (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3.5 text-sm text-[#37352f] outline-none placeholder:text-[#a3a29d] focus:border-[#0070d7] focus:ring-2 focus:ring-[#0070d7]/20"
          />
        </div>
      )}
      <p className={`text-xs ${status === "error" ? "text-[#d92d20]" : "text-[#6b6a65]"}`} role={status === "error" ? "alert" : undefined}>
        {status === "error" ? message : "Only launch news. No spam, unsubscribe anytime."}
      </p>
    </form>
  )
}
