"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Info,
  Percent,
  PiggyBank,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Planificador de ahorros: interés compuesto mensual (tasa anual ÷ 12).
// Modo «cuándo»: despeja los meses para llegar a la meta con aporte fijo.
// Modo «cuánto»: calcula el aporte mensual para llegar en un plazo dado.
const DRAFT_KEY = draftKey("planificador-ahorros")

// Más de 100 años ya no es un plan: sugerimos ajustar los datos.
const MAX_MESES = 1200

type Mode = "cuando" | "cuanto"

const DATOS_AHORRO = [
  { icon: TrendingUp, title: "Efecto compuesto", sub: "Tus intereses generan más intereses" },
  { icon: TrendingDown, title: "Sin invertir", sub: "La inflación reduce lo que compras" },
  { icon: Percent, title: "Rendimiento anual", sub: "Certificados 2026: 7%–11% ref." },
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

type PlanResult =
  | { kind: "reached" }
  | { kind: "never" }
  | { kind: "cuando"; meses: number; aportes: number; intereses: number }
  | { kind: "cuanto"; meses: number; pmt: number; aportes: number; intereses: number }

export function SavingsPlanner() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mode, setMode] = useState<Mode>("cuando")
  const [metaInput, setMetaInput] = useState("")
  const [inicialInput, setInicialInput] = useState("")
  const [aporteInput, setAporteInput] = useState("")
  const [plazoInput, setPlazoInput] = useState("")
  const [tasaInput, setTasaInput] = useState("")
  const [mounted, setMounted] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar borrador local (patrón D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{
      mode?: string
      meta?: string
      inicial?: string
      aporte?: string
      plazo?: string
      tasa?: string
    }>(DRAFT_KEY, {})
    if (parsed.mode === "cuando" || parsed.mode === "cuanto") setMode(parsed.mode)
    if (typeof parsed.meta === "string") setMetaInput(parsed.meta)
    if (typeof parsed.inicial === "string") setInicialInput(parsed.inicial)
    if (typeof parsed.aporte === "string") setAporteInput(parsed.aporte)
    if (typeof parsed.plazo === "string") setPlazoInput(parsed.plazo)
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
      if (
        storageSet(DRAFT_KEY, {
          mode,
          meta: metaInput,
          inicial: inicialInput,
          aporte: aporteInput,
          plazo: plazoInput,
          tasa: tasaInput,
        })
      ) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [mode, metaInput, inicialInput, aporteInput, plazoInput, tasaInput])

  const meta = useMemo(() => parseNumber(metaInput), [metaInput])
  const inicial = useMemo(() => parseNumber(inicialInput), [inicialInput])
  const aporte = useMemo(() => parseNumber(aporteInput), [aporteInput])
  const plazo = useMemo(() => parseNumber(plazoInput), [plazoInput])
  const tasa = useMemo(() => parseNumber(tasaInput), [tasaInput])

  const result = useMemo<PlanResult | null>(() => {
    if (meta <= 0) return null
    if (meta <= inicial) return { kind: "reached" }
    const r = tasa / 100 / 12

    if (mode === "cuando") {
      if (aporte <= 0 && r <= 0) return null // nunca llega sin aportes ni rendimiento
      let n: number
      if (r === 0) {
        n = (meta - inicial) / aporte
      } else {
        const num = meta + aporte / r
        const den = inicial + aporte / r
        if (num <= 0 || den <= 0) return null
        n = Math.log(num / den) / Math.log(1 + r)
      }
      if (!Number.isFinite(n) || n <= 0) return null
      if (n > MAX_MESES) return { kind: "never" }
      const meses = Math.ceil(n)
      const aportes = aporte * n
      return { kind: "cuando", meses, aportes, intereses: meta - inicial - aportes }
    }

    // mode === "cuanto"
    if (plazo <= 0) return null
    const meses = Math.floor(plazo)
    if (meses > MAX_MESES) return { kind: "never" }
    let pmt: number
    if (r === 0) {
      pmt = (meta - inicial) / meses
    } else {
      const factor = Math.pow(1 + r, meses)
      pmt = ((meta - inicial * factor) * r) / (factor - 1)
    }
    if (!Number.isFinite(pmt) || pmt <= 0) return null
    const aportes = pmt * meses
    return { kind: "cuanto", meses, pmt, aportes, intereses: meta - inicial - aportes }
  }, [mode, meta, inicial, aporte, plazo, tasa])

  const animatedMeses = useCountUp(result?.kind === "cuando" ? result.meses : 0, { duration: 500, decimals: 0 })
  const animatedPmt = useCountUp(result?.kind === "cuanto" ? result.pmt : 0, { duration: 500, decimals: 0 })

  // Fecha objetivo: solo en el cliente (evita desajustes de hidratación)
  const fechaTexto = useMemo(() => {
    if (!mounted || !result || result.kind === "reached" || result.kind === "never") return null
    const fecha = new Date()
    fecha.setMonth(fecha.getMonth() + result.meses)
    return new Intl.DateTimeFormat("es-DO", { month: "long", year: "numeric" }).format(fecha)
  }, [mounted, result])

  const handleMoneyChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handleMoneyBlur = (value: number, setter: (value: string) => void) => () => {
    setter(value > 0 ? formatNumber(value) : "")
  }

  const handlePlazoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlazoInput(e.target.value.replace(/[^\d]/g, ""))
  }

  const selectMode = (next: Mode) => {
    setMode(next)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setMetaInput("")
    setInicialInput("")
    setAporteInput("")
    setPlazoInput("")
    setTasaInput("")
    setMode("cuando")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const mesesRedondos = Math.max(1, Math.round(animatedMeses))
  const anios = Math.floor(mesesRedondos / 12)
  const restoMeses = mesesRedondos % 12
  const tiempoTexto =
    anios > 0
      ? `${anios} ${anios === 1 ? "año" : "años"}${restoMeses > 0 ? ` y ${restoMeses} ${restoMeses === 1 ? "mes" : "meses"}` : ""}`
      : `${mesesRedondos} ${mesesRedondos === 1 ? "mes" : "meses"}`

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tu plan</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Meta, aporte y rendimiento: el plan se actualiza al instante.
        </p>

        {/* Modo */}
        <span className="mb-2 block text-sm font-medium">¿Qué quieres saber?</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectMode("cuando")}
            aria-pressed={mode === "cuando"}
            className={segClass(mode === "cuando")}
            data-interactive="true"
          >
            ¿Cuándo llego?
          </button>
          <button
            type="button"
            onClick={() => selectMode("cuanto")}
            aria-pressed={mode === "cuanto"}
            className={segClass(mode === "cuanto")}
            data-interactive="true"
          >
            ¿Cuánto aporto?
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {mode === "cuando"
            ? "Con un aporte fijo, ¿en cuánto tiempo llegas?"
            : "Con una fecha fija, ¿cuánto debes aportar?"}
        </p>

        {/* Meta */}
        <label htmlFor="meta-ahorro" className="mt-5 mb-2 block text-sm font-medium">
          Meta de ahorro
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <DollarSign className="h-4 w-4" />
          </span>
          <input
            id="meta-ahorro"
            type="text"
            inputMode="decimal"
            value={metaInput}
            onChange={handleMoneyChange(setMetaInput)}
            onBlur={handleMoneyBlur(meta, setMetaInput)}
            placeholder="Ej: 200,000"
            className={inputClass}
            data-interactive="true"
          />
        </div>

        {/* Ya tengo */}
        <label htmlFor="inicial-ahorro" className="mt-5 mb-2 block text-sm font-medium">
          Ya tengo ahorrado
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <PiggyBank className="h-4 w-4" />
          </span>
          <input
            id="inicial-ahorro"
            type="text"
            inputMode="decimal"
            value={inicialInput}
            onChange={handleMoneyChange(setInicialInput)}
            onBlur={handleMoneyBlur(inicial, setInicialInput)}
            placeholder="Opcional · Ej: 20,000"
            className={inputClass}
            data-interactive="true"
          />
        </div>

        {/* Aporte mensual / plazo */}
        {mode === "cuando" ? (
          <>
            <label htmlFor="aporte-ahorro" className="mt-5 mb-2 block text-sm font-medium">
              Aporto cada mes
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <DollarSign className="h-4 w-4" />
              </span>
              <input
                id="aporte-ahorro"
                type="text"
                inputMode="decimal"
                value={aporteInput}
                onChange={handleMoneyChange(setAporteInput)}
                onBlur={handleMoneyBlur(aporte, setAporteInput)}
                placeholder="Ej: 5,000"
                className={inputClass}
                data-interactive="true"
              />
            </div>
          </>
        ) : (
          <>
            <label htmlFor="plazo-ahorro" className="mt-5 mb-2 block text-sm font-medium">
              Plazo deseado
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                <CalendarDays className="h-4 w-4" />
              </span>
              <input
                id="plazo-ahorro"
                type="text"
                inputMode="numeric"
                value={plazoInput}
                onChange={handlePlazoChange}
                placeholder="En meses · Ej: 24"
                className={inputClass}
                data-interactive="true"
              />
            </div>
          </>
        )}

        {/* Rendimiento */}
        <label htmlFor="tasa-ahorro" className="mt-5 mb-2 block text-sm font-medium">
          Rendimiento anual
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <Percent className="h-4 w-4" />
          </span>
          <input
            id="tasa-ahorro"
            type="text"
            inputMode="decimal"
            value={tasaInput}
            onChange={handleMoneyChange(setTasaInput)}
            placeholder="0 si no inviertes"
            className={inputClass}
            data-interactive="true"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          0% si solo guardas. Referencia: certificados a plazo 2026, 7%–11% anual.
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
            <p className="font-medium">Completa tu meta</p>
            <p className="mt-1 text-sm">
              {mode === "cuando"
                ? "y verás cuándo llegas con tu aporte mensual."
                : "y verás cuánto aportar cada mes para tu plazo."}
            </p>
          </div>
        ) : result.kind === "reached" ? (
          <div
            aria-live="polite"
            className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-lg dark:bg-gray-800"
          >
            <CheckCircle2 className="mb-4 h-12 w-12 text-finanzas dark:text-finanzas-light" />
            <p className="text-xl font-bold">¡Ya alcanzaste tu meta!</p>
            <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
              Tienes {formatDOP(inicial)} para una meta de {formatDOP(meta)}. Puedes subir la meta o dejar que ese
              dinero siga rindiendo en la calculadora de interés compuesto.
            </p>
          </div>
        ) : result.kind === "never" ? (
          <div
            aria-live="polite"
            className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-lg dark:bg-gray-800"
          >
            <Info className="mb-4 h-12 w-12 text-finanzas dark:text-finanzas-light" />
            <p className="text-xl font-bold">Ese plan queda demasiado lejos</p>
            <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
              Con estos datos llegarías en más de 100 años. Sube el aporte mensual, ajusta la meta o añade un
              rendimiento estimado.
            </p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            {/* Hero */}
            <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
              {result.kind === "cuando" ? (
                <>
                  <p className="flex items-center justify-center gap-2 text-sm text-white/85 dark:text-finanzas-lighter">
                    <Target className="h-4 w-4" />
                    Tiempo para tu meta
                  </p>
                  <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">
                    {mesesRedondos} <span className="text-2xl">{mesesRedondos === 1 ? "mes" : "meses"}</span>
                  </p>
                  <p className="mt-3 text-center text-sm text-white/85 dark:text-finanzas-lighter">
                    ≈ {tiempoTexto}
                    {fechaTexto ? ` · llegas en ${fechaTexto}` : ""}
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center justify-center gap-2 text-sm text-white/85 dark:text-finanzas-lighter">
                    <PiggyBank className="h-4 w-4" />
                    Aporte mensual necesario
                  </p>
                  <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">
                    {formatDOP(animatedPmt, 0)}
                  </p>
                  <p className="mt-3 text-center text-sm text-white/85 dark:text-finanzas-lighter">
                    Durante {result.meses} {result.meses === 1 ? "mes" : "meses"}
                    {fechaTexto ? ` · meta en ${fechaTexto}` : ""}
                  </p>
                </>
              )}
            </div>

            {/* Desglose */}
            <div className="rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
              <div className="flex justify-between gap-3 py-1.5 text-sm">
                <span>Meta de ahorro</span>
                <span className="whitespace-nowrap font-semibold tabular-nums">{formatDOP(meta)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>Ya tienes</span>
                <span className="whitespace-nowrap tabular-nums">{formatDOP(inicial)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>Aportarás en total ≈</span>
                <span className="whitespace-nowrap tabular-nums">{formatDOP(result.aportes)}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>Intereses ganados ≈</span>
                <span className="whitespace-nowrap tabular-nums">{formatDOP(result.intereses)}</span>
              </div>
              <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 py-2 dark:border-gray-700">
                <span className="font-semibold">Sale de tu bolsillo</span>
                <span className="whitespace-nowrap font-bold tabular-nums text-finanzas-dark dark:text-finanzas-light">
                  {formatDOP(inicial + result.aportes)}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {result.intereses > 0
                  ? `El rendimiento cubre ≈ ${((result.intereses / meta) * 100).toFixed(1)}% de tu meta.`
                  : "Sin rendimiento: todo sale de tus aportes. Con una tasa estimada llegarías antes."}
              </p>
            </div>

            {/* Datos del ahorro */}
            <div className="grid gap-3 sm:grid-cols-3">
              {DATOS_AHORRO.map((item) => (
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
                Estimación educativa con aportes mensuales e interés compuesto mensual. Los rendimientos no están
                garantizados. ¿Quieres el detalle mes a mes?{" "}
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
