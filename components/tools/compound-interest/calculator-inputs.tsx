"use client"

import type React from "react"

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

  // Manejadores de cambio que permiten valores vacíos
  const handleInitialDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInitialDeposit(value === "" ? 0 : Number(value))
  }

  const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContribution(value === "" ? 0 : Number(value))
  }

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setYears(value === "" ? 0 : Number(value))
  }

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInterestRate(value === "" ? 0 : Number(value))
  }

  const handleInflationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInflation(value === "" ? 0 : Number(value))
  }

  // Asegurar que los bordes del componente de inputs sean visibles
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold text-[#388e3c] mb-4">Datos de la inversión</h3>

      <div className="space-y-5">
        {/* Depósito inicial */}
        <div className="input-field">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Depósito inicial</label>
          <div className="flex rounded-md overflow-hidden shadow-sm">
            <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium border border-[#388e3c]">
              $
            </span>
            <input
              type="number"
              value={initialDeposit || ""}
              onChange={handleInitialDepositChange}
              min="0"
              className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
              placeholder="Ingresa tu depósito inicial"
            />
          </div>
        </div>

        {/* Fila horizontal para Aporte y Frecuencia - Siempre en horizontal incluso en móvil */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aporte</label>
            <div className="flex rounded-md overflow-hidden shadow-sm">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium border border-[#388e3c]">
                $
              </span>
              <input
                type="number"
                value={contribution || ""}
                onChange={handleContributionChange}
                min="0"
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
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c] shadow-sm"
            >
              <option value={1}>Anual</option>
              <option value={12}>Mensual</option>
            </select>
          </div>
        </div>

        {/* Parte inferior del recuadro: Años, Tasa de interés e Inflación - Siempre en horizontal incluso en móvil */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Años</label>
            <div className="flex rounded-md overflow-hidden shadow-sm">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium border border-[#388e3c]">
                <span className="text-lg">⏳</span>
              </span>
              <input
                type="number"
                value={years || ""}
                onChange={handleYearsChange}
                className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
                placeholder="Años"
                max={99}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasa de interés</label>
            <div className="flex rounded-md overflow-hidden shadow-sm">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium border border-[#388e3c]">
                %
              </span>
              <input
                type="number"
                value={interestRate || ""}
                onChange={handleInterestRateChange}
                className="flex-1 block w-full min-w-0 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#388e3c] focus:border-[#388e3c]"
                placeholder="Tasa de interés"
                max={99}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inflación</label>
            <div className="flex rounded-md overflow-hidden shadow-sm">
              <span className="inline-flex items-center px-3 bg-[#388e3c] text-white font-medium border border-[#388e3c]">
                %
              </span>
              <input
                type="number"
                value={inflation || ""}
                onChange={handleInflationChange}
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
