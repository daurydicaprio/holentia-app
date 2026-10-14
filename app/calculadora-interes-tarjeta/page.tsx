import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CardInterestCalculator } from "@/components/tools/card-interest/card-interest-calculator"

const section = "finanzas"
const toolSlug = "calculadora-interes-tarjeta"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CalculadoraInteresTarjetaPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <CardInterestCalculator />
    </ToolPageShell>
  )
}
