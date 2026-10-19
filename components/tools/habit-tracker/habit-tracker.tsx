"use client"

import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Flame,
  Lock,
  Plus,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { cn } from "@/lib/utils"
import { storageGet, storageRemove, storageSet } from "@/lib/storage"
import { HABIT_ICONS, HabitGlyph } from "./habit-icon"
import {
  EMPTY_HABIT_STATE,
  HABIT_STORAGE_KEY,
  addDays,
  countHabitWeek,
  createHabitId,
  currentHabitStreak,
  formatLongDate,
  formatWeekRange,
  getWeekDays,
  isChecked,
  localDayKey,
  normalizeHabitState,
  parseDayKey,
  startOfWeek,
  type Habit,
  type HabitIconId,
  type HabitState,
} from "./habit-utils"

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const TARGET_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

const SUGGESTIONS: { name: string; icon: HabitIconId; target: number }[] = [
  { name: "Beber 8 vasos de agua", icon: "droplets", target: 7 },
  { name: "Caminar 20 minutos", icon: "footprints", target: 5 },
  { name: "Leer 10 páginas", icon: "book", target: 7 },
  { name: "Dormir 7–8 horas", icon: "moon", target: 7 },
]

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mente dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-mente-light"

const navButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-mente hover:bg-black/5 hover:text-mente-dark disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-mente-light dark:hover:bg-white/10 dark:hover:text-mente-light"

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mente focus-visible:ring-offset-2 dark:focus-visible:ring-mente-light"

