export type SectionType = "mente" | "cuerpo" | "finanzas" | "relaciones"

export interface CardData {
  id: string
  title: string
  description: string
  slug: string
  isAvailable: boolean
  category: SectionType
  /** Título optimizado para SEO (≤60 chars). Si falta, se usa title. */
  metaTitle?: string
  /** Meta description 120–155 chars con keyword + beneficio. Si falta, se usa description. */
  metaDescription?: string
}

export interface SectionFaqItem {
  question: string
  answer: string
}

export interface SectionData {
  id: SectionType
  title: string
  highlightText: string
  subtitle: string
  text: string
  /** Párrafo introductorio extra (server-rendered, bueno para SEO/GEO). */
  intro?: string
  /** Mini-FAQ de la página de sección (renderizada en HTML inicial + FAQPage JSON-LD). */
  faq?: SectionFaqItem[]
  cards: CardData[]
}

export interface AmortizationRow {
  month: number
  initialBalance: number
  payment: number
  interest: number
  principal: number
  remainingBalance: number
}
