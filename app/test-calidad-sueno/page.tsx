import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { SleepQualityTest } from "@/components/tools/sleep-quality-test/sleep-quality-test"

const section = "mente"
const toolSlug = "test-calidad-sueno"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué mide el test de calidad del sueño?",
    answer:
      "Evalúa cómo duermes en las últimas dos semanas: cuántas horas duermes, cuánto tardas en dormirte, si despiertas de madrugada y por qué, si vuelves a dormirte, cómo te sientes al despertar y qué hábitos (cafeína, pantallas, horarios) te acompañan. También pregunta por ronquidos y somnolencia diurna para detectar señales que merecen consulta.",
  },
  {
    question: "¿Cómo se calcula la puntuación?",
    answer:
      "Son 11 preguntas con respuestas de 0 a 3 puntos; el total (0–33) se normaliza a una escala de 0 a 100, donde más alto es mejor. Las bandas son: 80–100 buen descanso, 60–79 a mejorar, 40–59 descanso frágil y menos de 40 calidad baja. Es una orientación educativa, no un diagnóstico.",
  },
  {
    question: "¿Es normal despertarme de madrugada?",
    answer:
      "Despertar brevemente entre ciclos es normal; el problema aparece cuando cuesta más de 30 minutos volver a dormir, pasa 3 o más noches por semana o afecta tu día. Las causas más comunes son ir al baño, ruido, calor, estrés, dolor y el alcohol. El test te da consejos según la causa que elijas.",
  },
  {
    question: "¿Cuántas horas debo dormir para descansar?",
    answer:
      "Para la mayoría de adultos se recomiendan 7–9 horas (National Sleep Foundation y AASM). Dormir menos de 6 horas de forma sostenida se asocia con peor ánimo, atención y salud metabólica. La regularidad importa casi tanto como la cantidad: acostarte y levantarte a la misma hora, fin de semana incluido, fortalece el reloj biológico.",
  },
  {
    question: "¿El test puede detectar apnea o insomnio?",
    answer:
      "No. Es una herramienta de orientación inspirada en cuestionarios de calidad del sueño (PSQI, ISI) y en guías de higiene del sueño, pero no sustituye una evaluación médica. Si roncas fuerte, alguien notó pausas al respirar o tienes mucho sueño durante el día, coméntalo con un médico: son señales compatibles con apnea del sueño.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tus respuestas y tu resultado se guardan solo en el almacenamiento local de tu navegador, bajo la clave holentia:test-calidad-sueno:draft:v1, para que puedas continuar o ver tu último test. Puedes borrarlos con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function TestCalidadSuenoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <SleepQualityTest />
    </ToolPageShell>
  )
}
