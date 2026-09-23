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
    <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/30 mb-12">
      <div className="relative text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 mb-5 shadow-lg">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-3">Tus datos, tu dispositivo</h3>
        <p className="text-green-800 dark:text-green-200 mb-6 max-w-2xl mx-auto leading-relaxed">
          Todo lo que escribes en HOLENTIA se guarda solo en este navegador. No tenemos servidores con tu
          información y no compartimos nada con terceros. Si quieres empezar de cero, borra todo aquí:
        </p>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300 transition-all duration-300"
          data-interactive="true"
        >
          <Trash2 className="h-5 w-5" />
          {done ? "Datos borrados ✓" : "Borrar todos mis datos"}
        </button>
      </div>
    </div>
  )
}
