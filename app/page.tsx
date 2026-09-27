import type { CSSProperties, ReactNode } from "react"

import MaskedHeading from "@/components/MaskedHeading"
import { PointerParallax } from "@/components/coming-soon/pointer-parallax"
import {
  DoodleArcArrow,
  DoodleBubble,
  DoodleCoin,
  DoodleFace,
  DoodlePaperPlane,
  DoodlePencilCheck,
  DoodleSparkles,
  DoodleSquiggleFlourish,
  DoodleStamp,
  DoodleStarBubble,
  DoodleUnderlineSquiggle,
} from "@/components/coming-soon/doodles"

/** A doodle pinned around the page: draws itself in, then floats and follows the pointer. */
function Scatter({
  children,
  style,
  delay,
  depth = 1,
  tone = "ink",
  className = "",
}: {
  children: ReactNode
  style: CSSProperties
  delay: number
  depth?: number
  tone?: "ink" | "blue"
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={`cs-scatter ${tone === "blue" ? "text-[#0070d7]" : "text-[#37352f]/70"} ${className}`}
      style={{ ...style, "--d": depth, "--delay": `${delay}s` } as CSSProperties}
    >
      <div className="cs-float cs-draw">{children}</div>
    </div>
  )
}

export default function ComingSoon() {
  return (
    <PointerParallax className="cs-page relative flex min-h-dvh flex-col overflow-hidden text-[#37352f]">
      {/* Doodles from the new landing page, scattered round the edges */}
      <Scatter style={{ top: "15%", left: "11%", width: 64 }} delay={0.5} depth={1.4} tone="blue">
        <DoodleSparkles />
      </Scatter>
      <Scatter style={{ top: "17%", left: "21%", width: 118 }} delay={0.8} depth={0.8} className="hidden sm:block">
        <DoodlePaperPlane />
      </Scatter>
      <Scatter style={{ top: "12%", right: "10%", width: 130 }} delay={0.65} depth={1}>
        <DoodleStarBubble />
      </Scatter>
      <Scatter style={{ top: "58%", left: "22%", width: 66 }} delay={1} depth={1.6} tone="blue" className="hidden sm:block">
        <DoodleCoin />
      </Scatter>
      <Scatter style={{ bottom: "27%", left: "8%", width: 118 }} delay={1.1} depth={1.1} className="hidden sm:block">
        <DoodlePencilCheck />
      </Scatter>
      <Scatter style={{ bottom: "29%", right: "11%", width: 92 }} delay={1.25} depth={1.3} tone="blue" className="hidden sm:block">
        <DoodleStamp />
      </Scatter>
      <Scatter style={{ top: "8%", left: "34%", width: 90 }} delay={0.9} depth={0.7} tone="blue" className="hidden md:block">
        <DoodleSquiggleFlourish />
      </Scatter>

      <header className="cs-rise relative z-10 flex items-center justify-center gap-2.5 pt-9" style={{ "--delay": "0s" } as CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark.svg" alt="" width={32} height={32} />
        <span className="text-[26px] font-extrabold tracking-[-0.04em]">billy</span>
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-40 text-center sm:px-6 sm:pb-48">
        <span
          className="cs-rise mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#e5e7eb] bg-white/80 px-4 py-2 text-sm font-semibold backdrop-blur"
          style={{ "--delay": "0.15s" } as CSSProperties}
        >
          <span className="cs-ping relative size-2 rounded-full bg-[#0070d7]" />
          Something new is on the way
        </span>

        <div className="relative w-full max-w-[1280px]">
          <MaskedHeading
            className="hidden sm:block"
            tag="h1"
            text="Launching soon"
            mediaType="video"
            src="/coming-soon/fill.mp4"
            poster="/coming-soon/fill-poster.jpg"
            reveal="rise"
            trigger="mount"
            align="center"
            fillScale={1.25}
            parallax={26}
            drift={18}
            duration={1.1}
            stagger={0.09}
            textScale={0.13}
            weight={800}
            tracking={-0.04}
            lineHeight={1.06}
          />
          <MaskedHeading
            className="sm:hidden"
            tag="h1"
            text="Launching soon"
            mediaType="video"
            src="/coming-soon/fill.mp4"
            poster="/coming-soon/fill-poster.jpg"
            reveal="rise"
            trigger="mount"
            align="center"
            fillScale={1.25}
            parallax={26}
            drift={18}
            duration={1.1}
            stagger={0.09}
            textScale={0.2}
            weight={800}
            tracking={-0.04}
            lineHeight={1.06}
          />

          {/* the hand-drawn underline, drawn in after the words land */}
          <div aria-hidden className="cs-underline pointer-events-none absolute -bottom-[0.12em] left-1/2 w-[44%] -translate-x-1/2 sm:right-[7%] sm:left-auto sm:w-[30%] sm:translate-x-0 text-[#0070d7]" style={{ fontSize: "clamp(20px, 13vw, 166px)" }}>
            <DoodleUnderlineSquiggle className="h-[0.16em] w-full" />
          </div>

          {/* billy's doodle face, peeking at the headline */}
          <div aria-hidden className="cs-rise absolute -top-[4.5rem] right-[2%] hidden items-end gap-1 sm:flex" style={{ "--delay": "1.5s" } as CSSProperties}>
            <DoodleFace className="cs-float w-16 text-[#37352f]" />
            <DoodleBubble text="psst!" className="-mb-2 w-24 text-[#0070d7]" />
          </div>
        </div>

        <p className="cs-rise mt-14 max-w-xl text-lg text-[#6b6a65] sm:text-xl" style={{ "--delay": "1.2s" } as CSSProperties}>
          A whole new billy is on its way.
        </p>
      </section>

      {/* a blurred sneak peek of what's coming, rising from the bottom edge */}
      <div aria-hidden className="cs-peek pointer-events-none absolute bottom-0 left-1/2 z-0 w-[min(1040px,92vw)]">
        <div className="absolute -top-24 -left-4 hidden items-end gap-2 text-[#0070d7] md:flex">
          <span className="cs-hand -rotate-6 text-3xl">sneak peek</span>
          <DoodleArcArrow className="w-20 rotate-[70deg] translate-y-6" />
        </div>
        <div className="overflow-hidden rounded-t-[18px] border border-b-0 border-[#e5e7eb] bg-white shadow-[0_-20px_80px_rgba(0,112,215,0.14)]">
          <div className="flex h-10 items-center gap-2 border-b border-[#e5e7eb] bg-[#fafafa] px-4">
            <span className="size-3 rounded-full bg-[#ff5f57]/80" />
            <span className="size-3 rounded-full bg-[#febc2e]/80" />
            <span className="size-3 rounded-full bg-[#28c840]/80" />
            <span className="mx-auto rounded-md border border-[#e5e7eb] bg-white px-3 py-0.5 text-xs text-[#6b6a65]">trybilly.tech</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coming-soon/peek.jpg" alt="" className="block w-full blur-[5px] saturate-[1.1]" />
        </div>
      </div>

      <footer className="absolute right-6 bottom-5 z-10 hidden text-xs text-[#6b6a65] sm:block">
        © {new Date().getFullYear()} billy · trybilly.tech
      </footer>
    </PointerParallax>
  )
}
