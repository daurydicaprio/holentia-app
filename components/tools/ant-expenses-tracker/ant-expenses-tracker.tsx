"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Check, DollarSign, Edit2, Lightbulb, Plus, Trash2, Wallet, X } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { storageGet, storageRemove, storageSet } from "@/lib/storage"

// Persistencia local de las entradas (patrón S «entries», como el diario guiado).
const ENTRIES_KEY = "holentia:tracker-gastos-hormiga:entries:v1"

// Frecuencias anualizadas: diario ×365, 3–4/semana ×182 (3.5 × 52), semanal ×52,
// quincenal ×24 y mensual ×12. El usuario puede editar monto y frecuencia.
const FREQUENCIES = [
  { id: "daily", label: "Diario", perYear: 365 },
  { id: "often", label: "3–4 veces por semana", perYear: 182 },
  { id: "weekly", label: "Semanal", perYear: 52 },
  { id: "biweekly", label: "Quincenal", perYear: 24 },
  { id: "monthly", label: "Mensual", perYear: 12 },
] as const

type FrequencyId = (typeof FREQUENCIES)[number]["id"]

interface AntExpense {
  id: string
  name: string
  amount: number
  frequency: FrequencyId
}

const QUICK_NAMES = ["Café", "Delivery", "Snack", "Colmado", "Recarga", "Soda"]

const TIPS = [
  "Anota el gasto justo después de hacerlo: cuesta cinco segundos y no se te olvida.",
  "Ponle un tope semanal a tu gasto hormiga y revísalo los domingos.",
  "Prepara en casa lo que más repites (café, snack) un par de días y compara el resultado al año.",
  "Convierte un gasto diario que no piensas soltar en un ahorro automático: aparta su monto cada semana.",
]

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white p-3 text-base text-gray-900 shadow-sm focus:border-transparent focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-finanzas-light md:text-sm"

const chipClass = (active: boolean) =>
  `rounded-md px-2.5 py-1 text-xs font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
    active
      ? "border border-finanzas text-finanzas dark:border-finanzas-light dark:text-finanzas-light"
      : "border border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
  }`

function annualOf(expense: AntExpense): number {
  const frequency = FREQUENCIES.find((f) => f.id === expense.frequency) ?? FREQUENCIES[0]
  return expense.amount * frequency.perYear
}

function frequencyLabel(id: FrequencyId): string {
  return FREQUENCIES.find((f) => f.id === id)?.label ?? ""
}

