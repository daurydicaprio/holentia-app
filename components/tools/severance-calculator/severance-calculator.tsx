"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { Briefcase, CalendarDays, DollarSign, HelpCircle, Info, Scale, Trash2 } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import { formatDOP } from "@/lib/format"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"
import {
  DIVISOR_SALARIO_DIARIO,
  calculateSeveranceAmounts,
  diasCesantia,
  diasPreaviso,
  diasVacaciones,
  formatAntiguedad,
  mesesEntre,
  mesesNavidad,
  parseISODate,
} from "@/lib/calculations/severance"

// Estimación de prestaciones laborales en RD — Código de Trabajo (Ley 16-92):
// · Preaviso art. 76: 7, 14 o 28 días de salario según la antigüedad.
// · Auxilio de cesantía art. 80: 6 / 13 / 21 días por año / 23 días por año.
//   La fracción de año mayor de tres meses se paga según los ordinales 1.º y 2.º (6 o 13 días).
// · Vacaciones arts. 177/180: escala proporcional hasta el primer año (6–12 días) y
//   14 días por año hasta 5 (18 días desde más de 5 años).
// · Salario de Navidad art. 219: meses trabajados del año ÷ 12.
// · Salario diario de prestaciones: salario mensual ÷ divisor del Ministerio de Trabajo (lib/rates.ts).
const DRAFT_KEY = draftKey("calculadora-prestaciones-laborales")
const PRESETS = [25000, 50000, 100000]

const MOTIVOS = [
  {
    id: "despido",
    title: "Me despidieron (sin causa justificada)",
    sub: "Preaviso + cesantía + derechos adquiridos",
    pagaPreaviso: true,
    pagaCesantia: true,
  },
  {
    id: "desahucio",
    title: "Desahucio con preaviso cumplido",
    sub: "El empleador te avisó con antelación: cesantía y derechos adquiridos",
    pagaPreaviso: false,
    pagaCesantia: true,
  },
  {
    id: "renuncia",
    title: "Renuncié sin causa justificada (o despido con causa justificada)",
    sub: "Vacaciones y Navidad; la dimisión justificada se revisa aparte",
    pagaPreaviso: false,
    pagaCesantia: false,
  },
] as const

type MotivoId = (typeof MOTIVOS)[number]["id"]

const TOOLTIPS = {
  salario:
    "El promedio de tu salario ordinario mensual de los últimos 12 meses, antes de descuentos. No incluyas bonificaciones ni pagos esporádicos.",
} as const

const inputClass =
  "block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-finanzas-light"

const dateInputClass =
  "block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-finanzas-light"

const chipClass = (selected: boolean) =>
  `rounded-md border px-3 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97] ${
    selected
      ? "border-finanzas text-finanzas-dark dark:border-finanzas-light dark:text-finanzas-lighter"
      : "border-gray-300 text-gray-600 hover:border-finanzas hover:text-finanzas-dark dark:border-gray-600 dark:text-gray-300 dark:hover:border-finanzas-light dark:hover:text-finanzas-lighter"
  }`

const dateFormatter = new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short", year: "numeric" })

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
}

function parseNumber(formatted: string): number {
  const n = Number.parseFloat(formatted.replace(/,/g, ""))
  return Number.isNaN(n) ? 0 : n
}

const CIFRAS_VIGENTES = [
  { icon: Scale, title: `÷ ${DIVISOR_SALARIO_DIARIO}`, sub: "Salario diario para prestaciones (MT)" },
  { icon: CalendarDays, title: "Preaviso 7/14/28", sub: "Días según antigüedad (art. 76)" },
  { icon: Briefcase, title: "Cesantía 6/13/21/23", sub: "Días por año de servicio (art. 80)" },
]

