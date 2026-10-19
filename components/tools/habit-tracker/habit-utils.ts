export const HABIT_STORAGE_KEY = "holentia:seguimiento-habitos:entries:v1"

export type HabitIconId =
  | "target"
  | "droplets"
  | "footprints"
  | "book"
  | "brain"
  | "dumbbell"
  | "salad"
  | "moon"
  | "pen"
  | "heart"

export const HABIT_ICON_IDS: HabitIconId[] = [
  "target",
  "droplets",
  "footprints",
  "book",
  "brain",
  "dumbbell",
  "salad",
  "moon",
  "pen",
  "heart",
]

export interface Habit {
  id: string
  name: string
  icon: HabitIconId
  target: number
  createdAt: string
}

export type HabitCheckins = Record<string, Record<string, true>>

export interface HabitState {
  habits: Habit[]
  checkins: HabitCheckins
}

export const EMPTY_HABIT_STATE: HabitState = {
  habits: [],
  checkins: {},
}

export function isHabitIconId(value: unknown): value is HabitIconId {
  return typeof value === "string" && HABIT_ICON_IDS.includes(value as HabitIconId)
}

function isIsoDay(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

/** Normaliza lo que venga de localStorage: descarta formas viejas o corruptas sin romper la app. */
export function normalizeHabitState(raw: unknown): HabitState {
  if (!raw || typeof raw !== "object") return EMPTY_HABIT_STATE

  const candidate = raw as { habits?: unknown; checkins?: unknown }
  if (!Array.isArray(candidate.habits)) return EMPTY_HABIT_STATE

  const seen = new Set<string>()
  const habits: Habit[] = []

  for (const item of candidate.habits) {
    if (!item || typeof item !== "object") continue
    const habit = item as Partial<Habit>
    if (typeof habit.id !== "string" || habit.id.length === 0 || seen.has(habit.id)) continue
    if (typeof habit.name !== "string" || habit.name.trim().length === 0) continue
    if (!isHabitIconId(habit.icon)) continue
    if (typeof habit.target !== "number" || !Number.isFinite(habit.target)) continue

    seen.add(habit.id)
    habits.push({
      id: habit.id,
      name: habit.name.trim().slice(0, 60),
      icon: habit.icon,
      target: Math.min(7, Math.max(1, Math.round(habit.target))),
      createdAt: typeof habit.createdAt === "string" ? habit.createdAt : new Date().toISOString(),
    })
  }

  const checkins: HabitCheckins = {}
  if (candidate.checkins && typeof candidate.checkins === "object") {
    for (const [date, value] of Object.entries(candidate.checkins)) {
      if (!isIsoDay(date) || !value || typeof value !== "object") continue
      const day: Record<string, true> = {}
      for (const [habitId, checked] of Object.entries(value)) {
        if (checked === true && seen.has(habitId)) day[habitId] = true
      }
      if (Object.keys(day).length > 0) checkins[date] = day
    }
  }

  return { habits, checkins }
}

export function createHabitId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function localDayKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function parseDayKey(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  next.setDate(next.getDate() + days)
  return next
}

/** Semana que empieza en lunes (convención de RD y de la UI). */
export function startOfWeek(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const mondayOffset = (copy.getDay() + 6) % 7
  copy.setDate(copy.getDate() - mondayOffset)
  return copy
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

export function isChecked(checkins: HabitCheckins, habitId: string, iso: string): boolean {
  return checkins[iso]?.[habitId] === true
}

export function countHabitWeek(checkins: HabitCheckins, habitId: string, weekDays: string[]): number {
  return weekDays.reduce((total, date) => total + (isChecked(checkins, habitId, date) ? 1 : 0), 0)
}

/**
 * Racha actual: días seguidos con marca. Si hoy aún no está marcado, cuenta desde ayer
 * (así el día en curso no parece una ruptura antes de que termine).
 */
export function currentHabitStreak(checkins: HabitCheckins, habitId: string, todayKey: string): number {
  let cursor = parseDayKey(todayKey)
  if (!isChecked(checkins, habitId, localDayKey(cursor))) {
    cursor = addDays(cursor, -1)
  }

  let streak = 0
  while (isChecked(checkins, habitId, localDayKey(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function formatLongDate(iso: string): string {
  const text = parseDayKey(iso).toLocaleDateString("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6)
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth()
  const startMonth = weekStart.toLocaleDateString("es-DO", { month: "short" })
  const endMonth = weekEnd.toLocaleDateString("es-DO", { month: "short" })
  const startText = sameMonth
    ? String(weekStart.getDate())
    : `${weekStart.getDate()} ${startMonth}`
  return `${startText} – ${weekEnd.getDate()} ${endMonth} ${weekEnd.getFullYear()}`
}
