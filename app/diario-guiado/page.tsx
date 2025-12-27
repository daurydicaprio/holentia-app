import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { GuidedJournal } from "@/components/tools/guided-journal/guided-journal"

export default function DiarioGuiadoPage() {
  const section = "mente"
  const toolSlug = "diario-guiado"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<GuidedJournal />} />
}
