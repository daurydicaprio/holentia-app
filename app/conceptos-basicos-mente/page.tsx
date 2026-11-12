import { notFound } from "next/navigation"
import { findToolCard, sectionGlossaryJsonLd, toolMetadata, type FaqItem } from "@/lib/seo"
import JsonLd from "@/components/tool-seo/json-ld"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import SectionConcepts from "@/components/tools/section-concepts/section-concepts"
import { SECTION_GLOSSARY } from "@/lib/section-glossary"

const section = "mente"
const toolSlug = "conceptos-basicos-mente"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const definedTermSetJsonLd = sectionGlossaryJsonLd(section)

const faq: FaqItem[] = [
  {
    question: "¿Qué son los conceptos básicos de mente?",
    answer:
      "Son siete palabras que aparecen en los tests y ejercicios de esta sección: ansiedad, estrés, respiración 4-7-8, atención plena, rumiación, higiene del sueño y hábito. Sirven para nombrar lo que sientes con más precisión, no para diagnosticarte.",
  },
  {
    question: "¿Estos conceptos o los tests me diagnostican?",
    answer:
      "No. Los tests son herramientas de orientación y los conceptos son educativos; un diagnóstico requiere una evaluación profesional. Si un resultado te preocupa, úsalo como punto de partida para hablar con alguien.",
  },
  {
    question: "¿Por dónde empiezo si estoy ansioso?",
    answer:
      "Puedes probar una respiración guiada de pocos minutos y, si quieres una referencia, hacer el test GAD-7. Si la ansiedad te limita a diario o aparecen pensamientos de hacerte daño, busca ayuda profesional o a una persona de confianza ahora.",
  },
  {
    question: "¿La atención plena es dejar la mente en blanco?",
    answer:
      "No. Es notar lo que pasa —el cuerpo, los sonidos, los pensamientos— y volver al momento presente sin pelearte con lo que aparece. La práctica es ese regreso, no la ausencia de distracciones.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. La búsqueda de esta página ocurre en tu navegador y no se envía nada. Las herramientas que guardan entradas, hábitos o resultados lo hacen en localStorage, bajo claves holentia:*.",
  },
]

export default function ConceptosBasicosMentePage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      {definedTermSetJsonLd && <JsonLd data={definedTermSetJsonLd} />}
      <SectionConcepts section={section} content={SECTION_GLOSSARY[section]} />
    </ToolPageShell>
  )
}
