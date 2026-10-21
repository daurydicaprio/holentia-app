import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { getPublishedGuides } from "@/lib/guides"
import { guideCategoryLabel } from "@/lib/guide-format"
import type { GuideCategory } from "@/types/guide"

const categoryText: Record<GuideCategory, string> = {
  mente: "text-mente-dark dark:text-mente-light",
  relaciones: "text-relaciones dark:text-relaciones-light",
  cuerpo: "text-cuerpo-darkest dark:text-cuerpo-light",
  finanzas: "text-finanzas-dark dark:text-finanzas-light",
  general: "text-gray-600 dark:text-gray-300",
}

interface RelatedGuidesProps {
  toolSlug: string
}

/**
 * Enlaces guía ↔ herramienta server-rendered. Solo aparecen guías publicadas,
 * para que una herramienta nunca enlace a un borrador que no existe en producción.
 */
export default function RelatedGuides({ toolSlug }: RelatedGuidesProps) {
  const guides = getPublishedGuides()
    .filter((guide) => guide.primaryTool === toolSlug || guide.relatedTools.includes(toolSlug))
    .slice(0, 2)

  if (guides.length === 0) return null

  return (
    <aside
      aria-labelledby="guias-relacionadas"
      className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700"
    >
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        <h2 id="guias-relacionadas" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Guías relacionadas
        </h2>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guias/${guide.slug}`}
            data-interactive="true"
            className="group rounded-xl border border-gray-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-gray-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
          >
            <span
              className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
                categoryText[guide.category] ?? categoryText.general
              }`}
            >
              {guideCategoryLabel(guide.category)}
            </span>
            <p className="mt-1 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {guide.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300">{guide.excerpt}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              Leer guía
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
