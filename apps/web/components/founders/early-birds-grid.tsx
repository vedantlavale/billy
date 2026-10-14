"use client"

import type { CSSProperties } from "react"

import { EarlyBirdFace } from "@/components/founders/early-bird-face"
import { Reveal } from "@/components/landing/reveal"
import { useFounder } from "@/lib/founder"
import type { EarlyBird } from "@/lib/early-birds"

// A slight, repeating lean so the wall feels pinned up by hand rather than gridded.
const LEANS = [-1.2, 0.8, -0.6, 1.1]

/** The wall. Client-side only to mark the card that belongs to the browser's own early bird. */
export function EarlyBirdsGrid({ list }: { list: EarlyBird[] }) {
  const you = useFounder()?.number
  return (
    <ul className="lx-founders-grid">
      {list.map((f, i) => (
        <Reveal key={f.number} as="li" delay={(i % 6) * 45} className="lx-founder-item">
          <div
            className="lx-founder"
            data-you={f.number === you || undefined}
            style={{ "--lean": `${LEANS[f.number % LEANS.length]}deg` } as CSSProperties}
          >
            <EarlyBirdFace number={f.number} className="lx-founder-face" />
            <span className="lx-founder-name">{f.name ?? "Early bird"}</span>
            <span className="lx-founder-number">#{f.number}</span>
            {f.number === you && <span className="lx-founder-you">You</span>}
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
