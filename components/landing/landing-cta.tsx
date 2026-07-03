"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export type LandingCtaVariant =
  | "nav-link"
  | "nav-pill"
  | "hero-primary"
  | "hero-ghost"
  | "final-primary"
  | "footer-link"

interface LandingCtaProps {
  variant: LandingCtaVariant
  label: string
  className?: string
}

const baseReset =
  "inline-flex items-center justify-center cursor-pointer appearance-none border-0"

const variantClass: Record<LandingCtaVariant, string> = {
  "nav-link": "landing-nav-link",
  "nav-pill": "landing-cta-pill-sm",
  "hero-primary": "landing-cta-primary",
  "hero-ghost": "landing-cta-ghost",
  "final-primary": "landing-cta-button",
  "footer-link": "landing-footer-link",
}

export function LandingCta({ variant, label, className }: LandingCtaProps) {
  const router = useRouter()
  const handleClick = () => {
    router.push("/signup")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseReset} ${variantClass[variant]} ${className ?? ""}`}
    >
      {label}
    </button>
  )
}
