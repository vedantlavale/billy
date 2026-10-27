import type { Metadata } from "next"
import Link from "next/link"

import { formatCurrency } from "@billy/invoice-core"

import { Brand } from "@/components/brand"
import { Bento, BentoCard, FeatureTiles, SectionHeader, Underlined } from "@/components/landing/bento"
import { Cta, LandingNav } from "@/components/landing/landing-chrome"
import { Reveal } from "@/components/landing/reveal"
import { BlankPageScene, GstScene, PrivacyScene, UnlimitedScene } from "@/components/landing/step-scenes"
import { DoodlePencilCheck, DoodleReceipt, DoodleUnderlineSquiggle } from "@/components/landing/doodles"
import { GiftIcon, LockIcon } from "@/components/icons/rune"
import {
  BankIcon,
  BarcodeIcon,
  GstinIcon,
  PaymentTermsIcon,
  PercentIcon,
  ReverseChargeIcon,
} from "@/components/icons/billy"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL } from "@/lib/seo"

export const metadata: Metadata = {
  alternates: { canonical: "/gst-invoice-generator" },
  title: "Free GST Invoice Generator | CGST, SGST & IGST | Billy",
  description:
    "Make a GST invoice in your browser: GSTIN, HSN/SAC codes and the right CGST + SGST or IGST split, one switch away. Free, no sign-up, print-ready PDF.",
  openGraph: {
    title: "A free GST invoice generator for your browser",
    description:
      "CGST, SGST or IGST, one switch away. No sign-up, no watermark, nothing uploaded.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630 }],
  },
}

/* Copy note: every GST claim below is something the editor actually does
   (see OptionsPanel's intra/inter toggle, LineItem.hsnCode and
   professionPresets.gst_vendor). The page describes what the invoice
   carries, not what the law requires of the reader: no rates, no
   thresholds, no tax advice. The business GSTIN is the only GSTIN the
   data model has, so the copy never promises a client GSTIN. */

/** Rs.10,000 at 18% GST, split intra-state (9% + 9%) or inter-state (18%). */
const GST_DEMO = {
  subtotal: formatCurrency(10000, "INR"),
  half: formatCurrency(900, "INR"),
  full: formatCurrency(1800, "INR"),
  total: formatCurrency(11800, "INR"),
}

const FIELDS = [
  { icon: GstinIcon, label: "GSTIN" },
  { icon: BarcodeIcon, label: "HSN / SAC codes" },
  { icon: PercentIcon, label: "CGST + SGST or IGST" },
  { icon: ReverseChargeIcon, label: "Reverse charge" },
  { icon: PaymentTermsIcon, label: "Payment terms" },
  { icon: BankIcon, label: "Bank details" },
]

const FAQS = [
  {
    q: "What is a GST invoice?",
    a: "A tax invoice for supplies under GST. It carries your GSTIN, a description of what you billed, an HSN or SAC code for each line, the amount taxed and the tax split. Billy has a field for each of them.",
  },
  {
    q: "Do I charge CGST and SGST, or IGST?",
    a: "Same state means CGST and SGST, half the rate each. A client in another state means one IGST line. Pick the mode in the options and Billy splits the totals; ₹10,000 at 18% comes out to ₹11,800 either way.",
  },
  {
    q: "What are HSN and SAC codes?",
    a: "HSN classifies goods and SAC classifies services. Turn on the HSN/SAC column and every line carries its own code, on the invoice and in the exported PDF.",
  },
  {
    q: "Where does my GSTIN go?",
    a: "Switch the GSTIN field on and yours prints with your business details, on the invoice and in the PDF. It is saved in your local draft, so the next invoice starts with it already in place.",
  },
  {
    q: "How do I show a reverse-charge invoice?",
    a: "One switch adds the reverse-charge note to the invoice, so your client knows the tax is theirs to account for.",
  },
  {
    q: "Does any of it get uploaded?",
    a: "No. Your GSTIN, client details, bank details and logo stay in this browser's local draft. Billy has no backend to send them to, and there is no account to create.",
  },
]

