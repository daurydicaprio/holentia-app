"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Droplets,
  Trash2,
  Sofa,
  Footprints,
  Dumbbell,
  Zap,
  Snowflake,
  CloudSun,
  Sun,
  Flame,
  Sunrise,
  Croissant,
  Utensils,
  Cookie,
  Moon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

const DRAFT_KEY = draftKey("calculadora-hidratacion")

interface HydrationDraft {
  weight?: string
  activityLevel?: string
  climate?: string
}

// Ajustes aditivos por ml (EFSA/NASEM): no se multiplican entre sí.
const ACTIVITY: Record<string, { label: string; short: string; adj: number; icon: typeof Sofa }> = {
  sedentary: { label: "Sedentario (poco o ningún ejercicio)", short: "Sedentario", adj: 0, icon: Sofa },
  light: { label: "Ligero (ejercicio 1-3 días/semana)", short: "Ligero", adj: 300, icon: Footprints },
  moderate: { label: "Moderado (ejercicio 3-5 días/semana)", short: "Moderado", adj: 600, icon: Dumbbell },
  intense: { label: "Intenso (ejercicio 6-7 días/semana)", short: "Intenso", adj: 1000, icon: Zap },
}

const CLIMATE: Record<string, { label: string; short: string; adj: number; icon: typeof Snowflake }> = {
  cold: { label: "Frío (menos de 10°C promedio)", short: "Frío", adj: -200, icon: Snowflake },
  temperate: { label: "Templado (10-25°C)", short: "Templado", adj: 0, icon: CloudSun },
  warm: { label: "Cálido (25-30°C)", short: "Cálido", adj: 350, icon: Sun },
  hot: { label: "Caluroso (más de 30°C)", short: "Caluroso", adj: 700, icon: Flame },
}

// 20% del agua total viene de los alimentos: el resto (80%) es agua potable directa.
const FOOD_FACTOR = 0.8

// Reparto del agua directa a lo largo del día (sum = 1).
const DAY_PLAN = [
  { icon: Sunrise, label: "Al despertar", time: "7:00", pct: 0.15 },
  { icon: Croissant, label: "Media mañana", time: "10:00", pct: 0.15 },
  { icon: Utensils, label: "Almuerzo", time: "13:00", pct: 0.2 },
  { icon: Cookie, label: "Tarde", time: "16:00", pct: 0.2 },
  { icon: Moon, label: "Noche", time: "20:00", pct: 0.3 },
] as const

