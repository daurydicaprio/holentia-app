"use client"

import { Calculator, BarChart2 } from "lucide-react"

interface MobileTabsNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileTabsNavigation({ activeTab, onTabChange }: MobileTabsNavigationProps) {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 mb-4">
      <button
        onClick={() => onTabChange("calculator")}
        className={`flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium flex-1 transition-colors ${
          activeTab === "calculator"
            ? "bg-[#388e3c] text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <Calculator size={16} />
        <span>Calculadora</span>
      </button>

      <button
        onClick={() => onTabChange("charts")}
        className={`flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium flex-1 transition-colors ${
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
