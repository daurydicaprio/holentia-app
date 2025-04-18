"use client"

import { useState, useEffect } from "react"
import { useCompoundInterestCalculator } from "@/hooks/use-compound-interest-calculator"
import { CalculatorForm } from "./calculator-form"
import { CalculatorResults } from "./calculator-results"
import { CalculatorCharts } from "./calculator-charts"
import { CalculatorImpact } from "./calculator-impact"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"

export function CompoundInterestCalculator() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showPieChart, setShowPieChart] = useState(true)
  const {
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
    finalAmount,
    totalContributions,
    totalInterest,
    inflationAdjustedAmount,
    formatCurrency,
    chartData,
    pieChartData,
  } = useCompoundInterestCalculator()

  // Efecto para controlar la visualización del gráfico de pastel en dispositivos móviles
  useEffect(() => {
    setShowPieChart(!isMobile)
  }, [isMobile])

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-center text-[#388e3c] mb-2">Calculadora de Interés Compuesto</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Calcula el crecimiento de tus inversiones a lo largo del tiempo
        </p>
      </motion.div>

      <CalculatorForm
        initialInvestment={initialInvestment}
        setInitialInvestment={setInitialInvestment}
        monthlyContribution={monthlyContribution}
        setMonthlyContribution={setMonthlyContribution}
        interestRate={interestRate}
        setInterestRate={setInterestRate}
        years={years}
        setYears={setYears}
        inflationRate={inflationRate}
        setInflationRate={setInflationRate}
        reinvestDividends={reinvestDividends}
        setReinvestDividends={setReinvestDividends}
      />

      <CalculatorResults
        finalAmount={finalAmount}
        totalContributions={totalContributions}
        totalInterest={totalInterest}
        inflationAdjustedAmount={inflationAdjustedAmount}
        formatCurrency={formatCurrency}
      />

      <CalculatorCharts
        lineChartData={chartData}
        pieChartData={pieChartData}
        formatCurrency={formatCurrency}
        showPieChart={showPieChart}
      />

      <CalculatorImpact
        finalAmount={finalAmount}
        totalContributions={totalContributions}
        totalInterest={totalInterest}
        inflationAdjustedAmount={inflationAdjustedAmount}
        formatCurrency={formatCurrency}
        years={years}
        initialInvestment={initialInvestment}
        monthlyContribution={monthlyContribution}
        interestRate={interestRate}
        inflationRate={inflationRate}
      />
    </div>
  )
}
