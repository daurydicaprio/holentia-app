import test from "node:test"
import assert from "node:assert/strict"
import { calculateCalories } from "../lib/calculations/calories.ts"

test("calorías: hombre 80 kg, 180 cm, 30 años, actividad moderada", () => {
  const result = calculateCalories({
    weightKg: 80,
    heightCm: 180,
    age: 30,
    sex: "male",
    activityFactor: 1.55,
  })
  assert.ok(result !== null)
  assert.equal(result.bmr, 1780)
  assert.equal(result.maintain, 2759)
  assert.equal(result.lose, 2207)
  assert.equal(result.gain, 3035)
})

test("calorías: mujer 60 kg, 165 cm, 30 años, sedentaria", () => {
  const result = calculateCalories({
    weightKg: 60,
    heightCm: 165,
    age: 30,
    sex: "female",
    activityFactor: 1.2,
  })
  assert.ok(result !== null)
  assert.equal(result.bmr, 1320)
  assert.equal(result.maintain, 1584)
  assert.equal(result.lose, 1320)
  assert.equal(result.gain, 1742)
})

test("calorías: el déficit nunca baja del metabolismo basal", () => {
  const result = calculateCalories({
    weightKg: 45,
    heightCm: 150,
    age: 70,
    sex: "female",
    activityFactor: 1.2,
  })
  assert.ok(result !== null)
  assert.equal(result.lose, Math.max(Math.round(result.maintain * 0.8), result.bmr))
})

test("calorías: entradas inválidas devuelven null", () => {
  assert.equal(
    calculateCalories({ weightKg: 0, heightCm: 180, age: 30, sex: "male", activityFactor: 1.2 }),
    null,
  )
  assert.equal(
    calculateCalories({ weightKg: 80, heightCm: 180, age: 30, sex: "male", activityFactor: 0 }),
    null,
  )
})
