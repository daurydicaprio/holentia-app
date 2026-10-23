"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import Link from "next/link"
import {
  DollarSign,
  HelpCircle,
  Info,
  Landmark,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"
import { AFP_CAP, SFS_CAP, calculateNetSalary } from "@/lib/calculations/net-salary"
import { RATES } from "@/lib/rates"

// Estimación del sueldo neto del asalariado en RD.
// Tasas, topes y escala ISR en lib/rates.ts; base ISR = bruto − TSS.
const DRAFT_KEY = draftKey("calculadora-sueldo-neto")
const PRESETS = [25000, 50000, 100000]

const TOOLTIPS = {
  salario:
    "Tu sueldo mensual antes de descuentos (bruto). Usa el monto fijo ordinario: no incluyas bonificaciones ni horas extras.",
  otros:
    "Descuentos fijos de cada mes: cooperativa, préstamos, seguros… Se restan después de la TSS y el ISR.",
} as const

const inputClass =
  "block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-finanzas-light"

const chipClass = (selected: boolean) =>
  `rounded-md border px-3 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
    selected
      ? "border-finanzas text-finanzas-dark dark:border-finanzas-light dark:text-finanzas-lighter"
      : "border-gray-300 text-gray-600 hover:border-finanzas hover:text-finanzas-dark dark:border-gray-600 dark:text-gray-300 dark:hover:border-finanzas-light dark:hover:text-finanzas-lighter"
  }`

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
}

function parseNumber(formatted: string): number {
  const n = Number.parseFloat(formatted.replace(/,/g, ""))
  return Number.isNaN(n) ? 0 : n
}

const CIFRAS_VIGENTES = [
  {
    icon: ShieldCheck,
    title: `SFS ${(RATES.tss.sfsRate * 100).toFixed(2)}%`,
    sub: `Tope: ${formatDOP(RATES.tss.sfsCap, 0)} al mes`,
  },
  {
    icon: TrendingUp,
    title: `AFP ${(RATES.tss.afpRate * 100).toFixed(2)}%`,
    sub: `Tope: ${formatDOP(RATES.tss.afpCap, 0)} al mes`,
  },
  { icon: Landmark, title: "ISR por tramos", sub: `Exento hasta ${formatDOP(RATES.isr.exemptUpTo, 0)} al año` },
]

