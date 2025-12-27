import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { HydrationCalculator } from "@/components/tools/hydration-calculator/hydration-calculator"

export default function CalculadoraHidratacionPage() {
  const section = "cuerpo"
  const toolSlug = "calculadora-hidratacion"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<HydrationCalculator />} />
}
