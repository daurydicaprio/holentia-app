import { ImageResponse } from "next/og"
import { INTER_BOLD_BASE64 } from "./og-font"

// Imagen social genérica (1200×630) con la identidad de HOLENTIA.
// Paleta según design.md: fondo dark base, puntos de las 4 secciones.
export const alt = "HOLENTIA — Herramientas gratuitas de bienestar integral"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const font = Buffer.from(INTER_BOLD_BASE64, "base64")

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
          backgroundColor: "#121212",
        }}
      >
        <div
          style={{
            width: 250,
            height: 250,
            borderRadius: 9999,
            border: "6px solid #333333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#ffffff", fontSize: 36, fontWeight: 700, letterSpacing: 2 }}>
            HOLENTIA
          </span>
        </div>

        <div style={{ display: "flex", gap: 18, marginTop: 52 }}>
          <div style={{ width: 22, height: 22, borderRadius: 9999, backgroundColor: "#1976d2" }} />
          <div style={{ width: 22, height: 22, borderRadius: 9999, backgroundColor: "#7c3aed" }} />
          <div style={{ width: 22, height: 22, borderRadius: 9999, backgroundColor: "#ffa000" }} />
          <div style={{ width: 22, height: 22, borderRadius: 9999, backgroundColor: "#388e3c" }} />
        </div>

        <span style={{ color: "#a0a0a0", fontSize: 32, marginTop: 36 }}>
          Herramientas gratuitas de bienestar integral
        </span>
        <span style={{ color: "#6b7280", fontSize: 24, marginTop: 16 }}>holentia.com</span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
    },
  )
}
