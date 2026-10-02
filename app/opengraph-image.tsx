import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const alt = "billy: invoicing that feels like editing a document. Launching soon."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#37352f",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -3, color: "#0070d7" }}>billy</div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, marginTop: 24 }}>Launching soon</div>
        <div style={{ fontSize: 36, marginTop: 24, color: "#6b6a65" }}>
          Invoicing that feels like editing a document.
        </div>
      </div>
    ),
    size,
  )
}
