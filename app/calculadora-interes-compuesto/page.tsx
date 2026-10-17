import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CompoundInterestCalculator } from "@/components/tools/compound-interest/compound-interest-calculator"

const section = "finanzas"
const toolSlug = "calculadora-interes-compuesto"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es el interés compuesto?",
    answer:
      "Es el interés que se genera tanto sobre el dinero inicial como sobre los rendimientos ya ganados. Con el tiempo, ese efecto acelera el crecimiento de tus ahorros: mientras antes empieces y más constante seas con tus aportaciones, mayor será el resultado.",
  },
  {
    question: "¿Cómo usa esta calculadora el interés compuesto?",
    answer:
      "Simula mes a mes (o año a año) tu inversión aplicando la tasa que indiques sobre el saldo acumulado, sumando tu depósito inicial y tus aportaciones periódicas. Puedes elegir aportaciones mensuales o anuales y ver la curva de crecimiento en el gráfico.",
  },
  {
    question: "¿Sirve para calcular el rendimiento de mis inversiones?",
    answer:
      "Sí. Es un simulador de rendimiento: indica cuánto tienes invertido hoy, tus aportaciones y la tasa anual esperada (por ejemplo, la de un depósito a plazo, un fondo o un negocio) y verás cuánto capital tendrías y cuánto de eso son rendimientos ganados. Ajusta también la inflación para verlo en dinero de hoy.",
  },
  {
    question: "¿Qué es la regla de 72?",
    answer:
      "Es una aproximación para saber en cuántos años duplicarás tu dinero: divides 72 entre la tasa de rendimiento anual. Por ejemplo, con un 8% anual, 72 / 8 = 9 años. La calculadora la muestra como referencia rápida en el resumen.",
  },
  {
    question: "¿La calculadora tiene en cuenta la inflación?",
    answer:
      "Sí. Puedes indicar una tasa de inflación anual y verás el balance real ajustado por inflación, además del efecto estimado de la inflación sobre tu dinero. Así comparas el crecimiento nominal con el poder de compra real.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Todo se calcula y se guarda en tu propio navegador (localStorage), bajo claves como holentia:calculadora-interes-compuesto:draft:v1. No hay servidores de por medio y puedes borrar todo con el botón «Borrar mis datos».",
  },
]

export default function CalculadoraInteresCompuestoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <CompoundInterestCalculator />
    </ToolPageShell>
  )
}
