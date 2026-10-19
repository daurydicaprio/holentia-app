/** Utilidades de calendario local compartidas por herramientas semanales. */

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
