import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CouplesJournal } from "@/components/tools/couples-journal/couples-journal"

const section = "relaciones"
const toolSlug = "diario-parejas"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo funciona el diario para parejas?",
    answer:
      "Cada día aparece una pregunta distinta. Tú y tu pareja escriben sus respuestas en el mismo dispositivo, la guardan y al final del día queda registrada en el historial. La racha cuenta los días seguidos con entrada.",
  },
  {
    question: "¿Cómo lo usamos si estamos a distancia?",
    answer:
      "El diario vive en tu dispositivo y no se sincroniza entre teléfonos. Si están lejos, úsenlo como ritual de llamada: lean la pregunta juntos, respondan en voz alta y una de las dos personas guarda las dos respuestas.",
  },
  {
    question: "¿Qué pasa si me salto un día?",
    answer:
      "Nada: el diario no regaña. Cada entrada pertenece a su día y la racha simplemente se reinicia cuando hay un día sin entrada. Lo importante es la constancia posible, no la perfecta.",
  },
  {
    question: "¿Puedo escribir solo/a?",
    answer:
      "Sí. El campo de tu pareja es opcional: puedes responder por ti y dejar tu reflexión guardada. Si prefieres un diario personal con más secciones (gratitud, logros, mañana), prueba el diario guiado.",
  },
  {
    question: "¿Dónde se guardan las entradas?",
    answer:
      "Solo en tu navegador, en el almacenamiento local: las entradas en holentia:diario-parejas:entries:v1 y el borrador de hoy en holentia:diario-parejas:draft:v1. Nada viaja a servidores, y puedes borrarlo con «Borrar todo» o desde el Centro de Ayuda.",
  },
  {
    question: "¿Es terapia de pareja?",
    answer:
      "No. Es un ritual de conexión y conversación. Si atraviesan un conflicto serio o dolor que se repite, un profesional de terapia de pareja puede acompañarlos de verdad.",
  },
]

export default function DiarioParejasPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <CouplesJournal />
    </ToolPageShell>
  )
}
