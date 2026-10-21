"use client"

import Link from "next/link"
import GuideCover from "@/components/guides/guide-cover"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import type { GuideSummary } from "@/types/guide"

interface GuideCardProps {
  guide: GuideSummary
}

/** Tarjeta del archivo «Últimas guías»: foto, título y extracto, sin caja. */
export default function GuideCard({ guide }: GuideCardProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const titleId = `archive-guide-${guide.slug}`

  return (
    <Link
      href={`/guias/${guide.slug}`}
      data-interactive="true"
      onClick={() => triggerHapticFeedback("medium")}
      aria-labelledby={titleId}
      className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 focus-visible:ring-offset-background dark:focus-visible:ring-white"
    >
      <GuideCover
        category={guide.category}
        cover={guide.cover}
        image={guide.image}
        imageAlt={guide.imageAlt}
        variant="grid"
        sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
        className="aspect-[3/2] w-full"
      />

      <div className="pt-4">
        <h3
          id={titleId}
          className="text-balance text-base font-bold leading-snug text-gray-900 group-hover:underline group-hover:decoration-gray-300 group-hover:decoration-1 group-hover:underline-offset-4 sm:text-lg dark:text-gray-100 dark:group-hover:decoration-gray-600"
        >
          {guide.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {guide.excerpt}
        </p>
      </div>
    </Link>
  )
}
