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
  onClearData?: () => void
  disableSave: boolean
  loanAmount: number
  interestRate: number
  loanTerm: number
}

// Función para formatear números con comas (sin decimales para la entrada)
const formatNumberWithCommas = (value: number | string): string => {
  // Si es string, convertir a número primero
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  // Si no es un número válido, devolver string vacío
  if (isNaN(numValue)) return ""

  // Formatear con comas pero sin decimales para mejor experiencia de edición
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(numValue)
}

// Función para formatear números con comas y decimales (para mostrar)
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
  onClearData,
  disableSave,
  loanAmount,
  interestRate,
  loanTerm,
}: LoanCalculatorFormProps) {
  // Estados para los valores de edición
  const [loanAmountInput, setLoanAmountInput] = useState<string>(formatNumberWithCommas(loanAmount))
  const [interestRateInput, setInterestRateInput] = useState<string>(interestRate.toString())
  const [loanTermInput, setLoanTermInput] = useState<string>(loanTerm.toString())

  // Estados para controlar si el input está siendo editado
  const [isEditingLoanAmount, setIsEditingLoanAmount] = useState<boolean>(false)
  const [isEditingInterestRate, setIsEditingInterestRate] = useState<boolean>(false)
  const [isEditingLoanTerm, setIsEditingLoanTerm] = useState<boolean>(false)

  // Actualizar los valores de input cuando cambian los props
  useEffect(() => {
    if (!isEditingLoanAmount) {
      setLoanAmountInput(formatNumberWithCommas(loanAmount))
    }
  }, [loanAmount, isEditingLoanAmount])

  useEffect(() => {
    if (!isEditingInterestRate) {
      setInterestRateInput(interestRate.toString())
    }
  }, [interestRate, isEditingInterestRate])

  useEffect(() => {
    if (!isEditingLoanTerm) {
      setLoanTermInput(loanTerm.toString())
    }
  }, [loanTerm, isEditingLoanTerm])

  // Manejar cambios en el input de monto del préstamo
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setIsEditingLoanAmount(true)

    // Si el input está vacío, establecer string vacío
    if (!inputValue.trim()) {
      setLoanAmountInput("")
      return
    }

    // Eliminar caracteres no numéricos excepto comas
    const cleanedValue = inputValue.replace(/[^\d,]/g, "")

    // Eliminar comas para obtener el valor numérico
    const numericValue = cleanedValue.replace(/,/g, "")

    if (numericValue) {
      const parsedValue = Number.parseInt(numericValue, 10)

      if (!isNaN(parsedValue)) {
        // Formatear con comas para mostrar en el input
        setLoanAmountInput(formatNumberWithCommas(parsedValue))

        // Actualizar el valor del préstamo
        onCalculate(parsedValue, interestRate, loanTerm)
      }
    } else {
      setLoanAmountInput("")
    }
  }

  // Manejar cuando el input de monto pierde el foco
  const handleLoanAmountBlur = () => {
    setIsEditingLoanAmount(false)

    // Si el input está vacío o es 0, establecer un valor mínimo
    if (!loanAmountInput.trim() || parseFormattedNumber(loanAmountInput) <= 0) {
      const minValue = 1000
      setLoanAmountInput(formatNumberWithCommas(minValue))
      onCalculate(minValue, interestRate, loanTerm)
      return
    }

    // Formatear el valor y actualizar
    const numericValue = parseFormattedNumber(loanAmountInput)
    setLoanAmountInput(formatNumberWithCommas(numericValue))
    onCalculate(numericValue, interestRate, loanTerm)
  }

  // Manejar cambios en el input de tasa de interés
  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setIsEditingInterestRate(true)
    setInterestRateInput(inputValue)

    // Si el input está vacío, no actualizar el valor todavía
    if (!inputValue.trim()) {
      return
    }

    const numericValue = Number.parseFloat(inputValue)
    if (!isNaN(numericValue)) {
      onCalculate(loanAmount, numericValue, loanTerm)
    }
  }

  // Manejar cuando el input de tasa de interés pierde el foco
  const handleInterestRateBlur = () => {
    setIsEditingInterestRate(false)

    // Si el input está vacío o es 0, establecer un valor mínimo
    if (!interestRateInput.trim() || Number.parseFloat(interestRateInput) <= 0) {
      const minValue = 0.01
      setInterestRateInput(minValue.toString())
      onCalculate(loanAmount, minValue, loanTerm)
      return
    }

    const numericValue = Number.parseFloat(interestRateInput)
    onCalculate(loanAmount, numericValue, loanTerm)
  }

  // Manejar cambios en el input de plazo
  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setIsEditingLoanTerm(true)
    setLoanTermInput(inputValue)

    // Si el input está vacío, no actualizar el valor todavía
    if (!inputValue.trim()) {
      return
    }

    const numericValue = Number.parseInt(inputValue)
    if (!isNaN(numericValue)) {
      onCalculate(loanAmount, interestRate, numericValue)
    }
  }

  // Manejar cuando el input de plazo pierde el foco
  const handleLoanTermBlur = () => {
    setIsEditingLoanTerm(false)

    // Si el input está vacío o es 0, establecer un valor mínimo
    if (!loanTermInput.trim() || Number.parseInt(loanTermInput) <= 0) {
      const minValue = 1
      setLoanTermInput(minValue.toString())
      onCalculate(loanAmount, interestRate, minValue)
      return
    }

    const numericValue = Number.parseInt(loanTermInput)
    onCalculate(loanAmount, interestRate, numericValue)
  }

  // Manejar cambios en los sliders
  const handleLoanAmountSliderChange = (value: number[]) => {
    setIsEditingLoanAmount(false)
    onCalculate(value[0], interestRate, loanTerm)
  }

  const handleInterestRateSliderChange = (value: number[]) => {
    setIsEditingInterestRate(false)
    onCalculate(loanAmount, value[0], loanTerm)
  }

  const handleLoanTermSliderChange = (value: number[]) => {
    setIsEditingLoanTerm(false)
    onCalculate(loanAmount, interestRate, value[0])
  }

  return (
    <div
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      data-interactive="true"
    >
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
              value={loanAmountInput}
              onChange={handleLoanAmountChange}
              onBlur={handleLoanAmountBlur}
              onFocus={() => setIsEditingLoanAmount(true)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-finanzas-DEFAULT focus:border-finanzas-DEFAULT"
              data-interactive="true"
            />
            <Slider
              defaultValue={[loanAmount]}
              max={1000000}
              step={1000}
              value={[loanAmount]}
              onValueChange={handleLoanAmountSliderChange}
              className="py-2 loan-calculator-slider"
              data-interactive="true"
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
              type="text"
              value={interestRateInput}
              onChange={handleInterestRateChange}
              onBlur={handleInterestRateBlur}
              onFocus={() => setIsEditingInterestRate(true)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-finanzas-DEFAULT focus:border-finanzas-DEFAULT"
              data-interactive="true"
            />
            <Slider
              defaultValue={[interestRate]}
              max={50}
              step={0.25}
              value={[interestRate]}
              onValueChange={handleInterestRateSliderChange}
              className="py-2 loan-calculator-slider"
              data-interactive="true"
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
              type="text"
              value={loanTermInput}
              onChange={handleLoanTermChange}
              onBlur={handleLoanTermBlur}
              onFocus={() => setIsEditingLoanTerm(true)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-finanzas-DEFAULT focus:border-finanzas-DEFAULT"
              data-interactive="true"
            />
            <Slider
              defaultValue={[loanTerm]}
              max={120}
              step={1}
              value={[loanTerm]}
              onValueChange={handleLoanTermSliderChange}
              className="py-2 loan-calculator-slider"
              data-interactive="true"
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
          data-interactive="true"
        >
          <Save size={16} />
          <span>Guardar Simulación</span>
        </button>

        <button
          onClick={onResetForm}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition-colors flex items-center gap-2"
          data-interactive="true"
        >
          <RefreshCw size={16} />
          <span>Restablecer</span>
        </button>
      </div>
      {onClearData && (
        <div className="flex justify-center">
          <button
            onClick={onClearData}
            className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
            data-interactive="true"
          >
            Borrar mis datos
          </button>
        </div>
      )}
    </div>
  )
}
