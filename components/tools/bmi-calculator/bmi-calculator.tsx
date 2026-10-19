"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ChevronsUpDown,
  Dumbbell,
  Flame,
  Footprints,
  Ruler,
  Scale,
  Trash2,
  TrendingUp,
  Users,
  Weight,
} from "lucide-react"
import { useCountUp } from "@/hooks/use-count-up"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import RelatedTools from "@/components/tools/related-tools/related-tools"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Calculadora de IMC: peso ÷ estatura² (m).
// Bandas OMS para adultos: <18.5 bajo peso · 18.5–24.9 normal · 25–29.9
// sobrepeso · ≥30 obesidad. El IMC no distingue músculo de grasa: el
// componente lo dice claro (músculo, cintura, etapas de la vida).
// Referencia de cintura (OMS): riesgo desde 88 cm en mujeres y 102 cm en hombres.
const DRAFT_KEY = draftKey("calculadora-imc")
const LB_PER_KG = 2.2046226218
const KG_PER_LB = 1 / LB_PER_KG

type WeightUnit = "kg" | "lb"

interface BmiDraft {
  weight?: string
  height?: string
  unit?: WeightUnit
}

interface BmiBand {
  id: string
  name: string
  badgeClass: string
  message: string
}

const BANDS: BmiBand[] = [
  {
    id: "under",
    name: "Bajo peso",
    badgeClass: "bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200",
    message: "Por debajo del rango saludable. Si pierdes peso sin buscarlo, coméntalo con un profesional.",
  },
  {
    id: "normal",
    name: "Normal",
    badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200",
    message: "Estás en el rango saludable. Mantén lo que te funciona: comida real, movimiento y descanso.",
  },
  {
    id: "over",
    name: "Sobrepeso",
    badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200",
    message: "Un poco por encima del rango. Los cambios pequeños y sostenidos mueven la aguja más que los esfuerzos de un día.",
  },
  {
    id: "obese",
    name: "Obesidad",
    badgeClass: "bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-200",
    message: "El IMC es una señal, no un diagnóstico. Empieza por un cambio pequeño y busca apoyo profesional.",
  },
]

function pickBand(bmi: number): BmiBand {
  if (bmi < 18.5) return BANDS[0]
  if (bmi < 25) return BANDS[1]
  if (bmi < 30) return BANDS[2]
  return BANDS[3]
}

const formatKg = (kg: number) => kg.toLocaleString("es-DO", { maximumFractionDigits: 1 })

const formatWeight = (kg: number, unit: WeightUnit) =>
  unit === "kg" ? `${formatKg(kg)} kg` : `${Math.round(kg * LB_PER_KG).toLocaleString("es-DO")} lb`

const sanitizeDecimal = (raw: string) => {
  const clean = raw.replace(/[^\d.]/g, "")
  const [head, ...rest] = clean.split(".")
  return (rest.length ? `${head}.${rest.join("")}` : head).slice(0, 6)
}

const HONESTY = [
  {
    icon: Weight,
    title: "Músculo no es grasa",
    text: "Un atleta con mucha masa muscular puede salir «sobrepeso» sin grasa de más: el IMC no distingue de qué está hecho tu peso.",
  },
  {
    icon: Ruler,
    title: "Tu cintura importa",
    text: "La OMS suma riesgo desde 88 cm en mujeres y 102 cm en hombres, incluso cuando el IMC sale normal.",
  },
  {
    icon: Users,
    title: "No aplica igual a todos",
    text: "En embarazo no aplica; en niños y adolescentes se usan percentiles; en adultos mayores se interpreta con cuidado.",
  },
  {
    icon: TrendingUp,
    title: "Mira la tendencia",
    text: "El número de hoy pesa menos que la dirección de los últimos meses. Pésate en condiciones parecidas y mira la curva, no el día.",
  },
]

