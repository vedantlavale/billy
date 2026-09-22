/**
 * Client-side, 100% what-you-see-is-what-you-get PDF export.
 *
 * Instead of re-implementing the invoice layout for a PDF engine (the old
 * server-side @react-pdf approach, which could never match the on-screen
 * result), this renders the *actual* `InvoicePage` component — the single
 * source of truth for the on-screen canvas and preview — into an off-screen,
 * unscaled A4 copy, rasterises it with the browser's own paint engine
 * (`html-to-image`, so `oklch()` colours and web fonts render exactly as they
 * do on screen) and assembles the sheets into a PDF with jsPDF. No server, no
 * second layout implementation, no divergence.
 */
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"

import { InvoicePage } from "@/components/invoice/invoice-page"
import { InvoiceStateProvider } from "@/components/invoice/invoice-context"
import { RenderModeProvider } from "@/components/invoice/render-mode"
import { getTemplateStyles } from "@billy/invoice-core"
import type { InvoiceData } from "@billy/invoice-core"

// A4 at 96dpi in CSS pixels, and the on-screen gap between stacked sheets.
// These MUST match the values in `invoice-page.tsx`, which is what produces the
// page breaks we slice on.
const PAGE_W = 794
const PAGE_H = 1123
const PAGE_GAP = 24
// px -> PDF points (1pt = 1/72in, CSS px = 1/96in).
const PX_TO_PT = 72 / 96
// Oversample so text stays crisp when the PDF is zoomed/printed (~192dpi).
const TARGET_PIXEL_RATIO = 2
// Stay clear of the browser's max canvas dimension (~32767px in Chrome).
const MAX_CANVAS_PX = 30000

function sanitizeFileName(value: string) {
  return value.trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "")
}

function nextFrame() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read image"))
    reader.readAsDataURL(blob)
  })
}

/**
 * Inline a (possibly remote) image URL as a data URL. Logos/stamps are stored
 * as Supabase public URLs for signed-in users; if we hand those straight to the
 * rasteriser the cross-origin fetch inside the SVG can taint the canvas or drop
 * the image, so we fetch and embed them up front. Already-inline data URLs and
 * fetch failures are passed through untouched.
 */
async function inlineImage(url: string | null): Promise<string | null> {
  if (!url || url.startsWith("data:")) return url
  try {
    const response = await fetch(url, { mode: "cors", cache: "force-cache" })
    if (!response.ok) return url
    return await blobToDataUrl(await response.blob())
  } catch {
    return url
  }
}

async function inlineInvoiceImages(data: InvoiceData): Promise<InvoiceData> {
  const [logoUrl, stampUrl] = await Promise.all([
    inlineImage(data.logoUrl),
    inlineImage(data.stampUrl),
  ])
  return { ...data, logoUrl, stampUrl }
}

/** Wait until every <img> in the subtree has finished decoding. */
async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"))
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true })
        img.addEventListener("error", () => resolve(), { once: true })
      })
    }),
  )
}

/**
 * Make sure the template's web font is actually loaded before capture.
 * `document.fonts.ready` only accounts for faces already requested by the page;
 * on entry points with no on-screen invoice (the dashboard) the template font
 * isn't in use yet, so we explicitly request the weights the templates use and
 * then wait. Without this, dashboard exports can silently render in a fallback
 * font while editor exports look correct.
 */
async function ensureInvoiceFontLoaded(el: HTMLElement) {
  if (!document.fonts?.load) return
  const family = getComputedStyle(el).fontFamily
  if (!family) return
  await Promise.all(
    [400, 500, 600, 700].map((weight) =>
      document.fonts.load(`${weight} 16px ${family}`).catch(() => undefined),
    ),
  )
  await document.fonts.ready
}

/** Poll until the paginated layout stops changing height (or we give up). */
async function waitForStableLayout(el: HTMLElement) {
  let last = -1
  for (let i = 0; i < 30; i++) {
    const height = el.offsetHeight
    if (height === last && height > 0) return
    last = height
    await nextFrame()
  }
}

interface PageRect {
  /** Source top offset (in CSS px) of this sheet within the captured stack. */
  top: number
  /** Height (in CSS px) of this sheet. */
  height: number
}

/**
 * Work out the page rectangles to slice from the rendered invoice. Paginated
 * templates render N real A4 sheets separated by PAGE_GAP; grid templates that
 * can't be reflowed (e.g. Minimal Teal) render a single continuous sheet, which
 * we emit as one page sized to its actual height — exactly what's shown.
 */
function computePageRects(stackEl: HTMLElement, canvasEl: HTMLElement): PageRect[] {
  const isMultipage = canvasEl.getAttribute("data-multipage") === "true"
  if (!isMultipage) {
    return [{ top: 0, height: Math.max(canvasEl.offsetHeight, PAGE_H) }]
  }
  const sheetCount = stackEl.querySelectorAll(".invoice-sheet-bg").length || 1
  return Array.from({ length: sheetCount }, (_, p) => ({
    top: p * (PAGE_H + PAGE_GAP),
    height: PAGE_H,
  }))
}

/**
 * Render `data` off-screen, capture it, and return the finished jsPDF document.
 * Isolated so callers can either save it or hand it elsewhere.
 */
