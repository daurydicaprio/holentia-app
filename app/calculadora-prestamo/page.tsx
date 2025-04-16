import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { LoanCalculator } from "@/components/tools/loan-calculator/loan-calculator"

export default function CalculadoraPrestamoPage() {
  const section = "finanzas"
  const toolSlug = "calculadora-prestamo"

  // Buscar la herramienta en la sección correspondiente
  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  // Crear los parámetros necesarios para el componente ToolPageClient
  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<LoanCalculator />} />
}
