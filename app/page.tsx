import { FlickeringGrid } from "@/components/ui/flickering-grid-hero"
import { DotFlowCta } from "@/components/landing/dot-flow-cta"
import { LandingCta } from "@/components/landing/landing-cta"
import { WaitlistProvider } from "@/components/waitlist/waitlist-provider"
import { FaqAccordion } from "@/components/ui/faq-accordion"

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
    description: "Free to start",
  },
  //5 invoices every month, no credit card. Sign up in seconds and you're inside the editor.
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
      <header className="sticky top-0 z-50 w-full pt-6 pb-4 px-4 sm:px-6 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between px-3 py-3 pr-4 rounded-full bg-[rgba(250,250,247,0.7)] backdrop-blur-xl border border-[var(--lp-border)] shadow-[0_8px_32px_rgba(14,17,23,0.04)] w-full max-w-5xl transition-all">
          <div className="flex items-center gap-10 pl-4">
            <span className="font-serif italic text-[1.4rem] text-[var(--lp-ink)] leading-none mt-0.5">billy</span>
            <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[var(--lp-ink-2)] font-sans">
              <a href="#" className="hover:text-[var(--lp-ink)] transition-colors">Features</a>
              <a href="#" className="hover:text-[var(--lp-ink)] transition-colors">Templates</a>
              <a href="#" className="hover:text-[var(--lp-ink)] transition-colors">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hidden sm:block text-[13px] font-medium text-[var(--lp-ink-2)] font-sans hover:text-[var(--lp-ink)] transition-colors pr-2">Sign in</a>
            <LandingCta variant="nav-pill" label="Join the waitlist" className="!px-5 !py-2.5 !text-[13px] shadow-sm" />
          </div>
        </nav>
      </header>

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
          <DotFlowCta />
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
          <div className="grid grid-cols-[1fr_1.4fr] gap-16 items-start max-lg:grid-cols-1 max-lg:gap-8">
            <div className="max-lg:static">
              <div className="landing-section-label">Common questions</div>
              <h2 className="landing-section-title mt-5">
                Things people ask
                <br />
                before signing up.
              </h2>
              <p className="landing-section-sub mt-4">
                Quick answers to the most-asked questions. Still curious? Join the
                waitlist and we&apos;ll be in touch.
              </p>
            </div>

            <div className="landing-faq-list">
              <FaqAccordion>
                {faqs.map((f) => (
                  <>
                    <summary>
                      <span>{f.q}</span>
                      <span className="landing-faq-icon" aria-hidden="true" />
                    </summary>
                    <div className="landing-faq-answer">{f.a}</div>
                  </>
                ))}
              </FaqAccordion>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <section className="landing-cta-section relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 !p-12 sm:!p-20 lg:!p-32">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
          
          <div className="landing-cta-inner relative z-10">
            <div className="landing-section-label border border-white/20 inline-flex px-3 py-1 rounded-full mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
              Get started
            </div>
            <h2 className="landing-cta-title" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.5rem" }}>
              Your next invoice,
              <br />
              <em>ready in minutes.</em>
            </h2>
            <p className="landing-cta-sub max-w-lg mx-auto" style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2.5rem" }}>
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
      </div>

      {/* ── Footer ── */}
      <footer className="bg-transparent border-t border-[var(--lp-border)] pt-16 pb-8 px-6 sm:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 mb-16">
            <div className="flex flex-col gap-6 max-w-sm">
              <span className="font-serif italic text-4xl text-[var(--lp-ink)] tracking-tight">billy</span>
              <p className="text-[var(--lp-ink-2)] text-sm leading-relaxed">
                The direct-manipulation invoice editor for freelancers and small businesses. Beautiful, print-ready, and simple.
              </p>
            </div>
            
            <div className="flex gap-12 sm:gap-24 text-sm text-[var(--lp-ink-2)]">
              <div className="flex flex-col gap-4">
                <span className="font-sans font-bold text-[var(--lp-ink)] uppercase tracking-[0.15em] text-[0.6875rem]">Product</span>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Features</a>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Templates</a>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Pricing</a>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Waitlist</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-sans font-bold text-[var(--lp-ink)] uppercase tracking-[0.15em] text-[0.6875rem]">Company</span>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Twitter</a>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Contact</a>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[var(--lp-teal)] transition-colors">Terms</a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[var(--lp-border)] text-xs text-[var(--lp-ink-3)] font-sans">
            <span>© {new Date().getFullYear()} · The invoice editor for everyone.</span>
            <div className="flex gap-4">
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </WaitlistProvider>
  )
}
