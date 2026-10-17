import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { ItbisCalculator } from "@/components/tools/itbis-calculator/itbis-calculator"

const section = "finanzas"
const toolSlug = "calculadora-itbis"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es el ITBIS?",
    answer:
      "Es el Impuesto sobre Transferencias de Bienes Industrializados y Servicios: el impuesto al consumo de República Dominicana. La tasa general es 18% y existe una tasa reducida de 16% para productos puntuales como café, azúcar, cacao y chocolate, yogurt, mantequilla y grasas comestibles.",
  },
  {
    question: "¿Cómo agrego el ITBIS a un precio?",
    answer:
      "Multiplica la base por 1.18 (o por 1.16 con la tasa reducida). Ejemplo: RD$10,000 × 1.18 = RD$11,800 de total, con RD$1,800 de ITBIS. Usa el modo «Agregar ITBIS» de la calculadora para verlo al instante.",
  },
  {
    question: "¿Cómo quito el ITBIS de un precio que ya lo incluye?",
    answer:
      "Divide el total entre 1.18 (o 1.16). No multipliques por 0.82: da un resultado menor al correcto. Ejemplo: RD$11,800 ÷ 1.18 = RD$10,000 de base y RD$1,800 de ITBIS. Para eso está el modo «Quitar ITBIS».",
  },
  {
    question: "¿Qué productos pagan el 16% reducido?",
    answer:
      "Según la DGII: yogurt y mantequilla, café, grasas animales o vegetales comestibles, azúcares y cacao y chocolate. El resto de bienes y servicios gravados tributan al 18% general.",
  },
  {
    question: "¿Los precios al público incluyen ITBIS?",
    answer:
      "En el comercio al detalle, sí: el precio que ves normalmente ya incluye el ITBIS. En las facturas, en cambio, la base y el ITBIS se muestran por separado. Con el modo «Quitar ITBIS» puedes comprobar cuánto de ese precio es impuesto.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. El monto, el modo y la tasa se guardan solo en tu navegador (localStorage), bajo la clave holentia:calculadora-itbis:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con el botón «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraItbisPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <ItbisCalculator />
    </ToolPageShell>
  )
}
