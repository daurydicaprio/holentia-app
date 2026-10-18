"use client"

import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export interface RelatedTool {
  href: string
  icon: LucideIcon
  title: string
  text: string
}

interface RelatedToolsProps {
  title: string
  intro?: string
  items: RelatedTool[]
  note?: string
  /** Acento visual: cuerpo (ámbar) por defecto; sky para hidratación. */
  accent?: "cuerpo" | "sky"
}

const ACCENTS = {
  cuerpo: {
    icon: "text-cuerpo-dark dark:text-cuerpo-light",
    arrow: "text-cuerpo-darkest dark:text-cuerpo-light",
    title: "group-hover:text-cuerpo-darkest dark:group-hover:text-cuerpo-lighter",
    border: "hover:border-cuerpo-dark dark:hover:border-cuerpo-light",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-400",
    arrow: "text-sky-700 dark:text-sky-300",
    title: "group-hover:text-sky-700 dark:group-hover:text-sky-300",
    border: "hover:border-sky-500 dark:hover:border-sky-400",
  },
} as const

/**
 * Bloque «Sigue por aquí» de las herramientas de cuerpo.
 * Mantiene el acento de la sección y un target táctil de tarjeta completa.
 */
export default function RelatedTools({ title, intro, items, note, accent = "cuerpo" }: RelatedToolsProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const palette = ACCENTS[accent]

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="mb-1 text-xl font-bold">{title}</h2>
      {intro ? <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{intro}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              data-interactive="true"
              onClick={() => triggerHapticFeedback("medium")}
              className={`group flex flex-col rounded-xl border border-gray-200 p-4 transition-colors hover:bg-black/5 dark:border-gray-700 dark:hover:bg-white/10 ${palette.border}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon className={`h-5 w-5 ${palette.icon}`} />
                <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${palette.arrow}`} />
              </div>
              <span className={`text-sm font-semibold ${palette.title}`}>
                {item.title}
              </span>
              <span className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{item.text}</span>
            </Link>
          )
        })}
      </div>
      {note ? <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{note}</p> : null}
    </div>
  )
}
