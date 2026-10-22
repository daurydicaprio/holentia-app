import test from "node:test"
import assert from "node:assert/strict"
import {
  AFP_CAP,
  SFS_CAP,
  calculateNetSalary,
  isrAnual,
  tramoIsr,
} from "../lib/calculations/net-salary.ts"

function close(actual, expected, epsilon = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `esperado ≈ ${expected}, recibido ${actual}`,
  )
}

test("sueldo neto: 50,000 bruto cae en el tramo 15% y descuenta TSS + ISR", () => {
  const result = calculateNetSalary(50000)
  close(result.sfs, 1520)
  close(result.afp, 1435)
  close(result.tss, 2955)
  close(result.baseIsrAnual, 564540)
  close(result.isrMensual, 1854)
  close(result.netoMensual, 45191)
  assert.equal(result.tramo, "15%")
  assert.equal(result.sfsTope, false)
  assert.equal(result.afpTope, false)
})

test("sueldo neto: 30,000 queda exento de ISR", () => {
  const result = calculateNetSalary(30000)
  close(result.tss, 1773)
  close(result.isrMensual, 0)
  close(result.netoMensual, 28227)
  assert.equal(result.tramo, "Exento")
})

test("sueldo neto: aplica topes de SFS y AFP", () => {
  const result = calculateNetSalary(500000)
  close(result.sfs, SFS_CAP * 0.0304)
  close(result.afp, AFP_CAP * 0.0287)
  assert.equal(result.sfsTope, true)
  assert.equal(result.afpTope, true)
  assert.equal(result.tramo, "25%")
})

test("sueldo neto: otros descuentos se restan después de TSS e ISR", () => {
  const sinOtros = calculateNetSalary(50000)
  const conOtros = calculateNetSalary(50000, 1000)
  close(conOtros.netoMensual, sinOtros.netoMensual - 1000)
  close(conOtros.otrosDescuentos, 1000)
})

test("ISR: límites de los tramos", () => {
  assert.equal(tramoIsr(416220.01), "Exento")
  assert.equal(tramoIsr(416220.02), "15%")
  assert.equal(tramoIsr(624329), "15%")
  assert.equal(tramoIsr(624329.01), "20%")
  assert.equal(tramoIsr(867123), "20%")
  assert.equal(tramoIsr(867123.01), "25%")
  assert.equal(isrAnual(416220.01), 0)
  close(isrAnual(624329), 31216.3485)
  close(isrAnual(624329.01), 31216)
  close(isrAnual(867123.01), 79776)
})
