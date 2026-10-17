import { ImageResponse } from "next/og"
import { INTER_BOLD_BASE64 } from "../og-font"
import { ogTemplate } from "@/components/seo/og-template"

export const alt = "Calculadora de sueldo neto — HOLENTIA"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const font = Buffer.from(INTER_BOLD_BASE64, "base64")

  return new ImageResponse(
    ogTemplate({ title: "Calculadora de sueldo neto", subtitle: "De bruto a neto: TSS e ISR en RD" }),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
    },
  )
}
