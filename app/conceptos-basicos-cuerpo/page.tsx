import { notFound } from "next/navigation"
import { findToolCard, sectionGlossaryJsonLd, toolMetadata, type FaqItem } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import SectionConcepts from "@/components/tools/section-concepts/section-concepts"
import { SECTION_GLOSSARY } from "@/lib/section-glossary"

const section = "cuerpo"
const toolSlug = "conceptos-basicos-cuerpo"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const definedTermSetJsonLd = sectionGlossaryJsonLd(section)

const faq: FaqItem[] = [
  {
    question: "¿Qué son los conceptos básicos de cuerpo?",
    answer:
      "Son siete términos que aparecen cuando hablas de salud, energía y nutrición: IMC, grasa corporal, metabolismo basal, gasto energético total, déficit calórico, proteína e hidratación. Cada uno tiene una definición corta y un ejemplo con números para que leas las calculadoras con más criterio.",
  },
  {
    question: "¿Necesito saber todo esto para usar las calculadoras?",
    answer:
      "No. Puedes usar la calculadora que necesites y consultar el concepto solo cuando aparezca una palabra que no tengas clara. La idea es que el resultado no se quede en un número suelto.",
  },
  {
    question: "¿El IMC o el porcentaje de grasa dicen si estoy sano?",
    answer:
      "No por sí solos. Son referencias que conviene leer junto con tu contextura, tu historia clínica y tus hábitos; no distinguen músculo de grasa ni reemplazan una evaluación profesional.",
  },
  {
    question: "¿Los ejemplos sirven si peso distinto?",
    answer:
      "Los ejemplos son cuentas para que veas cómo funciona la fórmula, no metas personales. Cambia el peso, la estatura o la actividad por tus datos y repite la operación con la calculadora.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Esta página es contenido estático y la búsqueda ocurre en tu navegador: no se envía ni se guarda nada. Las calculadoras que guardan borradores lo hacen en localStorage, bajo claves holentia:*.",
  },
]

export default function ConceptosBasicosCuerpoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      {definedTermSetJsonLd && <JsonLd data={definedTermSetJsonLd} />}
      <SectionConcepts section={section} content={SECTION_GLOSSARY[section]} />
    </ToolPageShell>
  )
}
