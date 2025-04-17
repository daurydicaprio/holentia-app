"use client"

import { useState } from "react"
import { useCompoundInterestCalculator } from "@/hooks/use-compound-interest-calculator"
import { CalculatorInputs } from "./calculator-inputs"
import { CalculatorSummary } from "./calculator-summary"
import { CalculatorCharts } from "./calculator-charts"
import { AmortizationTable } from "./amortization-table"
import { MobileTabsNavigation } from "./mobile-tabs-navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

export function CompoundInterestCalculator() {
  const {
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
    summary,
    annualSimData,
    monthlySimData,
    tableView,
    setTableView,
    lineChartData,
    pieChartData,
    formatCurrency,
  } = useCompoundInterestCalculator()

  const [activeTab, setActiveTab] = useState<string>("calculator")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Función para cambiar de pestaña
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Renderizado para móvil con pestañas
  if (isMobile) {
    return (
      <>
        {/* Título y descripción solo una vez */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#388e3c]">Calculadora interés compuesto</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Visualiza el crecimiento de ahorros.</p>
          <div className="w-16 h-1 bg-[#388e3c] mx-auto mt-3"></div>
        </div>

        {/* Pestañas móviles */}
        <MobileTabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Contenido según la pestaña activa */}
        <div className="p-4">
          {activeTab === "calculator" && (
            <>
              <CalculatorInputs
                initialDeposit={initialDeposit}
                setInitialDeposit={setInitialDeposit}
                contribution={contribution}
                setContribution={setContribution}
                contributionFrequency={contributionFrequency}
                setContributionFrequency={setContributionFrequency}
                years={years}
                setYears={setYears}
                interestRate={interestRate}
                setInterestRate={setInterestRate}
                inflation={inflation}
                setInflation={setInflation}
              />
              <div className="mt-6">
                <CalculatorSummary summary={summary} formatCurrency={formatCurrency} />
              </div>
            </>
          )}

          {activeTab === "charts" && (
            <CalculatorCharts
              lineChartData={lineChartData}
              pieChartData={pieChartData}
              formatCurrency={formatCurrency}
              showPieChart={false}
            />
          )}
        </div>

        {/* Espacio para evitar que el contenido quede debajo de la navegación */}
        <div className="h-16"></div>
      </>
    )
  }

  // Renderizado para escritorio (sin pestañas)
  return (
    <>
      {/* Título y descripción solo una vez */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#388e3c]">Calculadora interés compuesto</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Visualiza el crecimiento de ahorros.</p>
        <div className="w-16 h-1 bg-[#388e3c] mx-auto mt-3"></div>
      </div>

      <div className="pt-2">
        {/* Sección superior: Inputs y Resumen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <CalculatorInputs
              initialDeposit={initialDeposit}
              setInitialDeposit={setInitialDeposit}
              contribution={contribution}
              setContribution={setContribution}
              contributionFrequency={contributionFrequency}
              setContributionFrequency={setContributionFrequency}
              years={years}
              setYears={setYears}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              inflation={inflation}
              setInflation={setInflation}
            />
          </div>
          <div>
            <CalculatorSummary summary={summary} formatCurrency={formatCurrency} />
          </div>
        </div>

        {/* Sección inferior: Gráficos y Tabla */}
        <div className="mt-8">
          <CalculatorCharts
            lineChartData={lineChartData}
            pieChartData={pieChartData}
            formatCurrency={formatCurrency}
            showPieChart={true}
          />
        </div>

        <div className="mt-8">
          <AmortizationTable
            annualData={annualSimData}
            monthlyData={monthlySimData}
            tableView={tableView}
            setTableView={setTableView}
            formatCurrency={formatCurrency}
            inflation={inflation}
            contributionFrequency={contributionFrequency}
          />
        </div>
      </div>
    </>
  )
}
