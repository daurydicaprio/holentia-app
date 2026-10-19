"use client"

import { useState } from "react"
import type { ExpenseItem } from "@/hooks/use-budget-simulator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { X } from "lucide-react"

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
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  // Borrador local: permite teclear puntos/comas parciales sin que el valor
  // controlado (number) los borre a mitad de edición en móvil.
  const handleDraftChange = (key: string, raw: string, commit: (value: number) => void) => {
    const clean = raw.replace(/[^\d.,]/g, "")
    const parsed = Number.parseFloat(clean.replace(/,(?=\d{1,2}$)/, ".").replace(/,/g, ""))
    setDrafts((prev) => ({ ...prev, [key]: clean }))
    commit(Number.isFinite(parsed) && parsed > 0 ? parsed : 0)
  }

  const clearDraft = (key: string) => {
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // Calcular totales
  const totalTarget = expenseItems.reduce((sum, item) => sum + item.target, 0)
  const totalAmount = expenseItems.reduce((sum, item) => sum + item.amount, 0)
  const totalDifference = totalTarget - totalAmount

  // Calcular porcentajes totales
  const totalTargetPercentage = totalIncome > 0 ? (totalTarget / totalIncome) * 100 : 0
  const totalAmountPercentage = totalIncome > 0 ? (totalAmount / totalIncome) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-[#1e3a2b] dark:text-[#a5d6a7]">Gastos mensuales</h2>
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
              >
                <span className="sr-only">Acciones</span>
              </th>
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
                    type="text"
                    inputMode="decimal"
                    aria-label={`Objetivo de ${item.concept}`}
                    value={drafts[`t-${item.id}`] ?? String(item.target)}
                    onChange={(e) =>
                      handleDraftChange(`t-${item.id}`, e.target.value, (value) => onUpdateTarget(item.id, value))
                    }
                    onBlur={() => clearDraft(`t-${item.id}`)}
                    className={`w-full rounded-md border bg-white px-2 py-2 text-base tabular-nums text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:bg-gray-800 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-finanzas-light ${
                      item.target > totalIncome && totalIncome > 0
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    data-interactive="true"
                  />
                </td>
                {!isMobile && (
                  <td className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200">
                    {item.targetPercentage !== undefined ? item.targetPercentage.toFixed(1) : "0.0"}%
                  </td>
                )}
                <td className="py-2 px-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label={`Consumido de ${item.concept}`}
                    value={drafts[`a-${item.id}`] ?? String(item.amount)}
                    onChange={(e) =>
                      handleDraftChange(`a-${item.id}`, e.target.value, (value) => onUpdateAmount(item.id, value))
                    }
                    onBlur={() => clearDraft(`a-${item.id}`)}
                    className={`w-full rounded-md border bg-white px-2 py-2 text-base tabular-nums text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:bg-gray-800 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-finanzas-light ${
                      item.amount > totalIncome && totalIncome > 0
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    data-interactive="true"
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
                      ? "text-green-700 dark:text-green-400"
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
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-[#388e3c]/20 bg-[#388e3c]/10 text-finanzas-dark transition-[colors,transform] duration-150 hover:bg-[#388e3c]/20 hover:text-finanzas-darkest active:scale-[0.97] dark:border-[#388e3c]/30 dark:bg-[#388e3c]/20 dark:text-finanzas-lighter dark:hover:bg-[#388e3c]/30"
                    aria-label={`Eliminar ${item.concept}`}
                    data-interactive="true"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#a5d6a7]">Total</td>
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#a5d6a7]">{formatCurrency(totalTarget)}</td>
              {!isMobile && (
                <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#a5d6a7]">
                  {totalTargetPercentage.toFixed(1)}%
                </td>
              )}
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#a5d6a7]">{formatCurrency(totalAmount)}</td>
              {!isMobile && (
                <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#a5d6a7]">
                  {totalAmountPercentage.toFixed(1)}%
                </td>
              )}
              <td
                className={`py-2 px-3 text-sm font-medium ${
                  totalDifference > 0
                    ? "text-green-700 dark:text-green-400"
                    : totalDifference < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-[#1e3a2b] dark:text-[#a5d6a7]"
                }`}
              >
                {formatCurrency(totalDifference)}
              </td>
              <td className="py-2 px-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4">
        <button
          data-interactive="true"
          onClick={onAddExpense}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-finanzas-dark px-3 py-2.5 text-sm font-medium text-white transition-[colors,transform] duration-150 hover:bg-finanzas-darkest active:scale-[0.97] sm:w-auto"
        >
          <span className="font-bold">+</span> Añadir gasto
        </button>
      </div>
    </div>
  )
}
