import * as React from "react"

import type { Icon, IconProps } from "./rune"

/*
 * Glyphs drawn for the capability tiles on the landing page.
 *
 * Rune (./rune.tsx) covers the editor's UI verbs — search, undo, trash — and
 * stays the set for anything in the app. These sixteen are nouns specific to
 * invoicing: a GSTIN, an HSN code, reverse charge, a bank line. A general set
 * can only answer those with near-misses, and sixteen near-misses is what made
 * the grid look generic. Drawn on the same 24-unit grid with the same caps and
 * joins as Rune, so the two sit together.
 */
function glyph(displayName: string, shapes: React.ReactNode, filled = false): Icon {
  function BillyIcon({ size = 20, strokeWidth = 1.6, title, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? undefined : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={title ? undefined : true}
        role={title ? "img" : undefined}
        focusable="false"
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {shapes}
      </svg>
    )
  }
  BillyIcon.displayName = displayName
  return BillyIcon
}

/** Saving down to the device — deliberately not a cloud: nothing is uploaded. */
export const SaveLocalIcon = glyph(
  "SaveLocalIcon",
  <>
    <path d="M12 3.5v9.5" />
    <path d="M8.2 9.7 12 13.5l3.8-3.8" />
    <path d="M4 15.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-3.5" />
  </>,
)

/** One curved arrow: two opposed straight arrows are reverse charge. */
export const UndoRedoIcon = glyph(
  "UndoRedoIcon",
  <>
    <path d="M4 8.5h8a5.5 5.5 0 0 1 0 11H8.5" />
    <path d="M7 5.5 4 8.5l3 3" />
  </>,
)

export const CommandIcon = glyph(
  "CommandIcon",
  <>
    <path d="M9.5 9.5h5v5h-5z" />
    <path d="M14.5 9.5V8a2 2 0 1 1 2 2h-2" />
    <path d="M14.5 14.5V16a2 2 0 1 0 2-2h-2" />
    <path d="M9.5 14.5V16a2 2 0 1 1-2-2h2" />
    <path d="M9.5 9.5V8a2 2 0 1 0-2 2h2" />
  </>,
)

export const KeyboardIcon = glyph(
  "KeyboardIcon",
  <>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M8 14h8" />
  </>,
)

/** A second sheet behind the one with the corner fold. */
export const PagesIcon = glyph(
  "PagesIcon",
  <>
    <path d="M17 7.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11" />
    <path d="M11 7h5.5L20 10.5V19a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
    <path d="M16.5 7v3.5H20" />
  </>,
)

/** A cloud struck through: no connection needed, and none used. */
export const OfflineIcon = glyph(
  "OfflineIcon",
  <>
    <path d="M7 18.5h10a4 4 0 0 0 .4-8A6 6 0 0 0 6.3 9 4.2 4.2 0 0 0 7 18.5z" />
    <path d="M4.5 4.5 19.5 19.5" />
  </>,
)

/** A calendar carrying a clock hand: a date that is counted from issue. */
export const PaymentTermsIcon = glyph(
  "PaymentTermsIcon",
  <>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <path d="M12 13.5V16l1.8 1" />
  </>,
)

/** The generic currency sign, since no one symbol stands for ten. */
export const CurrencyIcon = glyph(
  "CurrencyIcon",
  <>
    <circle cx="12" cy="12" r="7.5" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M14.3 9.7 16.8 7.2M9.7 9.7 7.2 7.2M14.3 14.3l2.5 2.5M9.7 14.3l-2.5 2.5" />
  </>,
)

export const BankIcon = glyph(
  "BankIcon",
  <>
    <path d="M3 9.5 12 4l9 5.5" />
    <path d="M5.5 9.8V19M9.8 9.8V19M14.2 9.8V19M18.5 9.8V19" />
    <path d="M3 19h18" />
  </>,
)

/** A reference number: a hash on a card. */
export const PoNumberIcon = glyph(
  "PoNumberIcon",
  <>
    <rect x="3" y="4.5" width="18" height="15" rx="3" />
    <path d="M10.5 8 9.5 16M15 8l-1 8M8.5 10.5h7M8 13.5h7" />
  </>,
)

export const PercentIcon = glyph(
  "PercentIcon",
  <>
    <circle cx="8.2" cy="8.2" r="2.3" />
    <circle cx="15.8" cy="15.8" r="2.3" />
    <path d="M18 6 6 18" />
  </>,
)

export const NotesIcon = glyph(
  "NotesIcon",
  <>
    <path d="M4.5 6h15M4.5 10.5h15M4.5 15h9" />
    <path d="M15.5 19.5 20 15l1.5 1.5-4.5 4.5h-1.5z" />
  </>,
)

/** Four cards with one chosen. */
export const PresetsIcon = glyph(
  "PresetsIcon",
  <>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor" stroke="none" />
  </>,
)

/** A registration card: the number identifies the business. */
export const GstinIcon = glyph(
  "GstinIcon",
  <>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <circle cx="8" cy="11" r="2" />
    <path d="M4.9 15.8c.6-1.5 1.7-2.3 3.1-2.3s2.5.8 3.1 2.3" />
    <path d="M14.5 10.2h4M14.5 13.6h4" />
  </>,
)

export const BarcodeIcon = glyph(
  "BarcodeIcon",
  <>
    <rect x="3" y="4.5" width="1.6" height="15" rx=".6" />
    <rect x="6.2" y="4.5" width="1" height="15" rx=".5" />
    <rect x="8.6" y="4.5" width="2" height="15" rx=".7" />
    <rect x="12.2" y="4.5" width="1" height="15" rx=".5" />
    <rect x="14.8" y="4.5" width="1.6" height="15" rx=".6" />
    <rect x="18.4" y="4.5" width="1" height="15" rx=".5" />
  </>,
  true,
)

/** Two arrows the other way round: the buyer pays the tax, not the seller. */
export const ReverseChargeIcon = glyph(
  "ReverseChargeIcon",
  <>
    <path d="M6.5 8.5h11" />
    <path d="M14.5 5.5 17.5 8.5l-3 3" />
    <path d="M17.5 15.5h-11" />
    <path d="M9.5 12.5 6.5 15.5l3 3" />
  </>,
)
