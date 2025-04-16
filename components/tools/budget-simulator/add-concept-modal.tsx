"use client"

import type React from "react"

import { useState } from "react"

interface AddConceptModalProps {
  type: "income" | "expense"
  onSave: (concept: string) => void
  onCancel: () => void
}

export function AddConceptModal({ type, onSave, onCancel }: AddConceptModalProps) {
  const [conceptName, setConceptName] = useState("")

  const handleSave = () => {
    if (conceptName.trim()) {
      onSave(conceptName.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-[90%] p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Añadir nuevo {type === "income" ? "ingreso" : "gasto"}
        </h3>

        <div className="mb-6">
          <label htmlFor="concept-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del concepto:
          </label>
          <input
            type="text"
            id="concept-name"
            value={conceptName}
            onChange={(e) => setConceptName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ingrese un nombre para el ${type === "income" ? "ingreso" : "gasto"}`}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-[#388e3c] focus:border-[#388e3c]"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white font-medium rounded-md transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
