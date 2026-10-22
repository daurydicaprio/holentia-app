export type GuideCategory = "cuerpo" | "mente" | "relaciones" | "finanzas" | "general"

export interface GuideSource {
  title: string
  url: string
  accessedAt: string
}

export interface GuideFaq {
  question: string
  answer: string
}

export interface GuideFrontmatter {
  title: string
  /** Título corto para `<title>` y OG; el H1 y el JSON-LD conservan `title`. */
  seoTitle?: string
  slug: string
  description: string
  excerpt: string
  category: GuideCategory
  primaryTool: string
  relatedTools: string[]
  publishedAt: string
  updatedAt: string
  reviewedAt?: string
  author: string
  /** Variante visual de la portada generada (fallback si no hay foto). */
  cover?: string
  /** Foto editorial local en `public/guias/`, servida sin llamadas externas. */
  image?: string
  /** Texto alternativo de la foto editorial. */
  imageAlt?: string
  keywords: string[]
  sources: GuideSource[]
  faq: GuideFaq[]
  draft: boolean
}

export interface Guide extends GuideFrontmatter {
  /** Cuerpo Markdown sin el frontmatter. */
  content: string
  /** Minutos de lectura calculados con 220 palabras por minuto. */
  readingTime: number
}

export type GuideSummary = Pick<
  Guide,
  | "slug"
  | "title"
  | "description"
  | "excerpt"
  | "category"
  | "primaryTool"
  | "author"
  | "cover"
  | "image"
  | "imageAlt"
  | "publishedAt"
  | "updatedAt"
  | "draft"
  | "readingTime"
>
