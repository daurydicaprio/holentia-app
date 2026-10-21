"use client"

import Link from "next/link"
import { ArrowUpRight, Clock3 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { formatGuideDate, guideCategoryLabel } from "@/lib/guide-format"
import type { GuideCategory, GuideSummary } from "@/types/guide"

const categoryStyles: Record<
  GuideCategory,
  { dot: string; text: string; hoverBorder: string }
> = {
  mente: {
    dot: "bg-mente",
    text: "text-mente-dark dark:text-mente-light",
    hoverBorder: "hover:border-mente dark:hover:border-mente-light",
  },
  relaciones: {
    dot: "bg-relaciones",
    text: "text-relaciones dark:text-relaciones-light",
    hoverBorder: "hover:border-relaciones dark:hover:border-relaciones-light",
  },
  cuerpo: {
    dot: "bg-cuerpo",
    text: "text-cuerpo-darkest dark:text-cuerpo-light",
    hoverBorder: "hover:border-cuerpo-dark dark:hover:border-cuerpo-light",
  },
  finanzas: {
    dot: "bg-finanzas",
    text: "text-finanzas-dark dark:text-finanzas-light",
    hoverBorder: "hover:border-finanzas dark:hover:border-finanzas-light",
  },
  general: {
    dot: "bg-gray-400",
    text: "text-gray-600 dark:text-gray-300",
    hoverBorder: "hover:border-gray-400 dark:hover:border-gray-500",
  },
}

interface GuideCardProps {
  guide: GuideSummary
}

export default function GuideCard({ guide }: GuideCardProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const palette = categoryStyles[guide.category] ?? categoryStyles.general

  return (
    <Link
      href={`/guias/${guide.slug}`}
      data-interactive="true"
      onClick={() => triggerHapticFeedback("medium")}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 pt-7 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900 ${palette.hoverBorder}`}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${palette.dot}`} />

      <div className="flex items-start justify-between gap-4">
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] ${palette.text}`}
        >
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
          {guideCategoryLabel(guide.category)}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-200"
        />
      </div>

      <h2 className="mt-4 text-balance text-xl font-semibold leading-snug text-gray-900 transition-colors dark:text-gray-100">
        {guide.title}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {guide.excerpt}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span>Actualizada el {formatGuideDate(guide.updatedAt)}</span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {guide.readingTime} min de lectura
        </span>
      </div>
    </Link>
  )
}
