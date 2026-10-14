import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { LoanCalculator } from "@/components/tools/loan-calculator/loan-calculator"

const section = "finanzas"
const toolSlug = "calculadora-prestamo"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CalculadoraPrestamoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <LoanCalculator />
    </ToolPageShell>
  )
}
