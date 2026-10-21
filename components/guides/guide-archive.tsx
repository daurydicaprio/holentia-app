"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
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

/** Archivo completo con paginación local de cuatro guías por página. */
export default function GuideArchive({ guides }: GuideArchiveProps) {
  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const { triggerHapticFeedback } = useHapticFeedback()

  const publishedCount = guides.filter((guide) => !guide.draft).length
  const draftCount = guides.length - publishedCount
  const totalPages = Math.max(1, Math.ceil(guides.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PER_PAGE
  const visibleGuides = guides.slice(start, start + PER_PAGE)
  const pageItems = getPageItems(currentPage, totalPages)

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

  const controlClass =
    "inline-flex h-10 min-w-[2.5rem] items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
  const enabledClass =
    "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
  const disabledClass =
    "cursor-not-allowed border-gray-200 bg-white text-gray-400 opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600"

  return (
    <section
      ref={sectionRef}
      id="ultimas-guias"
      aria-labelledby="ultimas-guias-title"
      className="mt-16 scroll-mt-24 sm:mt-20"
    >
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-gray-800">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Archivo
          </p>
          <h2
            id="ultimas-guias-title"
            className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
          >
            Últimas guías
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300">
            Todas las guías, de la más reciente a la más antigua. Cuatro por página.
          </p>
        </div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {publishedCount} {publishedCount === 1 ? "guía publicada" : "guías publicadas"}
          {draftCount > 0 ? ` · ${draftCount} en borrador` : ""}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        Página {currentPage} de {totalPages}. Mostrando {visibleGuides.length} guías.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleGuides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Mostrando {guides.length === 0 ? 0 : start + 1}–{Math.min(start + PER_PAGE, guides.length)} de{" "}
          {guides.length} guías
        </p>

        <nav aria-label="Paginación de guías" className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
          <button
            type="button"
            data-interactive="true"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${controlClass} ${currentPage === 1 ? disabledClass : enabledClass}`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Anterior</span>
            <span className="sr-only sm:hidden">Página anterior</span>
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
                className={`${controlClass} ${
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
            className={`${controlClass} ${currentPage === totalPages ? disabledClass : enabledClass}`}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <span className="sr-only sm:hidden">Página siguiente</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </div>

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Cada guía nueva aparece en este archivo
            </p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              El listado crece de cuatro en cuatro. Mientras tanto, las herramientas resuelven la cuenta con tus
              propios números.
            </p>
          </div>
        </div>
        <Link
          href="/herramientas"
          data-interactive="true"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          Explorar herramientas
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
