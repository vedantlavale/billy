import { Fragment } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import type { SVGProps, ComponentType } from "react"

import { LandingCta } from "@/components/landing/landing-cta"
import { FaqAccordion } from "@/components/ui/faq-accordion"
import { InvoiceMock } from "@/components/landing/invoice-mock"
import {
  DoodleSpeechScribble,
  DoodleFace,
  DoodlePaidBubble,
  DoodleFlyingInvoice,
  DoodlePenStroke,
  DoodleUnderlineSquiggle,
  DoodleStamp,
  DoodleSquiggleFlourish,
  DoodlePaperStack,
  DoodlePaperPlane,
  DoodlePencilCheck,
  DoodleStarBubble,
  DoodleLandscape,
  IconType,
  IconDoc,
  IconBrush,
  IconCalc,
  IconLayers,
  IconCloud,
  IconUser,
  IconBriefcase,
  IconBulb,
  IconStore,
  IconHammer,
  IconRocket,
} from "@/components/landing/doodles"

export const metadata: Metadata = {
  title: "Billy — The simplest way to create invoices",
  description:
    "Say goodbye to invoicing headaches. Billy is the free, intuitive invoice editor — edit like a document, export pixel-perfect PDFs, get paid.",
}

type LandingIcon = ComponentType<SVGProps<SVGSVGElement>>

const features: { icon: LandingIcon; title: string; description: string }[] = [
  {
    icon: IconType,
    title: "Just start typing",
    description:
      "Billy works like a text document. Click any field on the invoice and type — no forms, no dialogs, no setup.",
  },
  {
    icon: IconDoc,
    title: "Pixel-perfect PDFs",
    description:
      "Export polished, print-ready PDFs that look exactly like your preview. No print dialog, no surprises.",
  },
  {
    icon: IconBrush,
    title: "Your brand on every invoice",
    description:
      "Upload your logo and business details once — they're saved to your account and ready every time.",
  },
  {
    icon: IconCalc,
    title: "Math that does itself",
    description:
      "Add, remove, and edit line items freely. Taxes, discounts, and totals update with every keystroke.",
  },
  {
    icon: IconLayers,
    title: "Templates for every trade",
    description:
      "Start from beautiful free templates, each one designed for print. Pro unlocks the full collection.",
  },
  {
    icon: IconCloud,
    title: "Saved and synced",
    description:
      "Every invoice lives in your account. Pick up where you left off, on any device, anytime.",
  },
]

