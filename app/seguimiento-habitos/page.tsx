import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { HabitTracker } from "@/components/tools/habit-tracker/habit-tracker"

const section = "mente"
const toolSlug = "seguimiento-habitos"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Cómo funciona el seguimiento de hábitos?",
    answer:
      "Creas hábitos con un nombre, un icono y una meta de días por semana. Cada día marcas lo que cumpliste, ves tu progreso semanal y la racha de días seguidos. Todo se guarda en tu navegador.",
  },
  {
    question: "¿Cómo se calcula la racha?",
    answer:
      "Contamos los días consecutivos con una marca. Si hoy todavía no has marcado el hábito, la racha se cuenta desde ayer para no romperse antes de que termine el día. Si pasas un día sin marcar, empieza de nuevo.",
  },
  {
    question: "¿Qué pasa si no cumplo la meta semanal?",
    answer:
      "La meta es una guía, no una obligación. Puedes marcar cualquier día hasta hoy y la app te muestra cuánto llevas; si una semana no llegas, no se borra el historial. Lo importante es volver al día siguiente.",
  },
  {
    question: "¿Puedo editar o eliminar un hábito?",
    answer:
      "Sí. El lápiz carga el hábito en el formulario para cambiar nombre, icono o meta. La papelera pide confirmación y borra también su historial; el resto de hábitos no se tocan.",
  },
  {
    question: "¿Guardan ustedes mis datos?",
    answer:
      "No. Todo se guarda en el almacenamiento local de tu navegador, bajo la clave holentia:seguimiento-habitos:entries:v1. No hay servidores ni cuentas; puedes borrar todo con «Borrar todo» o desde «Borrar mis datos».",
  },
  {
    question: "¿Se sincroniza entre dispositivos?",
    answer:
      "No. Al ser local-first, cada navegador tiene sus propios datos. Si cambias de dispositivo o borras los datos del navegador, el historial no se recupera; no hay copia en la nube.",
  },
]

export default function SeguimientoHabitosPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <HabitTracker />
    </ToolPageShell>
  )
}
