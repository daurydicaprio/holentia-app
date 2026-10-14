import type React from "react"

interface OgTemplateProps {
  /** Título grande (nombre de sección o herramienta). */
  title: string
  /** Subtítulo corto bajo el título. */
  subtitle: string
}

/** Plantilla compartida de imagen social 1200×630 (fondo #121212 + 4 puntos de marca). */
export function ogTemplate({ title, subtitle }: OgTemplateProps): React.ReactElement {
  return (
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
          width: 180,
          height: 180,
          borderRadius: 9999,
          border: "5px solid #333333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#ffffff", fontSize: 28, fontWeight: 700, letterSpacing: 1.5 }}>
          HOLENTIA
        </span>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
        <div style={{ width: 20, height: 20, borderRadius: 9999, backgroundColor: "#1976d2" }} />
        <div style={{ width: 20, height: 20, borderRadius: 9999, backgroundColor: "#7c3aed" }} />
        <div style={{ width: 20, height: 20, borderRadius: 9999, backgroundColor: "#ffa000" }} />
        <div style={{ width: 20, height: 20, borderRadius: 9999, backgroundColor: "#388e3c" }} />
      </div>

      <span style={{ color: "#ffffff", fontSize: 52, fontWeight: 700, marginTop: 40, padding: "0 80px", textAlign: "center" }}>
        {title}
      </span>
      <span style={{ color: "#a0a0a0", fontSize: 28, marginTop: 20, padding: "0 80px", textAlign: "center" }}>
        {subtitle}
      </span>
      <span style={{ color: "#6b7280", fontSize: 22, marginTop: 28 }}>holentia.com</span>
    </div>
  )
}
