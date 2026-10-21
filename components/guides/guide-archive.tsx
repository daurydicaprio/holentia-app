"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import GuideCard from "@/components/guides/guide-card"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import type { GuideSummary } from "@/types/guide"

const PER_PAGE = 4

type PageItem = number | "ellipsis"

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) items.push("ellipsis")
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < totalPages - 1) items.push("ellipsis")
  items.push(totalPages)

  return items
}

interface GuideArchiveProps {
  guides: GuideSummary[]
}

/** Archivo editorial paginado de cuatro guías por página. */
export default function GuideArchive({ guides }: GuideArchiveProps) {
  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const { triggerHapticFeedback } = useHapticFeedback()

  const totalPages = Math.max(1, Math.ceil(guides.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PER_PAGE
  const visibleGuides = guides.slice(start, start + PER_PAGE)
  const pageItems = getPageItems(currentPage, totalPages)

  if (guides.length === 0) return null

  const goToPage = (nextPage: number) => {
    const target = Math.min(Math.max(1, nextPage), totalPages)
    if (target === currentPage) return

    setPage(target)
    triggerHapticFeedback("light")

    window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      sectionRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      })
    })
  }

  const pageButtonClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-white"
  const enabledClass =
    "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
  const disabledClass =
    "cursor-not-allowed border-transparent text-gray-300 dark:text-gray-600"

  return (
    <section
      ref={sectionRef}
      id="ultimas-guias"
      aria-labelledby="ultimas-guias-title"
      className="mt-14 scroll-mt-24 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-12 dark:border-gray-800"
    >
      <h2
        id="ultimas-guias-title"
        className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        Últimas guías
      </h2>

      {totalPages > 1 ? (
        <p className="sr-only" aria-live="polite">
          Página {currentPage} de {totalPages}. Mostrando {visibleGuides.length} guías.
        </p>
      ) : null}

      <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {visibleGuides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Paginación de guías"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            data-interactive="true"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            className={`${pageButtonClass} w-10 px-0 ${currentPage === 1 ? disabledClass : enabledClass}`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="inline-flex h-10 w-8 items-center justify-center text-sm text-gray-400 dark:text-gray-500"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                data-interactive="true"
                onClick={() => goToPage(item)}
                aria-label={`Página ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                className={`${pageButtonClass} ${
                  item === currentPage
                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                    : enabledClass
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            data-interactive="true"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
            className={`${pageButtonClass} w-10 px-0 ${
              currentPage === totalPages ? disabledClass : enabledClass
            }`}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </section>
  )
}
