"use client"

import Link from "next/link"
import { ArrowUpRight, Clock3 } from "lucide-react"
import GuideCover from "@/components/guides/guide-cover"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { formatGuideDate, guideCategoryLabel } from "@/lib/guide-format"
import {
  guideCategoryDot,
  guideCategoryHoverBorder,
  guideCategoryHoverTitle,
  guideCategoryText,
} from "@/lib/guide-ui"
import type { GuideCategory, GuideSummary } from "@/types/guide"

interface GuideCardProps {
  guide: GuideSummary
}

/** Tarjeta del archivo «Últimas guías»: portada arriba y contenido en una columna. */
export default function GuideCard({ guide }: GuideCardProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const category = guide.category ?? "general"
  const categoryText = guideCategoryText[category] ?? guideCategoryText.general
  const categoryDot = guideCategoryDot[category] ?? guideCategoryDot.general
  const hoverBorder = guideCategoryHoverBorder[category] ?? guideCategoryHoverBorder.general
  const hoverTitle = guideCategoryHoverTitle[category] ?? guideCategoryHoverTitle.general

  return (
    <Link
      href={`/guias/${guide.slug}`}
      data-interactive="true"
      onClick={() => triggerHapticFeedback("medium")}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900 ${hoverBorder}`}
    >
      <GuideCover
        category={category as GuideCategory}
        cover={guide.cover}
        variant="grid"
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${categoryText}`}
          >
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${categoryDot}`} />
            {guideCategoryLabel(category)}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-200"
          />
        </div>

        <h3
          className={`mt-2.5 text-balance text-lg font-semibold leading-snug text-gray-900 transition-colors dark:text-gray-100 ${hoverTitle}`}
        >
          {guide.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {guide.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-3 text-[11px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <span>Actualizada el {formatGuideDate(guide.updatedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" aria-hidden="true" />
            {guide.readingTime} min de lectura
          </span>
        </div>
      </div>
    </Link>
  )
}
