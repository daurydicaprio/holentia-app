"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { BadgeCheck, CalendarDays, DollarSign, Gift, HelpCircle, Info, ShieldCheck, Trash2, Wallet } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Salario de Navidad (aguinaldo): duodécima parte del salario ordinario
// devengado en el año (arts. 219–222 del Código de Trabajo). Exento de ISR
// (Ley 30-26, junio 2026) y fuera de la base cotizable de la TSS.
// Pago: a más tardar el 20 de diciembre.
const DRAFT_KEY = draftKey("calculadora-aguinaldo")
const MESES_ANIO = 12

const TOOLTIPS = {
  salario:
    "Tu sueldo fijo mensual antes de descuentos. Solo cuenta el salario ordinario: no incluyas horas extras ni bonificaciones.",
  meses: "Meses que trabajaste durante el año calendario. Si empezaste a mitad de año, ajusta aquí: el aguinaldo se paga proporcional.",
} as const

const inputClass =
  "block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-finanzas-light"

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
}

function parseNumber(formatted: string): number {
  const n = Number.parseFloat(formatted.replace(/,/g, ""))
  return Number.isNaN(n) ? 0 : n
}

const DATOS_LEGALES = [
  { icon: BadgeCheck, title: "Exento de ISR", sub: "Ley 30-26 (2026)" },
  { icon: ShieldCheck, title: "Sin AFP ni ARS", sub: "No cotiza a la TSS" },
  { icon: CalendarDays, title: "Antes del 20 dic", sub: "Fecha límite de pago" },
]

export function AguinaldoCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [salarioInput, setSalarioInput] = useState("")
  const [meses, setMeses] = useState(MESES_ANIO)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Cargar borrador local (patrón D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{ salario?: string; meses?: number }>(DRAFT_KEY, {})
    if (typeof parsed.salario === "string") setSalarioInput(parsed.salario)
    if (typeof parsed.meses === "number" && parsed.meses >= 1 && parsed.meses <= MESES_ANIO) setMeses(parsed.meses)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { salario: salarioInput, meses })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [salarioInput, meses])

  const salario = useMemo(() => parseNumber(salarioInput), [salarioInput])

  const result = useMemo(() => {
    if (!salarioInput.trim() || salario <= 0) return null
    const anual = salario * meses
    return { anual, aguinaldo: anual / MESES_ANIO }
  }, [salario, meses, salarioInput])

  const animated = useCountUp(result?.aguinaldo ?? 0, { duration: 500, decimals: 0 })

  const handleSalarioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalarioInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handleSalarioBlur = () => {
    setSalarioInput(salario > 0 ? formatNumber(salario) : "")
  }

  const clearData = () => {
    setSalarioInput("")
    setMeses(MESES_ANIO)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tus datos</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Dos datos y el resultado se actualiza al instante.
        </p>

        {/* Salario mensual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="salario-mensual" className="block text-sm font-medium">
              Salario mensual ordinario
            </label>
            <div className="relative">
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                data-interactive="true"
                aria-label="Información sobre el salario mensual"
                onMouseEnter={() => setActiveTooltip("salario")}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <HelpCircle size={16} />
              </button>
              {activeTooltip === "salario" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {TOOLTIPS.salario}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <DollarSign className="h-4 w-4" />
            </span>
            <input
              id="salario-mensual"
              type="text"
              inputMode="decimal"
              value={salarioInput}
              onChange={handleSalarioChange}
              onBlur={handleSalarioBlur}
              placeholder="Ej: 45,000"
              className={inputClass}
              data-interactive="true"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Antes de descuentos.</p>
        </div>

        {/* Meses trabajados */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="meses-trabajados" className="block text-sm font-medium">
              Meses trabajados en el año
            </label>
            <div className="relative">
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                data-interactive="true"
                aria-label="Información sobre los meses trabajados"
                onMouseEnter={() => setActiveTooltip("meses")}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <HelpCircle size={16} />
              </button>
              {activeTooltip === "meses" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {TOOLTIPS.meses}
                </div>
              )}
            </div>
          </div>
          <div className="pt-1 text-center">
            <span className="text-4xl font-bold text-finanzas dark:text-finanzas-light">{meses}</span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">de 12 meses</span>
          </div>
          <input
            id="meses-trabajados"
            type="range"
            min={1}
            max={MESES_ANIO}
            step={1}
            value={meses}
            onChange={(e) => setMeses(Number(e.target.value))}
            className="w-full"
            aria-label="Meses trabajados en el año"
            data-interactive="true"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>1</span>
            <span>12</span>
          </div>
        </div>

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
            <p className="font-medium">Escribe tu salario mensual</p>
            <p className="mt-1 text-sm">y aquí verás tu aguinaldo estimado de diciembre.</p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            {/* Hero */}
            <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
              <p className="flex items-center justify-center gap-2 text-sm text-white dark:text-finanzas-lighter">
                <Gift className="h-4 w-4" />
                Tu aguinaldo estimado · diciembre 2026
              </p>
              <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">{formatDOP(animated, 0)}</p>
              <p className="mt-3 text-center text-sm text-white dark:text-finanzas-lighter">
                Lo recibes completo: exento de ISR y sin descuentos de AFP ni ARS.
              </p>
            </div>

            {/* Desglose */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex justify-between gap-3 py-1.5 text-sm">
                <span>
                  Salario ordinario del año
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {meses} {meses === 1 ? "mes" : "meses"} × {formatDOP(salario, 0)}
                  </span>
                </span>
                <span className="whitespace-nowrap font-semibold tabular-nums">{formatDOP(result.anual)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>Duodécima parte (÷ 12)</span>
                <span className="whitespace-nowrap tabular-nums">{formatDOP(result.aguinaldo)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>Descuentos (ISR, AFP, ARS)</span>
                <span className="whitespace-nowrap tabular-nums">RD$ 0.00</span>
              </div>
              <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 py-2 dark:border-gray-700">
                <span className="font-semibold">Neto a recibir</span>
                <span className="whitespace-nowrap font-bold tabular-nums text-finanzas-dark dark:text-finanzas-lighter">
                  {formatDOP(result.aguinaldo)}
                </span>
              </div>
            </div>

            {/* Datos legales */}
            <div className="grid gap-3 sm:grid-cols-3">
              {DATOS_LEGALES.map((item) => (
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

            {/* Nota legal */}
            <div className="flex items-start gap-2 rounded-lg bg-finanzas-lighter p-3 text-xs text-gray-800 dark:bg-finanzas-dark dark:text-gray-200">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-finanzas-dark dark:text-finanzas-light" />
              <span>
                Estimación educativa según los arts. 219–222 del Código de Trabajo y la Ley 30-26. El cálculo legal usa
                el salario ordinario devengado en el año; no incluye horas extras ni bonificaciones.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
