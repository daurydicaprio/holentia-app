"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, BookOpen, ExternalLink, Lightbulb, Search, X } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { cn } from "@/lib/utils"
import type { GlossarySection, SectionGlossaryContent } from "@/lib/section-glossary"

interface SectionConceptsProps {
  section: GlossarySection
  content: SectionGlossaryContent
}

/** Normaliza acentos/mayúsculas para buscar sin importar tildes. */
function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

// Clases estáticas por sección: Tailwind las genera completas.
const theme: Record<
  GlossarySection,
  {
    hero: string
    heroSub: string
    input: string
    groupTitle: string
    cardHover: string
    example: string
    icon: string
    link: string
    chipActive: string
    chipIdle: string
    focus: string
  }
> = {
  cuerpo: {
    hero: "border-cuerpo-border bg-gradient-to-br from-cuerpo to-cuerpo-dark text-black dark:bg-none dark:bg-cuerpo-glass dark:text-cuerpo-text",
    heroSub: "text-black/80 dark:text-cuerpo-lighter",
    input: "focus:ring-cuerpo dark:focus:ring-cuerpo-light",
    groupTitle: "text-cuerpo-darkest dark:text-cuerpo-light",
    cardHover: "hover:border-cuerpo dark:hover:border-cuerpo-light dark:hover:bg-white/10",
    example: "bg-cuerpo-lighter text-gray-900 dark:bg-cuerpo-darkest dark:text-gray-100",
    icon: "text-cuerpo-darkest dark:text-cuerpo-light",
    link: "text-cuerpo-darkest underline-offset-2 hover:underline dark:text-cuerpo-light dark:hover:text-cuerpo-lighter",
    chipActive:
      "border-cuerpo-dark bg-cuerpo-dark text-black dark:border-cuerpo-light dark:bg-cuerpo-light dark:text-black",
    chipIdle:
      "border-gray-300 text-gray-600 hover:bg-black/5 hover:text-cuerpo-darkest dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-cuerpo-light",
    focus: "focus-visible:ring-cuerpo dark:focus-visible:ring-cuerpo-light",
  },
  mente: {
    hero: "border-mente-border bg-gradient-to-br from-mente to-mente-dark text-white dark:bg-none dark:bg-mente-glass dark:text-mente-text",
    heroSub: "text-white/90 dark:text-mente-lighter",
    input: "focus:ring-mente dark:focus:ring-mente-light",
    groupTitle: "text-mente-dark dark:text-mente-light",
    cardHover: "hover:border-mente dark:hover:border-mente-light dark:hover:bg-white/10",
    example: "bg-mente-lighter text-gray-900 dark:bg-mente-dark dark:text-gray-100",
    icon: "text-mente-dark dark:text-mente-light",
    link: "text-mente-dark hover:text-mente-darkest dark:text-mente-light dark:hover:text-mente-lighter",
    chipActive:
      "border-mente-dark bg-mente-dark text-white dark:border-mente-light dark:bg-mente-light dark:text-black",
    chipIdle:
      "border-gray-300 text-gray-600 hover:bg-black/5 hover:text-mente dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-mente-light",
    focus: "focus-visible:ring-mente dark:focus-visible:ring-mente-light",
  },
  relaciones: {
    hero: "border-relaciones-border bg-gradient-to-br from-relaciones to-relaciones-dark text-white dark:bg-none dark:bg-relaciones-glass dark:text-relaciones-text",
    heroSub: "text-white/90 dark:text-relaciones-lighter",
    input: "focus:ring-relaciones dark:focus:ring-relaciones-light",
    groupTitle: "text-relaciones-dark dark:text-relaciones-lighter",
    cardHover: "hover:border-relaciones dark:hover:border-relaciones-light dark:hover:bg-white/10",
    example: "bg-relaciones-lighter text-gray-900 dark:bg-relaciones-dark dark:text-gray-100",
    icon: "text-relaciones-dark dark:text-relaciones-lighter",
    link: "text-relaciones-dark hover:text-relaciones-darkest dark:text-relaciones-lighter dark:hover:text-white",
    chipActive:
      "border-relaciones-dark bg-relaciones-dark text-white dark:border-relaciones-light dark:bg-relaciones-light dark:text-black",
    chipIdle:
      "border-gray-300 text-gray-600 hover:bg-black/5 hover:text-relaciones dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-relaciones-light",
    focus: "focus-visible:ring-relaciones dark:focus-visible:ring-relaciones-light",
  },
}

/**
 * Glosario de conceptos básicos de una sección (búsqueda + categorías).
 * Ephemeral: la búsqueda vive en memoria y no se guarda nada (patrón E).
 */
