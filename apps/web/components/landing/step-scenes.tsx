"use client"

import { motion, useInView, useReducedMotion, type Transition } from "motion/react"
import { useRef, type ReactNode } from "react"

/*
 * Looping SVG scenes for the landing's "How it works" steps (#9).
 *
 * Each scene is one keyframe timeline on a shared clock: every element gets
 * the same duration and `times`, so the pieces stay in lock-step across
 * loops without a JS scheduler. Scenes only animate while on screen; off
 * screen, and under prefers-reduced-motion, they rest on a static final
 * frame that still reads as the finished step.
 */

const INK = "#37352f"
const LINE = "#E5E7EB"
const MUTED = "#F3F4F6"
const BLUE = "#0070D7"

type Keyframes = Record<string, (string | number)[]>

function useLive() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduce = useReducedMotion()
  return { ref, live: inView && !reduce }
}

/**
 * Props for one element of a scene. Live: loop the keyframes on the scene
 * clock. Idle: sit on the frame at `rest` (an index into each keyframe list).
 */
function track(
  live: boolean,
  frames: Keyframes,
  times: number[],
  duration: number,
  rest: number,
  ease: Transition["ease"] = "easeInOut",
) {
  if (!live) {
    const still = Object.fromEntries(Object.entries(frames).map(([k, v]) => [k, v[rest]]))
    return { initial: false as const, animate: still, transition: { duration: 0 } }
  }
  return {
    initial: false as const,
    animate: frames,
    transition: { duration, times, ease, repeat: Infinity, repeatDelay: 0 },
  }
}

