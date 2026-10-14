import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { LoveLanguagesTest } from "@/components/tools/love-languages-test/love-languages-test"

const section = "relaciones"
const toolSlug = "test-lenguajes-amor"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function TestLenguajesAmorPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <LoveLanguagesTest />
    </ToolPageShell>
  )
}
