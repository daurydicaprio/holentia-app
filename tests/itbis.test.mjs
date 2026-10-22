import test from "node:test"
import assert from "node:assert/strict"
import { calculateItbis } from "../lib/calculations/itbis.ts"

function close(actual, expected, epsilon = 0.000001) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `esperado ≈ ${expected}, recibido ${actual}`,
  )
}

test("ITBIS: agrega 18% sobre la base", () => {
  const result = calculateItbis(1000, 18, "add")
  close(result.base, 1000)
  close(result.itbis, 180)
  close(result.total, 1180)
  close(result.hero, 1180)
})

test("ITBIS: quita 18% de un total que ya lo incluye", () => {
  const result = calculateItbis(1180, 18, "remove")
  close(result.base, 1000)
  close(result.itbis, 180)
  close(result.total, 1180)
  close(result.hero, 180)
})

test("ITBIS: tasa reducida de 16%", () => {
  const add = calculateItbis(1000, 16, "add")
  close(add.itbis, 160)
  close(add.total, 1160)

  const remove = calculateItbis(1160, 16, "remove")
  close(remove.base, 1000)
  close(remove.itbis, 160)
})

test("ITBIS: conserva decimales en montos pequeños", () => {
  const result = calculateItbis(99.99, 18, "add")
  close(result.itbis, 17.9982)
  close(result.total, 117.9882)
})
