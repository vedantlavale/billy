import { THEME_TOKENS, ThemeColors } from "./theme"

export interface Template {
  id: string
  name: string
  description: string
  pro: boolean
  fontFamily: string
  cssFontFamily: string
  colors: ThemeColors
}

export const TEMPLATES: Template[] = [
  {
    id: "clean",
    name: "Clean",
    description: "Minimal, professional with a warm off-white desk",
    pro: false,
    fontFamily: "'Source Sans 3', Arial, Helvetica, sans-serif",
    cssFontFamily: THEME_TOKENS.clean.cssFontFamily,
    colors: THEME_TOKENS.clean.colors,
  },
  {
    id: "modern-green",
    name: "Modern Green",
    description: "Fresh olive green header with bordered sections",
    pro: false,
    fontFamily: "'Montserrat', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS["modern-green"].cssFontFamily,
    colors: THEME_TOKENS["modern-green"].colors,
  },
  {
    id: "minimal-teal",
    name: "Minimal Teal",
    description: "Premium elegant layout with refined teal accents and delicate typography",
    pro: true,
    fontFamily: "'Outfit', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS["minimal-teal"].cssFontFamily,
    colors: THEME_TOKENS["minimal-teal"].colors,
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    description: "Professional medical/corporate style with blue headers",
    pro: false,
    fontFamily: "'Inter', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS["corporate-blue"].cssFontFamily,
    colors: THEME_TOKENS["corporate-blue"].colors,
  },
  {
    id: "mono-classic",
    name: "Mono Classic",
    description: "Simple, black and white professional structure.",
    pro: false,
    fontFamily: "'Inter', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS["mono-classic"].cssFontFamily,
    colors: THEME_TOKENS["mono-classic"].colors,
  },
  {
    id: "mono-elegant",
    name: "Mono Elegant",
    description: "Elegant black and white design with serif typography.",
    pro: false,
    fontFamily: "'Instrument Serif', serif",
    cssFontFamily: THEME_TOKENS["mono-elegant"].cssFontFamily,
    colors: THEME_TOKENS["mono-elegant"].colors,
  },
  {
    id: "studio",
    name: "Studio",
    description: "Bold dark header, oversized name, amber accents.",
    pro: false,
    fontFamily: "'DM Sans', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS.studio.cssFontFamily,
    colors: THEME_TOKENS.studio.colors,
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Warm paper, ruled rows and a numbered gutter, like a bound ledger.",
    pro: false,
    fontFamily: "'Source Sans 3', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS.ledger.cssFontFamily,
    colors: THEME_TOKENS.ledger.colors,
  },
  {
    id: "receipt",
    name: "Receipt",
    description: "Compact and centred with dotted rules, for short invoices.",
    pro: false,
    fontFamily: "'Inter', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS.receipt.cssFontFamily,
    colors: THEME_TOKENS.receipt.colors,
  },
  {
    id: "letterhead",
    name: "Letterhead",
    description: "Formal navy masthead with a gold rule, serif company name.",
    pro: false,
    fontFamily: "'Inter', Arial, sans-serif",
    cssFontFamily: THEME_TOKENS.letterhead.cssFontFamily,
    colors: THEME_TOKENS.letterhead.colors,
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