export function AntExpensesTracker() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const formRef = useRef<HTMLFormElement | null>(null)

  const [entries, setEntries] = useState<AntExpense[]>([])
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [frequency, setFrequency] = useState<FrequencyId>("daily")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Cargar lo guardado tras hidratar (sin mismatch en el SSR)
  useEffect(() => {
    setEntries(storageGet<AntExpense[]>(ENTRIES_KEY, []))
  }, [])

  const amountValue = useMemo(() => {
    const parsed = Number.parseFloat(amount)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }, [amount])

  const canSubmit = name.trim().length > 0 && amountValue > 0

  const totals = useMemo(() => {
    const annual = entries.reduce((acc, entry) => acc + annualOf(entry), 0)
    return { annual, monthly: annual / 12, weekly: annual / 52, daily: annual / 365 }
  }, [entries])

  const animatedAnnual = useCountUp(totals.annual, { duration: 600, decimals: 0 })

  const persistEntries = (next: AntExpense[]) => {
    setEntries(next)
    storageSet(ENTRIES_KEY, next)
  }

  const resetForm = () => {
    setName("")
    setAmount("")
    setFrequency("daily")
    setEditingId(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const entry: AntExpense = {
      id: editingId ?? Date.now().toString(),
      name: name.trim(),
      amount: amountValue,
      frequency,
    }

    persistEntries(editingId ? entries.map((e) => (e.id === editingId ? entry : e)) : [entry, ...entries])
    resetForm()
    triggerHapticFeedback("medium")
  }

  const startEdit = (entry: AntExpense) => {
    setEditingId(entry.id)
    setName(entry.name)
    setAmount(String(entry.amount))
    setFrequency(entry.frequency)
    triggerHapticFeedback("light")
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
    }
  }

  const deleteEntry = (id: string) => {
    persistEntries(entries.filter((entry) => entry.id !== id))
    if (editingId === id) resetForm()
    triggerHapticFeedback("medium")
  }

  const clearAll = () => {
    setEntries([])
    storageRemove(ENTRIES_KEY)
    resetForm()
    triggerHapticFeedback("medium")
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Formulario */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2"
        >
          <h2 className="mb-1 text-xl font-bold">{editingId ? "Editar gasto" : "Añadir un gasto"}</h2>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Anota café, delivery o cualquier gasto pequeño que se repita.
          </p>

          <label htmlFor="ant-name" className="mb-2 block text-sm font-medium">
            ¿En qué se te va?
          </label>
          <input
            id="ant-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Café de la esquina"
            className={inputClass}
            data-interactive="true"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_NAMES.map((quick) => (
              <button
                key={quick}
                type="button"
                aria-pressed={name === quick}
                onClick={() => {
                  setName(quick)
                  triggerHapticFeedback("light")
                }}
                className={chipClass(name === quick)}
                data-interactive="true"
              >
                {quick}
              </button>
            ))}
          </div>

          <label htmlFor="ant-amount" className="mt-4 mb-2 block text-sm font-medium">
            ¿Cuánto cuesta cada vez?
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <DollarSign className="h-4 w-4" />
            </span>
            <input
              id="ant-amount"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 80"
              className={`${inputClass} pl-10`}
              data-interactive="true"
            />
          </div>

          <span className="mt-4 mb-2 block text-sm font-medium">¿Con qué frecuencia?</span>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={frequency === option.id}
                onClick={() => {
                  setFrequency(option.id)
                  triggerHapticFeedback("light")
                }}
                className={chipClass(frequency === option.id)}
                data-interactive="true"
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            «3–4 veces por semana» cuenta 182 veces al año (3.5 × 52).
          </p>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-finanzas font-medium text-white transition-[colors,transform] duration-150 hover:bg-finanzas-dark active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
            data-interactive="true"
          >
            {editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Guardar cambios" : "Añadir gasto"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-300 text-sm font-medium text-gray-600 transition-colors hover:bg-black/5 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-white/10"
              data-interactive="true"
            >
              <X className="h-4 w-4" />
              Cancelar edición
            </button>
          )}

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Se guarda en tu navegador</span>
            {entries.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                data-interactive="true"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Borrar todo
              </button>
            )}
          </div>
        </form>

        {/* Resultados */}
        <div className="lg:col-span-3">
          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
              <Wallet className="mx-auto mb-4 h-12 w-12 opacity-40" />
              <p className="font-medium">Aún no has anotado nada</p>
              <p className="mt-1 text-sm">Añade tu primer gasto pequeño y mira cuánto suma al año.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Hero: proyección anual */}
              <div
                aria-live="polite"
                className="animate-result-in rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8"
              >
                <p className="text-sm text-white/85 dark:text-finanzas-lighter">Tus gastos hormiga suman</p>
                <p className="mt-1 text-3xl font-bold tabular-nums sm:text-4xl">
                  {formatDOP(animatedAnnual, 0)} <span className="text-base font-medium sm:text-lg">al año</span>
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "al mes", value: totals.monthly },
                    { label: "a la semana", value: totals.weekly },
                    { label: "al día", value: totals.daily },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-black/10 p-3 text-center dark:bg-black/20">
                      <p className="text-lg font-bold tabular-nums">{formatDOP(stat.value, 0)}</p>
                      <p className="text-xs text-white/80 dark:text-finanzas-lighter">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalle por gasto */}
              <div className="rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
                <ul aria-label="Gastos anotados" className="space-y-3">
                  {entries.map((entry) => {
                    const annual = annualOf(entry)
                    const pct = totals.annual > 0 ? Math.round((annual / totals.annual) * 100) : 0
                    return (
                      <li
                        key={entry.id}
                        className="rounded-xl border border-gray-200 p-4 dark:border-gray-700 sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{entry.name}</p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                              {frequencyLabel(entry.frequency)} · {formatDOP(entry.amount)} por vez
                            </p>
                          </div>
                          <div className="flex flex-shrink-0 items-center">
                            <button
                              type="button"
                              onClick={() => startEdit(entry)}
                              aria-label={`Editar ${entry.name}`}
                              className="flex h-11 w-11 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-finanzas dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-finanzas-light"
                              data-interactive="true"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteEntry(entry.id)}
                              aria-label={`Borrar ${entry.name}`}
                              className="flex h-11 w-11 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-red-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-red-400"
                              data-interactive="true"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold tabular-nums text-finanzas-dark dark:text-finanzas-light">
                            {formatDOP(annual, 0)}/año
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{pct}% del total</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-finanzas transition-[width] duration-500 dark:bg-finanzas-light"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Lightbulb className="h-5 w-5 text-finanzas dark:text-finanzas-light" />
          Claves para que no se te escapen
        </h2>
        <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-finanzas dark:bg-finanzas-light"
              />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
