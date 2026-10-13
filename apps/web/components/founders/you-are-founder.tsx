"use client"

import { EarlyBirdFace } from "@/components/founders/early-bird-face"
import { nameEmailHref, type EarlyBird } from "@/lib/early-birds"
import { useFounder } from "@/lib/founder"

/**
 * Shown on the wall to a browser that holds a founder link: their own face, a
 * thank you, and a way to ask for their name to be added or changed. There is
 * no server to save a name to, so the button opens an email and names are added
 * by hand the next time the wall is rebuilt.
 */
export function YouAreFounder({ list }: { list: EarlyBird[] }) {
  const founder = useFounder()
  if (!founder) return null

  const me = list.find((f) => f.number === founder.number)
  const named = Boolean(me?.name)
  return (
    <aside className="lx-you" aria-label="Your early bird card">
      <EarlyBirdFace number={founder.number} className="lx-you-face" />
      <div>
        <p className="lx-you-title">
          You&apos;re early bird <b>#{founder.number}</b>. Thank you.
        </p>
        <p className="lx-you-text">
          {!me
            ? "You'll show up on the wall the next time it's updated."
            : named
              ? `The wall shows you as ${me.name}.`
              : "Your name isn't on the wall yet."}
        </p>
        <a className="lx-btn lx-btn-ghost lx-you-btn" href={nameEmailHref(founder.number)}>
          {named ? "Change my name" : "Add my name"}
        </a>
        <p className="lx-you-note">Opens an email to us. Names are added by hand, so it can take a little while to show up.</p>
      </div>
    </aside>
  )
}
