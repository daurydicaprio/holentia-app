import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { AntExpensesTracker } from "@/components/tools/ant-expenses-tracker/ant-expenses-tracker"

const section = "finanzas"
const toolSlug = "tracker-gastos-hormiga"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es un gasto hormiga?",
    answer:
      "Son esos gastos pequeños que haces casi sin pensarlo: el café, el snack, el delivery, la recarga. Por separado parecen insignificantes, pero al repetirse todos los días suman mucho al año. Este tracker te los muestra con números para que decidas con información.",
  },
  {
    question: "¿Cómo se calcula la proyección al año?",
    answer:
      "Multiplicamos el monto de cada gasto por su frecuencia anualizada: diario ×365, 3–4 veces por semana ×182, semanal ×52, quincenal ×24 y mensual ×12. De ese total salen también los promedios por mes, por semana y por día.",
  },
  {
    question: "¿Qué significa «3–4 veces por semana»?",
    answer:
      "Tomamos el punto medio: 3.5 veces por semana × 52 semanas = 182 veces al año. Si tu caso tira más hacia 3 o hacia 4, ajusta el monto o registra el gasto con otra frecuencia para acercarte más a tu realidad.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Todo se guarda en tu propio navegador (localStorage), bajo la clave holentia:tracker-gastos-hormiga:entries:v1. No hay servidores de por medio y puedes borrar todo en cualquier momento con el botón «Borrar todo» o con «Borrar mis datos».",
  },
  {
    question: "¿Puedo editar o borrar un gasto que ya anoté?",
    answer:
      "Sí. Usa el lápiz para cargarlo de nuevo en el formulario y cambiar monto o frecuencia, o la papelera para eliminarlo. Cada cambio se guarda automáticamente en tu navegador.",
  },
  {
    question: "¿Esto reemplaza un presupuesto completo?",
    answer:
      "No, lo complementa. El tracker se enfoca en los gastos pequeños y repetidos del día a día; para ver el panorama completo de ingresos, gastos y categorías usa la calculadora de presupuesto personal.",
  },
]

export default function TrackerGastosHormigaPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <AntExpensesTracker />
    </ToolPageShell>
  )
}
