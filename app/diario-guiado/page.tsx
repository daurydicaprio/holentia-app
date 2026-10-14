import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { GuidedJournal } from "@/components/tools/guided-journal/guided-journal"

const section = "mente"
const toolSlug = "diario-guiado"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function DiarioGuiadoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <GuidedJournal />
    </ToolPageShell>
  )
}
