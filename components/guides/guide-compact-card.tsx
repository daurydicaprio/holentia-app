"use client"

import Link from "next/link"
import GuideCover from "@/components/guides/guide-cover"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { formatGuideDate } from "@/lib/guide-format"
import type { GuideSummary } from "@/types/guide"

interface GuideCompactCardProps {
  guide: GuideSummary
}

/** Fila compacta del bloque superior: texto a la izquierda y foto a la derecha. */
export default function GuideCompactCard({ guide }: GuideCompactCardProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const titleId = `compact-guide-${guide.slug}`

  return (
    <Link
      href={`/guias/${guide.slug}`}
      data-interactive="true"
      onClick={() => triggerHapticFeedback("medium")}
      aria-labelledby={titleId}
      className="group flex items-start gap-4 rounded-xl py-5 first:pt-0 last:pb-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 focus-visible:ring-offset-background dark:focus-visible:ring-white"
    >
      <div className="min-w-0 flex-1">
        <h3
          id={titleId}
          className="text-balance text-base font-bold leading-snug text-gray-900 group-hover:underline group-hover:decoration-gray-300 group-hover:decoration-1 group-hover:underline-offset-4 sm:text-lg dark:text-gray-100 dark:group-hover:decoration-gray-600"
        >
          {guide.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {guide.excerpt}
        </p>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {formatGuideDate(guide.updatedAt)} · {guide.readingTime} min
        </p>
      </div>

      <GuideCover
        category={guide.category}
        cover={guide.cover}
        image={guide.image}
        imageAlt={guide.imageAlt}
        variant="compact"
        sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 112px"
        className="aspect-[6/5] w-28 shrink-0 sm:w-32 lg:w-36"
      />
    </Link>
  )
}
