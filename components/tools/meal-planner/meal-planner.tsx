"use client"

import { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Info,
  Moon,
  Plus,
  ShoppingBasket,
  Sparkles,
  Sun,
  Trash2,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { addDays, formatWeekRange, getWeekDays, localDayKey, parseDayKey, startOfWeek } from "@/lib/calendar"
import { storageGet, storageSet } from "@/lib/storage"
import { cn } from "@/lib/utils"
import MealEditor from "./meal-editor"
import {
  EMPTY_MEAL_PLANNER_STATE,
  EMPTY_WEEK_PLAN,
  MEAL_PLANNER_STORAGE_KEY,
  MEAL_SUGGESTIONS,
  MEAL_TAG_LABELS,
  MEAL_TYPES,
  type MealPlannerState,
  type MealType,
  type PlannedMeal,
  type WeekPlan,
} from "./meal-planner-data"
import {
  collectIngredients,
  countCompleteDays,
  fillEmptyMeals,
  getWeekPlan,
  mealSlotKey,
  normalizeMealPlannerState,
  pruneChecked,
} from "./meal-planner-utils"

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

const MEAL_ICONS: Record<MealType, LucideIcon> = {
  desayuno: Coffee,
  almuerzo: Sun,
  cena: Moon,
}

const navButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-cuerpo hover:bg-black/5 hover:text-cuerpo-darkest disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cuerpo-light dark:hover:bg-white/10 dark:hover:text-cuerpo-light"

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cuerpo focus-visible:ring-offset-2 dark:focus-visible:ring-cuerpo-light dark:focus-visible:ring-offset-gray-800"

const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:border-cuerpo hover:bg-black/5 hover:text-cuerpo-darkest disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-cuerpo-light dark:hover:bg-white/10 dark:hover:text-cuerpo-light"

function updateWeekPlan(
  previous: MealPlannerState,
  weekKey: string,
  updater: (current: WeekPlan) => WeekPlan,
): MealPlannerState {
  const current = previous.weeks[weekKey] ?? EMPTY_WEEK_PLAN
  const next = updater(current)
  const weeks = { ...previous.weeks }

  if (Object.keys(next.meals).length === 0 && Object.keys(next.checked).length === 0) {
    delete weeks[weekKey]
  } else {
    weeks[weekKey] = next
  }

  return { ...previous, weeks }
}

function suggestionForMeal(meal: PlannedMeal | undefined) {
  if (!meal?.suggestionId) return undefined
  return MEAL_SUGGESTIONS.find((suggestion) => suggestion.id === meal.suggestionId)
}

function PlannerCell({
  dayNumber,
  mealType,
  meal,
  onOpen,
}: {
  dayNumber: number
  mealType: MealType
  meal: PlannedMeal | undefined
  onOpen: () => void
}) {
  const type = MEAL_TYPES.find((item) => item.id === mealType)
  const label = type?.label ?? "Comida"
  const suggestion = suggestionForMeal(meal)
  const tag = suggestion?.tags[0]

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex min-h-[84px] w-full flex-col justify-center gap-2 border-t border-gray-100 px-3 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700/70 dark:hover:bg-gray-700/50 sm:border-l sm:border-t-0",
        meal ? "bg-white dark:bg-gray-800" : "bg-gray-50/40 dark:bg-gray-900/20",
        focusClass,
      )}
      data-interactive="true"
    >
      <span className="sr-only">
        {meal
          ? `Editar ${label.toLocaleLowerCase("es")} del día ${dayNumber}: `
          : `Añadir ${label.toLocaleLowerCase("es")} del día ${dayNumber}: `}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:hidden">
        {label}
      </span>
      {meal ? (
        <>
          <span className="text-sm font-medium leading-snug text-gray-900 dark:text-gray-100">
            {meal.title}
          </span>
          <span className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
            {tag ? (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                {MEAL_TAG_LABELS[tag]}
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                Personalizada
              </span>
            )}
            {meal.ingredients.length > 0 ? (
              <span>
                {meal.ingredients.length} {meal.ingredients.length === 1 ? "ingrediente" : "ingredientes"}
              </span>
            ) : null}
          </span>
        </>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors group-hover:text-cuerpo-darkest dark:text-gray-400 dark:group-hover:text-cuerpo-light">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sm:hidden">Añadir {label.toLocaleLowerCase("es")}</span>
          <span className="hidden sm:inline">Añadir</span>
        </span>
      )}
    </button>
  )
}

