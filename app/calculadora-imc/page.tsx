import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { BmiCalculator } from "@/components/tools/bmi-calculator/bmi-calculator"

const section = "cuerpo"
const toolSlug = "calculadora-imc"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es el IMC y cómo se calcula?",
    answer:
      "El índice de masa corporal cruza tu peso con tu estatura: IMC = peso (kg) ÷ estatura² (m). Con 70 kg y 1.70 m: 70 ÷ 2.89 = 24.2. Es la referencia que usa la OMS para clasificar el peso en adultos, y esta calculadora lo hace al instante.",
  },
  {
    question: "¿Cuál es el IMC normal o saludable?",
    answer:
      "En adultos, el rango saludable va de 18.5 a 24.9. Menos de 18.5 se considera bajo peso, de 25 a 29.9 sobrepeso y 30 o más obesidad. Son rangos poblacionales: tu caso individual lo matiza un profesional.",
  },
  {
    question: "¿El IMC sirve para todos?",
    answer:
      "No. No distingue músculo de grasa (un atleta puede salir «sobrepeso» sin grasa de más), en embarazo no aplica, en niños y adolescentes se usan percentiles por edad y en adultos mayores se interpreta con cuidado. Es una señal, no un diagnóstico.",
  },
  {
    question: "¿Cuál es mi peso ideal?",
    answer:
      "Más que un único número existe un rango: el peso que te da un IMC entre 18.5 y 24.9 según tu estatura (la calculadora te lo muestra). Dentro de ese rango, lo que más importa es cómo te sientes, tu cintura y tu tendencia en el tiempo.",
  },
  {
    question: "¿Qué otras medidas importan además del IMC?",
    answer:
      "La cintura: la OMS señala riesgo aumentado desde 88 cm en mujeres y 102 cm en hombres, incluso con un IMC normal. También importan la distribución de la grasa, la condición física y los hábitos: comida real, movimiento y descanso.",
  },
  {
    question: "¿Se guardan mis datos?",
    answer:
      "Solo en tu navegador: peso, estatura y unidad quedan como borrador en holentia:calculadora-imc:draft:v1 para que no los reescribas. Nada se envía a servidores y puedes borrarlo con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraImcPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <BmiCalculator />
    </ToolPageShell>
  )
}