const useCases: { icon: LandingIcon; title: string; items: string[] }[] = [
  {
    icon: IconUser,
    title: "Freelancers",
    items: ["Bill clients in minutes", "Look professional from day one", "Keep every invoice in one place"],
  },
  {
    icon: IconBriefcase,
    title: "Studios & agencies",
    items: ["Put your brand on every invoice", "Reuse templates across clients", "Keep the whole team consistent"],
  },
  {
    icon: IconBulb,
    title: "Consultants",
    items: ["Itemize hours and retainers", "Handle taxes cleanly", "Send from anywhere"],
  },
  {
    icon: IconStore,
    title: "Small shops",
    items: ["Skip the accounting software", "Totals calculated for you", "Print-ready in one click"],
  },
  {
    icon: IconHammer,
    title: "Contractors",
    items: ["Add materials and labor", "Duplicate past invoices", "Get paid without paperwork"],
  },
  {
    icon: IconRocket,
    title: "Side projects",
    items: ["Free to start, no credit card", "Your first invoice in two minutes", "Grows with you when you do"],
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
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link href="/" className="landing-wordmark">billy*</Link>
          <div className="flex items-center gap-7">
            <a href="#features" className="landing-nav-link max-sm:hidden">Features</a>
            <a href="#faq" className="landing-nav-link max-sm:hidden">FAQ</a>
            <Link href="/login" className="landing-nav-link">Log in</Link>
            <LandingCta variant="nav-pill" label="Create invoice" />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <DoodleSpeechScribble className="landing-doodle left-[4%] top-[22%] w-40 -rotate-6" />
        <DoodleFace className="landing-doodle left-[9%] top-[52%] w-28 rotate-3" />
        <DoodlePenStroke className="landing-doodle landing-doodle--accent left-[19%] top-[13%] w-8 rotate-12" />
        <DoodlePaidBubble className="landing-doodle right-[3%] top-[20%] w-48 rotate-2" />
        <DoodleFlyingInvoice className="landing-doodle right-[10%] top-[54%] w-32 -rotate-3" />
        <DoodlePenStroke className="landing-doodle right-[21%] top-[12%] w-8 -rotate-45" />

        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            The{" "}
            <span className="landing-squiggle">
              simplest
              <DoodleUnderlineSquiggle />
            </span>{" "}
            way
            <br />
            to create invoices
          </h1>

          <p className="landing-hero-sub">
            Say goodbye to invoicing headaches. Meet Billy — the free,
            intuitive invoice editor you&apos;ve been looking for.
          </p>

          <div className="landing-hero-actions">
            <LandingCta variant="hero-primary" label="Create a free invoice →" />
          </div>
          <p className="landing-microcopy">Free during alpha · No credit card required</p>
        </div>

        <InvoiceMock />
      </section>

      {/* ── Social proof strip ── */}
      <section className="landing-strip">
        <p className="landing-strip-text">
          Built for freelancers, studios, and small businesses everywhere
        </p>
        <div className="relative inline-block">
          <div className="landing-badge-dark">
            <div>
              <span className="landing-badge-dark-label">Free during alpha</span>
              <span className="landing-badge-dark-title">Every Pro feature unlocked</span>
            </div>
          </div>
          <DoodleStamp className="landing-doodle -right-28 -top-6 w-20 rotate-12" />
        </div>
      </section>

      {/* ── An invoicing tool like no other ── */}
      <section className="landing-section" id="features">
        <div className="landing-section-inner">
          <DoodleSquiggleFlourish className="landing-doodle landing-doodle--accent right-[4%] -top-2 w-24 -rotate-6" />
          <h2 className="landing-section-title">
            An invoicing tool
            <br />
            like no other
          </h2>
          <p className="landing-section-sub">
            Billy makes it simple for anyone to send polished invoices. No
            accounting software to learn — just edit the page like you would a doc.
          </p>

          <div className="landing-highlight-card">
            <h3 className="landing-highlight-title">Your invoice, ready in minutes</h3>
            <p className="landing-highlight-body">
              Paperwork getting in the way? Not anymore. Click any field and
              type your details, watch the totals work themselves out, then
              export a pixel-perfect PDF — all without leaving your browser.
            </p>
            <DoodleLandscape className="landing-highlight-art" />
          </div>

          <div className="landing-feature-grid">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="landing-feature-card">
                  <span className="landing-feature-icon">
                    <Icon width={26} height={26} />
                  </span>
                  <h3 className="landing-feature-title">{f.title}</h3>
                  <p className="landing-feature-desc">{f.description}</p>
                </div>
              )
            })}
          </div>
          <DoodlePaperStack className="landing-doodle -left-32 bottom-8 w-24 -rotate-6" />
        </div>
      </section>

      {/* ── Designed for you ── */}
      <section className="landing-section" id="designed">
        <div className="landing-section-inner">
          <DoodlePaperPlane className="landing-doodle right-[2%] -top-12 w-32 -rotate-6" />
          <h2 className="landing-section-title">Designed for you</h2>
          <p className="landing-section-sub">
            Whatever you make, sell, or fix — start from scratch or grab a
            template that fits.
          </p>

          <div className="landing-usecase-card">
            <div className="landing-usecase-grid">
              {useCases.map((u) => {
                const Icon = u.icon
                return (
                  <div key={u.title}>
                    <span className="landing-usecase-icon">
                      <Icon width={26} height={26} />
                    </span>
                    <h3 className="landing-usecase-title">{u.title}</h3>
                    {u.items.map((item) => (
                      <p key={item} className="landing-usecase-item">· {item}</p>
                    ))}
                  </div>
                )
              })}
            </div>
            <Link href="/signup" className="landing-btn-dark">Browse templates</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="landing-section">
        <div className="landing-testimonial">
          <DoodleStarBubble className="landing-doodle -right-44 -top-6 w-36 rotate-6" />
          <p className="landing-testimonial-quote">
            &ldquo;Billy turned invoicing from a Sunday-night chore into a
            two-minute job. I send it, I get paid, I get back to work.&rdquo;
          </p>
          <div className="landing-testimonial-avatar">M</div>
          <div className="landing-testimonial-name">Maya</div>
          <div className="landing-testimonial-role">Freelance designer</div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="landing-section" id="faq">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Questions &amp; answers</h2>
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
      </section>

      {/* ── Final CTA ── */}
      <section className="landing-final">
        <DoodlePencilCheck className="landing-doodle left-[12%] top-[18%] w-28 -rotate-6" />
        <h2 className="landing-final-title">
          Your next invoice is
          <br />
          minutes away
        </h2>
        <div className="landing-hero-actions">
          <LandingCta variant="final-primary" label="Create a free invoice →" />
        </div>
        <p className="landing-microcopy">Free during alpha · No credit card required</p>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer-big">
        <div className="landing-footer-grid">
          <div className="flex max-w-xs flex-col gap-4">
            <span className="landing-footer-brand">billy*</span>
            <p className="landing-footer-copy">The simplest way to create invoices.</p>
            <p className="landing-footer-copy">© {new Date().getFullYear()} Billy</p>
          </div>

          <div className="flex flex-wrap gap-14 sm:gap-20">
            <div className="landing-footer-col">
              <span className="landing-footer-head">Product</span>
              <a href="#features" className="landing-footer-link">Features</a>
              <a href="#designed" className="landing-footer-link">Templates</a>
              <Link href="/signup" className="landing-footer-link">Pricing</Link>
              <Link href="/signup" className="landing-footer-link">Sign up</Link>
            </div>
            <div className="landing-footer-col">
              <span className="landing-footer-head">Help</span>
              <a href="#faq" className="landing-footer-link">Questions &amp; answers</a>
              <Link href="/login" className="landing-footer-link">Log in</Link>
            </div>
            <div className="landing-footer-col">
              <span className="landing-footer-head">Company</span>
              <a href="#" className="landing-footer-link">Contact</a>
              <a href="#" className="landing-footer-link">Privacy</a>
              <a href="#" className="landing-footer-link">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