export function MealPlanner() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const skipNextSave = useRef(false)
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const [state, setState] = useState<MealPlannerState>(EMPTY_MEAL_PLANNER_STATE)
  const [mounted, setMounted] = useState(false)
  const [todayKey, setTodayKey] = useState<string | null>(null)
  const [weekStartKey, setWeekStartKey] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ dayKey: string; type: MealType } | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    const now = new Date()
    setTodayKey(localDayKey(now))
    setWeekStartKey(localDayKey(startOfWeek(now)))
    skipNextSave.current = true
    setState(normalizeMealPlannerState(storageGet<unknown>(MEAL_PLANNER_STORAGE_KEY, EMPTY_MEAL_PLANNER_STATE)))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    setSaveError(!storageSet(MEAL_PLANNER_STORAGE_KEY, state))
  }, [state, mounted])

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    }
  }, [])

  // El héroe se renderiza también en SSR (LCP temprano). El resto espera a montar
  // para leer localStorage y la fecha local sin desajustes de hidratación.
  const weekDays = weekStartKey ? getWeekDays(parseDayKey(weekStartKey)) : []
  const currentWeekStartKey = todayKey ? localDayKey(startOfWeek(parseDayKey(todayKey))) : null
  const weekPlan = getWeekPlan(state, weekStartKey ?? "")
  const meals = weekPlan.meals
  const ingredients = collectIngredients(meals)
  const plannedCount = Object.keys(meals).length
  const totalSlots = 7 * MEAL_TYPES.length
  const emptySlots = totalSlots - plannedCount
  const completeDays = countCompleteDays(meals, weekDays)
  const checkedCount = ingredients.filter((ingredient) => weekPlan.checked[ingredient.key] === true).length
  const progress = Math.round((plannedCount / totalSlots) * 100)
  const weekLabel = weekStartKey ? formatWeekRange(parseDayKey(weekStartKey)) : "Semana actual"
  const isCurrentWeek = weekStartKey !== null && currentWeekStartKey === weekStartKey
  const selectedMeal = selectedSlot
    ? meals[mealSlotKey(selectedSlot.dayKey, selectedSlot.type)]
    : undefined

  const moveWeek = (offset: number) => {
    if (!weekStartKey) return
    const nextKey = localDayKey(addDays(parseDayKey(weekStartKey), offset * 7))
    setWeekStartKey(nextKey)
    setSelectedSlot(null)
    setConfirmClear(false)
    triggerHapticFeedback("light")
  }

  const goToday = () => {
    if (!currentWeekStartKey) return
    setWeekStartKey(currentWeekStartKey)
    setSelectedSlot(null)
    setConfirmClear(false)
    triggerHapticFeedback("light")
  }

  const openSlot = (dayKey: string, type: MealType) => {
    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    setSelectedSlot({ dayKey, type })
    triggerHapticFeedback("light")
  }

  const restoreCellFocus = () => {
    window.requestAnimationFrame(() => lastFocusedRef.current?.focus({ preventScroll: true }))
  }

  const closeEditor = () => {
    setSelectedSlot(null)
    restoreCellFocus()
  }

  const saveMeal = (meal: PlannedMeal) => {
    if (!selectedSlot || !weekStartKey) return
    const slotKey = mealSlotKey(selectedSlot.dayKey, selectedSlot.type)
    setState((previous) =>
      updateWeekPlan(previous, weekStartKey, (current) => {
        const nextMeals = { ...current.meals, [slotKey]: meal }
        return { meals: nextMeals, checked: pruneChecked(current.checked, nextMeals) }
      }),
    )
    closeEditor()
    triggerHapticFeedback("medium")
  }

  const removeMeal = () => {
    if (!selectedSlot || !weekStartKey) return
    const slotKey = mealSlotKey(selectedSlot.dayKey, selectedSlot.type)
    setState((previous) =>
      updateWeekPlan(previous, weekStartKey, (current) => {
        const nextMeals = { ...current.meals }
        delete nextMeals[slotKey]
        return { meals: nextMeals, checked: pruneChecked(current.checked, nextMeals) }
      }),
    )
    closeEditor()
    triggerHapticFeedback("medium")
  }

  const toggleIngredient = (key: string) => {
    if (!weekStartKey) return
    setState((previous) =>
      updateWeekPlan(previous, weekStartKey, (current) => {
        const checked = { ...current.checked }
        if (checked[key]) delete checked[key]
        else checked[key] = true
        return { ...current, checked }
      }),
    )
    triggerHapticFeedback("light")
  }

  const fillSlots = () => {
    if (!weekStartKey) return
    setState((previous) =>
      updateWeekPlan(previous, weekStartKey, (current) => {
        const nextMeals = fillEmptyMeals(current.meals, weekDays)
        return { meals: nextMeals, checked: pruneChecked(current.checked, nextMeals) }
      }),
    )
    setSelectedSlot(null)
    triggerHapticFeedback("medium")
  }

  const clearWeek = () => {
    if (!weekStartKey) return
    if (!confirmClear) {
      setConfirmClear(true)
      triggerHapticFeedback("light")
      clearTimerRef.current = setTimeout(() => setConfirmClear(false), 4000)
      return
    }

    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    setState((previous) => {
      const weeks = { ...previous.weeks }
      delete weeks[weekStartKey]
      return { ...previous, weeks }
    })
    setSelectedSlot(null)
    setConfirmClear(false)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="meal-planner-hero-title"
        className="rounded-2xl border border-cuerpo-border bg-gradient-to-br from-cuerpo to-cuerpo-dark p-6 text-black shadow-lg dark:border-cuerpo-border dark:bg-none dark:bg-cuerpo-glass dark:text-white sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold dark:bg-white/15">
                Plan semanal
              </span>
              {isCurrentWeek ? (
                <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold dark:bg-white/15">
                  Esta semana
                </span>
              ) : null}
            </div>
            <h2 id="meal-planner-hero-title" className="mt-3 text-2xl font-bold sm:text-3xl">
              Tu semana de comidas
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-black dark:text-gray-100">
              Organiza desayuno, almuerzo y cena. Elige ideas con ingredientes listos o escribe tus propias comidas;
              la lista de compras se arma con lo que planifiques.
            </p>
            <p className="mt-3 text-xs font-semibold text-black dark:text-gray-200">{weekLabel}</p>
          </div>

          <div className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:min-w-[20rem]" aria-live="polite">
            <div className="rounded-xl bg-black/10 px-3 py-3 dark:bg-white/10">
              <p className="text-2xl font-bold tabular-nums">
                {plannedCount}
                <span className="text-sm font-medium text-black dark:text-gray-200">/{totalSlots}</span>
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-black dark:text-gray-200">comidas</p>
            </div>
            <div className="rounded-xl bg-black/10 px-3 py-3 dark:bg-white/10">
              <p className="text-2xl font-bold tabular-nums">
                {completeDays}
                <span className="text-sm font-medium text-black dark:text-gray-200">/7</span>
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-black dark:text-gray-200">días completos</p>
            </div>
            <div className="rounded-xl bg-black/10 px-3 py-3 dark:bg-white/10">
              <p className="text-2xl font-bold tabular-nums">{ingredients.length}</p>
              <p className="mt-0.5 text-[11px] font-medium text-black dark:text-gray-200">ingredientes</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Avance de la semana</span>
            <span>{progress}%</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-black/15 dark:bg-white/20"
            role="progressbar"
            aria-label="Comidas planificadas de la semana"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-black transition-[width] duration-500 dark:bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs font-medium text-black dark:text-gray-200">
            {plannedCount === 0
              ? "Tu semana está vacía. Elige una celda o pulsa «Rellenar huecos»."
              : emptySlots === 0
                ? "Semana completa. Revisa la lista de compras y ajusta lo que necesites."
                : `Te ${emptySlots === 1 ? "queda 1 espacio" : `quedan ${emptySlots} espacios`} por completar.`}
          </p>
        </div>
      </section>

      {mounted && weekStartKey ? (
        <>
          {saveError ? (
            <div
              className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                No pudimos guardar en este navegador. Revisa el almacenamiento local o usa «Borrar mis datos» si el
                problema continúa.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => moveWeek(-1)}
                aria-label="Semana anterior"
                className={cn(navButtonClass, focusClass)}
                data-interactive="true"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goToday}
                disabled={isCurrentWeek}
                className={cn(
                  "h-11 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:border-cuerpo hover:bg-black/5 hover:text-cuerpo-darkest disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cuerpo-light dark:hover:bg-white/10 dark:hover:text-cuerpo-light",
                  focusClass,
                )}
                data-interactive="true"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => moveWeek(1)}
                aria-label="Semana siguiente"
                className={cn(navButtonClass, focusClass)}
                data-interactive="true"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="ml-1 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <CalendarDays className="h-4 w-4 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
                <span>{weekLabel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={fillSlots}
                disabled={emptySlots === 0}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-cuerpo bg-white px-4 text-sm font-medium text-cuerpo-darkest transition-colors hover:bg-cuerpo-lighter disabled:cursor-not-allowed disabled:opacity-40 dark:border-cuerpo-light dark:bg-gray-800 dark:text-cuerpo-light dark:hover:bg-cuerpo-dark dark:hover:text-white",
                  focusClass,
                )}
                data-interactive="true"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {emptySlots === 0 ? "Semana completa" : "Rellenar huecos"}
              </button>
              <button
                type="button"
                onClick={clearWeek}
                disabled={plannedCount === 0}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  confirmClear
                    ? "border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-600"
                    : "border-gray-200 bg-white text-gray-600 hover:border-red-600 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300",
                  focusClass,
                )}
                data-interactive="true"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {confirmClear ? "¿Vaciar semana?" : "Vaciar semana"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <section
              aria-labelledby="meal-planner-week-title"
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="hidden border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 sm:grid sm:grid-cols-[5.5rem_repeat(3,minmax(0,1fr))]">
                <div className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Día
                </div>
                {MEAL_TYPES.map((type) => {
                  const Icon = MEAL_ICONS[type.id]
                  return (
                    <div
                      key={type.id}
                      className="flex items-center gap-1.5 border-l border-gray-200 px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400"
                    >
                      <Icon className="h-3.5 w-3.5 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
                      {type.label}
                    </div>
                  )
                })}
              </div>

              {weekDays.map((day, index) => {
                const dayKey = localDayKey(day)
                const isToday = dayKey === todayKey
                return (
                  <div
                    key={dayKey}
                    className="border-b border-gray-200 last:border-b-0 dark:border-gray-700 sm:grid sm:grid-cols-[5.5rem_repeat(3,minmax(0,1fr))]"
                  >
                    <div className="flex items-center justify-between gap-3 bg-gray-50/80 px-3 py-2.5 dark:bg-gray-900/40 sm:flex-col sm:items-start sm:justify-center sm:bg-transparent sm:py-3 dark:sm:bg-transparent">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {WEEKDAY_LABELS[index]}
                        </p>
                        <p className="text-lg font-bold leading-tight tabular-nums text-gray-900 dark:text-gray-100">
                          {day.getDate()}
                        </p>
                      </div>
                      {isToday ? (
                        <span className="rounded-full bg-cuerpo-lighter px-2 py-0.5 text-[10px] font-semibold text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
                          Hoy
                        </span>
                      ) : null}
                    </div>
                    {MEAL_TYPES.map((type) => {
                      const slotKey = mealSlotKey(dayKey, type.id)
                      return (
                        <PlannerCell
                          key={type.id}
                          dayNumber={day.getDate()}
                          mealType={type.id}
                          meal={meals[slotKey]}
                          onOpen={() => openSlot(dayKey, type.id)}
                        />
                      )
                    })}
                  </div>
                )
              })}

              <div className="flex items-start gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
                <p>
                  Haz clic en una celda para elegir una idea o escribir tu comida. La lista de compras no calcula
                  cantidades ni sustituye la orientación de un profesional de nutrición.
                </p>
              </div>
            </section>

            <div className="space-y-6">
              <section
                aria-labelledby="meal-planner-shopping-title"
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 id="meal-planner-shopping-title" className="text-lg font-bold">
                      Lista de compras
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                      {ingredients.length === 0
                        ? "Se genera con las comidas que planifiques."
                        : `${ingredients.length} ${ingredients.length === 1 ? "ingrediente" : "ingredientes"} · ${checkedCount} ${checkedCount === 1 ? "marcado" : "marcados"}`}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cuerpo-lighter text-cuerpo-darkest dark:bg-cuerpo-dark dark:text-gray-900">
                    <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                {ingredients.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-4 text-sm leading-relaxed text-gray-600 dark:border-gray-600 dark:text-gray-300">
                    Aún no hay ingredientes. Añade una idea con ingredientes o escribe los tuyos al planificar una comida.
                  </div>
                ) : (
                  <ul className="mt-4 grid gap-x-8 gap-y-0.5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Ingredientes de la semana">
                    {ingredients.map((ingredient) => {
                      const checked = weekPlan.checked[ingredient.key] === true
                      return (
                        <li key={ingredient.key}>
                          <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleIngredient(ingredient.key)}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-cuerpo-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cuerpo dark:accent-cuerpo-light dark:focus-visible:ring-cuerpo-light"
                              data-interactive="true"
                            />
                            <span
                              className={cn(
                                "min-w-0 text-sm leading-snug",
                                checked
                                  ? "text-gray-500 line-through dark:text-gray-400"
                                  : "text-gray-800 dark:text-gray-100",
                              )}
                            >
                              {ingredient.label}
                              {ingredient.count > 1 ? (
                                <span className="ml-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                                  · {ingredient.count} comidas
                                </span>
                              ) : null}
                            </span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                )}

                <p className="mt-3 border-t border-gray-200 pt-3 text-xs leading-relaxed text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Son ingredientes, no cantidades: revisa tu despensa y ajusta las porciones en casa.
                </p>
              </section>

              <section
                aria-labelledby="meal-planner-tips-title"
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
                  <h2 id="meal-planner-tips-title" className="text-sm font-semibold">
                    Para que la semana funcione
                  </h2>
                </div>
                <ul className="mt-3 grid gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:grid-cols-3">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
                    <span>Empieza por las cenas o los almuerzos que más se te complican.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
                    <span>Repite platos: cocinar una vez y comer dos días ahorra tiempo.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cuerpo-darkest dark:text-cuerpo-light" aria-hidden="true" />
                    <span>La lista es una guía; ajusta porciones, alergias y lo que ya tengas.</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6" aria-busy="true" aria-label="Cargando tu planificador">
          <div className="h-11 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-[34rem] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {selectedSlot ? (
        <MealEditor
          dayKey={selectedSlot.dayKey}
          mealType={selectedSlot.type}
          existingMeal={selectedMeal}
          onSave={saveMeal}
          onRemove={removeMeal}
          onClose={closeEditor}
        />
      ) : null}
    </div>
  )
}
