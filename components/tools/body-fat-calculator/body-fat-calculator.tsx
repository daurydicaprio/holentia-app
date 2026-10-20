"use client"

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ChevronsUpDown,
  Dumbbell,
  Flame,
  Info,
  Scale,
  Trash2,
} from "lucide-react"
import { useCountUp } from "@/hooks/use-count-up"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import RelatedTools from "@/components/tools/related-tools/related-tools"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Calculadora de grasa corporal: método US Navy (densidad corporal) con
// medidas en centímetros y conversión a % de grasa con la ecuación de Siri.
// Hombres: BD = 1,0324 − 0,19077·log10(cintura − cuello) + 0,15456·log10(altura)
// Mujeres: BD = 1,29579 − 0,35004·log10(cintura + cadera − cuello) + 0,22100·log10(altura)
// % de grasa = 495 / BD − 450.
// Bandas orientativas de referencia del American Council on Exercise (ACE).
const DRAFT_KEY = draftKey("calculadora-grasa-corporal")
const LB_PER_KG = 2.2046226218
const KG_PER_LB = 1 / LB_PER_KG

type Sex = "male" | "female"
type WeightUnit = "kg" | "lb"
type BandId = "very-low" | "essential" | "athletic" | "fitness" | "average" | "high"

interface BodyFatDraft {
  sex?: Sex
  height?: string
  weight?: string
  unit?: WeightUnit
  neck?: string
  waist?: string
  hip?: string
}

interface BodyFatBand {
  id: BandId
  name: string
  range: string
  badgeClass: string
  message: string
}

const VERY_LOW: Record<Sex, BodyFatBand> = {
  male: {
    id: "very-low",
    name: "Muy bajo",
    range: "<2%",
    badgeClass: "bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200",
    message: "Poco frecuente. Revisa cómo te mediste; si el dato es real, busca orientación profesional.",
  },
  female: {
    id: "very-low",
    name: "Muy bajo",
    range: "<10%",
    badgeClass: "bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200",
    message: "Poco frecuente. Revisa cómo te mediste; si el dato es real, busca orientación profesional.",
  },
}

const MALE_BANDS: BodyFatBand[] = [
  {
    id: "essential",
    name: "Esencial",
    range: "2–5%",
    badgeClass: "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-200",
    message: "Es el mínimo de grasa que el cuerpo necesita. No es una meta para la mayoría.",
  },
  {
    id: "athletic",
    name: "Atlético",
    range: "6–13%",
    badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200",
    message: "Rango habitual en deportistas. Requiere entrenamiento y una alimentación sostenible.",
  },
  {
    id: "fitness",
    name: "Fitness",
    range: "14–17%",
    badgeClass: "bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200",
    message: "Composición saludable para muchos perfiles. Lo importante es mantenerla con hábitos.",
  },
  {
    id: "average",
    name: "Promedio",
    range: "18–24%",
    badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200",
    message: "Dentro del rango promedio. Mira la tendencia y tu contexto, no solo el número.",
  },
  {
    id: "high",
    name: "Alto",
    range: "25%+",
    badgeClass: "bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-200",
    message: "Por encima del rango promedio. Un cambio pequeño y sostenido es un buen punto de partida.",
  },
]

const FEMALE_BANDS: BodyFatBand[] = [
  {
    id: "essential",
    name: "Esencial",
    range: "10–13%",
    badgeClass: "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-200",
    message: "Es el mínimo de grasa que el cuerpo necesita. No es una meta para la mayoría.",
  },
  {
    id: "athletic",
    name: "Atlético",
    range: "14–20%",
    badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200",
    message: "Rango habitual en deportistas. Requiere entrenamiento y una alimentación sostenible.",
  },
  {
    id: "fitness",
    name: "Fitness",
    range: "21–24%",
    badgeClass: "bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200",
    message: "Composición saludable para muchos perfiles. Lo importante es mantenerla con hábitos.",
  },
  {
    id: "average",
    name: "Promedio",
    range: "25–31%",
    badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200",
    message: "Dentro del rango promedio. Mira la tendencia y tu contexto, no solo el número.",
  },
  {
    id: "high",
    name: "Alto",
    range: "32%+",
    badgeClass: "bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-200",
    message: "Por encima del rango promedio. Un cambio pequeño y sostenido es un buen punto de partida.",
  },
]

