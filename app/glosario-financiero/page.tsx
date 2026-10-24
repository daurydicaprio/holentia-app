import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, SITE_NAME, SITE_URL, type FaqItem } from "@/lib/seo"
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

const faq: FaqItem[] = [
  {
    question: "¿Qué es el glosario financiero?",
    answer:
      "Es una colección de términos clave del dinero —ahorro, crédito, intereses, fondos, bolsa y sistema financiero— explicados en lenguaje sencillo con ejemplos concretos. Incluye productos como depósitos a plazo, ETFs y CETES, y está pensado para que entiendas los conceptos que aparecen en las calculadoras y simuladores de la sección de finanzas.",
  },
  {
    question: "¿Por qué conviene entender estos términos?",
    answer:
      "Porque cambian las decisiones: la diferencia entre interés simple y compuesto, o entre tasa nominal y efectiva, altera cuánto pagas o cuánto ganas. Entender el concepto te permite leer bien los resultados de cualquier calculadora y comparar ofertas reales sin dejarte llevar solo por el número grande.",
  },
  {
    question: "¿Qué diferencia hay entre tasa nominal y tasa efectiva?",
    answer:
      "La tasa nominal es la que se anuncia (por ejemplo, mensual o anual) sin considerar cómo se capitaliza; la efectiva incluye ese efecto y refleja el costo o rendimiento real. Al comparar créditos o inversiones, la tasa efectiva es la que conviene mirar.",
  },
  {
    question: "¿Estos términos aplican en República Dominicana?",
    answer:
      "Sí. Los conceptos son universales: lo que cambia de país en país son las siglas, los impuestos o las instituciones (por ejemplo, el BCRD, la Superintendencia de Bancos o los reportes crediticios). Cuando hace falta una moneda de referencia, los ejemplos usan pesos dominicanos (DOP).",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. La búsqueda se hace en tu propio navegador mientras usas la página: no se guarda nada, no hay cuentas ni servidores de por medio. El glosario es contenido estático del sitio y puedes borrar cualquier otro dato de las herramientas con «Borrar mis datos».",
  },
]

export default function GlosarioFinancieroPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <JsonLd data={definedTermSetJsonLd} />
      <Glossary />
    </ToolPageShell>
  )
}
