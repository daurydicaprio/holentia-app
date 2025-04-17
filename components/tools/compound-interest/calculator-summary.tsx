"use client"

import type { SummaryData } from "@/hooks/use-compound-interest-calculator"

interface CalculatorSummaryProps {
  summary: SummaryData
  formatCurrency: (value: number) => string
}

export function CalculatorSummary({ summary, formatCurrency }: CalculatorSummaryProps) {
  return (
    <div className="space-y-5">
      {/* Resumen principal */}
      <div className="bg-gradient-to-r from-finanzas-DEFAULT to-finanzas-dark text-white rounded-lg p-5 shadow-md border border-finanzas-DEFAULT/30">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold mb-1">{formatCurrency(summary.balanceNet)}</div>
          <div className="text-sm text-gray-100">Balance neto</div>
        </div>
      </div>

      {/* Resumen detallado */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
          <div className="text-lg font-bold text-finanzas-dark dark:text-finanzas-DEFAULT">
            {formatCurrency(summary.netGain)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Ganancia</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
          <div className="text-lg font-bold text-finanzas-dark dark:text-finanzas-DEFAULT">
            {formatCurrency(summary.totalContributions)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Aportes totales</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
          <div className="text-lg font-bold text-finanzas-dark dark:text-finanzas-DEFAULT">
            {formatCurrency(summary.initialDeposit)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Depósito inicial</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border-l-4 border-red-500 dark:border-red-400">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.inflationEffect)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Inflación</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
          <div className="text-lg font-bold text-finanzas-dark dark:text-finanzas-DEFAULT">{summary.doubleTime}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Tiempo en duplicar</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600">
          <div className="text-lg font-bold text-finanzas-dark dark:text-finanzas-DEFAULT">
            {summary.annualizedReturn}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Retorno anualizado</div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition-shadow border-l-4 border-finanzas-DEFAULT col-span-2 sm:col-span-3">
          <div className="text-lg font-bold text-finanzas-dark dark:text-finanzas-DEFAULT">{summary.totalReturn}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Rendimiento total</div>
        </div>
      </div>
    </div>
  )
}
