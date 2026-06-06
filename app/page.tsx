import { FlickeringGrid } from "@/components/ui/flickering-grid-hero"
import { LandingCta } from "@/components/landing/landing-cta"
import { WaitlistProvider } from "@/components/waitlist/waitlist-provider"

const features = [
  {
    icon: "✦",
    title: "Direct Inline Editing",
    description:
      "Click any field on the invoice and type. No forms, no dialogs — just edit the document itself, exactly like a live canvas.",
  },
  {
    icon: "⬡",
    title: "Pixel-Perfect PDF Export",
    description:
      "Generate polished, print-ready PDFs on our servers. They look exactly like your editor preview — no print dialog, no surprises, no extra tools to install.",
  },
  {
    icon: "◈",
    title: "Logo & Branding",
    description:
      "Upload your logo and customize your business details. Your brand, your invoice — saved to your account and ready whenever you need it.",
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
      "Start with beautiful free templates. Upgrade to Pro to unlock the full collection — each one designed for print.",
  },
  {
    icon: "⬚",
    title: "Save & Sync",
    description:
      "Every invoice you create is saved to your account. Pick up where you left off, on any device, anytime.",
  },
]

const steps = [
  {
    step: "01",
    title: "Create your free account",
    description: "Free to start — 5 invoices every month, no credit card. Sign up in seconds and you're inside the editor.",
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

const faqs = [
  {
    q: "Is there a free tier?",
    a: "Yes. The free tier includes 3 invoice templates and 5 invoices every month — no credit card required. Upgrade to Pro whenever you need more.",
  },
  {
    q: "Where is my invoice data stored?",
    a: "Every invoice you create is saved to your billy account, encrypted in transit and at rest. Sign in from any device to pick up right where you left off.",
  },
  {
    q: "What happens if I hit the free limit?",
    a: "You can still view, edit, and export every invoice you've already created. To start a new one, either upgrade to Pro for unlimited invoicing, or wait until your monthly reset.",
  },
  {
    q: "What's included in Pro?",
    a: "Pro removes the monthly invoice cap, unlocks the full template library, and adds premium features like GST handling and custom branding.",
  },
  {
    q: "Can I cancel my Pro plan anytime?",
    a: "Yes. Cancel from your account settings in a couple of clicks — you'll keep Pro access until the end of your current billing period, then drop back to the free tier with all your invoices intact.",
  },
]

export default function Home() {
  return (
    <WaitlistProvider>
    <main className="landing-page flex min-h-dvh flex-col">
      {/* ── Nav ── */}
      <nav className="landing-nav mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <span className="landing-wordmark">billy</span>
        <div className="flex items-center gap-3">
          {/* <LandingCta variant="nav-link" label="Open Editor" /> */}
          <LandingCta variant="nav-pill" label="Join the waitlist →" />
        </div>
      </nav>

      {/* ── Ticker ── */}
      <div className="landing-ticker">
        <div className="landing-ticker-track">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="landing-ticker-segment">
              <span>Free to start</span>
              <span className="landing-ticker-dot">✦</span>
              <span>Cloud sync</span>
              <span className="landing-ticker-dot">✦</span>
              <span>Multi-currency</span>
              <span className="landing-ticker-dot">✦</span>
              <span>Pro templates</span>
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
          className="absolute inset-0 -z-10 pointer-events-none mask-[radial-gradient(ellipse_50%_60%_at_center,black_25%,transparent_85%)]"
          color="rgb(13, 115, 119)"
          squareSize={3}
          gridGap={4}
          maxOpacity={0.4}
          flickerChance={0.25}
        />

        <div className="landing-hero-content">
        <h1 className="landing-hero-title">
          Invoicing that feels
          <br />
          <em>exactly</em> like editing
          <br />a document.
        </h1>

        <p className="landing-hero-sub">
          The direct-manipulation invoice editor for freelancers and small businesses.
          Click a field, type your details, export a beautiful PDF — in under two minutes.
        </p>

        <div className="landing-hero-actions">
          <LandingCta variant="hero-primary" label="Join the waitlist" />
          <a href="#features" className="landing-cta-ghost">
            See what&apos;s coming ↓
          </a>
        </div>
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

      {/* ── FAQ ── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-label">Common questions</div>
          <h2 className="landing-section-title">
            Things people ask
            <br />
            before signing up.
          </h2>
          <p className="landing-section-sub">
            Quick answers to the most-asked questions. Still curious? Join the
            waitlist and we&apos;ll be in touch.
          </p>

          <div className="landing-faq-list">
            {faqs.map((f) => (
              <details key={f.q} className="landing-faq-item">
                <summary>
                  <span>{f.q}</span>
                  <span className="landing-faq-icon" aria-hidden="true" />
                </summary>
                <div className="landing-faq-answer">{f.a}</div>
              </details>
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
            We&apos;re putting the finishing touches on billy. Drop your email
            and we&apos;ll let you know the moment we open the doors.
            <br />
            No spam, no credit card, no wait — just first in line.
          </p>
          <LandingCta
            variant="final-primary"
            label="Join the waitlist — it's free"
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <span className="landing-footer-brand">billy</span>
        <span className="landing-footer-copy">
          © 2026 · The invoice editor for freelancers and small businesses.
        </span>
        <LandingCta variant="footer-link" label="Join the waitlist →" />
      </footer>
    </main>
    </WaitlistProvider>
  )
}
