import type { Metadata } from "next"
import Link from "next/link"

import { TEMPLATES } from "@billy/invoice-core"

import { Cta, LandingNav, Stat } from "@/components/landing/landing-chrome"
import { LiveInvoice } from "@/components/landing/live-invoice"
import { CircleUserIcon, MessageSquareTextIcon, PackageIcon, UsersIcon } from "@/components/icons/rune"
import { Reveal } from "@/components/landing/reveal"
import { ExportScene, PrivacyScene, ThemeScene, TypeScene } from "@/components/landing/step-scenes"
import {
  DoodleCoin,
  DoodlePaperPlane,
  DoodlePencilCheck,
  DoodleSparkles,
  DoodleUnderlineSquiggle,
} from "@/components/landing/doodles"

export const metadata: Metadata = {
  title: "Billy — Invoicing that feels like typing a document",
  description:
    "Edit an invoice like a document and export a print-ready PDF. Runs entirely in your browser: no account, no server, nothing uploaded.",
}

/* Copy note: Billy is fully client-side (see README). Every claim below is one
   the build can actually keep — no accounts, sync or "encrypted at rest" — and
   the absence of a backend is the strongest thing we have to say. */

const TRADES = [
  "Freelance designers",
  "Developers",
  "Photographers",
  "Consultants",
  "Contractors",
  "Studios",
  "Copywriters",
  "Small agencies",
  "Tutors",
  "Side projects",
]

const USES = [
  {
    icon: CircleUserIcon,
    title: "Freelancers",
    items: ["Bill a client in a couple of minutes", "Look established from invoice one", "Keep a local draft to reuse"],
  },
  {
    icon: UsersIcon,
    title: "Studios & agencies",
    items: ["Your logo on every invoice", "One template across clients", "PO numbers when clients ask"],
  },
  {
    icon: MessageSquareTextIcon,
    title: "Consultants",
    items: ["Itemise hours and retainers", "GST, CGST/SGST or IGST lines", "Bank details in the footer"],
  },
  {
    icon: PackageIcon,
    title: "Contractors",
    items: ["Split materials from labour", "Stamp or sign digitally", "Export and send, done"],
  },
]

const FAQS = [
  {
    q: "Do I need an account?",
    a: "No. There is no sign-up, no login and no billing. Opening the editor is the whole onboarding — your first invoice is about a minute away.",
  },
  {
    q: "Where does my invoice data go?",
    a: "Nowhere. Billy is fully client-side: your invoice, client details and any logo you add live in your browser and are kept as a local draft. There is no backend to upload them to, which is also why nobody — including us — can read them.",
  },
  {
    q: "What do I actually get out of it?",
    a: "A print-ready PDF, generated in the browser, that matches the preview exactly. No watermark and no export limit.",
  },
  {
    q: "Does it handle GST?",
    a: "Yes. Turn on GSTIN and an HSN/SAC column, then choose CGST + SGST for same-state or IGST for inter-state supplies. A reverse-charge note is one switch away.",
  },
  {
    q: "Is it really free?",
    a: "Billy is free and open-source, and free during alpha with every feature unlocked. If paid plans arrive later, anything you have already made stays yours and stays local.",
  },
  {
    q: "What happens if I clear my browser data?",
    a: "The local draft goes with it, so export a PDF for anything you need to keep. That is the honest trade-off for never uploading your data.",
  },
]

/** Four real template palettes, straight from invoice-core, for step 2. */
const SCENE_PALETTES = TEMPLATES.filter((t) => ["clean", "modern-green", "minimal-teal", "corporate-blue"].includes(t.id)).map(
  (t) => ({
    paper: t.colors.paper,
    // Clean has no header band (primary is "transparent"); show its accent instead.
    primary: t.colors.primary === "transparent" ? t.colors.accent : t.colors.primary,
    accent: t.colors.accent,
  }),
)

