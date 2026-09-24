import { notFound } from "next/navigation"
import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { RiskProfileTest } from "@/components/tools/risk-profile-test/risk-profile-test"

export default function TestPerfilRiesgoPage() {
  const section = "finanzas"
  const toolSlug = "test-perfil-riesgo"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  if (!toolData) notFound()

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<RiskProfileTest />} />
}
