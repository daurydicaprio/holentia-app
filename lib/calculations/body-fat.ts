export type Sex = "male" | "female"

export interface BodyFatInput {
  sex: Sex
  heightCm: number
  neckCm: number
  waistCm: number
  hipCm?: number
}

/**
 * % de grasa corporal por el método US Navy (densidad) y la ecuación de Siri.
 * Devuelve el valor sin redondear; la UI decide cómo mostrarlo.
 */
export function calculateBodyFat(input: BodyFatInput): number | null {
  const { sex, heightCm, neckCm, waistCm, hipCm } = input
  const values = [heightCm, neckCm, waistCm]
  if (hipCm !== undefined) values.push(hipCm)
  if (!values.every((value) => Number.isFinite(value) && value > 0)) return null

  if (sex === "male" && waistCm <= neckCm) return null
  if (sex === "female" && (hipCm === undefined || waistCm + hipCm <= neckCm)) return null

  const density =
    sex === "male"
      ? 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)
      : 1.29579 - 0.35004 * Math.log10(waistCm + (hipCm as number) - neckCm) + 0.221 * Math.log10(heightCm)

  if (!Number.isFinite(density) || density <= 0) return null

  const bodyFat = 495 / density - 450
  if (!Number.isFinite(bodyFat) || bodyFat < 1 || bodyFat > 70) return null

  return bodyFat
}
