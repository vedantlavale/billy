# Tally Forms — Style Reference

> Notebook doodles on warm paper — a gray-paper canvas scattered with magenta-pink hand-drawn marks and centered editorial headlines.

**Theme:** light

Tally's visual system reads as _notebook doodles on warm paper_ — a quiet, editorial interface where a warm gray canvas (`#e0e0df`) carries white card surfaces and almost everything else steps out of the way so that one vivid magenta-pink (`#f81ce5`) can do the emotional work. That pink is reserved for illustration strokes, icon outlines, and the occasional decorative border on a feature card — **it never fills a button.** Conversion is handled by a single classic blue (`#0070d7`), keeping brand expression and action expression separate. Typography is Inter across a wide weight range, tracked tight at `-0.031em`, with a 64px display headline that feels closer to a magazine masthead than a SaaS hero. Hand-drawn squiggles, underlines, and star/confetti motifs float around the margins. Cards are flat white on warm gray with a subtle warm-tinted shadow stack, rounded at 10px, with generous gaps and a centered hero.

---

## Using these tokens in this codebase

The tokens live in **`app/design-tokens.css`** (imported by `app/globals.css`) and are also published as DTCG JSON in **`design-tokens.json`**. Build with the utilities below rather than hard-coded hex.

| Purpose | Utility / variable | Value |
|---|---|---|
| Page canvas | `bg-paper` | `#e0e0df` |
| Card / bright surface | `bg-white` | `#ffffff` |
| Muted surface | `bg-mist` | `#f3f3f3` |
| Primary text / borders | `text-ink` `border-ink` | `#37352f` |
| Secondary / helper text | `text-graphite` | `#898884` |
| Muted borders / dividers | `border-ash` | `#777672` |
| Inline-link / dark border | `text-charcoal` | `#45433e` |
| **Primary action fill only** | `bg-action-blue` | `#0070d7` |
| **Decoration / illustration only** | `text-tally-magenta` `border-tally-magenta` | `#f81ce5` |
| Typeface | `font-inter` | Inter (loaded via `next/font`) |
| Type steps | `text-caption` · `text-body` · `text-body-lg` · `text-subheading` · `text-heading-sm` · `text-heading` · `text-heading-lg` · `text-display` | each carries its size, line-height and letter-spacing |
| Card corners | `rounded-card` | 10px |
| Button / input / tag corners | `rounded-button` `rounded-input` `rounded-tag` | 7px |
| Product-surface elevation | `shadow-card` | 4-stack warm shadow |
| Feature-card elevation | `shadow-feature` | single soft layer |
| Highlight ring | `shadow-highlight` | magenta ring + glow |
| Gradients | `var(--gradient-tally-magenta)` · `var(--gradient-purple-to-pink)` | radial glow · underline sweep |

**Naming note:** radius and shadow utilities are namespaced (`rounded-card`, `shadow-card`, …) rather than the spec's `--radius-md` / `--shadow-md`, because those names are already used by shadcn/Tailwind elsewhere in this app. The spec names below are the design language of record; the utilities above are how you apply them here.

**Spacing** stays on Tailwind's 4px scale: the Tally steps map to `8→p-2`, `16→p-4`, `24→p-6`, `32→p-8`, `64→p-16`, `192→p-48`. Reference variables `--spacing-8 … --spacing-192` exist for direct `var()` use.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Tally Magenta | `#f81ce5` | `--color-tally-magenta` | Pink decorative accent for icons, marks, small graphic details, and the highlight-ring. **Never** a CTA fill, link, or body-text colour. |
| Action Blue | `#0070d7` | `--color-action-blue` | Primary action buttons only — the lone chromatic fill in the system. |
| Ink | `#37352f` | `--color-ink` | Primary text, heading fills, dominant dark border colour. A warm near-black, not pure black. |
| Paper | `#e0e0df` | `--color-paper` | Page canvas — the warm light-gray background all white cards sit on. The signature surface. |
| White | `#ffffff` | `--color-white` | Card surfaces, form previews, input fields, icon fills. The only bright surface layer. |
| Mist | `#f3f3f3` | `--color-mist` | Subtle elevated/muted surface for secondary panels, code blocks, hover washes. |
| Graphite | `#898884` | `--color-graphite` | Secondary text, helper copy, tertiary icon/body borders. |
| Ash | `#777672` | `--color-ash` | Muted borders, inactive dividers, low-emphasis strokes. |
| Charcoal | `#45433e` | `--color-charcoal` | Dark borders/separators for elevated surfaces; inline-link text. |
| Black | `#000000` | `--color-black` | Heading borders, the dark header CTA fill, highest-contrast button text. Reserved for maximum weight. |
| Purple-to-Pink | `linear-gradient(to right, rgb(138,70,255) 0%, rgb(248,28,224) 50%)` | `--gradient-purple-to-pink` | Underline/streak flourishes under display headlines — a short violet→magenta sweep replacing the squiggle. |
| Magenta glow | `radial-gradient(circle, rgba(248,28,229,0.36) 0%, rgba(248,28,229,0) 70%)` | `--gradient-tally-magenta` | Soft decorative glow/focus tint behind highlighted feature cards. |

