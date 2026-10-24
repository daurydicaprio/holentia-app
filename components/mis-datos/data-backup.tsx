"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import {
  applyImport,
  createExportPayload,
  downloadJson,
  parseImportPayload,
  readHolentiaData,
  MAX_IMPORT_BYTES,
} from "@/lib/data-export"

interface ImportPreview {
  keys: Record<string, string>
  exportedAt: string
  fileName: string
  bytes: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("es-DO", { dateStyle: "long", timeStyle: "short" }).format(new Date(value))
  } catch {
    return value
  }
}

export function DataBackup() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [exportSummary, setExportSummary] = useState<{ keys: number; bytes: number } | null>(null)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [reading, setReading] = useState(false)

  const handleExport = () => {
    const keys = readHolentiaData(window.localStorage)
    const payload = createExportPayload(keys)
    const serialized = JSON.stringify(payload, null, 2)
    const bytes = new TextEncoder().encode(serialized).length

    downloadJson(`holentia-mis-datos-${payload.exportedAt.slice(0, 10)}.json`, payload)
    setExportSummary({ keys: Object.keys(keys).length, bytes })
    setMessage({ type: "ok", text: "Backup descargado. Guárdalo en un lugar privado." })
    setPreview(null)
    triggerHapticFeedback("medium")
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setReading(true)
    setMessage(null)
    try {
      if (file.size > MAX_IMPORT_BYTES) {
        setPreview(null)
        setMessage({ type: "error", text: "El archivo supera el límite de 5 MB." })
        return
      }
      const text = await file.text()
      const result = parseImportPayload(text)
      if (!result.ok) {
        setPreview(null)
        setMessage({ type: "error", text: result.error })
        return
      }
      const values = Object.values(result.keys)
      const bytes = new TextEncoder().encode(text).length
      setPreview({
        keys: result.keys,
        exportedAt: result.exportedAt,
        fileName: file.name,
        bytes,
      })
      setMessage(null)
      triggerHapticFeedback("light")
    } catch {
      setPreview(null)
      setMessage({ type: "error", text: "No se pudo leer el archivo. Inténtalo de nuevo." })
    } finally {
      setReading(false)
      event.target.value = ""
    }
  }

  const handleImport = () => {
    if (!preview) return
    try {
      const written = applyImport(window.localStorage, preview.keys)
      setMessage({
        type: "ok",
        text: `Datos importados: ${written} ${written === 1 ? "clave" : "claves"}. Abre la herramienta para verlos.`,
      })
      setPreview(null)
      setExportSummary(null)
      triggerHapticFeedback("medium")
    } catch {
      setMessage({
        type: "error",
        text: "No se pudo guardar la importación. Puede que el almacenamiento esté lleno o bloqueado.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed ${
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-200"
              : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-200"
          }`}
        >
          {message.type === "ok" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          )}
          <p>{message.text}</p>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <Download className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Descargar mis datos</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Un archivo JSON con tus borradores, diarios y registros.</p>
          </div>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          El archivo se genera en tu navegador. Incluye las claves <code className="text-xs">holentia:*</code> de tus
          herramientas y el diario antiguo si todavía existe. No incluye el tema ni claves de otros sitios.
        </p>
        <button
          type="button"
          onClick={handleExport}
          data-interactive="true"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <Download className="h-4 w-4" aria-hidden />
          Descargar backup
        </button>
        {exportSummary && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {exportSummary.keys} {exportSummary.keys === 1 ? "clave" : "claves"} · {formatBytes(exportSummary.bytes)}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <Upload className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Restaurar un backup</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Revisa el contenido antes de escribir nada.</p>
          </div>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Las claves repetidas se reemplazan y las demás se conservan. Si el archivo no es de HOLENTIA o está dañado,
          no se toca tu almacenamiento.
        </p>
        <label
          htmlFor="holentia-backup-file"
          data-interactive="true"
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white dark:focus-within:ring-white dark:focus-within:ring-offset-gray-900"
        >
          <FileJson className="h-4 w-4" aria-hidden />
          {reading ? "Leyendo…" : "Seleccionar archivo"}
        </label>
        <input
          ref={inputRef}
          id="holentia-backup-file"
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          className="sr-only"
        />

        {preview && (
          <div
            aria-live="polite"
            className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-900/20"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Listo para importar {Object.keys(preview.keys).length}{" "}
                  {Object.keys(preview.keys).length === 1 ? "clave" : "claves"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                  {preview.fileName} · {formatBytes(preview.bytes)} · exportado el {formatDate(preview.exportedAt)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                  Esto reemplaza las claves que coincidan. No se puede deshacer desde aquí.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleImport}
                    data-interactive="true"
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-amber-700 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-800"
                  >
                    <Upload className="h-4 w-4" aria-hidden />
                    Importar backup
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    data-interactive="true"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-amber-300 px-4 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/40"
                  >
                    <X className="h-4 w-4" aria-hidden />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-700 dark:text-gray-300" aria-hidden />
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Privacidad del archivo</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              El backup puede contener datos sensibles: tu salario, tus medidas, tus diarios o tus hábitos. No se sube
              a ningún servidor. Guárdalo en un lugar privado y bórralo cuando ya no lo necesites.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Database className="h-3.5 w-3.5" aria-hidden />
              Para borrar todo, usa{" "}
              <Link
                href="/ayuda"
                data-interactive="true"
                className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Borrar mis datos
              </Link>{" "}
              en el Centro de ayuda.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
