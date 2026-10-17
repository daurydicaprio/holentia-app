import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { CertificateCalculator } from "@/components/tools/certificate-calculator/certificate-calculator"

const section = "finanzas"
const toolSlug = "calculadora-certificado-financiero"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es un certificado financiero?",
    answer:
      "Es un depósito a plazo fijo: prestas tu dinero al banco por un tiempo pactado a una tasa fija y, al vencer, recuperas tu monto más los intereses. En República Dominicana también se le llama certificado de depósito o depósito a plazo.",
  },
  {
    question: "¿Cómo se calculan los intereses del certificado?",
    answer:
      "Con interés simple sobre el monto pactado: monto × tasa anual × tiempo. Si eliges interés al vencimiento, recibes todo al final; si eliges interés mensual, te pagan cada mes (con la misma retención del 10% en cada pago). Si renuevas sumando los intereses, el próximo plazo rinde sobre el nuevo monto: para ese efecto compuesto usa la calculadora de interés compuesto.",
  },
  {
    question: "¿Qué tasa y qué plazo pongo?",
    answer:
      "La tasa y el plazo los fija tu banco según el monto y la entidad: como referencia, en 2026 se han visto tasas entre 7% y 11% anual. Los plazos típicos van de 30 a 910 días o de 2 a 60 meses.",
  },
  {
    question: "¿Cuánto me retienen de impuestos?",
    answer:
      "La retención del ISR es 10% sobre los intereses ganados, según la Norma General 07-2019 de la DGII. Sobre el monto depositado no hay retención: por eso tu ganancia neta es el interés bruto menos ese 10%.",
  },
  {
    question: "¿Puedo retirar el dinero antes del vencimiento?",
    answer:
      "Depende de las condiciones de tu banco. Lo habitual es que la cancelación anticipada tenga una penalidad o pague una tasa menor, así que confírmalo antes de firmar. Esta calculadora estima el escenario al vencimiento.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. El monto, la tasa, el plazo y la modalidad se guardan solo en tu navegador (localStorage), bajo la clave holentia:calculadora-certificado-financiero:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con el botón «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraCertificadoFinancieroPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <CertificateCalculator />
    </ToolPageShell>
  )
}
