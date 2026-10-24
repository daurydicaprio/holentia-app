export const EXPORT_APP = "HOLENTIA"
export const EXPORT_VERSION = 1
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024
export const LEGACY_JOURNAL_KEY = "holentia-journal-entries"

export interface HolentiaExport {
  app: typeof EXPORT_APP
  version: typeof EXPORT_VERSION
  exportedAt: string
  keys: Record<string, string>
}

export type ImportResult =
  | { ok: true; keys: Record<string, string>; exportedAt: string }
  | { ok: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function isHolentiaKey(key: string): boolean {
  return key.startsWith("holentia:") || key === LEGACY_JOURNAL_KEY
}

/** Lee solo las claves de datos de HOLENTIA; ignora tema y claves ajenas. */
export function readHolentiaData(
  storage: Pick<Storage, "length" | "key" | "getItem">,
): Record<string, string> {
  const keys: Record<string, string> = {}
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index)
    if (!key || !isHolentiaKey(key)) continue
    const value = storage.getItem(key)
    if (typeof value === "string") keys[key] = value
  }
  return keys
}

export function createExportPayload(
  keys: Record<string, string>,
  now: Date = new Date(),
): HolentiaExport {
  return {
    app: EXPORT_APP,
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    keys,
  }
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length
}

/** Valida un archivo antes de tocar localStorage. */
export function parseImportPayload(text: string): ImportResult {
  if (byteLength(text) > MAX_IMPORT_BYTES) {
    return { ok: false, error: "El archivo supera el límite de 5 MB." }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: "El archivo no es un JSON válido." }
  }

  if (!isRecord(parsed)) return { ok: false, error: "El archivo no tiene el formato esperado." }
  if (parsed.app !== EXPORT_APP) return { ok: false, error: "El archivo no pertenece a HOLENTIA." }
  if (parsed.version !== EXPORT_VERSION) {
    return { ok: false, error: "La versión del archivo no es compatible con esta app." }
  }
  if (typeof parsed.exportedAt !== "string" || Number.isNaN(Date.parse(parsed.exportedAt))) {
    return { ok: false, error: "La fecha de exportación no es válida." }
  }
  if (!isRecord(parsed.keys)) return { ok: false, error: "El archivo no contiene datos de HOLENTIA." }

  const keys: Record<string, string> = {}
  let totalBytes = 0
  for (const [key, value] of Object.entries(parsed.keys)) {
    if (!isHolentiaKey(key)) {
      return { ok: false, error: `El archivo contiene una clave no permitida: ${key}.` }
    }
    if (typeof value !== "string") {
      return { ok: false, error: `El valor de ${key} no es texto.` }
    }
    totalBytes += byteLength(key) + byteLength(value)
    if (totalBytes > MAX_IMPORT_BYTES) {
      return { ok: false, error: "El contenido supera el límite de 5 MB." }
    }
    keys[key] = value
  }

  return { ok: true, keys, exportedAt: parsed.exportedAt }
}

/**
 * Importa combinando: las claves repetidas se reemplazan y las demás se
 * conservan. Así una importación parcial no borra datos que no venían en el
 * archivo. Devuelve cuántas claves se escribieron.
 */
export function applyImport(storage: Pick<Storage, "setItem">, keys: Record<string, string>): number {
  let written = 0
  for (const [key, value] of Object.entries(keys)) {
    if (!isHolentiaKey(key)) continue
    storage.setItem(key, value)
    written++
  }
  return written
}

/** Descarga un objeto como JSON sin tocar red ni servidores. */
export function downloadJson(filename: string, payload: unknown): void {
  if (typeof window === "undefined") return
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
