"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import { useLayoutEffect, useRef, useState } from "react"

/*
 * Hand-drawn callouts on the hero product shot (#15).
 *
 * The old notes were positioned with guessed pixel offsets and hidden below
 * 1320px, so on most laptops they vanished and elsewhere they pointed at
 * nothing in particular. Now:
 *  - the targets (the row being typed and the total) are MEASURED, and a
 *    numbered pin sits on the frame edge exactly level with each one;
 *  - the pins, labels and hand-drawn arrows only show when the side
 *    gutters have room for the labels; narrower screens get no callouts.
 * Pins and arrows are always tied to real geometry, so they can't mislead.
 */

const GUTTER_NEEDED = 210 // px of free space beside the frame for a side label

interface Layout {
  width: number
  rowY: number
  totalY: number
  wide: boolean
}

function measure(stage: HTMLElement): Layout | null {
  const frame = stage.querySelector<HTMLElement>(".lx-invoice")
  const row = stage.querySelector<HTMLElement>('[data-annotate="row"]')
  const total = stage.querySelector<HTMLElement>('[data-annotate="total"]')
  if (!frame || !row || !total) return null
  const f = frame.getBoundingClientRect()
  const r = row.getBoundingClientRect()
  const t = total.getBoundingClientRect()
  const gutter = Math.min(f.left, document.documentElement.clientWidth - f.right)
  return {
    width: f.width,
    rowY: r.top + r.height / 2 - f.top,
    totalY: t.top + t.height / 2 - f.top,
    wide: gutter >= GUTTER_NEEDED,
  }
}

/** A hand-drawn curve from `from` to `to`, arriving horizontally, plus its arrowhead. */
function arrow(from: [number, number], to: [number, number]) {
  const [x1, y1] = from
  const [x2, y2] = to
  const dir = Math.sign(x2 - x1) || 1
  // Leave the label going down, then swing in level with the pin.
  const c1: [number, number] = [x1 + dir * 6, y2 - 4]
  const c2: [number, number] = [x2 - dir * 46, y2 + 3]
  const curve = `M${x1} ${y1} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${x2} ${y2}`
  const head = `M${x2 - dir * 9} ${y2 - 6} L${x2} ${y2} L${x2 - dir * 9} ${y2 + 6}`
  return { curve, head }
}

function Pin({ n, y, side, show, pulse }: { n: number; y: number; side: "left" | "right"; show: boolean; pulse?: boolean }) {
  return (
    <motion.span
      className="lx-pin"
      data-side={side}
      style={{ top: y }}
      initial={false}
      animate={show ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 26 }}
      aria-hidden
    >
      {pulse && <span className="lx-pin-pulse" />}
      {n}
    </motion.span>
  )
}

export function HeroAnnotations({ typing }: { typing: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<Layout | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    const stage = ref.current?.parentElement
    if (!stage) return
    const update = () => setLayout(measure(stage))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(stage)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  const show = inView && layout !== null
  const draw = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
          transition: { duration: 0.7, delay, ease: [0.2, 0, 0, 1] as const },
        }

  const W = layout?.width ?? 0
  const left = layout ? arrow([-96, layout.rowY - 30], [-18, layout.rowY]) : null
  const right = layout ? arrow([W + 96, layout.totalY - 34], [W + 18, layout.totalY]) : null

  return (
    <div ref={ref} className="lx-annotations" aria-hidden>
      {/* Callouts only show when the side gutters can hold the labels. */}
      {layout?.wide && (
        <>
          <Pin n={1} y={layout.rowY} side="left" show={show} pulse={typing} />
          <Pin n={2} y={layout.totalY} side="right" show={show} />
          <p className="lx-note" style={{ right: `calc(100% + 40px)`, top: layout.rowY - 76, textAlign: "right" }}>
            Click a line and type
          </p>
          <p className="lx-note" style={{ left: `calc(100% + 40px)`, top: layout.totalY - 80 }}>
            Totals update themselves
          </p>
          <svg className="lx-annotation-svg" width={W} height="1" overflow="visible">
            {left && (
              <>
                <motion.path d={left.curve} {...draw(0.9)} />
                <motion.path d={left.head} {...draw(1.5)} />
              </>
            )}
            {right && (
              <>
                <motion.path d={right.curve} {...draw(1.2)} />
                <motion.path d={right.head} {...draw(1.8)} />
              </>
            )}
          </svg>
        </>
      )}
    </div>
  )
}
