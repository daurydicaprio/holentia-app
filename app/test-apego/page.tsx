import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { AttachmentTest } from "@/components/tools/attachment-test/attachment-test"

const section = "relaciones"
const toolSlug = "test-apego"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es el estilo de apego?",
    answer:
      "Es el patrón con el que sueles vincularte con las personas cercanas: cuánta cercanía buscas, cómo reaccionas a la distancia y cómo pides (o evitas) apoyo. La teoría del apego lo describe en cuatro estilos: seguro, ansioso, evitativo y temeroso.",
  },
  {
    question: "¿Cómo funciona el test?",
    answer:
      "Lees 12 afirmaciones y marcas qué tan identificado/a te sientes (nada, poco, bastante o mucho). Cada afirmación suma puntos a uno de los cuatro estilos, y al final ves tu estilo dominante y la distribución completa.",
  },
  {
    question: "¿Mi estilo puede cambiar?",
    answer:
      "Sí. No es una etiqueta fija: los estilos son un continuo y se van moldeando con tus experiencias. Las relaciones seguras, el autoconocimiento y el acompañamiento profesional pueden moverte hacia un apego más seguro.",
  },
  {
    question: "¿Qué hago con mi resultado?",
    answer:
      "Úsalo como espejo, no como sentencia: cada estilo trae consejos concretos. Si te causa sufrimiento o notas que se repite el mismo patrón doloroso, hablar con un psicólogo puede ayudarte mucho.",
  },
  {
    question: "¿Puedo hacérselo a mi pareja?",
    answer:
      "Mejor no etiquetes a otra persona con un test: respóndelo por ti. Luego pueden compartir resultados y entender sus dinámicas (por ejemplo, por qué quien es evitativo necesita espacio y quien es ansioso necesita confirmación).",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tus respuestas y tu resultado se guardan solo en el almacenamiento local de tu navegador, bajo la clave holentia:test-apego:draft:v1, para que puedas continuar o revisarlo. Puedes borrarlos con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function TestApegoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <AttachmentTest />
    </ToolPageShell>
  )
}
