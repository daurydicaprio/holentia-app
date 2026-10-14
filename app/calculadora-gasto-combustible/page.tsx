import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { FuelExpenseCalculator } from "@/components/tools/fuel-expense-calculator/fuel-expense-calculator"

const section = "finanzas"
const toolSlug = "calculadora-gasto-combustible"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo calcula esta herramienta mi gasto de combustible?",
    answer:
      "Multiplica la distancia por viaje por tus viajes diarios para obtener los kilómetros del día, los suma según los días que conduces por semana y divide entre el consumo de tu vehículo (km/L) para estimar los litros. Al multiplicarlos por el precio por litro obtiene el gasto por día, semana, mes y año.",
  },
  {
    question: "¿Qué consumo (km/L) tiene mi vehículo?",
    answer:
      "Como referencia: un carro pequeño ronda los 15–17 km/L, un sedán 12–14 km/L y una SUV o jeepeta 8–10 km/L, dependiendo del modelo, el año y el tipo de conducción. La calculadora precarga un valor por categoría, pero puedes editarlo con el consumo que marque tu tablero.",
  },
  {
    question: "¿Por qué el precio por defecto es RD$ 358?",
    answer:
      "Es solo un punto de partida de referencia: el precio de la gasolina cambia seguido y varía por tipo de combustible y estación. Revisa el precio del día en tu estación y edítalo; el cálculo se actualiza al instante.",
  },
  {
    question: "¿Qué son los presets de trayecto corto, medio y largo?",
    answer:
      "Son atajos de distancia por viaje (5 km, 12 km y 25 km) para que no tengues que calcular el odométrico: selecciona el que más se parezca a tu trayecto habitual y afina después si lo deseas.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Todo se procesa en tu navegador y se guarda localmente como borrador bajo la clave holentia:calculadora-gasto-combustible:draft:v1. No hay envíos a servidores y puedes borrarlo con «Borrar mis datos» o desde la página de Ayuda.",
  },
]

export default function CalculadoraGastoCombustiblePage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <FuelExpenseCalculator />
    </ToolPageShell>
  )
}