## Tokens — Typography

**Inter** is the only typeface across the entire system: display at 64px/800, section headings 30–36px/700, subheadings 22–26px/600, body 16–18px/400–500, caption/label 13–14px/500. The tight `-0.031em` tracking and high x-height make it read like a serif replacement at display sizes. Substitute: Inter (free) or DM Sans. Weights: 400, 500, 600, 700, 800.

| Role | Size | Line height | Letter spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | -0.4px | `--text-caption` |
| body | 16px | 1.5 | -0.5px | `--text-body` |
| body-lg | 18px | 1.5 | -0.56px | `--text-body-lg` |
| subheading | 22px | 1.25 | -0.68px | `--text-subheading` |
| heading-sm | 26px | 1.25 | -0.81px | `--text-heading-sm` |
| heading | 30px | 1.25 | -0.93px | `--text-heading` |
| heading-lg | 36px | 1.15 | -1.12px | `--text-heading-lg` |
| display | 64px | 1 | -1.98px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px · **Density:** comfortable

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 64 | 64px | `--spacing-64` |
| 192 | 192px | `--spacing-192` |

**Border radius:** cards 10px · buttons/inputs/tags 7px · doodles/pills 9999px.

**Shadows**

| Name | Value | Utility |
|------|-------|---------|
| subtle (product surface) | `rgba(0,0,0,0.12) 0px 1px 1px 0px, rgba(61,59,53,0.16) 0px 0px 0px 1px, rgba(61,59,53,0.08) 0px 3px 9px 0px, rgba(61,59,53,0.08) 0px 2px 5px 0px` | `shadow-card` |
| md (feature card) | `rgba(0,0,0,0.09) 0px 3px 12px 0px` | `shadow-feature` |
| subtle-2 (highlight ring) | `0px 0px 0px 2px #f81ce5, 0px 0px 0px 4px rgba(248,28,229,0.36)` | `shadow-highlight` |

**Layout:** page max-width 1200px · section gap 64px · card padding 24px · element gap 8px.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#e0e0df` | Page canvas behind every section |
| 1 | White | `#ffffff` | Card and form-preview surfaces |
| 2 | Mist | `#f3f3f3` | Secondary elevated surfaces, code snippets, quiet hover states |

---

## Components

- **Primary CTA button** — Blue (`#0070d7`) fill, white text, Inter 15px/500, 7px radius, 6px×14px padding, no border. Often paired with a white right-arrow glyph. The sole conversion button.
- **Dark header button** — Black (`#000000`) fill, white text, Inter 15px/500, 7px radius, 6px×14px padding. The persistent “Create form” action, secondary to the blue CTA.
- **Submit button (in-app)** — Black fill, white text, small, 7px radius, white arrow glyph.
- **Form preview card** — White surface, 10px radius, the four-stack warm shadow (`shadow-card`). macOS window dots and an inline editable title in Inter 30px/700. The hero visual.
- **Standard feature card** — White surface, 10px radius, `shadow-feature`, 24px padding. Magenta (`#f81ce5`) outlined icon (1.5px stroke) top-left. Heading 22px/700 in Ink, body 16px/400 in Graphite.
- **Highlighted feature card** — As standard, but wrapped in a 2px `#f81ce5` ring + 4px `rgba(248,28,229,0.36)` glow (`shadow-highlight`). Heading rendered in Magenta rather than Ink. One per row, max.
- **Inline text link** — Charcoal (`#45433e`) text with a 1.5–2px underline in the same colour. No box, no background.
- **Text input field** — White fill, 1px Ash (`#777672`) border, 7px radius, 8–10px vertical padding, placeholder in Graphite. Focus = subtle border darkening, not a glow.
- **Logo bar item** — Ink (`#37352f`) monochrome logos at 20–24px height, 24–32px gaps, floating directly on Paper (no cards, no borders).
- **Product Hunt badge** — Black pill, 7px radius, white text 13px/500, small trophy icon at 14px in Magenta.
- **Doodle illustration** — Line art only, never filled: 1.5–2px stroke in Ink for faces/speech-bubbles/arrows, 1.5px in Magenta for confetti/stars/sparkles. Some underline flourishes use the Purple-to-Pink gradient sweep.
- **Underline flourish** — A short hand-drawn underline beneath a display-headline keyword: a 2px Magenta squiggle, or a Purple-to-Pink gradient sweep clipped to an underline, 40–60% the word width, slightly offset.

