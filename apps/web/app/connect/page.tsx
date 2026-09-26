import type { Metadata } from "next"
import Link from "next/link"

import { Brand } from "@/components/brand"
import { ConnectFlow } from "@/components/connect/connect-panel"
import { DoodleBubble, DoodleFace, DoodleUnderlineSquiggle } from "@/components/landing/doodles"
import { LandingNav } from "@/components/landing/landing-chrome"

export const metadata: Metadata = {
  title: "Billy for AI assistants | Make invoices by asking",
  description:
    "Connect Billy to Claude, ChatGPT, Cursor or VS Code. Say who you're billing and for what, and get back a finished invoice to check and download.",
}

const PROMPTS = [
  "Invoice Acme Corp for 12 hours of design at $80, due in 14 days. I'm Northwind Studio, hello@northwind.studio.",
  "Bill Ravi Traders in rupees: 3 logo concepts at ₹5,000 each and a website at ₹40,000, with 18% GST split into CGST and SGST.",
  "Make a USD invoice for Lumen Labs: a $2,400 monthly retainer plus 6 extra hours at $120, 10% off, due on receipt.",
]

const NOTES = [
  {
    q: "What does Billy see?",
    a: "Your assistant sends the invoice details to Billy, which works out the totals, turns them into a link and keeps nothing: no account, no database, no stored copy. The invoice lives in the link itself, in the part after the #, which browsers never send to a server.",
  },
  {
    q: "What about my logo?",
    a: "Links carry text only. Add your logo or stamp in the editor once and that browser keeps it for every invoice you open after.",
  },
  {
    q: "The link says it's damaged",
    a: "Part of it got lost on the way, usually when a link is retyped. Ask your assistant to make the invoice again and open the link exactly as it gave it.",
  },
]

export default function ConnectPage() {
  return (
    <main className="lx" id="top">
      <LandingNav minimal />

      <div className="lx-connect">
        <header className="lx-connect-head">
          <div className="lx-connect-head-copy">
            <span className="lx-chip">
              <span className="lx-chip-dot" aria-hidden />
              New
            </span>
            <h1 className="lx-connect-title">
              Make invoices from your{" "}
              <span className="lx-underline">
                AI assistant
                <DoodleUnderlineSquiggle className="lx-draw" />
              </span>
            </h1>
            <p className="lx-connect-lead">
              Connect Billy to Claude, ChatGPT or your editor once. Then say who you&apos;re billing and for
              what, and get back a finished invoice.
            </p>
          </div>
          <div className="lx-connect-doodle" aria-hidden>
            <DoodleFace className="lx-connect-doodle-face" />
            <DoodleBubble text="Invoice Acme?" tail="left" className="lx-connect-doodle-bubble" />
          </div>
        </header>

        <ConnectFlow prompts={PROMPTS} />

        <section className="lx-faq lx-connect-notes" aria-label="Good to know">
          {NOTES.map((note) => (
            <details key={note.q} name="billy-connect-notes">
              <summary>
                {note.q}
                <span className="lx-faq-sign" aria-hidden="true" />
              </summary>
              <div className="lx-faq-a">{note.a}</div>
            </details>
          ))}
        </section>
      </div>

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
