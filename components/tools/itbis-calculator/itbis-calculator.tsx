"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { BadgePercent, DollarSign, Info, Percent, Receipt, Trash2, Wallet } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// ITBIS RD: tasa general 18% y tasa reducida 16% (café, azúcar, cacao y
// chocolate, yogurt, mantequilla y grasas comestibles — Guía DGII).
// Modo «agregar»: base × (1 + tasa). Modo «quitar»: total ÷ (1 + tasa).
const DRAFT_KEY = draftKey("calculadora-itbis")

type Mode = "add" | "remove"

const RATES = [
  { value: 18, label: "18% general" },
  { value: 16, label: "16% reducido" },
] as const

type Rate = (typeof RATES)[number]["value"]

const DATOS_ITBIS = [
  { icon: Percent, title: "18% tasa general", sub: "Bienes y servicios gravados" },
  { icon: BadgePercent, title: "16% tasa reducida", sub: "Café, azúcar, cacao, yogurt…" },
  { icon: Receipt, title: "Precio al público", sub: "Suele incluir el ITBIS" },
]

const inputClass =
  "block w-full rounded-md border border-gray-300 bg-white p-3 pl-10 text-base text-gray-900 shadow-sm focus:border-transparent focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-finanzas-light md:text-sm"

const chipClass = (active: boolean) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
    active
      ? "border border-finanzas text-finanzas dark:border-finanzas-light dark:text-finanzas-light"
      : "border border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
  }`

const segClass = (active: boolean) =>
  `rounded-md px-4 py-2 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
    active
      ? "bg-finanzas text-white shadow-sm"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
  }`

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
}

function parseNumber(formatted: string): number {
  const n = Number.parseFloat(formatted.replace(/,/g, ""))
  return Number.isNaN(n) ? 0 : n
}

export function ItbisCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mode, setMode] = useState<Mode>("add")
  const [rate, setRate] = useState<Rate>(18)
  const [montoInput, setMontoInput] = useState("")
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Cargar borrador local (patrón D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{ mode?: string; rate?: number; monto?: string }>(DRAFT_KEY, {})
    if (parsed.mode === "add" || parsed.mode === "remove") setMode(parsed.mode)
    if (parsed.rate === 18 || parsed.rate === 16) setRate(parsed.rate)
    if (typeof parsed.monto === "string") setMontoInput(parsed.monto)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { mode, rate, monto: montoInput })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [mode, rate, montoInput])

  const monto = useMemo(() => parseNumber(montoInput), [montoInput])

  const result = useMemo(() => {
    if (!montoInput.trim() || monto <= 0) return null
    const r = rate / 100
    if (mode === "add") {
      const base = monto
      const itbis = base * r
      const total = base + itbis
      return { base, itbis, total, hero: total }
    }
    const total = monto
    const base = total / (1 + r)
    const itbis = total - base
    return { base, itbis, total, hero: itbis }
  }, [monto, montoInput, mode, rate])

  const animated = useCountUp(result?.hero ?? 0, { duration: 500, decimals: 0 })

  const handleMontoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMontoInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handleMontoBlur = () => {
    setMontoInput(monto > 0 ? formatNumber(monto) : "")
  }

  const selectMode = (next: Mode) => {
    setMode(next)
    triggerHapticFeedback("light")
  }

  const selectRate = (next: Rate) => {
    setRate(next)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setMontoInput("")
    setMode("add")
    setRate(18)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tu cálculo</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Elige el modo, escribe el monto y listo.
        </p>

        {/* Modo */}
        <span className="mb-2 block text-sm font-medium">¿Qué quieres hacer?</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectMode("add")}
            aria-pressed={mode === "add"}
            className={segClass(mode === "add")}
            data-interactive="true"
          >
            Agregar ITBIS
          </button>
          <button
            type="button"
            onClick={() => selectMode("remove")}
            aria-pressed={mode === "remove"}
            className={segClass(mode === "remove")}
            data-interactive="true"
          >
            Quitar ITBIS
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {mode === "add" ? "Tu monto no incluye impuesto." : "Tu monto ya incluye el ITBIS."}
        </p>

        {/* Monto */}
        <label htmlFor="monto-itbis" className="mt-5 mb-2 block text-sm font-medium">
          Monto
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <DollarSign className="h-4 w-4" />
          </span>
          <input
            id="monto-itbis"
            type="text"
            inputMode="decimal"
            value={montoInput}
            onChange={handleMontoChange}
            onBlur={handleMontoBlur}
            placeholder="Ej: 10,000"
            className={inputClass}
            data-interactive="true"
          />
        </div>

        {/* Tasa */}
        <span className="mt-5 mb-2 block text-sm font-medium">Tasa de ITBIS</span>
        <div className="flex flex-wrap gap-2">
          {RATES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectRate(option.value)}
              aria-pressed={rate === option.value}
              className={chipClass(rate === option.value)}
              data-interactive="true"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          El 16% aplica a café, azúcar, cacao y chocolate, yogurt, mantequilla y grasas comestibles.
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
        {!result ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
            <Wallet className="mx-auto mb-4 h-12 w-12 opacity-40" />
            <p className="font-medium">Escribe un monto</p>
            <p className="mt-1 text-sm">y aquí verás la base, el ITBIS y el total.</p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            {/* Hero */}
            <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
              <p className="flex items-center justify-center gap-2 text-sm text-white/85 dark:text-finanzas-lighter">
                <Receipt className="h-4 w-4" />
                {mode === "add" ? "Total con ITBIS" : "ITBIS incluido en tu monto"}
              </p>
              <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">{formatDOP(animated, 0)}</p>
              <p className="mt-3 text-center text-sm text-white/85 dark:text-finanzas-lighter">
                {mode === "add"
                  ? "Base más impuesto, listo para tu factura."
                  : "Es la parte de impuesto dentro de lo que pagaste."}
              </p>
            </div>

            {/* Desglose */}
            <div className="rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
              <div className="flex justify-between gap-3 py-1.5 text-sm">
                <span>Base (sin ITBIS)</span>
                <span className="whitespace-nowrap font-semibold tabular-nums">{formatDOP(result.base)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>ITBIS ({rate}%)</span>
                <span className="whitespace-nowrap tabular-nums">{formatDOP(result.itbis)}</span>
              </div>
              <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 py-2 dark:border-gray-700">
                <span className="font-semibold">Total con ITBIS</span>
                <span className="whitespace-nowrap font-bold tabular-nums text-finanzas-dark dark:text-finanzas-light">
                  {formatDOP(result.total)}
                </span>
              </div>
            </div>

            {/* Datos del ITBIS */}
            <div className="grid gap-3 sm:grid-cols-3">
              {DATOS_ITBIS.map((item) => (
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
                Estimación con las tasas vigentes de la DGII (18% general y 16% reducida). Resultado redondeado a 2
                decimales; para facturación verifica las reglas del comprobante. No es asesoría fiscal.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
