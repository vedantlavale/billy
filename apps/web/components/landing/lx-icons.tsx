import type { SVGProps } from "react"

/**
 * Line icons for the bento tiles — 1.6px stroke, 24px grid, currentColor.
 *
 * Deliberately geometric rather than hand-drawn: neither locked reference
 * uses sketch/doodle line art, and emoji are never icons.
 */

const base = (p: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
})

export const IconCursorText = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 4h2.5M14.5 4H17M13 4v16M9 20h2.5M14.5 20H17M4 9v6" />
  </svg>
)

export const IconExport = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 3h8l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5" />
  </svg>
)

export const IconSum = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M17 5H7l5 7-5 7h10" />
  </svg>
)

export const IconLayers = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
    <path d="m3 12.5 9 4.5 9-4.5M3 17l9 4.5 9-4.5" />
  </svg>
)

export const IconShield = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5.5c0 4.4-2.9 7.9-7 9.5-4.1-1.6-7-5.1-7-9.5V6l7-3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
)

export const IconBolt = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
  </svg>
)

export const IconBrush = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 20c0-2.2 1.3-3 2.6-3.6M20.5 3.5c-1.6-1-4.6 1.3-8 5.1-1.4 1.6-2.6 3.2-3.4 4.6a4 4 0 0 1 2.3 2.3c1.4-.8 3-2 4.6-3.4 3.8-3.4 6.1-6.4 5.1-8Z" />
    <path d="M9.1 13.2a4 4 0 0 0-3.4 3.1" />
  </svg>
)
