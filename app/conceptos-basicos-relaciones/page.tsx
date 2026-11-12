import { notFound } from "next/navigation"
import { findToolCard, sectionGlossaryJsonLd, toolMetadata, type FaqItem } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import SectionConcepts from "@/components/tools/section-concepts/section-concepts"
import { SECTION_GLOSSARY } from "@/lib/section-glossary"

const section = "relaciones"
const toolSlug = "conceptos-basicos-relaciones"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const definedTermSetJsonLd = sectionGlossaryJsonLd(section)

const faq: FaqItem[] = [
  {
    question: "¿Qué son los conceptos básicos de relaciones?",
    answer:
      "Son siete ideas que aparecen en los tests y diarios de esta sección: comunicación asertiva, límites, escucha activa, apego, lenguajes del amor, conflicto y reciprocidad. Cada una tiene un ejemplo para que puedas llevarla a una conversación real.",
  },
  {
    question: "¿Sirven si no tengo pareja?",
    answer:
      "Sí. Los mismos conceptos aplican a familia, amistades, trabajo y a la relación contigo mismo; la comunicación, los límites y el conflicto aparecen en cualquier vínculo.",
  },
  {
    question: "¿El test de apego me etiqueta para siempre?",
    answer:
      "No. El apego describe patrones que pueden cambiar con conciencia y práctica; el resultado es una foto del momento, no una sentencia.",
  },
  {
    question: "¿Qué hago si hay violencia o control?",
    answer:
      "No lo trates como un problema de comunicación. Prioriza tu seguridad, busca apoyo profesional y, si hay riesgo inmediato, contacta a los servicios de emergencia de tu país.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. La búsqueda de esta página ocurre en tu navegador y no se envía nada. Las herramientas que guardan respuestas o entradas lo hacen en localStorage, bajo claves holentia:*.",
  },
]

export default function ConceptosBasicosRelacionesPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      {definedTermSetJsonLd && <JsonLd data={definedTermSetJsonLd} />}
      <SectionConcepts section={section} content={SECTION_GLOSSARY[section]} />
    </ToolPageShell>
  )
}
