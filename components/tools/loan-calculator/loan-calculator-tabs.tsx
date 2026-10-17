"use client"

import type React from "react"

import { Calculator, BarChart3, Table } from "lucide-react"

interface LoanCalculatorTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  hasSimulations: boolean
}

export function LoanCalculatorTabs({ activeTab, onTabChange, hasSimulations }: LoanCalculatorTabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <TabButton
        isActive={activeTab === "calculator"}
        onClick={() => onTabChange("calculator")}
        icon={<Calculator size={16} />}
        label="Calculadora"
      />

      <TabButton
        isActive={activeTab === "simulations"}
        onClick={() => onTabChange("simulations")}
        disabled={!hasSimulations}
        icon={<BarChart3 size={16} />}
        label="Simulaciones"
      />

      <TabButton
        isActive={activeTab === "table"}
        onClick={() => onTabChange("table")}
        icon={<Table size={16} />}
        label="Amortización"
      />
    </div>
  )
}

interface TabButtonProps {
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  disabled?: boolean
}

function TabButton({ isActive, onClick, icon, label, disabled = false }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-interactive="true"
      className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-[colors,transform] duration-150 relative active:scale-[0.98] ${
        isActive
          ? "bg-finanzas-dark text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-finanzas-dark hover:text-white dark:hover:bg-finanzas-light dark:hover:text-gray-900"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-white" : ""}`}>
        {icon}
        <span>{label}</span>
      </span>
    </button>
  )
}
