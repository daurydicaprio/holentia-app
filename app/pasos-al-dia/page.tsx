import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { StepsPlan } from "@/components/tools/steps-plan/steps-plan"

const section = "cuerpo"
const toolSlug = "pasos-al-dia"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cuántos pasos al día necesito de verdad?",
    answer:
      "La ciencia no marca 10,000: los grandes estudios muestran que el mayor beneficio aparece entre 6,000 y 8,000 pasos. Con 40 minutos de caminata diaria ya das el primer paso; 60 minutos es un gran objetivo y 70-100 es el nivel ideal para quien quiera más.",
  },
  {
    question: "¿Qué es la regla 5-10-20?",
    answer:
      "Es una regla práctica: hay tareas que se resuelven en 5 minutos, otras piden 10 y las que transforman suelen pedir 20. Aplicada a caminar: suma bloques de minutos durante el día (mañana, tarde y noche) hasta completar tu total. Algunas cosas necesitan mínimo 5 minutos; la caminata pide 40 o más.",
  },
  {
    question: "¿Cómo convierten minutos a pasos?",
    answer:
      "A paso moderado se camina a unos 100 pasos por minuto (así lo miden los estudios de cadencia). Por eso 40 min ≈ 4,000 pasos, 60 ≈ 6,000 y 70-100 ≈ 7,000-10,000. Tu cadencia puede variar: es una estimación útil, no una medida exacta.",
  },
  {
    question: "¿Y el mito de los 10,000 pasos?",
    answer:
      "Nació en 1965 con un podómetro japonés llamado Manpo-kei («medidor de 10,000 pasos»): fue una campaña de mercadeo, no un estudio científico. No es un número obligatorio; si te sientes bien alcanzándolo, es un buen techo, pero 7,000 ya dan la mayor parte del beneficio.",
  },
  {
    question: "¿Basta con caminar?",
    answer:
      "No: caminar es la base más fácil de sostener, pero la OMS recomienda además 150-300 minutos semanales de actividad moderada a intensa y fuerza 2 días por semana. Alimentación y descanso también cuentan: los pasos son el primer paso, no el único.",
  },
  {
    question: "¿Dónde se guardan mis datos?",
    answer:
      "Solo en tu navegador: tu objetivo y tu plan se guardan en holentia:pasos-al-dia:draft:v1, y tus pasos por día en holentia:pasos-al-dia:entries:v1. Nada se envía a servidores, y puedes borrarlo con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function PasosAlDiaPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <StepsPlan />
    </ToolPageShell>
  )
}
