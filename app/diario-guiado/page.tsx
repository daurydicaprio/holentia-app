import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { GuidedJournal } from "@/components/tools/guided-journal/guided-journal"

const section = "mente"
const toolSlug = "diario-guiado"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es el diario guiado?",
    answer:
      "Es un espacio de reflexión con preguntas estructuradas que te ayudan a ordenar cómo te sientes, qué te preocupa y qué has aprendido. Escribir con guía suele ser más fácil que partir de una página en blanco.",
  },
  {
    question: "¿Cómo uso el diario?",
    answer:
      "Escribe tu entrada en el formulario, guárdala y vuelve cuando quieras a leerla o editarla. Tus entradas aparecen ordenadas en la lista, y puedes editarlas o borrarlas individualmente.",
  },
  {
    question: "¿Quién puede leer mis entradas?",
    answer:
      "Solo tú. Las entradas se guardan en el almacenamiento local de tu navegador (clave holentia:diario-guiado:entries:v1) y el borrador en curso en holentia:diario-guiado:draft:v1; no se envían a servidores ni se comparten. Los botones de borrar piden confirmación antes de eliminar nada.",
  },
  {
    question: "¿Qué pasa si borro los datos del navegador?",
    answer:
      "Se perderán las entradas guardadas, ya que no existe copia en la nube. Si quieres conservar algún texto, usa el botón «Copiar» de cada entrada o guárdalo en otro lugar.",
  },
  {
    question: "¿Escribir un diario ayuda de verdad?",
    answer:
      "Llevar un diario ayuda a ordenar lo que sientes, detectar patrones y cerrar el día con perspectiva. El beneficio llega con la constancia: con 5–10 minutos al día basta, y la práctica de gratitud suma con las semanas.",
  },
  {
    question: "¿Este diario sustituye terapia psicológica?",
    answer:
      "No. Es una herramienta de autoconocimiento y bienestar emocional. Si atraviesas una crisis o necesitas apoyo profesional, busca ayuda de un especialista.",
  },
]

export default function DiarioGuiadoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <GuidedJournal />
    </ToolPageShell>
  )
}