async function renderInvoiceToPdf(data: InvoiceData) {
  const htmlToImage = await import("html-to-image")
  const { jsPDF } = await import("jspdf")

  const inlined = await inlineInvoiceImages(data)

  // Off-screen host: positioned far off-canvas, at true A4 width with no
  // transform, so the capture is 1:1 with the on-screen (but unscaled) layout.
  const host = document.createElement("div")
  host.setAttribute("aria-hidden", "true")
  host.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    `width:${PAGE_W}px`,
    "background:transparent",
    "pointer-events:none",
    "z-index:-1",
    getTemplateStyles(inlined.templateId),
  ].join(";")

  // Paper chrome (drop shadow, card border, rounded corners) is desk styling,
  // not part of the document — strip it so each PDF page is a clean full-bleed
  // sheet. The paper *fill* is preserved (and re-applied behind each slice).
  const style = document.createElement("style")
  style.textContent = `
    [data-pdf-export] .invoice-canvas,
    [data-pdf-export] .invoice-sheet-bg {
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
    }
  `
  host.appendChild(style)

  const mount = document.createElement("div")
  mount.setAttribute("data-pdf-export", "")
  host.appendChild(mount)
  document.body.appendChild(host)

  const root = createRoot(mount)

  try {
    // Render synchronously: createRoot().render() is concurrent in React 19,
    // and a single animation frame wasn't always enough for it to commit on
    // a cold or slow page, so the lookup below found nothing (#19).
    flushSync(() => {
      root.render(
        <InvoiceStateProvider data={inlined}>
          <RenderModeProvider readOnly>
            <InvoicePage />
          </RenderModeProvider>
        </InvoiceStateProvider>,
      )
    })
    // One frame for layout effects (pagination) before measuring.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    const stackEl = mount.querySelector<HTMLElement>(".invoice-paper-stack")
    const canvasEl = mount.querySelector<HTMLElement>(".invoice-canvas")
    if (!stackEl || !canvasEl) {
      throw new Error("Invoice failed to render for export")
    }

    // Fonts and images change layout, so settle them before pagination is read.
    await waitForImages(mount)
    await ensureInvoiceFontLoaded(canvasEl)
    await waitForStableLayout(stackEl)

    const rects = computePageRects(stackEl, canvasEl)
    const totalHeight = stackEl.offsetHeight || rects.reduce((h, r) => h + r.height, 0)

    // Clamp the oversample so neither dimension exceeds the canvas cap.
    const pixelRatio = Math.min(
      TARGET_PIXEL_RATIO,
      MAX_CANVAS_PX / PAGE_W,
      MAX_CANVAS_PX / Math.max(totalHeight, 1),
    )

    // The paper colour, used to fill each page canvas so stripped corners /
    // transparent gaps never show through as white/black.
    const paperColor =
      getComputedStyle(canvasEl).backgroundColor &&
      getComputedStyle(canvasEl).backgroundColor !== "rgba(0, 0, 0, 0)"
        ? getComputedStyle(canvasEl).backgroundColor
        : getComputedStyle(
            stackEl.querySelector(".invoice-sheet-bg") ?? canvasEl,
          ).backgroundColor || "#ffffff"

    const captureOptions = {
      pixelRatio,
      width: PAGE_W,
      height: totalHeight,
      backgroundColor: "transparent",
      style: { margin: "0" },
    } as const

    // First pass primes html-to-image's font/image embedding cache; the second
    // pass is the one we keep. Skipping the warm-up occasionally yields a first
    // frame rendered in a fallback font — the quiet way "100%" breaks.
    await htmlToImage.toCanvas(stackEl, captureOptions)
    const fullCanvas = await htmlToImage.toCanvas(stackEl, captureOptions)

    // Slice the single full-stack capture into one image per page. Slicing
    // (rather than re-rendering per page) means the pages can't drift from each
    // other or from what was measured.
    const pages = rects.map((rect) => {
      const sliceW = Math.round(PAGE_W * pixelRatio)
      const sliceH = Math.round(rect.height * pixelRatio)

      const pageCanvas = document.createElement("canvas")
      pageCanvas.width = sliceW
      pageCanvas.height = sliceH
      const ctx = pageCanvas.getContext("2d")
      if (!ctx) throw new Error("Canvas 2D context unavailable")
      // Fill with the paper colour so stripped corners / transparent gaps never
      // show through.
      ctx.fillStyle = paperColor
      ctx.fillRect(0, 0, sliceW, sliceH)
      ctx.drawImage(
        fullCanvas,
        0,
        Math.round(rect.top * pixelRatio),
        sliceW,
        sliceH,
        0,
        0,
        sliceW,
        sliceH,
      )

      return {
        dataUrl: pageCanvas.toDataURL("image/png"),
        widthPt: PAGE_W * PX_TO_PT,
        heightPt: rect.height * PX_TO_PT,
      }
    })

    const [first, ...rest] = pages
    const pdf = new jsPDF({
      unit: "pt",
      format: [first.widthPt, first.heightPt],
      orientation: "portrait",
      compress: true,
    })
    pdf.addImage(first.dataUrl, "PNG", 0, 0, first.widthPt, first.heightPt)
    for (const page of rest) {
      pdf.addPage([page.widthPt, page.heightPt], "portrait")
      pdf.addImage(page.dataUrl, "PNG", 0, 0, page.widthPt, page.heightPt)
    }
    return pdf
  } finally {
    root.unmount()
    host.remove()
  }
}

/**
 * Render `data` to a PDF entirely in the browser and trigger a download.
 * Guaranteed to match the on-screen preview because it captures the very same
 * component tree.
 */
export async function exportInvoicePdf(data: InvoiceData) {
  if (typeof window === "undefined") {
    throw new Error("exportInvoicePdf must run in the browser")
  }
  const pdf = await renderInvoiceToPdf(data)
  const fileName = `invoice-${sanitizeFileName(data.invoiceNumber) || "export"}.pdf`
  pdf.save(fileName)
}
