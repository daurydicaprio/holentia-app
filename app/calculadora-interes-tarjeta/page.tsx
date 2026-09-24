import { notFound } from "next/navigation"
import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { CardInterestCalculator } from "@/components/tools/card-interest/card-interest-calculator"

export default function CalculadoraInteresTarjetaPage() {
  const section = "finanzas"
  const toolSlug = "calculadora-interes-tarjeta"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  if (!toolData) notFound()

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<CardInterestCalculator />} />
}
