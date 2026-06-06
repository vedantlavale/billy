import Link from "next/link"

import { FlickeringGrid } from "@/components/ui/flickering-grid-hero"

const features = [
  {
    icon: "✦",
    title: "Direct Inline Editing",
    description:
      "Click any field on the invoice and type. No forms, no dialogs — just edit the document itself, exactly like a live canvas.",
  },
  {
    icon: "⬡",
    title: "Native PDF Export",
    description:
      "Export polished, print-ready PDFs using your browser's built-in print engine. Zero extra dependencies, zero waiting.",
  },
  {
    icon: "◈",
    title: "Logo & Branding",
    description:
      "Upload your logo and customize your business details. Your brand, your invoice. Everything stays on your machine.",
  },
  {
    icon: "◇",
    title: "Auto-Calculating Totals",
    description:
      "Add, remove, and edit line items freely. Taxes, discounts, and grand totals update in real time with every keystroke.",
  },
  {
    icon: "◎",
    title: "Premium Templates",
    description:
      "Choose from beautiful invoice templates — from clean minimalist to rich editorial. Each one designed for print.",
  },
  {
    icon: "⬚",
    title: "100% Private",
    description:
      "No account. No cloud sync. No analytics. Your invoice data never leaves your browser — ever. It's yours alone.",
  },
]

const steps = [
  {
    step: "01",
    title: "Open the editor",
    description: "No installation, no sign-up. Just click and you're inside a fully working invoice editor.",
  },
  {
    step: "02",
    title: "Fill in your details",
    description: "Click any field to edit it inline. Add your logo, line items, tax rates, and client details.",
  },
  {
    step: "03",
    title: "Export as PDF",
    description: "Hit Export PDF and your polished, print-ready invoice is saved — rendered pixel-perfect.",
  },
]

const testimonials = [
  {
    quote: "The cleanest invoice tool I've ever used. No cruft, just the thing I need.",
    author: "Maya T.",
    role: "Independent Consultant",
  },
  {
    quote: "I send invoices every week. Billy cut my time in half and my PDFs look incredible.",
    author: "James R.",
    role: "Freelance Designer",
  },
  {
    quote: "Finally something that doesn't require an account just to send an invoice.",
    author: "Priya K.",
    role: "Startup Founder",
  },
]

export default function Home() {
  return (
    <main className="landing-page flex min-h-dvh flex-col">
      {/* ── Nav ── */}
      <nav className="landing-nav mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <span className="landing-wordmark">billy</span>
        <div className="flex items-center gap-3">
          <Link href="/editor" className="landing-nav-link">
            Open Editor
          </Link>
          <Link href="/editor" className="landing-cta-pill-sm">
            Try free →
          </Link>
        </div>
      </nav>

      {/* ── Ticker ── */}
      <div className="landing-ticker">
        <div className="landing-ticker-track">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="landing-ticker-segment">
              <span>No sign-up</span>
              <span className="landing-ticker-dot">✦</span>
              <span>Works offline</span>
              <span className="landing-ticker-dot">✦</span>
              <span>100% private</span>
              <span className="landing-ticker-dot">✦</span>
              <span>Free forever</span>
              <span className="landing-ticker-dot">✦</span>
              <span>Export to PDF</span>
              <span className="landing-ticker-dot">✦</span>
              <span>Beautiful templates</span>
              <span className="landing-ticker-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="landing-hero relative isolate overflow-hidden">
        <FlickeringGrid
          className="absolute inset-0 -z-10 pointer-events-none mask-[radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
          color="rgb(13, 115, 119)"
          squareSize={3}
          gridGap={4}
          maxOpacity={0.4}
          flickerChance={0.25}
        />

        <h1 className="landing-hero-title">
          Invoicing that feels
          <br />
          <em>exactly</em> like editing
          <br />a document.
        </h1>

        <p className="landing-hero-sub">
          Billy is a direct-manipulation invoice editor that lives entirely in your browser.
          Click a field, type your details, export a beautiful PDF — in under two minutes.
        </p>

        <div className="landing-hero-actions">
          <Link href="/editor" className="landing-cta-primary">
            Start editing free
          </Link>
          <Link href="/editor" className="landing-cta-ghost">
            View a demo invoice →
          </Link>
        </div>


      </section>



      {/* ── Features ── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-label">Everything you need</div>
          <h2 className="landing-section-title">
            Built for the way
            <br />
            freelancers actually work.
          </h2>
          <p className="landing-section-sub">
            Every feature was chosen because it matters. Nothing more.
          </p>

          <div className="landing-features-grid">
            {features.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <span className="landing-feature-icon">{f.icon}</span>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-section-inner">
          <div className="landing-section-label">How it works</div>
          <h2 className="landing-section-title">
            Three steps.
            <br />
            One beautiful invoice.
          </h2>
          <div className="landing-steps">
            {steps.map((s) => (
              <div key={s.step} className="landing-step">
                <div className="landing-step-number">{s.step}</div>
                <h3 className="landing-step-title">{s.title}</h3>
                <p className="landing-step-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-label">What people say</div>
          <h2 className="landing-section-title">
            Loved by freelancers
            <br />& independent founders.
          </h2>
          <div className="landing-testimonials">
            {testimonials.map((t) => (
              <div key={t.author} className="landing-testimonial">
                <div className="landing-testimonial-stars">✦ ✦ ✦ ✦ ✦</div>
                <p className="landing-testimonial-quote">"{t.quote}"</p>
                <div className="landing-testimonial-author">
                  <span className="landing-testimonial-name">{t.author}</span>
                  <span className="landing-testimonial-role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="landing-cta-section">
        <div className="landing-cta-inner">
          <div className="landing-section-label" style={{ color: "rgba(255,255,255,0.5)" }}>
            Get started
          </div>
          <h2 className="landing-cta-title">
            Your next invoice,
            <br />
            <em>ready in minutes.</em>
          </h2>
          <p className="landing-cta-sub">
            No account. No credit card. No data ever leaves your browser.
            <br />
            Just open Billy and start.
          </p>
          <Link href="/editor" className="landing-cta-button">
            Open the editor — it&apos;s free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <span className="landing-footer-brand">billy</span>
        <span className="landing-footer-copy">
          © 2026 · A lightweight invoice editor · All data stays in your browser.
        </span>
        <Link href="/editor" className="landing-footer-link">
          Open editor →
        </Link>
      </footer>
    </main>
  )
}
