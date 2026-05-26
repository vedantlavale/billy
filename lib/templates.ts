export interface Template {
  id: string
  name: string
  description: string
  pro: boolean
  fontFamily: string
  cssFontFamily: string
  colors: {
    ink: string
    muted: string
    subtle: string
    paper: string
    border: string
    accent: string
    desk: string
    panel: string
    panelBorder: string
    toolbar: string
    primary: string
    secondary: string
  }
}

export const TEMPLATES: Template[] = [
  {
    id: "clean",
    name: "Clean",
    description: "Minimal, professional with a warm off-white desk",
    pro: false,
    fontFamily: "'Source Sans 3', Arial, Helvetica, sans-serif",
    cssFontFamily: "var(--font-sans)",
    colors: {
      ink: "oklch(0.18 0.01 265)",
      muted: "oklch(0.48 0.02 260)",
      subtle: "oklch(0.52 0.02 260)",
      paper: "oklch(0.99 0.01 85)",
      border: "oklch(0.9 0.02 260)",
      accent: "oklch(0.35 0.03 255)",
      desk: "oklch(0.955 0.003 60)",
      panel: "oklch(0.985 0.003 255)",
      panelBorder: "oklch(0.88 0.005 255)",
      toolbar: "oklch(0.995 0 0)",
      primary: "transparent",
      secondary: "transparent",
    },
  },
  {
    id: "modern-green",
    name: "Modern Green",
    description: "Fresh olive green header with bordered sections",
    pro: false,
    fontFamily: "'Montserrat', Arial, sans-serif",
    cssFontFamily: "var(--font-montserrat)",
    colors: {
      ink: "#111827",
      muted: "#4b5563",
      subtle: "#6b7280",
      paper: "#ffffff",
      border: "#111827",
      accent: "#d4e09b",
      desk: "#f3f4f6",
      panel: "#ffffff",
      panelBorder: "#e5e7eb",
      toolbar: "#ffffff",
      primary: "#d4e09b",
      secondary: "#ffffff",
    },
  },
  {
    id: "minimal-teal",
    name: "Minimal Teal",
    description: "Premium elegant layout with refined teal accents and delicate typography",
    pro: true,
    fontFamily: "'Outfit', Arial, sans-serif",
    cssFontFamily: "var(--font-outfit)",
    colors: {
      ink: "#0f172a",
      muted: "#64748b",
      subtle: "#94a3b8",
      paper: "#ffffff",
      border: "#e2e8f0",
      accent: "#0d9488",
      desk: "#f8fafc",
      panel: "#ffffff",
      panelBorder: "#f1f5f9",
      toolbar: "#ffffff",
      primary: "#0f766e",
      secondary: "#f0fdfa",
    },
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    description: "Professional medical/corporate style with blue headers",
    pro: false,
    fontFamily: "'Inter', Arial, sans-serif",
    cssFontFamily: "var(--font-inter)",
    colors: {
      ink: "#1f2937",
      muted: "#4b5563",
      subtle: "#6b7280",
      paper: "#ffffff",
      border: "#e5e7eb",
      accent: "#8eb2c5",
      desk: "#f3f4f6",
      panel: "#ffffff",
      panelBorder: "#e5e7eb",
      toolbar: "#ffffff",
      primary: "#8eb2c5",
      secondary: "#f9fafb",
    },
  },
]

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}

export function getTemplateStyles(id: string): string {
  const t = getTemplate(id)

  return `
    --invoice-ink: ${t.colors.ink};
    --invoice-muted: ${t.colors.muted};
    --invoice-subtle: ${t.colors.subtle};
    --invoice-paper: ${t.colors.paper};
    --invoice-border: ${t.colors.border};
    --invoice-accent: ${t.colors.accent};
    --invoice-desk: ${t.colors.desk};
    --invoice-panel: ${t.colors.panel};
    --invoice-panel-border: ${t.colors.panelBorder};
    --invoice-toolbar: ${t.colors.toolbar};
    --invoice-primary: ${t.colors.primary};
    --invoice-secondary: ${t.colors.secondary};
    --invoice-font: ${t.cssFontFamily};
  `
}

