import Link from "next/link"

/**
 * The Billy brand: Billy, a torn receipt with a face, on a sky-blue tile (the
 * favicon), and the wordmark in Geist 800. One component so the nav, editor
 * top bar, footer and 404 never drift apart. Assets for outside the app:
 * public/brand/.
 *
 * The tile's gradient lives in CSS (.brandmark, globals.css) rather than in
 * the SVG: the mark renders several times on a page, and duplicated SVG
 * gradient ids break whichever instance loses.
 */
export function BrandMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <span
      className={`brandmark${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" width={size} height={size} focusable="false">
        <path fill="#fff" opacity=".1" d="M62-5C76 15 70 32 90 46S96 80 110 92V-5Z" />
        <path fill="#fff" opacity=".12" d="M77-5C86 15 83 32 99 46S103 72 112 82V-5Z" />
        <g transform="rotate(-6 50 56)">
          <path
            fill="#eef4ff"
            stroke="#eef4ff"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M25 22A7 7 0 0 1 32 15H68A7 7 0 0 1 75 22V84L70 77.5L65 84L60 77.5L55 84L50 77.5L45 84L40 77.5L35 84L30 77.5L25 84Z"
          />
          <ellipse cx="40.5" cy="42" rx="5.2" ry="8" fill="#2563eb" />
          <ellipse cx="59.5" cy="42" rx="5.2" ry="8" fill="#2563eb" />
          <path stroke="#eef4ff" strokeWidth="1.7" strokeLinecap="round" d="M38.6 37.2l2.4 2M57.6 37.2l2.4 2" />
          <path stroke="#b9cff5" strokeWidth="4" strokeLinecap="round" d="M36 62H64M36 71H54" />
        </g>
      </svg>
    </span>
  )
}

export function Brand({
  href = "/",
  size = "md",
  className,
}: {
  href?: string
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const px = size === "lg" ? 32 : size === "sm" ? 22 : 26
  return (
    <Link href={href} aria-label="Billy home" className={`brand brand--${size}${className ? ` ${className}` : ""}`}>
      <BrandMark size={px} />
      <span className="brand-word">billy</span>
    </Link>
  )
}
