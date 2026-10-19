import { localDayKey } from "@/lib/calendar"
import {
  EMPTY_WEEK_PLAN,
  MEAL_SUGGESTIONS,
  MEAL_TYPES,
  type MealPlannerState,
  type MealSuggestion,
  type MealType,
  type PlannedMeal,
  type WeekPlan,
} from "./meal-planner-data"

const SLOT_KEY_RE = /^(\d{4}-\d{2}-\d{2}):(desayuno|almuerzo|cena)$/

export interface IngredientItem {
  key: string
  label: string
  /** Número de comidas de la semana que usan este ingrediente. */
  count: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object"
}

function normalizeText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : ""
}

export function normalizeIngredientKey(value: string): string {
  return value.trim().toLocaleLowerCase("es")
}

export function mealSlotKey(dayKey: string, type: MealType): string {
  return `${dayKey}:${type}`
}

export function parseIngredientInput(value: string): string[] {
  const seen = new Set<string>()
  const ingredients: string[] = []

  for (const item of value.split(/[,\n;]/)) {
    const label = normalizeText(item, 60)
    if (!label) continue
    const key = normalizeIngredientKey(label)
    if (seen.has(key)) continue
    seen.add(key)
    ingredients.push(label)
    if (ingredients.length >= 12) break
  }

  return ingredients
}

export function mealFromSuggestion(suggestion: MealSuggestion): PlannedMeal {
  return {
    title: suggestion.title,
    note: suggestion.note,
    ingredients: [...suggestion.ingredients],
    suggestionId: suggestion.id,
  }
}

function normalizeMeals(raw: unknown): Record<string, PlannedMeal> {
  if (!isRecord(raw)) return {}
  const meals: Record<string, PlannedMeal> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (!SLOT_KEY_RE.test(key) || !isRecord(value)) continue
    const title = normalizeText(value.title, 80)
    if (!title) continue

    const note = normalizeText(value.note, 160)
    const ingredients = Array.isArray(value.ingredients)
      ? parseIngredientInput(value.ingredients.filter((item): item is string => typeof item === "string").join(", "))
      : []
    const suggestionId =
      typeof value.suggestionId === "string" ? normalizeText(value.suggestionId, 80) : ""

    meals[key] = {
      title,
      note,
      ingredients,
      ...(suggestionId ? { suggestionId } : {}),
    }
  }

  return meals
}

function collectValidIngredientKeys(meals: Record<string, PlannedMeal>): Set<string> {
  return new Set(collectIngredients(meals).map((ingredient) => ingredient.key))
}

function normalizeChecked(raw: unknown, meals: Record<string, PlannedMeal>): Record<string, true> {
  if (!isRecord(raw)) return {}
  const validKeys = collectValidIngredientKeys(meals)
  const checked: Record<string, true> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (value === true && validKeys.has(key)) checked[key] = true
  }

  return checked
}

/** Normaliza lo que venga de localStorage sin romper la app ante datos corruptos. */
export function normalizeMealPlannerState(raw: unknown): MealPlannerState {
  if (!isRecord(raw) || !isRecord(raw.weeks)) return { weeks: {} }

  const weeks: Record<string, WeekPlan> = {}

  for (const [weekKey, value] of Object.entries(raw.weeks)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekKey) || !isRecord(value)) continue
    const meals = normalizeMeals(value.meals)
    const checked = normalizeChecked(value.checked, meals)
    if (Object.keys(meals).length === 0 && Object.keys(checked).length === 0) continue
    weeks[weekKey] = { meals, checked }
  }

  return { weeks }
}

export function getWeekPlan(state: MealPlannerState, weekKey: string): WeekPlan {
  return state.weeks[weekKey] ?? EMPTY_WEEK_PLAN
}

export function collectIngredients(meals: Record<string, PlannedMeal>): IngredientItem[] {
  const map = new Map<string, IngredientItem>()

  for (const meal of Object.values(meals)) {
    for (const ingredient of meal.ingredients) {
      const label = ingredient.trim()
      if (!label) continue
      const key = normalizeIngredientKey(label)
      const current = map.get(key)
      if (current) {
        current.count += 1
      } else {
        map.set(key, { key, label, count: 1 })
      }
    }
  }

  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, "es"))
}

/** Mantiene solo las marcas de compra de ingredientes que siguen en la semana. */
export function pruneChecked(
  checked: Record<string, true>,
  meals: Record<string, PlannedMeal>,
): Record<string, true> {
  const validKeys = collectValidIngredientKeys(meals)
  const next: Record<string, true> = {}
  for (const [key, value] of Object.entries(checked)) {
    if (value === true && validKeys.has(key)) next[key] = true
  }
  return next
}

export function countCompleteDays(
  meals: Record<string, PlannedMeal>,
  weekDays: Date[],
): number {
  return weekDays.filter((day) => {
    const dayKey = localDayKey(day)
    return MEAL_TYPES.every((type) => Boolean(meals[mealSlotKey(dayKey, type.id)]))
  }).length
}

/**
 * Rellena solo los espacios vacíos con ideas que aún no se usen en la semana.
 * Los platos personalizados se conservan.
 */
export function fillEmptyMeals(
  meals: Record<string, PlannedMeal>,
  weekDays: Date[],
): Record<string, PlannedMeal> {
  const next = { ...meals }
  const usedSuggestions = new Set(
    Object.values(meals)
      .map((meal) => meal.suggestionId)
      .filter((id): id is string => Boolean(id)),
  )

  for (const day of weekDays) {
    const dayKey = localDayKey(day)
    for (const type of MEAL_TYPES) {
      const key = mealSlotKey(dayKey, type.id)
      if (next[key]) continue

      const byType = MEAL_SUGGESTIONS.filter((suggestion) => suggestion.type === type.id)
      const unused = byType.filter((suggestion) => !usedSuggestions.has(suggestion.id))
      const candidates = unused.length > 0 ? unused : byType
      const suggestion = candidates[Math.floor(Math.random() * candidates.length)]
      if (!suggestion) continue

      next[key] = mealFromSuggestion(suggestion)
      usedSuggestions.add(suggestion.id)
    }
  }

  return next
}
