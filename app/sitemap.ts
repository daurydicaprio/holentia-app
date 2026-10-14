import type { MetadataRoute } from "next"
import { sectionsData } from "@/lib/data"
import { SITE_URL } from "@/lib/seo"

// Fecha de última actualización real del contenido. Actualizar a mano al publicar cambios de contenido.
const LAST_UPDATED = new Date("2026-10-14")

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/mente`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/relaciones`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/cuerpo`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/finanzas`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/que-es-holentia`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/ayuda`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/apoyar`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/aviso-legal`, lastModified: LAST_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politica-cookies`, lastModified: LAST_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ]

  const toolRoutes: MetadataRoute.Sitemap = Object.values(sectionsData).flatMap((section) =>
    section.cards
      .filter((card) => card.isAvailable)
      .map((card) => ({
        url: `${SITE_URL}/${card.slug}`,
        lastModified: LAST_UPDATED,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  )

  return [...staticRoutes, ...toolRoutes]
}
