"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { prefersReducedMotion, useInView } from "./reveal"
import { ArrowRightIcon } from "@/components/icons/rune"

/* ══ CTA ═══════════════════════════════════════════════════════════════════
   /editor is a client route with no server work, so the CTA pushes rather
   than doing a document navigation. */

type CtaTone = "primary" | "ghost"

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
        <ArrowRightIcon className="lx-arrow" size={15} />
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

/* ══ STAT ═════════════════════════════════════════════════════════════════
   A big numeral beside its meaning. Numeric stats count up once on reveal;
   the real text stays in the DOM for assistive tech and for no-JS. */

export function Stat({
  value,
  suffix = "",
  prefix = "",
  title,
  caption,
}: {
  value: number
  suffix?: string
  prefix?: string
  title: string
  caption: string
}) {
  const { ref, inView } = useInView<HTMLLIElement>("-8% 0px")
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
    <li className="lx-fact" ref={ref}>
      <div className="lx-stat-n">
        {prefix}
        {shown}
        {suffix}
      </div>
      <div className="lx-stat-k">
        <strong>{title}</strong>
        {caption}
      </div>
    </li>
  )
}
