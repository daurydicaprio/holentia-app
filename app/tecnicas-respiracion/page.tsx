import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { BreathingExercises } from "@/components/tools/breathing-exercises/breathing-exercises"

const section = "mente"
const toolSlug = "tecnicas-respiracion"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es la respiración guiada?",
    answer:
      "Es una práctica en la que un círculo se expande y se contrae marcando tu ritmo: tú solo sigues las cuentas (inhala 4, retén 7, exhala 8…). Al alargar la exhalación y bajar el ritmo, el cuerpo sale del modo alerta y entra en calma.",
  },
  {
    question: "¿Cuál técnica elijo: 4-7-8, caja o calma?",
    answer:
      "4-7-8 para dormir o bajar revoluciones; caja 4-4-4-4 (cuatro tiempos iguales) para concentrarte antes de estudiar o trabajar; calma 4-6 si prefieres algo suave y sin retenciones, útil en cualquier momento del día.",
  },
  {
    question: "¿Cuántas rondas hago y cuánto dura?",
    answer:
      "Con 3 a 5 rondas tienes suficiente para notar el efecto (1–3 minutos). Diez rondas equivalen a unos 3–4 minutos: ideal antes de dormir. Más vale practicar un poco cada día que una sesión larga una vez al mes.",
  },
  {
    question: "¿Puedo practicar la respiración en cualquier lugar?",
    answer:
      "Sí, sentado/a o acostado/a y con la espalda recta. Evita las técnicas con retención en el agua o conduciendo; si estás manejando usa calma 4-6 sin retener. Si te marea o sientes presión, acorta los tiempos y vuelve a tu respiración normal.",
  },
  {
    question: "¿Sustituye un tratamiento médico o psicológico?",
    answer:
      "No. La respiración guiada acompaña hábitos de calma, no sustituye terapia ni medicación. Si la ansiedad es intensa, constante o afecta tu vida diaria, habla con un profesional de salud.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Solo se guardan tu técnica y tus rondas preferidas en el almacenamiento local de tu navegador, bajo la clave holentia:tecnicas-respiracion:draft:v1, para que no tengas que elegirlas de nuevo. Puedes borrarlas con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function TecnicasRespiracionPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <BreathingExercises />
    </ToolPageShell>
  )
}
