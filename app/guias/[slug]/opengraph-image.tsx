import { ImageResponse } from "next/og"
import { INTER_BOLD_BASE64 } from "../../og-font"
import { ogTemplate } from "@/components/seo/og-template"
import { guideCategoryLabel } from "@/lib/guide-format"
import { getGuideBySlug } from "@/lib/guides"

export const runtime = "nodejs"
export const alt = "Guía de HOLENTIA"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  const font = Buffer.from(INTER_BOLD_BASE64, "base64")

  const title = guide?.title ?? "Guías HOLENTIA"
  const subtitle = guide
    ? `${guideCategoryLabel(guide.category)} · ${guide.readingTime} min de lectura`
    : "Explicaciones claras, ejemplos y fuentes"

  return new ImageResponse(ogTemplate({ title, subtitle }), {
    ...size,
    fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
  })
}
