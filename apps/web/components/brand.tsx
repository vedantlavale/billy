import Link from "next/link"

/**
 * The Billy brand: a glass tile carrying a geometric "b" (the favicon), and
 * the wordmark in Inter 800. One component so the nav, editor top bar, footer
 * and 404 never drift apart. Assets for outside the app: public/brand/.
 *
 * The tile's gradients live in CSS (.brandmark, globals.css) rather than in
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
      <svg viewBox="0 0 32 32" width={size} height={size} focusable="false">
        <rect x="7.8" y="5.6" width="4.2" height="20.8" rx="2.1" fill="currentColor" />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M24.4 19.2A7.2 7.2 0 1 1 10 19.2A7.2 7.2 0 1 1 24.4 19.2ZM20.2 19.2A3 3 0 1 1 14.2 19.2A3 3 0 1 1 20.2 19.2Z"
        />
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
