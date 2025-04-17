"use client"

import { useState } from "react"
import type { SimulationData } from "@/hooks/use-compound-interest-calculator"

interface AmortizationTableProps {
  annualData: SimulationData[]
  monthlyData: SimulationData[]
  tableView: "annual" | "monthly"
  setTableView: (view: "annual" | "monthly") => void
  formatCurrency: (value: number) => string
  inflation: number
  contributionFrequency: number
}

export function AmortizationTable({
  annualData,
  monthlyData,
  tableView,
  setTableView,
  formatCurrency,
  inflation,
  contributionFrequency,
}: AmortizationTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Determinar qué datos mostrar según la vista
  const dataToShow = tableView === "annual" ? annualData : monthlyData

  // Calcular paginación
  const totalPages = Math.ceil(dataToShow.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, dataToShow.length)
  const currentData = dataToShow.slice(startIndex, endIndex)

  // Cambiar página
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Calcular interés acumulado para la tabla
  const calculateAccumulatedInterest = (data: SimulationData[], index: number): number => {
    let accumulatedInterest = 0
    for (let i = 0; i <= index; i++) {
      accumulatedInterest += data[i].interest || 0
    }
    return accumulatedInterest
  }

  // Calcular balance ajustado por inflación
  const calculateAdjustedBalance = (balance: number, period: number): number => {
    const infl = inflation / 100
    if (infl <= 0) return balance

    const years = tableView === "annual" ? period : period / 12
    return balance / Math.pow(1 + infl, years)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-center text-finanzas-dark dark:text-finanzas-DEFAULT mb-6">
        Tabla de amortización
        <span className="block w-16 h-1 bg-finanzas-DEFAULT mx-auto mt-2"></span>
      </h2>

      {/* Botones para cambiar vista */}
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setTableView("annual")}
          className={`px-4 py-2 rounded-md transition-colors ${
            tableView === "annual"
              ? "bg-finanzas-DEFAULT text-white shadow-sm"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Anual
        </button>
        <button
          onClick={() => setTableView("monthly")}
          disabled={contributionFrequency !== 12}
          className={`px-4 py-2 rounded-md transition-colors ${
            tableView === "monthly"
              ? "bg-finanzas-DEFAULT text-white shadow-sm"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          } ${contributionFrequency !== 12 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Mensual
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 rounded-tl-md">
                {tableView === "annual" ? "Año" : "Mes"}
              </th>
              <th className="p-3 text-left bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
                Capital inicial
              </th>
              <th className="p-3 text-left bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
                Interés acumulado
              </th>
              <th className="p-3 text-left bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
                Balance final
              </th>
              <th className="p-3 text-left bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 rounded-tr-md">
                Balance ajustado
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => {
                const actualIndex = startIndex + index
                const accumulatedInterest = calculateAccumulatedInterest(dataToShow, actualIndex)
                const period = tableView === "annual" ? row.year : (row.period as number)
                const adjustedBalance = calculateAdjustedBalance(row.balance, period)

                return (
                  <tr
                    key={period}
                    className={`${
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"
                    } hover:bg-finanzas-DEFAULT/5 dark:hover:bg-finanzas-DEFAULT/10`}
                  >
                    <td className="p-3 border border-gray-200 dark:border-gray-700">{period}</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      {formatCurrency(row.startBalance)}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      {formatCurrency(accumulatedInterest)}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">{formatCurrency(row.balance)}</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      {formatCurrency(adjustedBalance)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No hay datos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            &laquo;
          </button>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            &lsaquo;
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            &rsaquo;
          </button>
          <button
            onClick={() => changePage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  )
}
