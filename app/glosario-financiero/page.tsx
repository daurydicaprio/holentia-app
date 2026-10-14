import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, SITE_NAME, SITE_URL } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { GLOSSARY_TERMS } from "@/components/tools/glossary/glossary-terms"
import { Glossary } from "@/components/tools/glossary/glossary"

const section = "finanzas"
const toolSlug = "glosario-financiero"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

/** Datos estructurados del glosario: lista de términos para buscadores e IAs (GEO). */
const definedTermSetJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: `Glosario Financiero | ${SITE_NAME}`,
  url: `${SITE_URL}/${toolSlug}`,
  inLanguage: "es",
  hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
  })),
}

export default function GlosarioFinancieroPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <JsonLd data={definedTermSetJsonLd} />
      <Glossary />
    </ToolPageShell>
  )
}
