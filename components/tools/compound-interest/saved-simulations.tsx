"use client"

import type React from "react"

import { useState } from "react"
import type { SavedSimulation } from "@/hooks/use-compound-interest-calculator"
import { Edit2, Save, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SavedSimulationsProps {
  simulations: SavedSimulation[]
  onRemove: (id: number) => void
  onUpdateName: (id: number, name: string) => void
  formatCurrency: (value: number) => string
}

export function SavedSimulations({ simulations, onRemove, onUpdateName, formatCurrency }: SavedSimulationsProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState<string>("")

  // Manejar clic en el nombre para editar
  const handleNameClick = (simulation: SavedSimulation) => {
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
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay simulaciones guardadas. Configura los parámetros y guarda una simulación para compararla.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <Save size={18} className="text-[#388e3c] dark:text-[#6a9c77]" />
        Simulaciones Guardadas
      </h3>

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
                  className="font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-finanzas-DEFAULT rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-finanzas-DEFAULT"
                  autoFocus
                  maxLength={25}
                />
              ) : (
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">{simulation.name}</h3>
                  <button
                    onClick={() => handleNameClick(simulation)}
                    className="ml-2 p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-[#388e3c] dark:text-[#6a9c77]"
                    aria-label="Editar nombre"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <button
                onClick={() => onRemove(simulation.id)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Eliminar simulación"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Depósito inicial:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.initialDeposit)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Aportación:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.contribution)}{" "}
                    {simulation.contributionFrequency === 12 ? "mensual" : "anual"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tasa de interés:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {simulation.interestRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Años:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{simulation.years}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Inflación:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {simulation.inflation.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Balance final:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.balanceNet)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Ganancia neta:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(simulation.netGain)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Aportes totales:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatCurrency(simulation.totalContributions)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700 col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Rendimiento total:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{simulation.totalReturn}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
