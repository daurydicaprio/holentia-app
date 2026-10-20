import type { GuideCategory } from "@/types/guide"

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

const CATEGORY_LABELS: Record<GuideCategory, string> = {
  cuerpo: "Cuerpo",
  mente: "Mente",
  relaciones: "Relaciones",
  finanzas: "Finanzas",
  general: "Bienestar",
}

export function guideCategoryLabel(category: GuideCategory): string {
  return CATEGORY_LABELS[category] ?? "Bienestar"
}

/** Formatea una fecha YYYY-MM-DD sin depender de la zona horaria del servidor. */
export function formatGuideDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day || month < 1 || month > 12) return value
  return `${day} de ${MONTHS[month - 1]} de ${year}`
}
