import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { MealPlanner } from "@/components/tools/meal-planner/meal-planner"

const section = "cuerpo"
const toolSlug = "planificador-comidas"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo funciona el planificador de comidas?",
    answer:
      "Elige una semana y toca cualquier celda de desayuno, almuerzo o cena. Puedes usar una de las ideas con ingredientes ya cargados o escribir tu propia comida. La cuadrícula tiene 7 días × 3 comidas; las celdas vacías se pueden rellenar con ideas al azar sin tocar las que ya hayas planificado. Todo se organiza en tu navegador, sin cuenta y sin enviar datos.",
  },
  {
    question: "¿Puedo escribir mis propias comidas?",
    answer:
      "Sí. En el editor de cada celda escribe el nombre y, si quieres, los ingredientes separados por comas y una nota. Las comidas personalizadas conviven con las ideas sugeridas y también aportan ingredientes a la lista de compras. Puedes editar o quitar cualquier comida desde la misma celda.",
  },
  {
    question: "¿Cómo se genera la lista de compras?",
    answer:
      "La lista reúne los ingredientes de todas las comidas planificadas en la semana y elimina duplicados. Es una guía de qué comprar, no una lista de cantidades: ajusta las porciones según tu despensa, el número de personas y lo que ya tengas en casa. Las casillas te ayudan a marcar lo que ya tienes o compraste.",
  },
  {
    question: "¿Puedo planificar varias semanas?",
    answer:
      "Sí. Usa las flechas para moverte a la semana anterior o siguiente y el botón «Hoy» para volver a la actual. Cada semana guarda su propio plan y su propia lista de compras marcada, así puedes preparar la próxima sin perder la de esta. No hay límite de semanas ni historial de nutrición.",
  },
  {
    question: "¿Calcula calorías, porciones o alergias?",
    answer:
      "No. Es un organizador semanal, no una calculadora nutricional ni una pauta médica. No calcula calorías, macros, porciones ni alertas de alérgenos, y las ideas son ejemplos generales. Revisa las etiquetas, adapta las recetas a tus necesidades y consulta a un profesional si sigues una dieta terapéutica o tienes alergias.",
  },
  {
    question: "¿Dónde se guardan mis datos?",
    answer:
      "Tu plan y las casillas de la lista de compras se guardan solo en el almacenamiento local de tu navegador, bajo la clave holentia:planificador-comidas:entries:v1. No hay cuentas, no se envía nada a servidores y no se guarda un historial nutricional. Puedes vaciar una semana o usar «Borrar mis datos» para eliminar todo.",
  },
]

export default function PlanificadorComidasPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <MealPlanner />
    </ToolPageShell>
  )
}
