"use client"

import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export function LoanDisclaimer() {
  return (
    <motion.div
      className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <AlertTriangle size={16} className="text-amber-500" />
        <span>Notas Importantes</span>
      </h3>
      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
        <li className="flex items-start">
          <span className="text-finanzas-DEFAULT mr-2">•</span>
          Los resultados de esta simulación son aproximados.
        </li>
        <li className="flex items-start">
          <span className="text-finanzas-DEFAULT mr-2">•</span>
          Se consideran meses de 30 días y años de 360 días.
        </li>
        <li className="flex items-start">
          <span className="text-finanzas-DEFAULT mr-2">•</span>
          No se contempló período de gracia y el primer vencimiento es a 30 días.
        </li>
        <li className="flex items-start">
          <span className="text-finanzas-DEFAULT mr-2">•</span>
          En caso de préstamos hipotecarios, la cuota mensual aumentaría producto del seguro de vida y de propiedad, no
          incluidos en el cálculo.
        </li>
      </ul>
    </motion.div>
  )
}
