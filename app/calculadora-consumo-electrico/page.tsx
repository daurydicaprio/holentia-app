import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { ElectricityCalculator } from "@/components/tools/electricity-calculator/electricity-calculator"

const section = "finanzas"
const toolSlug = "calculadora-consumo-electrico"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo estima esta calculadora mi factura de luz?",
    answer:
      "Replica la tarifa residencial dominicana: un cargo fijo más tramos de consumo (0–200 kWh, 201–300 kWh y 301+ kWh) con el precio por kWh de cada tramo, y aplica un subsidio estimado sobre el total para acercarse al monto que suele venir en la factura.",
  },
  {
    question: "¿Qué datos necesito para usarla?",
    answer:
      "Solo necesitas los kWh de tu consumo mensual, tal como aparecen en tu factura de EDESUR, EDESUR Este, EDEEste o la distribuidora de tu zona. El resto (tramos y subsidio) está precargado.",
  },
  {
    question: "¿El subsidio calculado es exacto?",
    answer:
      "No, es una aproximación. El factor de subsidio se calibró contra facturas reales (por ejemplo, 397, 438 y 445 kWh con subsidios de ~45%). El monto real depende de tu patrón de consumo y del subsidio vigente, así que puede variar ±100 pesos o más.",
  },
  {
    question: "¿Qué pasa si consumo más de 700 kWh?",
    answer:
      "Por encima de 700 kWh el subsidio deja de aplicarse por tramos y la tasa más alta (tramo 3) se aplica al total del consumo, como en la factura real. Verás ese efecto reflejado en el resultado.",
  },
  {
    question: "¿Se guardan mis datos?",
    answer:
      "Solo en tu navegador, como borrador bajo la clave holentia:calculadora-consumo-electrico:draft:v1. No hay envío a servidores y puedes borrarlo con «Borrar mis datos».",
  },
]

export default function CalculadoraConsumoElectricoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <ElectricityCalculator />
    </ToolPageShell>
  )
}
