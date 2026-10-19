import {
  BookOpen,
  Brain,
  Droplets,
  Dumbbell,
  Footprints,
  Heart,
  Moon,
  PenLine,
  Salad,
  Target,
  type LucideIcon,
} from "lucide-react"
import type { HabitIconId } from "./habit-utils"

export const HABIT_ICONS: { id: HabitIconId; label: string; Icon: LucideIcon }[] = [
  { id: "target", label: "Meta", Icon: Target },
  { id: "droplets", label: "Agua", Icon: Droplets },
  { id: "footprints", label: "Caminar", Icon: Footprints },
  { id: "book", label: "Leer", Icon: BookOpen },
  { id: "brain", label: "Meditar", Icon: Brain },
  { id: "dumbbell", label: "Ejercicio", Icon: Dumbbell },
  { id: "salad", label: "Comida", Icon: Salad },
  { id: "moon", label: "Dormir", Icon: Moon },
  { id: "pen", label: "Escribir", Icon: PenLine },
  { id: "heart", label: "Cuidado", Icon: Heart },
]

export function HabitGlyph({ icon, className }: { icon: HabitIconId; className?: string }) {
  const Icon = HABIT_ICONS.find((option) => option.id === icon)?.Icon ?? Target
  return <Icon className={className} aria-hidden="true" />
}
