import Link from "next/link"
import { BookOpen } from "lucide-react"
import { getPublishedGuides } from "@/lib/guides"

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
        {guides.map((guide) => {
          const titleId = `related-guide-${guide.slug}`

          return (
            <Link
              key={guide.slug}
              href={`/guias/${guide.slug}`}
              data-interactive="true"
              aria-labelledby={titleId}
              className="group rounded-xl border border-gray-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-gray-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500 dark:focus-visible:ring-white"
            >
              <p
                id={titleId}
                className="text-sm font-semibold leading-snug text-gray-900 group-hover:underline group-hover:decoration-gray-300 group-hover:decoration-1 group-hover:underline-offset-4 dark:text-gray-100 dark:group-hover:decoration-gray-600"
              >
                {guide.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300">{guide.excerpt}</p>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
