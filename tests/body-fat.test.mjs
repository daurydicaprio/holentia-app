import test from "node:test"
import assert from "node:assert/strict"
import { calculateBodyFat } from "../lib/calculations/body-fat.ts"

function close(actual, expected, epsilon = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `esperado ≈ ${expected}, recibido ${actual}`,
  )
}

test("grasa corporal: hombre 175 cm, cuello 38, cintura 85", () => {
  const bodyFat = calculateBodyFat({ sex: "male", heightCm: 175, neckCm: 38, waistCm: 85 })
  assert.ok(bodyFat !== null)
  close(bodyFat, 16.938)
})

test("grasa corporal: mujer 165 cm, cuello 33, cintura 72, cadera 98", () => {
  const bodyFat = calculateBodyFat({
    sex: "female",
    heightCm: 165,
    neckCm: 33,
    waistCm: 72,
    hipCm: 98,
  })
  assert.ok(bodyFat !== null)
  close(bodyFat, 26.917)
})

test("grasa corporal: medidas imposibles devuelven null", () => {
  assert.equal(calculateBodyFat({ sex: "male", heightCm: 175, neckCm: 90, waistCm: 85 }), null)
  assert.equal(calculateBodyFat({ sex: "female", heightCm: 165, neckCm: 33, waistCm: 72 }), null)
  assert.equal(calculateBodyFat({ sex: "male", heightCm: 0, neckCm: 38, waistCm: 85 }), null)
})
