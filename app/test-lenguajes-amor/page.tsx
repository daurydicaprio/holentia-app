import { notFound } from "next/navigation"
import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"
import { LoveLanguagesTest } from "@/components/tools/love-languages-test/love-languages-test"

export default function TestLenguajesAmorPage() {
  const section = "relaciones"
  const toolSlug = "test-lenguajes-amor"

  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  if (!toolData) notFound()

  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} toolContent={<LoveLanguagesTest />} />
}
