"use client"

import Link from "next/link"
import { ArrowRight, Clock3 } from "lucide-react"
import GuideCover from "@/components/guides/guide-cover"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { formatGuideDate, guideCategoryLabel } from "@/lib/guide-format"
import {
  guideCategoryDot,
  guideCategoryHoverTitle,
  guideCategoryText,
} from "@/lib/guide-ui"
import type { GuideSummary } from "@/types/guide"

interface GuideFeaturedCardProps {
  guide: GuideSummary
}

/** Guía principal del índice: portada grande y contenido editorial debajo. */
export default function GuideFeaturedCard({ guide }: GuideFeaturedCardProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const category = guide.category
  const categoryText = guideCategoryText[category] ?? guideCategoryText.general
  const categoryDot = guideCategoryDot[category] ?? guideCategoryDot.general
  const hoverTitle = guideCategoryHoverTitle[category] ?? guideCategoryHoverTitle.general

  return (
    <Link
      href={`/guias/${guide.slug}`}
      data-interactive="true"
      onClick={() => triggerHapticFeedback("medium")}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
    >
      <GuideCover
        category={category}
        cover={guide.cover}
        variant="featured"
        className="aspect-[16/10] w-full rounded-2xl sm:aspect-[16/9]"
      />

      <div className="pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${categoryText}`}
          >
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${categoryDot}`} />
            {guideCategoryLabel(category)}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
            Guía destacada
          </span>
        </div>

        <h2
          className={`mt-3 text-balance text-2xl font-bold leading-tight tracking-tight text-gray-900 transition-colors sm:text-3xl dark:text-gray-100 ${hoverTitle}`}
        >
          {guide.title}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-gray-600 dark:text-gray-300">
          {guide.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">{guide.author}</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>
            Actualizada el <time dateTime={guide.updatedAt}>{formatGuideDate(guide.updatedAt)}</time>
          </span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {guide.readingTime} min de lectura
          </span>
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Leer guía
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  )
}
