"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

const SQUIGGLE =
  "M5 14 C15 5 25 5 35 14 C45 23 55 23 65 14 C75 5 85 5 95 14 C105 23 115 23 125 14 C135 5 145 5 155 14 C165 23 175 23 185 14 C195 6 205 6 215 12"

/** One word with a hand-drawn blue underline that draws itself on scroll. */
export function Underlined({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <span className="lx-underline">
      {children}
      <svg viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d={SQUIGGLE}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        />
      </svg>
    </span>
  )
}
