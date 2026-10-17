import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { NetSalaryCalculator } from "@/components/tools/net-salary-calculator/net-salary-calculator"

const section = "finanzas"
const toolSlug = "calculadora-sueldo-neto"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cuál es la diferencia entre sueldo bruto y sueldo neto?",
    answer:
      "El bruto es lo que acuerdas con tu empleador antes de descuentos; el neto es lo que te depositan cada mes después de restar la seguridad social (SFS y AFP), la retención de ISR y cualquier descuento fijo como cooperativa o préstamos.",
  },
  {
    question: "¿Qué me descuenta la TSS de mi salario en 2026?",
    answer:
      "El aporte del empleado es 5.91%: 3.04% del SFS (Seguro Familiar de Salud) y 2.87% de la AFP (pensiones). Se calcula sobre el salario cotizable con topes: hasta RD$232,230 al mes para el SFS y RD$464,460 para la AFP (Resolución 01-2025, vigente desde febrero de 2026). Por encima de esos montos, el descuento se congela.",
  },
  {
    question: "¿Cómo se calcula la retención de ISR?",
    answer:
      "Tu empleador proyecta tu renta anual: (salario bruto − aportes TSS) × 12. Sobre esa base aplica la escala de asalariados: exento hasta RD$416,220.01; 15% hasta RD$624,329.00; RD$31,216 más 20% hasta RD$867,123.00; y RD$79,776 más 25% de ahí en adelante. El impuesto anual se divide entre 12 para la retención mensual.",
  },
  {
    question: "¿Por qué mi quincena no es exactamente la mitad del sueldo neto?",
    answer:
      "La cifra «por quincena» de esta calculadora es una equivalencia (neto mensual ÷ 2). En la práctica, tu empleador retiene el ISR por período de pago y puede redondear, y algunos descuentos fijos se aplican por quincena: al sumar el mes debería darte el mismo neto mensual.",
  },
  {
    question: "¿Incluye bonificaciones, comisiones u horas extras?",
    answer:
      "No: estima tu salario fijo ordinario. Los pagos variables también están sujetos a ISR y pueden subirte de tramo, así que si tu ingreso varía, usa un promedio conservador. El salario de navidad queda fuera: es exento y tiene su propia calculadora de aguinaldo.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tu salario y tus otros descuentos se guardan solo en tu navegador (localStorage), bajo la clave holentia:calculadora-sueldo-neto:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con el botón «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraSueldoNetoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <NetSalaryCalculator />
    </ToolPageShell>
  )
}
