"use client"

import { useState } from "react"
import type { BudgetItem } from "@/hooks/use-budget-simulator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { X } from "lucide-react"

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

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-[#1e3a2b] dark:text-[#a5d6a7]">Ingresos mensuales</h2>
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
              >
                <span className="sr-only">Acciones</span>
              </th>
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
                    type="text"
                    inputMode="decimal"
                    aria-label={`Valor de ${item.concept}`}
                    value={drafts[`v-${item.id}`] ?? String(item.amount)}
                    onChange={(e) =>
                      handleDraftChange(`v-${item.id}`, e.target.value, (value) => onUpdateAmount(item.id, value))
                    }
                    onBlur={() => clearDraft(`v-${item.id}`)}
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-base tabular-nums text-gray-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-transparent dark:focus:ring-finanzas-light"
                    data-interactive="true"
                  />
                </td>
                <td className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200">
                  {item.percentage !== undefined ? item.percentage.toFixed(1) : "0.0"}%
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => onRemoveIncome(item.id)}
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
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#a5d6a7]">{formatCurrency(totalIncome)}</td>
              <td className="py-2 px-3 text-sm text-[#1e3a2b] dark:text-[#a5d6a7]">100%</td>
              <td className="py-2 px-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4">
        <button
          data-interactive="true"
          onClick={onAddIncome}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-finanzas-dark px-3 py-2.5 text-sm font-medium text-white transition-[colors,transform] duration-150 hover:bg-finanzas-darkest active:scale-[0.97] sm:w-auto"
        >
          <span className="font-bold">+</span> Añadir ingreso
        </button>
      </div>
    </div>
  )
}
