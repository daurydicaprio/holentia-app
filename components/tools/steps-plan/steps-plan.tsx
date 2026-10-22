"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Apple,
  Building2,
  Bus,
  Calendar,
  Car,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Info,
  Minus,
  Moon,
  Music,
  Phone,
  Plus,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Users,
  Utensils,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageRemove, storageSet } from "@/lib/storage"

// Plan de Pasos 5-10-20: objetivo diario, plan de caminata por bloques de
// minutos (mañana / tarde / noche), registro del día con racha, beneficios
// por nivel y trucos para sumar pasos. Todo local.
//
// Conversión: 100 pasos/minuto = intensidad moderada (referencia de cadencia
// usada en investigación; p. ej. UMass ~100 pasos/min). Es una estimación.
// Niveles de minutos: 40 mínimo · 60 recomendado · 70-100 ideal.
// Ciencia de pasos: 6,000-8,000 ya concentran gran parte del beneficio
// (Paluch et al. 2022, meta-análisis en Lancet Public Health); los 10,000
// vienen de un podómetro japonés de 1965 (Manpo-kei), no de un estudio.
const DRAFT_KEY = draftKey("pasos-al-dia")
const ENTRIES_KEY = "holentia:pasos-al-dia:entries:v1"
const CADENCE = 100 // pasos por minuto a paso moderado
const DEFAULT_GOAL = 7000

// Entradas numéricas con type="text" + inputMode: el type="number" rompe la
// escritura de números parciales en móvil, y text-lg (18px ≥ 16px) evita el
// zoom de iOS al enfocar.
const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-lg font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cuerpo dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-cuerpo-light"

const GOAL_PRESETS = [
  { value: 4000, label: "Base", sub: "≈40 min" },
  { value: 7000, label: "Recomendado", sub: "≈70 min" },
  { value: 10000, label: "Ideal", sub: "≈100 min" },
]

const PLAN_PRESETS = [
  { label: "Mínimo", total: "40′", split: { morning: 10, afternoon: 20, evening: 10 } },
  { label: "Recomendado", total: "60′", split: { morning: 20, afternoon: 20, evening: 20 } },
  { label: "Ideal", total: "80′", split: { morning: 30, afternoon: 30, evening: 20 } },
]

const BENEFITS: Record<string, { name: string; items: string[] }> = {
  arranque: {
    name: "Arranque",
    items: [
      "Sube 500 pasos por semana y llegarás al primer escalón: 4,000.",
      "Cada 1,000 pasos extra ya cuentan; la constancia vale más que el número.",
      "Tu logro hoy es el hábito: moverse a diario, aunque sea poco.",
    ],
  },
  base: {
    name: "Base",
    items: [
      "Sales del sedentarismo: es el primer paso real y el más difícil.",
      "Caminar 10-15 min después de comer ayuda a controlar el azúcar en sangre.",
      "Mejora el ánimo, la energía y la rigidez del día.",
      "Cada 1,000 pasos extra siguen bajando el riesgo.",
    ],
  },
  recomendado: {
    name: "Recomendado",
    items: [
      "Aquí vive la mayor parte del premio: los grandes estudios asocian 6,000-8,000 pasos con un riesgo notablemente menor de mortalidad.",
      "Corazón y pulmones más fuertes; presión y glucosa más estables.",
      "Mejor sueño y más energía para el resto del día.",
      "El punto dulce para la mayoría de adultos.",
    ],
  },
  ideal: {
    name: "Ideal",
    items: [
      "Todo lo del nivel recomendado, con más margen y mejor condición física.",
      "El beneficio extra es real pero más pequeño que el salto anterior.",
      "Para exprimirlo: suma cardio más intenso y fuerza 2 días por semana.",
    ],
  },
}

