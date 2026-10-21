"use client"

import Link from "next/link"
import GuideCover from "@/components/guides/guide-cover"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { formatGuideDate } from "@/lib/guide-format"
import type { GuideSummary } from "@/types/guide"

interface GuideFeaturedCardProps {
  guide: GuideSummary
}

/** Guía principal del índice: foto grande, título, extracto y metadatos. */
export default function GuideFeaturedCard({ guide }: GuideFeaturedCardProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const titleId = `featured-guide-${guide.slug}`

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
        variant="featured"
        priority
        sizes="(min-width: 1024px) 720px, 100vw"
        className="aspect-[16/9] w-full"
      />

      <div className="pt-6">
        <h2
          id={titleId}
          className="text-balance text-2xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-3xl lg:text-[2.25rem] dark:text-gray-100"
        >
          {guide.title}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-gray-600 sm:text-lg sm:leading-8 dark:text-gray-300">
          {guide.excerpt}
        </p>

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">{guide.author}</span>
          <span aria-hidden="true">·</span>
          <span>
            Actualizada el{" "}
            <time dateTime={guide.updatedAt}>{formatGuideDate(guide.updatedAt)}</time>
          </span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span>{guide.readingTime} min de lectura</span>
        </p>
      </div>
    </Link>
  )
}
