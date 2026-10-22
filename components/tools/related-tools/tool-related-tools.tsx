import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { sectionsData } from "@/lib/data"
import { getRelatedToolSlugs } from "@/lib/related-tools"

const ACCENT: Record<string, { link: string; arrow: string }> = {
  mente: {
    link: "hover:text-mente-dark dark:hover:text-mente-light",
    arrow: "text-mente-dark dark:text-mente-light",
  },
  relaciones: {
    link: "hover:text-relaciones dark:hover:text-relaciones-light",
    arrow: "text-relaciones dark:text-relaciones-light",
  },
  cuerpo: {
    link: "hover:text-cuerpo-darkest dark:hover:text-cuerpo-light",
    arrow: "text-cuerpo-darkest dark:text-cuerpo-light",
  },
  finanzas: {
    link: "hover:text-finanzas-dark dark:hover:text-finanzas-light",
    arrow: "text-finanzas-dark dark:text-finanzas-light",
  },
  sky: {
    link: "hover:text-sky-700 dark:hover:text-sky-300",
    arrow: "text-sky-600 dark:text-sky-400",
  },
}

// Hidratación conserva la semántica de agua, no el ámbar genérico de cuerpo.
const ACCENT_OVERRIDES: Record<string, keyof typeof ACCENT> = {
  "calculadora-hidratacion": "sky",
}

const toolBySlug = new Map(
  Object.values(sectionsData)
    .flatMap((section) => section.cards)
    .map((tool) => [tool.slug, tool]),
)

interface ToolRelatedToolsProps {
  slug: string
}

/**
 * Cierre contextual único para las 35 herramientas. Se renderiza en el shell
 * server-first, sin JS propio, y sustituye los bloques sueltos de cada tool.
 */
export default function ToolRelatedTools({ slug }: ToolRelatedToolsProps) {
  const current = toolBySlug.get(slug)
  const related = getRelatedToolSlugs(slug)
    .map((relatedSlug) => toolBySlug.get(relatedSlug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))

  if (!current || related.length === 0) return null

  const accent = ACCENT[ACCENT_OVERRIDES[slug] ?? current.category] ?? ACCENT.finanzas

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Sigue por aquí</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Herramientas que se complementan con esta.
          </p>
        </div>
        <nav aria-label="Herramientas relacionadas" className="flex flex-wrap gap-x-5 gap-y-1 sm:justify-end">
          {related.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              data-interactive="true"
              className={`group inline-flex items-center gap-1.5 py-2.5 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300 ${accent.link}`}
            >
              {tool.title}
              <ArrowRight
                className={`h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${accent.arrow}`}
              />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
