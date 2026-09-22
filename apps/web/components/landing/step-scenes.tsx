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
  // Every element must span the whole loop: Motion ends a repeat at the last
  // keyframe, so a timeline stopping short of 1 loops faster and drifts.
  if (process.env.NODE_ENV !== "production" && times[times.length - 1] !== 1) {
    console.warn("step-scenes: keyframe times must end at 1", times)
  }
  return {
    initial: false as const,
    animate: frames,
    transition: { duration, times, ease, repeat: Infinity, repeatDelay: 0 },
  }
}

function Scene({
  label,
  children,
  svgRef,
  viewBox = "0 0 280 140",
  wide,
}: {
  label: string
  children: ReactNode
  svgRef: React.Ref<SVGSVGElement>
  viewBox?: string
  wide?: boolean
}) {
  return (
    <svg ref={svgRef} viewBox={viewBox} className={wide ? "lx-scene lx-scene--wide" : "lx-scene"} role="img" aria-label={label}>
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

/* A shared pointer + click ripple for the scenes that "use" the UI. */
function Pointer({
  live,
  x,
  y,
  times,
  T,
  rest,
  press,
}: {
  live: boolean
  x: number[]
  y: number[]
  times: number[]
  T: number
  rest: number
  press: number[]
}) {
  return (
    <motion.g {...track(live, { x, y, opacity: x.map((_, i) => (i === 0 || i === x.length - 1 ? 0 : 1)), scale: press }, times, T, rest)}>
      <path
        d="M0 0 L0 16 L4.5 12 L7.5 19 L10 18 L7 11 L12.5 11 Z"
        fill="#ffffff"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </motion.g>
  )
}

function Ripple({ live, cx, cy, at, T }: { live: boolean; cx: number; cy: number; at: number; T: number }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      fill={BLUE}
      {...track(live, { r: [0, 0, 14, 14], opacity: [0, 0.28, 0, 0] }, [0, at, Math.min(at + 0.07, 0.99), 1], T, 0, "easeOut")}
    />
  )
}

/* ── 2 · Pick a look ─────────────────────────────────────────────────────
   Everything the copy promises, in order: a cursor picks a template (the
   header band sweeps in), drops in a logo (it pops), then switches currency
   (the total rolls from $ to ₹). */

export interface ScenePalette {
  paper: string
  primary: string
  accent: string
}

export function ThemeScene({ palettes }: { palettes: ScenePalette[] }) {
  const { ref, live } = useLive()
  const T = 8
  const from = palettes[0]
  const to = palettes[1] ?? palettes[0]
  const swatches = palettes.slice(0, 3)
  const REST = 4 // frame index where everything has been picked

  // Clicks happen at these fractions of the loop.
  const C1 = 0.2 // template
  const C2 = 0.44 // logo
  const C3 = 0.68 // currency

  return (
    <Scene svgRef={ref} label="A cursor picks a template, adds a logo and switches currency on a mini invoice">
      {/* Mini invoice */}
      <rect x="18" y="12" width="132" height="116" rx="6" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
      <motion.rect
        x="19"
        y="13"
        width="130"
        height="26"
        rx="5"
        fill={to.primary}
        style={{ originX: 0 }}
        {...track(live, { scaleX: [0, 0, 1, 1, 1, 0], opacity: [0, 0, 1, 1, 1, 0] }, [0, C1 + 0.02, C1 + 0.1, 0.9, 0.93, 1], T, REST)}
      />
      {/* Logo slot → logo */}
      <circle cx="38" cy="56" r="10" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="3 3" />
      <motion.g
        {...track(live, { scale: [0, 0, 1.18, 1, 1, 0] }, [0, C2 + 0.02, C2 + 0.07, C2 + 0.11, 0.93, 1], T, REST)}
      >
        <circle cx="38" cy="56" r="10" fill={INK} />
        <path d="M33 59 L38 51 L43 59 Z" fill="#ffffff" />
      </motion.g>
      <rect x="54" y="50" width="52" height="5" rx="2" fill={INK} opacity="0.8" />
      <rect x="54" y="60" width="34" height="4" rx="2" fill={INK} opacity="0.35" />
      {[78, 90].map((y) => (
        <rect key={y} x="28" y={y} width="112" height="1.5" fill={LINE} />
      ))}
      <motion.rect
        x="96"
        y="106"
        width="44"
        height="12"
        rx="3"
        {...track(live, { fill: [from.accent, from.accent, to.accent, to.accent, to.accent, from.accent] }, [0, C1 + 0.02, C1 + 0.1, 0.9, 0.93, 1], T, REST)}
      />
      {/* Total rolls $ → ₹ */}
      <defs>
        <clipPath id="lx-roll-clip">
          <rect x="28" y="100" width="64" height="22" />
        </clipPath>
      </defs>
      <g clipPath="url(#lx-roll-clip)">
        <motion.text x="30" y="116" fontSize="12" fontWeight="700" fill={INK}
          {...track(live, { y: [0, 0, -16, -16, 0], opacity: [1, 1, 0, 0, 1] }, [0, C3 + 0.02, C3 + 0.08, 0.94, 1], T, 3)}>
          $2,300
        </motion.text>
        <motion.text x="30" y="116" fontSize="12" fontWeight="700" fill={INK}
          {...track(live, { y: [16, 16, 0, 0, 16], opacity: [0, 0, 1, 1, 0] }, [0, C3 + 0.02, C3 + 0.08, 0.94, 1], T, 3)}>
          ₹2,300
        </motion.text>
      </g>

      {/* Controls */}
      <text x="168" y="22" fontSize="9" fontWeight="600" fill={INK}>Template</text>
      {swatches.map((p, i) => (
        <rect key={i} x={168 + i * 26} y="28" width="20" height="16" rx="3" fill={p.paper} stroke={LINE} />
      ))}
      {swatches.map((p, i) => (
        <rect key={`b${i}`} x={170 + i * 26} y="30" width="16" height="4" rx="1" fill={p.primary} />
      ))}
      <motion.rect
        y="26"
        width="24"
        height="20"
        rx="4"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.75"
        {...track(live, { x: [166, 166, 192, 192, 192, 166] }, [0, C1, C1 + 0.04, 0.9, 0.93, 1], T, REST)}
      />

      <text x="168" y="64" fontSize="9" fontWeight="600" fill={INK}>Logo</text>
      <rect x="168" y="70" width="72" height="18" rx="4" fill="#ffffff" stroke={LINE} />
      <path d="M176 82 v-6 M173 79 l3 -3 l3 3" stroke={INK} strokeWidth="1.25" fill="none" strokeLinecap="round" />
      <text x="185" y="82" fontSize="8.5" fill={INK}>Upload</text>

      <text x="168" y="104" fontSize="9" fontWeight="600" fill={INK}>Currency</text>
      <rect x="168" y="110" width="72" height="18" rx="9" fill={MUTED} />
      <motion.text x="178" y="122" fontSize="8.5" fontWeight="600" fill={INK}
        {...track(live, { opacity: [1, 1, 0, 0, 1] }, [0, C3 + 0.02, C3 + 0.04, 0.94, 1], T, 3)}>USD · $</motion.text>
      <motion.text x="178" y="122" fontSize="8.5" fontWeight="600" fill={BLUE}
        {...track(live, { opacity: [0, 0, 1, 1, 0] }, [0, C3 + 0.02, C3 + 0.04, 0.94, 1], T, 3)}>INR · ₹</motion.text>

      <Ripple live={live} cx={202} cy={36} at={C1} T={T} />
      <Ripple live={live} cx={200} cy={79} at={C2} T={T} />
      <Ripple live={live} cx={204} cy={119} at={C3} T={T} />
      <Pointer
        live={live}
        T={T}
        rest={0}
        times={[0, 0.06, C1 - 0.02, C1, C1 + 0.04, C2 - 0.02, C2, C2 + 0.04, C3 - 0.02, C3, C3 + 0.04, 0.84, 1]}
        x={[262, 262, 202, 202, 202, 200, 200, 200, 204, 204, 204, 262, 262]}
        y={[140, 140, 36, 36, 36, 79, 79, 79, 119, 119, 119, 140, 140]}
        press={[1, 1, 1, 0.84, 1, 1, 0.84, 1, 1, 0.84, 1, 1, 1]}
      />
    </Scene>
  )
}

/* ── 3 · Download the PDF ────────────────────────────────────────────────
   A real flow: click Download, a progress bar fills, the invoice flies into
   the downloads panel and lands as a file with a check and a badge. */

export function ExportScene() {
  const { ref, live } = useLive()
  const T = 6.4
  const C = 0.14 // click
  const DONE = 0.44 // progress complete, sheet takes off
  const LAND = 0.6 // sheet lands in downloads
  const REST = 3

  return (
    <Scene svgRef={ref} label="Clicking Download PDF fills a progress bar and the invoice lands in downloads as a PDF">
      {/* Download button with progress */}
      <motion.g style={{ originX: "208px", originY: "25px" }}
        {...track(live, { scale: [1, 1, 0.94, 1, 1] }, [0, C, C + 0.02, C + 0.05, 1], T, 0)}>
        <rect x="160" y="14" width="96" height="24" rx="6" fill={BLUE} />
        <defs>
          <clipPath id="lx-progress-clip">
            <rect x="160" y="14" width="96" height="24" rx="6" />
          </clipPath>
        </defs>
        <motion.rect
          x="160"
          y="35"
          height="3"
          fill="#ffffff"
          clipPath="url(#lx-progress-clip)"
          {...track(live, { width: [0, 0, 96, 96, 96, 96], opacity: [0, 0.9, 0.9, 0.9, 0, 0] }, [0, C + 0.03, DONE, DONE + 0.03, DONE + 0.06, 1], T, 0, "easeInOut")}
        />
        <path d="M172 21 v8 M168.5 26 l3.5 3.5 l3.5 -3.5" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="182" y="30" fontSize="9" fontWeight="700" fill="#ffffff">Download PDF</text>
      </motion.g>

      {/* Downloads panel */}
      <motion.g style={{ originX: "208px", originY: "100px" }}
        {...track(live, { scale: [1, 1, 1.05, 1, 1] }, [0, LAND, LAND + 0.03, LAND + 0.07, 1], T, REST)}>
        <rect x="160" y="62" width="96" height="66" rx="8" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
        <text x="170" y="78" fontSize="9" fontWeight="600" fill={INK}>Downloads</text>
        <path d="M168 84 h80" stroke={LINE} strokeWidth="1" />
        <motion.g {...track(live, { opacity: [0, 0, 1, 1, 0, 0], x: [-6, -6, 0, 0, 0, -6] }, [0, LAND, LAND + 0.05, 0.84, 0.88, 1], T, REST)}>
          <rect x="168" y="92" width="18" height="22" rx="3" fill="#ffffff" stroke={INK} strokeWidth="1.25" />
          <rect x="170" y="104" width="14" height="7" rx="1.5" fill={BLUE} />
          <text x="177" y="109.5" fontSize="5" fontWeight="700" fill="#ffffff" textAnchor="middle">PDF</text>
          <text x="191" y="101" fontSize="7.5" fontWeight="600" fill={INK}>invoice-042</text>
          <text x="191" y="111" fontSize="7" fill={INK}>1 page · 48 KB</text>
        </motion.g>
        <motion.circle cx="243" cy="103" r="6.5" fill={BLUE}
          {...track(live, { scale: [0, 0, 1.2, 1, 1, 0, 0] }, [0, LAND + 0.05, LAND + 0.09, LAND + 0.12, 0.84, 0.88, 1], T, REST)} />
        <motion.path d="M240 103 l2 2 l4 -4.5" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
          {...track(live, { pathLength: [0, 0, 1, 1, 0, 0], opacity: [0, 0, 1, 1, 0, 0] }, [0, LAND + 0.1, LAND + 0.15, 0.84, 0.87, 1], T, REST)} />
      </motion.g>
      {/* Badge */}
      <motion.g {...track(live, { scale: [0, 0, 1.25, 1, 1, 0, 0] }, [0, LAND + 0.02, LAND + 0.06, LAND + 0.09, 0.84, 0.88, 1], T, REST)}>
        <circle cx="252" cy="64" r="7" fill={INK} />
        <text x="252" y="67" fontSize="8" fontWeight="700" fill="#ffffff" textAnchor="middle">1</text>
      </motion.g>

      {/* The invoice: lifts, flies into Downloads, then quietly returns */}
      <motion.g
        {...track(
          live,
          {
            x: [0, 0, 0, 118, 118, 0, 0, 0],
            y: [0, 0, -5, 30, 30, 0, 0, 0],
            scale: [1, 1, 0.96, 0.22, 0.22, 1, 1, 1],
            rotate: [0, 0, -3, -12, -12, 0, 0, 0],
            opacity: [1, 1, 1, 0.2, 0, 0, 1, 1],
          },
          [0, DONE, DONE + 0.03, LAND, LAND + 0.01, 0.9, 0.98, 1],
          T,
          REST,
        )}
      >
        <rect x="22" y="26" width="112" height="100" rx="5" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
        <rect x="32" y="38" width="40" height="7" rx="2" fill={INK} opacity="0.85" />
        {[56, 66, 76, 86].map((y) => (
          <rect key={y} x="32" y={y} width="92" height="1.5" fill={LINE} />
        ))}
        <rect x="88" y="104" width="36" height="9" rx="2" fill={BLUE} />
      </motion.g>
      <motion.text x="78" y="80" fontSize="9" fontWeight="600" fill={INK} textAnchor="middle"
        {...track(live, { opacity: [0, 0, 1, 1, 0, 0] }, [0, LAND + 0.02, LAND + 0.06, 0.82, 0.86, 1], T, REST)}>
        Saved to your device
      </motion.text>

      <Ripple live={live} cx={208} cy={26} at={C} T={T} />
      <Pointer
        live={live}
        T={T}
        rest={0}
        times={[0, 0.03, C - 0.02, C, C + 0.04, 0.3, 1]}
        x={[250, 250, 208, 208, 208, 262, 262]}
        y={[130, 130, 26, 26, 26, 140, 140]}
        press={[1, 1, 1, 0.84, 1, 1, 1]}
      />
    </Scene>
  )
}

/* ── Private by design ───────────────────────────────────────────────────
   Your data circles inside the browser tab. A request tries the road to a
   server and is stopped at the barrier — there is no server to reach. */

export function PrivacyScene() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduce = useReducedMotion()
  const live = inView && !reduce
  const T = 4.8
  const orbit = (phase: number) => {
    const xs: number[] = []
    const ys: number[] = []
    for (let i = 0; i <= 12; i++) {
      const a = phase + (i / 12) * Math.PI * 2
      xs.push(Math.round(Math.cos(a) * 34 * 100) / 100)
      ys.push(Math.round(Math.sin(a) * 22 * 100) / 100)
    }
    return { x: xs, y: ys }
  }
  const ring = Array.from({ length: 13 }, (_, i) => i / 12)

  return (
    <svg ref={ref} viewBox="0 0 320 170" className="lx-scene lx-scene--wide" role="img"
      aria-label="Your invoice data stays inside the browser tab; the path to a server is blocked">
      {/* Browser tab */}
      <rect x="12" y="16" width="190" height="138" rx="10" fill="#ffffff" stroke={INK} strokeWidth="1.5" />
      <path d="M12 42 h190" stroke={LINE} strokeWidth="1.5" />
      {[26, 36, 46].map((x) => (
        <circle key={x} cx={x} cy="29" r="3" fill={LINE} />
      ))}
      <rect x="62" y="22" width="84" height="14" rx="7" fill={MUTED} />
      <path d="M72 30.5 v-2.2 a3 3 0 0 1 6 0 v2.2" stroke={INK} strokeWidth="1.1" fill="none" />
      <rect x="70.5" y="29.5" width="9" height="6" rx="1.5" fill={INK} />
      <text x="84" y="33" fontSize="8.5" fontWeight="600" fill={INK}>this tab only</text>

      {/* Invoice at the centre */}
      <rect x="92" y="72" width="30" height="38" rx="3" fill="#ffffff" stroke={INK} strokeWidth="1.25" />
      <rect x="97" y="79" width="14" height="3" rx="1" fill={INK} opacity="0.8" />
      {[87, 93, 99].map((y) => (
        <rect key={y} x="97" y={y} width="20" height="1.2" fill={LINE} />
      ))}
      <rect x="107" y="103" width="10" height="3" rx="1" fill={BLUE} />

      {/* Data orbiting inside the tab */}
      {[0, 2.1, 4.2].map((phase, i) => {
        const o = orbit(phase)
        return (
          <motion.circle
            key={i}
            cx="107"
            cy="91"
            r={i === 0 ? 4 : 3}
            fill={BLUE}
            opacity={i === 0 ? 1 : 0.55}
            initial={false}
            animate={live ? { x: o.x, y: o.y } : { x: o.x[0], y: o.y[0] }}
            transition={live ? { duration: T, times: ring, ease: "linear", repeat: Infinity } : { duration: 0 }}
          />
        )
      })}

      {/* The road to a server, and the barrier */}
      <path d="M202 91 H262" stroke={INK} strokeWidth="1.25" strokeDasharray="3 4" opacity="0.4" />
      <g opacity="0.45">
        <path d="M268 102 a11 11 0 0 1 2 -21.8 a15 15 0 0 1 28 3 a9.5 9.5 0 0 1 2 18.8 z" fill="#ffffff" stroke={INK} strokeWidth="1.25" strokeDasharray="3 3" />
        <text x="284" y="122" fontSize="8.5" fontWeight="600" fill={INK} textAnchor="middle">No server</text>
      </g>
      <motion.circle
        cy="91"
        r="3.5"
        fill={BLUE}
        initial={false}
        animate={live ? { cx: [202, 202, 226, 206, 202], opacity: [0, 1, 1, 0.6, 0] } : { cx: 202, opacity: 0 }}
        transition={live ? { duration: 2.4, times: [0, 0.1, 0.45, 0.7, 1], ease: "easeInOut", repeat: Infinity } : { duration: 0 }}
      />
      <motion.g
        initial={false}
        animate={live ? { scale: [1, 1, 1.25, 1, 1] } : { scale: 1 }}
        transition={live ? { duration: 2.4, times: [0, 0.42, 0.5, 0.62, 1], repeat: Infinity } : { duration: 0 }}
      >
        <circle cx="236" cy="91" r="9" fill="#ffffff" stroke={INK} strokeWidth="1.5" />
        <path d="M230 97 L242 85" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}

/* ── Any currency ────────────────────────────────────────────────────────
   The same total rolls through currencies, formatted exactly the way Billy
   formats them (passed in from invoice-core, so it can't drift). */

export function CurrencyScene({ amounts }: { amounts: { code: string; text: string }[] }) {
  const { ref, live } = useLive()
  const N = amounts.length
  const T = N * 1.5
  const ROW = 34
  // Hold each amount, then roll up; the strip repeats the first amount at the
  // end so the loop restarts without a visible jump.
  const times: number[] = []
  const ys: number[] = []
  for (let i = 0; i < N; i++) {
    times.push(i / N, (i + 0.72) / N)
    ys.push(-i * ROW, -i * ROW)
  }
  times.push(1)
  ys.push(-N * ROW)
  const chipW = 40
  const chipsX = 140 - (N * chipW + (N - 1) * 6) / 2
  const ringX: number[] = []
  for (let i = 0; i < N; i++) ringX.push(chipsX + i * (chipW + 6), chipsX + i * (chipW + 6))
  ringX.push(chipsX)

  return (
    <Scene svgRef={ref} label={`One invoice total shown in ${amounts.map((a) => a.code).join(", ")}`}>
      <rect x="40" y="14" width="200" height="72" rx="10" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
      <text x="58" y="36" fontSize="10" fontWeight="600" fill={INK}>Total due</text>
      <defs>
        <clipPath id="lx-currency-clip">
          <rect x="52" y="42" width="176" height={ROW} />
        </clipPath>
      </defs>
      <g clipPath="url(#lx-currency-clip)">
        <motion.g {...track(live, { y: ys }, times, T, 0)}>
          {[...amounts, amounts[0]].map((a, i) => (
            <text key={i} x="58" y={68 + i * ROW} fontSize="22" fontWeight="700" fill={INK}>
              {a.text}
            </text>
          ))}
        </motion.g>
      </g>
      {amounts.map((a, i) => (
        <g key={a.code}>
          <rect x={chipsX + i * (chipW + 6)} y="100" width={chipW} height="22" rx="11" fill={MUTED} />
          <text x={chipsX + i * (chipW + 6) + chipW / 2} y="115" fontSize="9" fontWeight="700" fill={INK} textAnchor="middle">
            {a.code}
          </text>
        </g>
      ))}
      <motion.rect y="99" width={chipW + 2} height="24" rx="12" fill="none" stroke={BLUE} strokeWidth="1.75"
        {...track(live, { x: ringX.map((x) => x - 1) }, times, T, 0)} />
    </Scene>
  )
}

/* ── Logo & stamp ────────────────────────────────────────────────────────
   A logo drops into the header slot, then the seal presses onto the page. */

export function StampScene() {
  const { ref, live } = useLive()
  const T = 5.2
  const REST = 4
  return (
    <Scene svgRef={ref} label="A logo drops onto the invoice header and a seal is stamped at the bottom">
      <rect x="60" y="10" width="160" height="122" rx="6" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
      <circle cx="84" cy="34" r="12" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="3 3" />
      <motion.g {...track(live, { y: [-26, -26, 3, 0, 0, -26], opacity: [0, 0, 1, 1, 1, 0], scale: [1, 1, 1.06, 1, 1, 1] }, [0, 0.08, 0.2, 0.26, 0.9, 1], T, REST)}>
        <circle cx="84" cy="34" r="12" fill={INK} />
        <path d="M78 38 L84 28 L90 38 Z" fill="#ffffff" />
      </motion.g>
      <rect x="104" y="28" width="56" height="6" rx="2" fill={INK} opacity="0.85" />
      <rect x="104" y="39" width="36" height="4" rx="2" fill={INK} opacity="0.35" />
      {[60, 72, 84].map((y) => (
        <rect key={y} x="72" y={y} width="136" height="1.5" fill={LINE} />
      ))}
      <rect x="72" y="100" width="56" height="4" rx="2" fill={INK} opacity="0.35" />
      <rect x="72" y="110" width="40" height="4" rx="2" fill={INK} opacity="0.2" />
      {/* Ink bloom where the seal lands */}
      <motion.circle cx="186" cy="106" fill={BLUE}
        {...track(live, { r: [0, 0, 0, 30, 30], opacity: [0, 0, 0.18, 0, 0] }, [0, 0.46, 0.5, 0.62, 1], T, REST, "easeOut")} />
      <motion.g
        {...track(
          live,
          { scale: [1.6, 1.6, 1.6, 0.92, 1, 1, 1.6], opacity: [0, 0, 0.5, 1, 1, 0, 0], rotate: [-4, -4, -4, -12, -12, -12, -4] },
          [0, 0.34, 0.4, 0.5, 0.56, 0.9, 1],
          T,
          REST,
        )}
      >
        <circle cx="186" cy="106" r="20" fill="none" stroke={BLUE} strokeWidth="2.5" />
        <circle cx="186" cy="106" r="14.5" fill="none" stroke={BLUE} strokeWidth="1.25" strokeDasharray="2.5 3" />
        <path d="M179 106.5 l5 5 l9 -10" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </Scene>
  )
}

/* ── Built for GST ───────────────────────────────────────────────────────
   One switch moves the same ₹10,000 invoice between intra-state (CGST +
   SGST) and inter-state (IGST); the lines swap and the total doesn't move. */

export function GstScene({
  lines,
}: {
  lines: { subtotal: string; half: string; full: string; total: string }
}) {
  const { ref, live } = useLive()
  const T = 6
  const SW = 0.42 // switch to IGST
  const BACK = 0.9 // switch back
  const REST = 1
  const intra = { opacity: [1, 1, 0, 0, 1], y: [0, 0, -8, -8, 0] }
  const inter = { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 8] }
  const swapTimes = [0, SW, SW + 0.06, BACK, 1]

  return (
    <Scene svgRef={ref} viewBox="0 0 560 170" wide label="Switching between same-state and other-state GST changes CGST and SGST to IGST while the total stays the same">
      {/* The switch */}
      <text x="24" y="44" fontSize="11" fontWeight="600" fill={INK}>Where is your client?</text>
      <rect x="24" y="56" width="200" height="36" rx="10" fill={MUTED} />
      <motion.rect y="60" width="94" height="28" rx="7" fill="#ffffff" stroke={LINE}
        {...track(live, { x: [28, 28, 126, 126, 28] }, swapTimes, T, REST)} />
      <text x="75" y="78" fontSize="11" fontWeight="700" fill={INK} textAnchor="middle">Same state</text>
      <text x="173" y="78" fontSize="11" fontWeight="700" fill={INK} textAnchor="middle">Other state</text>
      <text x="24" y="118" fontSize="10" fill={INK}>Tax rate 18% · GST</text>

      {/* The totals */}
      <rect x="276" y="18" width="260" height="136" rx="10" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
      <text x="296" y="46" fontSize="11" fill={INK}>Subtotal</text>
      <text x="516" y="46" fontSize="11" fontWeight="600" fill={INK} textAnchor="end">{lines.subtotal}</text>

      <motion.g {...track(live, intra, swapTimes, T, REST)}>
        <text x="296" y="70" fontSize="11" fill={INK}>CGST 9%</text>
        <text x="516" y="70" fontSize="11" fontWeight="600" fill={INK} textAnchor="end">{lines.half}</text>
        <text x="296" y="92" fontSize="11" fill={INK}>SGST 9%</text>
        <text x="516" y="92" fontSize="11" fontWeight="600" fill={INK} textAnchor="end">{lines.half}</text>
      </motion.g>
      <motion.g {...track(live, inter, swapTimes, T, REST)}>
        <text x="296" y="81" fontSize="11" fill={BLUE} fontWeight="600">IGST 18%</text>
        <text x="516" y="81" fontSize="11" fontWeight="700" fill={BLUE} textAnchor="end">{lines.full}</text>
      </motion.g>

      <path d="M296 110 H516" stroke={LINE} strokeWidth="1.5" />
      <text x="296" y="136" fontSize="12" fontWeight="700" fill={INK}>Total</text>
      <text x="516" y="136" fontSize="16" fontWeight="700" fill={INK} textAnchor="end">{lines.total}</text>

      {/* Pointer flips the switch both ways */}
      <motion.g
        {...track(
          live,
          { x: [214, 214, 180, 180, 180, 90, 90, 214], y: [150, 150, 80, 80, 80, 80, 80, 150], opacity: [0, 1, 1, 1, 1, 1, 1, 0], scale: [1, 1, 1, 0.84, 1, 1, 0.84, 1] },
          [0, 0.06, SW - 0.04, SW, SW + 0.03, BACK - 0.04, BACK, 1],
          T,
          REST,
        )}
      >
        <path d="M0 0 L0 16 L4.5 12 L7.5 19 L10 18 L7 11 L12.5 11 Z" fill="#ffffff" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      </motion.g>
    </Scene>
  )
}

