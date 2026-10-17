import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CalorieCalculator } from "@/components/tools/calorie-calculator/calorie-calculator"

const section = "cuerpo"
const toolSlug = "calculadora-calorias"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo calcula la calculadora de calorías?",
    answer:
      "Usa la fórmula de Mifflin-St Jeor para estimar tu metabolismo basal según peso, estatura, edad y sexo, y luego lo multiplica por un factor de actividad física para obtener tu gasto energético diario (TDEE).",
  },
  {
    question: "¿Qué significa «bajar grasa» y «subir» en la calculadora?",
    answer:
      "Según tu objetivo aplica un déficit moderado del 20% (unas 500 kcal menos al día, orientado a perder ~0.5 kg por semana según la ACSM) o un superávit del 10% para ganar peso de forma controlada. «Mantener» usa tu gasto diario tal cual.",
  },
  {
    question: "¿Por qué el déficit no baja de mi metabolismo basal?",
    answer:
      "Porque comer por debajo de tu metabolismo basal no es sostenible ni recomendable. La calculadora usa como suelo tu gasto basal, así que el plan propuesto nunca baja de ese mínimo.",
  },
  {
    question: "¿Cuánto peso puedo bajar a la semana?",
    answer:
      "Con el déficit moderado del 20% (unas 500 kcal al día) apuntas a unos 0.5 kg por semana, el ritmo que recomienda la ACSM. Bajar más rápido normalmente cuesta músculo y se recupera: mejor lento y sostenido.",
  },
  {
    question: "¿Esta calculadora reemplaza a un nutricionista?",
    answer:
      "No, es una estimación educativa. Tus necesidades reales dependen de tu composición corporal, historial y salud. La báscula y la guía profesional mandan sobre cualquier número.",
  },
  {
    question: "¿Dónde quedan mis datos?",
    answer:
      "En tu navegador, bajo la clave holentia:calculadora-calorias:draft:v1. No se envían a ningún servidor y puedes borrarlos con «Borrar mis datos».",
  },
]

export default function CalculadoraCaloriasPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <CalorieCalculator />
    </ToolPageShell>
  )
}
