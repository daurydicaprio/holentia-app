import { notFound } from "next/navigation"
import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { CalorieCalculator } from "@/components/tools/calorie-calculator/calorie-calculator"

export default function CalculadoraCaloriasPage() {
  const section = "cuerpo"
  const toolSlug = "calculadora-calorias"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  if (!toolData) notFound()

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<CalorieCalculator />} />
}
