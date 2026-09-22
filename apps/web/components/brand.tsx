import Link from "next/link"

/**
 * The Billy brand: a blue tile with a geometric "b" (the favicon), and the
 * wordmark in Inter 800. One component so the nav, editor top bar, footer
 * and 404 never drift apart. Assets for outside the app: public/brand/.
 */
export function BrandMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden focusable="false">
      <rect width="24" height="24" rx="6" fill="#0070D7" />
      <path d="M8.6 5.6V17.6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="12.7" cy="14.1" r="4" fill="none" stroke="#fff" strokeWidth="2.6" />
    </svg>
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
