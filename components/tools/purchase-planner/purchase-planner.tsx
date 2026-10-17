"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import Link from "next/link"
import { ArrowRight, Clock, DollarSign, Info, Percent, ShoppingBag, Trash2, TrendingUp } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Planificador de compras: esperar e ir invirtiendo el dinero mientras esperas.
// Compara comprar hoy (el dinero se va) vs. esperar N meses manteniendo el
// precio invertido a interés compuesto mensual (tasa anual ÷ 12).
const DRAFT_KEY = draftKey("planificador-compras")
const MESES_MAX = 60
const MESES_DEFAULT = 6

const DATOS_COMPRA = [
  { icon: Clock, title: "Espera planificada", sub: "Cada mes que esperas, tu dinero rinde" },
  { icon: TrendingUp, title: "Efecto compuesto", sub: "Tus intereses generan más intereses" },
  { icon: Percent, title: "Rendimiento anual", sub: "Certificados 2026: 7%–11% ref." },
]

const inputClass =
  "block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-finanzas-light"

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
}

function parseNumber(formatted: string): number {
  const n = Number.parseFloat(formatted.replace(/,(?=\d{1,2}$)/, ".").replace(/,/g, ""))
  return Number.isNaN(n) ? 0 : n
}

export function PurchasePlanner() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [precioInput, setPrecioInput] = useState("")
  const [meses, setMeses] = useState(MESES_DEFAULT)
  const [tasaInput, setTasaInput] = useState("")
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Cargar borrador local (patrón D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{ precio?: string; meses?: number; tasa?: string }>(DRAFT_KEY, {})
    if (typeof parsed.precio === "string") setPrecioInput(parsed.precio)
    if (typeof parsed.meses === "number" && parsed.meses >= 1 && parsed.meses <= MESES_MAX) setMeses(parsed.meses)
    if (typeof parsed.tasa === "string") setTasaInput(parsed.tasa)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { precio: precioInput, meses, tasa: tasaInput })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [precioInput, meses, tasaInput])

  const precio = useMemo(() => parseNumber(precioInput), [precioInput])
  const tasa = useMemo(() => parseNumber(tasaInput), [tasaInput])

  const result = useMemo(() => {
    if (precio <= 0 || tasa <= 0) return null
    const r = tasa / 100 / 12
    const ganancia = precio * (Math.pow(1 + r, meses) - 1)
    return { ganancia, total: precio + ganancia, pct: (ganancia / precio) * 100 }
  }, [precio, tasa, meses])

  const animated = useCountUp(result?.ganancia ?? 0, { duration: 500, decimals: 0 })

  const handlePrecioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrecioInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handlePrecioBlur = () => {
    setPrecioInput(precio > 0 ? formatNumber(precio) : "")
  }

  const handleTasaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTasaInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const clearData = () => {
    setPrecioInput("")
    setMeses(MESES_DEFAULT)
    setTasaInput("")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tu compra</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Precio, espera y rendimiento: mira lo que gana la paciencia.
        </p>

        {/* Precio */}
        <label htmlFor="precio-compra" className="mb-2 block text-sm font-medium">
          ¿Cuánto cuesta?
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <DollarSign className="h-4 w-4" />
          </span>
          <input
            id="precio-compra"
            type="text"
            inputMode="decimal"
            value={precioInput}
            onChange={handlePrecioChange}
            onBlur={handlePrecioBlur}
            placeholder="Ej: 60,000"
            className={inputClass}
            data-interactive="true"
          />
        </div>

        {/* Meses */}
        <div className="mt-5 space-y-2">
          <label htmlFor="meses-espera" className="block text-sm font-medium">
            Meses que puedes esperar
          </label>
          <div className="pt-1 text-center">
            <span className="text-4xl font-bold text-finanzas dark:text-finanzas-light">{meses}</span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {meses === 1 ? "mes de espera" : "meses de espera"}
            </span>
          </div>
          <input
            id="meses-espera"
            type="range"
            min={1}
            max={MESES_MAX}
            step={1}
            value={meses}
            onChange={(e) => setMeses(Number(e.target.value))}
            className="w-full"
            aria-label="Meses que puedes esperar antes de comprar"
            data-interactive="true"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>1</span>
            <span>60</span>
          </div>
        </div>

        {/* Rendimiento */}
        <label htmlFor="tasa-compra" className="mt-5 mb-2 block text-sm font-medium">
          Rendimiento anual
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <Percent className="h-4 w-4" />
          </span>
          <input
            id="tasa-compra"
            type="text"
            inputMode="decimal"
            value={tasaInput}
            onChange={handleTasaChange}
            placeholder="Ej: 8"
            className={inputClass}
            data-interactive="true"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Lo que rinde tu dinero mientras esperas. Referencia: certificados 2026, 7%–11% anual.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local" : "Se guarda en tu navegador"}
          </span>
          <button
            type="button"
            onClick={clearData}
            className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            data-interactive="true"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Borrar mis datos
          </button>
        </div>
      </div>

      {/* Resultado */}
      <div className="lg:col-span-3">
        {precio <= 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 opacity-40" />
            <p className="font-medium">Escribe el precio</p>
            <p className="mt-1 text-sm">y verás cuánto te gana esperar antes de comprar.</p>
          </div>
        ) : !result ? (
          <div
            aria-live="polite"
            className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-lg dark:bg-gray-800"
          >
            <Clock className="mb-4 h-12 w-12 text-finanzas dark:text-finanzas-light" />
            <p className="text-xl font-bold">Sin invertir, esperar no gana nada</p>
            <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
              Lo que paga la paciencia es el rendimiento. Añade una tasa estimada —referencia 2026: 7%–11% anual— y
              mira cuánto puede pagarte.
            </p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            {/* Hero */}
            <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
              <p className="flex items-center justify-center gap-2 text-sm text-white dark:text-finanzas-lighter">
                <Clock className="h-4 w-4" />
                La paciencia te paga
              </p>
              <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">{formatDOP(animated, 0)}</p>
              <p className="mt-3 text-center text-sm text-white dark:text-finanzas-lighter">
                Inviertes el precio mientras esperas {meses} {meses === 1 ? "mes" : "meses"} · ≈{" "}
                {result.pct.toFixed(1)}% de la compra.
              </p>
            </div>

            {/* Comparativa */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex justify-between gap-3 py-1.5 text-sm">
                <span>Comprar hoy</span>
                <span className="whitespace-nowrap font-semibold tabular-nums">Pagas {formatDOP(precio)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Esperas {meses} {meses === 1 ? "mes" : "meses"} invirtiendo
                </span>
                <span className="whitespace-nowrap tabular-nums">Tienes {formatDOP(result.total)}</span>
              </div>
              <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 py-2 dark:border-gray-700">
                <span className="font-semibold">Al comprar te quedan</span>
                <span className="whitespace-nowrap font-bold tabular-nums text-finanzas-dark dark:text-finanzas-lighter">
                  + {formatDOP(result.ganancia)}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Asume que el precio no cambia y que tienes el dinero desde hoy.
              </p>
            </div>

            {/* Datos de la decisión */}
            <div className="grid gap-3 sm:grid-cols-3">
              {DATOS_COMPRA.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <item.icon className="h-4 w-4 text-finanzas dark:text-finanzas-light" />
                  <p className="mt-1.5 text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Nota */}
            <div className="flex items-start gap-2 rounded-lg bg-finanzas-lighter p-3 text-xs text-gray-800 dark:bg-finanzas-dark dark:text-gray-200">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-finanzas-dark dark:text-finanzas-light" />
              <span>
                Estimación educativa con interés compuesto mensual. Si el precio sube más de lo que rinde tu dinero
                (inflación o fin de temporada) o si necesitas el producto ya, la comparación cambia. ¿Quieres el
                detalle mes a mes?{" "}
                <Link
                  href="/calculadora-interes-compuesto"
                  className="inline-flex items-center gap-0.5 font-semibold text-finanzas-dark underline underline-offset-2 dark:text-finanzas-lighter"
                  data-interactive="true"
                >
                  Usa la calculadora de interés compuesto
                  <ArrowRight className="h-3 w-3" />
                </Link>
                .
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
