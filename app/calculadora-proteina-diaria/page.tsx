import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { ProteinCalculator } from "@/components/tools/protein-calculator/protein-calculator"

const section = "cuerpo"
const toolSlug = "calculadora-proteina-diaria"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cuánta proteína necesito al día?",
    answer:
      "Depende de tu peso y tu actividad: la base para un adulto sedentario es 0,8 g por kilo (RDA); con ejercicio moderado o entrenamiento de fuerza, 1,2–1,6 g/kg; desde los 60 años, 1,0–1,2 g/kg para cuidar el músculo; y en déficit calórico, 1,6–2,2 g/kg para conservarlo. Esta calculadora aplica esos rangos a tu peso y te los reparte por comida.",
  },
  {
    question: "¿Cuánta proteína necesito para ganar músculo?",
    answer:
      "Con 1,2–1,6 g/kg suele ser suficiente si repartes la proteína en 3–4 comidas (20–40 g por comida) y cubres tus calorías. Los rangos altos que se leen por ahí —hasta 2,0 g/kg o más— son para deportistas avanzados o fisiculturismo, no para la mayoría. Comer más proteína de la que necesitas no agrega músculo por sí solo: lo que manda es entrenar fuerza, comer suficiente y descansar.",
  },
  {
    question: "¿Es malo comer mucha proteína?",
    answer:
      "En personas sanas no hay evidencia de daño renal por dietas altas en proteína y no existe un límite superior establecido. Con enfermedad renal, embarazo, lactancia o alguna condición médica, conviene consultar antes de subirla. Para la mayoría, pasar de 2 g/kg no aporta beneficio extra.",
  },
  {
    question: "¿Importa repartirla en varias comidas?",
    answer:
      "El total del día es lo que más importa. Para estimular la síntesis de proteína muscular, la evidencia apunta a 20–40 g por comida repartidos en 3–4 comidas (ISSN 2017). Esta calculadora te muestra el rango por comida según cuántas hagas.",
  },
  {
    question: "¿Necesito batidos o suplementos de proteína?",
    answer:
      "No son obligatorios: pollo, huevos, pescado, lácteos, legumbres y frutos secos cubren la meta sin problema. Un batido puede ser práctico si te cuesta llegar o después de entrenar, pero la comida primero.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Tu peso, unidad, perfil y número de comidas se guardan solo en tu navegador (localStorage), bajo la clave holentia:calculadora-proteina-diaria:draft:v1, para que no tengas que reescribirlos. Puedes borrarlos con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraProteinaDiariaPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <ProteinCalculator />
    </ToolPageShell>
  )
}
