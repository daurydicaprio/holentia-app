"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, Percent, Calendar, HelpCircle, Save } from "lucide-react"

interface CalculatorInputsProps {
  initialDeposit: number
  setInitialDeposit: (value: number) => void
  contribution: number
  setContribution: (value: number) => void
  contributionFrequency: number
  setContributionFrequency: (value: number) => void
  years: number
  setYears: (value: number) => void
  interestRate: number
  setInterestRate: (value: number) => void
  inflation: number
  setInflation: (value: number) => void
  onSaveSimulation?: () => void
  disableSave?: boolean
  onClearData?: () => void
}

export function CalculatorInputs({
  initialDeposit,
  setInitialDeposit,
  contribution,
  setContribution,
  contributionFrequency,
  setContributionFrequency,
  years,
  setYears,
  interestRate,
  setInterestRate,
  inflation,
  setInflation,
  onSaveSimulation,
  disableSave = false,
  onClearData,
}: CalculatorInputsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  // Estados para los valores formateados
  const [formattedInitialDeposit, setFormattedInitialDeposit] = useState<string>("")
  const [formattedContribution, setFormattedContribution] = useState<string>("")

  // Función para formatear números con comas y puntos
  const formatNumberWithCommas = (value: number): string => {
    if (isNaN(value)) return ""

    // Formatear el número con comas y dos decimales
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Función para quitar el formato y convertir a número
  const parseFormattedNumber = (formattedValue: string): number => {
    // Eliminar todas las comas y convertir a número
    const numericValue = Number.parseFloat(formattedValue.replace(/,/g, ""))
    return isNaN(numericValue) ? 0 : numericValue
  }

  // Actualizar los valores formateados cuando cambian los valores numéricos
  useEffect(() => {
    setFormattedInitialDeposit(formatNumberWithCommas(initialDeposit))
  }, [initialDeposit])

  useEffect(() => {
    setFormattedContribution(formatNumberWithCommas(contribution))
  }, [contribution])

  // Manejar cambios en el depósito inicial formateado
  const handleInitialDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Permitir campo vacío
    if (!inputValue) {
      setFormattedInitialDeposit("")
      setInitialDeposit(0)
      return
    }

    // Eliminar caracteres no numéricos excepto comas y puntos
    const cleanedValue = inputValue.replace(/[^\d.,]/g, "")

    // Convertir a número y actualizar el estado numérico
    const numericValue = parseFormattedNumber(cleanedValue)
    setInitialDeposit(numericValue)

    // Actualizar el valor formateado en el input
    setFormattedInitialDeposit(cleanedValue)
  }

  // Manejar cambios en la aportación periódica formateada
  const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Permitir campo vacío
    if (!inputValue) {
      setFormattedContribution("")
      setContribution(0)
      return
    }

    // Eliminar caracteres no numéricos excepto comas y puntos
    const cleanedValue = inputValue.replace(/[^\d.,]/g, "")

    // Convertir a número y actualizar el estado numérico
    const numericValue = parseFormattedNumber(cleanedValue)
    setContribution(numericValue)

    // Actualizar el valor formateado en el input
    setFormattedContribution(cleanedValue)
  }

  // Manejar el evento de pérdida de foco para formatear correctamente
  const handleBlur = (setter: (value: string) => void, value: number) => {
    setter(formatNumberWithCommas(value))
  }

  // Función para manejar cambios en inputs numéricos (para años, tasa de interés e inflación)
  const handleNumberChange = (setter: (value: number) => void, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setter(numValue)
    } else {
      setter(0)
    }
  }

  // Tooltips informativos
  const tooltips = {
    initialDeposit: "Cantidad inicial que invertirás al comenzar.",
    contribution: "Cantidad que aportarás regularmente a tu inversión.",
    contributionFrequency: "Frecuencia con la que realizarás tus aportaciones.",
    years: "Duración total de tu inversión en años.",
    interestRate: "Tasa de interés anual esperada para tu inversión.",
    inflation: "Tasa de inflación anual estimada. Afecta al poder adquisitivo de tu dinero con el tiempo.",
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-interactive="true"
    >
      <h2 className="text-xl font-bold text-[#388e3c] mb-6 text-center">
        Parámetros de la inversión
        <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
      </h2>

      <div className="space-y-6">
        {/* Depósito inicial */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Depósito inicial
            </label>
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onMouseEnter={() => setActiveTooltip("initialDeposit")}
                onMouseLeave={() => setActiveTooltip(null)}
                aria-label="Información sobre depósito inicial"
              >
                <HelpCircle size={16} />
              </button>
              {activeTooltip === "initialDeposit" && (
                <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                  {tooltips.initialDeposit}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="initialDeposit"
              value={formattedInitialDeposit}
              onChange={handleInitialDepositChange}
              onBlur={() => handleBlur(setFormattedInitialDeposit, initialDeposit)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="0"
              data-interactive="true"
            />
          </div>
        </div>

        {/* Aportación periódica */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="contribution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Aportación periódica
            </label>
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onMouseEnter={() => setActiveTooltip("contribution")}
                onMouseLeave={() => setActiveTooltip(null)}
                aria-label="Información sobre aportación periódica"
              >
                <HelpCircle size={16} />
              </button>
              {activeTooltip === "contribution" && (
                <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                  {tooltips.contribution}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="contribution"
              value={formattedContribution}
              onChange={handleContributionChange}
              onBlur={() => handleBlur(setFormattedContribution, contribution)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="0"
              data-interactive="true"
            />
          </div>
        </div>

        {/* Frecuencia de aportación */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="contributionFrequency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Frecuencia de aportación
            </label>
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onMouseEnter={() => setActiveTooltip("contributionFrequency")}
                onMouseLeave={() => setActiveTooltip(null)}
                aria-label="Información sobre frecuencia de aportación"
              >
                <HelpCircle size={16} />
              </button>
              {activeTooltip === "contributionFrequency" && (
                <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                  {tooltips.contributionFrequency}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setContributionFrequency(12)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                contributionFrequency === 12
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              data-interactive="true"
            >
              Mensual
            </button>
            <button
              onClick={() => setContributionFrequency(1)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                contributionFrequency === 1
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              data-interactive="true"
            >
              Anual
            </button>
          </div>
        </div>

        {/* Años, Tasa de interés e Inflación en la misma línea */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="years" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Años
              </label>
              <div className="relative">
                <button
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  onMouseEnter={() => setActiveTooltip("years")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label="Información sobre años"
                >
                  <HelpCircle size={16} />
                </button>
                {activeTooltip === "years" && (
                  <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                    {tooltips.years}
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="years"
                value={years || ""}
                onChange={(e) => handleNumberChange(setYears, e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="5"
                min="1"
                max="100"
                step="1"
                data-interactive="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tasa de interés
              </label>
              <div className="relative">
                <button
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  onMouseEnter={() => setActiveTooltip("interestRate")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label="Información sobre tasa de interés"
                >
                  <HelpCircle size={16} />
                </button>
                {activeTooltip === "interestRate" && (
                  <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                    {tooltips.interestRate}
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Percent size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="interestRate"
                value={interestRate || ""}
                onChange={(e) => handleNumberChange(setInterestRate, e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                data-interactive="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="inflation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Inflación
              </label>
              <div className="relative">
                <button
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  onMouseEnter={() => setActiveTooltip("inflation")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label="Información sobre inflación"
                >
                  <HelpCircle size={16} />
                </button>
                {activeTooltip === "inflation" && (
                  <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                    {tooltips.inflation}
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Percent size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="inflation"
                value={inflation || ""}
                onChange={(e) => handleNumberChange(setInflation, e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                data-interactive="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botón para guardar simulación */}
      {onSaveSimulation && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={onSaveSimulation}
            disabled={disableSave}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors flex items-center gap-2 ${
              disableSave ? "opacity-50 cursor-not-allowed bg-gray-400" : "bg-[#388e3c] hover:bg-[#1b5e20]"
            }`}
            data-interactive="true"
          >
            <Save size={16} />
            <span>Guardar Simulación</span>
          </button>
          {onClearData && (
            <button
              onClick={onClearData}
              className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
              data-interactive="true"
            >
              Borrar mis datos
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
