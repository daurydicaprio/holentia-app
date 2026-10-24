import test from "node:test"
import assert from "node:assert/strict"
import {
  annualFromMonthly,
  simulateInvestmentAnnual,
  simulateInvestmentMonthly,
  summarizeCompound,
} from "../lib/calculations/compound.ts"

function close(actual, expected, epsilon = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `esperado ≈ ${expected}, recibido ${actual}`,
  )
}

test("interés compuesto: aportes mensuales durante un año al 12%", () => {
  const data = simulateInvestmentMonthly(0, 1000, 1, 0.12, 12)
  assert.equal(data.length, 12)
  assert.equal(data[0].period, 1)
  assert.equal(data[0].year, 1)
  close(data[0].interest, 0)
  close(data[0].balance, 1000)
  close(data.at(-1).balance, 12682.503)
})

test("interés compuesto: aportes anuales se aplican una vez al año", () => {
  const monthly = simulateInvestmentMonthly(1000, 1200, 1, 0.12, 1)
  assert.equal(monthly.at(-1).contribution, 1200)
  close(monthly.at(-1).balance, 1000 * 1.01 ** 12 + 1200)
})

test("interés compuesto: simulación anual conserva el factor de aportes mensuales", () => {
  const data = simulateInvestmentAnnual(1000, 100, 1, 0.1, 12)
  close(data[0].contribution, 1253.52)
  close(data[0].balance, 2353.52)

  const annual = simulateInvestmentAnnual(1000, 1200, 1, 0.1, 1)
  close(annual[0].balance, 2300)
})

test("interés compuesto: del detalle mensual sale el cierre de cada año", () => {
  const monthly = simulateInvestmentMonthly(1000, 100, 2, 0.12, 12)
  const annual = annualFromMonthly(monthly, 2)
  assert.equal(annual.length, 2)
  assert.equal(annual[0].period, 12)
  assert.equal(annual[1].period, 24)
  close(annual[1].balance, monthly.at(-1).balance)
})

test("interés compuesto: resumen ajusta por inflación y calcula rendimiento", () => {
  const monthly = simulateInvestmentMonthly(0, 1000, 1, 0.12, 12)
  const annual = annualFromMonthly(monthly, 1)
  const summary = summarizeCompound(annual, {
    initialDeposit: 0,
    contribution: 1000,
    years: 1,
    interestRate: 0.12,
    inflation: 0.04,
    contributionFrequency: 12,
  })
  close(summary.balanceNet, 12194.714)
  close(summary.netGain, 194.714)
  close(summary.totalContributions, 12000)
  close(summary.inflationEffect, 487.789)
  assert.equal(summary.annualizedReturn, "12.00%")
  assert.equal(summary.totalReturn, "1.62%")
  assert.equal(summary.doubleTime, "6.0 años")
})

test("interés compuesto: sin años usa el depósito inicial", () => {
  const summary = summarizeCompound([], {
    initialDeposit: 5000,
    contribution: 1000,
    years: 0,
    interestRate: 0.1,
    inflation: 0.04,
    contributionFrequency: 12,
  })
  assert.equal(summary.balanceNet, 5000)
  assert.equal(summary.totalContributions, 0)
  assert.equal(summary.doubleTime, "7.2 años")
})
