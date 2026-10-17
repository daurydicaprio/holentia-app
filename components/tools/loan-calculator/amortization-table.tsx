"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { AmortizationRow } from "@/types"

interface AmortizationTableProps {
  data: AmortizationRow[]
  formatCurrency: (value: number) => string
}

export function AmortizationTable({ data, formatCurrency }: AmortizationTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 12 // Mostrar un año completo
  const totalPages = Math.ceil(data.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, data.length)
  const currentData = data.slice(startIndex, endIndex)

  // Cambiar página
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        Ingresa los datos del préstamo para generar la tabla de amortización.
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 bg-[#388e3c]/20 dark:bg-[#388e3c]/30"
              >
                N° Cuota
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 bg-[#388e3c]/20 dark:bg-[#388e3c]/30"
              >
                Saldo Inicial
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 bg-[#388e3c]/20 dark:bg-[#388e3c]/30"
              >
                Cuota
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 bg-[#388e3c]/20 dark:bg-[#388e3c]/30"
              >
                Interés
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 bg-[#388e3c]/20 dark:bg-[#388e3c]/30"
              >
                Capital
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 bg-[#388e3c]/20 dark:bg-[#388e3c]/30"
              >
                Saldo Final
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <motion.tr
                key={row.month}
                className={`${
                  index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"
                } hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
              >
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {row.month}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {formatCurrency(row.initialBalance)}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {formatCurrency(row.payment)}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {formatCurrency(row.interest)}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {formatCurrency(row.principal)}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {formatCurrency(row.remainingBalance)}
                </td>
              </motion.tr>
            ))}
            <tr className="font-medium bg-[#388e3c]/10 dark:bg-[#388e3c]/20">
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700 text-finanzas-dark dark:text-finanzas-lighter"
              >
                Total
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700 text-finanzas-dark dark:text-finanzas-lighter"
              >
                {formatCurrency(data[0]?.initialBalance || 0)}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700 text-finanzas-dark dark:text-finanzas-lighter"
              >
                {formatCurrency(data.reduce((sum, row) => sum + row.payment, 0))}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700 text-finanzas-dark dark:text-finanzas-lighter"
              >
                {formatCurrency(data.reduce((sum, row) => sum + row.interest, 0))}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700 text-finanzas-dark dark:text-finanzas-lighter"
              >
                {formatCurrency(data.reduce((sum, row) => sum + row.principal, 0))}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700 text-finanzas-dark dark:text-finanzas-lighter"
              >
                {formatCurrency(data[data.length - 1]?.remainingBalance || 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-2">
            <button
              data-interactive="true"
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-md transition-colors ${
                currentPage === 1 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-finanzas dark:text-finanzas-light hover:bg-[#388e3c]/10 dark:hover:bg-[#388e3c]/20"
              }`}
              aria-label="Primera página"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              data-interactive="true"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-md transition-colors ${
                currentPage === 1 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-finanzas dark:text-finanzas-light hover:bg-[#388e3c]/10 dark:hover:bg-[#388e3c]/20"
              }`}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
            </span>

            <button
              data-interactive="true"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2.5 rounded-md transition-colors ${
                currentPage === totalPages ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-finanzas dark:text-finanzas-light hover:bg-[#388e3c]/10 dark:hover:bg-[#388e3c]/20"
              }`}
              aria-label="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
            <button
              data-interactive="true"
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2.5 rounded-md transition-colors ${
                currentPage === totalPages ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-finanzas dark:text-finanzas-light hover:bg-[#388e3c]/10 dark:hover:bg-[#388e3c]/20"
              }`}
              aria-label="Última página"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
