import { notFound } from "next/navigation"
import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { CompoundInterestCalculator } from "@/components/tools/compound-interest/compound-interest-calculator"

export default function CalculadoraInteresCompuestoPage() {
  const section = "finanzas"
  const toolSlug = "calculadora-interes-compuesto"

  // Buscar la herramienta en la sección correspondiente
  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  if (!toolData) notFound()

  // Crear los parámetros necesarios para el componente ToolPageClient
  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<CompoundInterestCalculator />} />
}
