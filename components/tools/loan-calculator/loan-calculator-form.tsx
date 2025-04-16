"use client"

import type React from "react"

interface LoanCalculatorFormProps {
  onCalculate: (loanAmount: number, interestRate: number, loanTerm: number) => void
  onSaveSimulation: () => void
  onResetForm: () => void
  disableSave: boolean
  loanAmount: number
  interestRate: number
  loanTerm: number
}

export function LoanCalculatorForm({
  onCalculate,
  onSaveSimulation,
  onResetForm,
  disableSave,
  loanAmount,
  interestRate,
  loanTerm,
}: LoanCalculatorFormProps) {
  // Manejar cambios en los inputs
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    const newValue = isNaN(value) ? 0 : value
    onCalculate(newValue, interestRate, loanTerm)
  }

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    const newValue = isNaN(value) ? 0 : value
    onCalculate(loanAmount, newValue, loanTerm)
  }

  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    const newValue = isNaN(value) ? 0 : value
    onCalculate(loanAmount, interestRate, newValue)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monto del Préstamo
          </label>
          <input
            id="loan-amount"
            type="number"
            min="1"
            step="1000"
            value={loanAmount}
            onChange={handleLoanAmountChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-[#388e3c] focus:border-[#388e3c]"
          />
        </div>

        <div>
          <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tasa de Interés Anual (%)
          </label>
          <input
            id="interest-rate"
            type="number"
            min="0.01"
            step="0.01"
            value={interestRate}
            onChange={handleInterestRateChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-[#388e3c] focus:border-[#388e3c]"
          />
        </div>

        <div>
          <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Plazo (meses)
          </label>
          <input
            id="loan-term"
            type="number"
            min="1"
            max="360"
            step="1"
            value={loanTerm}
            onChange={handleLoanTermChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-[#388e3c] focus:border-[#388e3c]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        <button
          onClick={onSaveSimulation}
          disabled={disableSave}
          className={`px-4 py-2 rounded-md bg-[#388e3c] hover:bg-[#1b5e20] text-white font-medium transition-colors ${
            disableSave ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Guardar Simulación
        </button>
        <button
          onClick={onResetForm}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition-colors"
        >
          Limpiar Campos
        </button>
      </div>
    </div>
  )
}
