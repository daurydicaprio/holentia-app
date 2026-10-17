"use client"

import { LineChart, PieChart } from "lucide-react"

interface CalculatorTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function CalculatorTabs({ activeTab, onTabChange }: CalculatorTabsProps) {
  return (
    <div className="flex p-2 gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        data-interactive="true"
        onClick={() => onTabChange("chart")}
        className={`flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium flex-1 rounded-md transition-[colors,transform] duration-150 active:scale-[0.97] ${
          activeTab === "chart"
            ? "bg-finanzas-dark text-white"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
        }`}
      >
        <LineChart size={16} />
        <span>Gráfico</span>
      </button>

      <button
        data-interactive="true"
        onClick={() => onTabChange("summary")}
        className={`flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium flex-1 rounded-md transition-[colors,transform] duration-150 active:scale-[0.97] ${
          activeTab === "summary"
            ? "bg-finanzas-dark text-white"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
        }`}
      >
        <PieChart size={16} />
        <span>Resumen</span>
      </button>
    </div>
  )
}
