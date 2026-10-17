"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { CalendarDays, DollarSign, Info, Landmark, Percent, ShieldCheck, Trash2, Wallet } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Certificado financiero (depósito a plazo fijo) RD: interés simple sobre el
// monto a la tasa anual pactada (año de 365 días). Retención del 10% sobre
// los intereses (Norma General 07-2019, DGII). Modalidad: interés mensual o
// al vencimiento. Plazos típicos: 30–910 días o 2–60 meses.
const DRAFT_KEY = draftKey("calculadora-certificado-financiero")

type Unit = "dias" | "meses"
type Modalidad = "mensual" | "vencimiento"

const DATOS_CERTIFICADO = [
  { icon: Percent, title: "Tasa según tu banco", sub: "Referencia 2026: 7%–11% anual" },
  { icon: ShieldCheck, title: "Fondo de Contingencia", sub: "Protección de tus depósitos" },
  { icon: CalendarDays, title: "Plazos típicos", sub: "30–910 días · 2–60 meses" },
]

const inputClass =
  "block w-full rounded-md border border-gray-300 bg-white p-3 pl-10 text-base text-gray-900 shadow-sm focus:border-transparent focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-finanzas-light md:text-sm"

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

export function CertificateCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [montoInput, setMontoInput] = useState("")
  const [tasaInput, setTasaInput] = useState("")
  const [plazoInput, setPlazoInput] = useState("")
  const [unit, setUnit] = useState<Unit>("dias")
  const [modalidad, setModalidad] = useState<Modalidad>("vencimiento")
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Cargar borrador local (patrón D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{
      monto?: string
      tasa?: string
      plazo?: string
      unit?: string
      modalidad?: string
    }>(DRAFT_KEY, {})
    if (typeof parsed.monto === "string") setMontoInput(parsed.monto)
    if (typeof parsed.tasa === "string") setTasaInput(parsed.tasa)
    if (typeof parsed.plazo === "string") setPlazoInput(parsed.plazo)
    if (parsed.unit === "dias" || parsed.unit === "meses") setUnit(parsed.unit)
    if (parsed.modalidad === "mensual" || parsed.modalidad === "vencimiento") setModalidad(parsed.modalidad)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { monto: montoInput, tasa: tasaInput, plazo: plazoInput, unit, modalidad })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [montoInput, tasaInput, plazoInput, unit, modalidad])

  const monto = useMemo(() => parseNumber(montoInput), [montoInput])
  const tasa = useMemo(() => parseNumber(tasaInput), [tasaInput])
  const plazo = useMemo(() => parseNumber(plazoInput), [plazoInput])

  const result = useMemo(() => {
    if (monto <= 0 || tasa <= 0 || plazo <= 0) return null
    const anios = unit === "dias" ? plazo / 365 : plazo / 12
    const meses = Math.max(1, Math.round(anios * 12))
    const bruto = monto * (tasa / 100) * anios
    const retencion = bruto * 0.1
    const neto = bruto - retencion
    return {
      meses,
      bruto,
      retencion,
      neto,
      totalVencimiento: monto + neto,
      pagoMensual: neto / meses,
      rendimientoNeto: (neto / monto / anios) * 100,
    }
  }, [monto, tasa, plazo, unit])

  const animated = useCountUp(result?.neto ?? 0, { duration: 500, decimals: 0 })

  const handleMontoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMontoInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handleMontoBlur = () => {
    setMontoInput(monto > 0 ? formatNumber(monto) : "")
  }

  const handleTasaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTasaInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handlePlazoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlazoInput(e.target.value.replace(/[^\d]/g, ""))
  }

  const selectUnit = (next: Unit) => {
    setUnit(next)
    triggerHapticFeedback("light")
  }

  const selectModalidad = (next: Modalidad) => {
    setModalidad(next)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setMontoInput("")
    setTasaInput("")
    setPlazoInput("")
    setUnit("dias")
    setModalidad("vencimiento")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const plazoLabel = `${plazo} ${unit === "dias" ? (plazo === 1 ? "día" : "días") : plazo === 1 ? "mes" : "meses"}`

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tu depósito</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Monto, tasa y plazo: el resultado se actualiza al instante.
        </p>

        {/* Monto */}
        <label htmlFor="monto-certificado" className="mb-2 block text-sm font-medium">
          Monto del depósito
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <DollarSign className="h-4 w-4" />
          </span>
          <input
            id="monto-certificado"
            type="text"
            inputMode="decimal"
            value={montoInput}
            onChange={handleMontoChange}
            onBlur={handleMontoBlur}
            placeholder="Ej: 500,000"
            className={inputClass}
            data-interactive="true"
          />
        </div>

        {/* Tasa */}
        <label htmlFor="tasa-certificado" className="mt-5 mb-2 block text-sm font-medium">
          Tasa anual
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <Percent className="h-4 w-4" />
          </span>
          <input
            id="tasa-certificado"
            type="text"
            inputMode="decimal"
            value={tasaInput}
            onChange={handleTasaChange}
            placeholder="Ej: 9"
            className={inputClass}
            data-interactive="true"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">La de tu banco: referencia 2026, 7%–11% anual.</p>

        {/* Plazo */}
        <label htmlFor="plazo-certificado" className="mt-5 mb-2 block text-sm font-medium">
          Plazo
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <CalendarDays className="h-4 w-4" />
          </span>
          <input
            id="plazo-certificado"
            type="text"
            inputMode="numeric"
            value={plazoInput}
            onChange={handlePlazoChange}
            placeholder={unit === "dias" ? "Ej: 180" : "Ej: 6"}
            className={inputClass}
            data-interactive="true"
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectUnit("dias")}
            aria-pressed={unit === "dias"}
            className={segClass(unit === "dias")}
            data-interactive="true"
          >
            Días
          </button>
          <button
            type="button"
            onClick={() => selectUnit("meses")}
            aria-pressed={unit === "meses"}
            className={segClass(unit === "meses")}
            data-interactive="true"
          >
            Meses
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Lo común: 30–910 días o 2–60 meses.</p>

        {/* Modalidad */}
        <span className="mt-5 mb-2 block text-sm font-medium">¿Cómo te pagan los intereses?</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectModalidad("mensual")}
            aria-pressed={modalidad === "mensual"}
            className={segClass(modalidad === "mensual")}
            data-interactive="true"
          >
            Cada mes
          </button>
          <button
            type="button"
            onClick={() => selectModalidad("vencimiento")}
            aria-pressed={modalidad === "vencimiento"}
            className={segClass(modalidad === "vencimiento")}
            data-interactive="true"
          >
            Al vencimiento
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {modalidad === "mensual"
            ? "Recibes los intereses cada mes; al final recuperas tu monto."
            : "Recibes todo junto (monto + intereses) al terminar el plazo."}
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
            <p className="font-medium">Completa monto, tasa y plazo</p>
            <p className="mt-1 text-sm">y aquí verás cuánto ganas después de impuestos.</p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            {/* Hero */}
            <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
              <p className="flex items-center justify-center gap-2 text-sm text-white/85 dark:text-finanzas-lighter">
                <Landmark className="h-4 w-4" />
                Ganancia neta (después del 10%)
              </p>
              <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">{formatDOP(animated, 0)}</p>
              <p className="mt-3 text-center text-sm text-white/85 dark:text-finanzas-lighter">
                {modalidad === "mensual"
                  ? "Te pagan los intereses cada mes, con la retención ya aplicada."
                  : "Te pagan todo junto al vencer: monto más intereses netos."}
              </p>
            </div>

            {/* Desglose */}
            <div className="rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
              <div className="flex justify-between gap-3 py-1.5 text-sm">
                <span>Monto depositado</span>
                <span className="whitespace-nowrap font-semibold tabular-nums">{formatDOP(monto)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>Interés bruto ({tasa}% · {plazoLabel})</span>
                <span className="whitespace-nowrap tabular-nums">{formatDOP(result.bruto)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>Retención ISR (10%)</span>
                <span className="whitespace-nowrap tabular-nums">− {formatDOP(result.retencion)}</span>
              </div>
              <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 py-2 dark:border-gray-700">
                <span className="font-semibold">Ganancia neta</span>
                <span className="whitespace-nowrap font-bold tabular-nums text-finanzas-dark dark:text-finanzas-light">
                  {formatDOP(result.neto)}
                </span>
              </div>
              <div className="flex justify-between gap-3 border-t border-gray-200 py-2 text-sm dark:border-gray-700">
                {modalidad === "vencimiento" ? (
                  <>
                    <span className="font-semibold">Total al vencer</span>
                    <span className="whitespace-nowrap font-semibold tabular-nums">
                      {formatDOP(result.totalVencimiento)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Pago neto por mes ≈</span>
                    <span className="whitespace-nowrap font-semibold tabular-nums">
                      {formatDOP(result.pagoMensual)} × {result.meses} {result.meses === 1 ? "mes" : "meses"}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Equivale a ≈ {result.rendimientoNeto.toFixed(2)}% anual neto.
              </p>
            </div>

            {/* Datos del certificado */}
            <div className="grid gap-3 sm:grid-cols-3">
              {DATOS_CERTIFICADO.map((item) => (
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
                Estimación educativa: interés simple sobre el monto pactado, año de 365 días y retención del 10% sobre
                los intereses (Norma General 07-2019). Tu banco puede usar otra convención de días o capitalizar en
                renovaciones. No es asesoría financiera.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