function pickBand(bodyFat: number, sex: Sex): BodyFatBand {
  const bands = sex === "male" ? MALE_BANDS : FEMALE_BANDS
  const thresholds = sex === "male" ? [6, 14, 18, 25] : [14, 21, 25, 32]
  const veryLowCutoff = sex === "male" ? 2 : 10

  if (bodyFat < thresholds[0]) {
    return bodyFat < veryLowCutoff ? VERY_LOW[sex] : bands[0]
  }
  if (bodyFat < thresholds[1]) return bands[1]
  if (bodyFat < thresholds[2]) return bands[2]
  if (bodyFat < thresholds[3]) return bands[3]
  return bands[4]
}

const formatKg = (kg: number) => kg.toLocaleString("es-DO", { maximumFractionDigits: 1 })

const formatWeight = (kg: number, unit: WeightUnit) =>
  unit === "kg" ? `${formatKg(kg)} kg` : `${formatKg(kg * LB_PER_KG)} lb`

const sanitizeDecimal = (raw: string, maxLength = 6) => {
  const clean = raw.replace(/[^\d.]/g, "")
  const [head, ...rest] = clean.split(".")
  return (rest.length ? `${head}.${rest.join("")}` : head).slice(0, maxLength)
}

export function BodyFatCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [sex, setSex] = useState<Sex | null>(null)
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState<WeightUnit>("kg")
  const [neck, setNeck] = useState("")
  const [waist, setWaist] = useState("")
  const [hip, setHip] = useState("")
  const [savedFlash, setSavedFlash] = useState(false)
  const touched = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restaurar borrador (patrón D) solo en cliente
  useEffect(() => {
    const draft = storageGet<BodyFatDraft>(DRAFT_KEY, {})
    if (draft.sex === "male" || draft.sex === "female") setSex(draft.sex)
    if (typeof draft.height === "string" && draft.height.length <= 3) setHeight(draft.height)
    if (typeof draft.weight === "string" && draft.weight.length <= 6) setWeight(draft.weight)
    if (draft.unit === "kg" || draft.unit === "lb") setUnit(draft.unit)
    if (typeof draft.neck === "string" && draft.neck.length <= 5) setNeck(draft.neck)
    if (typeof draft.waist === "string" && draft.waist.length <= 5) setWaist(draft.waist)
    if (typeof draft.hip === "string" && draft.hip.length <= 5) setHip(draft.hip)
  }, [])

  // Autoguardado con debounce: solo tras la primera edición del usuario
  useEffect(() => {
    if (!touched.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const payload: BodyFatDraft = {
        height,
        weight,
        unit,
        neck,
        waist,
        hip,
      }
      if (sex) payload.sex = sex
      if (storageSet(DRAFT_KEY, payload)) {
        setSavedFlash(true)
        if (flashTimer.current) clearTimeout(flashTimer.current)
        flashTimer.current = setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [sex, height, weight, unit, neck, waist, hip])

  // Limpieza de temporizadores al desmontar
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (flashTimer.current) clearTimeout(flashTimer.current)
    }
  }, [])

  const result = useMemo(() => {
    if (!sex) return null
    const h = Number.parseFloat(height)
    const w = Number.parseFloat(weight)
    const n = Number.parseFloat(neck)
    const waistCm = Number.parseFloat(waist)
    const hipCm = Number.parseFloat(hip)

    if (!Number.isFinite(h) || !Number.isFinite(w) || !Number.isFinite(n) || !Number.isFinite(waistCm)) {
      return null
    }
    if (sex === "female" && !Number.isFinite(hipCm)) return null

    const wKg = unit === "kg" ? w : w * KG_PER_LB
    if (wKg < 20 || wKg > 400 || h < 100 || h > 250) return null
    if (n < 20 || n > 70 || waistCm < 40 || waistCm > 200) return null
    if (sex === "female" && (hipCm < 50 || hipCm > 200)) return null
    if (sex === "male" && waistCm <= n) return null
    if (sex === "female" && waistCm + hipCm <= n) return null

    const density =
      sex === "male"
        ? 1.0324 - 0.19077 * Math.log10(waistCm - n) + 0.15456 * Math.log10(h)
        : 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - n) + 0.221 * Math.log10(h)

    if (!Number.isFinite(density) || density <= 0) return null
    const bodyFat = 495 / density - 450
    if (!Number.isFinite(bodyFat) || bodyFat < 1 || bodyFat > 70) return null

    const fatMass = wKg * (bodyFat / 100)
    const roundedBodyFat = Math.round(bodyFat * 10) / 10
    return {
      bodyFat: roundedBodyFat,
      fatMass,
      leanMass: wKg - fatMass,
      band: pickBand(roundedBodyFat, sex),
    }
  }, [sex, height, weight, unit, neck, waist, hip])

  const hasAllInputs =
    sex !== null &&
    height.trim() !== "" &&
    weight.trim() !== "" &&
    neck.trim() !== "" &&
    waist.trim() !== "" &&
    (sex === "male" || hip.trim() !== "")

  const hNum = Number.parseFloat(height)
  const wNum = Number.parseFloat(weight)
  const wKg = unit === "kg" ? wNum : wNum * KG_PER_LB
  const nNum = Number.parseFloat(neck)
  const waistNum = Number.parseFloat(waist)
  const hipNum = Number.parseFloat(hip)
  const heightInvalid = height !== "" && (!Number.isFinite(hNum) || hNum < 100 || hNum > 250)
  const weightInvalid = weight !== "" && (!Number.isFinite(wNum) || wKg < 20 || wKg > 400)
  const neckInvalid = neck !== "" && (!Number.isFinite(nNum) || nNum < 20 || nNum > 70)
  const maleRatioInvalid =
    sex === "male" && Number.isFinite(waistNum) && Number.isFinite(nNum) && waistNum <= nNum
  const femaleRatioInvalid =
    sex === "female" &&
    Number.isFinite(waistNum) &&
    Number.isFinite(hipNum) &&
    Number.isFinite(nNum) &&
    waistNum + hipNum <= nNum
  const waistInvalid =
    waist !== "" &&
    (!Number.isFinite(waistNum) || waistNum < 40 || waistNum > 200 || maleRatioInvalid || femaleRatioInvalid)
  const hipInvalid =
    sex === "female" &&
    hip !== "" &&
    (!Number.isFinite(hipNum) || hipNum < 50 || hipNum > 200 || femaleRatioInvalid)

  const validationMessage = useMemo(() => {
    if (result || !hasAllInputs || !sex) return ""
    if (!Number.isFinite(hNum) || hNum < 100 || hNum > 250) return "La estatura debe estar entre 100 y 250 cm."
    if (!Number.isFinite(wNum) || wKg < 20 || wKg > 400) {
      return "El peso debe estar entre 20 y 400 kg (o su equivalente en libras)."
    }
    if (!Number.isFinite(nNum) || nNum < 20 || nNum > 70) return "El cuello debe medir entre 20 y 70 cm."
    if (!Number.isFinite(waistNum) || waistNum < 40 || waistNum > 200) {
      return "La cintura debe medir entre 40 y 200 cm."
    }
    if (sex === "female" && (!Number.isFinite(hipNum) || hipNum < 50 || hipNum > 200)) {
      return "La cadera debe medir entre 50 y 200 cm."
    }
    if (sex === "male" && waistNum <= nNum) {
      return "La cintura debe ser mayor que el cuello para este método."
    }
    if (sex === "female" && waistNum + hipNum <= nNum) {
      return "La suma de cintura y cadera debe ser mayor que el cuello para este método."
    }
    return "Revisa tus medidas: el resultado queda fuera de un rango razonable."
  }, [result, hasAllInputs, sex, hNum, wNum, wKg, nNum, waistNum, hipNum])

  const bands = sex === "female" ? FEMALE_BANDS : MALE_BANDS
  const animatedBodyFat = useCountUp(result?.bodyFat ?? 0, { decimals: 1 })

  const handleHeight = (raw: string) => {
    touched.current = true
    setHeight(raw.replace(/\D/g, "").slice(0, 3))
  }

  const handleDecimal =
    (setter: (value: string) => void, maxLength: number) => (event: ChangeEvent<HTMLInputElement>) => {
      touched.current = true
      setter(sanitizeDecimal(event.target.value, maxLength))
    }

  const handleSex = (next: Sex) => {
    touched.current = true
    setSex(next)
    triggerHapticFeedback("light")
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
    if (saveTimer.current) clearTimeout(saveTimer.current)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    setSex(null)
    setHeight("")
    setWeight("")
    setUnit("kg")
    setNeck("")
    setWaist("")
    setHip("")
    setSavedFlash(false)
    touched.current = false
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cuerpo dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-cuerpo-light"

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulario */}
        <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-1 text-xl font-bold">Tus medidas</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Con una cinta métrica y una báscula basta. Todo se calcula en tu navegador.
          </p>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Sexo</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "male", label: "Hombre" },
                  { value: "female", label: "Mujer" },
                ] as const
              ).map((option) => {
                const selected = sex === option.value
                return (
                  <label
                    key={option.value}
                    data-interactive="true"
                    className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2.5 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-cuerpo dark:focus-within:ring-cuerpo-light ${
                      selected
                        ? "border-cuerpo-dark bg-cuerpo-lighter text-gray-900 dark:border-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900"
                        : "border-gray-300 bg-white text-gray-700 hover:border-cuerpo-dark hover:text-cuerpo-darkest dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-cuerpo-light dark:hover:text-cuerpo-light"
                    }`}
                  >
                    <input
                      type="radio"
                      name="grasa-sexo"
                      value={option.value}
                      checked={selected}
                      onChange={() => handleSex(option.value)}
                      data-interactive="true"
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="grasa-height" className="mb-2 block text-sm font-medium">
                Altura
              </label>
              <div className="relative">
                <input
                  id="grasa-height"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={height}
                  onChange={(e) => handleHeight(e.target.value)}
                  aria-invalid={heightInvalid || undefined}
                  aria-describedby="grasa-height-hint"
                  placeholder="170"
                  data-interactive="true"
                  className={`${inputClass} pr-11`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-300">
                  cm
                </span>
              </div>
              <p id="grasa-height-hint" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                1 metro = 100 cm.
              </p>
            </div>
            <div>
              <label htmlFor="grasa-weight" className="mb-2 block text-sm font-medium">
                Peso
              </label>
              <div className="relative">
                <input
                  id="grasa-weight"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={weight}
                  onChange={handleDecimal(setWeight, 6)}
                  aria-invalid={weightInvalid || undefined}
                  aria-describedby="grasa-weight-hint"
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
              <p id="grasa-weight-hint" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {unit === "kg" ? "Toca «kg» para escribir en libras." : "Toca «lb» para volver a kilogramos."}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="grasa-neck" className="mb-2 block text-sm font-medium">
                Cuello
              </label>
              <div className="relative">
                <input
                  id="grasa-neck"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={neck}
                  onChange={handleDecimal(setNeck, 5)}
                  aria-invalid={neckInvalid || undefined}
                  aria-describedby="grasa-medidas-hint"
                  placeholder="38"
                  data-interactive="true"
                  className={`${inputClass} pr-11`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-300">
                  cm
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="grasa-waist" className="mb-2 block text-sm font-medium">
                Cintura
              </label>
              <div className="relative">
                <input
                  id="grasa-waist"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={waist}
                  onChange={handleDecimal(setWaist, 5)}
                  aria-invalid={waistInvalid || undefined}
                  aria-describedby="grasa-medidas-hint"
                  placeholder="85"
                  data-interactive="true"
                  className={`${inputClass} pr-11`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-300">
                  cm
                </span>
              </div>
            </div>
          </div>

          {sex === "female" ? (
            <div className="mt-4">
              <label htmlFor="grasa-hip" className="mb-2 block text-sm font-medium">
                Cadera
              </label>
              <div className="relative">
                <input
                  id="grasa-hip"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={hip}
                  onChange={handleDecimal(setHip, 5)}
                  aria-invalid={hipInvalid || undefined}
                  aria-describedby="grasa-medidas-hint"
                  placeholder="95"
                  data-interactive="true"
                  className={`${inputClass} pr-11`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-300">
                  cm
                </span>
              </div>
            </div>
          ) : null}

          <p id="grasa-medidas-hint" className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {sex === "male"
              ? "Cinta horizontal y sin apretar. Cintura a la altura del ombligo; cuello bajo la nuez. Repite dos veces y usa el promedio."
              : sex === "female"
                ? "Cinta horizontal y sin apretar. Cintura en el punto más estrecho; cadera en la parte más ancha. Repite dos veces y usa el promedio."
                : "Mide en centímetros, con la cinta horizontal y sin apretar. Repite dos veces y usa el promedio."}
          </p>

          {validationMessage ? (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{validationMessage}</span>
            </div>
          ) : null}

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

        {/* Resultado */}
        {!result ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-8 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
            <Activity className="mb-4 h-12 w-12 opacity-40" />
            <p className="font-medium">{hasAllInputs ? "Revisa tus medidas" : "Completa tus medidas"}</p>
            <p className="mt-1 max-w-sm text-sm">
              {hasAllInputs
                ? "Ajusta los valores para obtener una estimación válida."
                : "Con tus medidas verás tu porcentaje al instante."}
            </p>
            <ul className="mt-4 space-y-1.5 text-left text-xs">
              <li>• Cinta métrica y báscula, nada más.</li>
              <li>• Se calcula en tu navegador.</li>
              <li>• El resultado es una estimación, no un diagnóstico.</li>
            </ul>
          </div>
        ) : (
          <div aria-live="polite" className="animate-result-in space-y-4">
            <div className="rounded-2xl border border-cuerpo-border bg-gradient-to-br from-cuerpo to-cuerpo-dark p-6 text-center text-black shadow-lg dark:bg-none dark:bg-cuerpo-glass dark:text-cuerpo-text sm:p-8">
              <p className="text-sm text-black/80 dark:text-cuerpo-lighter">Tu grasa corporal estimada</p>
              <p className="mt-2 text-5xl font-bold tabular-nums">
                {animatedBodyFat.toFixed(1)}
                <span className="ml-0.5 text-2xl font-semibold">%</span>
              </p>
              <span
                className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${result.band.badgeClass}`}
              >
                {result.band.name}
              </span>
              <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-black/75 dark:text-cuerpo-lighter">
                {result.band.message}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Masa grasa</p>
                  <p className="mt-0.5 text-lg font-bold tabular-nums text-cuerpo-darkest dark:text-cuerpo-light">
                    {formatWeight(result.fatMass, unit)}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Masa magra</p>
                  <p className="mt-0.5 text-lg font-bold tabular-nums text-cuerpo-darkest dark:text-cuerpo-light">
                    {formatWeight(result.leanMass, unit)}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">Escala de referencia</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">ACE</span>
                </div>
                <div
                  role="list"
                  aria-label="Rangos de grasa corporal de referencia"
                  className="mt-2 grid grid-cols-5 gap-1.5"
                >
                  {bands.map((band) => {
                    const active = result.band.id === band.id
                    return (
                      <div
                        key={band.id}
                        role="listitem"
                        aria-label={`${band.name}: ${band.range}`}
                        className={`rounded-md border px-1 py-2 text-center ${
                          active
                            ? "border-cuerpo-dark bg-cuerpo-lighter dark:border-cuerpo-light dark:bg-cuerpo-dark"
                            : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                        }`}
                      >
                        <span
                          className={`block text-[10px] font-semibold leading-tight ${
                            active ? "text-gray-900" : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {band.name}
                        </span>
                        <span
                          className={`mt-0.5 block text-[10px] leading-tight ${
                            active ? "text-gray-900" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {band.range}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  Rangos orientativos para adultos. No son metas clínicas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fórmula y contexto */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-cuerpo-darkest dark:text-cuerpo-light" />
          <h2 className="text-xl font-bold">La fórmula, sin cajas negras</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold">Cómo se calcula</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Método US Navy con medidas en centímetros. Hombres: densidad = 1,0324 − 0,19077 × log₁₀(cintura −
              cuello) + 0,15456 × log₁₀(altura). Mujeres: 1,29579 − 0,35004 × log₁₀(cintura + cadera − cuello) +
              0,22100 × log₁₀(altura). Después: % de grasa = 495 ÷ densidad − 450 (ecuación de Siri).
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Qué mide (y qué no)</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Es una estimación de composición, no una medición de laboratorio. La cinta, la postura y la hora
              influyen.{" "}
              <Link
                href="/calculadora-imc"
                data-interactive="true"
                className="font-medium text-cuerpo-darkest underline underline-offset-2 transition-colors hover:text-cuerpo-dark dark:text-cuerpo-light dark:hover:text-cuerpo-lighter"
              >
                El IMC
              </Link>{" "}
              no distingue músculo de grasa; compara ambos con contexto.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Para quién es</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Pensada para adultos. No sustituye una valoración durante el embarazo, en la niñez, en deportistas de
              élite o en condiciones clínicas. Úsala como termómetro de tendencia, no como diagnóstico.
            </p>
          </div>
        </div>
        <p className="mt-4 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Referencias: método US Navy (densidad corporal), ecuación de Siri y rangos del American Council on Exercise
          (ACE). Estimación educativa, no asesoramiento médico.
        </p>
      </div>

      <RelatedTools
        title="Sigue midiendo tu progreso"
        intro="La composición es una pieza; energía y proteína completan la foto:"
        items={[
          { href: "/calculadora-imc", icon: Scale, title: "Tu IMC" },
          { href: "/calculadora-calorias", icon: Flame, title: "Tus calorías" },
          { href: "/calculadora-proteina-diaria", icon: Dumbbell, title: "Tu proteína" },
        ]}
        note="Estimación educativa con el método US Navy: no sustituye una valoración profesional."
      />
    </div>
  )
}
