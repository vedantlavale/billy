import type { ReactNode } from "react"

import type { Icon } from "@/components/icons/rune"
import { Reveal } from "./reveal"

export { Underlined } from "./underlined"

/*
 * The repeating section module (#21), adapted from tally.so: a heading with
 * one hand-underlined word and a doodle on the right, a bento of cards that
 * each carry a live scene, and a dense mini-feature grid underneath. Blue,
 * not magenta, per root DESIGN.md.
 *
 * Server components: the page passes icon components in as props, which
 * can't cross into a client component. Only the animated underline
 * (./underlined) and Reveal run on the client.
 */

export function SectionHeader({
  id,
  title,
  subtitle,
  art,
}: {
  id?: string
  title: ReactNode
  subtitle: ReactNode
  art?: ReactNode
}) {
  return (
    <Reveal className="lx-shead" id={id}>
      <div className="lx-shead-copy">
        <h2 className="lx-h2">{title}</h2>
        <p className="lx-lead">{subtitle}</p>
      </div>
      {art && (
        <div className="lx-shead-art" aria-hidden>
          {art}
        </div>
      )}
    </Reveal>
  )
}

export function BentoCard({
  icon: IconCmp,
  title,
  children,
  media,
  wide,
  accent,
  split,
  delay = 0,
}: {
  icon: Icon
  title: string
  children: ReactNode
  media?: ReactNode
  /** Span both columns. */
  wide?: boolean
  /** The section's headline card: blue border and title. */
  accent?: boolean
  /** Wide cards only: text on the left, media on the right. */
  split?: boolean
  delay?: number
}) {
  const cls = ["lx-card", wide && "lx-card--wide", accent && "lx-card--accent", split && "lx-card--split"]
    .filter(Boolean)
    .join(" ")
  return (
    <Reveal className={cls} delay={delay}>
      <div className="lx-card-copy">
        <IconCmp className="lx-card-icon" size={22} />
        <h3 className="lx-card-title">{title}</h3>
        <div className="lx-card-text">{children}</div>
      </div>
      {media && <div className="lx-card-media">{media}</div>}
    </Reveal>
  )
}

export function Bento({ children }: { children: ReactNode }) {
  return <div className="lx-bento">{children}</div>
}

/**
 * A scannable grid of everything built in: icon + a two-to-three word label,
 * no sentences. The sections above carry the explanations.
 */
export function FeatureTiles({ items }: { items: { icon: Icon; label: string }[] }) {
  return (
    <ul className="lx-tiles">
      {items.map(({ icon: IconCmp, label }, i) => (
        <Reveal as="li" key={label} delay={(i % 4) * 50} className="lx-tile">
          <span className="lx-tile-icon">
            <IconCmp size={18} />
          </span>
          {label}
        </Reveal>
      ))}
    </ul>
  )
}

/**
 * Scattered confetti strokes around a hero/CTA. Positions are percentages of
 * the parent so the scatter scales with the layout; pieces hide on phones.
 */
const PIECES: { x: number; y: number; r: number; w: number; tone: "soft" | "blue" | "ink" }[] = [
  { x: 3, y: 18, r: 40, w: 30, tone: "soft" },
  { x: 9, y: 62, r: -28, w: 44, tone: "soft" },
  { x: 5, y: 86, r: 70, w: 22, tone: "blue" },
  { x: 16, y: 38, r: 32, w: 18, tone: "blue" },
  { x: 91, y: 14, r: -38, w: 24, tone: "blue" },
  { x: 95, y: 44, r: 18, w: 40, tone: "soft" },
  { x: 86, y: 74, r: -60, w: 20, tone: "blue" },
  { x: 93, y: 90, r: 30, w: 34, tone: "soft" },
  { x: 80, y: 28, r: 64, w: 14, tone: "ink" },
  { x: 22, y: 90, r: -12, w: 28, tone: "soft" },
]

export function Confetti() {
  return (
    <div className="lx-confetti" aria-hidden>
      {PIECES.map((p, i) => (
        <span
          key={i}
          data-tone={p.tone}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.w, rotate: `${p.r}deg`, animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </div>
  )
}
