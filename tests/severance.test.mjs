import test from "node:test"
import assert from "node:assert/strict"
import {
  addMonths,
  calculateSeveranceAmounts,
  diasCesantia,
  diasPreaviso,
  diasVacaciones,
  formatAntiguedad,
  mesesEntre,
  mesesNavidad,
  parseISODate,
} from "../lib/calculations/severance.ts"

const date = (iso) => parseISODate(iso)

function close(actual, expected, epsilon = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `esperado ≈ ${expected}, recibido ${actual}`,
  )
}

test("fechas: parsea ISO y rechaza formatos inválidos", () => {
  assert.equal(date("2025-01-15")?.getFullYear(), 2025)
  assert.equal(date("2025-01-15")?.getMonth(), 0)
  assert.equal(date("2025-01-15")?.getDate(), 15)
  assert.equal(date("15/01/2025"), null)
  assert.equal(date(""), null)
})

test("fechas: addMonths respeta el último día del mes", () => {
  const jan2025 = date("2025-01-31")
  const feb2025 = addMonths(jan2025, 1)
  assert.equal(feb2025.getMonth(), 1)
  assert.equal(feb2025.getDate(), 28)

  const jan2024 = date("2024-01-31")
  const feb2024 = addMonths(jan2024, 1)
  assert.equal(feb2024.getMonth(), 1)
  assert.equal(feb2024.getDate(), 29)
})

test("antigüedad: meses completos y días sobrantes", () => {
  assert.deepEqual(mesesEntre(date("2025-01-01"), date("2025-12-31")), { months: 11, days: 30 })
  assert.deepEqual(mesesEntre(date("2025-01-01"), date("2026-01-01")), { months: 12, days: 0 })
  assert.deepEqual(mesesEntre(date("2025-01-15"), date("2025-07-14")), { months: 5, days: 29 })
  assert.deepEqual(mesesEntre(date("2025-01-15"), date("2025-07-15")), { months: 6, days: 0 })
  assert.deepEqual(mesesEntre(date("2025-12-01"), date("2025-01-01")), { months: 0, days: 0 })
})

test("preaviso: 0 / 7 / 14 / 28 días según antigüedad", () => {
  assert.equal(diasPreaviso(2, 29), 0)
  assert.equal(diasPreaviso(3, 0), 7)
  assert.equal(diasPreaviso(5, 29), 7)
  assert.equal(diasPreaviso(6, 0), 7)
  assert.equal(diasPreaviso(6, 1), 14)
  assert.equal(diasPreaviso(11, 29), 14)
  assert.equal(diasPreaviso(12, 0), 28)
})

test("cesantía: escala y fracción mayor de tres meses", () => {
  assert.equal(diasCesantia(2, 29), 0)
  assert.equal(diasCesantia(3, 0), 6)
  assert.equal(diasCesantia(5, 29), 6)
  assert.equal(diasCesantia(6, 0), 13)
  assert.equal(diasCesantia(11, 29), 13)
  assert.equal(diasCesantia(12, 0), 21)
  assert.equal(diasCesantia(57, 0), 97) // 4 años + 9 meses: 21×4 + 13
  assert.equal(diasCesantia(60, 0), 115) // 5 años: 23×5
  assert.equal(diasCesantia(63, 0), 115) // 3 meses exactos no suman
  assert.equal(diasCesantia(63, 1), 121) // 3 meses + 1 día: +6
  assert.equal(diasCesantia(66, 0), 128) // 5 años + 6 meses: +13
})

test("vacaciones: proporcional hasta el año y 14/18 después", () => {
  assert.equal(diasVacaciones(3, 0), 0)
  assert.equal(diasVacaciones(5, 29), 6)
  assert.equal(diasVacaciones(6, 0), 6)
  assert.equal(diasVacaciones(11, 29), 12)
  assert.equal(diasVacaciones(12, 0), 14)
  assert.equal(diasVacaciones(59, 0), 14)
  assert.equal(diasVacaciones(60, 0), 18)
})

test("Navidad: meses del año calendario, con tope de 12", () => {
  assert.equal(mesesNavidad(date("2025-01-01"), date("2025-12-31")), 12)
  assert.equal(mesesNavidad(date("2025-07-01"), date("2025-12-31")), 6)
  assert.equal(mesesNavidad(date("2025-12-31"), date("2025-12-31")), 1)
  assert.equal(mesesNavidad(date("2024-12-01"), date("2025-01-01")), 1)
})

test("antigüedad legible para el resultado", () => {
  assert.equal(formatAntiguedad(14, 0), "1 año y 2 meses")
  assert.equal(formatAntiguedad(1, 0), "1 mes")
  assert.equal(formatAntiguedad(0, 5), "5 días")
  assert.equal(formatAntiguedad(0, 1), "1 día")
  assert.equal(formatAntiguedad(0, 0), "menos de un mes")
})

test("montos: salario diario ÷ 23.83 y total de prestaciones", () => {
  const result = calculateSeveranceAmounts({
    salario: 50000,
    preavisoDias: 28,
    cesantiaDias: 21,
    vacacionesDias: 14,
    navidadMeses: 12,
  })
  close(result.salarioDiario, 2098.1955518254304)
  close(result.preaviso, 58749.47545111205)
  close(result.cesantia, 44062.106588334034)
  close(result.vacaciones, 29374.737725556024)
  close(result.navidad, 50000)
  close(result.total, 182186.3197650021)
  close(result.mesesDeSalario, 3.6437263953000416)
})
