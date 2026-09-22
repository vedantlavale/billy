import type { Metadata } from "next"
import Link from "next/link"

import { Cta, LandingNav, Marquee, Stat } from "@/components/landing/landing-chrome"
import { LiveInvoice } from "@/components/landing/live-invoice"
import { Reveal } from "@/components/landing/reveal"
import {
  IconBolt,
  IconBrush,
  IconCursorText,
  IconExport,
  IconShield,
  IconSum,
} from "@/components/landing/lx-icons"

export const metadata: Metadata = {
  title: "Billy — Invoicing that feels like typing a document",
  description:
    "Edit an invoice like a document and export a print-ready PDF. Runs entirely in your browser: no account, no server, nothing uploaded.",
}

/* Copy note: the previous landing page advertised accounts, cross-device sync
   and "encrypted in transit and at rest". None of that exists — Billy is
   fully client-side (see README). Every claim below is one the build can
   actually keep, and the absence of a backend is the strongest thing we have
   to say, so it leads. */

const TRADES = [
  "Freelance designers",
  "Dev shops",
  "Photographers",
  "Consultants",
  "Contractors",
  "Studios",
  "Copywriters",
  "Small agencies",
  "Side projects",
]

/* Spans are tuned so the 6-col grid fills exactly: 4+2 / 2+2+2 / 6. The
   light/dark alternation is what gives the row rhythm (borrowed from
   BloomFi's mixed bento), and the closing tile carries the CTA. */
const TILES = [
  {
    icon: IconCursorText,
    title: "Click anything. Type.",
    body: "No forms and no field labels to hunt through. The invoice on screen is the document you edit — click a line and write.",
    span: "wide" as const,
    demo: true,
  },
  {
    icon: IconSum,
    title: "Totals keep themselves",
    body: "Quantities, rates, tax and discounts resolve on every keystroke.",
    dark: true,
  },
  {
    icon: IconExport,
    title: "Print-ready PDF",
    body: "Export exactly what you previewed. No browser print dialog in the way.",
    dark: true,
  },
  {
    icon: IconBrush,
    title: "Your logo, your colours",
    body: "Drop in a logo and pick a template. Kept as a local draft for next time.",
  },
  {
    icon: IconShield,
    title: "Nothing leaves the tab",
    body: "Your invoice, client details and logo stay here. There is no server to send them to.",
    dark: true,
  },
  {
    icon: IconBolt,
    title: "Open in one click",
    body: "No sign-up, no trial, no credit card. The editor is the front door.",
    span: "full" as const,
    cta: true,
  },
]

const USES = [
  {
    title: "Freelancers",
    items: ["Bill a client in a couple of minutes", "Look established from invoice one", "Keep a local draft to duplicate"],
  },
  {
    title: "Studios & agencies",
    items: ["Put your mark on every invoice", "Reuse a template across clients", "Hand the same file to anyone"],
  },
  {
    title: "Consultants",
    items: ["Itemise hours and retainers", "Handle tax lines cleanly", "Works offline once loaded"],
  },
  {
    title: "Contractors",
    items: ["Split materials from labour", "Duplicate last month's invoice", "Export and send, done"],
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
    q: "Is it really free?",
    a: "Billy is free and open-source, and free during alpha with every feature unlocked. If paid plans arrive later, anything you have already made stays yours and stays local.",
  },
  {
    q: "What happens if I clear my browser data?",
    a: "The local draft goes with it, so export a PDF for anything you need to keep. That is the honest trade-off for never uploading your data.",
  },
]

