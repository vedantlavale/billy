import { Fragment } from "react"
import { FlickeringGrid } from "@/components/ui/flickering-grid-hero"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { DrawLineText } from "@/components/ui/draw-line-text"
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
    <WaitlistProvider>
      <main className="landing-page flex min-h-dvh flex-col">
        {/* ── Nav ── */}
        <header className="sticky top-0 z-50 w-full pt-6 pb-4 px-4 sm:px-6 flex justify-center pointer-events-none">
          <nav className="pointer-events-auto flex items-center justify-between px-3 py-3 pr-4 rounded-full bg-[rgba(250,250,247,0.7)] backdrop-blur-xl border border-[var(--lp-border)] shadow-[0_8px_32px_rgba(14,17,23,0.04)] w-full max-w-5xl transition-all">
            <div className="flex items-center gap-10 pl-4">
              <div className="font-serif italic leading-none mt-0.5">
                <DrawLineText text="billy" fontSize={24} color="var(--lp-ink)" strokeWidth={0.8} letterSpacing={1} />
              </div>
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
            <h1 className="landing-hero-title animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
              Invoicing that feels
              <br />
              <em>exactly</em> like editing
              <br />a document.
            </h1>

            <p className="landing-hero-sub animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out delay-300 fill-mode-both">
              The direct-manipulation invoice editor for freelancers and small businesses.
              Click a field, type your details, export a beautiful PDF — in under two minutes.
            </p>

            <div className="landing-hero-actions animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out delay-500 fill-mode-both">
              <DotFlowCta />
            </div>
          </div>

        </section>



        {/* ── Features ── */}
        <section className="relative py-32 px-6 lg:px-8 border-t border-[var(--lp-border)] overflow-hidden bg-[#Fdfdfa]">
          {/* Sandpaper Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-multiply"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          ></div>

          {/* Subtle radial glow to give depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7),transparent_80%)] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-24 flex flex-col items-center">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[var(--lp-teal)] opacity-30"></div>
                <span className="font-sans font-bold text-[var(--lp-teal)] uppercase tracking-[0.2em] text-[0.6875rem]">
                  Everything you need
                </span>
                <div className="h-[1px] w-12 bg-[var(--lp-teal)] opacity-30"></div>
              </div>
              <h2 className="font-serif text-5xl md:text-[4rem] tracking-tight leading-[1.05] text-[var(--lp-ink)] mb-8 max-w-2xl">
                Built for the way
                <br />
                <em className="italic opacity-90 text-[var(--lp-teal)]">freelancers actually work.</em>
              </h2>
              <p className="font-sans text-[1.125rem] text-[var(--lp-ink-2)] max-w-xl mx-auto leading-relaxed">
                Every feature was thoughtfully crafted to serve a single purpose. No bloated menus, no clutter — just an elegant instrument for your business.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`group relative bg-[#FAFAF7]/80 backdrop-blur-md p-5 sm:p-6 md:p-10 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(14,17,23,0.05)] transition-all duration-500 flex flex-col ${f.className}`}
                >
                  {/* Outer classic border */}
                  <div className="absolute inset-0 border border-[var(--lp-border)] pointer-events-none transition-colors group-hover:border-[var(--lp-teal)]/20"></div>

                  {/* Inner decorative border */}
                  <div className="absolute inset-2 border border-[var(--lp-border)] opacity-40 pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 mb-4 sm:mb-8 flex items-center justify-center rounded-full bg-white text-[var(--lp-teal)] text-lg sm:text-xl border border-[var(--lp-border)] shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:border-[var(--lp-teal)]/30">
                      {f.icon}
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[var(--lp-ink)] mb-2 sm:mb-4 group-hover:text-[var(--lp-teal)] transition-colors leading-[1.1] sm:leading-[1.2]">
                      {f.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[0.9375rem] text-[var(--lp-ink-2)] leading-[1.6] sm:leading-[1.75] mt-auto">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="bg-[var(--lp-ink)] text-white py-32 px-6 lg:px-8 relative overflow-hidden">
          {/* Subtle background gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,115,119,0.15),transparent_50%)] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div>
                <div className="font-sans font-bold text-[var(--lp-teal)] uppercase tracking-[0.15em] text-[0.6875rem] mb-6">
                  How it works
                </div>
                <h2 className="font-serif text-5xl md:text-6xl tracking-tight leading-[1.05] max-w-lg">
                  Three steps.
                  <br />
                  <em className="text-white/80 italic">One beautiful invoice.</em>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden">
                  {/* Large watermark number */}
                  <div className="absolute -right-4 -bottom-10 font-serif text-[12rem] text-white/[0.03] leading-none select-none group-hover:text-white/[0.05] transition-colors duration-500 pointer-events-none">
                    {s.step}
                  </div>

                  <div className="relative z-10">
                    <div className="font-serif text-2xl text-[var(--lp-teal)] mb-6 opacity-80">
                      {s.step}
                    </div>
                    <h3 className="font-serif text-[1.65rem] leading-[1.2] mb-4 text-white">
                      {s.title}
                    </h3>
                    <p className="font-sans text-white/60 leading-relaxed text-[0.95rem]">
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
                We&apos;re putting the finishing touches on billy. Drop your email
                and we&apos;ll let you know the moment we open the doors.
                <br />
                No spam, no credit card, no wait — just first in line.
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
                <DrawLineText text='billy' className="font-serif italic text-4xl text-[var(--lp-ink)] tracking-tight">billy</DrawLineText>
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