export function getPdfTemplateCss(id: string): string {
  const t = getTemplate(id)
  const c = t.colors

  let templateSpecificCss = ""
  
  if (id === "modern-green") {
    templateSpecificCss = `
      .top {
        background: ${c.primary};
        padding: 40px;
        margin: -18mm -18mm 24px -18mm;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        border-bottom: none;
      }
      .brand {
        grid-column: 2;
        grid-row: 1;
        flex-direction: row-reverse;
      }
      h1 { font-size: 18px; }
      .top::before {
        content: "INVOICE";
        font-size: 48px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: ${c.ink};
        grid-column: 1;
        grid-row: 1;
      }
      .business {
        grid-column: 1 / -1;
        grid-row: 2;
        display: flex;
        justify-content: space-between;
        text-align: left;
        background: white;
        padding: 16px;
        border: 1px solid ${c.border};
        margin-top: 24px;
      }
      .client-grid {
        background: ${c.primary};
        border: 1px solid ${c.border};
        padding: 16px;
      }
      .client-grid > div {
        background: white;
        padding: 8px;
        border: 1px solid ${c.border};
      }
      .meta-grid {
        background: ${c.primary};
        border: 1px solid ${c.border};
        border-top: none;
        padding: 16px;
      }
      .meta-grid > div {
        background: white;
        padding: 8px;
        border: 1px solid ${c.border};
      }
      th {
        background: ${c.primary};
        padding: 12px;
        border: 1px solid ${c.border};
        color: ${c.ink};
      }
      td {
        border: 1px solid ${c.border};
        padding: 12px;
      }
      .totals-box {
        border: 1px solid ${c.border};
        padding: 16px;
        margin-top: 16px;
      }
      .footer {
        background: ${c.primary};
        padding: 24px;
        margin: 24px -18mm -18mm -18mm;
      }
    `
  } else if (id === "minimal-teal") {
    templateSpecificCss = `
      .page { position: relative; padding: 48px; }
      .top {
        display: block !important;
        text-align: center !important;
        border-bottom: 2px solid ${c.primary} !important;
        padding-bottom: 24px !important;
        margin-bottom: 24px !important;
      }
      .brand {
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 8px !important;
        margin-bottom: 12px !important;
        width: 100% !important;
        text-align: center !important;
      }
      .logo-image, .logo-fallback {
        margin: 0 auto !important;
        width: 60px !important;
        height: 60px !important;
      }
      .top::before {
        content: "INVOICE";
        font-family: 'Instrument Serif', serif;
        font-size: 32px;
        font-weight: 500;
        letter-spacing: 0.25em;
        color: ${c.primary};
        display: block;
        margin-bottom: 12px;
        text-align: center;
      }
      h1 {
        font-family: 'Instrument Serif', serif;
        font-size: 28px;
        font-weight: 500;
        margin-top: 8px;
        text-align: center;
        color: ${c.ink};
      }
      .tagline {
        font-family: 'Instrument Serif', serif;
        font-style: italic;
        font-size: 14px;
        text-transform: none;
        letter-spacing: normal;
        margin-top: 2px;
        color: ${c.primary};
        text-align: center;
      }
      .business {
        display: block !important;
        text-align: center !important;
        margin-top: 12px !important;
        color: ${c.muted} !important;
        line-height: 1.5 !important;
        font-size: 11px !important;
      }
      .client-grid {
        float: left !important;
        width: 48% !important;
        border-bottom: none !important;
        padding: 0 !important;
        margin-bottom: 0 !important;
      }
      .meta-grid {
        float: right !important;
        width: 48% !important;
        border-bottom: none !important;
        padding: 0 !important;
        margin-bottom: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        text-align: right !important;
        gap: 8px !important;
      }
      .page > section:not(.client-grid):not(.meta-grid) {
        clear: both !important;
        padding: 16px 0 !important;
        border-bottom: none !important;
      }
      th {
        background: transparent;
        color: ${c.muted};
        padding: 10px 0 !important;
        border-top: 2px solid ${c.border};
        border-bottom: 1px solid ${c.border};
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      td {
        padding: 10px 0 !important;
        border-bottom: 1px solid ${c.border};
        border-left: none;
        border-right: none;
        font-size: 12px;
      }
      table { border-bottom: none; }
      .totals {
        display: block !important;
        padding-top: 16px !important;
      }
      .totals-box {
        width: 50% !important;
        margin-left: auto !important;
      }
      .total-row {
        padding: 4px 0 !important;
        font-size: 11px !important;
      }
      .grand-total {
        background: ${c.primary};
        color: white;
        padding: 12px 18px !important;
        border: none;
        margin-top: 16px;
        font-weight: 600;
        font-size: 16px;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      .grand-total * {
        color: white !important;
      }
      .footer {
        margin-top: 32px !important;
        padding-top: 16px !important;
        border-top: 1px solid ${c.border};
        color: ${c.muted};
        font-size: 12px;
        text-align: center;
        font-style: italic;
      }
    `
  } else if (id === "corporate-blue") {
    templateSpecificCss = `
      .top {
        border-bottom: 2px solid ${c.ink};
      }
      .top::after {
        content: "INVOICE";
        font-size: 32px;
        font-weight: 700;
        display: block;
        margin-top: 24px;
        grid-column: 1 / -1;
      }
      th {
        background: ${c.primary};
        color: white;
        padding: 12px;
      }
      tr:nth-child(even) td {
        background: ${c.secondary};
      }
      .grand-total {
        background: ${c.primary};
        color: white;
        padding: 12px;
      }
      .footer {
        background: ${c.primary};
        color: white;
        padding: 24px;
        margin: 24px -18mm -18mm -18mm;
      }
      .footer .label, .footer .text {
        color: white;
      }
    `
  }

  return `
    --pdf-ink: ${c.ink};
    --pdf-muted: ${c.muted};
    --pdf-paper: ${c.paper};
    --pdf-border: ${c.border};
    --pdf-accent: ${c.accent};
    --pdf-primary: ${c.primary};
    --pdf-secondary: ${c.secondary};
    ${templateSpecificCss}
  `
}
