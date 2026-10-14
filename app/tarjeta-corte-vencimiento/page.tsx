import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CardCutoffCalculator } from "@/components/tools/card-cutoff/card-cutoff-calculator"

const section = "finanzas"
const toolSlug = "tarjeta-corte-vencimiento"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function TarjetaCorteVencimientoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <CardCutoffCalculator />
    </ToolPageShell>
  )
}