function Scene({ label, children, svgRef }: { label: string; children: ReactNode; svgRef: React.Ref<SVGSVGElement> }) {
  return (
    <svg ref={svgRef} viewBox="0 0 280 140" className="lx-scene" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/* ── 1 · Click anything and type ─────────────────────────────────────────
   Cursor glides in, clicks (ripple), the field takes focus, text types in
   behind a moving caret, then the amount lands. */

export function TypeScene() {
  const { ref, live } = useLive()
  const T = 5.2
  const t = (...times: number[]) => times

  const text = "Brand identity design"
  const textX = 40
  const textW = 132

  return (
    <Scene svgRef={ref} label="A cursor clicks an invoice line and types “Brand identity design”, $1,200">
      {/* Ghost rows above and below give the field context. */}
      <rect x="28" y="22" width="224" height="10" rx="3" fill={MUTED} />
      <rect x="28" y="108" width="224" height="10" rx="3" fill={MUTED} />

      <motion.rect
        x="28"
        y="48"
        width="224"
        height="44"
        rx="6"
        fill="#ffffff"
        strokeWidth="1.5"
        {...track(live, { stroke: [LINE, LINE, BLUE, BLUE, LINE] }, t(0, 0.2, 0.24, 0.92, 1), T, 3)}
      />
      {/* Focus halo */}
      <motion.rect
        x="24"
        y="44"
        width="232"
        height="52"
        rx="9"
        fill="none"
        stroke={BLUE}
        strokeWidth="4"
        {...track(live, { opacity: [0, 0, 0.16, 0.16, 0] }, t(0, 0.2, 0.26, 0.92, 1), T, 3)}
      />

      <defs>
        <clipPath id="lx-type-clip">
          <motion.rect
            x={textX}
            y="56"
            height="28"
            {...track(live, { width: [0, 0, textW, textW, 0] }, t(0, 0.26, 0.64, 0.95, 1), T, 3, "linear")}
          />
        </clipPath>
      </defs>
      <text
        x={textX}
        y="75"
        fontSize="13"
        fontWeight="500"
        fill={INK}
        textLength={textW}
        lengthAdjust="spacingAndGlyphs"
        clipPath="url(#lx-type-clip)"
      >
        {text}
      </text>
      {/* Caret rides the clip edge. */}
      <motion.rect
        y="60"
        width="1.5"
        height="20"
        fill={BLUE}
        {...track(
          live,
          { x: [textX, textX, textX + textW + 2, textX + textW + 2, textX], opacity: [0, 1, 1, 1, 0] },
          t(0, 0.26, 0.64, 0.92, 1),
          T,
          3,
          "linear",
        )}
      />
      <motion.text
        x="240"
        y="75"
        fontSize="13"
        fontWeight="700"
        fill={INK}
        textAnchor="end"
        {...track(live, { opacity: [0, 0, 1, 1, 0], y: [4, 4, 0, 0, 0] }, t(0, 0.66, 0.72, 0.95, 1), T, 3)}
      >
        $1,200
      </motion.text>

      {/* Click ripple */}
      <motion.circle
        cx="130"
        cy="70"
        fill={BLUE}
        {...track(live, { r: [0, 0, 16, 16], opacity: [0, 0.25, 0, 0] }, t(0, 0.2, 0.3, 1), T, 3, "easeOut")}
      />
      {/* Pointer */}
      <motion.g
        {...track(
          live,
          { x: [236, 236, 130, 130, 236], y: [124, 124, 70, 70, 124], opacity: [0, 1, 1, 0, 0], scale: [1, 1, 0.86, 1, 1] },
          t(0, 0.04, 0.2, 0.34, 1),
          T,
          4,
        )}
      >
        <path
          d="M0 0 L0 16 L4.5 12 L7.5 19 L10 18 L7 11 L12.5 11 Z"
          fill="#ffffff"
          stroke={INK}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.g>
    </Scene>
  )
}

/* ── 2 · Pick a look ─────────────────────────────────────────────────────
   A mini invoice recolours while a selection ring steps across the real
   template palettes. */

export interface ScenePalette {
  paper: string
  primary: string
  accent: string
}

export function ThemeScene({ palettes }: { palettes: ScenePalette[] }) {
  const { ref, live } = useLive()
  const P = palettes.slice(0, 4)
  const T = 6.4
  // Hold each palette, then ease to the next; the last frame returns to the first.
  const times: number[] = []
  P.forEach((_, i) => {
    times.push(i / P.length, (i + 0.8) / P.length)
  })
  times.push(1)
  const hold = <K extends keyof ScenePalette>(key: K) => {
    const values: string[] = []
    P.forEach((p) => values.push(p[key], p[key]))
    values.push(P[0][key])
    return values
  }
  const swatchX = (i: number) => 176 + i * 22
  const ringX: number[] = []
  P.forEach((_, i) => ringX.push(swatchX(i), swatchX(i)))
  ringX.push(swatchX(0))
  const rest = 2 // second palette's hold — a non-default look reads as "picked"

  return (
    <Scene svgRef={ref} label="A mini invoice changes colour as different templates are picked">
      {/* Mini invoice */}
      <motion.rect x="36" y="14" width="120" height="112" rx="6" stroke={LINE} strokeWidth="1.5" {...track(live, { fill: hold("paper") }, times, T, rest)} />
      <motion.rect x="37" y="15" width="118" height="24" rx="5" {...track(live, { fill: hold("primary") }, times, T, rest)} />
      <rect x="46" y="22" width="46" height="8" rx="2" fill="#ffffff" opacity="0.9" />
      <rect x="46" y="50" width="54" height="5" rx="2" fill={INK} opacity="0.8" />
      <rect x="46" y="60" width="36" height="4" rx="2" fill={INK} opacity="0.35" />
      {[76, 88, 100].map((y) => (
        <rect key={y} x="46" y={y} width="100" height="1.5" fill={LINE} />
      ))}
      <motion.rect x="106" y="110" width="40" height="8" rx="2" {...track(live, { fill: hold("accent") }, times, T, rest)} />

      {/* Palette picker */}
      <text x="176" y="52" fontSize="11" fontWeight="600" fill={INK}>
        Template
      </text>
      {P.map((p, i) => (
        <g key={i}>
          <circle cx={swatchX(i)} cy="74" r="8" fill={p.primary} />
          <circle cx={swatchX(i)} cy="74" r="8" fill="none" stroke="rgba(55,53,47,0.15)" />
        </g>
      ))}
      <motion.circle
        cy="74"
        r="12"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        {...track(live, { cx: ringX }, times, T, rest)}
      />
      <rect x="170" y="96" width="74" height="22" rx="5" fill={MUTED} />
      <motion.rect x="176" y="104" width="10" height="6" rx="2" {...track(live, { fill: hold("accent") }, times, T, rest)} />
      <rect x="192" y="104" width="44" height="6" rx="2" fill={INK} opacity="0.35" />
    </Scene>
  )
}

/* ── 3 · Download the PDF ────────────────────────────────────────────────
   The sheet folds down into a PDF file, the download arrow draws, and a
   check confirms it's ready. */

export function ExportScene() {
  const { ref, live } = useLive()
  const T = 5.2

  return (
    <Scene svgRef={ref} label="The invoice turns into a downloaded PDF file with a check mark">
      {/* Sheet */}
      <motion.g
        {...track(
          live,
          { y: [0, 0, 16, 16, 0], scale: [1, 1, 0.5, 0.5, 1], opacity: [1, 1, 0, 0, 1] },
          [0, 0.18, 0.34, 0.9, 1],
          T,
          2,
        )}
      >
        <rect x="100" y="12" width="80" height="104" rx="4" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
        <rect x="110" y="24" width="30" height="6" rx="2" fill={INK} opacity="0.8" />
        {[42, 52, 62, 72].map((y) => (
          <rect key={y} x="110" y={y} width="60" height="1.5" fill={LINE} />
        ))}
        <rect x="140" y="92" width="30" height="7" rx="2" fill={BLUE} />
      </motion.g>

      {/* PDF file */}
      <motion.g
        {...track(live, { opacity: [0, 0, 1, 1, 0, 0], y: [-8, -8, 0, 0, 0, 0] }, [0, 0.3, 0.42, 0.84, 0.9, 1], T, 2)}
      >
        <path
          d="M72 34 h40 l14 14 v58 a4 4 0 0 1 -4 4 h-50 a4 4 0 0 1 -4 -4 v-68 a4 4 0 0 1 4 -4 z"
          fill="#ffffff"
          stroke={INK}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M112 34 v14 h14" fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="78" y="80" width="30" height="16" rx="3" fill={BLUE} />
        <text x="93" y="92" fontSize="9" fontWeight="700" fill="#ffffff" textAnchor="middle">
          PDF
        </text>
        <text x="146" y="66" fontSize="11" fontWeight="600" fill={INK}>
          invoice-042.pdf
        </text>
        <text x="146" y="82" fontSize="10" fill={INK}>
          Ready · 1 page
        </text>
      </motion.g>

      {/* Download arrow into tray */}
      <motion.path
        d="M190 94 v18 M183 105 l7 7 l7 -7"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...track(live, { pathLength: [0, 0, 1, 1, 1, 0], opacity: [0, 0, 1, 1, 0, 0] }, [0, 0.42, 0.56, 0.84, 0.9, 1], T, 2)}
      />
      <motion.path
        d="M178 116 v4 h24 v-4"
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...track(live, { opacity: [0, 0, 1, 1, 0, 0] }, [0, 0.4, 0.46, 0.84, 0.9, 1], T, 2)}
      />

      {/* Check */}
      <motion.circle
        cx="226"
        cy="106"
        r="11"
        fill={BLUE}
        {...track(live, { scale: [0.4, 0.4, 1, 1, 1, 0.4], opacity: [0, 0, 1, 1, 0, 0] }, [0, 0.56, 0.64, 0.84, 0.9, 1], T, 2)}
      />
      <motion.path
        d="M221 106 l3.5 3.5 l6.5 -7"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...track(live, { pathLength: [0, 0, 1, 1, 1, 0], opacity: [0, 0, 1, 1, 0, 0] }, [0, 0.62, 0.72, 0.84, 0.9, 1], T, 2)}
      />
    </Scene>
  )
}
