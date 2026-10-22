// Prestaciones laborales RD — Código de Trabajo (Ley 16-92).
// Preaviso art. 76 · cesantía art. 80 · vacaciones arts. 177/180 · Navidad art. 219.
// Salario diario de prestaciones: mensual ÷ 23.83 (criterio del Ministerio de Trabajo).
export const DIVISOR_SALARIO_DIARIO = 23.83

export function parseISODate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  const day = d.getDate()
  d.setDate(1)
  d.setMonth(d.getMonth() + months)
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, lastDay))
  return d
}

/** Meses completos entre dos fechas + días sobrantes */
export function mesesEntre(start: Date, end: Date): { months: number; days: number } {
  if (end < start) return { months: 0, days: 0 }
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  let anchor = addMonths(start, months)
  if (anchor > end) {
    months -= 1
    anchor = addMonths(start, months)
  }
  const days = Math.floor((end.getTime() - anchor.getTime()) / 86400000)
  return { months: Math.max(0, months), days }
}

/** Art. 76: 7 días (3–6 meses), 14 (más de 6 meses a 1 año) y 28 (1 año+) */
export function diasPreaviso(months: number, days: number): number {
  if (months < 3) return 0
  if (months < 6 || (months === 6 && days === 0)) return 7
  if (months < 12) return 14
  return 28
}

/** Art. 80: 6 (3 a <6 meses), 13 (6 a <12 meses), 21/año (1 a <5 años) y 23/año (5+); fracción >3 meses según ordinales 1.º y 2.º */
export function diasCesantia(months: number, days: number): number {
  if (months < 3) return 0
  if (months < 6) return 6
  if (months < 12) return 13
  const years = Math.floor(months / 12)
  const rem = months % 12
  const rate = years >= 5 ? 23 : 21
  let total = years * rate
  const fraccionMayorDeTres = rem > 3 || (rem === 3 && days > 0)
  if (fraccionMayorDeTres) total += rem >= 6 ? 13 : 6
  return total
}

/** Arts. 177/180: escala 6–12 días hasta el año; 14 días (1 a <5 años) y 18 (5 años+) */
export function diasVacaciones(months: number, days: number): number {
  if (months < 12) {
    const efectivo = months + (days > 0 ? 1 : 0)
    return efectivo >= 6 ? efectivo : 0
  }
  return Math.floor(months / 12) >= 5 ? 18 : 14
}

/** Meses del año calendario en que trabajó (art. 219) */
export function mesesNavidad(start: Date, end: Date): number {
  const inicioAnio = new Date(end.getFullYear(), 0, 1)
  const efectivo = start > inicioAnio ? start : inicioAnio
  const months =
    (end.getFullYear() - efectivo.getFullYear()) * 12 + (end.getMonth() - efectivo.getMonth()) + 1
  return Math.min(12, Math.max(0, months))
}

export function formatAntiguedad(months: number, days: number): string {
  const years = Math.floor(months / 12)
  const rem = months % 12
  const parts: string[] = []
  if (years > 0) parts.push(`${years} ${years === 1 ? "año" : "años"}`)
  if (rem > 0) parts.push(`${rem} ${rem === 1 ? "mes" : "meses"}`)
  if (parts.length === 0) return days > 0 ? `${days} día${days === 1 ? "" : "s"}` : "menos de un mes"
  return parts.join(" y ")
}

export interface SeveranceAmountsInput {
  salario: number
  preavisoDias: number
  cesantiaDias: number
  vacacionesDias: number
  navidadMeses: number
}

export interface SeveranceAmounts {
  salarioDiario: number
  preaviso: number
  cesantia: number
  vacaciones: number
  navidad: number
  total: number
  mesesDeSalario: number
}

export function calculateSeveranceAmounts({
  salario,
  preavisoDias,
  cesantiaDias,
  vacacionesDias,
  navidadMeses,
}: SeveranceAmountsInput): SeveranceAmounts {
  const salarioDiario = salario / DIVISOR_SALARIO_DIARIO
  const preaviso = preavisoDias * salarioDiario
  const cesantia = cesantiaDias * salarioDiario
  const vacaciones = vacacionesDias * salarioDiario
  const navidad = (navidadMeses / 12) * salario
  const total = preaviso + cesantia + vacaciones + navidad
  return {
    salarioDiario,
    preaviso,
    cesantia,
    vacaciones,
    navidad,
    total,
    mesesDeSalario: total / salario,
  }
}
