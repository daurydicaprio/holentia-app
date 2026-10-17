"use client"

import type { BudgetSummary as BudgetSummaryType } from "@/hooks/use-budget-simulator"
import { useCountUp } from "@/hooks/use-count-up"

interface BudgetSummaryProps {
  summary: BudgetSummaryType
  formatCurrency: (value: number) => string
}

export function BudgetSummary({ summary, formatCurrency }: BudgetSummaryProps) {
  const { totalIncome, totalExpenses, balance, totalSaved, savedPercentage } = summary
  const animatedIncome = useCountUp(totalIncome)
  const animatedExpenses = useCountUp(totalExpenses)
  const animatedBalance = useCountUp(balance)
  const animatedSaved = useCountUp(totalSaved)

  return (
    <div aria-live="polite" className="animate-result-in bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-[#1e3a2b] dark:text-[#a5d6a7]">Resumen financiero</h2>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">Ingresos totales</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(animatedIncome)}</div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">Gastos totales</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(animatedExpenses)}</div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">Balance</div>
          <div
            className={`text-lg font-semibold ${
              balance >= 0 ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(animatedBalance)}
          </div>
        </div>

        <div className="flex justify-between items-center py-2">
          <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            Total ahorrado en el mes{" "}
            <span className="text-xs font-normal">({savedPercentage.toFixed(1)}% de tus ingresos)</span>
          </div>
          <div
            className={`text-lg font-semibold ${
              totalSaved >= 0 ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(animatedSaved)}
          </div>
        </div>
      </div>
    </div>
  )
}
