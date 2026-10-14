import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { FuelExpenseCalculator } from "@/components/tools/fuel-expense-calculator/fuel-expense-calculator"

const section = "finanzas"
const toolSlug = "calculadora-gasto-combustible"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CalculadoraGastoCombustiblePage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <FuelExpenseCalculator />
    </ToolPageShell>
  )
}
