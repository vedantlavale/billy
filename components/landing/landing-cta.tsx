"use client"

import * as React from "react"

import { useWaitlist } from "@/components/waitlist/waitlist-provider"

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

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
  "inline-flex items-center justify-center cursor-pointer appearance-none border-0 font-sans"

const variantClass: Record<LandingCtaVariant, string> = {
  "nav-link": "landing-nav-link",
  "nav-pill": "landing-cta-pill-sm",
  "hero-primary": "landing-cta-primary",
  "hero-ghost": "landing-cta-ghost",
  "final-primary": "landing-cta-button",
  "footer-link": "landing-footer-link",
}

export function LandingCta({ variant, label, className }: LandingCtaProps) {
  const { open } = useWaitlist()

  if (variant === "nav-pill") {
    return (
      <InteractiveHoverButton
        type="button"
        onClick={open}
        className={className}
      >
        {label}
      </InteractiveHoverButton>
    )
  }

  return (
    <button
      type="button"
      onClick={open}
      className={`${baseReset} ${variantClass[variant]} ${className ?? ""}`}
    >
      {label}
    </button>
  )
}