export default function Home() {
  return (
    <main className="lx">
      <LandingNav />

      {/* ═══ HERO — centered promise above the real product ═══ */}
      <section className="lx-hero">
        <div className="lx-hero-copy">
          <DoodleSparkles className="lx-doodle lx-hero-sparkles" />
          <DoodleCoin className="lx-doodle lx-hero-coin" />

          <Reveal>
            <span className="lx-chip">
              <span className="lx-chip-dot" aria-hidden="true" />
              Free · No account · Nothing uploaded
            </span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="lx-display lx-hero-display">
              Invoicing that feels like{" "}
              <span className="lx-underline">
                typing a document
                <DoodleUnderlineSquiggle className="lx-draw" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="lx-lead">
              Click any line and write. Totals settle themselves. Download a print-ready PDF,
              all inside this tab.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="lx-hero-actions">
              <Cta label="Create a free invoice" tone="primary" large />
              <a className="lx-btn lx-btn-ghost lx-btn-lg" href="#how">
                See how it works
              </a>
            </div>
            <p className="lx-hero-note">Runs entirely in your browser. Open source.</p>
          </Reveal>
        </div>

        <Reveal delay={240} className="lx-stage">
          <LiveInvoice />
        </Reveal>
      </section>

      {/* ═══ TRADES ═══ */}
      <section className="lx-trades" id="built-for" aria-labelledby="trades-title">
        <Reveal>
          <p className="lx-small" id="trades-title" style={{ fontWeight: 600 }}>
            Made for people who bill by the job
          </p>
          <ul className="lx-trades-list">
            {TRADES.map((trade) => (
              <li key={trade} className="lx-chip">
                {trade}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ═══ HOW IT WORKS — three steps, each with its own little proof ═══ */}
      <section className="lx-section" id="how">
        <Reveal className="lx-section-head">
          <p className="lx-kicker">How it works</p>
          <h2 className="lx-h2">Three steps. Nothing to set up.</h2>
        </Reveal>

        <ol className="lx-steps">
          <Reveal as="li" className="lx-step">
            <span className="lx-step-num">1</span>
            <h3 className="lx-h3">Click anything and type</h3>
            <p className="lx-body">
              No forms and no field labels to hunt for. The invoice on screen is the document
              you edit.
            </p>
            <div className="lx-well">
              <TypeScene />
            </div>
          </Reveal>

          <Reveal as="li" delay={80} className="lx-step">
            <span className="lx-step-num">2</span>
            <h3 className="lx-h3">Pick a look</h3>
            <p className="lx-body">
              Six templates, your logo and your currency. GST fields turn on when you need
              them.
            </p>
            <div className="lx-well">
              <ThemeScene palettes={SCENE_PALETTES} />
            </div>
          </Reveal>

          <Reveal as="li" delay={160} className="lx-step">
            <span className="lx-step-num">3</span>
            <h3 className="lx-h3">Download the PDF</h3>
            <p className="lx-body">
              What you see is exactly what you get. No print dialog, no watermark, no limit.
            </p>
            <div className="lx-well">
              <ExportScene />
            </div>
          </Reveal>
        </ol>
      </section>

      {/* ═══ PRIVACY — the argument, then the numbers ═══ */}
      <section className="lx-section">
        <div className="lx-split">
          <Reveal className="lx-privacy-head">
            <p className="lx-kicker">Private by design</p>
            <h2 className="lx-h2">Your numbers never leave this tab.</h2>
            <p className="lx-body">
              Most invoicing tools want an account, a subscription and your client list before
              they print one page. Billy has no backend at all, so there is nothing to sign up
              for, nothing to breach and nothing to sync.
            </p>
            <div className="lx-privacy-scene">
              <PrivacyScene />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ul className="lx-facts">
              <Stat
                value={0}
                title="Accounts"
                caption="No sign-up, login or credit card between you and a finished invoice."
              />
              <Stat
                value={0}
                title="Servers holding your data"
                caption="Drafts live in your browser. Export a PDF for anything you need to keep."
              />
              <Stat
                value={60}
                prefix="~"
                suffix="s"
                title="Blank page to PDF"
                caption="Roughly how long a first invoice takes, start to download."
              />
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ═══ USES ═══ */}
      <section className="lx-section">
        <Reveal className="lx-section-head">
          <p className="lx-kicker">Built for</p>
          <h2 className="lx-h2">Whatever you make, sell or fix.</h2>
          <p className="lx-body">
            Start from a blank invoice, turn on the fields your trade needs, and keep it as a
            draft to reuse next month.
          </p>
        </Reveal>

        <div className="lx-uses">
          {USES.map((use, i) => {
            const Icon = use.icon
            return (
              <Reveal key={use.title} delay={i * 60} className="lx-use">
                <Icon className="lx-use-icon" size={28} strokeWidth={1.75} />
                <h3 className="lx-h3">{use.title}</h3>
                <ul className="lx-use-list">
                  {use.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="lx-section" id="faq">
        <div className="lx-split">
          <Reveal className="lx-faq-side">
            <p className="lx-kicker">Questions</p>
            <h2 className="lx-h2">The honest answers.</h2>
            <p className="lx-body">
              Still unsure? The editor opens in one click, and there is nothing to cancel.
            </p>
            <Cta label="Open the editor" tone="ghost" />
          </Reveal>

          <Reveal delay={80} className="lx-faq">
            {FAQS.map((faq) => (
              <details key={faq.q} name="billy-faq">
                <summary>
                  {faq.q}
                  <span className="lx-faq-sign" aria-hidden="true" />
                </summary>
                <div className="lx-faq-a">{faq.a}</div>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section className="lx-closing">
        <Reveal className="lx-closing-inner">
          <DoodlePaperPlane className="lx-doodle lx-closing-plane" />
          <DoodlePencilCheck className="lx-doodle lx-closing-check" />
          <h2 className="lx-h2">Your next invoice is a blank page away.</h2>
          <p className="lx-body">Free during alpha. No account. Nothing uploaded.</p>
          <Cta label="Create a free invoice" tone="primary" large />
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lx-footer">
        <div className="lx-footer-grid">
          <div className="lx-footer-col">
            <Link href="/" className="lx-wordmark">
              billy<i>*</i>
            </Link>
            <p className="lx-small" style={{ maxWidth: "30ch" }}>
              A free, open-source invoice editor that runs entirely in your browser.
            </p>
            <p className="lx-small">© {new Date().getFullYear()} Billy</p>
          </div>

          <div className="lx-footer-col">
            <span className="lx-footer-head">Product</span>
            <a className="lx-footer-link" href="#how">
              How it works
            </a>
            <a className="lx-footer-link" href="#built-for">
              Built for
            </a>
            <Link className="lx-footer-link" href="/editor">
              Create an invoice
            </Link>
          </div>

          <div className="lx-footer-col">
            <span className="lx-footer-head">Help</span>
            <a className="lx-footer-link" href="#faq">
              Questions
            </a>
          </div>

          <div className="lx-footer-col">
            <span className="lx-footer-head">Project</span>
            <a
              className="lx-footer-link"
              href="https://github.com/vedantlavale/billy"
              target="_blank"
              rel="noreferrer noopener"
            >
              Source on GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
