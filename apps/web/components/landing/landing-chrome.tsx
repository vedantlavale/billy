"use client"

import { useEffect, useState } from "react"
import { Brand } from "@/components/brand"
import { useRouter } from "next/navigation"

import { ArrowRightIcon } from "@/components/icons/rune"
import { GITHUB_REPO, GITHUB_URL } from "@/lib/links"

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

/* ══ STAR ON GITHUB ═══════════════════════════════════════════════════════
   The star count is a nice-to-have: if the API fails or is rate limited the
   button stays and the number never shows. */

/** The GitHub mark, filled, so it sits beside the stroke-style Rune icons. */
function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden focusable="false">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  )
}

const formatStars = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : String(n))

export function GitHubStar() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (typeof data?.stargazers_count === "number") setStars(data.stargazers_count)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  return (
    <a className="lx-btn lx-btn-ghost lx-star" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
      <GitHubMark />
      <span className="lx-star-label">Star on GitHub</span>
      {stars !== null && (
        <span className="lx-star-count" aria-label={`${stars} stars`}>
          {formatStars(stars)}
        </span>
      )}
    </a>
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
        <Brand />

        {!minimal && (
          <nav className="lx-nav-links" aria-label="Sections">
            <a className="lx-nav-link" href="#features">
              Features
            </a>
            <a className="lx-nav-link" href="#built-for">
              Built for
            </a>
            <a className="lx-nav-link" href="#faq">
              FAQ
            </a>
          </nav>
        )}

        <div className="lx-nav-actions">
          <GitHubStar />
          <Cta label="Create invoice" arrow={false} />
        </div>
      </div>
    </header>
  )
}
