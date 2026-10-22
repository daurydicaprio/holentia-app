import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { SeveranceCalculator } from "@/components/tools/severance-calculator/severance-calculator"

const section = "finanzas"
const toolSlug = "calculadora-prestaciones-laborales"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cuánto me corresponde de prestaciones si me despiden en República Dominicana?",
    answer:
      "Si te despiden sin causa justificada —o el empleador termina el contrato sin darte preaviso efectivo— te corresponden cuatro partidas: preaviso (art. 76), auxilio de cesantía (art. 80), vacaciones no disfrutadas (arts. 177/180) y la parte proporcional del salario de Navidad (art. 219). Tu empleador debe pagarte dentro de los 10 días siguientes a la salida. Si renunciaste sin causa justificada, o el despido tuvo causa justificada probada, solo aplican los derechos adquiridos: vacaciones, Navidad y, si la empresa tuvo beneficios, la bonificación legal. Si la renuncia es por una causa imputable al empleador y se declara justificada (arts. 97/101), se trata como despido injustificado; la calculadora no lo distingue.",
  },
  {
    question: "¿Cómo se calcula el auxilio de cesantía?",
    answer:
      "Con la escala del art. 80: 6 días de salario si tienes de 3 meses a menos de 6; 13 días de 6 meses a menos de 1 año; 21 días por cada año de servicio de 1 a menos de 5 años; y 23 días por cada año desde los 5. La fracción de año mayor de tres meses se paga conforme a los dos primeros tramos: 6 días (de 3 a menos de 6 meses) o 13 días (de 6 meses a completar el año). Ejemplo: 2 años y 4 meses → 2 × 21 + 6 = 48 días de salario.",
  },
  {
    question: "¿Cuántos días de preaviso me tocan?",
    answer:
      "Depende de la antigüedad (art. 76): 7 días de 3 a 6 meses; 14 días si pasas de 6 meses y no llegas al año; y 28 días desde el año. Esa cantidad —el «preaviso sustitutivo»— se paga en efectivo cuando el empleador no te avisa con antelación. Si cumpliste el aviso trabajando, ese renglón no se paga aparte y solo recibes la cesantía.",
  },
  {
    question: "¿Cómo se calculan las vacaciones y el salario de Navidad?",
    answer:
      "Vacaciones: antes de completar el primer año se usa la escala del art. 180 (6 días desde los 5 meses y un día más por cada mes, hasta 12); después, 14 días por año de 1 a menos de 5 años y 18 desde los 5. La calculadora asume que no disfrutaste el último período. Navidad: la duodécima parte de tu salario por los meses trabajados en el año (art. 219), exenta de ISR y TSS. La calculadora no aplica el tope de cinco salarios mínimos; si tu sueldo es alto, confírmalo con el Ministerio de Trabajo.",
  },
  {
    question: "¿Por qué el salario diario se divide entre 23.83 y no entre 30?",
    answer:
      "Para pagar días de salario (preaviso, cesantía y vacaciones) se usa el salario diario equivalente a los días laborables del mes, el criterio del Ministerio de Trabajo: salario mensual ÷ 23.83. Por eso un «día de salario» de prestaciones vale más que dividir el sueldo entre 30.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tu salario, tus fechas y el motivo de la salida se guardan solo en tu navegador (localStorage), bajo la clave holentia:calculadora-prestaciones-laborales:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con el botón «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraPrestacionesLaboralesPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <SeveranceCalculator />
    </ToolPageShell>
  )
}
