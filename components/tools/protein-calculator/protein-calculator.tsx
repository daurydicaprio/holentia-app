"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  ChevronsUpDown,
  Dumbbell,
  HeartPulse,
  Info,
  Scale,
  Trash2,
  Utensils,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useCountUp } from "@/hooks/use-count-up"
import {
  KG_PER_LB,
  LB_PER_KG,
  PROTEIN_PROFILES,
  getProteinProfile,
  type ProteinProfileId,
} from "@/lib/protein"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Rangos y fuentes en lib/protein.ts (compartidos con la calculadora de calorías).
type WeightUnit = "kg" | "lb"
type Meals = 3 | 4 | 5

const MEALS_OPTIONS: Meals[] = [3, 4, 5]
const DRAFT_KEY = draftKey("calculadora-proteina-diaria")

// Aportes aproximados por porción (valores redondeados de tablas de composición).
const FOODS = [
  { name: "Huevo", portion: "1 unidad", grams: 6 },
  { name: "Pechuga de pollo", portion: "150 g cocida", grams: 45 },
  { name: "Atún en agua", portion: "1 lata (5 oz)", grams: 30 },
  { name: "Yogur griego natural", portion: "1 vaso (170 g)", grams: 17 },
  { name: "Lentejas cocidas", portion: "1 taza", grams: 18 },
  { name: "Queso blanco", portion: "100 g", grams: 16 },
]

const REFERENCES = [
  { icon: Scale, title: "0,8 g/kg", sub: "Mínimo para sedentarios (RDA)" },
  { icon: Dumbbell, title: "1,2–1,6 g/kg", sub: "Ejercicio y fuerza" },
  { icon: HeartPulse, title: "1,0–1,2 g/kg", sub: "Desde los 60 años" },
]

interface ProteinDraft {
  weight?: string
  unit?: string
  profile?: string
  meals?: number
}

const sanitizeDecimal = (raw: string) => {
  const clean = raw.replace(/[^\d.]/g, "")
  const [head, ...rest] = clean.split(".")
  return (rest.length ? `${head}.${rest.join("")}` : head).slice(0, 6)
}

const formatDecimal = (value: number) =>
  value.toLocaleString("es-DO", { maximumFractionDigits: 1 })

const formatGrams = (value: number) => Math.round(value).toLocaleString("es-DO")

const formatWeight = (kg: number, unit: WeightUnit) =>
  unit === "kg"
    ? `${formatDecimal(kg)} kg`
    : `${Math.round(kg * LB_PER_KG).toLocaleString("es-DO")} lb`

const chipClass = (selected: boolean) =>
  `rounded-md border py-2.5 text-sm font-semibold transition-[colors,transform] duration-150 active:scale-[0.97] ${
    selected
      ? "border-cuerpo-dark bg-cuerpo-lighter text-gray-900 dark:border-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900"
      : "border-gray-300 text-gray-600 hover:border-cuerpo-dark dark:border-gray-600 dark:text-gray-300 dark:hover:border-cuerpo-light"
  }`

