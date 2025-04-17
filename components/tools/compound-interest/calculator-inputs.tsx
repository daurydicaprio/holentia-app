"use client"

import { useMediaQuery } from "@/hooks/use-media-query"

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
}: CalculatorInputsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-finanzas-dark dark:text-finanzas-DEFAULT mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        Datos de la inversión
      </h3>

      <div className="space-y-5">
        {/* Depósito inicial */}
        <div className="input-field">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Depósito inicial</label>
          <div className="flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-finanzas-DEFAULT focus-within:border-finanzas-DEFAULT transition-all">
            <span className="inline-flex items-center px-3 bg-finanzas-DEFAULT text-white font-medium">$</span>
            <input
              type="number"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(Number(e.target.value))}
              className="flex-1 block w-full min-w-0 p-2.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
              placeholder="Ingresa tu depósito inicial"
            />
          </div>
        </div>

        {/* Fila horizontal para Aporte y Frecuencia */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aporte</label>
            <div className="flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-finanzas-DEFAULT focus-within:border-finanzas-DEFAULT transition-all">
              <span className="inline-flex items-center px-3 bg-finanzas-DEFAULT text-white font-medium">$</span>
              <input
                type="number"
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                placeholder="Aporte periódico"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frecuencia</label>
            <div className="flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-finanzas-DEFAULT focus-within:border-finanzas-DEFAULT transition-all">
              <select
                value={contributionFrequency}
                onChange={(e) => setContributionFrequency(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
              >
                <option value={1}>Anual</option>
                <option value={12}>Mensual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Parte inferior del recuadro: Años, Tasa de interés e Inflación */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              Años
              <span
                className="ml-1.5 w-4 h-4 rounded-full bg-finanzas-DEFAULT text-white text-xs flex items-center justify-center cursor-help"
                title="El interés siempre se calculará al año."
              >
                i
              </span>
            </label>
            <div className="flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-finanzas-DEFAULT focus-within:border-finanzas-DEFAULT transition-all">
              <span className="inline-flex items-center px-3 bg-finanzas-DEFAULT text-white font-medium">⏳</span>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                placeholder="Años"
                max={99}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              Tasa de interés
              <span
                className="ml-1.5 w-4 h-4 rounded-full bg-finanzas-DEFAULT text-white text-xs flex items-center justify-center cursor-help"
                title="La tasa de interés que esperas tener"
              >
                i
              </span>
            </label>
            <div className="flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-finanzas-DEFAULT focus-within:border-finanzas-DEFAULT transition-all">
              <span className="inline-flex items-center px-3 bg-finanzas-DEFAULT text-white font-medium">%</span>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                placeholder="Tasa de interés"
                max={99}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              Inflación
              <span
                className="ml-1.5 w-4 h-4 rounded-full bg-finanzas-DEFAULT text-white text-xs flex items-center justify-center cursor-help"
                title="La pérdida de poder adquisitivo cada año"
              >
                i
              </span>
            </label>
            <div className="flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-finanzas-DEFAULT focus-within:border-finanzas-DEFAULT transition-all">
              <span className="inline-flex items-center px-3 bg-finanzas-DEFAULT text-white font-medium">%</span>
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                placeholder="Inflación"
                max={99}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
