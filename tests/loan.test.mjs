import test from "node:test"
import assert from "node:assert/strict"
import { calculateMonthlyPayment, generateAmortizationTable } from "../lib/calculations/loan.ts"

function close(actual, expected, epsilon = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `esperado ≈ ${expected}, recibido ${actual}`,
  )
}

test("préstamo: cuota francesa de 100,000 al 24% a 12 meses", () => {
  close(calculateMonthlyPayment(100000, 24, 12), 9455.96)
})

test("préstamo: tasa 0% reparte el capital en cuotas iguales", () => {
  close(calculateMonthlyPayment(12000, 0, 12), 1000)
})

test("préstamo: la tabla amortiza el capital y cierra en cero", () => {
  const { monthlyPayment, amortizationData } = generateAmortizationTable(100000, 24, 12)
  assert.equal(amortizationData.length, 12)
  assert.equal(amortizationData[0].month, 1)
  close(amortizationData[0].interest, 2000)
  close(amortizationData[0].principal, 7455.96)
  close(amortizationData[0].remainingBalance, 92544.04)

  const totalPrincipal = amortizationData.reduce((sum, row) => sum + row.principal, 0)
  close(totalPrincipal, 100000)
  assert.ok(amortizationData.at(-1).remainingBalance < 0.000001)
  close(amortizationData.at(-1).payment, monthlyPayment)
})

test("préstamo: cuota y total son coherentes con el plazo", () => {
  const monthlyPayment = calculateMonthlyPayment(50000, 18, 24)
  const totalPayment = monthlyPayment * 24
  const totalInterest = totalPayment - 50000
  assert.ok(totalInterest > 0)
  close(totalPayment - totalInterest, 50000)
})
