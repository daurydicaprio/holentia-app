import { sectionsData } from "@/lib/data"

export async function generateStaticParams() {
  const params: { section: string; tool: string }[] = []

  try {
    // Generar rutas para herramientas disponibles
    Object.entries(sectionsData).forEach(([sectionId, sectionData]) => {
      if (sectionData && sectionData.cards) {
        sectionData.cards
          .filter((card) => card && card.isAvailable && card.slug)
          .forEach((card) => {
            params.push({
              section: sectionId,
              tool: card.slug,
            })
          })
      }
    })
  } catch (error) {
    console.error("Error generating static params:", error)
    // Devolver al menos un parámetro válido para evitar errores
    return [{ section: "finanzas", tool: "calculadora-interes-compuesto" }]
  }

  return params
}
