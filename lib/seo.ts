import type { Metadata } from "next"
import { sectionsData } from "@/lib/data"
import type { CardData, SectionType } from "@/types"
import type { Guide } from "@/types/guide"

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

/** Busca una herramienta por slug sin conocer la sección (guías con categoría general). */
export function findToolBySlug(slug: string): CardData | undefined {
  for (const sectionData of Object.values(sectionsData)) {
    const card = sectionData.cards.find((item) => item.slug === slug)
    if (card) return card
  }
  return undefined
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
function faqNode(faq: FaqItem[]) {
  return {
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

/** FAQPage + BreadcrumbList en un solo @graph (páginas con FAQ sin shell de herramienta, p.ej. /ayuda). */
export function faqWithBreadcrumbJsonLd(faq: FaqItem[], path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      faqNode(faq),
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

/** Metadata por página de sección derivada del catálogo en lib/data.ts */
export function sectionMetadata(section: string): Metadata {
  const data = sectionsData[section]
  const title = data ? `${data.title} ${data.highlightText}` : sectionLabel(section)
  // La meta description es factual (120–155 ch); el copy inspirador visible va en `subtitle`.
  const description =
    data?.metaDescription ??
    data?.subtitle ??
    `Herramientas de ${sectionLabel(section)} para tu bienestar integral en ${SITE_NAME}.`

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

/** Metadata para el índice editorial. Las guías publicadas entran al sitemap cuando existan. */
export function guidesIndexMetadata(): Metadata {
  return baseMetadata(
    "Guías de bienestar y finanzas",
    "Guías de HOLENTIA con explicaciones claras, ejemplos con números y fuentes sobre dinero, cuerpo y decisiones cotidianas. Sin registro.",
    "/guias",
  )
}

/** Metadata de una guía: canónica propia y noindex mientras siga en borrador o en preview. */
export function guideMetadata(guide: Guide, options?: { noindex?: boolean }): Metadata {
  const path = `/guias/${guide.slug}`
  const metadataTitle = guide.seoTitle ?? guide.title

  return {
    title: metadataTitle,
    description: guide.description,
    alternates: {
      canonical: path,
    },
    robots: guide.draft || options?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${metadataTitle} | ${SITE_NAME}`,
      description: guide.description,
      url: path,
      siteName: SITE_NAME,
      locale: "es_DO",
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author],
      section: guide.category,
    },
    twitter: {
      card: "summary_large_image",
      title: `${metadataTitle} | ${SITE_NAME}`,
      description: guide.description,
    },
  }
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

/** JSON-LD del índice de guías: CollectionPage + BreadcrumbList con las guías publicadas. */
export function guidesIndexJsonLd(guides: Guide[] = []) {
  const published = guides.filter((guide) => !guide.draft)
  const url = `${SITE_URL}/guias`

  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      name: `Guías de bienestar y finanzas | ${SITE_NAME}`,
      url,
      inLanguage: "es-DO",
      description:
        "Guías de HOLENTIA con explicaciones claras, ejemplos y fuentes sobre dinero, cuerpo y decisiones cotidianas.",
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
      ...(published.length > 0
        ? {
            hasPart: published.map((guide) => ({
              "@type": "Article",
              headline: guide.title,
              url: `${SITE_URL}/guias/${guide.slug}`,
              ...(guide.image ? { image: `${SITE_URL}${guide.image}` } : {}),
            })),
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Guías", item: url },
      ],
    },
  ]

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}

/** JSON-LD de una guía: Article + BreadcrumbList + FAQPage (si tiene preguntas). */
export function guideJsonLd(guide: Guide) {
  const url = `${SITE_URL}/guias/${guide.slug}`

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      inLanguage: "es-DO",
      articleSection: guide.category,
      keywords: guide.keywords,
      image: guide.image ? `${SITE_URL}${guide.image}` : `${url}/opengraph-image`,
      ...(guide.sources.length > 0
        ? {
            citation: guide.sources.map((source) => ({
              "@type": "CreativeWork",
              name: source.title,
              url: source.url,
            })),
          }
        : {}),
      isAccessibleForFree: true,
      author: {
        "@type": "Person",
        name: guide.author,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/apple-icon.png`,
        },
      },
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
        { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE_URL}/guias` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ]

  if (guide.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
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
  const data = sectionsData[section]
  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      name: `${sectionLabel(section)} | ${SITE_NAME}`,
      url: `${SITE_URL}/${section}`,
      inLanguage: "es-DO",
      ...(data?.metaDescription ? { description: data.metaDescription } : {}),
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

/** JSON-LD del directorio de herramientas: CollectionPage + BreadcrumbList */
export function directoryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Directorio de herramientas | ${SITE_NAME}`,
        url: `${SITE_URL}/herramientas`,
        inLanguage: "es-DO",
        description:
          "Todas las herramientas de HOLENTIA en un solo lugar: calculadoras, simuladores y tests por sección, gratuitos y sin registro.",
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
          { "@type": "ListItem", position: 2, name: "Directorio de herramientas", item: `${SITE_URL}/herramientas` },
        ],
      },
    ],
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
