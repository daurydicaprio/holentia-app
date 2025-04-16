"use client"

import type { BudgetItem } from "@/hooks/use-budget-simulator"
import { useMediaQuery } from "@/hooks/use-media-query"

interface IncomeTableProps {
  incomeItems: BudgetItem[]
  totalIncome: number
  formatCurrency: (value: number) => string
  onAddIncome: () => void
  onRemoveIncome: (id: string) => void
  onUpdateAmount: (id: string, amount: number) => void
}

export function IncomeTable({
  incomeItems,
  totalIncome,
  formatCurrency,
  onAddIncome,
  onRemoveIncome,
  onUpdateAmount,
}: IncomeTableProps) {
  const isMobile = useMediaQuery("(max-width: 480px)")

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base font-medium text-[#1e3a2b] dark:text-[#6a9c77]">Ingresos mensuales</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "50%" }}
              >
                Concepto
              </th>
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "25%" }}
              >
                Valor
              </th>
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "20%" }}
              >
                % del ingreso
              </th>
              <th
                className="text-left py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300"
                style={{ width: "5%" }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {incomeItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200">{item.concept}</td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => onUpdateAmount(item.id, Number(e.target.value))}
                    min="0"
                    className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-[#388e3c] focus:border-[#388e3c]"
                  />
                </td>
                <td className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200">
                  {item.percentage !== undefined ? item.percentage.toFixed(1) : "0.0"}%
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => onRemoveIncome(item.id)}
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
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#6a9c77]">{formatCurrency(totalIncome)}</td>
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#6a9c77]">100%</td>
              <td className="py-2 px-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3">
        <button
          onClick={onAddIncome}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-1.5 text-sm bg-[#388e3c] hover:bg-[#1b5e20] text-white font-medium rounded-md transition-colors"
        >
          <span className="font-bold">+</span> Añadir ingreso
        </button>
      </div>
    </div>
  )
}
