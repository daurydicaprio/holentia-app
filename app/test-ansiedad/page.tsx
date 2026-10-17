import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { AnxietyTest } from "@/components/tools/anxiety-test/anxiety-test"

const section = "mente"
const toolSlug = "test-ansiedad"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué mide el test de ansiedad GAD-7?",
    answer:
      "Mide con qué frecuencia, en las últimas dos semanas, te han molestado siete situaciones típicas de la ansiedad (nervios, preocupación excesiva, dificultad para relajarte…). Cada respuesta suma de 0 a 3 y el total va de 0 a 21.",
  },
  {
    question: "¿El test es un diagnóstico?",
    answer:
      "No. El GAD-7 es un cuestionario de cribado validado (Spitzer et al., 2006): orienta y ayuda a poner palabras a lo que sientes, pero solo un profesional de salud puede diagnosticar y tratar la ansiedad.",
  },
  {
    question: "¿Qué significa mi puntaje?",
    answer:
      "0–4 ansiedad mínima; 5–9 leve (buen momento para hábitos); 10–14 moderada (conviene valorarlo con un profesional); 15–21 grave (busca apoyo profesional pronto). El resultado te da recomendaciones para tu banda.",
  },
  {
    question: "¿Cada cuánto puedo repetirlo?",
    answer:
      "Cuando quieras. Como el cuestionario pregunta por las últimas 2 semanas, repetirlo cada 2 semanas sirve para ver si mejora o empeora; también es válido tras un día difícil para poner en perspectiva.",
  },
  {
    question: "¿Y si me sale un puntaje alto?",
    answer:
      "Habla con un profesional de salud mental: la ansiedad tiene tratamiento y pedir ayuda es el paso más efectivo. Mientras tanto, la respiración guiada y el diario ayudan como apoyo. Si estás en crisis, llama al 911 o acude a emergencias.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tus respuestas y tu puntaje se guardan solo en el almacenamiento local de tu navegador, bajo la clave holentia:test-ansiedad:draft:v1, para que puedas continuar o ver tu último resultado. Puedes borrarlos con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function TestAnsiedadPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <AnxietyTest />
    </ToolPageShell>
  )
}