const NEXT_STEPS = [
  { href: "/calculadora-calorias", icon: Flame, title: "Tus calorías diarias" },
  { href: "/calculadora-proteina-diaria", icon: Dumbbell, title: "Tu proteína diaria" },
  { href: "/pasos-al-dia", icon: Footprints, title: "Tu plan de pasos" },
]

export function BmiCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [unit, setUnit] = useState<WeightUnit>("kg")
  const [savedFlash, setSavedFlash] = useState(false)
  const touched = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restaurar borrador (patrón D) solo en cliente
  useEffect(() => {
    const draft = storageGet<BmiDraft>(DRAFT_KEY, {})
    if (typeof draft.weight === "string" && draft.weight.length <= 6) setWeight(draft.weight)
    if (typeof draft.height === "string" && draft.height.length <= 3) setHeight(draft.height)
    if (draft.unit === "kg" || draft.unit === "lb") setUnit(draft.unit)
  }, [])

  // Autoguardado con debounce: solo tras la primera edición del usuario
  useEffect(() => {
    if (!touched.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { weight, height, unit })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [weight, height, unit])

  const result = useMemo(() => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)
    if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0) return null
    const wKg = unit === "kg" ? w : w * KG_PER_LB
    if (wKg < 20 || wKg > 400 || h < 100 || h > 250) return null
    const meters = h / 100
    return { wKg, h, bmi: Math.round((wKg / (meters * meters)) * 10) / 10 }
  }, [weight, height, unit])

  const hasBoth = Number.parseFloat(weight) > 0 && Number.parseFloat(height) > 0
  const band = result ? pickBand(result.bmi) : null
  const healthyMin = result ? 18.5 * (result.h / 100) ** 2 : 0
  const healthyMax = result ? 24.9 * (result.h / 100) ** 2 : 0
  const animatedBmi = useCountUp(result?.bmi ?? 0, { decimals: 1 })
  const markerPct = result ? ((Math.min(40, Math.max(15, result.bmi)) - 15) / 25) * 100 : 0

  let rangeMessage = ""
  if (result) {
    if (result.wKg < healthyMin) {
      rangeMessage = `Te faltan ≈ ${formatWeight(healthyMin - result.wKg, unit)} para entrar al rango saludable.`
    } else if (result.wKg > healthyMax) {
      rangeMessage = `Estás ≈ ${formatWeight(result.wKg - healthyMax, unit)} por encima del rango saludable.`
    } else {
      rangeMessage = "Estás dentro del rango: sigue así."
    }
  }

  const handleWeight = (raw: string) => {
    touched.current = true
    setWeight(sanitizeDecimal(raw))
  }

  const handleHeight = (raw: string) => {
    touched.current = true
    setHeight(raw.replace(/\D/g, "").slice(0, 3))
  }

  const switchUnit = (next: WeightUnit) => {
    if (next === unit) return
    touched.current = true
    const value = Number.parseFloat(weight)
    if (Number.isFinite(value) && value > 0) {
      const converted = next === "lb" ? value * LB_PER_KG : value * KG_PER_LB
      setWeight(converted.toFixed(1).replace(/\.0$/, ""))
    }
    setUnit(next)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setWeight("")
    setHeight("")
    setUnit("kg")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cuerpo dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-cuerpo-light"

  return (
    <div className="space-y-6">
      {/* Datos + resultado */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-1 text-xl font-bold">Tus datos</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Con tu peso y tu estatura basta: el IMC los cruza al instante.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="imc-weight" className="mb-2 block text-sm font-medium">
                Peso
              </label>
              <div className="relative">
                <input
                  id="imc-weight"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={weight}
                  onChange={(e) => handleWeight(e.target.value)}
                  placeholder={unit === "kg" ? "70" : "154"}
                  data-interactive="true"
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => switchUnit(unit === "kg" ? "lb" : "kg")}
                  aria-label={unit === "kg" ? "Cambiar a libras" : "Cambiar a kilogramos"}
                  data-interactive="true"
                  className="absolute inset-y-1 right-1 flex items-center gap-1 rounded-md bg-cuerpo-lighter px-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900 dark:hover:bg-cuerpo"
                >
                  {unit}
                  <ChevronsUpDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {unit === "kg" ? "Toca «kg» para escribir en libras." : "Toca «lb» para volver a kilogramos."}
              </p>
            </div>
            <div>
              <label htmlFor="imc-height" className="mb-2 block text-sm font-medium">
                Estatura
              </label>
              <div className="relative">
                <input
                  id="imc-height"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={height}
                  onChange={(e) => handleHeight(e.target.value)}
                  placeholder="170"
                  data-interactive="true"
                  className={`${inputClass} pr-11`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-300">
                  cm
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">1 metro = 100 cm.</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {savedFlash ? "Guardado local" : "Se guarda en tu navegador"}
            </span>
            <button
              type="button"
              onClick={clearData}
              data-interactive="true"
              className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Borrar mis datos
            </button>
          </div>
        </div>

        {!result || !band ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-10 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
            <Scale className="mb-4 h-12 w-12 opacity-40" />
            <p className="font-medium">{hasBoth ? "Revisa tus datos" : "Completa tu peso y estatura"}</p>
            <p className="mt-1 text-sm">
              {hasBoth
                ? "El peso y la estatura deben estar en un rango realista (por ejemplo: 70 kg y 170 cm)."
                : "y verás tu IMC al instante."}
            </p>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            <div className="rounded-2xl border border-cuerpo-border bg-gradient-to-br from-cuerpo to-cuerpo-dark p-6 text-center text-black shadow-lg dark:bg-none dark:bg-cuerpo-glass dark:text-cuerpo-text sm:p-8">
              <p className="text-sm text-black/80 dark:text-cuerpo-lighter">Tu índice de masa corporal</p>
              <p className="mt-2 text-5xl font-bold tabular-nums">{animatedBmi.toFixed(1)}</p>
              <span className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${band.badgeClass}`}>
                {band.name}
              </span>
              <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-black/75 dark:text-cuerpo-lighter">
                {band.message}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
              <div className="relative">
                <div className="flex h-3 w-full overflow-hidden rounded-full">
                  <div className="w-[14%] bg-sky-400 dark:bg-sky-500" />
                  <div className="w-[26%] bg-emerald-400 dark:bg-emerald-500" />
                  <div className="w-[20%] bg-amber-400 dark:bg-amber-500" />
                  <div className="flex-1 bg-red-500" />
                </div>
                <div
                  className="absolute -top-1 h-5 w-1 rounded-full bg-gray-900 ring-2 ring-white dark:bg-white dark:ring-gray-800"
                  style={{ left: `calc(${markerPct}% - 2px)` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 flex text-center text-[10px] leading-tight text-gray-500 dark:text-gray-400 sm:text-xs">
                <span className="w-[14%]">&lt;18.5</span>
                <span className="w-[26%]">18.5–24.9</span>
                <span className="w-[20%]">25–29.9</span>
                <span className="flex-1">≥30</span>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="text-sm font-semibold">Peso saludable para tu estatura</p>
                <p className="mt-0.5 text-2xl font-bold tabular-nums text-cuerpo-darkest dark:text-cuerpo-lighter">
                  {formatWeight(healthyMin, unit)} – {formatWeight(healthyMax, unit)}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{rangeMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* El IMC no lo dice todo */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-1 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-bold">El IMC no lo dice todo</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Es una referencia útil, pero no cuenta toda tu historia.
        </p>
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {HONESTY.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-start gap-3">
                <div className="rounded-lg bg-cuerpo-lighter p-1.5 dark:bg-cuerpo-dark">
                  <Icon className="h-4 w-4 text-cuerpo-darkest dark:text-white" />
                </div>
                <div>
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{item.text}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Del número a la acción */}
      <RelatedTools
        title="Del número a la acción"
        intro="El IMC es una foto; tus hábitos son la película. Sigue por aquí:"
        items={NEXT_STEPS}
        note="Orientación educativa con referencias de la OMS: no sustituye una valoración profesional."
      />
    </div>
  )
}
