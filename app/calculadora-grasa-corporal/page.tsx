import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { BodyFatCalculator } from "@/components/tools/body-fat-calculator/body-fat-calculator"

const section = "cuerpo"
const toolSlug = "calculadora-grasa-corporal"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo se calcula el porcentaje de grasa corporal?",
    answer:
      "Con el método US Navy: la fórmula combina altura, cuello y cintura (y cadera en mujeres) para estimar la densidad corporal. Después convierte esa densidad en porcentaje de grasa con la ecuación de Siri. Todo se calcula en tu navegador.",
  },
  {
    question: "¿Qué tan exacta es la calculadora?",
    answer:
      "Es una estimación, no una medición de laboratorio: puede desviarse varios puntos frente a DEXA y depende de cómo te midas. No está pensada para el embarazo, la niñez, deportistas de élite ni para diagnosticar. Úsala para seguir tendencias.",
  },
  {
    question: "¿Cómo mido la cintura, el cuello y la cadera?",
    answer:
      "Cinta horizontal y sin apretar. Cuello: justo debajo de la nuez. Cintura: en hombres, a la altura del ombligo; en mujeres, en el punto más estrecho del torso. Cadera: en la parte más ancha de los glúteos. Repite dos veces y usa el promedio.",
  },
  {
    question: "¿Cuál es un porcentaje de grasa saludable?",
    answer:
      "Depende del sexo y del contexto. Como referencia del American Council on Exercise (ACE): hombres 14–17% fitness y 18–24% promedio; mujeres 21–24% fitness y 25–31% promedio. Los rangos atléticos son más bajos y la grasa esencial no es una meta para todos.",
  },
  {
    question: "¿Grasa corporal o IMC?",
    answer:
      "Miden cosas distintas. El IMC cruza peso y altura y no distingue músculo de grasa; la grasa corporal estima la composición. Ninguno es un diagnóstico: usa ambos como referencias y mira la tendencia en el tiempo.",
  },
  {
    question: "¿Se guardan mis datos?",
    answer:
      "Solo en tu navegador: sexo, medidas y unidad quedan como borrador en holentia:calculadora-grasa-corporal:draft:v1 para que no los reescribas. Nada se envía a servidores y puedes borrarlo con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraGrasaCorporalPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <BodyFatCalculator />
    </ToolPageShell>
  )
}
