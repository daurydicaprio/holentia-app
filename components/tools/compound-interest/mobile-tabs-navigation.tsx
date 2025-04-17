"use client"

interface MobileTabsNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileTabsNavigation({ activeTab, onTabChange }: MobileTabsNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around">
        <button
          onClick={() => onTabChange("calculator")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "calculator"
              ? "text-finanzas-DEFAULT border-t-2 border-finanzas-DEFAULT"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Calculadora
        </button>
        <button
          onClick={() => onTabChange("charts")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "charts"
              ? "text-finanzas-DEFAULT border-t-2 border-finanzas-DEFAULT"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Gráficos
        </button>
      </div>
    </div>
  )
}
