import type { Metadata } from "next"
import Link from "next/link"

import { Brand } from "@/components/brand"

import { TEMPLATES, formatCurrency } from "@billy/invoice-core"

import { Cta, LandingNav } from "@/components/landing/landing-chrome"
import { HeroShot } from "@/components/landing/hero-shot"
import { GITHUB_URL } from "@/lib/links"
import { SPONSOR_MAILTO } from "@/lib/sponsors"
import {
  ChevronUpIcon,
  CircleUserIcon,
  DollarSignIcon,
  EyeIcon,
  FileDownIcon,
  GiftIcon,
  ImageIcon,
  IndianRupeeIcon,
  LayoutGridIcon,
  LockIcon,
  MessageSquareTextIcon,
  PackageIcon,
  PencilIcon,
  UsersIcon,
} from "@/components/icons/rune"
import {
  BankIcon,
  BarcodeIcon,
  CommandIcon,
  CurrencyIcon,
  GstinIcon,
  KeyboardIcon,
  NotesIcon,
  OfflineIcon,
  PagesIcon,
  PaymentTermsIcon,
  PercentIcon,
  PoNumberIcon,
  PresetsIcon,
  ReverseChargeIcon,
  SaveLocalIcon,
  UndoRedoIcon,
} from "@/components/icons/billy"
import { Bento, BentoCard, FeatureTiles, SectionHeader, Underlined } from "@/components/landing/bento"
import { Reveal } from "@/components/landing/reveal"
import { Sponsors } from "@/components/landing/sponsors"
import { JsonLd } from "@/components/seo/json-ld"
import { buildJsonLd } from "@/lib/seo"
import {
  BlankPageScene,
  CurrencyScene,
  ExportScene,
  GstScene,
  MatchScene,
  PresetScene,
  PrivacyScene,
  StampScene,
  UnlimitedScene,
  ThemeScene,
  TypeScene,
} from "@/components/landing/step-scenes"
import {
  DoodleBubble,
  DoodleFace,
  DoodlePaperPlane,
  DoodlePencilCheck,
  DoodleReceipt,
  DoodleStarBubble,
  DoodleUnderlineSquiggle,
} from "@/components/landing/doodles"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Billy | Invoicing that feels like typing a document",
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
    a: "No. There is no sign-up, no login and no billing. Opening the editor is the whole onboarding, and your first invoice is about a minute away.",
  },
  {
    q: "Where does my invoice data go?",
    a: "Nowhere. Billy is fully client-side: your invoice, client details and any logo you add live in your browser and are kept as a local draft. There is no backend to upload them to, which is also why nobody, including us, can read them.",
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
    a: "Yes. Billy is free, with every feature unlocked. If paid plans arrive later, anything you have already made stays yours and stays local.",
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

/** The same total in five currencies, formatted exactly as Billy formats them. */
const CURRENCY_DEMO = ["INR", "USD", "EUR", "GBP", "JPY"].map((code) => ({
  code,
  text: formatCurrency(240000, code, code === "JPY" ? 0 : 2),
}))

/** ₹10,000 at 18% GST, split intra-state (9% + 9%) or inter-state (18%). */
const GST_DEMO = {
  subtotal: formatCurrency(10000, "INR"),
  half: formatCurrency(900, "INR"),
  full: formatCurrency(1800, "INR"),
  total: formatCurrency(11800, "INR"),
}

export default function Home() {
  return (
    <main className="lx" id="top">
      <JsonLd data={buildJsonLd(FAQS)} />
      <LandingNav />

      {/* ═══ HERO — centered promise above the real product ═══ */}
      <section className="lx-hero">
        <div className="lx-hero-copy">

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
              <a className="lx-btn lx-btn-ghost lx-btn-lg" href="#features">
                See how it works
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240} className="lx-stage">
          <HeroShot />
        </Reveal>
      </section>

      {/* ═══ TRADES — an index, not a pill cloud: the band gives the page its
           first break from white, and numbering makes ten names scannable ═══ */}
      <section className="lx-trades" aria-labelledby="trades-title">
        <div className="lx-trades-inner">
          <Reveal className="lx-trades-head">
            <p className="lx-kicker">Who it&apos;s for</p>
            <h2 className="lx-h2" id="trades-title">
              Made for people who bill by the job
            </h2>
            <p className="lx-body">
              Ten trades, one blank invoice. Switch on the fields yours needs and leave the
              rest out of the way.
            </p>
          </Reveal>

          <Reveal delay={80} className="lx-trades-index">
            <ol>
              {TRADES.map((trade, i) => (
                <li key={trade}>
                  <span className="lx-trades-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="lx-trades-name">{trade}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ═══ 1 · AN EDITOR LIKE NO OTHER ═══ */}
      <section className="lx-section" id="features">
        <SectionHeader
          title={<>An invoice editor like <Underlined>no other</Underlined></>}
          subtitle="Billy makes invoicing feel like writing. No accounts, no forms to fill in. Open it and start typing."
          art={
            <div className="lx-art lx-art--chat">
              <DoodleFace className="lx-art-face" />
              <DoodleBubble text="So easy!" className="lx-art-bubble" />
            </div>
          }
        />
        <Bento>
          <BentoCard
            wide
            accent
            icon={GiftIcon}
            title="Unlimited invoices, completely free"
            media={<UnlimitedScene />}
          >
            No paywall, no watermark and no export limit. Billy is free, and every feature is
            unlocked.
          </BentoCard>
          <BentoCard icon={PencilIcon} title="Just start typing" media={<TypeScene />}>
            No forms and no field labels to hunt for. Click any line on the invoice and write, the
            way you&apos;d edit a document.
          </BentoCard>
          <BentoCard icon={LockIcon} title="Private by design" media={<PrivacyScene />} delay={80}>
            There&apos;s no backend. Your invoices, clients and logo stay in this browser tab, so
            there&apos;s nothing to breach and nothing to sync.
          </BentoCard>
        </Bento>
      </section>

      {/* ═══ 2 · MAKE IT YOURS ═══ */}
      <section className="lx-section" id="yours">
        <SectionHeader
          title={<>Make it uniquely <Underlined>yours</Underlined></>}
          subtitle="Your logo, your colours, your currency. Look established from your very first invoice."
          art={
            <div className="lx-art">
              <DoodleStarBubble className="lx-art-stars" />
              <DoodlePencilCheck className="lx-art-pencil" />
            </div>
          }
        />
        <Bento>
          <BentoCard
            wide
            split
            icon={LayoutGridIcon}
            title="Six templates, one click"
            media={<ThemeScene palettes={SCENE_PALETTES} />}
          >
            From clean and minimal to bold header bands. Switch any time; your content stays put and
            the PDF follows.
          </BentoCard>
          <BentoCard icon={ImageIcon} title="Your logo and seal" media={<StampScene />}>
            Drop in a logo and a digital stamp or signature. Both are saved with your draft.
          </BentoCard>
          <BentoCard icon={DollarSignIcon} title="Any currency" media={<CurrencyScene amounts={CURRENCY_DEMO} />} delay={80}>
            Ten currencies, each formatted the local way, down to lakh separators for rupees.
          </BentoCard>
        </Bento>
      </section>

      {/* ═══ 3 · BUILT FOR GST ═══ */}
      <section className="lx-section" id="gst">
        <SectionHeader
          title={<>Built for <Underlined>GST</Underlined></>}
          subtitle="CGST, SGST, IGST, GSTIN and HSN/SAC: everything an Indian tax invoice needs, one switch away."
          art={<DoodleReceipt className="lx-art-receipt" />}
        />
        <Bento>
          <BentoCard
            wide
            icon={IndianRupeeIcon}
            title="Same state or other state? One switch."
            media={<GstScene lines={GST_DEMO} />}
          >
            Pick where your client is and Billy splits the tax correctly, with CGST and SGST for the
            same state or IGST for another. The total never moves.
          </BentoCard>
        </Bento>
      </section>

      {/* ═══ 4 · SEND ═══ */}
      <section className="lx-section" id="send">
        <SectionHeader
          title={<>Ready to send in <Underlined>one click</Underlined></>}
          subtitle="A real, print-ready PDF, generated right in your browser."
          art={<DoodlePaperPlane className="lx-art-plane" />}
        />
        <Bento>
          <BentoCard icon={FileDownIcon} title="A real PDF, not a print dialog" media={<ExportScene />}>
            Download a crisp A4 PDF with no watermark and no limit on how many you make.
          </BentoCard>
          <BentoCard icon={EyeIcon} title="Exactly what you see" media={<MatchScene />} delay={80}>
            Preview shows the exact file you&apos;ll get. What&apos;s on screen is what&apos;s in
            the PDF.
          </BentoCard>
        </Bento>
      </section>

      {/* ═══ EVERYTHING AN INVOICE NEEDS — scannable tiles, no prose ═══ */}
      <section className="lx-section" id="everything">
        <SectionHeader
          title={<><Underlined>Everything</Underlined> an invoice needs</>}
          subtitle="All of it built in, none of it behind a paywall."
        />
        <FeatureTiles
          items={[
            { icon: SaveLocalIcon, label: "Autosave" },
            { icon: UndoRedoIcon, label: "Undo & redo" },
            { icon: CommandIcon, label: "⌘K commands" },
            { icon: KeyboardIcon, label: "Keyboard shortcuts" },
            { icon: PagesIcon, label: "Multi-page" },
            { icon: OfflineIcon, label: "Works offline" },
            { icon: PaymentTermsIcon, label: "Payment terms" },
            { icon: CurrencyIcon, label: "10 currencies" },
            { icon: BankIcon, label: "Bank details" },
            { icon: PoNumberIcon, label: "PO numbers" },
            { icon: PercentIcon, label: "Tax & discount" },
            { icon: NotesIcon, label: "Notes & terms" },
            { icon: PresetsIcon, label: "Quick presets" },
            { icon: GstinIcon, label: "GSTIN" },
            { icon: BarcodeIcon, label: "HSN / SAC codes" },
            { icon: ReverseChargeIcon, label: "Reverse charge" },
          ]}
        />
      </section>

      {/* ═══ 5 · DESIGNED FOR YOU ═══ */}
      <section className="lx-section" id="built-for">
        <SectionHeader
          title={<>Designed for <Underlined>you</Underlined></>}
          subtitle="Start from a blank invoice or a preset that already fits your trade."
        />
        <Reveal className="lx-card lx-card--wide lx-uses-card">
          <div className="lx-uses-scene" aria-hidden>
            <PresetScene />
          </div>
          <div className="lx-uses">
            {USES.map((use) => {
              const UseIcon = use.icon
              return (
                <div key={use.title} className="lx-use">
                  <UseIcon className="lx-use-icon" size={24} strokeWidth={1.75} />
                  <h3 className="lx-card-title">{use.title}</h3>
                  <ul className="lx-use-list">
                    {use.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <div className="lx-uses-cta">
            <Cta label="Open the editor" tone="primary" />
          </div>
        </Reveal>
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

      {/* ═══ SPONSORS ═══ */}
      <Sponsors />

      {/* ═══ FINAL CTA ═══ */}
      <section className="lx-final">
        <Reveal className="lx-final-inner">
          <div className="lx-final-art" aria-hidden>
            <BlankPageScene />
          </div>
          <h2 className="lx-h2">Your next invoice is a blank page away</h2>
          <p className="lx-lead">It takes about a minute, and you don&apos;t even need an account.</p>
          <div className="lx-hero-actions">
            <Cta label="Create a free invoice" tone="primary" large />
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER — a distinct muted band ═══ */}
      <footer className="lx-footer">
        <div className="lx-footer-inner">
          <div className="lx-footer-grid">
            <div className="lx-footer-brand">
              <Brand size="lg" />
              <p className="lx-body">
                A free, open-source invoice editor.
              </p>
            </div>

            <div className="lx-footer-col">
              <span className="lx-footer-head">Product</span>
              <Link className="lx-footer-link" href="/editor">
                Open the editor
              </Link>
              <Link className="lx-footer-link" href="/connect">
                Use with AI assistants
              </Link>
              <a className="lx-footer-link" href="#features">
                Features
              </a>
              <a className="lx-footer-link" href="#built-for">
                Built for
              </a>
              <a className="lx-footer-link" href="#faq">
                Questions
              </a>
              <Link className="lx-footer-link" href="/early-birds">
                Early birds
              </Link>
            </div>

            <div className="lx-footer-col">
              <span className="lx-footer-head">Open source</span>
              <a className="lx-footer-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                Star on GitHub
              </a>
              <a className="lx-footer-link" href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">
                Contribute
              </a>
              <a className="lx-footer-link" href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">
                MIT license
              </a>
              <a className="lx-footer-link" href={SPONSOR_MAILTO}>
                Sponsor billy
              </a>
            </div>

          </div>

          <div className="lx-footer-bar">
            <span>© {new Date().getFullYear()} Billy</span>
            <span>
              Built by{" "}
              <a className="lx-link" href="https://vedantworks.com" target="_blank" rel="noreferrer noopener">
                Vedant
              </a>{" "}
              🫶
            </span>
            <a className="lx-footer-top" href="#top" aria-label="Back to top">
              <ChevronUpIcon size={16} />
              Top
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