export function HydrationCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [weight, setWeight] = useState<string>("")
  const [activityLevel, setActivityLevel] = useState<string>("sedentary")
  const [climate, setClimate] = useState<string>("temperate")
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restaurar borrador (Tipo D) solo en cliente
  useEffect(() => {
    const draft = storageGet<HydrationDraft>(DRAFT_KEY, {})
    if (draft.weight !== undefined) setWeight(draft.weight)
    if (draft.activityLevel !== undefined) setActivityLevel(draft.activityLevel)
    if (draft.climate !== undefined) setClimate(draft.climate)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  const firstSave = useRef(true)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { weight, activityLevel, climate })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [weight, activityLevel, climate])

  const result = useMemo(() => {
    const w = Number.parseFloat(weight)
    if (isNaN(w) || w <= 0) return null
    // Base 35 ml/kg + ajustes aditivos por actividad y clima (EFSA/NASEM).
    const base = w * 35
    const actAdj = ACTIVITY[activityLevel]?.adj ?? 0
    const cliAdj = CLIMATE[climate]?.adj ?? 0
    const total = Math.max(Math.round(base + actAdj + cliAdj), 0)
    // Agua potable directa: el 20% restante lo aportan los alimentos sólidos.
    const direct = Math.round(total * FOOD_FACTOR)
    return { total, direct, weight: w }
  }, [weight, activityLevel, climate])

  const pickActivity = (id: string) => {
    setActivityLevel(id)
    triggerHapticFeedback("light")
  }

  const pickClimate = (id: string) => {
    setClimate(id)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setWeight("")
    setActivityLevel("sedentary")
    setClimate("temperate")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"

  const chipClass = (active: boolean) =>
    `p-3 rounded-xl border-2 font-medium transition-all text-center flex flex-col items-center gap-1 ${
      active
        ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 shadow-sm"
        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-300 dark:hover:border-amber-700"
    }`

  const glasses = result ? Math.round(result.direct / 250) : 0
  const bottles = result ? Math.round(result.direct / 500) : 0
  const liters = result ? (result.direct / 1000).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Fila 1: controles + resultado */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Columna izquierda: tus datos */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-fit">
          <h2 className="text-xl font-bold mb-1">Tus datos</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Ajusta los tres factores y mira tu hidratación al instante.
          </p>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">Tu peso (kg)</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej: 70"
              className={inputClass}
              data-interactive="true"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">Nivel de actividad física</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ACTIVITY).map(([id, act]) => (
                <button
                  key={id}
                  onClick={() => pickActivity(id)}
                  className={chipClass(activityLevel === id)}
                  data-interactive="true"
                >
                  <act.icon className="h-5 w-5" />
                  <span className="text-sm font-bold">{act.short}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Clima donde vives</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CLIMATE).map(([id, cli]) => (
                <button
                  key={id}
                  onClick={() => pickClimate(id)}
                  className={chipClass(climate === id)}
                  data-interactive="true"
                >
                  <cli.icon className="h-5 w-5" />
                  <span className="text-sm font-bold">{cli.short}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {savedFlash ? "Guardado local ✓" : "Se guarda en tu navegador"}
            </span>
            <button
              onClick={clearData}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
              data-interactive="true"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Borrar mis datos
            </button>
          </div>
        </div>

        {/* Columna derecha: el héroe */}
        <div className="lg:col-span-3">
          {!result ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
              <Droplets className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="font-medium">Escribe tu peso</p>
              <p className="text-sm mt-1">y aquí verás cuánta agua necesitas hoy.</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-8 shadow-lg text-white text-center h-full flex flex-col justify-center">
              <div className="text-sm uppercase tracking-widest opacity-90 mb-2">Tu hidratación diaria</div>
              <div className="text-6xl font-bold tabular-nums">{result.direct.toLocaleString("es-ES")}</div>
              <div className="text-lg opacity-90 mt-1">
                ml a beber al día · agua total {result.total.toLocaleString("es-ES")} ml
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 text-center">
                <div className="bg-white text-amber-900 font-bold shadow-md border border-white rounded-lg py-2 px-1 text-sm">
                  <div className="text-xs opacity-70">Vasos 250 ml</div>
                  <div className="font-bold tabular-nums">{glasses}</div>
                </div>
                <div className="bg-white/10 text-white border border-white/30 rounded-lg py-2 px-1 text-sm">
                  <div className="text-xs opacity-90">Botellas 500 ml</div>
                  <div className="font-bold tabular-nums">{bottles}</div>
                </div>
                <div className="bg-white/10 text-white border border-white/30 rounded-lg py-2 px-1 text-sm">
                  <div className="text-xs opacity-90">Litros</div>
                  <div className="font-bold tabular-nums">{liters} L</div>
                </div>
              </div>

              <div className="text-xs opacity-85 mt-4 font-medium">
                Basado en tu peso (35 ml/kg) + ajustes por actividad y clima. Incluye el descuento del 20%
                aportado por alimentos sólidos.
              </div>

              <div className="border-t border-white/25 mt-4 pt-3 text-[11px] leading-relaxed opacity-90">
                Estimación educativa. No es consejo médico. Todo queda en tu navegador.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fila 2: plan del día */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            {/* Botella CSS: único acento azul-agua */}
            <div className="flex-shrink-0 w-12 h-16 mx-auto sm:mx-0">
              <div className="relative w-12 h-16 rounded-b-2xl rounded-t-md border-2 border-sky-400 dark:border-sky-500 overflow-hidden bg-sky-50 dark:bg-sky-900/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-sky-400 dark:bg-sky-500 rounded-b" />
                <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-sky-500 to-sky-400 dark:from-sky-600 dark:to-sky-500 animate-pulse" />
                <div className="absolute bottom-[26%] left-0 right-0 h-1 bg-white/50" />
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold">Tu plan de hoy</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {glasses} vasos de 250 ml, uno cada ~2–3 horas. Reparte tu agua directa en 5 momentos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DAY_PLAN.map((step) => {
              const ml = Math.round((result.direct * step.pct) / 25) * 25
              return (
                <div
                  key={step.label}
                  className="bg-sky-50 dark:bg-sky-900/15 border border-sky-200 dark:border-sky-800 rounded-xl px-3 py-4 text-center"
                >
                  <step.icon className="h-6 w-6 mx-auto mb-1.5 text-sky-600 dark:text-sky-400" />
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {step.time}
                  </div>
                  <div className="font-bold text-sky-700 dark:text-sky-300 tabular-nums text-lg leading-tight">
                    {ml.toLocaleString("es-ES")} ml
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{step.label}</div>
                </div>
              )
            })}
          </div>

          <div className="grid sm:grid-cols-2 gap-2 mt-5 text-sm text-gray-700 dark:text-gray-300">
            {[
              "Bebe un vaso al despertar para activar el metabolismo.",
              "Lleva una botella contigo y revisa el color de tu orina.",
              "Más agua antes, durante y después del ejercicio.",
              "Come frutas y verduras con alto contenido de agua.",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2">
                <Droplets className="h-4 w-4 mt-0.5 flex-shrink-0 text-sky-500" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fila 3: señales, una tarjeta de contraste */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Señales de hidratación</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-bold text-green-800 dark:text-green-300">Estás bien hidratado</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                Orina de color amarillo pálido
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                Energía estable sin fatiga ni mareos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                Boca y labios cómodos, sin sequedad
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="font-bold text-red-800 dark:text-red-300">Te falta agua</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                Sed intensa y boca o labios secos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                Orina de color amarillo intenso
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                Dolor de cabeza o cansancio repentino
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
