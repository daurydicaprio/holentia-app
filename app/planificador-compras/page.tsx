import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { PurchasePlanner } from "@/components/tools/purchase-planner/purchase-planner"

const section = "finanzas"
const toolSlug = "planificador-compras"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo decide el planificador si conviene esperar?",
    answer:
      "Compara dos escenarios con el mismo dinero: comprar hoy (el dinero se va y no rinde) o esperar los meses que elijas manteniendo el precio invertido. Te muestra cuánto ganas por la espera; casi siempre esperar con el dinero invertido gana, siempre que no necesites el producto de inmediato y el precio no suba más rápido que tu rendimiento.",
  },
  {
    question: "¿Qué rendimiento anual pongo?",
    answer:
      "El que esperas ganar mientras esperas. Como referencia en RD, en 2026 los certificados a plazo pagan alrededor de 7%–11% anual bruto; con la retención del 10% queda algo menos (un certificado de 9% bruto rinde ≈ 8.1% neto). Si tu dinero no va a rendir, esta comparación no aplica: esperar solo no gana nada.",
  },
  {
    question: "¿Y si no tengo todo el dinero todavía?",
    answer:
      "Entonces tu caso es una meta de ahorro: usa el planificador de ahorros para ver cuándo llegas y cuánto aportar al mes. Este planificador de compras asume que puedes pagar hoy y compara el costo de no esperar.",
  },
  {
    question: "¿Y si el precio cambia con el tiempo?",
    answer:
      "El cálculo asume que el precio se mantiene. Si esperas porque habrá descuento (Black Friday, temporada), tu ganancia real es mayor; si el producto sube por inflación o tipo de cambio, compara: esperar vale la pena mientras el rendimiento supere la subida del precio.",
  },
  {
    question: "¿Sirve para cualquier compra?",
    answer:
      "Funciona para compras discrecionales que pueden esperar: un celular, un televisor, un viaje, un mueble. No aplica a necesidades urgentes —si se dañó la nevera, no hay nada que planificar— ni a productos cuyo precio sube más rápido de lo que rinde tu dinero.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. El precio, los meses y la tasa se guardan solo en tu navegador (localStorage), bajo la clave holentia:planificador-compras:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con el botón «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function PlanificadorComprasPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <PurchasePlanner />
    </ToolPageShell>
  )
}
