import { Fragment } from "react"
import { FlickeringGrid } from "@/components/ui/flickering-grid-hero"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { DotFlowCta } from "@/components/landing/dot-flow-cta"
import { LandingCta } from "@/components/landing/landing-cta"
import { FaqAccordion } from "@/components/ui/faq-accordion"

const features = [
  {
    icon: "✦",
    title: "Direct Inline Editing",
    description:
      "Click any field on the invoice and type. No forms, no dialogs — just edit the document itself, exactly like a live canvas.",
    className: "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2",
  },
  {
    icon: "⬡",
    title: "Pixel-Perfect PDF Export",
    description:
      "Generate polished, print-ready PDFs on our servers. They look exactly like your editor preview — no print dialog, no surprises.",
    className: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    icon: "✧",
    title: "Logo & Branding",
    description:
      "Upload your logo and customize your business details. Your brand, your invoice — saved to your account and ready whenever you need it.",
    className: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    icon: "♢",
    title: "Auto-Calculating Totals",
    description:
      "Add, remove, and edit line items freely. Taxes, discounts, and grand totals update in real time with every keystroke.",
    className: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    icon: "⦾",
    title: "Premium Templates",
    description:
      "Start with beautiful free templates. Upgrade to Pro to unlock the full collection — each one designed for print.",
    className: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    icon: "⬚",
    title: "Save & Sync",
    description:
      "Every invoice you create is saved to your account. Pick up where you left off, on any device, anytime.",
    className: "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2",
  },
]

