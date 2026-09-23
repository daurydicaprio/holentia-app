import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSectionColor(section: string | null | undefined) {
  if (!section) return null

  switch (section) {
    case "mente":
      return "mente"
    case "cuerpo":
      return "cuerpo"
    case "finanzas":
      return "finanzas"
    case "relaciones":
      return "relaciones"
    default:
      return null
  }
}
