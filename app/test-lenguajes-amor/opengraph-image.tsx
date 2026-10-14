import { ImageResponse } from "next/og"
import { INTER_BOLD_BASE64 } from "../og-font"
import { ogTemplate } from "@/components/seo/og-template"

export const alt = "Test de los 5 lenguajes del amor — HOLENTIA"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const font = Buffer.from(INTER_BOLD_BASE64, "base64")

  return new ImageResponse(ogTemplate({ title: "Test de los 5 lenguajes del amor", subtitle: "Descubre cómo das y recibes amor" }), {
    ...size,
    fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
  })
}
