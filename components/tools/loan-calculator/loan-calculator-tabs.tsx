"use client"

import { Calculator, BarChart3, Table } from "lucide-react"

interface LoanCalculatorTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  hasSimulations: boolean
}

export function LoanCalculatorTabs({ activeTab, onTabChange, hasSimulations }: LoanCalculatorTabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onTabChange("calculator")}
        className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-colors ${
          activeTab === "calculator"
            ? "bg-[#388e3c] text-white border-b-2 border-[#1b5e20]"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <Calculator size={16} />
        <span>Calculadora</span>
      </button>

      <button
        onClick={() => onTabChange("simulations")}
        disabled={!hasSimulations}
        className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-colors ${
          activeTab === "simulations"
            ? "bg-[#388e3c] text-white border-b-2 border-[#1b5e20]"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        } ${!hasSimulations ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <BarChart3 size={16} />
        <span>Simulaciones</span>
      </button>

      <button
        onClick={() => onTabChange("table")}
        className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-colors ${
          activeTab === "table"
            ? "bg-[#388e3c] text-white border-b-2 border-[#1b5e20]"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <Table size={16} />
        <span>Amortización</span>
      </button>
    </div>
  )
}
