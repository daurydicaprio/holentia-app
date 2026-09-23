"use client"

import { useState, useEffect } from "react"
import { Droplets, Activity, Sun, Thermometer } from "lucide-react"

export function HydrationCalculator() {
  const [weight, setWeight] = useState<string>("")
  const [activityLevel, setActivityLevel] = useState<string>("sedentary")
  const [climate, setClimate] = useState<string>("temperate")
  const [result, setResult] = useState<number | null>(null)

  const calculateHydration = () => {
    const weightNum = Number.parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0) {
      return
    }

    // Fórmula base: 35ml por kg de peso corporal
    let baseHydration = weightNum * 35

    // Ajuste por nivel de actividad
    const activityMultipliers: Record<string, number> = {
      sedentary: 1,
      light: 1.2,
      moderate: 1.4,
      intense: 1.6,
    }
    baseHydration *= activityMultipliers[activityLevel] || 1

    // Ajuste por clima
    const climateAdjustments: Record<string, number> = {
      cold: 0.9,
      temperate: 1,
      warm: 1.1,
      hot: 1.3,
    }
    baseHydration *= climateAdjustments[climate] || 1

    setResult(Math.round(baseHydration))
  }

  useEffect(() => {
    if (weight && Number.parseFloat(weight) > 0) {
      calculateHydration()
    }
  }, [weight, activityLevel, climate])

  return (
    <div className="space-y-6">
      {/* Formulario de entrada */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-6">Calcula tu hidratación diaria</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tu peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej: 70"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nivel de actividad física</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="sedentary">Sedentario (poco o ningún ejercicio)</option>
              <option value="light">Ligero (ejercicio 1-3 días/semana)</option>
              <option value="moderate">Moderado (ejercicio 3-5 días/semana)</option>
              <option value="intense">Intenso (ejercicio 6-7 días/semana)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Clima donde vives</label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="cold">Frío (menos de 10°C promedio)</option>
              <option value="temperate">Templado (10-25°C)</option>
              <option value="warm">Cálido (25-30°C)</option>
              <option value="hot">Caluroso (más de 30°C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {result && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <Droplets className="h-16 w-16 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-3xl font-bold text-center text-amber-700 dark:text-amber-300 mb-2">
            {result.toLocaleString("es-ES")} ml/día
          </h3>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-6">Esta es tu hidratación diaria recomendada</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold">En vasos</span>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{Math.round(result / 250)} vasos</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">de 250ml cada uno</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold">En litros</span>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{(result / 1000).toFixed(1)}L</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">aproximadamente</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Consejos para mantenerte hidratado
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                <span>Bebe un vaso de agua al despertar para activar tu metabolismo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                <span>Lleva siempre una botella de agua contigo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                <span>Establece recordatorios cada 2 horas para beber agua</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                <span>Consume frutas y verduras con alto contenido de agua</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                <span>Bebe más agua antes, durante y después del ejercicio</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="font-semibold text-lg mb-4">Señales de buena hidratación</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
              <Droplets className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium mb-1">Orina clara</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Color amarillo pálido</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium mb-1">Energía constante</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sin fatiga ni mareos</p>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-4 mt-6">Señales de deshidratación</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
              <Thermometer className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium mb-1">Sed intensa</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Boca y labios secos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
              <Sun className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium mb-1">Orina oscura</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Color amarillo intenso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
