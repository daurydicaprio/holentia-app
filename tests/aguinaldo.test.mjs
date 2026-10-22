import test from "node:test"
import assert from "node:assert/strict"
import { calculateAguinaldo } from "../lib/calculations/aguinaldo.ts"

test("aguinaldo: año completo = un salario mensual", () => {
  const result = calculateAguinaldo(50000, 12)
  assert.equal(result.anual, 600000)
  assert.equal(result.aguinaldo, 50000)
})

test("aguinaldo: medio año = medio salario", () => {
  const result = calculateAguinaldo(50000, 6)
  assert.equal(result.anual, 300000)
  assert.equal(result.aguinaldo, 25000)
})

test("aguinaldo: un mes = una doceava parte", () => {
  const result = calculateAguinaldo(30000, 1)
  assert.equal(result.anual, 30000)
  assert.equal(result.aguinaldo, 2500)
})

test("aguinaldo: no aplica el tope de cinco salarios mínimos", () => {
  const result = calculateAguinaldo(100000, 12)
  assert.equal(result.aguinaldo, 100000)
})
