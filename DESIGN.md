---
version: alpha
name: Tally Minimal Forms
description: A bright, minimal, and playful form-building system with crisp blue actions and hand-drawn personality.
colors:
  primary: "#0070d7"
  secondary: "#37352f"
  tertiary: "#E5E7EB"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  on-surface: "#37352f"
  error: "#D92D20"
  border: "#E5E7EB"
  muted: "#F3F4F6"
typography:
  headline-display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: 700
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 49px
    fontWeight: 700
    lineHeight: 59px
    letterSpacing: 0px
  headline-md:
    fontFamily: Inter
    fontSize: 38px
    fontWeight: 700
    lineHeight: 46px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Inter
    fontSize: 29px
    fontWeight: 600
    lineHeight: 35px
    letterSpacing: 0px
  body-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 500
    lineHeight: 33px
    letterSpacing: 0px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 4px
  md: 7px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 64px
  xl: 128px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 0px 10px
    height: 40px
  button-primary-hover:
    backgroundColor: "#005fb8"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 0px 10px
    height: 40px
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 0px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
  chip:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 0px 10px
---

## Overview

Tally feels lightweight, friendly, and extremely approachable, with a playful editorial touch layered onto a very clean SaaS foundation. The audience is likely creators, marketers, and small teams who want form creation to feel simple rather than technical. The overall tone is spacious and calm, with a strong contrast between the minimal interface and the hand-drawn doodle accents.

## Colors

- **Primary (#0070D7):** A vivid blue used for the main call to action, links, and active emphasis. It gives the product confidence without feeling corporate-heavy.
- **Secondary (#37352F):** A warm near-black used for body text, headings, and utility navigation. It reads softer than pure black, matching the brand’s friendly tone.
- **Tertiary (#E5E7EB):** A light neutral border and divider color for subtle structure. It helps define cards and UI edges without adding visual weight.
- **Surface (#FFFFFF):** The dominant background and card fill, creating an open canvas for the content. White space is a major part of the visual identity.
- **Neutral (#FFFFFF):** Used for text on primary buttons and other reversed treatments. It keeps action states crisp and legible.
- **Muted (#F3F4F6):** A soft gray wash for low-emphasis UI surfaces, chips, and gentle background treatments.
- **Error (#D92D20):** A conventional alert red reserved for validation and destructive states. It should remain rare and functional.

## Typography

Inter is the sole typographic voice, giving the interface a modern and highly readable SaaS feel. Headlines are bold and compact, with `headline-display` at 64px using tight negative tracking to create a strong hero statement. Body text is medium-weight in larger contexts and regular-weight in standard UI contexts, preserving clarity while keeping the page airy.

Labels and buttons rely on `label-md` and `label-sm`, which are semibold and compact for control surfaces. The source imagery shows no uppercase system labels, so keep case natural and avoid forced all-caps treatments. The hierarchy should remain simple: large bold headlines, medium body copy, and restrained utility labels.

## Layout

The layout is centered and highly spacious, with a strong hero section above a large illustrative form preview. Content appears to follow a wide fixed-max-width composition rather than a dense fluid grid, with generous side margins and large vertical spacing between sections. Use the provided spacing rhythm: `xs` for tight internal gaps, `sm` for small separations, `md` for standard stacking, and `lg` to `xl` for major section breaks and hero breathing room.

Cards and embedded previews should have ample internal padding and lots of negative space. The page is intentionally uncluttered, so avoid compact multi-column layouts unless absolutely necessary. Navigation stays lightweight and aligned to the top edge, while the main CTA and supporting copy remain center-anchored.

## Elevation & Depth

Depth is subtle and mostly created through soft borders, faint shadows, and layering rather than dramatic elevation. The interface uses clean white surfaces with light gray outlines to separate content, and only modest shadowing on larger floating containers. This keeps the product feeling modern, calm, and trustworthy.

When depth is needed, prefer a thin border plus a low-opacity shadow over heavy blur or pronounced stacking. The overall visual language is almost flat, so shadows should support structure rather than become a focal style.

## Shapes

The shape language is gently rounded and approachable, with small radii on buttons, cards, and fields. `rounded.md` at 7px is the core interactive radius, while `rounded.lg` at 8px and `rounded.full` for chips keep elements soft without looking pill-heavy. The result feels polished and human, not playful in an exaggerated way.

Avoid sharp geometry unless you are deliberately creating a utility-like text link or separator. Most containers should feel lightly softened, with no aggressively pill-shaped surfaces except for badges or compact chips.

## Components

Buttons are the clearest expression of the brand. Use `button-primary` for the main action: blue fill, white text, 40px height, semibold label, and compact horizontal padding. Hover states should deepen the blue slightly, as in `button-primary-hover`, rather than adding shadows or motion-heavy treatments. `button-secondary` is a quiet outlined or transparent alternative for secondary actions, while `button-tertiary` is best for inline text-like actions and links.

Cards should use the `card` token: white background, 1px border, 8px radius, and generous padding. Keep card content sparse and well spaced, with text aligned left and minimal decorative chrome. Large embedded previews may look like browser windows or form canvases, but they should still feel lightweight and clean.

Inputs should follow the same restrained language as cards: white surface, subtle border, medium-radius corners, and comfortable vertical padding. Fields should be easy to scan and should not rely on heavy shadows or bright outlines. Focus states should lean on the primary blue for clarity.

Chips and tags should be compact, rounded, and low contrast, using muted backgrounds with dark text. They can be used for labels, statuses, or inline metadata, but should never overpower the page. Links and utility items should remain simple, text-forward, and close to the secondary text color unless they are primary actions.

## Do's and Don'ts

- Do keep the interface airy, centered, and whitespace-rich.
- Do use Inter across all typography scales for consistency.
- Do reserve blue for primary actions, links, and active emphasis.
- Do prefer subtle borders and soft shadows over heavy depth effects.
- Do keep buttons compact, semibold, and around 40px tall.
- Don't introduce loud gradients, dark themes, or high-saturation accent colors.
- Don't over-round buttons and cards beyond the system’s gentle 7–8px feel.
- Don't crowd the page with dense grids, stacked promos, or excessive chrome.
