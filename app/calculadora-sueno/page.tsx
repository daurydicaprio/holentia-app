import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { SleepCalculator } from "@/components/tools/sleep-calculator/sleep-calculator"

const section = "mente"
const toolSlug = "calculadora-sueno"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo calcula la hora de dormir?",
    answer:
      "Suma los ciclos de sueño de unos 90 minutos cada uno (4, 5 o 6 por noche) más 15 minutos de margen para quedarte dormido/a. Desde tu hora de levantarte resta ese total y te da las horas ideales para acostarte, y en el modo inverso hace lo mismo desde tu hora de acostarte.",
  },
  {
    question: "¿Cuántas horas debo dormir?",
    answer:
      "Para adultos se recomiendan 7–9 horas (National Sleep Foundation). Los 5 ciclos (7 h 30 min) son un buen punto de partida; si te sientes con energía con 4 ciclos (6 h), puede bastarte, y si no, sube a 6 ciclos (9 h).",
  },
  {
    question: "¿Por qué importa despertar al final de un ciclo?",
    answer:
      "El sueño se organiza en ciclos de fases (ligero, profundo y REM). Si suena la alarma a mitad de un ciclo, sobre todo en sueño profundo, te levantas atontado/a; al terminar el ciclo, el cuerpo está más cerca del sueño ligero y despertar cuesta menos.",
  },
  {
    question: "¿Y si tardo más de 15 minutos en dormirme?",
    answer:
      "Ajusta: acuéstate 15–30 minutos antes de la hora sugerida o usa el modo «me acuesto a las» con tu hora real para ver a qué hora te conviene despertar. Si tardas más de 30 minutos muchas noches, vale la pena hablarlo con un médico.",
  },
  {
    question: "¿Sirve si me despierto de madrugada o trabajo de noche?",
    answer:
      "La calculadora asume sueño continuo. Si despiertas de madrugada, prueba a acostarte un ciclo antes; para turnos rotativos o de noche la guía se complica y conviene consultar con un especialista en sueño.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Solo se guardan tu modo y tus horas en el almacenamiento local de tu navegador, bajo la clave holentia:calculadora-sueno:draft:v1, para que no tengas que escribirlas de nuevo. Puedes borrarlas con «Borrar mis datos» o desde el Centro de Ayuda.",
  },
]

export default function CalculadoraSuenoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <SleepCalculator />
    </ToolPageShell>
  )
}