export default function SectionConcepts({ section, content }: SectionConceptsProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("all")
  const { triggerHapticFeedback } = useHapticFeedback()
  const styles = theme[section]

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return content.terms.filter((term) => {
      if (category !== "all" && term.category !== category) return false
      if (!q) return true
      return normalize(`${term.term} ${term.definition} ${term.example}`).includes(q)
    })
  }, [category, content.terms, query])

  const groups = useMemo(
    () =>
      content.categories
        .map((group) => ({
          ...group,
          terms: filtered.filter((term) => term.category === group.id),
        }))
        .filter((group) => group.terms.length > 0),
    [content.categories, filtered],
  )

  const handleCategory = (next: string) => {
    if (next === category) return
    setCategory(next)
    triggerHapticFeedback("light")
  }

  const clearSearch = () => {
    setQuery("")
    triggerHapticFeedback("light")
  }

  const handleToolLink = () => {
    triggerHapticFeedback("medium")
  }

  return (
    <section aria-label="Buscador de conceptos" className="space-y-8">
      <div className={cn("rounded-2xl border p-6 sm:p-8", styles.hero)}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-xl font-bold sm:text-2xl">Busca un concepto</h2>
          <p className={cn("mt-1.5 text-center text-sm", styles.heroSub)}>{content.heroText}</p>
          <div className="relative mt-4">
            <label htmlFor="concepts-search" className="sr-only">
              Buscar un concepto
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              id="concepts-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Busca un concepto… (ej. ${content.searchExample})`}
              autoComplete="off"
              data-interactive="true"
              className={cn(
                "h-12 w-full rounded-md border border-gray-300 bg-white py-2 pl-12 pr-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent",
                styles.input,
              )}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Limpiar búsqueda"
                data-interactive="true"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => handleCategory("all")}
            data-interactive="true"
            className={cn(
              "rounded-md border px-3 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97]",
              category === "all" ? styles.chipActive : styles.chipIdle,
            )}
          >
            Todos
          </button>
          {content.categories.map((group) => (
            <button
              key={group.id}
              type="button"
              aria-pressed={category === group.id}
              onClick={() => handleCategory(group.id)}
              data-interactive="true"
              className={cn(
                "rounded-md border px-3 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97]",
                category === group.id ? styles.chipActive : styles.chipIdle,
              )}
            >
              {group.label}
            </button>
          ))}
        </div>

        <p
          aria-live="polite"
          className="ml-auto flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
        >
          <BookOpen aria-hidden="true" className={cn("h-4 w-4", styles.icon)} />
          {filtered.length === content.terms.length
            ? `${content.terms.length} conceptos`
            : `${filtered.length} de ${content.terms.length} conceptos`}
        </p>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.id}>
              <h2 className={cn("text-xl font-bold", styles.groupTitle)}>{group.label}</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {group.terms.map((item, index) => (
                  <article
                    key={item.slug}
                    id={`concepto-${item.slug}`}
                    className={cn(
                      "group animate-fadeIn scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-black/5 dark:border-gray-700 dark:bg-gray-800",
                      styles.cardHover,
                    )}
                    style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
                  >
                    <h3 className={cn("text-lg font-semibold", styles.groupTitle)}>{item.term}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.definition}
                    </p>
                    <p
                      className={cn(
                        "mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs leading-relaxed",
                        styles.example,
                      )}
                    >
                      <Lightbulb aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{item.example}</span>
                    </p>
                    {item.related && item.related.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {item.related.map((link) => (
                          <Link
                            key={link.slug}
                            href={`/${link.slug}`}
                            onClick={handleToolLink}
                            data-interactive="true"
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",
                              styles.link,
                              styles.focus,
                            )}
                          >
                            {link.label}
                            <ArrowRight aria-hidden="true" className="h-4 w-4" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white/60 p-8 text-center dark:border-gray-700 dark:bg-black/20">
          <Search aria-hidden="true" className="mx-auto h-6 w-6 text-gray-400 dark:text-gray-500" />
          <p className="mt-3 font-medium text-gray-800 dark:text-gray-100">
            {query ? `Sin resultados para «${query.trim()}»` : "Sin resultados en esta categoría"}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Prueba con otra palabra o vuelve a «Todos».
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setCategory("all")
              triggerHapticFeedback("light")
            }}
            data-interactive="true"
            className={cn(
              "mt-4 inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
              styles.chipActive,
              styles.focus,
            )}
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{content.disclaimer}</p>
        {content.sources.length > 0 && (
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            Fuentes:{" "}
            {content.sources.map((source, index) => (
              <span key={source.href}>
                {index > 0 && " · "}
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-interactive="true"
                  className={cn(
                    "inline-flex items-center gap-1 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",
                    styles.link,
                    styles.focus,
                  )}
                >
                  {source.label}
                  <ExternalLink aria-hidden="true" className="h-3 w-3" />
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  )
}