/* ── Exactly what you see ────────────────────────────────────────────────
   The editor page and the downloaded PDF side by side; a scan line sweeps
   both and ticks them off as identical. */

export function MatchScene() {
  const { ref, live } = useLive()
  const T = 4
  const doc = (x: number, label: string) => (
    <g>
      <rect x={x} y="16" width="96" height="112" rx="5" fill="#ffffff" stroke={LINE} strokeWidth="1.5" />
      <rect x={x + 10} y="28" width="36" height="6" rx="2" fill={INK} opacity="0.85" />
      {[46, 56, 66, 76].map((y) => (
        <rect key={y} x={x + 10} y={y} width="76" height="1.5" fill={LINE} />
      ))}
      <rect x={x + 54} y="102" width="32" height="8" rx="2" fill={BLUE} />
      <text x={x + 48} y="142" fontSize="9" fontWeight="600" fill={INK} textAnchor="middle">{label}</text>
    </g>
  )
  return (
    <Scene svgRef={ref} label="The editor view and the PDF are scanned side by side and match exactly">
      {doc(28, "In the editor")}
      {doc(156, "In the PDF")}
      <text x="140" y="76" fontSize="16" fontWeight="700" fill={INK} textAnchor="middle">=</text>
      <motion.rect x="24" width="232" height="2" rx="1" fill={BLUE}
        {...track(live, { y: [18, 18, 124, 124, 18], opacity: [0, 0.9, 0.9, 0, 0] }, [0, 0.05, 0.6, 0.66, 1], T, 3, "easeInOut")} />
      <motion.g {...track(live, { scale: [0, 0, 1.2, 1, 1, 0], opacity: [0, 0, 1, 1, 1, 0] }, [0, 0.6, 0.66, 0.7, 0.94, 1], T, 3)}>
        <circle cx="140" cy="100" r="10" fill={BLUE} />
        <path d="M135.5 100 l3 3 l6 -6.5" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </Scene>
  )
}
