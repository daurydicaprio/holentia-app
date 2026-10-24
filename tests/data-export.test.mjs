import test from "node:test"
import assert from "node:assert/strict"
import {
  applyImport,
  createExportPayload,
  parseImportPayload,
  readHolentiaData,
  MAX_IMPORT_BYTES,
} from "../lib/data-export.ts"

class MemoryStorage {
  constructor(entries = {}) {
    this.map = new Map(Object.entries(entries))
  }
  get length() {
    return this.map.size
  }
  key(index) {
    return Array.from(this.map.keys())[index] ?? null
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null
  }
  setItem(key, value) {
    this.map.set(key, String(value))
  }
  removeItem(key) {
    this.map.delete(key)
  }
}

test("backup: solo lee claves de HOLENTIA y el diario legado", () => {
  const storage = new MemoryStorage({
    "theme-preference": '"dark"',
    "holentia:calculadora-imc:draft:v1": '{"weight":"70"}',
    "holentia:diario-guiado:entries:v1": "[]",
    "otra-app:key": "nope",
  })
  assert.deepEqual(readHolentiaData(storage), {
    "holentia:calculadora-imc:draft:v1": '{"weight":"70"}',
    "holentia:diario-guiado:entries:v1": "[]",
  })
})

test("backup: exportar y volver a importar conserva los valores", () => {
  const storage = new MemoryStorage({
    "holentia:calculadora-imc:draft:v1": '{"weight":"70"}',
  })
  const payload = createExportPayload(readHolentiaData(storage), new Date("2026-10-24T12:00:00.000Z"))
  assert.equal(payload.app, "HOLENTIA")
  assert.equal(payload.version, 1)
  assert.equal(payload.exportedAt, "2026-10-24T12:00:00.000Z")

  const result = parseImportPayload(JSON.stringify(payload))
  assert.equal(result.ok, true)
  assert.deepEqual(result.keys, { "holentia:calculadora-imc:draft:v1": '{"weight":"70"}' })
})

test("backup: rechaza archivos que no son de HOLENTIA o tienen otra versión", () => {
  const wrongApp = parseImportPayload(
    JSON.stringify({ app: "OTRA", version: 1, exportedAt: new Date().toISOString(), keys: {} }),
  )
  assert.equal(wrongApp.ok, false)

  const wrongVersion = parseImportPayload(
    JSON.stringify({ app: "HOLENTIA", version: 2, exportedAt: new Date().toISOString(), keys: {} }),
  )
  assert.equal(wrongVersion.ok, false)
})

test("backup: rechaza claves ajenas, valores no textuales y JSON roto", () => {
  const foreign = parseImportPayload(
    JSON.stringify({
      app: "HOLENTIA",
      version: 1,
      exportedAt: new Date().toISOString(),
      keys: { "otra-app:key": "x" },
    }),
  )
  assert.equal(foreign.ok, false)

  const nonString = parseImportPayload(
    JSON.stringify({
      app: "HOLENTIA",
      version: 1,
      exportedAt: new Date().toISOString(),
      keys: { "holentia:x": 1 },
    }),
  )
  assert.equal(nonString.ok, false)

  assert.equal(parseImportPayload("{").ok, false)
})

test("backup: rechaza archivos mayores de 5 MB", () => {
  const result = parseImportPayload("x".repeat(MAX_IMPORT_BYTES + 1))
  assert.equal(result.ok, false)
  assert.match(result.error, /5 MB/)
})

test("backup: importar reemplaza solo las claves que vienen en el archivo", () => {
  const storage = new MemoryStorage({
    "holentia:viejo:v1": "se conserva",
    "holentia:calculadora-imc:draft:v1": "anterior",
  })
  const written = applyImport(storage, {
    "holentia:calculadora-imc:draft:v1": "nuevo",
    "holentia:test-ansiedad:draft:v1": "respuestas",
    "otra-app:key": "no se escribe",
  })
  assert.equal(written, 2)
  assert.equal(storage.getItem("holentia:viejo:v1"), "se conserva")
  assert.equal(storage.getItem("holentia:calculadora-imc:draft:v1"), "nuevo")
  assert.equal(storage.getItem("holentia:test-ansiedad:draft:v1"), "respuestas")
  assert.equal(storage.getItem("otra-app:key"), null)
})
