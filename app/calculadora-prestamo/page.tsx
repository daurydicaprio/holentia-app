import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { LoanCalculator } from "@/components/tools/loan-calculator/loan-calculator"

const section = "finanzas"
const toolSlug = "calculadora-prestamo"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué calcula la calculadora de préstamos?",
    answer:
      "La cuota mensual de un préstamo con interés (sistema francés: cuota fija), el interés total que pagarás y una tabla de amortización mes a mes con saldo inicial, interés, capital y saldo restante.",
  },
  {
    question: "¿Cómo se calcula la cuota mensual?",
    answer:
      "Se aplica la fórmula de amortización francesa: se convierte la tasa anual a mensual, y con el monto, la tasa y el plazo en meses se obtiene una cuota fija. Si la tasa es 0%, la cuota es simplemente monto dividido entre el número de meses.",
  },
  {
    question: "¿Qué supuestos usa la simulación?",
    answer:
      "Los resultados son aproximados: se consideran meses de 30 días y años de 360, sin período de gracia (el primer vencimiento es a 30 días) y sin seguros. En préstamos hipotecarios, los seguros de vida y de propiedad aumentarían la cuota real.",
  },
  {
    question: "¿Puedo comparar diferentes escenarios?",
    answer:
      "Sí, puedes guardar hasta 3 simulaciones (por ejemplo, diferentes montos o plazos) y verlas en paralelo para decidir cuál opción te conviene más.",
  },
  {
    question: "¿Mis datos se envían a algún servidor?",
    answer:
      "No. La simulación y tus escenarios guardados viven solo en tu navegador (localStorage), con claves como holentia:calculadora-prestamo:simulations:v1. Puedes borrarlos con el botón «Borrar mis datos».",
  },
]

export default function CalculadoraPrestamoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <LoanCalculator />
    </ToolPageShell>
  )
}
