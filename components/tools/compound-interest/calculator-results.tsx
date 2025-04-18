"use client"

import { motion } from "framer-motion"
import { Info } from "lucide-react"
import { useState } from "react"

interface CalculatorResultsProps {
  finalAmount: number
  totalContributions: number
  totalInterest: number
  inflationAdjustedAmount: number
  formatCurrency: (value: number) => string
}

export function CalculatorResults({
  finalAmount,
  totalContributions,
  totalInterest,
  inflationAdjustedAmount,
  formatCurrency,
}: CalculatorResultsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#388e3c] w-full text-center">
          Resultados de la inversión
          <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
        </h2>

        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            onMouseEnter={() => setActiveTooltip("results")}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label="Información sobre los resultados"
          >
            <Info size={18} />
          </button>

          {activeTooltip === "results" && (
            <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
              Estos son los resultados proyectados de tu inversión. El valor final muestra el monto total acumulado,
              mientras que el valor ajustado considera el efecto de la inflación en el poder adquisitivo.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-green-200 dark:border-green-900">
          <h3 className="text-lg font-semibold text-[#388e3c] mb-2">Valor final</h3>
          <p className="text-2xl font-bold">{formatCurrency(finalAmount)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monto total acumulado</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-900">
          <h3 className="text-lg font-semibold text-blue-500 mb-2">Valor ajustado por inflación</h3>
          <p className="text-2xl font-bold">{formatCurrency(inflationAdjustedAmount)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Poder adquisitivo real</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Capital aportado</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalContributions)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Inversión inicial + aportaciones</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-purple-200 dark:border-purple-900">
          <h3 className="text-lg font-semibold text-purple-500 mb-2">Interés generado</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ganancias de la inversión</p>
        </div>
      </div>
    </motion.div>
  )
}
