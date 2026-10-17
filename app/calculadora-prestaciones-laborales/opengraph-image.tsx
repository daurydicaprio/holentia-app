import { ImageResponse } from "next/og"
import { INTER_BOLD_BASE64 } from "../og-font"
import { ogTemplate } from "@/components/seo/og-template"

export const alt = "Calculadora de prestaciones laborales — HOLENTIA"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const font = Buffer.from(INTER_BOLD_BASE64, "base64")

  return new ImageResponse(
    ogTemplate({ title: "Calculadora de prestaciones", subtitle: "Cesantía, preaviso y derechos en RD" }),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
    },
  )
}
