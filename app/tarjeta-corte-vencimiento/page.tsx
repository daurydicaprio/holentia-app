import { notFound } from "next/navigation"
import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { CardCutoffCalculator } from "@/components/tools/card-cutoff/card-cutoff-calculator"

export default function TarjetaCorteVencimientoPage() {
  const section = "finanzas"
  const toolSlug = "tarjeta-corte-vencimiento"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  if (!toolData) notFound()

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<CardCutoffCalculator />} />
}
