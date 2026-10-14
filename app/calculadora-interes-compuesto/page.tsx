import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CompoundInterestCalculator } from "@/components/tools/compound-interest/compound-interest-calculator"

const section = "finanzas"
const toolSlug = "calculadora-interes-compuesto"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CalculadoraInteresCompuestoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <CompoundInterestCalculator />
    </ToolPageShell>
  )
}
