import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { DeepQuestions } from "@/components/tools/deep-questions/deep-questions"

const section = "relaciones"
const toolSlug = "preguntas-profundas"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué son las preguntas profundas?",
    answer:
      "Preguntas abiertas que invitan a contar algo real: recuerdos, miedos, sueños y formas de ver la vida. Sirven para conocer mejor a alguien o para que te conozcas tú, más allá de la conversación de todos los días.",
  },
  {
    question: "¿Cómo las uso en pareja?",
    answer:
      "Busquen un momento tranquilo, sin celulares, y túrnense: uno responde sin interrupciones y el otro escucha de verdad. Empiecen por la categoría «Pareja» y dejen que una pregunta lleve naturalmente a la siguiente.",
  },
  {
    question: "¿Sirven para familia y amigos?",
    answer:
      "Sí: usa la categoría «Familia y amistad» en una sobremesa, una llamada larga o un viaje. Funcionan mejor en grupos pequeños (2–4 personas) donde todos alcanzan a responder sin que nadie se quede fuera.",
  },
  {
    question: "¿Puedo usarlas para conocerme yo?",
    answer:
      "Claro. La categoría «Para conocerte tú» está pensada para pensar o escribir sin testigos. Si una pregunta te acompaña días, anótala en el diario guiado y profundiza con calma.",
  },
  {
    question: "¿Son preguntas de terapia?",
    answer:
      "No. Son conversaciones para acercarse, no terapia ni evaluación. Si una pregunta abre algo doloroso o de fondo, llevarlo con un profesional puede ayudarte mucho.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Solo se guarda tu categoría preferida en el almacenamiento local de tu navegador (clave holentia:preguntas-profundas:draft:v1). Las preguntas se generan en tu dispositivo y nada se envía a servidores. Puedes borrar todo con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function PreguntasProfundasPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <DeepQuestions />
    </ToolPageShell>
  )
}
