import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { BudgetSimulator } from "@/components/tools/budget-simulator/budget-simulator"

const section = "finanzas"
const toolSlug = "crear-presupuesto-personal"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function CrearPresupuestoPersonalPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <BudgetSimulator />
    </ToolPageShell>
  )
}
