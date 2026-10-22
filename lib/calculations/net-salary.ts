// Sueldo neto RD: TSS (SFS 3.04% + AFP 2.87%) e ISR de asalariados.
// Tasas y topes 2026 (Resolución 01-2025 de la TSS; escala DGII).
export const SFS_RATE = 0.0304
export const AFP_RATE = 0.0287
export const SFS_CAP = 232230
export const AFP_CAP = 464460

export const ISR_EXEMPT_UP_TO = 416220.01
export const ISR_15_UP_TO = 624329
export const ISR_20_UP_TO = 867123
export const ISR_20_FIXED = 31216
export const ISR_25_FIXED = 79776

export interface NetSalaryResult {
  bruto: number
  otrosDescuentos: number
  sfs: number
  afp: number
  tss: number
  baseIsrAnual: number
  tramo: string
  isrMensual: number
  totalDescuentos: number
  netoMensual: number
  netoQuincena: number
  netoAnual: number
  tasaDescuentos: number
  sfsTope: boolean
  afpTope: boolean
}

export function tramoIsr(baseAnual: number): string {
  if (baseAnual <= ISR_EXEMPT_UP_TO) return "Exento"
  if (baseAnual <= ISR_15_UP_TO) return "15%"
  if (baseAnual <= ISR_20_UP_TO) return "20%"
  return "25%"
}

export function isrAnual(baseAnual: number): number {
  if (baseAnual <= ISR_EXEMPT_UP_TO) return 0
  if (baseAnual <= ISR_15_UP_TO) return (baseAnual - ISR_EXEMPT_UP_TO) * 0.15
  if (baseAnual <= ISR_20_UP_TO) return ISR_20_FIXED + (baseAnual - (ISR_15_UP_TO + 0.01)) * 0.2
  return ISR_25_FIXED + (baseAnual - (ISR_20_UP_TO + 0.01)) * 0.25
}

export function calculateNetSalary(salario: number, otrosDescuentos = 0): NetSalaryResult {
  const otros = Math.max(0, otrosDescuentos)
  const sfs = Math.min(salario, SFS_CAP) * SFS_RATE
  const afp = Math.min(salario, AFP_CAP) * AFP_RATE
  const tss = sfs + afp
  const baseIsrAnual = Math.max(0, (salario - tss) * 12)
  const isrMensual = isrAnual(baseIsrAnual) / 12
  const totalDescuentos = tss + isrMensual + otros
  const netoMensual = salario - totalDescuentos

  return {
    bruto: salario,
    otrosDescuentos: otros,
    sfs,
    afp,
    tss,
    baseIsrAnual,
    tramo: tramoIsr(baseIsrAnual),
    isrMensual,
    totalDescuentos,
    netoMensual,
    netoQuincena: netoMensual / 2,
    netoAnual: netoMensual * 12,
    tasaDescuentos: (totalDescuentos / salario) * 100,
    sfsTope: salario > SFS_CAP,
    afpTope: salario > AFP_CAP,
  }
}