export function NetSalaryCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [salarioInput, setSalarioInput] = useState("")
  const [otrosInput, setOtrosInput] = useState("")
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Cargar borrador local (patrón D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{ salario?: string; otros?: string }>(DRAFT_KEY, {})
    if (typeof parsed.salario === "string") setSalarioInput(parsed.salario)
    if (typeof parsed.otros === "string") setOtrosInput(parsed.otros)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { salario: salarioInput, otros: otrosInput })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [salarioInput, otrosInput])

  const salario = useMemo(() => parseNumber(salarioInput), [salarioInput])
  const otros = useMemo(() => parseNumber(otrosInput), [otrosInput])

  const result = useMemo(() => {
    if (!salarioInput.trim() || salario <= 0) return null
    return calculateNetSalary(salario, otrosInput.trim() ? otros : 0)
  }, [salarioInput, salario, otrosInput, otros])

  const animated = useCountUp(result?.netoMensual ?? 0, { duration: 500, decimals: 2 })

  const handleSalarioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalarioInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handleSalarioBlur = () => {
    setSalarioInput(salario > 0 ? formatNumber(salario) : "")
  }

  const handleOtrosChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtrosInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handleOtrosBlur = () => {
    setOtrosInput(otros > 0 ? formatNumber(otros) : "")
  }

  const applyPreset = (value: number) => {
    setSalarioInput(formatNumber(value))
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setSalarioInput("")
    setOtrosInput("")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tus datos</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Tu salario bruto y, si quieres, tus otros descuentos fijos.
        </p>

        {/* Salario bruto mensual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="salario-bruto" className="block text-sm font-medium">
              Salario bruto mensual
            </label>
            <div className="relative">
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                data-interactive="true"
                aria-label="Información sobre el salario bruto"
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
              id="salario-bruto"
              type="text"
              inputMode="decimal"
              value={salarioInput}
              onChange={handleSalarioChange}
              onBlur={handleSalarioBlur}
              placeholder="Ej: 50,000"
              className={inputClass}
              data-interactive="true"
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {PRESETS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => applyPreset(value)}
                data-interactive="true"
                className={chipClass(salario === value)}
              >
                {formatDOP(value, 0)}
              </button>
            ))}
          </div>
        </div>

        {/* Otros descuentos fijos */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="otros-descuentos" className="block text-sm font-medium">
              Otros descuentos (opcional)
            </label>
            <div className="relative">
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                data-interactive="true"
                aria-label="Información sobre los otros descuentos"
                onMouseEnter={() => setActiveTooltip("otros")}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <HelpCircle size={16} />
              </button>
              {activeTooltip === "otros" && (
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {TOOLTIPS.otros}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <DollarSign className="h-4 w-4" />
            </span>
            <input
              id="otros-descuentos"
              type="text"
              inputMode="decimal"
              value={otrosInput}
              onChange={handleOtrosChange}
              onBlur={handleOtrosBlur}
              placeholder="Ej: 3,500"
              className={inputClass}
              data-interactive="true"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cooperativa, préstamos, seguros… monto mensual.
          </p>
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
            <p className="font-medium">Escribe tu salario bruto</p>
            <p className="mt-1 text-sm">y aquí verás tu sueldo neto con el desglose de TSS e ISR.</p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            {/* Hero */}
            <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
              <p className="flex items-center justify-center gap-2 text-sm text-white dark:text-finanzas-lighter">
                <Wallet className="h-4 w-4" />
                Tu sueldo neto mensual
              </p>
              <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">
                {formatDOP(animated, 2)}
              </p>
              <p className="mt-3 text-center text-sm text-white dark:text-finanzas-lighter">
                ≈ {formatDOP(result.netoQuincena)} por quincena · descuentos: {result.tasaDescuentos.toFixed(1)}% del
                bruto
              </p>
            </div>

            {/* Desglose */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex justify-between gap-3 py-1.5 text-sm">
                <span>Salario bruto mensual</span>
                <span className="whitespace-nowrap font-semibold tabular-nums">{formatDOP(result.bruto)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  SFS · Seguro Familiar de Salud
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    3.04%{" "}
                    {result.sfsTope ? `· sobre el tope de ${formatDOP(SFS_CAP, 0)}` : "del salario bruto"}
                  </span>
                </span>
                <span className="whitespace-nowrap tabular-nums">− {formatDOP(result.sfs)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  AFP · Pensiones
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    2.87%{" "}
                    {result.afpTope ? `· sobre el tope de ${formatDOP(AFP_CAP, 0)}` : "del salario bruto"}
                  </span>
                </span>
                <span className="whitespace-nowrap tabular-nums">− {formatDOP(result.afp)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  ISR · Retención de renta
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Tramo aplicado: {result.tramo}
                  </span>
                </span>
                <span className="whitespace-nowrap tabular-nums">− {formatDOP(result.isrMensual)}</span>
              </div>
              {result.otrosDescuentos > 0 && (
                <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Otros descuentos
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      Cooperativa, préstamos, seguros…
                    </span>
                  </span>
                  <span className="whitespace-nowrap tabular-nums">− {formatDOP(result.otrosDescuentos)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 py-2 dark:border-gray-700">
                <span className="font-semibold">Sueldo neto mensual</span>
                <span className="whitespace-nowrap font-bold tabular-nums text-finanzas-dark dark:text-finanzas-lighter">
                  {formatDOP(result.netoMensual)}
                </span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Sueldo neto anual
                  <span className="block text-xs text-gray-500 dark:text-gray-400">× 12 meses</span>
                </span>
                <span className="whitespace-nowrap tabular-nums">{formatDOP(result.netoAnual)}</span>
              </div>

              {/* Cómo se calculó el ISR */}
              <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  <Landmark className="h-3.5 w-3.5 text-finanzas dark:text-finanzas-light" />
                  Cómo se calculó tu ISR
                </p>
                <dl className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between gap-3">
                    <dt>Base anual de ISR (bruto − TSS) × 12</dt>
                    <dd className="whitespace-nowrap tabular-nums">{formatDOP(result.baseIsrAnual)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Tramo aplicado</dt>
                    <dd className="font-medium text-gray-800 dark:text-gray-200">{result.tramo}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Retención mensual (anual ÷ 12)</dt>
                    <dd className="whitespace-nowrap tabular-nums">{formatDOP(result.isrMensual)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Cifras vigentes */}
            <div className="grid gap-3 sm:grid-cols-3">
              {CIFRAS_VIGENTES.map((item) => (
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
                Estimación educativa con las tasas y topes de 2026 (Resolución 01-2025 de la TSS y escala de retención
                de asalariados de la DGII). No incluye bonificaciones, horas extras ni salario de navidad, y tu
                empleador puede aplicar redondeos propios. No es asesoría fiscal ni laboral.
              </span>
            </div>

            <p className="px-1 text-sm text-gray-600 dark:text-gray-400">
              Con tu sueldo neto en mano,{" "}
              <Link
                href="/crear-presupuesto-personal"
                data-interactive="true"
                className="font-semibold text-finanzas-dark underline underline-offset-2 dark:text-finanzas-lighter"
              >
                organiza el mes con un presupuesto personal
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
