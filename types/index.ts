export type SectionType = "mente" | "cuerpo" | "finanzas" | "relaciones"

export interface CardData {
  id: string
  title: string
  description: string
  slug: string
  isAvailable: boolean
  category: SectionType
}

export interface SectionData {
  id: SectionType
  title: string
  highlightText: string
  subtitle: string
  text: string
  cards: CardData[]
}
