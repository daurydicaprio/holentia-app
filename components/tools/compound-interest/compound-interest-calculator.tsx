"use client"

import { useState } from "react"
import { useCompoundInterestCalculator } from "@/hooks/use-compound-interest-calculator"
import { CalculatorInputs } from "./calculator-inputs"
import { CalculatorCharts } from "./calculator-charts"
import { AmortizationTable } from "./amortization-table"
import { MobileTabsNavigation } from "./mobile-tabs-navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { CompoundInterestResult } from "./compound-interest-result"

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
      <div className="bg-white dark:bg-gray-900 rounded-lg">
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
                <CompoundInterestResult summary={summary} formatCurrency={formatCurrency} inflation={inflation} />
              </div>

              {/* Pestañas móviles dentro del recuadro */}
              <MobileTabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            </>
          )}

          {activeTab === "charts" && (
            <>
              <CalculatorCharts
                lineChartData={lineChartData}
                pieChartData={pieChartData}
                formatCurrency={formatCurrency}
                showPieChart={false}
              />

              {/* Pestañas móviles dentro del recuadro */}
              <MobileTabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            </>
          )}
        </div>
      </div>
    )
  }

  // Renderizado para escritorio (sin pestañas)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="p-6">
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
            <CompoundInterestResult summary={summary} formatCurrency={formatCurrency} inflation={inflation} />
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
    </div>
  )
}
