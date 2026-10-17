"use client"

import { useState } from "react"
import { ShieldCheck, Trash2 } from "lucide-react"
import { storageClearAll } from "@/lib/storage"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export function ClearAllData() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [done, setDone] = useState(false)

  const handleClear = () => {
    storageClearAll()
    setDone(true)
    triggerHapticFeedback("medium")
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 text-center mb-12 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 mb-4">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Tus datos, tu dispositivo</h3>
      <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
        Todo lo que escribes en HOLENTIA se guarda solo en este navegador. No tenemos servidores con tu información y
        no compartimos nada con terceros. Si quieres empezar de cero, borra todo aquí:
      </p>
      <button
        onClick={handleClear}
        data-interactive="true"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-red-600 dark:bg-white dark:text-gray-900 dark:hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
        {done ? "Datos borrados" : "Borrar todos mis datos"}
      </button>
    </div>
  )
}
