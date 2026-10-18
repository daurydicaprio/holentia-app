"use client"

import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export interface RelatedTool {
  href: string
  icon: LucideIcon
  title: string
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
    icon: "text-cuerpo-darkest dark:text-cuerpo-light",
    arrow: "text-cuerpo-darkest dark:text-cuerpo-light",
    hover: "hover:text-cuerpo-darkest dark:hover:text-cuerpo-light",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-400",
    arrow: "text-sky-700 dark:text-sky-300",
    hover: "hover:text-sky-700 dark:hover:text-sky-300",
  },
} as const

/**
 * Cierre sutil de herramienta: 2–3 enlaces contextuales, no una rejilla de tarjetas.
 * La tarjeta entera no es el target; cada enlace mantiene un área táctil propia.
 */
export default function RelatedTools({ title, intro, items, note, accent = "cuerpo" }: RelatedToolsProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const palette = ACCENTS[accent]

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</p>
          {intro ? <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{intro}</p> : null}
        </div>
        <nav aria-label={title} className="flex flex-wrap gap-x-5 gap-y-1 sm:justify-end">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                data-interactive="true"
                onClick={() => triggerHapticFeedback("medium")}
                className={`group inline-flex items-center gap-1.5 py-2.5 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300 ${palette.hover}`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${palette.icon}`} />
                {item.title}
                <ArrowRight
                  className={`h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${palette.arrow}`}
                />
              </Link>
            )
          })}
        </nav>
      </div>
      {note ? (
        <p className="mt-2 border-t border-gray-200 pt-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {note}
        </p>
      ) : null}
    </div>
  )
}
