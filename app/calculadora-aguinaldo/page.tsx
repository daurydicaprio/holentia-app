import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { AguinaldoCalculator } from "@/components/tools/aguinaldo-calculator/aguinaldo-calculator"

const section = "finanzas"
const toolSlug = "calculadora-aguinaldo"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es el aguinaldo y cuándo lo pagan?",
    answer:
      "Es el salario de Navidad: la duodécima parte (1/12) del salario ordinario que devengaste durante el año, según los arts. 219–222 del Código de Trabajo. El empleador debe pagarlo a más tardar el 20 de diciembre.",
  },
  {
    question: "¿Cómo se calcula si no trabajé todo el año?",
    answer:
      "El aguinaldo se paga proporcional: divide los salarios ordinarios de los meses trabajados entre 12. Si trabajaste 6 meses, por ejemplo, te corresponde medio sueldo mensual. Usa el selector de meses de la calculadora para ajustarlo.",
  },
  {
    question: "¿El aguinaldo paga ISR?",
    answer:
      "No. El salario de Navidad está exento del Impuesto Sobre la Renta, y la Ley 30-26 (junio de 2026) confirmó que la exención aplica completo, aunque el aguinaldo supere los cinco salarios mínimos.",
  },
  {
    question: "¿Me descuentan AFP y ARS del doble sueldo?",
    answer:
      "No. El salario de Navidad no forma parte del salario cotizable de la TSS, así que no se descuenta el 2.87% de AFP ni el 3.04% de ARS. Recibes el monto completo.",
  },
  {
    question: "¿Se incluyen horas extras, comisiones o bonificaciones?",
    answer:
      "Para el cálculo legal solo cuenta el salario ordinario: quedan fuera las horas extras y las bonificaciones. Si tu pago es variable (por ejemplo, comisiones), usa tu promedio mensual ordinario, o suma los salarios ordinarios del año y divídelos entre 12.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tu salario y los meses trabajados se guardan solo en tu navegador (localStorage), bajo la clave holentia:calculadora-aguinaldo:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con el botón «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraAguinaldoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <AguinaldoCalculator />
    </ToolPageShell>
  )
}
