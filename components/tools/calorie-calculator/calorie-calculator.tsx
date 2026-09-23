"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Flame, Trash2, Info, Minus, Equal, Plus } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

// Mifflin-St Jeor + factor de actividad. Estimación educativa, no plan médico.
const ACTIVITY: Record<string, { label: string; factor: number }> = {
  sedentary: { label: "Sedentario (poco o ningún ejercicio)", factor: 1.2 },
  light: { label: "Ligero (ejercicio 1-3 días/semana)", factor: 1.375 },
  moderate: { label: "Moderado (ejercicio 3-5 días/semana)", factor: 1.55 },
  intense: { label: "Intenso (ejercicio 6-7 días/semana)", factor: 1.725 },
}

const GOALS = [
  { id: "lose", label: "Bajar", hint: "−20% aprox.", icon: Minus },
  { id: "maintain", label: "Mantener", hint: "tu gasto total", icon: Equal },
  { id: "gain", label: "Subir", hint: "+10% aprox.", icon: Plus },
] as const

type GoalId = (typeof GOALS)[number]["id"]

const DRAFT_KEY = draftKey("calculadora-calorias")

interface CalorieDraft {
  weight?: string
  height?: string
  age?: string
  sex?: string
  activity?: string
  goal?: GoalId
}

export function CalorieCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [sex, setSex] = useState<string>("male")
  const [activity, setActivity] = useState<string>("moderate")
  const [goal, setGoal] = useState<GoalId>("maintain")
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restaurar borrador (Tipo D) solo en cliente
  useEffect(() => {
    const draft = storageGet<CalorieDraft>(DRAFT_KEY, {})
    if (draft.weight !== undefined) setWeight(draft.weight)
    if (draft.height !== undefined) setHeight(draft.height)
    if (draft.age !== undefined) setAge(draft.age)
    if (draft.sex !== undefined) setSex(draft.sex)
    if (draft.activity !== undefined) setActivity(draft.activity)
    if (draft.goal !== undefined) setGoal(draft.goal)
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
      if (storageSet(DRAFT_KEY, { weight, height, age, sex, activity, goal })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [weight, height, age, sex, activity, goal])

  const result = useMemo(() => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)
    const a = Number.parseFloat(age)
    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(a) || a <= 0) return null
    const bmr = 10 * w + 6.25 * h - 5 * a + (sex === "male" ? 5 : -161)
    const tdee = Math.round(bmr * (ACTIVITY[activity]?.factor ?? 1.55))
    return {
      bmr: Math.round(bmr),
      lose: Math.round(tdee * 0.8),
      maintain: tdee,
      gain: Math.round(tdee * 1.1),
    }
  }, [weight, height, age, sex, activity])

  const pickGoal = (id: GoalId) => {
    setGoal(id)
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setWeight("")
    setHeight("")
    setAge("")
    setSex("male")
    setActivity("moderate")
    setGoal("maintain")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const heroValue = result ? result[goal] : null
  const goalLabel = GOALS.find((g) => g.id === goal)?.label.toLowerCase() ?? ""

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"

  return (
    <div className="space-y-6">
      {/* Fila 1: tu objetivo primero */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-1">¿Cuál es tu objetivo?</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">El resultado se calcula para lo que elijas.</p>
        <div className="grid grid-cols-3 gap-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => pickGoal(g.id)}
              className={`p-4 rounded-xl border-2 font-medium transition-all text-center ${
                goal === g.id
                  ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-300 dark:hover:border-amber-700"
              }`}
              data-interactive="true"
            >
              <g.icon className="h-6 w-6 mx-auto mb-1" />
              <div className="font-bold">{g.label}</div>
              <div className="text-xs opacity-75 mt-0.5">{g.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fila 2: datos + resultado */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Tus datos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Peso (kg)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className={inputClass}
                data-interactive="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Altura (cm)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className={inputClass}
                data-interactive="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Edad</label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
                className={inputClass}
                data-interactive="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sexo biológico</label>
              <div className="flex gap-2">
                {[
                  { value: "male", label: "Hombre" },
                  { value: "female", label: "Mujer" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSex(opt.value)}
                    className={`flex-1 py-3 px-2 rounded-lg font-medium transition-colors ${
                      sex === opt.value
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    data-interactive="true"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Actividad física</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className={inputClass}
              data-interactive="true"
            >
              {Object.entries(ACTIVITY).map(([value, opt]) => (
                <option key={value} value={value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mt-4">
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

        <div>
          {!result ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
              <Flame className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="font-medium">Completa peso, altura y edad</p>
              <p className="text-sm mt-1">y verás tus calorías para {goalLabel}.</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-8 shadow-lg text-white text-center h-full flex flex-col justify-center">
              <div className="text-sm uppercase tracking-widest opacity-90 mb-2">Para {goalLabel} necesitas</div>
              <div className="text-6xl font-bold">{heroValue?.toLocaleString("es-ES")}</div>
              <div className="text-lg opacity-90 mt-1">kcal al día</div>
              <div className="grid grid-cols-3 gap-2 mt-6 text-center">
                {(["lose", "maintain", "gain"] as const).map((id) => (
                  <div
                    key={id}
                    className={`rounded-lg py-2 px-1 text-sm ${
                      id === goal ? "bg-white/25 font-bold" : "bg-white/10 opacity-80"
                    }`}
                  >
                    <div className="text-xs opacity-90 capitalize">
                      {id === "lose" ? "Bajar" : id === "maintain" ? "Mantener" : "Subir"}
                    </div>
                    <div className="font-bold">{result[id].toLocaleString("es-ES")}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs opacity-80 mt-4">Metabolismo base: {result.bmr.toLocaleString("es-ES")} kcal</div>
            </div>
          )}
          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-3 px-1">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
            <span>
              Estimación educativa (Mifflin-St Jeor). No es plan médico. Todo queda en tu navegador.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
