import test from "node:test"
import assert from "node:assert/strict"
import { ITBIS_GENERAL, ITBIS_REDUCED, calculateItbis } from "../lib/calculations/itbis.ts"

function close(actual, expected, epsilon = 0.000001) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `esperado ≈ ${expected}, recibido ${actual}`,
  )
}

test("ITBIS: agrega la tasa general sobre la base", () => {
  const result = calculateItbis(1000, ITBIS_GENERAL, "add")
  close(result.base, 1000)
  close(result.itbis, 180)
  close(result.total, 1180)
  close(result.hero, 1180)
})

test("ITBIS: quita la tasa general de un total que ya lo incluye", () => {
  const result = calculateItbis(1180, ITBIS_GENERAL, "remove")
  close(result.base, 1000)
  close(result.itbis, 180)
  close(result.total, 1180)
  close(result.hero, 180)
})

test("ITBIS: tasa reducida", () => {
  const add = calculateItbis(1000, ITBIS_REDUCED, "add")
  close(add.itbis, 160)
  close(add.total, 1160)

  const remove = calculateItbis(1160, ITBIS_REDUCED, "remove")
  close(remove.base, 1000)
  close(remove.itbis, 160)
})

test("ITBIS: conserva decimales en montos pequeños", () => {
  const result = calculateItbis(99.99, ITBIS_GENERAL, "add")
  close(result.itbis, 17.9982)
  close(result.total, 117.9882)
})