const TIPS = [
  {
    icon: Utensils,
    title: "Camina después de comer",
    text: "10-15 min tras cada comida ayudan a bajar el pico de glucosa. Es el truco con más ciencia.",
  },
  {
    icon: Clock,
    title: "Levántate cada hora",
    text: "2-5 min de caminata por hora cortan el sedentarismo y despiertan la energía.",
  },
  {
    icon: Car,
    title: "Parquea lejos",
    text: "Deja el carro al final del parqueo —si es seguro y está bien iluminado—: pasos gratis.",
  },
  {
    icon: Bus,
    title: "Bájate una parada antes",
    text: "En guagua, metro o transporte, camina un tramo todos los días.",
  },
  {
    icon: Building2,
    title: "Usa las escaleras",
    text: "Cambia el ascensor por 3-4 pisos cuando puedas: subes el pulso sin darte cuenta.",
  },
  {
    icon: Phone,
    title: "Camina en las llamadas",
    text: "Las llamadas largas son minutos escondidos: camina mientras hablas.",
  },
  {
    icon: Sun,
    title: "Madruga o espera el atardecer",
    text: "Con el calor de aquí, camina temprano o al caer el sol, con agua a mano.",
  },
  {
    icon: Users,
    title: "Camina en compañía",
    text: "Con familia, pareja o amistades el hábito se sostiene y se disfruta más.",
  },
  {
    icon: Music,
    title: "Lleva música o pódcast",
    text: "Lo que entretiene se repite: el tiempo se pasa volando.",
  },
  {
    icon: Sparkles,
    title: "Deja los tenis a la vista",
    text: "Lo que ves se hace: un recordatorio visual que invita a salir.",
  },
]

interface StepsDraft {
  goal?: number
  plan?: { morning: number; afternoon: number; evening: number }
}

type StepsEntries = Record<string, number> // "YYYY-MM-DD" → pasos

const localDayKey = (d: Date) => d.toLocaleDateString("en-CA")

function parseIsoDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function formatDay(iso: string): string {
  const text = parseIsoDay(iso).toLocaleDateString("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const formatNumber = (n: number) => n.toLocaleString("es-DO")

function planLevelName(minutes: number): string {
  if (minutes > 100) return "Ideal+"
  if (minutes >= 70) return "Ideal"
  if (minutes >= 60) return "Recomendado"
  if (minutes >= 40) return "Mínimo útil"
  return "Bajo el mínimo"
}

function goalLevelKey(goal: number): "arranque" | "base" | "recomendado" | "ideal" {
  if (goal >= 8000) return "ideal"
  if (goal >= 6000) return "recomendado"
  if (goal >= 4000) return "base"
  return "arranque"
}

function computeStreak(entries: StepsEntries, goal: number): number {
  const met = (d: Date) => (entries[localDayKey(d)] ?? 0) >= goal
  const cursor = new Date()
  if (!met(cursor)) {
    cursor.setDate(cursor.getDate() - 1)
    if (!met(cursor)) return 0
  }
  let streak = 0
  while (met(cursor)) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function StepsPlan() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mounted, setMounted] = useState(false)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [goal, setGoal] = useState(DEFAULT_GOAL)
  const [goalInput, setGoalInput] = useState(String(DEFAULT_GOAL))
  const [plan, setPlan] = useState({ morning: 20, afternoon: 20, evening: 20 })
  const [entries, setEntries] = useState<StepsEntries>({})
  const [todayInput, setTodayInput] = useState("")
  const [savedFlash, setSavedFlash] = useState(false)
  const dirty = useRef(false)
  const touchedSteps = useRef(false)
  const entriesRef = useRef<StepsEntries>({})
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Montaje: fecha local, objetivo/plan guardados y registros del historial
  useEffect(() => {
    const today = localDayKey(new Date())
    setDayKey(today)

    const draft = storageGet<StepsDraft>(DRAFT_KEY, {})
    if (typeof draft.goal === "number" && draft.goal >= 1000 && draft.goal <= 30000) {
      setGoal(draft.goal)
      setGoalInput(String(draft.goal))
    }
    if (draft.plan) {
      const clampBlock = (v: unknown) =>
        typeof v === "number" && v >= 0 && v <= 90 ? Math.round(v / 5) * 5 : 20
      setPlan({
        morning: clampBlock(draft.plan.morning),
        afternoon: clampBlock(draft.plan.afternoon),
        evening: clampBlock(draft.plan.evening),
      })
    }

    const stored = storageGet<StepsEntries>(ENTRIES_KEY, {})
    const valid: StepsEntries = {}
    for (const [key, value] of Object.entries(stored)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && typeof value === "number" && value >= 0 && value <= 999999) {
        valid[key] = value
      }
    }
    setEntries(valid)
    entriesRef.current = valid
    if (typeof valid[today] === "number" && valid[today] > 0) {
      setTodayInput(String(valid[today]))
    }
    setMounted(true)
  }, [])

  // Autoguarda objetivo y plan (solo cuando el usuario los toca)
  useEffect(() => {
    if (!mounted || !dirty.current) return
    if (draftTimer.current) clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { goal, plan })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current)
    }
  }, [goal, plan, mounted])

  // Autoguarda los pasos de hoy (tras la primera edición)
  useEffect(() => {
    if (!mounted || !dayKey || !touchedSteps.current) return
    if (stepsTimer.current) clearTimeout(stepsTimer.current)
    stepsTimer.current = setTimeout(() => {
      const steps = Math.min(999999, Number(todayInput || "0"))
      const next = { ...entriesRef.current, [dayKey]: steps }
      entriesRef.current = next
      setEntries(next)
      if (storageSet(ENTRIES_KEY, next)) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (stepsTimer.current) clearTimeout(stepsTimer.current)
    }
  }, [todayInput, mounted, dayKey])

  const planMinutes = plan.morning + plan.afternoon + plan.evening
  const planSteps = planMinutes * CADENCE
  const levelName = planLevelName(planMinutes)
  const missingMin = Math.max(0, Math.ceil((goal - planSteps) / CADENCE))
  const covered = planSteps >= goal
  const goalMinutes = Math.ceil(goal / CADENCE)

  const benefitsLevel = BENEFITS[goalLevelKey(goal)]

  const todayCount = Math.min(999999, Number(todayInput || "0"))
  const pct = goal > 0 ? Math.min(999, Math.round((todayCount / goal) * 100)) : 0
  let todayMessage = "Anota tus pasos del día cuando quieras."
  if (todayInput !== "") {
    if (todayCount >= goal) todayMessage = "¡Objetivo cumplido! Gran día."
    else if (todayCount >= goal * 0.5) todayMessage = `Ya casi: te faltan ${formatNumber(goal - todayCount)} pasos.`
    else todayMessage = "Buen comienzo: cada paso cuenta."
  }

  const streak = useMemo(() => computeStreak(entries, goal), [entries, goal])

  const last7 = useMemo(() => {
    if (!dayKey) return []
    const out: { key: string; label: string; steps: number | null; met: boolean }[] = []
    const cursor = new Date()
    cursor.setDate(cursor.getDate() - 6)
    for (let i = 0; i < 7; i++) {
      const key = localDayKey(cursor)
      const steps = typeof entries[key] === "number" ? entries[key] : null
      out.push({
        key,
        label: cursor.toLocaleDateString("es-DO", { weekday: "short" }).replace(".", ""),
        steps,
        met: steps !== null && steps >= goal,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    return out
  }, [entries, goal, dayKey])

  const selectGoal = (value: number) => {
    dirty.current = true
    setGoal(value)
    setGoalInput(String(value))
    triggerHapticFeedback("light")
  }

  const handleGoalInput = (raw: string) => {
    dirty.current = true
    const digits = raw.replace(/\D/g, "").slice(0, 5)
    setGoalInput(digits)
    if (digits) {
      setGoal(Math.min(30000, Math.max(1000, Number(digits))))
    }
  }

  const normalizeGoalInput = () => {
    setGoalInput(String(goal))
  }

  const setBlock = (block: "morning" | "afternoon" | "evening", delta: number) => {
    dirty.current = true
    setPlan((prev) => ({ ...prev, [block]: Math.max(0, Math.min(90, prev[block] + delta)) }))
    triggerHapticFeedback("light")
  }

  const applyPlanPreset = (split: { morning: number; afternoon: number; evening: number }) => {
    dirty.current = true
    setPlan(split)
    triggerHapticFeedback("light")
  }

  const handleTodayInput = (raw: string) => {
    touchedSteps.current = true
    setTodayInput(raw.replace(/\D/g, "").slice(0, 6))
  }

  const addThousand = () => {
    touchedSteps.current = true
    setTodayInput(String(Math.min(999999, Number(todayInput || "0") + 1000)))
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setGoal(DEFAULT_GOAL)
    setGoalInput(String(DEFAULT_GOAL))
    setPlan({ morning: 20, afternoon: 20, evening: 20 })
    setEntries({})
    entriesRef.current = {}
    setTodayInput("")
    storageRemove(DRAFT_KEY)
    storageRemove(ENTRIES_KEY)
    triggerHapticFeedback("medium")
  }

  const todayPctBar = Math.min(100, pct)
  const isGoalPreset = (value: number) => goal === value

  return (
    <div className="space-y-6">
      {/* Objetivo + Plan */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-2">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-lg bg-cuerpo-lighter p-1.5 dark:bg-cuerpo-dark">
              <Target className="h-5 w-5 text-cuerpo-darkest dark:text-white" />
            </div>
            <h2 className="text-xl font-bold">Tu objetivo</h2>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            ¿Cuántos pasos quieres lograr cada día? La ciencia ya marca la diferencia en 6,000-8,000; los 10,000 no
            son obligatorios.
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {GOAL_PRESETS.map((preset) => {
              const selected = isGoalPreset(preset.value)
              return (
                <button
                  key={preset.value}
                  type="button"
                  data-interactive="true"
                  onClick={() => selectGoal(preset.value)}
                  aria-pressed={selected}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 text-left transition-[colors,transform] duration-150 active:scale-[0.97] sm:flex-col sm:justify-center sm:gap-0 sm:text-center ${
                    selected
                      ? "border-cuerpo-dark bg-cuerpo-lighter text-gray-900 dark:border-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900"
                      : "border-gray-200 text-gray-700 hover:border-cuerpo-dark dark:border-gray-700 dark:text-gray-200 dark:hover:border-cuerpo-light"
                  }`}
                >
                  <span className="text-xs font-semibold">{preset.label}</span>
                  <span className="text-right sm:mt-1 sm:text-center">
                    <span
                      className={`block text-sm font-bold ${
                        selected ? "" : "text-cuerpo-darkest dark:text-cuerpo-light"
                      }`}
                    >
                      {formatNumber(preset.value)}
                    </span>
                    <span
                      className={`block text-[11px] ${
                        selected ? "text-gray-700 dark:text-gray-900" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {preset.sub}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <label htmlFor="goal-input" className="mt-4 block text-sm font-medium">
            Otro objetivo
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id="goal-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={goalInput}
              onChange={(e) => handleGoalInput(e.target.value)}
              onBlur={normalizeGoalInput}
              className={`${inputClass} min-w-0 flex-1`}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">pasos</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Tu objetivo ≈ {goalMinutes} min al día a paso moderado.
          </p>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Los famosos 10,000 pasos nacieron en 1965 de un podómetro japonés («Manpo-kei»), no de un estudio. Hoy la
              ciencia apunta a que 6,000-8,000 ya concentran gran parte del beneficio.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {savedFlash ? "Guardado local" : "Se guarda en tu navegador"}
            </span>
            <button
              type="button"
              data-interactive="true"
              onClick={clearData}
              className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Borrar mis datos
            </button>
          </div>
        </div>

        <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 lg:col-span-3">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-lg bg-cuerpo-lighter p-1.5 dark:bg-cuerpo-dark">
              <Footprints className="h-5 w-5 text-cuerpo-darkest dark:text-white" />
            </div>
            <h2 className="text-xl font-bold">Tu plan 5-10-20</h2>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Suma bloques de minutos durante el día: 5 para empezar, 10 para sumar, 20 para transformar. Algunas cosas
            se hacen en 5 minutos; para caminar, apunta a 40 o más.
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {PLAN_PRESETS.map((preset) => {
              const selected =
                plan.morning === preset.split.morning &&
                plan.afternoon === preset.split.afternoon &&
                plan.evening === preset.split.evening
              return (
                <button
                  key={preset.label}
                  type="button"
                  data-interactive="true"
                  onClick={() => applyPlanPreset(preset.split)}
                  aria-pressed={selected}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-[colors,transform] duration-150 active:scale-[0.97] sm:flex-col sm:justify-center sm:gap-0 sm:py-3 sm:text-center ${
                    selected
                      ? "border-cuerpo-dark bg-cuerpo-lighter text-gray-900 dark:border-cuerpo-light dark:bg-cuerpo-dark dark:text-gray-900"
                      : "border-gray-200 text-gray-700 hover:border-cuerpo-dark dark:border-gray-700 dark:text-gray-200 dark:hover:border-cuerpo-light"
                  }`}
                >
                  <span className="text-sm font-semibold">{preset.label}</span>
                  <span
                    className={`text-sm font-bold sm:mt-0.5 ${
                      selected ? "" : "text-cuerpo-darkest dark:text-cuerpo-light"
                    }`}
                  >
                    {preset.total}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 space-y-3">
            {(
              [
                { key: "morning", label: "Mañana", hint: "Arranca el día en movimiento" },
                { key: "afternoon", label: "Tarde", hint: "Corta el sedentarismo de la tarde" },
                { key: "evening", label: "Noche", hint: "Balancea la cena y la glucosa" },
              ] as const
            ).map((block) => (
              <div
                key={block.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div>
                  <span className="text-sm font-semibold">{block.label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{block.hint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-interactive="true"
                    aria-label={`Menos minutos en la ${block.label.toLowerCase()}`}
                    onClick={() => setBlock(block.key, -5)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold">{plan[block.key]}′</span>
                  <button
                    type="button"
                    data-interactive="true"
                    aria-label={`Más minutos en la ${block.label.toLowerCase()}`}
                    onClick={() => setBlock(block.key, 5)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-cuerpo-lighter p-4 dark:bg-cuerpo-dark">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-gray-900">Total del día</span>
              <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium text-gray-900 dark:bg-white/10 dark:text-gray-900">
                {levelName}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {planMinutes} min ≈ {formatNumber(planSteps)} pasos
            </p>
            <p className="mt-1 text-xs text-gray-700 dark:text-gray-900">
              {covered
                ? "✓ Tu plan cubre tu objetivo del día."
                : `Te faltan ≈ ${missingMin} min para cubrir tu objetivo de ${formatNumber(goal)} pasos.`}
            </p>
          </div>
        </div>
      </div>

      {/* Hoy + Beneficios */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h2 className="text-xl font-bold">Hoy</h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{dayKey ? formatDay(dayKey) : "…"}</span>
          </div>

          <label htmlFor="today-steps" className="mb-1 block text-sm font-medium">
            Tus pasos de hoy
          </label>
          <div className="flex items-center gap-2">
            <input
              id="today-steps"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              value={todayInput}
              onChange={(e) => handleTodayInput(e.target.value)}
              className={`${inputClass} min-w-0 flex-1`}
            />
            <button
              type="button"
              data-interactive="true"
              onClick={addThousand}
              className="whitespace-nowrap rounded-md bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-[colors,transform] duration-150 hover:bg-gray-200 active:scale-[0.97] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              +1,000
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Progreso hacia {formatNumber(goal)} pasos</span>
              <span className="font-semibold text-cuerpo-darkest dark:text-cuerpo-light">{pct}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full bg-cuerpo transition-all duration-500 dark:bg-cuerpo-light"
                style={{ width: `${todayPctBar}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{todayMessage}</p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            {streak > 0 ? (
              <span className="flex items-center gap-1 rounded-full bg-cuerpo-lighter px-2.5 py-1 text-xs font-medium text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
                <Flame className="h-3.5 w-3.5" />
                {streak === 1 ? "1 día cumpliendo" : `${streak} días cumpliendo`}
              </span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                La racha cuenta los días seguidos cumpliendo tu objetivo.
              </span>
            )}
          </div>

          <div className="mt-4">
            <span className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">Últimos 7 días</span>
            {dayKey ? (
              <div className="flex items-center justify-between gap-1">
                {last7.map((day, i) => (
                  <div key={day.key} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{day.label}</span>
                    <span
                      title={day.steps !== null ? `${formatNumber(day.steps)} pasos` : "Sin registro"}
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                        day.met
                          ? "bg-cuerpo text-gray-900 dark:bg-cuerpo-light dark:text-gray-900"
                          : day.steps !== null
                            ? "border-2 border-cuerpo-dark dark:border-cuerpo-light"
                            : "border border-dashed border-gray-300 dark:border-gray-600"
                      } ${i === 6 ? "ring-2 ring-cuerpo-dark ring-offset-1 dark:ring-cuerpo-light dark:ring-offset-gray-800" : ""}`}
                    >
                      {day.met ? <Check className="h-3.5 w-3.5" /> : day.steps !== null ? "" : "·"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-10" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="h-fit rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-xl font-bold">Lo que ganas con {formatNumber(goal)} pasos</h2>
          </div>
          <span className="mb-4 inline-block rounded-full bg-cuerpo-lighter px-2.5 py-0.5 text-xs font-medium text-gray-900 dark:bg-cuerpo-dark dark:text-gray-900">
            Nivel {benefitsLevel.name}
          </span>
          <ul className="space-y-2">
            {benefitsLevel.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 text-cuerpo-dark dark:text-cuerpo-light">•</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Referencias: meta-análisis de pasos y mortalidad (Paluch et al., 2022) y cadencia moderada ≈100 pasos/min.
          </p>
        </div>
      </div>

      {/* Trucos + base */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-1 text-xl font-bold">Trucos que suman pasos</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Pequeños ajustes del día a día que no se sienten como ejercicio.
        </p>
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          {TIPS.map((tip) => {
            const Icon = tip.icon
            return (
              <div key={tip.title} className="flex items-start gap-3">
                <div className="rounded-lg bg-cuerpo-lighter p-1.5 dark:bg-cuerpo-dark">
                  <Icon className="h-4 w-4 text-cuerpo-darkest dark:text-white" />
                </div>
                <div>
                  <span className="block text-sm font-semibold">{tip.title}</span>
                  <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{tip.text}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-1 text-xl font-bold">Los pasos son el primer paso, no el único</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Caminar es la base más fácil de sostener; el resto se construye encima.
        </p>
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <HeartPulse className="mt-0.5 h-5 w-5 flex-shrink-0 text-cuerpo-dark dark:text-cuerpo-light" />
            <div>
              <span className="block text-sm font-semibold">Cardio</span>
              <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                La OMS pide 150-300 min por semana (≈20-40 al día). Caminar cuenta.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Dumbbell className="mt-0.5 h-5 w-5 flex-shrink-0 text-cuerpo-dark dark:text-cuerpo-light" />
            <div>
              <span className="block text-sm font-semibold">Fuerza</span>
              <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                2 días o más por semana: sentadillas, lagartijas, bandas.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Apple className="mt-0.5 h-5 w-5 flex-shrink-0 text-cuerpo-dark dark:text-cuerpo-light" />
            <div>
              <span className="block text-sm font-semibold">Alimentación</span>
              <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Sin buena comida, el esfuerzo rinde menos.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Moon className="mt-0.5 h-5 w-5 flex-shrink-0 text-cuerpo-dark dark:text-cuerpo-light" />
            <div>
              <span className="block text-sm font-semibold">Descanso</span>
              <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Dormir bien también entrena: ahí se repara el cuerpo.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
