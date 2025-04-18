"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Info } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CalculatorFormProps {
  initialInvestment: number
  setInitialInvestment: (value: number) => void
  monthlyContribution: number
  setMonthlyContribution: (value: number) => void
  interestRate: number
  setInterestRate: (value: number) => void
  years: number
  setYears: (value: number) => void
  inflationRate: number
  setInflationRate: (value: number) => void
  reinvestDividends: boolean
  setReinvestDividends: (value: boolean) => void
}

export function CalculatorForm({
  initialInvestment,
  setInitialInvestment,
  monthlyContribution,
  setMonthlyContribution,
  interestRate,
  setInterestRate,
  years,
  setYears,
  inflationRate,
  setInflationRate,
  reinvestDividends,
  setReinvestDividends,
}: CalculatorFormProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  // Función para manejar cambios en los inputs numéricos
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void,
    min = 0,
    max = Number.POSITIVE_INFINITY,
  ) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setter(Math.min(Math.max(value, min), max))
    }
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#388e3c] w-full text-center">
          Parámetros de la inversión
          <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
        </h2>

        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            onMouseEnter={() => setActiveTooltip("parameters")}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label="Información sobre los parámetros"
          >
            <Info size={18} />
          </button>

          {activeTooltip === "parameters" && (
            <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
              Ajusta estos parámetros para calcular el crecimiento de tu inversión. La inversión inicial es el monto con
              el que comienzas, mientras que la contribución mensual es lo que agregas cada mes. La tasa de interés
              anual es el rendimiento esperado de tu inversión.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inversión inicial */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="initialInvestment" className="text-sm font-medium">
              Inversión inicial
            </Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">$ {initialInvestment.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id="initialInvestment"
              value={initialInvestment}
              onChange={(e) => handleInputChange(e, setInitialInvestment)}
              className="w-full"
              min={0}
            />
          </div>
          <Slider
            value={[initialInvestment]}
            min={0}
            max={1000000}
            step={1000}
            onValueChange={(value) => setInitialInvestment(value[0])}
            className="py-2"
          />
        </div>

        {/* Contribución mensual */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="monthlyContribution" className="text-sm font-medium">
              Contribución mensual
            </Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">$ {monthlyContribution.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id="monthlyContribution"
              value={monthlyContribution}
              onChange={(e) => handleInputChange(e, setMonthlyContribution)}
              className="w-full"
              min={0}
            />
          </div>
          <Slider
            value={[monthlyContribution]}
            min={0}
            max={100000}
            step={100}
            onValueChange={(value) => setMonthlyContribution(value[0])}
            className="py-2"
          />
        </div>

        {/* Tasa de interés anual */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interestRate" className="text-sm font-medium">
              Tasa de interés anual
            </Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{interestRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => handleInputChange(e, setInterestRate, 0, 100)}
              className="w-full"
              min={0}
              max={100}
              step={0.1}
            />
          </div>
          <Slider
            value={[interestRate]}
            min={0}
            max={20}
            step={0.1}
            onValueChange={(value) => setInterestRate(value[0])}
            className="py-2"
          />
        </div>

        {/* Años */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="years" className="text-sm font-medium">
              Años
            </Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{years} años</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id="years"
              value={years}
              onChange={(e) => handleInputChange(e, setYears, 1, 50)}
              className="w-full"
              min={1}
              max={50}
            />
          </div>
          <Slider
            value={[years]}
            min={1}
            max={50}
            step={1}
            onValueChange={(value) => setYears(value[0])}
            className="py-2"
          />
        </div>

        {/* Tasa de inflación anual */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="inflationRate" className="text-sm font-medium">
              Tasa de inflación anual
            </Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{inflationRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id="inflationRate"
              value={inflationRate}
              onChange={(e) => handleInputChange(e, setInflationRate, 0, 100)}
              className="w-full"
              min={0}
              max={100}
              step={0.1}
            />
          </div>
          <Slider
            value={[inflationRate]}
            min={0}
            max={20}
            step={0.1}
            onValueChange={(value) => setInflationRate(value[0])}
            className="py-2"
          />
        </div>

        {/* Reinvertir dividendos */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="reinvestDividends" className="text-sm font-medium cursor-pointer">
            Reinvertir dividendos
          </Label>
          <Switch
            id="reinvestDividends"
            checked={reinvestDividends}
            onCheckedChange={setReinvestDividends}
            aria-label="Reinvertir dividendos"
          />
        </div>
      </div>
    </motion.div>
  )
}
