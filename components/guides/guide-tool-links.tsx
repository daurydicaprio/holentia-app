import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { findToolBySlug } from "@/lib/seo"

interface GuideToolLinksProps {
  primaryTool: string
  relatedTools: string[]
}

/** Acceso temprano a la herramienta que resuelve el paso siguiente, sin esperar al CTA final. */
export default function GuideToolLinks({ primaryTool, relatedTools }: GuideToolLinksProps) {
  const primary = findToolBySlug(primaryTool)
  const related = relatedTools
    .map((slug) => findToolBySlug(slug))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined && tool.slug !== primaryTool)

  if (!primary) return null

  return (
    <aside
      aria-label="Herramienta para esta guía"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{primary.title}</p>
        </div>
        <Link
          href={`/${primary.slug}`}
          data-interactive="true"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          Abrir herramienta
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {related.length > 0 ? (
        <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {related.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                data-interactive="true"
                className="inline-flex items-center gap-1 py-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {tool.title}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  )
}
