import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { BudgetSimulator } from "@/components/tools/budget-simulator/budget-simulator"

const section = "finanzas"
const toolSlug = "crear-presupuesto-personal"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo creo un presupuesto personal con esta herramienta?",
    answer:
      "Agrega tus ingresos mensuales y tus gastos (fijos y variables) en las tablas. La herramienta calcula totales, el porcentaje de cada concepto, tu balance de ahorro, proyecciones a 6 y 12 meses y una alerta si tus gastos superan tus ingresos.",
  },
  {
    question: "¿Qué es la regla 50/30/20?",
    answer:
      "Es una guía simple para repartir tu ingreso: 50% necesidades (vivienda, comida, servicios), 30% deseos y 20% ahorro o pago de deudas. La herramienta la muestra como referencia para orientar tu presupuesto, no como una regla rígida.",
  },
  {
    question: "¿Qué son los gastos hormiga?",
    answer:
      "Son gastos pequeños y frecuentes (cafés, snacks, suscripciones) que parecen pocos por separado pero suman mucho al mes. La herramienta destaca tus mayores categorías de gasto para que detectes esos fugas de dinero.",
  },
  {
    question: "¿Se guarda mi presupuesto? ¿Dónde?",
    answer:
      "Sí, se guarda automáticamente como borrador en el almacenamiento local de tu navegador (clave holentia:crear-presupuesto-personal:draft:v1). Nada viaja a un servidor y puedes borrarlo en cualquier momento con «Borrar mis datos».",
  },
]

export default function CrearPresupuestoPersonalPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <BudgetSimulator />
    </ToolPageShell>
  )
}
