import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { HydrationCalculator } from "@/components/tools/hydration-calculator/hydration-calculator"

const section = "cuerpo"
const toolSlug = "calculadora-hidratacion"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo calcula la calculadora de hidratación mi agua diaria?",
    answer:
      "Parte de 35 ml por kilo de peso (referencia EFSA/NASEM) y le suma ajustes aditivos según tu nivel de actividad física y el clima. El resultado es tu agua total diaria estimada, con un plan de reparto a lo largo del día.",
  },
  {
    question: "¿Cuál es la diferencia entre agua total y agua a beber?",
    answer:
      "Alrededor del 20% del agua que necesitas la aportan los alimentos sólidos (frutas, sopas, etc.). Por eso la calculadora separa el agua total del agua potable directa, que es la que realmente tienes que beber.",
  },
  {
    question: "¿El café, el té o las infusiones cuentan como agua?",
    answer:
      "Sí, cuentan: la EFSA incluye todas las bebidas en el agua del día. El café y el té hidratan en cantidades normales; las bebidas azucaradas también aportan líquido, pero suman azúcar de más: mejor moderarlas.",
  },
  {
    question: "¿Los ajustes de actividad y clima se multiplican?",
    answer:
      "No. Son ajustes aditivos en mililitros: se suman al base de 35 ml/kg, pero no se multiplican entre sí, tal como recomiendan las guías de referencia.",
  },
  {
    question: "¿Cómo sé si estoy bien hidratado?",
    answer:
      "Una señal sencilla es el color de la orina: amarillo claro suele indicar buena hidratación. La calculadora también muestra señales de contraste para que revises tu consumo durante el día.",
  },
  {
    question: "¿Se guarda mi cálculo?",
    answer:
      "Sí, como borrador en tu navegador (clave holentia:calculadora-hidratacion:draft:v1). Nada sale de tu dispositivo y puedes borrarlo con «Borrar mis datos».",
  },
]

export default function CalculadoraHidratacionPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <HydrationCalculator />
    </ToolPageShell>
  )
}
