import type { Metadata } from "next"
import Link from "next/link"

import { Brand } from "@/components/brand"
import { ConnectPanel, EndpointField, PromptCard } from "@/components/connect/connect-panel"
import { Cta, LandingNav } from "@/components/landing/landing-chrome"
import { Reveal } from "@/components/landing/reveal"

export const metadata: Metadata = {
  title: "Billy for AI assistants | Make invoices by asking",
  description:
    "Connect Billy to Claude, ChatGPT, Cursor or VS Code. Say who you're billing and for what, and get back a finished invoice to check and download.",
}

const STEPS = [
  {
    title: "Tell it the details",
    body: "Who you're billing, what you did and what it costs. Mention your business name and email once and your assistant can reuse them.",
  },
  {
    title: "Billy builds the invoice",
    body: "Totals, tax, discounts and due dates are worked out for you, then packed into a link your assistant hands back.",
  },
  {
    title: "Open, check, download",
    body: "The link opens the invoice in the editor, already filled in. Change anything, add your logo, and download the PDF.",
  },
]

const PROMPTS = [
  "Invoice Acme Corp for 12 hours of design at $80, due in 14 days. I'm Northwind Studio, hello@northwind.studio.",
  "Bill Ravi Traders in rupees: 3 logo concepts at ₹5,000 each and a website at ₹40,000, with 18% GST split into CGST and SGST.",
  "Make a USD invoice for Lumen Labs: a $2,400 monthly retainer plus 6 extra hours at $120, 10% off, due on receipt.",
]

const FAQS = [
  {
    q: "What does Billy see?",
    a: "Your assistant sends the invoice details to Billy, which works out the totals, turns them into a link and keeps nothing. There is no account, no database and no stored copy. The invoice lives in the link itself, in the part after the #, which browsers never send to a server. Your assistant's provider sees your conversation, as it always does.",
  },
  {
    q: "Does it cost anything?",
    a: "No. Billy is free, and so is connecting it to your assistant.",
  },
  {
    q: "What about my logo and stamp?",
    a: "Links carry text only. Add your logo or stamp in the editor once and that browser keeps it for every invoice you open afterwards.",
  },
  {
    q: "The link says it's damaged. Why?",
    a: "Part of it got lost on the way, usually when a link is retyped instead of copied. Ask your assistant to create the invoice again and open the link exactly as it gave it to you.",
  },
]

export default function ConnectPage() {
  return (
    <main className="lx" id="top">
      <LandingNav minimal />

      <section className="lx-hero lx-connect-hero">
        <div className="lx-hero-copy">
          <Reveal>
            <span className="lx-chip">Works with Claude, ChatGPT, Cursor and VS Code</span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="lx-display lx-connect-display">Ask your assistant for an invoice</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="lx-lead">
              Connect Billy once. Then say who you&apos;re billing and for what, and you get back a finished
              invoice to check and download.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="lx-section lx-connect-section" aria-labelledby="connect-title">
        <Reveal className="lx-card lx-connect-card">
          <h2 className="lx-h3" id="connect-title">
            Connect in a minute
          </h2>
          <EndpointField />
          <ConnectPanel />
        </Reveal>
      </section>

      <section className="lx-section" aria-labelledby="how-title">
        <Reveal className="lx-connect-head">
          <p className="lx-kicker">How it works</p>
          <h2 className="lx-h2" id="how-title">
            From a sentence to a PDF
          </h2>
        </Reveal>
        <ol className="lx-connect-steps">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 60} className="lx-connect-step">
              <span className="lx-connect-num" aria-hidden>
                {index + 1}
              </span>
              <h3 className="lx-h3">{step.title}</h3>
              <p className="lx-body">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="lx-section" aria-labelledby="try-title">
        <Reveal className="lx-connect-head">
          <p className="lx-kicker">Try saying</p>
          <h2 className="lx-h2" id="try-title">
            Talk to it like you would a person
          </h2>
        </Reveal>
        <Reveal delay={60} className="lx-prompts">
          {PROMPTS.map((prompt) => (
            <PromptCard key={prompt} text={prompt} />
          ))}
        </Reveal>
      </section>

      <section className="lx-section" id="faq">
        <div className="lx-split">
          <Reveal className="lx-faq-side">
            <p className="lx-kicker">Questions</p>
            <h2 className="lx-h2">Good to know.</h2>
            <p className="lx-body">Rather fill it in yourself? The editor is one click away.</p>
            <Cta label="Open the editor" tone="ghost" />
          </Reveal>

          <Reveal delay={80} className="lx-faq">
            {FAQS.map((faq) => (
              <details key={faq.q} name="billy-connect-faq">
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

      <footer className="lx-footer">
        <div className="lx-footer-inner" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div className="lx-footer-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
            <Brand size="sm" />
            <Link className="lx-footer-link" href="/">
              Home
            </Link>
            <Link className="lx-footer-link" href="/editor">
              Open the editor
            </Link>
            <span style={{ marginLeft: "auto" }}>© {new Date().getFullYear()} Billy</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
