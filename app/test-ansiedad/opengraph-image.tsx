import { ImageResponse } from "next/og"
import { INTER_BOLD_BASE64 } from "../og-font"
import { ogTemplate } from "@/components/seo/og-template"

export const alt = "Test de ansiedad GAD-7 — HOLENTIA"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const font = Buffer.from(INTER_BOLD_BASE64, "base64")

  return new ImageResponse(
    ogTemplate({ title: "Test de ansiedad GAD-7", subtitle: "7 preguntas · puntaje 0–21 · orientación por nivel" }),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
    },
  )
}
