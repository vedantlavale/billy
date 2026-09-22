'use client'

import * as React from "react"

import { ClientSection } from "@/components/invoice/client-section"
import { FooterSection } from "@/components/invoice/footer-section"
import { HeaderSection } from "@/components/invoice/header-section"
import { LineItemsTable } from "@/components/invoice/line-items-table"
import { MetaSection } from "@/components/invoice/meta-section"
import { TotalsSection } from "@/components/invoice/totals-section"
import { useInvoiceState } from "@/components/invoice/invoice-context"

// A4 at 96dpi, in CSS pixels. Matches the dimensions used by the canvas/preview
// scalers and the React-PDF page size.
const PAGE_W = 794
const PAGE_H = 1123
// Visual gap shown between stacked page sheets on screen.
const PAGE_GAP = 24
// Breathing room kept at the top of pages 2+ and reserved at the bottom of
// every page before we force a break. Independent of per-template padding —
// it's simply where we choose to break the flow.
const PAGE_PAD_T = 48
const PAGE_PAD_B = 48
const MAX_PAGES = 40

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/** Distance from `el`'s top to `ancestor`'s top, walking the offsetParent chain. */
function offsetTopWithin(el: HTMLElement, ancestor: HTMLElement): number {
  let top = 0
  let node: HTMLElement | null = el
  while (node && node !== ancestor) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

/**
 * The A4 invoice page. This is the SINGLE source of truth for the on-screen
 * invoice — rendered editable on the left canvas and read-only (via
 * RenderModeProvider) in the right preview, so the two are guaranteed
 * identical. Per-template styling is applied by global CSS keyed on
 * `.invoice-canvas[data-template="…"]` plus the section class names below.
 *
 * When the content overflows one A4 sheet it is paginated: each breakable
 * block (`[data-break-block]` — the sections plus every line-item row) that
 * would straddle a page boundary is pushed down to the top of the next page,
 * and real stacked sheets with gaps are drawn behind, so the editor and
 * preview show genuine multi-page documents. Grid-based templates can't be
 * reflowed this way and fall back to a single growing sheet.
 */
export const InvoicePage = React.forwardRef<
  HTMLElement,
  { id?: string; style?: React.CSSProperties }
>(function InvoicePage({ id, style }, ref) {
  const state = useInvoiceState()
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const lastSig = React.useRef<string>("")
  const [pageCount, setPageCount] = React.useState(1)
  const [paginatable, setPaginatable] = React.useState(true)

  const setSectionRef = React.useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const paginate = React.useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const blocks = Array.from(
      section.querySelectorAll<HTMLElement>("[data-break-block]"),
    )
    if (blocks.length === 0) return

    // CSS-grid layouts (e.g. Minimal Teal) position items by grid area, so we
    // can't relocate them across pages by adding flow margin. Clear any margins
    // we may have applied under a previous template and bail to single-sheet.
    const inner = section.querySelector<HTMLElement>(".invoice-canvas-inner")
    if (inner && getComputedStyle(inner).display === "grid") {
      if (lastSig.current !== "grid") {
        blocks.forEach((b) => (b.style.marginTop = ""))
        lastSig.current = "grid"
        setPaginatable(false)
        setPageCount(1)
      }
      return
    }

    // Block heights are independent of the push margins we inject, so they make
    // a stable signature: if nothing intrinsic changed, skip the work entirely.
    // This is what keeps the ResizeObserver from looping when we mutate margins.
    const sig = blocks.map((b) => b.offsetHeight).join(",") + ":" + blocks.length
    if (sig === lastSig.current) return
    lastSig.current = sig

    // Reset to natural flow, then measure.
    blocks.forEach((b) => (b.style.marginTop = ""))
    const naturalTop = blocks.map((b) => offsetTopWithin(b, section))
    const naturalMargin = blocks.map(
      (b) => parseFloat(getComputedStyle(b).marginTop) || 0,
    )
    const heights = blocks.map((b) => b.offsetHeight)

    const usableHeight = PAGE_H - PAGE_PAD_T - PAGE_PAD_B
    const extra = new Array(blocks.length).fill(0)
    let currentPage = 0
    let offset = 0

    for (let i = 0; i < blocks.length; i++) {
      const top = naturalTop[i] + offset
      const h = heights[i]
      const usableBottom =
        currentPage * (PAGE_H + PAGE_GAP) + PAGE_H - PAGE_PAD_B

      // Push a block that overflows the current page onto the next one — unless
      // it's the first block, or it's taller than a whole page (can't help it).
      if (i > 0 && h <= usableHeight && top + h > usableBottom + 1) {
        currentPage += 1
        const target = currentPage * (PAGE_H + PAGE_GAP) + PAGE_PAD_T
        const delta = target - top
        extra[i] = delta
        offset += delta
      }
    }

    blocks.forEach((b, i) => {
      b.style.marginTop = extra[i] > 0 ? `${naturalMargin[i] + extra[i]}px` : ""
    })

    const totalPages = Math.min(currentPage + 1, MAX_PAGES)
    setPaginatable(true)
    setPageCount((prev) => (prev === totalPages ? prev : totalPages))
  }, [])

  // Recompute after every render (cheap — guarded by the signature) so edits,
  // added/removed rows and toggled fields all re-paginate.
  useIsomorphicLayoutEffect(() => {
    paginate()
  })

  // Catch async layout shifts the render pass can't (web-font swaps, logo/stamp
  // images finishing load).
  React.useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new ResizeObserver(() => paginate())
    observer.observe(section)
    const inner = section.querySelector<HTMLElement>(".invoice-canvas-inner")
    if (inner) observer.observe(inner)
    return () => observer.disconnect()
  }, [paginate])

  const multiPage = paginatable && pageCount > 1
  const stackHeight = multiPage
    ? pageCount * PAGE_H + (pageCount - 1) * PAGE_GAP
    : undefined

  return (
    <div
      className="invoice-paper-stack"
      data-template={state.templateId}
      style={{ position: "relative", width: PAGE_W, height: stackHeight, ...style }}
    >
      {multiPage &&
        Array.from({ length: pageCount }, (_, p) => (
          <div
            key={p}
            aria-hidden
            className="invoice-sheet-bg"
            style={{
              position: "absolute",
              left: 0,
              top: p * (PAGE_H + PAGE_GAP),
              width: PAGE_W,
              height: PAGE_H,
            }}
          />
        ))}

      <section
        id={id}
        ref={setSectionRef}
        className="invoice-canvas shrink-0 px-10 py-12"
        data-template={state.templateId}
        data-multipage={multiPage ? "true" : undefined}
        style={{
          position: "relative",
          fontFamily: "var(--invoice-font)",
          width: PAGE_W,
          minHeight: multiPage ? stackHeight : PAGE_H,
        }}
      >
        <div className="invoice-canvas-inner space-y-4">
          <HeaderSection />
          <ClientSection />
          <MetaSection />
          <LineItemsTable />
          <TotalsSection />
          <FooterSection />
        </div>
      </section>
    </div>
  )
})
