import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CalorieCalculator } from "@/components/tools/calorie-calculator/calorie-calculator"

const section = "cuerpo"
const toolSlug = "calculadora-calorias"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CalculadoraCaloriasPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <CalorieCalculator />
    </ToolPageShell>
  )
}
