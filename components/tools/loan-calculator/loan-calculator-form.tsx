"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { RefreshCw, Save } from "lucide-react"

interface LoanCalculatorFormProps {
  onCalculate: (loanAmount: number, interestRate: number, loanTerm: number) => void
  onSaveSimulation: () => void
  onResetForm: () => void
  disableSave: boolean
  loanAmount: number
  interestRate: number
  loanTerm: number
}

// Función para formatear números con comas y decimales
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Función para eliminar formato y convertir a número
const parseFormattedNumber = (formattedValue: string): number => {
  // Eliminar todas las comas y convertir a número
  const numericValue = formattedValue.replace(/,/g, "")
  return Number.parseFloat(numericValue)
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
  // Estado para el valor formateado del monto del préstamo
  const [formattedLoanAmount, setFormattedLoanAmount] = useState<string>(formatNumber(loanAmount))

  // Actualizar el valor formateado cuando cambia loanAmount desde props
  useEffect(() => {
    setFormattedLoanAmount(formatNumber(loanAmount))
  }, [loanAmount])

  // Manejar cambios en los inputs
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Si el input está vacío, establecer a 0
    if (!inputValue.trim()) {
      onCalculate(0, interestRate, loanTerm)
      setFormattedLoanAmount("")
      return
    }

    try {
      // Intentar parsear el valor numérico
      const numericValue = parseFormattedNumber(inputValue)

      if (!isNaN(numericValue)) {
        onCalculate(numericValue, interestRate, loanTerm)
        // Actualizar el valor formateado solo si es un número válido
        setFormattedLoanAmount(formatNumber(numericValue))
      }
    } catch (error) {
      // Si hay un error al parsear, no actualizar
      console.error("Error parsing number:", error)
    }
  }

  const handleLoanAmountBlur = () => {
    // Al perder el foco, asegurarse de que el formato sea correcto
    setFormattedLoanAmount(formatNumber(loanAmount))
  }

  const handleLoanAmountSliderChange = (value: number[]) => {
    onCalculate(value[0], interestRate, loanTerm)
  }

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    const newValue = isNaN(value) ? 0 : value
    onCalculate(loanAmount, newValue, loanTerm)
  }

  const handleInterestRateSliderChange = (value: number[]) => {
    onCalculate(loanAmount, value[0], loanTerm)
  }

  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    const newValue = isNaN(value) ? 0 : value
    onCalculate(loanAmount, interestRate, newValue)
  }

  const handleLoanTermSliderChange = (value: number[]) => {
    onCalculate(loanAmount, interestRate, value[0])
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-finanzas-DEFAULT dark:text-finanzas-light mb-4">Datos del préstamo</h3>

      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto del Préstamo
            </label>
            <span className="text-sm font-semibold text-finanzas-DEFAULT dark:text-finanzas-light">
              {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(loanAmount)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Input
              id="loan-amount"
              type="text"
              value={formattedLoanAmount}
              onChange={handleLoanAmountChange}
              onBlur={handleLoanAmountBlur}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-finanzas-DEFAULT focus:border-finanzas-DEFAULT"
            />
            <Slider
              defaultValue={[loanAmount]}
              max={1000000}
              step={1000}
              value={[loanAmount]}
              onValueChange={handleLoanAmountSliderChange}
              className="py-2 loan-calculator-slider"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tasa de Interés Anual
            </label>
            <span className="text-sm font-semibold text-finanzas-DEFAULT dark:text-finanzas-light">
              {interestRate}%
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Input
              id="interest-rate"
              type="number"
              min="0.01"
              step="0.01"
              value={interestRate}
              onChange={handleInterestRateChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-finanzas-DEFAULT focus:border-finanzas-DEFAULT"
            />
            <Slider
              defaultValue={[interestRate]}
              max={50}
              step={0.25}
              value={[interestRate]}
              onValueChange={handleInterestRateSliderChange}
              className="py-2 loan-calculator-slider"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Plazo (meses)
            </label>
            <span className="text-sm font-semibold text-finanzas-DEFAULT dark:text-finanzas-light">
              {loanTerm} {loanTerm === 1 ? "mes" : "meses"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Input
              id="loan-term"
              type="number"
              min="1"
              max="360"
              step="1"
              value={loanTerm}
              onChange={handleLoanTermChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-finanzas-DEFAULT focus:border-finanzas-DEFAULT"
            />
            <Slider
              defaultValue={[loanTerm]}
              max={120}
              step={1}
              value={[loanTerm]}
              onValueChange={handleLoanTermSliderChange}
              className="py-2 loan-calculator-slider"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-4">
        <button
          onClick={onSaveSimulation}
          disabled={disableSave}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors flex items-center gap-2 ${
            disableSave ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{
            backgroundColor: "#2e7d32", // Verde finanzas-DEFAULT
          }}
        >
          <Save size={16} />
          <span>Guardar Simulación</span>
        </button>

        <button
          onClick={onResetForm}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Restablecer</span>
        </button>
      </div>
    </div>
  )
}