export function HabitTracker() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const formRef = useRef<HTMLFormElement | null>(null)
  const skipNextSave = useRef(false)

  const [state, setState] = useState<HabitState>(EMPTY_HABIT_STATE)
  const [mounted, setMounted] = useState(false)
  const [todayKey, setTodayKey] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [weekStartKey, setWeekStartKey] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [icon, setIcon] = useState<HabitIconId>("target")
  const [target, setTarget] = useState(7)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    const now = new Date()
    const today = localDayKey(now)
    setTodayKey(today)
    setSelectedDay(today)
    setWeekStartKey(localDayKey(startOfWeek(now)))
    // La carga inicial no debe crear una clave vacía ni avisar si el navegador bloquea localStorage.
    skipNextSave.current = true
    setState(normalizeHabitState(storageGet<unknown>(HABIT_STORAGE_KEY, EMPTY_HABIT_STATE)))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    setSaveError(!storageSet(HABIT_STORAGE_KEY, state))
  }, [state, mounted])

  const weekDays = weekStartKey ? getWeekDays(parseDayKey(weekStartKey)) : []
  const weekDayKeys = weekDays.map(localDayKey)
  const currentWeekStartKey = todayKey ? localDayKey(startOfWeek(parseDayKey(todayKey))) : null
  const canGoNext = Boolean(weekStartKey && currentWeekStartKey && weekStartKey < currentWeekStartKey)
  const isCurrentWeek = Boolean(weekStartKey && currentWeekStartKey && weekStartKey === currentWeekStartKey)
  const weekScopeLabel = isCurrentWeek ? "esta semana" : "esa semana"
  const isViewingToday = Boolean(selectedDay && todayKey && selectedDay === todayKey && isCurrentWeek)

  const totalHabits = state.habits.length
  const doneSelected = selectedDay
    ? state.habits.filter((habit) => isChecked(state.checkins, habit.id, selectedDay)).length
    : 0
  const pending = totalHabits - doneSelected
  const dayPercent = totalHabits > 0 ? Math.round((doneSelected / totalHabits) * 100) : 0

  const weekDone = state.habits.reduce((total, habit) => {
    const count = countHabitWeek(state.checkins, habit.id, weekDayKeys)
    return total + Math.min(count, habit.target)
  }, 0)
  const weekTarget = state.habits.reduce((total, habit) => total + habit.target, 0)
  const weekPercent = weekTarget > 0 ? Math.round((weekDone / weekTarget) * 100) : 0
  const bestStreak = todayKey
    ? state.habits.reduce(
        (max, habit) => Math.max(max, currentHabitStreak(state.checkins, habit.id, todayKey)),
        0,
      )
    : 0

  const weekLabel = weekStartKey ? formatWeekRange(parseDayKey(weekStartKey)) : "Tu semana"
  const selectedDateLabel = selectedDay ? formatLongDate(selectedDay) : "Tu día"

  const selectDay = (dayKey: string) => {
    if (todayKey && dayKey > todayKey) return
    setSelectedDay(dayKey)
    triggerHapticFeedback("light")
  }

  const moveWeek = (offset: number) => {
    if (!weekStartKey || !todayKey) return
    if (offset > 0 && !canGoNext) return

    const nextStart = addDays(parseDayKey(weekStartKey), offset * 7)
    const currentStart = startOfWeek(parseDayKey(todayKey))
    if (nextStart.getTime() > currentStart.getTime()) return

    const selectedOffset = selectedDay ? (parseDayKey(selectedDay).getDay() + 6) % 7 : 0
    let nextSelected = addDays(nextStart, selectedOffset)
    if (localDayKey(nextSelected) > todayKey) nextSelected = parseDayKey(todayKey)

    setWeekStartKey(localDayKey(nextStart))
    setSelectedDay(localDayKey(nextSelected))
    setDeletingId(null)
    triggerHapticFeedback("light")
  }

  const goToday = () => {
    if (!todayKey) return
    setSelectedDay(todayKey)
    setWeekStartKey(localDayKey(startOfWeek(parseDayKey(todayKey))))
    setDeletingId(null)
    triggerHapticFeedback("light")
  }

  const toggleHabit = (habitId: string) => {
    if (!selectedDay || (todayKey && selectedDay > todayKey)) return

    setState((previous) => {
      const day = { ...(previous.checkins[selectedDay] ?? {}) }
      if (day[habitId]) {
        delete day[habitId]
      } else {
        day[habitId] = true
      }

      const checkins = { ...previous.checkins }
      if (Object.keys(day).length === 0) {
        delete checkins[selectedDay]
      } else {
        checkins[selectedDay] = day
      }
      return { ...previous, checkins }
    })
    triggerHapticFeedback("medium")
  }

  const resetForm = () => {
    setName("")
    setIcon("target")
    setTarget(7)
    setEditingId(null)
    setFormError("")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanName = name.trim().replace(/\s+/g, " ")
    if (!cleanName) {
      setFormError("Escribe un nombre para el hábito.")
      return
    }

    const duplicate = state.habits.some(
      (habit) =>
        habit.id !== editingId &&
        habit.name.toLocaleLowerCase("es") === cleanName.toLocaleLowerCase("es"),
    )
    if (duplicate) {
      setFormError("Ya tienes un hábito con ese nombre.")
      return
    }

    const editingHabit = editingId ? state.habits.find((habit) => habit.id === editingId) : undefined

    if (editingHabit) {
      setState((previous) => ({
        ...previous,
        habits: previous.habits.map((habit) =>
          habit.id === editingHabit.id ? { ...habit, name: cleanName, icon, target } : habit,
        ),
      }))
    } else {
      const newHabit: Habit = {
        id: createHabitId(),
        name: cleanName,
        icon,
        target,
        createdAt: new Date().toISOString(),
      }
      setState((previous) => ({ ...previous, habits: [...previous.habits, newHabit] }))
    }

    resetForm()
    setConfirmClear(false)
    triggerHapticFeedback("medium")
  }

  const addSuggestion = (suggestion: (typeof SUGGESTIONS)[number]) => {
    const exists = state.habits.some(
      (habit) => habit.name.toLocaleLowerCase("es") === suggestion.name.toLocaleLowerCase("es"),
    )
    if (exists) return

    const newHabit: Habit = {
      id: createHabitId(),
      name: suggestion.name,
      icon: suggestion.icon,
      target: suggestion.target,
      createdAt: new Date().toISOString(),
    }
    setState((previous) => ({ ...previous, habits: [...previous.habits, newHabit] }))
    setConfirmClear(false)
    triggerHapticFeedback("medium")
  }

  const startEdit = (habit: Habit) => {
    setEditingId(habit.id)
    setName(habit.name)
    setIcon(habit.icon)
    setTarget(habit.target)
    setFormError("")
    setDeletingId(null)
    setConfirmClear(false)
    triggerHapticFeedback("light")

    if (typeof window !== "undefined") {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      formRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" })
    }
  }

  const deleteHabit = (habitId: string) => {
    setState((previous) => {
      const checkins: HabitState["checkins"] = {}
      for (const [date, day] of Object.entries(previous.checkins)) {
        const nextDay = { ...day }
        delete nextDay[habitId]
        if (Object.keys(nextDay).length > 0) checkins[date] = nextDay
      }
      return {
        habits: previous.habits.filter((habit) => habit.id !== habitId),
        checkins,
      }
    })
    if (editingId === habitId) resetForm()
    setDeletingId(null)
    setConfirmClear(false)
    triggerHapticFeedback("medium")
  }

  const clearAll = () => {
    skipNextSave.current = true
    storageRemove(HABIT_STORAGE_KEY)
    setState(EMPTY_HABIT_STATE)
    setConfirmClear(false)
    setDeletingId(null)
    resetForm()
    triggerHapticFeedback("medium")
  }

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="habit-hero-title"
        className="animate-result-in rounded-2xl border border-mente-border bg-gradient-to-br from-mente to-mente-dark p-6 text-white shadow-lg dark:bg-none dark:bg-mente-glass dark:text-mente-text sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white dark:text-mente-lighter">Tu día</p>
            <h2 id="habit-hero-title" className="mt-1 text-2xl font-bold sm:text-3xl">
              {mounted ? selectedDateLabel : "Tu día"}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white dark:text-mente-lighter">
              {!mounted
                ? "Preparando tu espacio local…"
                : totalHabits === 0
                  ? "Crea tu primer hábito y empieza con una marca pequeña."
                  : pending === 0
                    ? "Todos tus hábitos están marcados. Así se construye."
                    : pending === 1
                      ? `Te queda 1 hábito por marcar ${isViewingToday ? "hoy" : "ese día"}.`
                      : `Te quedan ${pending} hábitos por marcar ${isViewingToday ? "hoy" : "ese día"}.`}
            </p>
          </div>

          {mounted && totalHabits > 0 ? (
            <div className="grid grid-cols-3 gap-4 sm:gap-6" aria-live="polite">
              <div>
                <p className="text-3xl font-bold tabular-nums sm:text-4xl">
                  {doneSelected}
                  <span className="text-lg font-medium text-white dark:text-mente-lighter">/{totalHabits}</span>
                </p>
                <p className="text-xs text-white dark:text-mente-lighter">{isViewingToday ? "hoy" : "ese día"}</p>
              </div>
              <div>
                <p className="text-3xl font-bold tabular-nums sm:text-4xl">
                  {weekDone}
                  <span className="text-lg font-medium text-white dark:text-mente-lighter">/{weekTarget}</span>
                </p>
                <p className="text-xs text-white dark:text-mente-lighter">{weekScopeLabel}</p>
              </div>
              <div>
                <p className="text-3xl font-bold tabular-nums sm:text-4xl">{bestStreak}</p>
                <p className="text-xs text-white dark:text-mente-lighter">racha activa</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/20 bg-black/10 p-4 text-sm leading-relaxed text-white dark:border-white/20 dark:bg-black/20 dark:text-mente-lighter">
              {mounted
                ? "Tu primer hábito puede ser beber agua, caminar o leer. Elige uno y hazlo pequeño."
                : "Cargando tus hábitos desde este navegador…"}
            </div>
          )}
        </div>

        {mounted && totalHabits > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-medium text-white dark:text-mente-lighter">
              <span>Progreso del día</span>
              <span>{dayPercent}%</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-label="Progreso del día"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={dayPercent}
            >
              <div
                className="h-full rounded-full bg-white transition-[width] duration-500"
                style={{ width: `${dayPercent}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section
          aria-labelledby="habit-list-title"
          className="flex flex-col rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800 sm:p-6 lg:col-span-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="habit-list-title" className="text-xl font-bold">
                Hábitos
              </h2>
              <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                {mounted
                  ? `${weekLabel} · ${totalHabits} ${totalHabits === 1 ? "hábito" : "hábitos"}${
                      totalHabits > 0 ? ` · ${weekPercent}% de tu meta` : ""
                    }`
                  : "Tu semana"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveWeek(-1)}
                disabled={!mounted}
                aria-label="Semana anterior"
                className={cn(navButtonClass, focusClass)}
                data-interactive="true"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goToday}
                disabled={!mounted || isViewingToday}
                className={cn(
                  "h-11 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:border-mente hover:bg-black/5 hover:text-mente-dark disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-mente-light dark:hover:bg-white/10 dark:hover:text-mente-light",
                  focusClass,
                )}
                data-interactive="true"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => moveWeek(1)}
                disabled={!mounted || !canGoNext}
                aria-label="Semana siguiente"
                className={cn(navButtonClass, focusClass)}
                data-interactive="true"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {mounted && totalHabits > 0 && weekDays.length > 0 && (
            <div className="mt-4 grid grid-cols-7 gap-1 sm:gap-1.5" role="group" aria-label="Días de la semana">
              {weekDays.map((day, index) => {
                const dayKey = localDayKey(day)
                const isSelected = dayKey === selectedDay
                const isToday = dayKey === todayKey
                const isFuture = Boolean(todayKey && dayKey > todayKey)
                const hasProgress = state.habits.some((habit) => isChecked(state.checkins, habit.id, dayKey))

                return (
                  <button
                    key={dayKey}
                    type="button"
                    disabled={isFuture}
                    aria-pressed={isSelected}
                    aria-label={`${formatLongDate(dayKey)}${isToday ? ", hoy" : ""}`}
                    onClick={() => selectDay(dayKey)}
                    className={cn(
                      "relative flex min-h-[62px] flex-col items-center justify-center rounded-md border px-1 py-2 transition-[colors,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40",
                      isSelected
                        ? "border-mente bg-mente text-white shadow-sm dark:border-mente-light dark:bg-mente-dark dark:text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-mente hover:bg-black/5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-mente-light dark:hover:bg-white/10",
                      focusClass,
                    )}
                    data-interactive="true"
                  >
                    <span className="text-[9px] font-semibold uppercase tracking-wide">
                      {WEEKDAY_LABELS[index]}
                    </span>
                    <span className="text-base font-bold tabular-nums">{day.getDate()}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 h-1.5 w-1.5 rounded-full",
                        isSelected
                          ? hasProgress
                            ? "bg-white"
                            : "bg-white/40"
                          : hasProgress
                            ? "bg-mente dark:bg-mente-light"
                            : "bg-gray-300 dark:bg-gray-600",
                      )}
                    />
                  </button>
                )
              })}
            </div>
          )}

          {!mounted ? (
            <HabitListSkeleton />
          ) : totalHabits === 0 ? (
            <div className="mt-5 flex flex-1 flex-col justify-center rounded-xl border border-dashed border-gray-300 px-5 py-8 text-center dark:border-gray-600">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mente-lighter text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
                <Target className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="font-semibold">Aún no tienes hábitos</p>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Elige uno para empezar. Puedes marcarlo hoy mismo y cambiarlo cuando quieras.
              </p>
              <div className="mx-auto mt-5 grid max-w-xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.name}
                    type="button"
                    onClick={() => addSuggestion(suggestion)}
                    aria-label={`Añadir ${suggestion.name}`}
                    className={cn(
                      "flex min-h-[56px] items-center gap-3 rounded-md border border-gray-200 px-3 py-2 text-left transition-[colors,transform] duration-150 hover:border-mente hover:bg-black/5 active:scale-[0.97] dark:border-gray-700 dark:hover:border-mente-light dark:hover:bg-white/10",
                      focusClass,
                    )}
                    data-interactive="true"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-mente-lighter text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
                      <HabitGlyph icon={suggestion.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{suggestion.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.target} días/semana
                      </span>
                    </span>
                    <Plus className="ml-auto h-4 w-4 flex-shrink-0 text-mente-dark dark:text-mente-light" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="mt-5 space-y-3" aria-label="Tus hábitos">
              {state.habits.map((habit) => {
                const checked = selectedDay ? isChecked(state.checkins, habit.id, selectedDay) : false
                const weekCount = countHabitWeek(state.checkins, habit.id, weekDayKeys)
                const streak = todayKey ? currentHabitStreak(state.checkins, habit.id, todayKey) : 0
                const dayLabel = selectedDay ? formatLongDate(selectedDay) : "el día seleccionado"

                return (
                  <li
                    key={habit.id}
                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-mente-lighter text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
                        <HabitGlyph icon={habit.icon} className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{habit.name}</p>
                            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                              {weekCount >= habit.target
                                ? `Meta semanal cumplida · ${weekCount} ${weekCount === 1 ? "día" : "días"}`
                                : `${weekCount}/${habit.target} ${weekScopeLabel}`}
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-pressed={checked}
                            aria-label={`${checked ? "Desmarcar" : "Marcar"} ${habit.name} el ${dayLabel}`}
                            onClick={() => toggleHabit(habit.id)}
                            className={cn(
                              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 transition-[colors,transform] duration-150 active:scale-[0.97]",
                              checked
                                ? "border-mente bg-mente text-white hover:bg-mente-dark dark:border-mente-light dark:bg-mente-light dark:text-black dark:hover:bg-mente-lighter"
                                : "border-gray-400 bg-white text-gray-500 hover:border-mente hover:text-mente dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-mente-light dark:hover:text-mente-light",
                              focusClass,
                            )}
                            data-interactive="true"
                          >
                            <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-1" aria-hidden="true">
                            {weekDays.map((day) => {
                              const done = isChecked(state.checkins, habit.id, localDayKey(day))
                              return (
                                <span
                                  key={localDayKey(day)}
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    done ? "bg-mente dark:bg-mente-light" : "bg-gray-200 dark:bg-gray-600",
                                  )}
                                />
                              )
                            })}
                          </div>

                          <div className="flex items-center gap-1">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-xs font-medium",
                                streak > 0
                                  ? "text-mente-dark dark:text-mente-lighter"
                                  : "text-gray-500 dark:text-gray-400",
                              )}
                            >
                              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="sr-only">Racha actual: </span>
                              {streak} {streak === 1 ? "día" : "días"}
                            </span>
                            <button
                              type="button"
                              onClick={() => startEdit(habit)}
                              aria-label={`Editar ${habit.name}`}
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-mente-dark dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-mente-light",
                                focusClass,
                              )}
                              data-interactive="true"
                            >
                              <Edit2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(habit.id)}
                              aria-label={`Eliminar ${habit.name}`}
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-red-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-red-400",
                                focusClass,
                              )}
                              data-interactive="true"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {deletingId === habit.id && (
                          <div
                            role="alert"
                            className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30"
                          >
                            <p className="min-w-0 flex-1 text-xs text-red-700 dark:text-red-300">
                              ¿Eliminar «{habit.name}» y todo su historial?
                            </p>
                            <button
                              type="button"
                              onClick={() => deleteHabit(habit.id)}
                              className={cn(
                                "h-10 rounded-md bg-red-700 px-3 text-xs font-medium text-white transition-colors hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500",
                                focusClass,
                              )}
                              data-interactive="true"
                            >
                              Sí, eliminar
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              className={cn(
                                "h-10 rounded-md border border-gray-300 px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-black/5 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-white/10",
                                focusClass,
                              )}
                              data-interactive="true"
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <span
              role="status"
              className={cn(
                "inline-flex items-center gap-1.5 text-xs",
                saveError
                  ? "text-red-700 dark:text-red-300"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              {saveError ? (
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {saveError ? "No pudimos guardar en este navegador" : "Se guarda en tu navegador"}
            </span>

            {mounted && totalHabits > 0 && (
              <>
                {confirmClear ? (
                  <div className="flex flex-wrap items-center gap-2" role="alert">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      ¿Borrar todos los hábitos y su historial?
                    </span>
                    <button
                      type="button"
                      onClick={clearAll}
                      className={cn(
                        "h-10 rounded-md bg-red-700 px-3 text-xs font-medium text-white transition-colors hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500",
                        focusClass,
                      )}
                      data-interactive="true"
                    >
                      Sí, borrar todo
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className={cn(
                        "h-10 rounded-md border border-gray-300 px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-black/5 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-white/10",
                        focusClass,
                      )}
                      data-interactive="true"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className={cn(
                      "flex h-10 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-gray-500 transition-colors hover:bg-black/5 hover:text-red-600 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-red-400",
                      focusClass,
                    )}
                    data-interactive="true"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Borrar todo
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="lg:col-span-2">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{editingId ? "Editar hábito" : "Añadir un hábito"}</h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {editingId
                    ? "Ajusta el nombre, el icono o tu meta semanal."
                    : "Elige algo pequeño y concreto. Dos minutos bastan para empezar."}
                </p>
              </div>
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-mente-lighter text-mente-dark dark:bg-mente-dark dark:text-mente-lighter">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <label htmlFor="habit-name" className="mt-5 mb-2 block text-sm font-medium">
              Nombre del hábito
            </label>
            <input
              id="habit-name"
              type="text"
              value={name}
              maxLength={60}
              onChange={(event) => {
                setName(event.target.value)
                if (formError) setFormError("")
              }}
              placeholder="Ej: Caminar 20 minutos"
              className={inputClass}
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? "habit-form-error" : undefined}
              data-interactive="true"
            />

            <span id="habit-icon-label" className="mt-4 mb-2 block text-sm font-medium">
              Icono
            </span>
            <div role="group" aria-labelledby="habit-icon-label" className="grid grid-cols-5 gap-2">
              {HABIT_ICONS.map((option) => {
                const Icon = option.Icon
                const active = icon === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={option.label}
                    onClick={() => {
                      setIcon(option.id)
                      triggerHapticFeedback("light")
                    }}
                    className={cn(
                      "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-[10px] font-medium leading-tight transition-[colors,transform] duration-150 active:scale-[0.97]",
                      active
                        ? "border-mente bg-mente-lighter text-mente-dark dark:border-mente-light dark:bg-mente-dark dark:text-mente-lighter"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-black/5 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-white/10",
                      focusClass,
                    )}
                    data-interactive="true"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>

            <span id="habit-target-label" className="mt-4 mb-2 block text-sm font-medium">
              Días por semana
            </span>
            <div role="group" aria-labelledby="habit-target-label" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {TARGET_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={target === option}
                  aria-label={`${option} ${option === 1 ? "día" : "días"} por semana`}
                  onClick={() => {
                    setTarget(option)
                    triggerHapticFeedback("light")
                  }}
                  className={cn(
                    "h-11 rounded-md border text-sm font-semibold transition-[colors,transform] duration-150 active:scale-[0.97]",
                    target === option
                      ? "border-mente bg-mente-dark text-white dark:border-mente-light dark:bg-mente-light dark:text-black"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-black/5 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-white/10",
                    focusClass,
                  )}
                  data-interactive="true"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Tu meta semanal. Puedes marcar cualquier día hasta hoy, aunque superes la meta.
            </p>

            {formError && (
              <p
                id="habit-form-error"
                role="alert"
                className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={name.trim().length === 0}
              className={cn(
                "mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-mente-dark px-4 text-sm font-medium text-white transition-[colors,transform] duration-150 hover:bg-mente-darkest active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 dark:bg-mente-light dark:text-black dark:hover:bg-mente-lighter",
                focusClass,
              )}
              data-interactive="true"
            >
              {editingId ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              {editingId ? "Guardar cambios" : "Añadir hábito"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className={cn(
                  "mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-300 text-sm font-medium text-gray-600 transition-colors hover:bg-black/5 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-white/10",
                  focusClass,
                )}
                data-interactive="true"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Cancelar edición
              </button>
            )}

            <p className="mt-4 border-t border-gray-200 pt-3 text-xs leading-relaxed text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Se guarda solo en tu navegador. Sin cuenta ni servidores.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Para acompañar tu rutina:{" "}
              <Link
                href="/diario-guiado"
                data-interactive="true"
                className="font-medium text-mente-dark underline-offset-2 hover:underline dark:text-mente-lighter"
              >
                Diario guiado
              </Link>{" "}
              ·{" "}
              <Link
                href="/tecnicas-respiracion"
                data-interactive="true"
                className="font-medium text-mente-dark underline-offset-2 hover:underline dark:text-mente-lighter"
              >
                Respiración guiada
              </Link>
            </p>
          </form>
        </aside>
      </div>
    </div>
  )
}

function HabitListSkeleton() {
  return (
    <div className="mt-5 space-y-3" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gray-100 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-700" />
              <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-700" />
            </div>
            <div className="h-11 w-11 rounded-full bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  )
}