export default function Home() {
  return (
    <main className="lx">
      <LandingNav />

      {/* ═══ HERO — dark inset panel, media cropped by its bottom edge ═══ */}
      <section className="lx-hero">
        <div className="lx-panel lx-panel--dark lx-hero-panel">
          <span className="lx-orb" aria-hidden="true" />

          <div className="lx-hero-body">
            <div className="lx-hero-top">
              <p className="lx-eyebrow">Invoicing · no account · nothing uploaded</p>
              <p className="lx-eyebrow" style={{ textAlign: "right" }}>
                Free during alpha
              </p>
            </div>

            <Reveal>
              {/* Tirtus's move: the sentence opens held-back and resolves into
                  its emphasis. An opacity ramp across a clause — not a
                  decorative one-word serif/colour swap. */}
              <h1 className="lx-display lx-hero-display">
                <span className="lx-dim">Invoicing that feels like</span> typing a document
              </h1>
            </Reveal>

            <Reveal delay={90}>
              <p className="lx-hero-sub">
                Click any line and write. Totals settle themselves. Export a print-ready
                PDF — all of it inside this tab, with no account and no server holding
                your numbers.
              </p>
            </Reveal>

            <Reveal delay={170}>
              <div className="lx-hero-actions">
                <Cta label="Create a free invoice" tone="primary" large />
                <a className="lx-btn lx-btn-onDark lx-btn-lg" href="#how">
                  See how it works
                </a>
              </div>
            </Reveal>

            <div className="lx-hero-foot">
              <span className="lx-chip">
                <span className="lx-chip-dot" aria-hidden="true" />
                Runs entirely in your browser
              </span>
              <p className="lx-eyebrow" style={{ textAlign: "right" }}>
                Free &amp; open source
              </p>
            </div>
          </div>

          <LiveInvoice />
        </div>
      </section>

      {/* ═══ MARQUEE — continuous drift, so the page is never fully still ═══ */}
      <section className="lx-section lx-section--tight" id="built-for" style={{ paddingBottom: 0 }}>
        <p className="lx-eyebrow" style={{ textAlign: "center" }}>
          Who sends invoices with Billy
        </p>
      </section>
      <Marquee items={TRADES} />

      {/* ═══ STATEMENT — asymmetric split, two-tone prose ═══ */}
      <section className="lx-section">
        <Reveal>
          <div className="lx-split">
            <p className="lx-statement">
              Most invoicing tools want an account, a subscription and your client list
              before they will print one page.{" "}
              <span className="lx-dim">
                Billy wants none of it. It opens as a blank invoice you can type straight
                into, does the arithmetic while you work, and hands you a PDF — then
                forgets you were ever here.
              </span>
            </p>

            <div className="lx-stack" style={{ gap: 14 }}>
              <p className="lx-eyebrow">Why it works this way</p>
              <p className="lx-small" style={{ color: "var(--lx-ink-2)", maxWidth: "34ch" }}>
                No backend means nothing to breach, nothing to sync and nothing to pay
                for. It also means your drafts live in this browser — so export what
                matters.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ BENTO — borrowed from BloomFi: mixed widths, mixed light/dark ═══ */}
      <section className="lx-section" id="how" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="lx-split--label lx-split" style={{ marginBottom: 44 }}>
            <p className="lx-eyebrow">How it works</p>
            <h2 className="lx-h2" style={{ maxWidth: "22ch" }}>
              <span className="lx-dim">Six things it does,</span> none of which need setup
            </h2>
          </div>
        </Reveal>

        <div className="lx-bento">
          {TILES.map((tile, i) => {
            const Icon = tile.icon
            const span = tile.span ? ` lx-tile--${tile.span}` : ""
            const dark = tile.dark ? " lx-tile--dark" : ""

            return (
              <Reveal key={tile.title} delay={i * 60} className={`lx-tile${span}${dark}`}>
                {tile.cta ? (
                  <>
                    <div className="lx-tile-copy">
                      <Icon className="lx-tile-icon" />
                      <h3 className="lx-h3">{tile.title}</h3>
                      <p className="lx-tile-desc">{tile.body}</p>
                    </div>
                    <Cta label="Create a free invoice" tone="primary" />
                  </>
                ) : (
                  <>
                    <Icon className="lx-tile-icon" />
                    <h3 className="lx-h3">{tile.title}</h3>
                    <p className="lx-tile-desc">{tile.body}</p>
                    {tile.demo && (
                      <div className="lx-tile-demo" aria-hidden="true">
                        <span>Brand identity design</span>
                        <span className="lx-caret" />
                        <b>$1,200</b>
                      </div>
                    )}
                  </>
                )}
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ═══ STATS — dark panel, oversized numerals ═══ */}
      <section style={{ padding: "0 var(--lx-gutter)" }}>
        <div className="lx-panel lx-panel--dark">
          <div className="lx-panel-body">
            <Reveal>
              <p className="lx-eyebrow" style={{ marginBottom: 26 }}>
                The short version
              </p>
              <h2 className="lx-h2" style={{ maxWidth: "24ch" }}>
                <span className="lx-dim">Everything it takes to</span> send your first
                invoice
              </h2>
            </Reveal>

            <div className="lx-stats">
              <Stat value={0} caption="Accounts, logins or credit cards between you and a finished invoice." />
              <Stat value={100} suffix="%" caption="Of your invoice data stays in this browser. There is no server to upload it to." />
              <Stat value={60} suffix="s" caption="Roughly what a blank page to a downloaded PDF takes." />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ USE CASES — asymmetric label column ═══ */}
      <section className="lx-section">
        <Reveal>
          <div className="lx-split">
            <h2 className="lx-h2" style={{ maxWidth: "20ch" }}>
              <span className="lx-dim">Whatever you make,</span> sell or fix
            </h2>
            <div className="lx-stack" style={{ gap: 18 }}>
              <p className="lx-body" style={{ color: "var(--lx-ink-2)", maxWidth: "38ch" }}>
                Start from a blank invoice or a template that already looks like your
                trade, then keep it as a local draft to duplicate next month.
              </p>
              <Cta label="Open the editor" tone="ghost" />
            </div>
          </div>
        </Reveal>

        <div className="lx-uses">
          {USES.map((use, i) => (
            <Reveal key={use.title} delay={i * 60} className="lx-use">
              <h3 className="lx-h3">{use.title}</h3>
              <ul className="lx-use-list">
                {use.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ FAQ — hairline rows, not cards ═══ */}
      <section className="lx-section" id="faq" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="lx-split--label lx-split" style={{ marginBottom: 40 }}>
            <p className="lx-eyebrow">Questions</p>
            <h2 className="lx-h2" style={{ maxWidth: "18ch" }}>
              The honest answers
            </h2>
          </div>
        </Reveal>

        <Reveal className="lx-faq">
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
      </section>

      {/* ═══ FINAL CTA — dark panel closes the rhythm it opened with ═══ */}
      <section style={{ padding: "0 var(--lx-gutter)" }}>
        <div className="lx-panel lx-panel--dark">
          <div
            className="lx-panel-body"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 24,
              paddingTop: "clamp(56px, 8vw, 116px)",
              paddingBottom: "clamp(56px, 8vw, 116px)",
            }}
          >
            <Reveal>
              <p className="lx-eyebrow" style={{ marginBottom: 22 }}>
                No account required
              </p>
              <h2 className="lx-h2" style={{ maxWidth: "20ch", marginInline: "auto" }}>
                <span className="lx-dim">Your next invoice is</span> a blank page away
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <Cta label="Create a free invoice" tone="primary" large />
            </Reveal>
            <Reveal delay={150}>
              <p className="lx-eyebrow">Free during alpha · Nothing uploaded</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lx-footer">
        <div className="lx-footer-grid">
          <div className="lx-footer-col">
            <Link href="/" className="lx-wordmark">
              billy<i>*</i>
            </Link>
            <p className="lx-small" style={{ color: "var(--lx-ink-2)", maxWidth: "30ch" }}>
              A free, open-source invoice editor that runs entirely in your browser.
            </p>
            <p className="lx-small" style={{ color: "var(--lx-ink-3)" }}>
              © {new Date().getFullYear()} Billy
            </p>
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
              Source
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
