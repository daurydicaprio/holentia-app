import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { SavingsPlanner } from "@/components/tools/savings-planner/savings-planner"

const section = "finanzas"
const toolSlug = "planificador-ahorros"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo calcula el planificador cuánto tardaré?",
    answer:
      "Aplica interés compuesto mensual (tasa anual ÷ 12) a tu ahorro inicial y a tus aportes, y despeja cuántos meses hacen falta para llegar a la meta. Te mostramos el total de aportes, lo que aporta el rendimiento y la fecha estimada de llegada.",
  },
  {
    question: "¿Qué rendimiento anual pongo?",
    answer:
      "El que esperas ganar. Si guardas el dinero sin invertirlo, deja 0%. Como referencia en RD, en 2026 los certificados a plazo pagan alrededor de 7%–11% anual bruto (con la retención del 10% queda algo menos). Puedes probar varios escenarios y quedarte con el más realista.",
  },
  {
    question: "¿Por qué importa invertir mientras ahorro?",
    answer:
      "Porque tus intereses también generan intereses: con rendimiento, una parte de la meta la paga el tiempo y no tu bolsillo. Sin invertir, en cambio, la inflación juega en contra: el dinero guardado pierde poder de compra con los años.",
  },
  {
    question: "¿Y si no puedo aportar tanto cada mes?",
    answer:
      "Usa el modo «¿Cuánto aporto?»: fija una fecha realista y el planificador te dice el aporte mensual necesario. También puedes alargar el plazo o ajustar la meta. La constancia vale más que un monto perfecto.",
  },
  {
    question: "¿Sirve para planificar una compra?",
    answer:
      "Sí: pon el precio de lo que quieres comprar como meta. Verás cuándo podrás pagarlo y cuánto del precio lo pagan los intereses si tu ahorro rinde mientras esperas; así esperar e invertir cuesta menos esfuerzo que comprar de una vez.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tu meta, aportes, plazo y tasa se guardan solo en tu navegador (localStorage), bajo la clave holentia:planificador-ahorros:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con el botón «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function PlanificadorAhorrosPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <SavingsPlanner />
    </ToolPageShell>
  )
}
