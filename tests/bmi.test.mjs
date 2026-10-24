import test from "node:test"
import assert from "node:assert/strict"
import { calculateBmi } from "../lib/calculations/bmi.ts"

test("IMC: 70 kg y 175 cm da 22.9", () => {
  assert.equal(calculateBmi(70, 175), 22.9)
})

test("IMC: 100 kg y 160 cm da 39.1", () => {
  assert.equal(calculateBmi(100, 160), 39.1)
})

test("IMC: entradas inválidas devuelven null", () => {
  assert.equal(calculateBmi(0, 175), null)
  assert.equal(calculateBmi(70, 0), null)
  assert.equal(calculateBmi(Number.NaN, 175), null)
})
