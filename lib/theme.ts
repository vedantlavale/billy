export interface ThemeColors {
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

export interface DesignTheme {
  id: string
  name: string
  fontFamily: string      // For React PDF (the font family name registered with Font.register)
  cssFontFamily: string   // For CSS custom properties
  colors: ThemeColors
}

// Global Spacing (in points / pixels)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  pagePaddingClean: 36,      // ~0.5in A4 padding
  pagePaddingMinimalTeal: 36,
  pagePaddingModernGreen: 36,
  pagePaddingCorporateBlue: 36,
}

// Global Font Sizes (in points)
export const fontSize = {
  xs: 8,
  sm: 10,
  base: 12,
  lg: 14,
  xl: 18,
  xxl: 24,
  title: 32,
}

export const THEME_TOKENS: Record<string, DesignTheme> = {
  clean: {
    id: "clean",
    name: "Clean",
    fontFamily: "SourceSans3",
    cssFontFamily: "var(--font-sans)",
    colors: {
      ink: "#1e293b",
      muted: "#64748b",
      subtle: "#94a3b8",
      paper: "#faf9f6",
      border: "#e2e8f0",
      accent: "#334155",
      desk: "#f5f5f4",
      panel: "#fcfcfc",
      panelBorder: "#e2e8f0",
      toolbar: "#ffffff",
      primary: "transparent",
      secondary: "transparent",
    },
  },
  "modern-green": {
    id: "modern-green",
    name: "Modern Green",
    fontFamily: "Montserrat",
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
  "minimal-teal": {
    id: "minimal-teal",
    name: "Minimal Teal",
    fontFamily: "Outfit",
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
  "corporate-blue": {
    id: "corporate-blue",
    name: "Corporate Blue",
    fontFamily: "Inter",
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
}

export function getThemeToken(id: string): DesignTheme {
  return THEME_TOKENS[id] || THEME_TOKENS.clean
}
