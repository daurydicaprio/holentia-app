"use client"

import Link from "next/link"
import { Clock3 } from "lucide-react"
import GuideCover from "@/components/guides/guide-cover"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { formatGuideDate, guideCategoryLabel } from "@/lib/guide-format"
import {
  guideCategoryDot,
  guideCategoryHoverTitle,
  guideCategoryText,
} from "@/lib/guide-ui"
import type { GuideSummary } from "@/types/guide"

interface GuideCompactCardProps {
  guide: GuideSummary
}

/** Tarjeta horizontal para la columna de «También te puede interesar». */
export default function GuideCompactCard({ guide }: GuideCompactCardProps) {
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
      className="group flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 sm:gap-4 dark:hover:bg-gray-800/60 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
    >
      <GuideCover
        category={category}
        cover={guide.cover}
        variant="compact"
        className="w-24 shrink-0 self-stretch rounded-lg sm:w-28 lg:w-24"
      />

      <div className="min-w-0 flex-1 py-0.5">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${categoryText}`}
        >
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${categoryDot}`} />
          {guideCategoryLabel(category)}
        </span>
        <h3
          className={`mt-1 line-clamp-2 text-balance text-sm font-semibold leading-snug text-gray-900 transition-colors sm:text-base dark:text-gray-100 ${hoverTitle}`}
        >
          {guide.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
          {guide.excerpt}
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-500 dark:text-gray-400">
          <span>{formatGuideDate(guide.updatedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" aria-hidden="true" />
            {guide.readingTime} min
          </span>
        </p>
      </div>
    </Link>
  )
}