export function ProteinCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState<WeightUnit>("kg")
  const [profile, setProfile] = useState<ProteinProfileId>("activo")
  const [meals, setMeals] = useState<Meals>(4)
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstSave = useRef(true)

  // Restaurar borrador (patrón D) solo en cliente
  useEffect(() => {
    const draft = storageGet<ProteinDraft>(DRAFT_KEY, {})
    if (typeof draft.weight === "string") setWeight(draft.weight)
    if (draft.unit === "kg" || draft.unit === "lb") setUnit(draft.unit)
    if (typeof draft.profile === "string" && PROTEIN_PROFILES.some((p) => p.id === draft.profile)) {
      setProfile(draft.profile as ProteinProfileId)
    }
    if (draft.meals === 3 || draft.meals === 4 || draft.meals === 5) setMeals(draft.meals)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { weight, unit, profile, meals })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [weight, unit, profile, meals])

  const weightKg = useMemo(() => {
    const w = Number.parseFloat(weight)
    if (Number.isNaN(w) || w <= 0) return null
    return unit === "kg" ? w : w * KG_PER_LB
  }, [weight, unit])

  const result = useMemo(() => {
    if (weightKg === null || weightKg < 20 || weightKg > 350) return null
    const activeProfile = getProteinProfile(profile)
    const minG = weightKg * activeProfile.min
    const maxG = weightKg * activeProfile.max
    return {
      profile: activeProfile,
      weightKg,
      minG,
      maxG,
      midG: (minG + maxG) / 2,
      perMealMin: minG / meals,
      perMealMax: maxG / meals,
    }
  }, [weightKg, profile, meals])

  // Al cambiar de unidad, conserva el peso equivalente (como el IMC)
  const switchUnit = (next: WeightUnit) => {
    if (next === unit) return
    const value = Number.parseFloat(weight)
    if (!Number.isNaN(value) && value > 0) {
      const converted = next === "lb" ? value * LB_PER_KG : value * KG_PER_LB
      setWeight(sanitizeDecimal(converted.toFixed(1)))
    }
    setUnit(next)
    triggerHapticFeedback("light")
  }

  const pickProfile = (id: ProteinProfileId) => {
    setProfile(id)
    triggerHapticFeedback("light")
  }

  const pickMeals = (value: Meals) => {
    setMeals(value)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setWeight("")
    setUnit("kg")
    setProfile("activo")
    setMeals(4)
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const animated = useCountUp(result ? Math.round(result.midG) : 0)

  const emptyState =
    !weight.trim()
      ? { title: "Escribe tu peso", sub: "y verás tu rango diario de proteína y cómo repartirlo." }
      : weightKg === null || weightKg < 20 || weightKg > 350
        ? {
            title: "Revisa tu peso",
            sub: `Usa un peso realista para un adulto (20–350 kg, o 44–772 lb).`,
          }
        : { title: "Escribe tu peso", sub: "y verás tu rango diario de proteína." }

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-16 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cuerpo dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-cuerpo-light"

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Datos */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
          <h2 className="text-xl font-bold">Tus datos</h2>
          <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-gray-400">
            Tu peso y tu contexto: el rango se ajusta a los dos.
          </p>

          <div>
            <label htmlFor="proteina-weight" className="mb-2 block text-sm font-medium">
              Peso
            </label>
            <div className="relative">
              <input
                id="proteina-weight"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={weight}
                onChange={(e) => setWeight(sanitizeDecimal(e.target.value))}
                placeholder={unit === "kg" ? "70" : "154"}
                data-interactive="true"
                className={inputClass}
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

          <div className="mt-6">
            <span className="mb-2 block text-sm font-medium">Tu perfil de actividad</span>
            <div role="radiogroup" aria-label="Tu perfil de actividad" className="space-y-2">
              {PROTEIN_PROFILES.map((p) => {
                const selected = profile === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => pickProfile(p.id)}
                    data-interactive="true"
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-[colors,transform] duration-150 active:scale-[0.99] ${
                      selected
                        ? "border-2 border-cuerpo-dark bg-cuerpo-lighter text-gray-900 dark:border-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900"
                        : "border-gray-300 text-gray-700 hover:border-cuerpo-dark dark:border-gray-600 dark:text-gray-300 dark:hover:border-cuerpo-light"
                    }`}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-sm font-medium">{p.label}</span>
                        <span className={`mt-0.5 block text-xs ${selected ? "text-gray-700 dark:text-gray-900" : "text-gray-500 dark:text-gray-400"}`}>
                          {p.hint}
                        </span>
                      </span>
                      <span className={`whitespace-nowrap text-xs font-semibold tabular-nums ${selected ? "text-gray-900" : "text-cuerpo-darkest dark:text-cuerpo-light"}`}>
                        {formatDecimal(p.min)}–{formatDecimal(p.max)} g/kg
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6">
            <span className="mb-2 block text-sm font-medium">¿Cuántas comidas haces al día?</span>
            <div className="grid grid-cols-3 gap-2">
              {MEALS_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={meals === value}
                  onClick={() => pickMeals(value)}
                  data-interactive="true"
                  className={chipClass(meals === value)}
                >
                  {value} comidas
                </button>
              ))}
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

        {/* Resultado principal */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {!result ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-8 text-center text-gray-500 shadow-lg dark:bg-gray-800 dark:text-gray-400">
              <Dumbbell className="mx-auto mb-4 h-12 w-12 opacity-40" />
              <p className="font-medium">{emptyState.title}</p>
              <p className="mt-1 text-sm">{emptyState.sub}</p>
              <ul className="mt-5 grid gap-2 text-left text-xs leading-relaxed">
                {[
                  "Tu rango diario según perfil y objetivo.",
                  "Cuántos gramos te tocan en cada comida.",
                  "Ideas de fuentes y referencias para llegar.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cuerpo-darkest dark:text-cuerpo-light" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div aria-live="polite" className="animate-result-in">
                <div className="rounded-2xl border border-cuerpo-border bg-gradient-to-br from-cuerpo to-cuerpo-dark p-6 text-center text-black shadow-lg dark:bg-none dark:bg-cuerpo-glass dark:text-cuerpo-text sm:p-8">
                  <p className="flex items-center justify-center gap-2 text-sm opacity-90">
                    <Dumbbell className="h-4 w-4" />
                    Proteína recomendada al día
                  </p>
                  <p className="mt-2 text-5xl font-bold tabular-nums sm:text-6xl">≈ {animated.toLocaleString("es-DO")} g</p>
                  <p className="mt-3 text-sm opacity-90">
                    Rango: {formatGrams(result.minG)}–{formatGrams(result.maxG)} g · perfil {result.profile.label.toLowerCase()}
                  </p>
                  <div className="mt-5 rounded-lg bg-black/10 px-4 py-3 text-sm dark:bg-white/10">
                    En {meals} comidas: <strong className="tabular-nums">{formatGrams(result.perMealMin)}–{formatGrams(result.perMealMax)} g</strong> por comida
                  </div>
                </div>
              </div>

              {/* Fuentes de proteína: cierra la altura del formulario en la misma fila */}
              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Utensils className="h-4 w-4 text-cuerpo-darkest dark:text-cuerpo-light" />
                  Para llegar, algunas ideas
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Aportes aproximados por porción.</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {FOODS.map((food) => (
                    <div key={food.name} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <p className="text-sm font-medium">{food.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{food.portion}</p>
                      <p className="mt-1 text-lg font-bold tabular-nums text-cuerpo-darkest dark:text-cuerpo-light">
                        ≈ {food.grams} g
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 flex flex-wrap items-center gap-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>La proteína es una pieza del día.</span>
                  <Link
                    href="/calculadora-calorias"
                    data-interactive="true"
                    className="inline-flex items-center gap-1 py-2.5 font-semibold text-cuerpo-darkest underline underline-offset-2 dark:text-cuerpo-light"
                  >
                    Calcula tus calorías diarias
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {result && (
        <section className="mt-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-cuerpo-darkest dark:text-cuerpo-light" />
            <h2 className="text-xl font-bold">Tu proteína en detalle</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Las cuentas detrás de tu rango y las referencias que lo sostienen.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/40">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Por kilo de peso</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-800 dark:text-gray-100">
                {formatDecimal(result.profile.min)}–{formatDecimal(result.profile.max)} g/kg
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Rango de tu perfil ({result.profile.label.toLowerCase()})</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/40">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Rango diario</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-800 dark:text-gray-100">
                {formatGrams(result.minG)}–{formatGrams(result.maxG)} g
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Peso × gramos por kilo</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/40">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Peso usado</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-800 dark:text-gray-100">
                {formatWeight(result.weightKg, "kg")}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {unit === "lb" ? `Escribiste ${weight} lb` : `≈ ${formatWeight(result.weightKg, "lb")}`}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/40">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Por comida</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-800 dark:text-gray-100">
                {formatGrams(result.perMealMin)}–{formatGrams(result.perMealMax)} g
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Repartido en {meals} comidas</p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            El total del día es lo que más importa. Para estimular el músculo, reparte 20–40 g en las comidas
            principales (ISSN 2017); si tu meta es alta, usa 4–5 comidas. Si ya cubres 1,2–1,6 g/kg y repartes
            bien la proteína, no necesitas más para ganar músculo salvo que busques fisiculturismo.
          </p>

          {/* Referencias */}
          <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="grid gap-3 sm:grid-cols-3">
              {REFERENCES.map((ref) => (
                <div key={ref.title} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40">
                  <ref.icon className="h-4 w-4 text-cuerpo-darkest dark:text-cuerpo-light" />
                  <p className="mt-1.5 text-sm font-semibold">{ref.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ref.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nota legal */}
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-cuerpo-lighter p-3 text-xs text-gray-800 dark:bg-cuerpo-dark dark:text-gray-900">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-cuerpo-darkest dark:text-white" />
            <span>
              Estimación educativa para adultos sanos: 0,8 g/kg (RDA, IOM/NAM) · 1,2–1,6 g/kg para actividad y
              fuerza (para ganar músculo, los rangos de hasta 2,0 g/kg de ACSM/AND/DC 2016 e ISSN 2017 son para
              deportistas avanzados) · 1,6–2,2 g/kg en déficit calórico (el extremo alto, para personas entrenadas) ·
              1,0–1,2 g/kg desde los 60 años (PROT-AGE/ESPEN). Con enfermedad renal, embarazo, lactancia u otra
              condición médica, consulta a un profesional. No es consejo médico.
            </span>
          </div>
        </section>
      )}

    </>
  )
}
