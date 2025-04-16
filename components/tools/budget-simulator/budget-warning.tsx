"use client"

interface BudgetWarningProps {
  onClose: () => void
}

export function BudgetWarning({ onClose }: BudgetWarningProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-red-500 dark:border-red-400 max-w-md w-[90%] p-6 animate-pulse relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl p-1"
          aria-label="Cerrar advertencia"
        >
          ×
        </button>
        <div className="flex gap-4">
          <div className="text-3xl text-red-500 dark:text-red-400">⚠️</div>
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              ¡Atención! Gastos exceden ingresos
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
              No puedes crear dinero de la nada. Si gastas más de lo que ingresas, ese dinero debe salir de algún lado:
              tarjetas de crédito, préstamos o ahorros previos.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              Revisa tus gastos o agrega en la sección de ingresos el origen de ese dinero adicional que estás gastando.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
