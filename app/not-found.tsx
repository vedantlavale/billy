import Link from "next/link"

import { LandingCta } from "@/components/landing/landing-cta"

export default function NotFound() {
  return (
    <main className="landing-page flex min-h-dvh flex-col">
      <nav className="landing-nav mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="landing-wordmark no-underline">billy</Link>
        <LandingCta variant="nav-pill" label="Start free →" />
      </nav>

      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="landing-hero-title" style={{ maxWidth: 700 }}>
          This page doesn&apos;t
          <br />
          <em>exist</em> in our books.
        </h1>

        <p className="landing-hero-sub">
          The link you followed might be broken, or the page may have been moved.
          Either way, you can head back home and start fresh.
        </p>

        <div className="landing-hero-actions" style={{ marginBottom: 0 }}>
          <Link href="/" className="landing-cta-primary">
            Back to home
          </Link>
          <LandingCta variant="hero-ghost" label="Sign up →" />
        </div>
      </section>

      <footer className="landing-footer">
        <span className="landing-footer-brand">billy</span>
        <span className="landing-footer-copy">© 2026 · A lightweight invoice editor</span>
        <LandingCta variant="footer-link" label="Sign up →" />
      </footer>
    </main>
  )
}
