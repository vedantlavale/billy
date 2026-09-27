"use client"

import { useFounder } from "@/lib/founder"

/** A quiet "that's you" line on the wall, for a browser that holds a founder link. */
export function YouAreFounder() {
  const founder = useFounder()
  if (!founder) return null
  return (
    <p className="lx-founders-you">
      You&apos;re founding member <b>#{founder.number}</b>. Thank you.
    </p>
  )
}
