/** IMC = peso (kg) ÷ estatura² (m), redondeado a un decimal. */
export function calculateBmi(weightKg: number, heightCm: number): number | null {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(heightCm) || heightCm <= 0) {
    return null
  }

  const meters = heightCm / 100
  const bmi = weightKg / (meters * meters)
  if (!Number.isFinite(bmi)) return null

  return Math.round(bmi * 10) / 10
}
