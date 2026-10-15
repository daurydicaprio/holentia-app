import type { Metadata } from "next"
import { sectionsData } from "@/lib/data"
import type { CardData, SectionType } from "@/types"

export const SITE_URL = "https://holentia.com"
export const SITE_NAME = "HOLENTIA"

const SECTION_LABELS: Record<SectionType, string> = {
  mente: "Mente",
  relaciones: "Relaciones",
  cuerpo: "Cuerpo",
  finanzas: "Finanzas",
}

// Categoría schema.org por sección
const SECTION_APP_CATEGORY: Record<SectionType, string> = {
  mente: "HealthApplication",
  relaciones: "LifestyleApplication",
  cuerpo: "HealthApplication",
  finanzas: "FinanceApplication",
}

export function sectionLabel(section: string): string {
  return SECTION_LABELS[section as SectionType] ?? section
}

export function findToolCard(section: string, slug: string): CardData | undefined {
  const sectionData = sectionsData[section]
  if (!sectionData) return undefined
  return sectionData.cards.find((card) => card.slug === slug)
}

/** Bloque base de metadata: title, description, canonical, openGraph y twitter */
function baseMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "es_DO",
      type: "website",
      // La imagen la aporta la file-convention (app/opengraph-image.tsx y variantes por ruta).
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  }
}

export interface FaqItem {
  question: string
  answer: string
}

/** Metadata para páginas informativas (que-es-holentia, ayuda, aviso-legal, etc.) */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return baseMetadata(title, description, path)
}

/** Datos estructurados FAQPage a partir de una lista de preguntas */
export function faqJsonLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

/** Metadata por página de sección derivada del catálogo en lib/data.ts */
export function sectionMetadata(section: string): Metadata {
  const data = sectionsData[section]
  const title = data ? `${data.title} ${data.highlightText}` : sectionLabel(section)
  const description =
    data?.subtitle ?? `Herramientas de ${sectionLabel(section)} para tu bienestar integral en ${SITE_NAME}.`

  return baseMetadata(title, description, `/${section}`)
}

/** Metadata por página de herramienta derivada del catálogo en lib/data.ts */
export function toolMetadata(section: string, slug: string): Metadata {
  const tool = findToolCard(section, slug)
  const title = tool?.metaTitle ?? tool?.title ?? "Herramienta"
  const description =
    tool?.metaDescription ?? tool?.description ?? "Herramienta de bienestar integral de HOLENTIA."

  return baseMetadata(title, description, `/${slug}`)
}

/** Datos estructurados JSON-LD: WebApplication + BreadcrumbList + FAQPage (si hay FAQ) */
export function toolJsonLd(section: string, slug: string, faq: FaqItem[] = []) {
  const tool = findToolCard(section, slug)
  if (!tool) return null

  const url = `${SITE_URL}/${slug}`
  const sectionUrl = `${SITE_URL}/${section}`

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebApplication",
      name: tool.title,
      description: tool.metaDescription ?? tool.description,
      url,
      inLanguage: "es-DO",
      applicationCategory: SECTION_APP_CATEGORY[section as SectionType] ?? "WebApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "DOP",
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: sectionLabel(section), item: sectionUrl },
        { "@type": "ListItem", position: 3, name: tool.title, item: url },
      ],
    },
  ]

  if (faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    })
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}

/** JSON-LD para páginas de sección: CollectionPage + BreadcrumbList (sin FAQPage: los hubs ya no llevan FAQ visible) */
export function sectionJsonLd(section: string) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      name: `${sectionLabel(section)} | ${SITE_NAME}`,
      url: `${SITE_URL}/${section}`,
      inLanguage: "es-DO",
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: sectionLabel(section), item: `${SITE_URL}/${section}` },
      ],
    },
  ]

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}

/** JSON-LD mínimo para páginas informativas (AboutPage + BreadcrumbList) */
export function pageJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: `${name} | ${SITE_NAME}`,
        url: `${SITE_URL}${path}`,
        inLanguage: "es-DO",
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
        ],
      },
    ],
  }
}
