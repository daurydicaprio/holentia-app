import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { ElectricityCalculator } from "@/components/tools/electricity-calculator/electricity-calculator"

export default function CalculadoraConsumoElectricoPage() {
  const section = "finanzas"
  const toolSlug = "calculadora-consumo-electrico"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<ElectricityCalculator />} />
}
