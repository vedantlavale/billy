'use client'

import * as React from "react"

/**
 * Render mode for the invoice page. The editable canvas renders with
 * readOnly=false (the default), the live preview renders the SAME component
 * tree with readOnly=true. Keeping one component for both — switched only by
 * this flag — is what guarantees the preview is pixel-identical to the canvas
 * for every template (the per-template styling lives in global CSS keyed on
 * the section class names, which both modes preserve).
 */
const RenderModeContext = React.createContext<boolean>(false)

export function RenderModeProvider({
  readOnly,
  children,
}: {
  readOnly: boolean
  children: React.ReactNode
}) {
  return (
    <RenderModeContext.Provider value={readOnly}>
      {children}
    </RenderModeContext.Provider>
  )
}

/** Returns true when the invoice is being rendered as a static preview. */
export function useReadOnly() {
  return React.useContext(RenderModeContext)
}
