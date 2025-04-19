"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw } from "lucide-react"

interface LoanCalculatorFormProps {
  onCalculate: (amount: number, rate: number, term: number) => void
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

  // Estados para los valores de edición
  const [loanAmountInput, setLoanAmountInput] = useState<string>(formatNumberWithCommas(loanAmount))
  const [interestRateInput, setInterestRateInput] = useState<string>(interestRate.toString())
  const [loanTermInput, setLoanTermInput] = useState<string>(loanTerm.toString())

  // Estados para controlar si el input está siendo editado
  const [isEditingLoanAmount, setIsEditingLoanAmount] = useState<boolean>(false)
  const [isEditingInterestRate, setIsEditingInterestRate] = useState<boolean>(false)
  const [isEditingLoanTerm, setIsEditingLoanTerm] = useState<boolean>(false)

  // Función para formatear números con comas y decimales
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Función para convertir un string formateado a número
  const parseFormattedNumber = (value: string): number => {
    // Eliminar comas y otros caracteres no numéricos excepto punto decimal
    const cleanedValue = value.replace(/[^\d.]/g, "")
    return Number.parseFloat(cleanedValue)
  }

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

  // Manejadores de eventos para los inputs
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

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setIsEditingInterestRate(true)
    setInterestRateInput(value)

    const parsedValue = Number.parseFloat(value)
    if (!isNaN(parsedValue)) {
      onCalculate(loanAmount, parsedValue, loanTerm)
    }
  }

  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setIsEditingLoanTerm(true)
    setLoanTermInput(value)

    const parsedValue = Number.parseInt(value)
    if (!isNaN(parsedValue)) {
      onCalculate(loanAmount, interestRate, parsedValue)
    }
  }

  // Manejadores de eventos para cuando los inputs pierden el foco
  const handleLoanAmountBlur = () => {
    setIsEditingLoanAmount(false)

    // Si el input está vacío o es 0, establecer un valor mínimo
    if (!loanAmountInput.trim() || parseFormattedNumber(loanAmountInput) <= 0) {
      const minValue = 1000
      setLoanAmountInput(formatNumberWithCommas(minValue))
      onCalculate(minValue, interestRate, loanTerm)
      return
    }

    // Convertir el valor formateado a número
    const parsedValue = parseFormattedNumber(loanAmountInput.replace(/,/g, ""))
    onCalculate(parsedValue, interestRate, loanTerm)
  }

  const handleInterestRateBlur = () => {
    setIsEditingInterestRate(false)

    // Si el input está vacío o es 0, establecer un valor mínimo
    if (!interestRateInput.trim() || Number.parseFloat(interestRateInput) <= 0) {
      const minValue = 0.1
      setInterestRateInput(minValue.toString())
      onCalculate(loanAmount, minValue, loanTerm)
      return
    }

    const parsedValue = Number.parseFloat(interestRateInput)
    onCalculate(loanAmount, parsedValue, loanTerm)
  }

  const handleLoanTermBlur = () => {
    setIsEditingLoanTerm(false)

    // Si el input está vacío o es 0, establecer un valor mínimo
    if (!loanTermInput.trim() || Number.parseInt(loanTermInput) <= 0) {
      const minValue = 1
      setLoanTermInput(minValue.toString())
      onCalculate(loanAmount, interestRate, minValue)
      return
    }

    const parsedValue = Number.parseInt(loanTermInput)
    onCalculate(loanAmount, interestRate, parsedValue)
  }

  // Manejadores para los sliders
  const handleLoanAmountSliderChange = (value: number[]) => {
    setIsEditingLoanAmount(false)
    const newAmount = value[0]
    setLoanAmountInput(formatNumberWithCommas(newAmount))
    onCalculate(newAmount, interestRate, loanTerm)
  }

  const handleInterestRateSliderChange = (value: number[]) => {
    setIsEditingInterestRate(false)
    const newRate = value[0]
    setInterestRateInput(newRate.toString())
    onCalculate(loanAmount, newRate, loanTerm)
  }

  const handleLoanTermSliderChange = (value: number[]) => {
    setIsEditingLoanTerm(false)
    const newTerm = value[0]
    setLoanTermInput(newTerm.toString())
    onCalculate(loanAmount, interestRate, newTerm)
  }

  return (
    <div className="loan-calculator-form" data-interactive="true">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Calculadora de Préstamos</h3>

      <div className="space-y-6">
        {/* Monto del préstamo */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="loan-amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto del préstamo
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">${loanAmountInput}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-full">
              <Slider
                defaultValue={[loanAmount]}
                min={1000}
                max={1000000}
                step={1000}
                onValueChange={handleLoanAmountSliderChange}
                value={[parseFormattedNumber(loanAmountInput.replace(/,/g, "")) || loanAmount]}
                data-interactive="true"
              />
            </div>
            <div className="w-24 flex-shrink-0">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="text"
                  id="loan-amount"
                  value={loanAmountInput}
                  onChange={handleLoanAmountChange}
                  onBlur={handleLoanAmountBlur}
                  onFocus={() => setIsEditingLoanAmount(true)}
                  className="w-full pl-6 pr-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-right text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                  data-interactive="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tasa de interés */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="interest-rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tasa de interés anual
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{interestRateInput}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-full">
              <Slider
                defaultValue={[interestRate]}
                min={0.1}
                max={50}
                step={0.1}
                onValueChange={handleInterestRateSliderChange}
                value={[Number.parseFloat(interestRateInput) || interestRate]}
                data-interactive="true"
              />
            </div>
            <div className="w-24 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  id="interest-rate"
                  value={interestRateInput}
                  onChange={handleInterestRateChange}
                  onBlur={handleInterestRateBlur}
                  onFocus={() => setIsEditingInterestRate(true)}
                  className="w-full pr-6 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-right text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                  data-interactive="true"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Plazo del préstamo */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="loan-term" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plazo (meses)
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{loanTermInput} meses</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-full">
              <Slider
                defaultValue={[loanTerm]}
                min={1}
                max={360}
                step={1}
                onValueChange={handleLoanTermSliderChange}
                value={[Number.parseInt(loanTermInput) || loanTerm]}
                data-interactive="true"
              />
            </div>
            <div className="w-24 flex-shrink-0">
              <input
                type="text"
                id="loan-term"
                value={loanTermInput}
                onChange={handleLoanTermChange}
                onBlur={handleLoanTermBlur}
                onFocus={() => setIsEditingLoanTerm(true)}
                className="w-full py-1 border border-gray-300 dark:border-gray-600 rounded-md text-center text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                data-interactive="true"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={onSaveSimulation}
            disabled={disableSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            data-interactive="true"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar simulación
          </Button>
          <Button
            onClick={onResetForm}
            variant="outline"
            className="flex-1 border-gray-300 dark:border-gray-600"
            data-interactive="true"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>
      </div>
    </div>
  )
}
