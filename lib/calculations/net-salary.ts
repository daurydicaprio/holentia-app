// Sueldo neto RD: TSS (SFS + AFP) e ISR de asalariados.
// Valores en lib/rates.ts; se reexportan para los componentes y los tests.
import { RATES } from "../rates.ts"

export const SFS_RATE = RATES.tss.sfsRate
export const AFP_RATE = RATES.tss.afpRate
export const SFS_CAP = RATES.tss.sfsCap
export const AFP_CAP = RATES.tss.afpCap

export const ISR_EXEMPT_UP_TO = RATES.isr.exemptUpTo
export const ISR_15_UP_TO = RATES.isr.bracket15UpTo
export const ISR_20_UP_TO = RATES.isr.bracket20UpTo
export const ISR_20_FIXED = RATES.isr.fixed20
export const ISR_25_FIXED = RATES.isr.fixed25

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
