"use client"

import type { ExpenseItem } from "@/hooks/use-budget-simulator"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ExpenseTableProps {
  expenseItems: ExpenseItem[]
  totalIncome: number
  formatCurrency: (value: number) => string
  onAddExpense: () => void
  onRemoveExpense: (id: string) => void
  onUpdateTarget: (id: string, target: number) => void
  onUpdateAmount: (id: string, amount: number) => void
}

export function ExpenseTable({
  expenseItems,
  totalIncome,
  formatCurrency,
  onAddExpense,
  onRemoveExpense,
  onUpdateTarget,
  onUpdateAmount,
}: ExpenseTableProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Calcular totales
  const totalTarget = expenseItems.reduce((sum, item) => sum + item.target, 0)
  const totalAmount = expenseItems.reduce((sum, item) => sum + item.amount, 0)
  const totalDifference = totalTarget - totalAmount

  // Calcular porcentajes totales
  const totalTargetPercentage = totalIncome > 0 ? (totalTarget / totalIncome) * 100 : 0
  const totalAmountPercentage = totalIncome > 0 ? (totalAmount / totalIncome) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base font-medium text-[#1e3a2b] dark:text-[#6a9c77]">Gastos mensuales</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: isMobile ? "30%" : "25%" }}
              >
                Concepto
              </th>
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "20%" }}
              >
                Objetivo
              </th>
              {!isMobile && (
                <th
                  className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                  style={{ width: "10%" }}
                >
                  % / ing.
                </th>
              )}
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "20%" }}
              >
                Consumido
              </th>
              {!isMobile && (
                <th
                  className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                  style={{ width: "10%" }}
                >
                  % cons.
                </th>
              )}
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "10%" }}
              >
                Diferencia
              </th>
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "5%" }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {expenseItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200">{item.concept}</td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    value={item.target}
                    onChange={(e) => onUpdateTarget(item.id, Number(e.target.value))}
                    min="0"
                    className={`w-full p-1.5 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-[#388e3c] focus:border-[#388e3c] ${
                      item.target > totalIncome && totalIncome > 0
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </td>
                {!isMobile && (
                  <td className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200">
                    {item.targetPercentage !== undefined ? item.targetPercentage.toFixed(1) : "0.0"}%
                  </td>
                )}
                <td className="py-2 px-3">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => onUpdateAmount(item.id, Number(e.target.value))}
                    min="0"
                    className={`w-full p-1.5 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-[#388e3c] focus:border-[#388e3c] ${
                      item.amount > totalIncome && totalIncome > 0
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                </td>
                {!isMobile && (
                  <td className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200">
                    {item.percentage !== undefined ? item.percentage.toFixed(1) : "0.0"}%
                  </td>
                )}
                <td
                  className={`py-2 px-3 text-sm ${
                    item.difference && item.difference > 0
                      ? "text-green-600 dark:text-green-400"
                      : item.difference && item.difference < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {item.difference !== undefined ? formatCurrency(item.difference) : formatCurrency(0)}
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => onRemoveExpense(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-[#388e3c]/10 dark:bg-[#388e3c]/20 text-[#388e3c] hover:bg-[#388e3c]/20 dark:hover:bg-[#388e3c]/30 border border-[#388e3c]/20 dark:border-[#388e3c]/30"
                    aria-label="Eliminar"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#6a9c77]">Total</td>
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#6a9c77]">{formatCurrency(totalTarget)}</td>
              {!isMobile && (
                <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#6a9c77]">
                  {totalTargetPercentage.toFixed(1)}%
                </td>
              )}
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#6a9c77]">{formatCurrency(totalAmount)}</td>
              {!isMobile && (
                <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#6a9c77]">
                  {totalAmountPercentage.toFixed(1)}%
                </td>
              )}
              <td
                className={`py-2 px-3 text-sm font-medium ${
                  totalDifference > 0
                    ? "text-green-600 dark:text-green-400"
                    : totalDifference < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-[#1e3a2b] dark:text-[#6a9c77]"
                }`}
              >
                {formatCurrency(totalDifference)}
              </td>
              <td className="py-2 px-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3">
        <button
          onClick={onAddExpense}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-1.5 text-sm bg-[#388e3c] hover:bg-[#1b5e20] text-white font-medium rounded-md transition-colors"
        >
          <span className="font-bold">+</span> Añadir gasto
        </button>
      </div>
    </div>
  )
}
