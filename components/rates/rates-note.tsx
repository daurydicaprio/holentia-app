import { CalendarDays } from "lucide-react"
import { RATE_GROUPS_BY_TOOL, RATE_META, REVIEWED_AT, formatRateDate } from "@/lib/rates"

interface RatesNoteProps {
  slug: string
}

/**
 * Nota de transparencia para herramientas financieras: fecha de revisión y
 * fuentes de las tasas. Es server-rendered y no hace peticiones de red.
 */
export function RatesNote({ slug }: RatesNoteProps) {
  const groups = RATE_GROUPS_BY_TOOL[slug]
  if (!groups || groups.length === 0) return null

  const sources = Array.from(
    new Map(groups.map((group) => [RATE_META[group].source, RATE_META[group]] as const)).values(),
  )

  return (
    <aside
      aria-label="Fecha de revisión y fuentes de los datos"
      className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
    >
      <p className="flex items-start gap-2">
        <CalendarDays className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-finanzas dark:text-finanzas-light" aria-hidden />
        <span>
          <strong className="font-semibold text-gray-700 dark:text-gray-200">Datos revisados:</strong>{" "}
          <time dateTime={REVIEWED_AT}>{formatRateDate(REVIEWED_AT)}</time>.
        </span>
      </p>
      <p className="mt-1 pl-[1.375rem]">
        <strong className="font-semibold text-gray-700 dark:text-gray-200">Fuente:</strong>{" "}
        {sources.map((meta, index) => (
          <span key={meta.source}>
            {index > 0 && " · "}
            <a
              href={meta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-gray-300 underline-offset-2 hover:text-finanzas-dark dark:decoration-gray-600 dark:hover:text-finanzas-light"
            >
              {meta.source}
            </a>
          </span>
        ))}
        .
      </p>
    </aside>
  )
}
