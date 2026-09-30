import { HeroAnnotations } from "./hero-annotations"

/**
 * The hero's media slot: a real screenshot of the editor in a browser frame,
 * annotated by the hand-drawn notes.
 *
 * The shots live in public/landing/ and were captured from /editor with a
 * seeded invoice (Acme Studio billing Maple & Co.). Phones get a crop of the
 * mobile editor instead of a shrunken desktop shot. If you retake them, keep
 * the sizes and re-measure the pins below.
 */

/* Where the pins land, as % of the desktop shot's height: the "Support
   retainer" line item and the inspector's amount due. */
const PIN_ROW = 85.4
const PIN_TOTAL = 22.7

export function HeroShot() {
  return (
    <div className="lx-invoice-wrap">
      <div className="lx-invoice">
        <div className="lx-invoice-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>trybilly.tech/editor</span>
        </div>

        <div className="lx-invoice-shot">
          <picture>
            <source media="(max-width: 620px)" srcSet="/landing/editor-phone.webp" width={780} height={1180} />
            <img
              src="/landing/editor.webp"
              width={2560}
              height={1640}
              alt="The billy editor: an invoice from Acme Studio to Maple & Co. with three line items, and the amount due of $2,300.00 in the side panel"
              fetchPriority="high"
            />
          </picture>
          <span data-annotate="row" style={{ top: `${PIN_ROW}%` }} />
          <span data-annotate="total" style={{ top: `${PIN_TOTAL}%` }} />
        </div>
      </div>
      <HeroAnnotations />
    </div>
  )
}