export default function GstInvoiceGeneratorPage() {
  return (
    <main className="lx" id="top">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/gst-invoice-generator#faq`,
              mainEntity: FAQS.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
          ],
        }}
      />
      <LandingNav minimal />

      {/* ═══ HERO ═══ */}
      <section className="lx-hero">
        <div className="lx-hero-copy">
          <Reveal delay={60}>
            <p className="lx-kicker">For Indian businesses</p>
            <h1 className="lx-display lx-hero-display">
              A free GST invoice generator that feels like{" "}
              <span className="lx-underline">
                typing a document
                <DoodleUnderlineSquiggle className="lx-draw" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="lx-lead">
              GSTIN, HSN/SAC codes and the right tax split, built in. Click any line and
              write, then download a print-ready PDF. No sign-up, nothing uploaded.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="lx-hero-actions">
              <Cta label="Create a GST invoice" tone="primary" large />
              <a className="lx-btn lx-btn-ghost lx-btn-lg" href="#included">
                See what&apos;s included
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHAT AN INVOICE CARRIES ═══ */}
      <section className="lx-section" id="included">
        <SectionHeader
          title={<>Everything a GST invoice <Underlined>carries</Underlined></>}
          subtitle="All of it built in, none of it behind a paywall."
          art={<DoodleReceipt className="lx-art-receipt" />}
        />
        <FeatureTiles items={FIELDS} />
      </section>

      {/* ═══ THE TAX SPLIT ═══ */}
      <section className="lx-section" id="split">
        <SectionHeader
          title={<>The tax lines <Underlined>work themselves out</Underlined></>}
          subtitle="Choose CGST + SGST for the same state or IGST for another. The total never moves."
          art={
            <div className="lx-art">
              <DoodlePencilCheck className="lx-art-pencil" />
            </div>
          }
        />
        <Bento>
          <BentoCard
            wide
            split
            accent
            icon={PercentIcon}
            title="One switch picks the split"
            media={<GstScene lines={GST_DEMO} />}
          >
            Tell Billy where your client is. Same state gives you CGST and SGST at half the
            rate each; another state gives you one IGST line. Subtotal in, ₹11,800 out,
            either way.
          </BentoCard>
          <BentoCard icon={GiftIcon} title="Free, every feature unlocked" media={<UnlimitedScene />}>
            No paywall on the GST fields, no watermark on the PDF and no limit on how many
            invoices you make.
          </BentoCard>
          <BentoCard icon={LockIcon} title="Your GSTIN stays in this tab" media={<PrivacyScene />} delay={80}>
            Your GSTIN, client details and bank details live in this browser&apos;s local
            draft. There is no backend to upload them to.
          </BentoCard>
        </Bento>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="lx-section" id="faq">
        <div className="lx-split">
          <Reveal className="lx-faq-side">
            <p className="lx-kicker">Questions</p>
            <h2 className="lx-h2">GST questions, answered.</h2>
            <p className="lx-body">
              The editor opens in one click with the GST fields ready to switch on, and
              there is nothing to cancel.
            </p>
            <Cta label="Open the editor" tone="ghost" />
          </Reveal>

          <Reveal delay={80} className="lx-faq">
            {FAQS.map((faq) => (
              <details key={faq.q} name="billy-gst-faq">
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

      {/* ═══ FINAL CTA ═══ */}
      <section className="lx-final">
        <Reveal className="lx-final-inner">
          <div className="lx-final-art" aria-hidden>
            <BlankPageScene />
          </div>
          <h2 className="lx-h2">Your next GST invoice starts as a blank page</h2>
          <p className="lx-lead">
            About a minute, no account, and the tax lines work themselves out.
          </p>
          <div className="lx-hero-actions">
            <Cta label="Create a GST invoice" tone="primary" large />
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER — compact, same as /connect ═══ */}
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
