"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { prefersReducedMotion, useInView } from "./reveal"

/* ══ CTA ═══════════════════════════════════════════════════════════════════
   /editor is a client route with no server work, so the CTA pushes rather
   than doing a document navigation. */

type CtaTone = "primary" | "ghost" | "onDark"

export function Cta({
  label,
  tone = "primary",
  large,
  arrow = true,
}: {
  label: string
  tone?: CtaTone
  large?: boolean
  arrow?: boolean
}) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch?.("/editor")
  }, [router])

  return (
    <button
      type="button"
      onClick={() => router.push("/editor")}
      className={`lx-btn lx-btn-${tone}${large ? " lx-btn-lg" : ""}`}
    >
      {label}
      {arrow && (
        <svg
          className="lx-arrow"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h13M12 5l7 7-7 7" />
        </svg>
      )}
    </button>
  )
}

/* ══ NAV ══════════════════════════════════════════════════════════════════ */

/** `minimal` drops the in-page section links — they anchor to sections that
 *  only exist on the landing page, so on /404 they would go nowhere. */
export function LandingNav({ minimal = false }: { minimal?: boolean }) {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="lx-nav" data-stuck={stuck ? "true" : "false"}>
      <div className="lx-nav-inner">
        <Link href="/" className="lx-wordmark">
          billy<i>*</i>
        </Link>

        {!minimal && (
          <nav className="lx-nav-links" aria-label="Sections">
            <a className="lx-nav-link" href="#how">
              How it works
            </a>
            <a className="lx-nav-link" href="#built-for">
              Built for
            </a>
            <a className="lx-nav-link" href="#faq">
              FAQ
            </a>
          </nav>
        )}

        <Cta label="Create invoice" arrow={false} />
      </div>
    </header>
  )
}

/* ══ MARQUEE ══════════════════════════════════════════════════════════════
   Continuous horizontal drift. The track holds the list twice and travels
   -50%, so the loop is seamless. Pauses on hover; removed under reduced
   motion by the stylesheet. */

export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="lx-marquee" aria-hidden="true">
      <div className="lx-marquee-track">
        {[0, 1].map((copy) => (
          <div className="lx-marquee-item" key={copy}>
            {items.map((item) => (
              <span key={`${copy}-${item}`}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══ STAT ═════════════════════════════════════════════════════════════════
   Tirtus's oversized numerals. Numeric stats count up once on reveal; the
   real text stays in the DOM for assistive tech and for no-JS. */

export function Stat({
  value,
  suffix = "",
  prefix = "",
  caption,
}: {
  value: number
  suffix?: string
  prefix?: string
  caption: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>("-8% 0px")
  const [shown, setShown] = useState(value)
  const ran = useRef(false)

  useEffect(() => {
    if (!inView || ran.current) return
    ran.current = true

    // No state write needed: `shown` is initialised to `value`, so skipping
    // the animation already leaves the final figure on screen.
    if (prefersReducedMotion()) return

    const duration = 900
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      // ease-out cubic — fast start, soft landing
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(eased * value))
      if (p < 1) frame = requestAnimationFrame(tick)
    }

    // The first frame writes ~0 itself, so there is no synchronous reset here.
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <div className="lx-stat" ref={ref}>
      <div className="lx-stat-n">
        {prefix}
        {shown}
        {suffix}
      </div>
      <div className="lx-stat-k">{caption}</div>
      <div className="lx-stat-round" aria-hidden="true">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h13M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}
