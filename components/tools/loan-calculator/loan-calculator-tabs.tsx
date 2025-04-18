"use client"

import type React from "react"

import { Calculator, BarChart3, Table } from "lucide-react"
import { motion } from "framer-motion"

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
  // Colores de la sección finanzas
  const activeColor = "#2e7d32" // finanzas-DEFAULT
  const hoverColor = "rgba(46, 125, 50, 0.1)" // finanzas-DEFAULT con opacidad

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium flex-1 transition-colors relative ${
        isActive
          ? ""
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      whileHover={!disabled && !isActive ? { backgroundColor: hoverColor } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: activeColor }}
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-white" : ""}`}>
        {icon}
        <span>{label}</span>
      </span>
    </motion.button>
  )
}
