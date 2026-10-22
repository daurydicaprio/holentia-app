// ITBIS RD: tasa general 18% y reducida 16%.
// Modo «agregar»: base × (1 + tasa). Modo «quitar»: total ÷ (1 + tasa).
export type ItbisMode = "add" | "remove"

export interface ItbisResult {
  base: number
  itbis: number
  total: number
  hero: number
}

export function calculateItbis(monto: number, rate: number, mode: ItbisMode): ItbisResult {
  const r = rate / 100
  if (mode === "add") {
    const base = monto
    const itbis = base * r
    const total = base + itbis
    return { base, itbis, total, hero: total }
  }

  const total = monto
  const base = total / (1 + r)
  const itbis = total - base
  return { base, itbis, total, hero: itbis }
}
