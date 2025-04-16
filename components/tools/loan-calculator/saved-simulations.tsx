"use client"

import type React from "react"
import { useState } from "react"
import type { LoanSimulation } from "@/hooks/use-loan-calculator"
import { X, Edit2 } from "lucide-react"

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
      onUpdateName(editingId, editingName.trim())
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Simulaciones Guardadas</h3>
      <div className="grid grid-cols-1 gap-4">
        {simulations.map((simulation) => (
          <div
            key={simulation.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="bg-[#388e3c]/10 dark:bg-[#388e3c]/20 px-4 py-3 flex justify-between items-center">
              {editingId === simulation.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={saveNameChange}
                  onKeyDown={handleKeyDown}
                  className="font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-[#388e3c] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#388e3c]"
                  autoFocus
                  maxLength={25}
                />
              ) : (
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">{simulation.name}</h3>
                  <button
                    onClick={() => handleNameClick(simulation)}
                    className="ml-2 text-[#388e3c] hover:text-[#1b5e20]"
                    aria-label="Editar nombre"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <button
                onClick={() => onRemove(simulation.id)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                aria-label="Eliminar simulación"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
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
          </div>
        ))}
      </div>
    </div>
  )
}
