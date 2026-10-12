"use client"

import { useMemo, useState } from "react"
import { Lightbulb, Search, Wallet, X } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { cn } from "@/lib/utils"
import { GLOSSARY_CATEGORIES, GLOSSARY_TERMS, type GlossaryCategoryId } from "./glossary-terms"

/** Normaliza acentos/mayúsculas para buscar sin importar tildes. */
function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

const OUTLINE_BUTTON =
  "inline-flex h-9 items-center gap-2 rounded-md border border-finanzas bg-white/60 px-4 text-sm font-medium text-finanzas transition-colors dark:border-finanzas-light dark:bg-black/20 dark:text-finanzas-light hover:bg-finanzas-dark hover:text-white dark:hover:bg-finanzas-light dark:hover:text-black"

/** Glosario filtrable (búsqueda + categorías). Ephemeral: nada se guarda (patrón E). */
export function Glossary() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<GlossaryCategoryId | "all">("all")
  const { triggerHapticFeedback } = useHapticFeedback()

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return GLOSSARY_TERMS.filter((t) => {
      if (category !== "all" && t.category !== category) return false
      if (!q) return true
      return normalize(`${t.term} ${t.definition} ${t.example ?? ""}`).includes(q)
    })
  }, [query, category])

  const groups = useMemo(
    () =>
      GLOSSARY_CATEGORIES.map((cat) => ({
        ...cat,
        terms: filtered.filter((t) => t.category === cat.id),
      })).filter((g) => g.terms.length > 0),
    [filtered],
  )

  const hasActiveFilter = query.trim().length > 0 || category !== "all"

  const handleCategory = (next: GlossaryCategoryId | "all") => {
    if (next === category) return
    setCategory(next)
    triggerHapticFeedback("light")
  }

  const clearAll = () => {
    setQuery("")
    setCategory("all")
    triggerHapticFeedback("light")
  }

  return (
    <section aria-label="Buscador del glosario" className="space-y-8">
      {/* Panel hero: receta ToolCard (gradiente claro / glass oscuro) */}
      <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">Aprende y busca un nuevo término</h2>
        <p className="mt-1.5 text-sm text-white/85 dark:text-finanzas-lighter">
          Ahorro, crédito, intereses, inversiones y bolsa: todo explicado con ejemplos.
        </p>
        <div className="relative mt-4">
          <label htmlFor="glossary-search" className="sr-only">
            Buscar un término del glosario
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            id="glossary-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca un término… (ej. interés compuesto)"
            autoComplete="off"
            data-interactive="true"
            className="h-12 w-full rounded-md border border-gray-300 bg-white py-2 pl-12 pr-12 text-base text-gray-900 placeholder:text-gray-400 focus:border-finanzas focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-finanzas-light dark:focus:ring-finanzas-light"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              data-interactive="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 transition-colors hover:bg-black/5 hover:text-finanzas dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-finanzas-light"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categorías + contador */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => handleCategory("all")}
            data-interactive="true"
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              category === "all"
                ? "border-finanzas-dark bg-finanzas-dark text-white dark:border-finanzas-light dark:bg-finanzas-light dark:text-black"
                : "border-gray-300 text-gray-600 hover:bg-black/5 hover:text-finanzas dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-finanzas-light",
            )}
          >
            Todas
          </button>
          {GLOSSARY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={category === cat.id}
              onClick={() => handleCategory(cat.id)}
              data-interactive="true"
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                category === cat.id
                  ? "border-finanzas-dark bg-finanzas-dark text-white dark:border-finanzas-light dark:bg-finanzas-light dark:text-black"
                  : "border-gray-300 text-gray-600 hover:bg-black/5 hover:text-finanzas dark:border-gray-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-finanzas-light",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Conteo a la derecha de los filtros */}
        <p
          aria-live="polite"
          className="ml-auto flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
        >
          <Wallet aria-hidden="true" className="h-4 w-4 text-finanzas dark:text-finanzas-light" />
          {filtered.length === GLOSSARY_TERMS.length
            ? `${GLOSSARY_TERMS.length} términos`
            : `${filtered.length} de ${GLOSSARY_TERMS.length} términos`}
        </p>
      </div>

      {/* Resultados agrupados por categoría */}
      {groups.length > 0 ? (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.id}>
              <h2 className="text-xl font-bold text-finanzas-dark dark:text-finanzas-light">
                {group.label}
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {group.terms.map((item, index) => (
                  <article
                    key={item.term}
                    className="group animate-fadeIn rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-finanzas hover:bg-black/5 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-finanzas-light dark:hover:bg-white/10"
                    style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
                  >
                    <h3 className="text-lg font-semibold text-finanzas-dark transition-colors group-hover:text-finanzas-darkest dark:text-finanzas-light dark:group-hover:text-finanzas-lighter">
                      {item.term}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.definition}
                    </p>
                    {item.example && (
                      <p className="mt-3 flex items-start gap-2 rounded-lg bg-finanzas-lighter px-3 py-2 text-xs leading-relaxed text-gray-800 dark:bg-finanzas-dark dark:text-gray-200">
                        <Lightbulb aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-finanzas-dark dark:text-finanzas-light" />
                        <span>{item.example}</span>
                      </p>
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
            Prueba con otra palabra o vuelve a mostrar todas las categorías.
          </p>
          {hasActiveFilter && (
            <button type="button" onClick={clearAll} data-interactive="true" className={cn("mt-4", OUTLINE_BUTTON)}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </section>
  )
}
