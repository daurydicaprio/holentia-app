"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface AmortizationRow {
  month: number
  initialBalance: number
  payment: number
  interest: number
  principal: number
  remainingBalance: number
}

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

  // Colores de la sección finanzas
  const headerBgColor = "rgba(76, 175, 80, 0.2)" // finanzas-light con opacidad
  const headerBgColorDark = "rgba(46, 125, 50, 0.3)" // finanzas-DEFAULT con opacidad
  const totalRowBgColor = "rgba(76, 175, 80, 0.3)" // finanzas-light con opacidad
  const totalRowBgColorDark = "rgba(46, 125, 50, 0.2)" // finanzas-DEFAULT con opacidad
  const totalRowTextColor = "#1b5e20" // finanzas-dark
  const totalRowTextColorDark = "#a5d6a7" // finanzas-light
  const buttonColor = "#2e7d32" // finanzas-DEFAULT
  const buttonHoverBgColor = "rgba(76, 175, 80, 0.2)" // finanzas-light con opacidad
  const buttonHoverBgColorDark = "rgba(46, 125, 50, 0.2)" // finanzas-DEFAULT con opacidad

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
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: headerBgColor }}
              >
                N° Cuota
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: headerBgColor }}
              >
                Saldo Inicial
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: headerBgColor }}
              >
                Cuota
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: headerBgColor }}
              >
                Interés
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: headerBgColor }}
              >
                Capital
              </th>
              <th
                className="p-3 text-left text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: headerBgColor }}
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
            <tr style={{ backgroundColor: totalRowBgColor }} className="font-medium">
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700"
                style={{ color: totalRowTextColor }}
              >
                Total
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700"
                style={{ color: totalRowTextColor }}
              >
                {formatCurrency(data[0]?.initialBalance || 0)}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700"
                style={{ color: totalRowTextColor }}
              >
                {formatCurrency(data.reduce((sum, row) => sum + row.payment, 0))}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700"
                style={{ color: totalRowTextColor }}
              >
                {formatCurrency(data.reduce((sum, row) => sum + row.interest, 0))}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700"
                style={{ color: totalRowTextColor }}
              >
                {formatCurrency(data.reduce((sum, row) => sum + row.principal, 0))}
              </td>
              <td
                className="p-3 text-sm border border-gray-200 dark:border-gray-700"
                style={{ color: totalRowTextColor }}
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
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : ""
              }`}
              style={{
                color: currentPage === 1 ? undefined : buttonColor,
              }}
              aria-label="Primera página"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : ""
              }`}
              style={{
                color: currentPage === 1 ? undefined : buttonColor,
              }}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : ""
              }`}
              style={{
                color: currentPage === totalPages ? undefined : buttonColor,
              }}
              aria-label="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : ""
              }`}
              style={{
                color: currentPage === totalPages ? undefined : buttonColor,
              }}
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
