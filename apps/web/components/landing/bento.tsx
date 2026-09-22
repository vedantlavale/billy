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
