import Link from "next/link"

import { Brand } from "@/components/brand"

import { Cta, LandingNav } from "@/components/landing/landing-chrome"
import { DoodlePaperStack } from "@/components/landing/doodles"

export default function NotFound() {
  return (
    <main className="lx" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <LandingNav minimal />

      <section
        className="lx-hero"
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 64 }}
      >
        <div className="lx-hero-copy">
          <DoodlePaperStack aria-hidden="true" style={{ width: 120, marginBottom: 28 }} />
          <span className="lx-chip">Error 404</span>

          <h1 className="lx-display" style={{ maxWidth: "16ch", marginTop: 24 }}>
            This page isn&apos;t in our books
          </h1>

          <p className="lx-lead">
            The link may be broken, or the page moved. Your invoice drafts are untouched, since
            they live in your browser.
          </p>

          <div className="lx-hero-actions">
            <Cta label="Create an invoice" tone="primary" large />
            <Link className="lx-btn lx-btn-ghost lx-btn-lg" href="/">
              Back home
            </Link>
          </div>
        </div>
      </section>

      <footer className="lx-footer" style={{ marginTop: 0 }}>
        <div className="lx-footer-inner" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div className="lx-footer-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
            <Brand size="sm" />
            <span style={{ marginLeft: "auto" }}>© {new Date().getFullYear()} Billy</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