## Imagery

Illustration-led, not photography-led. The dominant graphics are hand-drawn line-art doodles — faces, speech bubbles, squiggles, stars, confetti, sparkles, arrows — at 1.5–2px stroke in Ink for outlines and Magenta for accent marks. Doodles float freely in the page margins, never cropped or masked. The only product imagery is a single in-browser form preview rendered as a chrome-windowed white card. No lifestyle photography, no 3D, no abstract gradient backgrounds. Icons match the doodles: outlined, 1.5px stroke, mono, magenta on feature cards. Imagery is decorative atmosphere first; information is carried by typography and white card surfaces.

## Layout

Centered, max-width ~1200px, on a full-bleed Paper canvas. The hero is a centered stack: 64px display headline → 2-line 18px subhead → single blue CTA → micro-helper line → a wide white form-preview card. Below: a centered logo bar, a Product Hunt badge row, then a **left-aligned** 2-column feature section, then a 2-up grid of feature cards (highlighted card on the left, standard on the right), then another 2-up row. Vertical rhythm is comfortable: ~64px between major sections, 24px between a card heading and its body, 8px between a body line and its meta. Navigation is a minimal top bar — wordmark left, text links + a dark button right — no sticky, no mega-menu, no sidebar.

---

## Do's and Don'ts

### Do
- Use `#0070d7` **exclusively** for primary action buttons — never repurpose magenta or any other chromatic colour for fills.
- Reserve `#f81ce5` for line art, icon strokes, decorative card borders, and the highlight-ring — never a button fill or large background block.
- Set headings in Inter 700–800 with letter-spacing `-0.031em` — the tight tracking is what makes the 64px display feel editorial.
- Pair a white 10px card with the four-stack warm shadow (`shadow-card`) for product surfaces; use the single-layer `shadow-feature` for simpler cards.
- Float hand-drawn doodles and underline flourishes in the margins with 1.5–2px strokes in Ink and Magenta only — loose and off-center, not grid-aligned.
- Keep the canvas at `#e0e0df` and let white cards do the lifting — no extra gray levels beyond Mist (`#f3f3f3`).
- Use 7px radius for buttons/inputs/tags and 10px for cards — the system's two corner values.

### Don't
- Don't use `#f81ce5` as a button background, link colour, or body-text colour — it's decorative/illustrative, not an interface fill.
- Don't introduce new chromatic accents (greens, oranges, purples) — the system is two-colour (blue = action, magenta = expression) plus a warm neutral scale.
- Don't use pure black (`#000000`) for body text — Ink (`#37352f`) is the text colour; reserve black for heading borders and the dark header button.
- Don't apply large heavy shadows or coloured glows to standard cards — the warm 1px-border + soft-blur stack is the only elevation language.
- Don't center-align body copy in the lower feature sections — cards and paragraphs left-align to preserve the editorial reading rhythm.
- Don't stretch doodles into full-bleed banners or hero backgrounds — they're margin ornaments.
- Don't round cards to 16px+ or buttons to pill shapes — 10px and 7px are the radii vocabulary.

---

## Two-Color Discipline

The core of the identity is a strict separation between **brand expression** and **conversion**:

- **Magenta (`#f81ce5`) is the voice** — illustrations, icon strokes, decorative borders, highlight rings.
- **Blue (`#0070d7`) is the action** — filled primary buttons, and nothing else.

No screen uses magenta as a button fill, link, or large background; no screen uses blue decoratively. The page feels playful and human because magenta is free to be expressive, while conversion moments stay calm and unmistakably clickable because blue is reserved and rare.

## Similar Brands

Typeform (warm paper + single illustrative brand colour), Notion (editorial Inter-on-warm-gray, soft warm shadows), Linear (tight Inter tracking, white-card-on-gray, one reserved accent), Coda (minimal palette, flat white cards, brand/action colour split), Pitch (magazine-masthead 60px+ Inter display, doodle margin marks).
