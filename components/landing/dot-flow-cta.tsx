"use client"

import * as React from "react"

import { DotFlow, type DotFlowProps } from "@/components/ui/dot-flow"
import { useWaitlist } from "@/components/waitlist/waitlist-provider"

const items: DotFlowProps["items"] = [
  {
    title: "Join the waitlist",
    frames: [
      [0, 2, 4, 6, 20, 34, 48, 46, 44, 42, 28, 14, 8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
      [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
      [8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
      [9, 11, 15, 17, 19, 23, 25, 29, 31, 33, 37, 39],
      [16, 30, 24, 18, 32],
      [17, 23, 31, 25],
      [24],
      [17, 23, 31, 25],
      [16, 30, 24, 18, 32],
      [9, 11, 15, 17, 19, 23, 25, 29, 31, 33, 37, 39],
      [8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
      [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
      [0, 2, 4, 6, 20, 34, 48, 46, 44, 42, 28, 14, 8, 22, 36, 38, 40, 26, 12, 10, 16, 30, 24, 18, 32],
    ],
    duration: 200,
  },
  {
    title: "Get early access",
    frames: [
      [45, 38, 31, 24, 17, 23, 25],
      [38, 31, 24, 17, 10, 16, 18],
      [31, 24, 17, 10, 3, 9, 11],
      [24, 17, 10, 3, 2, 4],
      [17, 10, 3],
      [10, 3],
      [3],
      [],
      [45],
      [45, 38, 44, 46],
      [45, 38, 31, 37, 39],
      [45, 38, 31, 24, 30, 32],
    ],
    repeatCount: 2,
    duration: 100,
  },
  {
    title: "Be first in line",
    frames: [
      [9, 16, 17, 15, 23],
      [10, 17, 18, 16, 24],
      [11, 18, 19, 17, 25],
      [18, 25, 26, 24, 32],
      [25, 32, 33, 31, 39],
      [32, 39, 40, 38, 46],
      [31, 38, 39, 37, 45],
      [30, 37, 38, 36, 44],
      [23, 30, 31, 29, 37],
      [31, 29, 37, 22, 24, 23, 38, 36],
      [16, 23, 24, 22, 30],
    ],
    repeatCount: 2,
    duration: 150,
  },
]

export function DotFlowCta() {
  const { open } = useWaitlist()

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Join the billy waitlist"
      className="group/dotflow inline-block cursor-pointer appearance-none border-0 bg-transparent p-0 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D7377]"
    >
      <span className="block transition-shadow duration-200 group-hover/dotflow:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <DotFlow items={items} />
      </span>
    </button>
  )
}
