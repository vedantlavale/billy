import type { Metadata } from "next"
import Link from "next/link"

import { Brand } from "@/components/brand"
import { EarlyBirdsGrid } from "@/components/founders/early-birds-grid"
import { YouAreFounder } from "@/components/founders/you-are-founder"
import {
  DoodleCurlArrow,
  DoodleBubble,
  DoodlePaperPlane,
  DoodleSparkles,
  DoodleSquiggleFlourish,
  DoodleStamp,
  DoodleStarBubble,
  DoodleUnderlineSquiggle,
} from "@/components/landing/doodles"
import { Cta, LandingNav } from "@/components/landing/landing-chrome"
import { Reveal } from "@/components/landing/reveal"
import founders from "@/content/founders.json"
import type { EarlyBird } from "@/lib/early-birds"

export const metadata: Metadata = {
  title: "Billy | Early birds",
  description: "The first people to believe in billy, before it launched.",
}

/**
 * The early birds wall. The list is written on launch day by
 * scripts/founders/launch.ts: everyone on it, as their number and a face
 * generated from it, with a name only for people who gave one. No emails.
 */
export default function EarlyBirdsPage() {
  const list = founders as EarlyBird[]
  return (
    <main className="lx" id="top">
      <LandingNav minimal />

      <section className="lx-founders">
        <div className="lx-fd-doodles" aria-hidden>
          <DoodleSparkles className="lx-doodle lx-fd-sparkles" />
          <DoodleBubble text="Thank you!" className="lx-doodle lx-fd-bubble" />
          <DoodleCurlArrow className="lx-doodle lx-fd-arrow lx-draw" />
          <DoodlePaperPlane className="lx-doodle lx-fd-plane" />
          <DoodleStarBubble className="lx-doodle lx-fd-stars" />
          <DoodleSquiggleFlourish className="lx-doodle lx-fd-flourish" />
        </div>

        <header className="lx-founders-head">
          <h1 className="lx-founders-title">
            Early{" "}
            <span className="lx-underline">
              birds
              <DoodleUnderlineSquiggle className="lx-draw" />
            </span>
          </h1>
          <p className="lx-founders-lead">The first people to believe in billy, before it launched.</p>
          {list.length > 0 && <p className="lx-founders-count">{list.length} early birds</p>}
          <YouAreFounder list={list} />
        </header>

        {list.length === 0 ? (
          <p className="lx-founders-empty">The wall fills up on launch day.</p>
        ) : (
          <EarlyBirdsGrid list={list} />
        )}
      </section>

      <section className="lx-founders-thanks">
        <Reveal>
          <DoodleStamp className="lx-founders-stamp lx-draw" />
          <h2>Thank you for being early.</h2>
          <p>Go make something.</p>
          <Cta label="Create a free invoice" tone="primary" large />
        </Reveal>
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
