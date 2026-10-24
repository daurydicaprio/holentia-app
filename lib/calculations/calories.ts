export type CalorieSex = "male" | "female"

export interface CalorieInput {
  weightKg: number
  heightCm: number
  age: number
  sex: CalorieSex
  activityFactor: number
}

export interface CalorieResult {
  bmr: number
  weightKg: number
  lose: number
  maintain: number
  gain: number
}

/**
 * Mifflin-St Jeor + factor de actividad.
 * Bajar: déficit del 20% sin bajar del metabolismo basal.
 * Subir: superávit del 10%.
 */
export function calculateCalories(input: CalorieInput): CalorieResult | null {
  const { weightKg, heightCm, age, sex, activityFactor } = input
  if (
    !Number.isFinite(weightKg) ||
    weightKg <= 0 ||
    !Number.isFinite(heightCm) ||
    heightCm <= 0 ||
    !Number.isFinite(age) ||
    age <= 0 ||
    !Number.isFinite(activityFactor) ||
    activityFactor <= 0
  ) {
    return null
  }

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161)
  const tdee = Math.round(bmr * activityFactor)

  return {
    bmr: Math.round(bmr),
    weightKg,
    lose: Math.max(Math.round(tdee * 0.8), Math.round(bmr)),
    maintain: tdee,
    gain: Math.round(tdee * 1.1),
  }
}
