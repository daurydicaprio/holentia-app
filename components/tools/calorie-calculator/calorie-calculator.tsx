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

const DRAFT_KEY = draftKey("calculadora-calorias")

interface CalorieDraft {
  weight?: string
  height?: string
  age?: string
  sex?: string
  activity?: string
}

export function CalorieCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [sex, setSex] = useState<string>("male")
  const [activity, setActivity] = useState<string>("moderate")
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
      if (storageSet(DRAFT_KEY, { weight, height, age, sex, activity })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [weight, height, age, sex, activity])

  const result = useMemo(() => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)
    const a = Number.parseFloat(age)
    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(a) || a <= 0) return null
    const bmr = 10 * w + 6.25 * h - 5 * a + (sex === "male" ? 5 : -161)
    const tdee = Math.round(bmr * (ACTIVITY[activity]?.factor ?? 1.55))
    return {
      bmr: Math.round(bmr),
      maintain: tdee,
      lose: Math.round(tdee * 0.8),
      gain: Math.round(tdee * 1.1),
    }
  }, [weight, height, age, sex, activity])

  const clearData = () => {
    setWeight("")
    setHeight("")
    setAge("")
    setSex("male")
    setActivity("moderate")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const inputClass =
    "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"

  return (
    <div className="space-y-6">
      {/* Entrada */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">Calcula tus calorías diarias</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Según tu cuerpo y actividad, estima cuánto necesitas para mantener, bajar o subir de peso.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Peso (kg)</label>
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
          <div>
            <label className="block text-sm font-medium mb-2">Altura (cm)</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Ej: 170"
              className={inputClass}
              data-interactive="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Edad (años)</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ej: 30"
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
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
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
          <label className="block text-sm font-medium mb-2">Nivel de actividad física</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className={inputClass} data-interactive="true">
            {Object.entries(ACTIVITY).map(([value, opt]) => (
              <option key={value} value={value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local ✓" : "Se guarda solo en tu navegador"}
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

      {/* Resultados */}
      {result && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Flame className="h-14 w-14 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-3xl font-bold text-center text-amber-700 dark:text-amber-300 mb-1">
            {result.maintain.toLocaleString("es-ES")} kcal/día
          </h3>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
            Para mantener tu peso actual · Metabolismo base: {result.bmr.toLocaleString("es-ES")} kcal
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
              <Minus className="h-5 w-5 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Bajar de peso</div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {result.lose.toLocaleString("es-ES")}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">kcal/día aprox.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center ring-2 ring-amber-500/50">
              <Equal className="h-5 w-5 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Mantener</div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {result.maintain.toLocaleString("es-ES")}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">kcal/día aprox.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
              <Plus className="h-5 w-5 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subir de peso</div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {result.gain.toLocaleString("es-ES")}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">kcal/día aprox.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-4">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
            <span>
              Estimación educativa con fórmula Mifflin-St Jeor. No es un plan médico: si tienes alguna condición de
              salud, consulta a un profesional. Todo se calcula y guarda solo en tu navegador.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
