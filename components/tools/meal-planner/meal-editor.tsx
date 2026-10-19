"use client"

import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Plus, Trash2, X } from "lucide-react"
import { formatLongDate } from "@/lib/calendar"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { cn } from "@/lib/utils"
import {
  MEAL_SUGGESTIONS,
  MEAL_TAG_LABELS,
  MEAL_TYPES,
  type MealTag,
  type MealType,
  type PlannedMeal,
} from "./meal-planner-data"
import { mealFromSuggestion, parseIngredientInput } from "./meal-planner-utils"

interface MealEditorProps {
  dayKey: string
  mealType: MealType
  existingMeal?: PlannedMeal
  onSave: (meal: PlannedMeal) => void
  onRemove: () => void
  onClose: () => void
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cuerpo dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-cuerpo-light"

const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-cuerpo hover:bg-cuerpo-lighter hover:text-gray-900 dark:border-gray-600 dark:text-gray-200 dark:hover:border-cuerpo-light dark:hover:bg-cuerpo-dark dark:hover:text-white"

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cuerpo focus-visible:ring-offset-2 dark:focus-visible:ring-cuerpo-light dark:focus-visible:ring-offset-gray-800"

function tagClass(tag: MealTag): string {
  if (tag === "vegetariano") {
    return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
  }
  if (tag === "proteico") {
    return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
  }
  return "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100"
}

export default function MealEditor({
  dayKey,
  mealType,
  existingMeal,
  onSave,
  onRemove,
  onClose,
}: MealEditorProps) {
  const { triggerHapticFeedback } = useHapticFeedback()
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [title, setTitle] = useState(existingMeal?.title ?? "")
  const [ingredients, setIngredients] = useState(existingMeal?.ingredients.join(", ") ?? "")
  const [note, setNote] = useState(existingMeal?.note ?? "")
  const [formError, setFormError] = useState("")
  const [confirmRemove, setConfirmRemove] = useState(false)

  const mealLabel = MEAL_TYPES.find((item) => item.id === mealType)?.label ?? "Comida"
  const suggestions = MEAL_SUGGESTIONS.filter((suggestion) => suggestion.type === mealType)
  const dayLabel = formatLongDate(dayKey)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (removeTimerRef.current) clearTimeout(removeTimerRef.current)
    }
  }, [])

  const close = () => {
    onClose()
  }

  const save = (meal: PlannedMeal) => {
    triggerHapticFeedback("medium")
    onSave(meal)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanTitle = title.trim().replace(/\s+/g, " ")
    if (!cleanTitle) {
      setFormError("Escribe un nombre para la comida.")
      titleRef.current?.focus()
      return
    }

    save({
      title: cleanTitle.slice(0, 80),
      ingredients: parseIngredientInput(ingredients),
      note: note.trim().replace(/\s+/g, " ").slice(0, 160),
    })
  }

  const handleRemove = () => {
    if (!confirmRemove) {
      setConfirmRemove(true)
      triggerHapticFeedback("light")
      removeTimerRef.current = setTimeout(() => setConfirmRemove(false), 4000)
      return
    }

    if (removeTimerRef.current) clearTimeout(removeTimerRef.current)
    triggerHapticFeedback("medium")
    onRemove()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="meal-editor-title"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close()
      }}
      className="m-auto max-h-[90vh] w-[min(92vw,36rem)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {mealLabel}
          </p>
          <h2 id="meal-editor-title" className="mt-0.5 text-lg font-bold leading-snug">
            {dayLabel}
          </h2>
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
            Elige una idea o escribe tu propia comida.
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
            focusClass,
          )}
          data-interactive="true"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-6 p-5">
        <section aria-labelledby="meal-suggestions-title">
          <h3 id="meal-suggestions-title" className="text-sm font-semibold">
            Ideas para {mealLabel.toLocaleLowerCase("es")}
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => save(mealFromSuggestion(suggestion))}
                className={cn(
                  "group flex min-h-[92px] flex-col items-start justify-between rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:border-cuerpo hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-cuerpo-light dark:hover:bg-gray-700",
                  focusClass,
                )}
                data-interactive="true"
              >
                <span className="flex w-full items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-snug">{suggestion.title}</span>
                  <Plus
                    className="mt-0.5 h-4 w-4 shrink-0 text-cuerpo-darkest transition-transform group-hover:rotate-90 dark:text-cuerpo-light"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 flex flex-wrap gap-1">
                  {suggestion.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", tagClass(tag))}
                    >
                      {MEAL_TAG_LABELS[tag]}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="meal-custom-title">
          <h3 id="meal-custom-title" className="text-sm font-semibold">
            {existingMeal ? "Editar esta comida" : "O escribe tu propia comida"}
          </h3>
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div>
              <label htmlFor="meal-title" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nombre
              </label>
              <input
                ref={titleRef}
                id="meal-title"
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  setFormError("")
                }}
                maxLength={80}
                placeholder="Ej: Arroz con pollo y ensalada"
                className={inputClass}
                data-interactive="true"
              />
            </div>
            <div>
              <label
                htmlFor="meal-ingredients"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Ingredientes <span className="font-normal text-gray-500 dark:text-gray-400">(opcional)</span>
              </label>
              <input
                id="meal-ingredients"
                type="text"
                value={ingredients}
                onChange={(event) => setIngredients(event.target.value)}
                placeholder="Ej: arroz, pollo, tomate, aguacate"
                className={inputClass}
                data-interactive="true"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Sepáralos con comas; se suman a la lista de compras.
              </p>
            </div>
            <div>
              <label htmlFor="meal-note" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nota <span className="font-normal text-gray-500 dark:text-gray-400">(opcional)</span>
              </label>
              <input
                id="meal-note"
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={160}
                placeholder="Ej: cocinar doble para las sobras"
                className={inputClass}
                data-interactive="true"
              />
            </div>

            {formError ? (
              <p className="text-sm font-medium text-red-600 dark:text-red-300" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className={cn(
                  "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-gray-900 px-4 text-sm font-medium text-white transition-[colors,transform] hover:bg-gray-800 active:scale-[0.97] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
                  focusClass,
                )}
                data-interactive="true"
              >
                {existingMeal ? "Guardar cambios" : "Añadir comida"}
              </button>
              {existingMeal ? (
                <button
                  type="button"
                  onClick={handleRemove}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors",
                    confirmRemove
                      ? "border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-600 dark:text-white"
                      : "border-gray-300 text-red-600 hover:border-red-600 hover:bg-red-50 dark:border-gray-600 dark:text-red-300 dark:hover:border-red-400 dark:hover:bg-red-950/40",
                    focusClass,
                  )}
                  data-interactive="true"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {confirmRemove ? "¿Quitar?" : "Quitar"}
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <button
          type="button"
          onClick={close}
          className={cn("w-full rounded-md py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white sm:hidden", focusClass)}
          data-interactive="true"
        >
          Cerrar
        </button>
      </div>
    </dialog>
  )
}