export function SeveranceCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [salarioInput, setSalarioInput] = useState("")
  const [ingresoISO, setIngresoISO] = useState("")
  const [salidaISO, setSalidaISO] = useState("")
  const [motivo, setMotivo] = useState<MotivoId>("despido")
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Cargar borrador local (patrón D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{ salario?: string; ingreso?: string; salida?: string; motivo?: string }>(DRAFT_KEY, {})
    if (typeof parsed.salario === "string") setSalarioInput(parsed.salario)
    if (typeof parsed.ingreso === "string") setIngresoISO(parsed.ingreso)
    if (typeof parsed.salida === "string") setSalidaISO(parsed.salida)
    if (typeof parsed.motivo === "string" && MOTIVOS.some((m) => m.id === parsed.motivo)) {
      setMotivo(parsed.motivo as MotivoId)
    }
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { salario: salarioInput, ingreso: ingresoISO, salida: salidaISO, motivo })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [salarioInput, ingresoISO, salidaISO, motivo])

  const salario = useMemo(() => parseNumber(salarioInput), [salarioInput])

  const result = useMemo(() => {
    if (!salarioInput.trim() || salario <= 0) return null
    const ingreso = parseISODate(ingresoISO)
    const salida = parseISODate(salidaISO)
    if (!ingreso || !salida || salida < ingreso) return null

    const motivoData = MOTIVOS.find((m) => m.id === motivo) ?? MOTIVOS[0]
    const { months, days } = mesesEntre(ingreso, salida)

    const preavisoDias = motivoData.pagaPreaviso ? diasPreaviso(months, days) : 0
    const cesantiaDias = motivoData.pagaCesantia ? diasCesantia(months, days) : 0
    const vacacionesDias = diasVacaciones(months, days)
    const navidadMeses = mesesNavidad(ingreso, salida)
    const amounts = calculateSeveranceAmounts({
      salario,
      preavisoDias,
      cesantiaDias,
      vacacionesDias,
      navidadMeses,
    })

    const notes: string[] = []
    if (motivoData.pagaCesantia && months < 3) {
      notes.push("Con menos de 3 meses de servicio no aplica el auxilio de cesantía (art. 80).")
    }
    if (motivoData.pagaCesantia && months >= 12) {
      const years = Math.floor(months / 12)
      const rem = months % 12
      const fraccionMayorDeTres = rem > 3 || (rem === 3 && days > 0)
      if (rem > 0 && fraccionMayorDeTres) {
        notes.push(
          `La fracción de ${rem} ${rem === 1 ? "mes" : "meses"} del último año se pagó como ${rem >= 6 ? 13 : 6} días adicionales de cesantía (art. 80).`,
        )
      } else if (rem > 0) {
        notes.push(
          `La fracción de ${rem} ${rem === 1 ? "mes" : "meses"} no suma cesantía: el art. 80 solo paga fracciones mayores de 3 meses.`,
        )
      }
      if (years >= 5) {
        notes.push("Desde los 5 años, la cesantía se calcula a 23 días por cada año de servicio (art. 80).")
      }
    }
    if (vacacionesDias === 0) {
      notes.push("Las vacaciones proporcionales aplican desde los 5 meses de servicio (art. 180).")
    }
    if (motivo === "renuncia") {
      notes.push(
        "Si la salida fue una dimisión justificada (arts. 97/101), revisa el caso aparte: esta estimación no incluye preaviso ni cesantía.",
      )
    }

    return {
      pagaPreaviso: motivoData.pagaPreaviso,
      pagaCesantia: motivoData.pagaCesantia,
      preavisoDias,
      cesantiaDias,
      vacacionesDias,
      navidadMeses,
      ...amounts,
      antiguedadLabel: formatAntiguedad(months, days),
      ingresoLabel: dateFormatter.format(ingreso),
      salidaLabel: dateFormatter.format(salida),
      notes,
    }
  }, [salarioInput, salario, ingresoISO, salidaISO, motivo])

  const ingresoDate = useMemo(() => parseISODate(ingresoISO), [ingresoISO])
  const salidaDate = useMemo(() => parseISODate(salidaISO), [salidaISO])
  const rangoInvalido = Boolean(ingresoDate && salidaDate && salidaDate < ingresoDate)

  const animated = useCountUp(result?.total ?? 0, { duration: 600, decimals: 2 })

  const handleSalarioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalarioInput(e.target.value.replace(/[^\d.,]/g, ""))
  }

  const handleSalarioBlur = () => {
    setSalarioInput(salario > 0 ? formatNumber(salario) : "")
  }

  const applyPreset = (value: number) => {
    setSalarioInput(formatNumber(value))
    triggerHapticFeedback("light")
  }

  const selectMotivo = (id: MotivoId) => {
    setMotivo(id)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setSalarioInput("")
    setIngresoISO("")
    setSalidaISO("")
    setMotivo("despido")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const filasDesglose = result
    ? [
        {
          label: "Preaviso",
          sub: !result.pagaPreaviso
            ? "Art. 76 · no aplica en este caso"
            : result.preavisoDias > 0
              ? `Art. 76 · ${result.preavisoDias} días de salario`
              : "Art. 76 · con menos de 3 meses no aplica",
          valor: result.pagaPreaviso && result.preavisoDias > 0 ? result.preaviso : null,
        },
        {
          label: "Auxilio de cesantía",
          sub: !result.pagaCesantia
            ? "Art. 80 · no aplica en este caso"
            : result.cesantiaDias > 0
              ? `Art. 80 · ${result.cesantiaDias} días de salario`
              : "Art. 80 · con menos de 3 meses no aplica",
          valor: result.pagaCesantia && result.cesantiaDias > 0 ? result.cesantia : null,
        },
        {
          label: "Vacaciones no disfrutadas",
          sub:
            result.vacacionesDias > 0
              ? `Arts. 177/180 · ${result.vacacionesDias} días de salario`
              : "Arts. 177/180 · aplican desde 5 meses",
          valor: result.vacacionesDias > 0 ? result.vacaciones : null,
        },
        {
          label: "Salario de Navidad",
          sub: `Art. 219 · ${result.navidadMeses} de 12 meses`,
          valor: result.navidad,
        },
      ]
    : []

  const emptyState =
    !salarioInput.trim() || salario <= 0
      ? {
          title: "Escribe tu salario mensual",
          sub: "y aquí verás el desglose de preaviso, cesantía, vacaciones y Navidad.",
        }
      : rangoInvalido
        ? { title: "Revisa las fechas", sub: "La fecha de salida debe ser posterior a la de ingreso." }
        : {
            title: "Completa tus fechas",
            sub: "Indica tu fecha de ingreso y tu fecha de salida para estimar la liquidación.",
          }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Controles */}
      <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
        <h2 className="text-xl font-bold">Tus datos</h2>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
          Tu salario, tus fechas y cómo terminó la relación laboral.
        </p>

        {/* Salario mensual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="salario-prestaciones" className="block text-sm font-medium">
              Salario mensual (promedio últimos 12 meses)
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
              id="salario-prestaciones"
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

        {/* Fechas */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fecha-ingreso" className="mb-2 block text-sm font-medium">
              Fecha de ingreso
            </label>
            <input
              id="fecha-ingreso"
              type="date"
              value={ingresoISO}
              onChange={(e) => setIngresoISO(e.target.value)}
              className={dateInputClass}
              data-interactive="true"
            />
          </div>
          <div>
            <label htmlFor="fecha-salida" className="mb-2 block text-sm font-medium">
              Fecha de salida
            </label>
            <input
              id="fecha-salida"
              type="date"
              value={salidaISO}
              onChange={(e) => setSalidaISO(e.target.value)}
              className={dateInputClass}
              data-interactive="true"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Contamos desde tu primer día hasta tu último día trabajado.
        </p>

        {/* Motivo */}
        <div className="mt-6">
          <span className="mb-2 block text-sm font-medium">¿Cómo terminó tu relación laboral?</span>
          <div role="radiogroup" aria-label="¿Cómo terminó tu relación laboral?" className="space-y-2">
            {MOTIVOS.map((m) => {
              const activo = motivo === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => selectMotivo(m.id)}
                  data-interactive="true"
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-[colors,transform] duration-150 active:scale-[0.99] ${
                    activo
                      ? "border-2 border-finanzas text-finanzas-dark dark:border-finanzas-light dark:text-finanzas-lighter"
                      : "border-gray-300 text-gray-700 hover:border-finanzas dark:border-gray-600 dark:text-gray-300 dark:hover:border-finanzas-light"
                  }`}
                >
                  <span className="block text-sm font-medium">{m.title}</span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{m.sub}</span>
                </button>
              )
            })}
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
            <Briefcase className="mx-auto mb-4 h-12 w-12 opacity-40" />
            <p className="font-medium">{emptyState.title}</p>
            <p className="mt-1 text-sm">{emptyState.sub}</p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            {/* Hero */}
            <div className="rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 text-white shadow-lg dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text sm:p-8">
              <p className="flex items-center justify-center gap-2 text-sm text-white dark:text-finanzas-lighter">
                <Briefcase className="h-4 w-4" />
                Tus prestaciones estimadas
              </p>
              <p className="mt-2 text-center text-4xl font-bold tabular-nums sm:text-5xl">{formatDOP(animated, 2)}</p>
              <p className="mt-3 text-center text-sm text-white dark:text-finanzas-lighter">
                ≈ {result.mesesDeSalario.toFixed(1)} meses de salario · antigüedad: {result.antiguedadLabel}
              </p>
            </div>

            {/* Desglose */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex justify-between gap-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Antigüedad
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Del {result.ingresoLabel} al {result.salidaLabel}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
                  {result.antiguedadLabel}
                </span>
              </div>
              <div className="flex justify-between gap-3 border-b border-gray-200 py-1.5 pb-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                <span>
                  Salario diario de prestaciones
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Salario mensual ÷ {DIVISOR_SALARIO_DIARIO}</span>
                </span>
                <span className="whitespace-nowrap font-medium tabular-nums text-gray-800 dark:text-gray-200">
                  {formatDOP(result.salarioDiario)}
                </span>
              </div>

              {filasDesglose.map((fila) => (
                <div key={fila.label} className="flex justify-between gap-3 py-2 text-sm">
                  <span>
                    {fila.label}
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{fila.sub}</span>
                  </span>
                  {fila.valor === null ? (
                    <span className="whitespace-nowrap text-gray-400 dark:text-gray-500">—</span>
                  ) : (
                    <span className="whitespace-nowrap font-semibold tabular-nums">{formatDOP(fila.valor)}</span>
                  )}
                </div>
              ))}

              <div className="mt-2 flex justify-between gap-3 border-t border-gray-200 py-2 dark:border-gray-700">
                <span className="font-semibold">Total estimado</span>
                <span className="whitespace-nowrap font-bold tabular-nums text-finanzas-dark dark:text-finanzas-lighter">
                  {formatDOP(result.total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                El pago debe hacerse dentro de los 10 días siguientes a la salida.
              </p>

              {result.notes.length > 0 && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <Scale className="h-3.5 w-3.5 text-finanzas dark:text-finanzas-light" />
                    Notas del cálculo
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {result.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                Estimación educativa según el Código de Trabajo (Ley 16-92): preaviso (art. 76), cesantía (art. 80),
                vacaciones (arts. 177/180) y salario de Navidad (art. 219). Asume que no disfrutaste el último período
                de vacaciones y no incluye salarios pendientes, horas extras ni bonificaciones. No es asesoría legal.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
