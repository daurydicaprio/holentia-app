import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { LoveLanguagesTest } from "@/components/tools/love-languages-test/love-languages-test"

const section = "relaciones"
const toolSlug = "test-lenguajes-amor"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué son los 5 lenguajes del amor?",
    answer:
      "Son las cinco formas principales en las que las personas suelen dar y recibir cariño: palabras de afirmación, tiempo de calidad, regalos, actos de servicio y contacto físico. Cada persona tiene uno o dos que le significan más.",
  },
  {
    question: "¿Cómo funciona el test?",
    answer:
      "Enfrentas 5 situaciones cotidianas y eliges la opción que más te identifica. Puedes volver atrás para cambiar una respuesta, y al terminar la herramienta cuenta tus elecciones y te muestra tu lenguaje principal y el orden de los demás.",
  },
  {
    question: "¿Para quién es útil este test?",
    answer:
      "Para ti y para tus relaciones cercanas (pareja, familia, amistades). Entender tu lenguaje y el de la otra persona ayuda a evitar malentendidos: a veces el cariño se da, pero no en el idioma que el otro necesita recibirlo.",
  },
  {
    question: "¿Se guarda mi resultado?",
    answer:
      "Sí, pero solo en tu navegador: tus respuestas y tu último resultado se guardan en el almacenamiento local (clave holentia:test-lenguajes-amor:draft:v1) para que puedas continuar más tarde o revisarlo. No se envían a ningún servidor y puedes borrarlos con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
  {
    question: "¿Esto es un test psicológico formal?",
    answer:
      "No, es una herramienta educativa inspirada en el concepto de los lenguajes del amor. No diagnostica ni reemplaza la orientación profesional de pareja.",
  },
  {
    question: "¿Y si mi pareja y yo tenemos lenguajes distintos?",
    answer:
      "Es lo más común: cada uno da cariño en su propio idioma y no siempre en el que el otro necesita. Compartan el resultado (puedes copiarlo con un botón) y hagan el ajuste consciente: si la otra persona necesita tiempo de calidad, una salida sin celulares vale más que un regalo caro.",
  },
]

export default function TestLenguajesAmorPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <LoveLanguagesTest />
    </ToolPageShell>
  )
}
