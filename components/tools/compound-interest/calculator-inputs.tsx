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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-finanzas-DEFAULT mb-4">Datos de la inversión</h3>

      <div className="space-y-5">
        {/* Depósito inicial */}
        <div className="input-field">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Depósito inicial</label>
          <div className="flex rounded-md overflow-hidden">
            <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium">$</span>
            <input
              type="number"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(Number(e.target.value))}
              className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
              placeholder="Ingresa tu depósito inicial"
            />
          </div>
        </div>

        {/* Fila horizontal para Aporte y Frecuencia */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aporte</label>
            <div className="flex rounded-md overflow-hidden">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium">$</span>
              <input
                type="number"
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
                placeholder="Aporte periódico"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frecuencia</label>
            <select
              value={contributionFrequency}
              onChange={(e) => setContributionFrequency(Number(e.target.value))}
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
            >
              <option value={1}>Anual</option>
              <option value={12}>Mensual</option>
            </select>
          </div>
        </div>

        {/* Parte inferior del recuadro: Años, Tasa de interés e Inflación */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Años</label>
            <div className="flex rounded-md overflow-hidden">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium">
                <span className="text-lg">⏳</span>
              </span>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
                placeholder="Años"
                max={99}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasa de interés</label>
            <div className="flex rounded-md overflow-hidden">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium">%</span>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
                placeholder="Tasa de interés"
                max={99}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inflación</label>
            <div className="flex rounded-md overflow-hidden">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium">%</span>
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
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
