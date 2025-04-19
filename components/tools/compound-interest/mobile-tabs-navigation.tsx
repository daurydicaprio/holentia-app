"use client"

import { Calculator, BarChart2, Save } from "lucide-react"

interface MobileTabsNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  hasSimulations?: boolean
}

export function MobileTabsNavigation({ activeTab, onTabChange, hasSimulations = false }: MobileTabsNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex rounded-lg mt-6 overflow-hidden">
      <button
        onClick={() => onTabChange("calculator")}
        className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-colors border-r border-gray-200 dark:border-gray-700 ${
          activeTab === "calculator"
            ? "bg-[#388e3c] text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <Calculator size={16} />
        <span>Calculadora</span>
      </button>

      <button
        onClick={() => onTabChange("simulations")}
        className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-colors border-r border-gray-200 dark:border-gray-700 ${
          activeTab === "simulations"
            ? "bg-[#388e3c] text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <Save size={16} />
        <span>Simulaciones</span>
      </button>

      <button
        onClick={() => onTabChange("charts")}
        className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-colors ${
          activeTab === "charts"
            ? "bg-[#388e3c] text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <BarChart2 size={16} />
        <span>Gráficos</span>
      </button>
    </div>
  )
}
