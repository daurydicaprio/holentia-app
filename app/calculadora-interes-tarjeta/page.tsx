import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CardInterestCalculator } from "@/components/tools/card-interest/card-interest-calculator"

const section = "finanzas"
const toolSlug = "calculadora-interes-tarjeta"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué mide la calculadora de interés de tarjeta?",
    answer:
      "Cuánto te cuesta realmente financiar el saldo de tu tarjeta: simula mes a mes cómo el interés mensual se suma al saldo y en cuántos meses lo liquidas con el pago que indicas, además del costo total de esa financiación.",
  },
  {
    question: "¿Cómo se calcula el interés mensual?",
    answer:
      "Se multiplica tu saldo por la tasa de interés mensual de la tarjeta (la que aparece en tu estado de cuenta, usualmente la TNA dividida en 12). Ese interés se suma al saldo si no pagas el total, y así empieza el efecto de interés sobre interés.",
  },
  {
    question: "¿Qué significa que la deuda «nunca se liquida»?",
    answer:
      "Si tu pago mensual es menor o igual al interés que se genera cada mes, el saldo no baja: seguirás pagando para siempre sin avanzar. La herramienta detecta ese caso y te avisa para que aumentes el pago o reduzcas el saldo.",
  },
  {
    question: "¿Qué pago necesito para liquidar más rápido?",
    answer:
      "Regla práctica: paga más que el interés mensual, cuanto mayor sea el pago por encima de ese interés, menos meses tardarás y menos intereses totales pagarás. Prueba distintos pagos en la calculadora para comparar.",
  },
  {
    question: "¿Se envía el número de mi tarjeta o mis datos?",
    answer:
      "No. La calculadora solo usa monto, tasa y pago; no pide ni transmite datos de tarjeta. Todo se procesa en tu navegador y puedes borrarlo con «Borrar mis datos».",
  },
]

export default function CalculadoraInteresTarjetaPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <CardInterestCalculator />
    </ToolPageShell>
  )
}
