import type { CSSProperties } from "react"

import MaskedHeading from "@/components/MaskedHeading"

const heading = {
  tag: "h1",
  text: "Launching soon",
  mediaType: "video",
  src: "/coming-soon/fill.mp4",
  poster: "/coming-soon/fill-poster.jpg",
  reveal: "rise",
  split: "chars",
  trigger: "mount",
  align: "center",
  fillScale: 1.25,
  parallax: 26,
  drift: 18,
  duration: 0.9,
  stagger: 0.05,
  weight: 800,
  tracking: -0.04,
  lineHeight: 1.06,
} as const

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties

/** One blurred screen of the new app, in a browser frame. */
function Screen({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-t-[18px] border border-b-0 border-[#e5e7eb] bg-white ${className}`}>
      <div className="flex h-9 items-center gap-2 border-b border-[#e5e7eb] bg-[#fafafa] px-4">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block w-full" />
    </div>
  )
}

export default function ComingSoon() {
  return (
    <main className="cs-page relative flex min-h-dvh flex-col overflow-hidden text-[#37352f]">
      <header className="cs-rise relative z-10 flex items-center justify-center gap-2.5 pt-9" style={delay(0)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark.svg" alt="" width={32} height={32} />
        <span className="text-[26px] font-extrabold tracking-[-0.04em]">billy</span>
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-[30vh] text-center sm:px-6 sm:pb-[36vh]">
        <div className="relative w-full max-w-[1280px]">
          <MaskedHeading {...heading} textScale={0.13} className="hidden sm:block" />
          <MaskedHeading {...heading} textScale={0.2} className="sm:hidden" />

          {/* the hand-drawn underline, drawn in once the letters land */}
          <svg
            aria-hidden
            viewBox="0 0 220 24"
            preserveAspectRatio="none"
            className="cs-underline pointer-events-none absolute -bottom-3 left-1/2 h-4 w-[44%] -translate-x-1/2 text-[#0070d7] sm:-bottom-5 sm:right-[7%] sm:left-auto sm:h-6 sm:w-[30%] sm:translate-x-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={5}
            strokeLinecap="round"
          >
            <path
              d="M5 14 C15 5 25 5 35 14 C45 23 55 23 65 14 C75 5 85 5 95 14 C105 23 115 23 125 14 C135 5 145 5 155 14 C165 23 175 23 185 14 C195 6 205 6 215 12"
              pathLength={1}
            />
          </svg>
        </div>

        <p className="cs-rise mt-12 max-w-xl text-lg text-[#6b6a65] sm:text-xl" style={delay(1.5)}>
          A whole new billy is on its way.
        </p>
      </section>

      {/* A blurred look at what's coming: three screens of the new app, fanned out */}
      <div aria-hidden className="cs-peek pointer-events-none absolute bottom-0 left-1/2 z-0 w-[min(980px,90vw)]">
        <Screen src="/coming-soon/peek-left.jpg" className="absolute top-14 -left-[15%] hidden w-[50%] -rotate-6 opacity-85 blur-[6px] md:block" />
        <Screen src="/coming-soon/peek-right.jpg" className="absolute top-14 -right-[15%] hidden w-[50%] rotate-6 opacity-85 blur-[6px] md:block" />
        <Screen src="/coming-soon/peek.jpg" className="relative shadow-[0_-24px_80px_rgba(0,112,215,0.18)] [&_img]:blur-[4px]" />
      </div>

      <footer className="absolute right-6 bottom-5 z-10 hidden text-xs text-[#6b6a65] sm:block">
        © {new Date().getFullYear()} billy · trybilly.tech
      </footer>
    </main>
  )
}
