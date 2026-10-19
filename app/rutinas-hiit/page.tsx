import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { HiitRoutines } from "@/components/tools/hiit-routines/hiit-routines"

const section = "cuerpo"
const toolSlug = "rutinas-hiit"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué es una rutina HIIT y para quién es?",
    answer:
      "HIIT significa entrenamiento en intervalos de alta intensidad: alternas esfuerzos cortos y exigentes con descansos. Esta herramienta crea una sesión de 10 a 25 min con calentamiento, circuito y vuelta a la calma. Está pensada para adultos sanos; si estás empezando, usa nivel principiante, 10-15 min y bajo impacto. Consulta antes si tienes lesiones, embarazo, hipertensión o una condición cardiovascular.",
  },
  {
    question: "¿Cómo se calcula la duración y los intervalos?",
    answer:
      "La duración incluye 3 min de calentamiento, el circuito y 2 min de vuelta a la calma. Cada ronda tiene 5 ejercicios y dura 5 min: en cada minuto hay un bloque de trabajo y otro de descanso. Por eso 10 min = 1 ronda, 15 = 2, 20 = 3 y 25 = 4. El nivel cambia el reparto: 30/30 s, 40/20 s o 45/15 s.",
  },
  {
    question: "¿Puedo hacerlo en casa sin equipo?",
    answer:
      "Sí. Todos los ejercicios usan el peso corporal y no necesitan equipamiento; solo un espacio para moverte y, si quieres, una silla estable o una pared como apoyo. El modo bajo impacto sustituye saltos y gestos intensos por versiones laterales, en silla o con rodillas apoyadas. No hay vídeos ni conexión: el temporizador te guía con texto.",
  },
  {
    question: "¿Cuántos días por semana y cómo progreso?",
    answer:
      "Empieza con 2 sesiones semanales no consecutivas y 24-48 h de descanso entre ellas. Puedes hacer 10-15 min las primeras semanas y subir a 20-25 o al siguiente nivel cuando termines con técnica estable y sin dolor. No es necesario entrenar HIIT todos los días; combínalo con caminar y fuerza dos días por semana.",
  },
  {
    question: "¿Qué hago si me falta el aire o siento dolor?",
    answer:
      "Baja el ritmo o detente. Durante el trabajo deberías poder decir una frase corta; si no puedes, el esfuerzo es demasiado alto. Para de inmediato si sientes dolor, mareo, opresión en el pecho o falta de aire anormal, y busca atención médica si no mejora. El dolor muscular leve del día siguiente es distinto de un dolor agudo durante el ejercicio.",
  },
  {
    question: "¿Dónde se guardan mis datos?",
    answer:
      "Solo guardamos tus preferencias (nivel, enfoque, duración y modo bajo impacto) en el almacenamiento local de tu navegador, bajo la clave holentia:rutinas-hiit:draft:v1. No guardamos un historial de entrenamientos, no hay cuentas y nada se envía a servidores. Puedes borrar las preferencias con «Restablecer» o con «Borrar mis datos».",
  },
]

export default function RutinasHiitPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <HiitRoutines />
    </ToolPageShell>
  )
}
