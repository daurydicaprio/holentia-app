import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { ElectricityCalculator } from "@/components/tools/electricity-calculator/electricity-calculator"

const section = "finanzas"
const toolSlug = "calculadora-consumo-electrico"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CalculadoraConsumoElectricoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <ElectricityCalculator />
    </ToolPageShell>
  )
}
