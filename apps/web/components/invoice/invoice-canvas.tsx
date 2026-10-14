'use client'

import * as React from "react"

import { InvoicePage } from "@/components/invoice/invoice-page"
import { RenderModeProvider } from "@/components/invoice/render-mode"
import type { EditorMode } from "@/components/invoice/toolbar"
import { Kbd, useCoarsePointer, useModKey, useShortScreen } from "@/components/invoice/editor-ui"
import { FieldSheetProvider } from "@/components/invoice/field-sheet"
import { useInvoiceDispatch, useInvoiceHistory } from "@/components/invoice/invoice-context"
import { EyeIcon, MinusIcon, PlusIcon, PointerIcon, RedoIcon, UndoIcon, XIcon } from "@/components/icons/rune"

export const invoiceCanvasId = "invoice-canvas"

const PAGE_W = 794
const ZOOM_STEPS = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5]
const HINT_KEY = "billy_editor_hint_dismissed"

const noopSubscribe = () => () => {}

function readHintDismissed() {
  try {
    return localStorage.getItem(HINT_KEY) === "1"
  } catch {
    return false
  }
}

/** First-run "click to edit" tip; hidden during SSR so it never flashes. */
function useEditHint() {
  const stored = React.useSyncExternalStore(noopSubscribe, readHintDismissed, () => true)
  const [dismissed, setDismissed] = React.useState(false)
  const dismiss = React.useCallback(() => {
    setDismissed(true)
    try {
      localStorage.setItem(HINT_KEY, "1")
    } catch {}
  }, [])
  return [!stored && !dismissed, dismiss] as const
}

/**
 * The desk: one A4 invoice centred on a muted surface. In "edit" mode every
 * field is click-to-edit; in "preview" mode the same InvoicePage renders
 * read-only — exactly what the PDF exporter rasterises — so there's no need
 * for a second, duplicate preview pane.
 */
export function InvoiceCanvas({ mode }: { mode: EditorMode }) {
  const deskRef = React.useRef<HTMLDivElement>(null)
  const pageRef = React.useRef<HTMLElement>(null)
  const [fitScale, setFitScale] = React.useState(1)
  const [zoom, setZoom] = React.useState<number | null>(null) // null = fit width
  const [pageHeight, setPageHeight] = React.useState(1123)
  const [hintVisible, dismissHint] = useEditHint()
  const mod = useModKey()
  const touch = useCoarsePointer()
  const shortScreen = useShortScreen()
  const dispatch = useInvoiceDispatch()
  const { canUndo, canRedo } = useInvoiceHistory()

  React.useEffect(() => {
    const desk = deskRef.current
    if (!desk) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const gutter = entry.contentRect.width >= 640 ? 64 : 32
        setFitScale(Math.max(0.3, Math.min((entry.contentRect.width - gutter) / PAGE_W, 1)))
      }
    })
    observer.observe(desk)
    return () => observer.disconnect()
  }, [])

  // The page remounts when the mode flips, so re-attach the height observer.
  // offsetHeight is the unscaled border-box height; contentRect would drop the
  // sheet's padding and under-reserve space for the scaled page.
  React.useEffect(() => {
    const page = pageRef.current
    if (!page) return
    const observer = new ResizeObserver(() => {
      setPageHeight(page.offsetHeight)
    })
    observer.observe(page)
    return () => observer.disconnect()
  }, [mode])

  const scale = zoom ?? fitScale
  // Below this scale, or on a phone held sideways, page text is too small to
  // type into on a touch screen, so fields open in the bottom edit bar
  // instead (see field-sheet.tsx).
  const compactEditing = mode === "edit" && touch && (scale < 0.75 || shortScreen)

  const stepZoom = (direction: 1 | -1) => {
    const next =
      direction === 1
        ? ZOOM_STEPS.find((step) => step > scale + 0.001)
        : [...ZOOM_STEPS].reverse().find((step) => step < scale - 0.001)
    if (next) setZoom(next)
  }

  return (
    <FieldSheetProvider enabled={compactEditing}>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div ref={deskRef} className="ed-desk">
          <div className="flex min-h-full w-max min-w-full flex-col items-center gap-4 px-4 pb-24 pt-6 sm:px-8 sm:pt-8">
            {mode === "edit" && hintVisible && (
              <div className="ed-hint ed-chrome">
                <PointerIcon size={16} aria-hidden />
                {touch ? (
                  <span>Tap any text to edit it.</span>
                ) : (
                  <span>
                    Click any text to edit it. <Kbd>{mod}K</Kbd> for commands.
                  </span>
                )}
                <button
                  type="button"
                  onClick={dismissHint}
                  className="ed-btn ed-btn--ghost ed-btn--icon !h-7 !w-7"
                  aria-label="Dismiss tip"
                >
                  <XIcon size={14} aria-hidden />
                </button>
              </div>
            )}
            {mode === "preview" && (
              <div className="ed-hint ed-chrome !pr-3">
                <EyeIcon size={16} aria-hidden />
                <span>Preview: this is exactly what the PDF will look like.</span>
              </div>
            )}

            <div
              className="shrink-0"
              style={{ width: PAGE_W * scale, height: pageHeight * scale, position: "relative" }}
            >
              <RenderModeProvider readOnly={mode === "preview"}>
                <InvoicePage
                  key={mode}
                  id={mode === "edit" ? invoiceCanvasId : undefined}
                  ref={pageRef}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              </RenderModeProvider>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <div className="ed-floating ed-chrome pointer-events-auto" role="toolbar" aria-label="Zoom">
            {/* The top bar drops undo/redo on phones, so they live down here. */}
            <div className="ed-floating-history">
              <button
                type="button"
                className="ed-btn ed-btn--ghost ed-btn--icon"
                onClick={() => dispatch({ type: "UNDO" })}
                disabled={!canUndo}
                aria-label="Undo"
              >
                <UndoIcon size={14} aria-hidden />
              </button>
              <button
                type="button"
                className="ed-btn ed-btn--ghost ed-btn--icon"
                onClick={() => dispatch({ type: "REDO" })}
                disabled={!canRedo}
                aria-label="Redo"
              >
                <RedoIcon size={14} aria-hidden />
              </button>
              <span className="mx-1 h-4 w-px bg-[#E5E7EB]" aria-hidden />
            </div>
            <button
              type="button"
              className="ed-btn ed-btn--ghost ed-btn--icon"
              onClick={() => stepZoom(-1)}
              disabled={scale <= ZOOM_STEPS[0] + 0.001}
              aria-label="Zoom out"
            >
              <MinusIcon size={14} aria-hidden />
            </button>
            <button
              type="button"
              className="ed-btn ed-btn--ghost !min-w-14 tabular-nums"
              onClick={() => setZoom(zoom === null ? 1 : null)}
              title={zoom === null ? "Show at 100%" : "Fit to width"}
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              className="ed-btn ed-btn--ghost ed-btn--icon"
              onClick={() => stepZoom(1)}
              disabled={scale >= ZOOM_STEPS[ZOOM_STEPS.length - 1] - 0.001}
              aria-label="Zoom in"
            >
              <PlusIcon size={14} aria-hidden />
            </button>
            <span className="mx-1 h-4 w-px bg-[#E5E7EB]" aria-hidden />
            <button
              type="button"
              className="ed-btn ed-btn--ghost"
              aria-pressed={zoom === null}
              onClick={() => setZoom(null)}
            >
              Fit
            </button>
          </div>
        </div>
      </div>
    </FieldSheetProvider>
  )
}
