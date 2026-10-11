import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CardCutoffCalculator } from "@/components/tools/card-cutoff/card-cutoff-calculator"

const section = "finanzas"
const toolSlug = "tarjeta-corte-vencimiento"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué calcula la herramienta de corte y vencimiento?",
    answer:
      "A partir de la fecha de tu compra y del día de corte de tu tarjeta, te muestra en qué ciclo entra la compra, cuándo se corta ese saldo y en qué fecha exacta vence el pago. Así planificas tus compras y evitas sorpresas.",
  },
  {
    question: "¿Qué es el día de corte de una tarjeta?",
    answer:
      "Es la fecha del mes en que la emisora cierra tu ciclo y genera el estado de cuenta. Las compras hechas antes del corte entran en ese estado; las que hagas después entrarán en el siguiente ciclo.",
  },
  {
    question: "¿Qué es el día de pago o vencimiento?",
    answer:
      "Es la fecha límite para pagar el estado de cuenta generado en el corte. Si pagas después, se generan intereses y posibles cargos por mora. La herramienta te muestra esa fecha y un pago sugerido.",
  },
  {
    question: "¿Cómo sé cuál es mi día de corte?",
    answer:
      "Está en tu estado de cuenta o en los términos de tu tarjeta (por ejemplo, «corte el día 15»). Introduce ese día junto a la fecha de la compra y la herramienta hace el resto.",
  },
  {
    question: "¿Dónde se guarda lo que registro?",
    answer:
      "Todo se queda en tu navegador, bajo la clave holentia:tarjeta-corte-vencimiento:draft:v1. No compartimos ni enviamos tus datos, y puedes borrarlos con «Borrar mis datos».",
  },
]

export default function TarjetaCorteVencimientoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <CardCutoffCalculator />
    </ToolPageShell>
  )
}
