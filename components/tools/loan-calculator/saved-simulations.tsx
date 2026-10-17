"use client"

import type React from "react"
import { useState } from "react"
import type { LoanSimulation } from "@/hooks/use-loan-calculator"
import { Edit2, Save, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SavedSimulationsProps {
  simulations: LoanSimulation[]
  onRemove: (id: number) => void
  onUpdateName: (id: number, name: string) => void
  formatCurrency: (value: number) => string
}

export function SavedSimulations({ simulations, onRemove, onUpdateName, formatCurrency }: SavedSimulationsProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState<string>("")

  // Manejar clic en el nombre para editar
  const handleNameClick = (simulation: LoanSimulation) => {
    setEditingId(simulation.id)
    setEditingName(simulation.name)
  }

  // Guardar el nombre editado
  const saveNameChange = () => {
    if (editingId !== null) {
      onUpdateName(editingId, editingName.trim() || `Opción ${simulations.findIndex((s) => s.id === editingId) + 1}`)
      setEditingId(null)
    }
  }

  // Manejar tecla Enter al editar nombre
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveNameChange()
    }
  }

  if (simulations.length === 0) {
    return null
  }

  const clearAll = () => {
    simulations.forEach((simulation) => onRemove(simulation.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Save size={18} className="text-finanzas dark:text-finanzas-light" />
          Simulaciones Guardadas
        </h3>
        <button
          data-interactive="true"
          onClick={clearAll}
          className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
        >
          Borrar todas
        </button>
      </div>

      <AnimatePresence>
        {simulations.map((simulation, index) => (
          <motion.div
            key={simulation.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            layout
          >
            <div className="bg-[#388e3c]/10 dark:bg-[#388e3c]/20 px-4 py-3 flex justify-between items-center">
              {editingId === simulation.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={saveNameChange}
                  onKeyDown={handleKeyDown}
                  className="font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-finanzas rounded-md px-2 py-1.5 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-finanzas dark:focus:border-transparent dark:focus:ring-finanzas-light"
                  autoFocus
                  maxLength={25}
                  data-interactive="true"
                />
              ) : (
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">{simulation.name}</h3>
                  <button
                    data-interactive="true"
                    onClick={() => handleNameClick(simulation)}
                    className="ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-finanzas dark:text-finanzas-light"
                    aria-label="Editar nombre"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <button
                data-interactive="true"
                onClick={() => onRemove(simulation.id)}
                className="flex h-10 w-10 items-center justify-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Eliminar simulación"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Monto:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tasa:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {simulation.interestRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Plazo:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {simulation.loanTerm} {simulation.loanTerm === 1 ? "mes" : "meses"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Cuota:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.totalPayment)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Intereses:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.totalInterest)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
