"use client"

import { DollarSign, CreditCard, PieChart } from "lucide-react"

interface BudgetTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BudgetTabs({ activeTab, onTabChange }: BudgetTabsProps) {
  return (
    <div className="flex p-2 gap-1 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <button
        data-interactive="true"
        onClick={() => onTabChange("income")}
        className={`flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium flex-1 rounded-md transition-colors ${
          activeTab === "income"
            ? "bg-finanzas text-white shadow-sm"
            : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
        }`}
      >
        <DollarSign size={16} />
        <span>Ingresos</span>
      </button>

      <button
        data-interactive="true"
        onClick={() => onTabChange("expenses")}
        className={`flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium flex-1 rounded-md transition-colors ${
          activeTab === "expenses"
            ? "bg-finanzas text-white shadow-sm"
            : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
        }`}
      >
        <CreditCard size={16} />
        <span>Gastos</span>
      </button>

      <button
        data-interactive="true"
        onClick={() => onTabChange("summary")}
        className={`flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium flex-1 rounded-md transition-colors ${
          activeTab === "summary"
            ? "bg-finanzas text-white shadow-sm"
            : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
        }`}
      >
        <PieChart size={16} />
        <span>Resumen</span>
      </button>
    </div>
  )
}
