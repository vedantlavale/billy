"use client"

import { useEffect, useRef, useState } from "react"

import { HeroAnnotations } from "./hero-annotations"
import { prefersReducedMotion, useInView } from "./reveal"

/**
 * The hero's media slot.
 *
 * The real product surface carries the hero's media role: an actual invoice
 * in a browser frame, annotated by hand-drawn notes on the landing page.
 *
 * It types one line item in and recalculates the total — which is the product
 * claim ("edit like a document, totals update with every keystroke") shown
 * rather than asserted. It runs ONCE on first view and then settles; an
 * endlessly looping product screen reads as a distraction, not a demo.
 */

const SETTLED = { desc: "Support retainer", qty: "2", rate: "150" }
const BASE_TOTAL = 2000
const FINAL_TOTAL = 2300

const money = (n: number) => `$${n.toLocaleString("en-US")}`

type Phase = "idle" | "desc" | "qty" | "rate" | "done"

export function LiveInvoice() {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>("-20% 0px -10% 0px")

  const [phase, setPhase] = useState<Phase>("idle")
  const [desc, setDesc] = useState("")
  const [qty, setQty] = useState("")
  const [rate, setRate] = useState("")
  const [total, setTotal] = useState(BASE_TOTAL)
  const [bumped, setBumped] = useState(false)

  /* ── The typing run ───────────────────────────────────────────────────────
     Guarded by a ref, NOT by `phase`. Putting `phase` in the dependency list
     re-runs this effect the moment it sets the first phase, and the cleanup
     then clears every pending keystroke timer — so nothing types. ────────── */
  const typingRan = useRef(false)

  useEffect(() => {
    if (!inView || typingRan.current) return
    typingRan.current = true

    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))

    // Reduced motion: settle straight to the finished invoice, no performance.
    if (prefersReducedMotion()) {
      at(0, () => {
        setDesc(SETTLED.desc)
        setQty(SETTLED.qty)
        setRate(SETTLED.rate)
        setTotal(FINAL_TOTAL)
        setPhase("done")
      })
      return () => timers.forEach(clearTimeout)
    }

    let t = 520
    at(0, () => setPhase("desc"))

    // Description, character by character, with a human-ish rhythm.
    for (let i = 1; i <= SETTLED.desc.length; i++) {
      t += 42 + (i % 4) * 13
      at(t, () => setDesc(SETTLED.desc.slice(0, i)))
    }

    t += 300
    at(t, () => setPhase("qty"))
    for (let i = 1; i <= SETTLED.qty.length; i++) {
      t += 110
      at(t, () => setQty(SETTLED.qty.slice(0, i)))
    }

    t += 260
    at(t, () => setPhase("rate"))
    for (let i = 1; i <= SETTLED.rate.length; i++) {
      t += 105
      at(t, () => setRate(SETTLED.rate.slice(0, i)))
    }

    // Totals settle a beat after the last keystroke.
    t += 240
    at(t, () => {
      setTotal(FINAL_TOTAL)
      setBumped(true)
      setPhase("done")
    })
    at(t + 420, () => setBumped(false))

    return () => timers.forEach(clearTimeout)
  }, [inView])

  const amount = qty && rate ? money(Number(qty) * Number(rate)) : ""
  const typing = phase !== "idle" && phase !== "done"

  return (
    <div className="lx-invoice-wrap" ref={viewRef}>
      <div className="lx-invoice">
        <div className="lx-invoice-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>billy · invoice editor</span>
        </div>

        <div className="lx-invoice-doc">
          <div className="lx-inv-head">
            <div>
              <div className="lx-inv-co">Acme Studio</div>
              <div className="lx-small">Design &amp; Development</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="lx-inv-k" style={{ marginBottom: 2 }}>
                Invoice
              </div>
              <div className="lx-inv-v">#INV-042</div>
            </div>
          </div>

          <div className="lx-inv-meta">
            <div>
              <div className="lx-inv-k">Billed to</div>
              <div className="lx-inv-v">Maple &amp; Co.</div>
            </div>
            <div>
              <div className="lx-inv-k">Issued</div>
              <div className="lx-inv-v">Jun 30, 2026</div>
            </div>
            <div>
              <div className="lx-inv-k">Due</div>
              <div className="lx-inv-v">Jul 14, 2026</div>
            </div>
          </div>

          <div className="lx-inv-table">
            <div className="lx-inv-row lx-inv-row--head">
              <span>Description</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>

            <div className="lx-inv-row">
              <span>Brand identity design</span>
              <span>1</span>
              <span>$1,200</span>
              <span>$1,200</span>
            </div>

            <div className="lx-inv-row">
              <span>Landing page build</span>
              <span>1</span>
              <span>$800</span>
              <span>$800</span>
            </div>

            {/* The row being written. aria-live keeps screen readers informed
                of the value that lands, without narrating every keystroke. */}
            <div className="lx-inv-row" data-live={typing ? "true" : undefined} data-annotate="row">
              <span>
                {desc}
                {phase === "desc" && <span className="lx-caret" aria-hidden="true" />}
              </span>
              <span>
                {qty}
                {phase === "qty" && <span className="lx-caret" aria-hidden="true" />}
              </span>
              <span>
                {rate ? `$${rate}` : ""}
                {phase === "rate" && <span className="lx-caret" aria-hidden="true" />}
              </span>
              <span>{amount}</span>
            </div>
          </div>

          <div className="lx-inv-total">
            <span>Total due</span>
            <b data-bumped={bumped ? "true" : undefined} aria-live="polite" data-annotate="total">
              {money(total)}
            </b>
          </div>
        </div>
      </div>
      <HeroAnnotations typing={typing} />
    </div>
  )
}