const steps = [
  {
    step: "01",
    title: "Create your free account",
    description: "5 invoices every month, no credit card. Sign up in seconds and you're instantly inside the editor.",
  },
  {
    step: "02",
    title: "Fill in your details",
    description: "Click any field to edit it inline. Add your logo, line items, tax rates, and client details effortlessly.",
  },
  {
    step: "03",
    title: "Export as PDF",
    description: "Hit Export PDF and your polished, print-ready invoice is generated and saved — rendered pixel-perfect.",
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
    <main className="landing-page flex min-h-dvh flex-col">
        {/* ── Nav ── */}
        <header className="sticky top-0 z-50 w-full pt-5 pb-4 px-4 sm:px-6 flex justify-center pointer-events-none">
          <nav className="pointer-events-auto flex items-center justify-between px-3 py-2.5 pr-4 rounded-full bg-[rgba(255,255,255,0.82)] backdrop-blur-xl border border-[var(--lp-border)] shadow-[0_4px_24px_rgba(14,17,23,0.06)] w-full max-w-5xl transition-all">
            <div className="flex items-center gap-10 pl-4">
              <span
                className="text-[1.15rem] font-extrabold tracking-[-0.05em] leading-none text-[var(--lp-ink)]"
                style={{ fontFamily: "var(--font-outfit), var(--font-dm-sans), system-ui, sans-serif" }}
              >
                billy
              </span>
              <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[var(--lp-ink-2)] font-sans">
                <a href="#" className="hover:text-[var(--lp-ink)] transition-colors">Features</a>
                <a href="#" className="hover:text-[var(--lp-ink)] transition-colors">Templates</a>
                <a href="#" className="hover:text-[var(--lp-ink)] transition-colors">Pricing</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/login" className="hidden sm:block text-[13px] font-medium text-[var(--lp-ink-2)] font-sans hover:text-[var(--lp-ink)] transition-colors pr-2">Sign in</a>
              <LandingCta variant="nav-pill" label="Start free" className="!px-5 !py-2.5 !text-[13px] shadow-sm" />
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
            <div className="landing-hero-badge animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
              <span className="landing-hero-badge-dot"></span>
              Free during alpha · No credit card needed
            </div>

            <h1 className="landing-hero-title animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out delay-100 fill-mode-both">
              Invoicing that feels
              <br />
              <em>like editing</em>
              <br />a document.
            </h1>

            <p className="landing-hero-sub animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out delay-300 fill-mode-both">
              The direct-manipulation invoice editor for freelancers and small businesses.
              Click any field, type your details, export a beautiful PDF in under two minutes.
            </p>

            <div className="landing-hero-actions animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out delay-500 fill-mode-both">
              <DotFlowCta />
            </div>
          </div>

        </section>



        {/* ── Features ── */}
        <section className="relative py-28 px-6 lg:px-8 border-t border-[var(--lp-border)] overflow-hidden bg-white">
          {/* Subtle radial teal glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(13,115,119,0.06),transparent_70%)] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--lp-teal-light)] border border-[rgba(13,115,119,0.15)] text-[var(--lp-teal)] text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-6">
                Everything you need
              </div>
              <h2
                className="text-5xl md:text-[4rem] tracking-[-0.04em] leading-[1.05] text-[var(--lp-ink)] mb-6 max-w-2xl font-extrabold"
                style={{ fontFamily: "var(--font-outfit), var(--font-dm-sans), system-ui, sans-serif" }}
              >
                Built for the way
                <br />
                <span className="text-[var(--lp-teal)]">freelancers actually work.</span>
              </h2>
              <p className="font-sans text-[1.0625rem] text-[var(--lp-ink-3)] max-w-lg mx-auto leading-relaxed">
                Every feature crafted for a single purpose. No bloated menus, no clutter — just a clean instrument for your business.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`group bg-white rounded-2xl border border-[rgba(14,17,23,0.08)] p-6 sm:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col ${f.className}`}
                >
                  <div className="w-11 h-11 mb-6 flex items-center justify-center rounded-xl bg-[var(--lp-teal-light)] text-[var(--lp-teal)] text-lg transition-transform duration-300 group-hover:scale-110">
                    {f.icon}
                  </div>
                  <h3
                    className="text-lg text-[var(--lp-ink)] mb-2 font-bold leading-snug tracking-tight group-hover:text-[var(--lp-teal)] transition-colors"
                    style={{ fontFamily: "var(--font-outfit), var(--font-dm-sans), system-ui, sans-serif" }}
                  >
                    {f.title}
                  </h3>
                  <p className="font-sans text-sm text-[var(--lp-ink-3)] leading-relaxed mt-auto">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="bg-[var(--lp-ink)] text-white py-28 px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,115,119,0.18),transparent_50%)] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(13,115,119,0.08),transparent_50%)] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(13,115,119,0.4)] bg-[rgba(13,115,119,0.12)] text-[#5CC8CC] text-[0.6875rem] font-bold tracking-[0.15em] uppercase mb-6">
                  How it works
                </div>
                <h2
                  className="text-5xl md:text-6xl tracking-[-0.04em] leading-[1.05] max-w-lg font-extrabold"
                  style={{ fontFamily: "var(--font-outfit), var(--font-dm-sans), system-ui, sans-serif" }}
                >
                  Three steps.
                  <br />
                  <span className="text-white/70">One beautiful invoice.</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((s) => (
                <div key={s.step} className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 sm:p-9 hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-300 overflow-hidden">
                  <div
                    className="absolute -right-3 -bottom-8 text-[10rem] text-white/[0.04] leading-none select-none font-extrabold tracking-[-0.08em] group-hover:text-white/[0.06] transition-colors duration-300 pointer-events-none"
                    style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}
                  >
                    {s.step}
                  </div>

                  <div className="relative z-10">
                    <div
                      className="text-2xl text-[#5CC8CC] mb-5 font-extrabold tracking-[-0.04em]"
                      style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}
                    >
                      {s.step}
                    </div>
                    <h3
                      className="text-[1.5rem] leading-[1.2] mb-3 font-bold tracking-tight text-white"
                      style={{ fontFamily: "var(--font-outfit), var(--font-dm-sans), system-ui, sans-serif" }}
                    >
                      {s.title}
                    </h3>
                    <p className="font-sans text-white/55 leading-relaxed text-[0.9375rem]">
                      {s.description}
                    </p>
                  </div>
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
                <h2 className="landing-section-title mt-5" style={{ fontFamily: "var(--font-outfit), var(--font-dm-sans), system-ui, sans-serif" }}>
                  Things people ask
                  <br />
                  before signing up.
                </h2>
                <p className="landing-section-sub mt-4">
                  Quick answers to the most-asked questions. Still curious? Create a free
                  account and try it today.
                </p>
              </div>

              <div className="landing-faq-list">
                <FaqAccordion>
                  {faqs.map((f) => (
                    <Fragment key={f.q}>
                      <summary>
                        <span>{f.q}</span>
                        <span className="landing-faq-icon" aria-hidden="true" />
                      </summary>
                      <div className="landing-faq-answer">{f.a}</div>
                    </Fragment>
                  ))}
                </FaqAccordion>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <section className="landing-cta-section relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 !p-8 sm:!p-12 lg:!p-20">
            {/* Interactive Grid Background */}
            <InteractiveGridPattern
              className="absolute inset-0 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"
              color="rgba(255, 255, 255, 1)"
              squareSize={32}
              gridGap={2}
              maxOpacity={0.15}
              hoverRadius={180}
            />

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
                Sign up in seconds to start creating, saving, and exporting pixel-perfect invoices.
                <br />
                No credit card, no hassle — completely free during alpha.
              </p>
              <DotFlowCta />
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <footer className="bg-transparent border-t border-[var(--lp-border)] pt-16 pb-8 px-6 sm:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 mb-16">
              <div className="flex flex-col gap-6 max-w-sm">
                <span
                  className="text-2xl font-extrabold tracking-[-0.05em] text-[var(--lp-ink)]"
                  style={{ fontFamily: "var(--font-outfit), var(--font-dm-sans), system-ui, sans-serif" }}
                >
                  billy
                </span>
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
                  <a href="/signup" className="hover:text-[var(--lp-teal)] transition-colors">Sign up</a>
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
  )
}
