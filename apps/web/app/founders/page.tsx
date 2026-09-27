import type { Metadata } from "next"
import Link from "next/link"

import { Brand } from "@/components/brand"
import { YouAreFounder } from "@/components/founders/you-are-founder"
import { DoodleUnderlineSquiggle } from "@/components/landing/doodles"
import { LandingNav } from "@/components/landing/landing-chrome"
import founders from "@/content/founders.json"

export const metadata: Metadata = {
  title: "Billy | Founding members",
  description: "The first people to believe in billy, before it launched.",
}

type Founder = { number: number; name: string; avatar: string | null }

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "B"
}

/**
 * The founding members wall. The list is written on launch day by
 * scripts/founders/launch.ts: only people who asked to be on it, with the
 * name they gave, their number, and a Gravatar if they have one. No emails.
 */
export default function FoundersPage() {
  const list = founders as Founder[]
  return (
    <main className="lx" id="top">
      <LandingNav minimal />

      <section className="lx-founders">
        <header className="lx-founders-head">
          <h1 className="lx-founders-title">
            Founding{" "}
            <span className="lx-underline">
              members
              <DoodleUnderlineSquiggle className="lx-draw" />
            </span>
          </h1>
          <p className="lx-founders-lead">The first people to believe in billy, before it launched.</p>
          <YouAreFounder />
        </header>

        {list.length === 0 ? (
          <p className="lx-founders-empty">The wall fills up on launch day.</p>
        ) : (
          <ul className="lx-founders-grid">
            {list.map((f) => (
              <li key={f.number} className="lx-founder">
                {f.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="lx-founder-avatar" src={f.avatar} alt="" width={56} height={56} loading="lazy" />
                ) : (
                  <span className="lx-founder-avatar lx-founder-initials" aria-hidden>
                    {initials(f.name)}
                  </span>
                )}
                <span className="lx-founder-name">{f.name}</span>
                <span className="lx-founder-number">#{f.number}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="lx-footer">
        <div className="lx-footer-inner" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div className="lx-footer-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
            <Brand size="sm" />
            <Link className="lx-footer-link" href="/">
              Home
            </Link>
            <Link className="lx-footer-link" href="/editor">
              Open the editor
            </Link>
            <span style={{ marginLeft: "auto" }}>© {new Date().getFullYear()} Billy</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
