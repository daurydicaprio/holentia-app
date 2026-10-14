import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { RiskProfileTest } from "@/components/tools/risk-profile-test/risk-profile-test"

const section = "finanzas"
const toolSlug = "test-perfil-riesgo"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function TestPerfilRiesgoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <RiskProfileTest />
    </ToolPageShell>
  )
}
