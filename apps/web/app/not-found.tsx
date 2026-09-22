import Link from "next/link"

import { Cta, LandingNav } from "@/components/landing/landing-chrome"

export default function NotFound() {
  return (
    <main className="lx" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <LandingNav minimal />

      <section className="lx-hero" style={{ flex: 1, display: "flex" }}>
        <div
          className="lx-panel lx-panel--dark"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            className="lx-panel-body"
            style={{ textAlign: "center", display: "grid", justifyItems: "center", gap: 22 }}
          >
            <p className="lx-eyebrow">Error 404</p>

            <h1 className="lx-display" style={{ maxWidth: "18ch" }}>
              <span className="lx-dim">This page isn&apos;t</span> in our books
            </h1>

            <p className="lx-hero-sub" style={{ marginTop: 0 }}>
              The link may be broken, or the page moved. Your invoice drafts are untouched
              — they live in your browser, not on this page.
            </p>

            <div className="lx-hero-actions" style={{ justifyContent: "center", marginTop: 12 }}>
              <Cta label="Create an invoice" tone="primary" large />
              <Link className="lx-btn lx-btn-onDark lx-btn-lg" href="/">
                Back home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="lx-footer" style={{ marginTop: "var(--lx-gutter)" }}>
        <div
          className="lx-footer-grid"
          style={{ gridTemplateColumns: "1fr auto", alignItems: "center", paddingBottom: 28 }}
        >
          <Link href="/" className="lx-wordmark">
            billy<i>*</i>
          </Link>
          <p className="lx-small" style={{ color: "var(--lx-ink-3)" }}>
            © {new Date().getFullYear()} Billy
          </p>
        </div>
      </footer>
    </main>
  )
}
