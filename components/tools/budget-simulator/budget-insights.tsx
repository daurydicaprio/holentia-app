"use client"

import type { SavingProjection, TopExpense } from "@/hooks/use-budget-simulator"

interface BudgetInsightsProps {
  savingProjection: SavingProjection
  topExpenses: TopExpense[]
  formatCurrency: (value: number) => string
}

export function BudgetInsights({ savingProjection, topExpenses, formatCurrency }: BudgetInsightsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* Proyección de ahorro */}
      <div className="bg-gradient-to-br from-[#388e3c]/10 to-[#1e3a2b]/20 dark:from-[#388e3c]/20 dark:to-[#1e3a2b]/30 rounded-lg p-4 border border-[#388e3c]/20 dark:border-[#388e3c]/30 shadow-sm">
        <h3 className="text-[#1e3a2b] dark:text-[#6a9c77] font-medium text-sm mb-2">Proyección de ahorro</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
          Si te esfuerzas en cumplir con este presupuesto:
        </p>

        <div className="space-y-3">
          <div>
            <div className="text-gray-700 dark:text-gray-300 text-xs">
              En <strong>6 meses</strong> podrías tener:
            </div>
            <div className="text-base font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(savingProjection.sixMonth.amount)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              ({savingProjection.sixMonth.multiplier.toFixed(1)}× tu ingreso mensual)
            </div>
          </div>

          <div>
            <div className="text-gray-700 dark:text-gray-300 text-xs">
              En <strong>1 año</strong> podrías tener:
            </div>
            <div className="text-base font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(savingProjection.oneYear.amount)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
              ({savingProjection.oneYear.multiplier.toFixed(1)}× tu ingreso mensual)
            </div>
          </div>
        </div>
      </div>

      {/* Optimización de gastos */}
      <div className="bg-gradient-to-br from-[#388e3c]/10 to-[#1e3a2b]/20 dark:from-[#388e3c]/20 dark:to-[#1e3a2b]/30 rounded-lg p-4 border border-[#388e3c]/20 dark:border-[#388e3c]/30 shadow-sm">
        <h3 className="text-[#1e3a2b] dark:text-[#6a9c77] font-medium text-sm mb-2">Optimiza tus gastos</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
          {topExpenses.length > 0
            ? "Según este presupuesto, estas son tus categorías de mayor gasto:"
            : "Añade tus gastos para recibir recomendaciones personalizadas sobre cómo optimizarlos."}
        </p>

        {topExpenses.length > 0 && (
          <div className="space-y-2">
            {topExpenses.map((expense, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-md border border-[#388e3c]/10 dark:border-[#388e3c]/20"
              >
                <span className="text-gray-800 dark:text-gray-200 font-medium text-xs mb-1 sm:mb-0">
                  {expense.name}:
                </span>
                <span className="text-[#1e3a2b] dark:text-[#6a9c77] font-semibold text-xs">
                  {expense.percentage.toFixed(1)}% de tus ingresos
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tarjeta de plantilla */}
      <div className="sm:col-span-2 bg-gradient-to-br from-[#1e3a2b]/10 to-[#388e3c]/20 dark:from-[#1e3a2b]/20 dark:to-[#388e3c]/30 rounded-lg p-4 border border-[#388e3c]/20 dark:border-[#388e3c]/30 shadow-sm">
        <h3 className="text-[#1e3a2b] dark:text-[#6a9c77] font-medium text-sm mb-2">
          Aprende a crear tu presupuesto personal paso a paso
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
          Obtén tu plantilla de Excel o Google Sheet gratis y descubre cómo organizar tus finanzas de manera efectiva
        </p>
        <div className="text-[#388e3c] dark:text-[#6a9c77] font-medium text-xs">Descargar ahora →</div>
      </div>
    </div>
  )
}
