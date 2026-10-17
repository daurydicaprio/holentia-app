"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-[90%] p-6">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          aria-label="Cerrar modal"
          data-interactive="true"
        >
          <X className="h-4 w-4" aria-hidden="true" />
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
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-finanzas dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-transparent dark:focus:ring-finanzas-light"
            autoFocus
            data-interactive="true"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-200 px-4 py-2.5 font-medium text-gray-800 transition-[colors,transform] duration-150 hover:bg-gray-300 active:scale-[0.97] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            data-interactive="true"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-finanzas-dark px-4 py-2.5 font-medium text-white transition-[colors,transform] duration-150 hover:bg-finanzas-darkest active:scale-[0.97]"
            data-interactive="true"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
