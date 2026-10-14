import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { HydrationCalculator } from "@/components/tools/hydration-calculator/hydration-calculator"

const section = "cuerpo"
const toolSlug = "calculadora-hidratacion"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CalculadoraHidratacionPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <HydrationCalculator />
    </ToolPageShell>
  )
}
