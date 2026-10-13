"use client"

import * as React from "react"

import { extractFounderCode, verifyFounderCode } from "@billy/invoice-core"

/**
 * Founding-member status for this browser. It arrives once through the link
 * in the launch email (…/editor#founder=v1.<n>.<sig>), is verified against the
 * public key, and is remembered here. Nothing is sent anywhere.
 */
const KEY = "billy_founder"
const EVENT = "billy-founder-change"

export type Founder = { number: number; code: string }

function read(): Founder | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Founder) : null
  } catch {
    return null
  }
}

let cache: { raw: string | null; value: Founder | null } = { raw: null, value: null }
function snapshot(): Founder | null {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {}
  if (raw !== cache.raw) cache = { raw, value: read() }
  return cache.value
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** This browser's founder, or null. Always null during the static render. */
export function useFounder(): Founder | null {
  return React.useSyncExternalStore(subscribe, snapshot, () => null)
}

/**
 * Checks the URL for a founder code, strips it from the address bar, and if
 * it verifies, remembers it. Resolves to the founder number, null for a code
 * that doesn't verify, or undefined when the URL carries no code at all.
 */
export async function claimFounderFromUrl(): Promise<number | null | undefined> {
  const match = window.location.hash.match(/(?:^#|&)founder=([^&]+)/)
  if (!match) return undefined
  const code = decodeURIComponent(match[1])
  const rest = window.location.hash.replace(match[0], "").replace(/^#?&?/, "")
  window.history.replaceState(null, "", window.location.pathname + window.location.search + (rest ? `#${rest}` : ""))
  return rememberFounder(code)
}

/**
 * Unlocks from pasted text: the whole emailed link, or just its code. Resolves
 * to the founder number, or null when nothing in the text verifies.
 */
export async function claimFounderFromText(text: string): Promise<number | null> {
  const code = extractFounderCode(text)
  return code ? rememberFounder(code) : null
}

async function rememberFounder(code: string): Promise<number | null> {
  const number = await verifyFounderCode(code)
  if (number === null) return null
  try {
    localStorage.setItem(KEY, JSON.stringify({ number, code } satisfies Founder))
  } catch {}
  window.dispatchEvent(new Event(EVENT))
  return number
}
