"use client"

import type { SummaryData } from "@/hooks/use-compound-interest-calculator"
import { CompoundInterestResult } from "./compound-interest-result"

interface CalculatorSummaryProps {
  summary: SummaryData
  formatCurrency: (value: number) => string
  showDetailedCards?: boolean
}

export function CalculatorSummary({ summary, formatCurrency, showDetailedCards = true }: CalculatorSummaryProps) {
  // Si no queremos mostrar las tarjetas detalladas, solo mostramos el resultado principal
  if (!showDetailedCards) {
    return <CompoundInterestResult summary={summary} formatCurrency={formatCurrency} />
  }

  return (
    <div className="space-y-5">
      {/* Resumen principal */}
      <CompoundInterestResult summary={summary} formatCurrency={formatCurrency} />

      {/* Resumen detallado */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-[#388e3c] dark:hover:border-[#388e3c]">
          <div className="text-lg font-bold text-[#388e3c]">{formatCurrency(summary.netGain)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Ganancia</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-[#388e3c] dark:hover:border-[#388e3c]">
          <div className="text-lg font-bold text-[#388e3c]">{formatCurrency(summary.totalContributions)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Aportes totales</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-[#388e3c] dark:hover:border-[#388e3c]">
          <div className="text-lg font-bold text-[#388e3c]">{formatCurrency(summary.initialDeposit)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Depósito inicial</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 group relative overflow-hidden">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.inflationEffect)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Inflación</div>
          <div className="h-0.5 w-0 bg-red-500 group-hover:w-full transition-all duration-300 mx-auto mt-2 absolute bottom-0 left-0"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-[#388e3c] dark:hover:border-[#388e3c]">
          <div className="text-lg font-bold text-[#388e3c]">{summary.doubleTime}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tiempo en duplicar</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-[#388e3c] dark:hover:border-[#388e3c]">
          <div className="text-lg font-bold text-[#388e3c]">{summary.annualizedReturn}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Retorno anualizado</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 col-span-2 sm:col-span-3 group relative overflow-hidden">
          <div className="text-lg font-bold text-[#388e3c]">{summary.totalReturn}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Rendimiento total</div>
          <div className="h-0.5 w-0 bg-[#388e3c] group-hover:w-full transition-all duration-300 mx-auto mt-2 absolute bottom-0 left-0"></div>
        </div>
      </div>
    </div>
  )
}
