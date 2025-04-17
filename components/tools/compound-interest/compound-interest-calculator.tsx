"use client"

import { useState } from "react"
import { useCompoundInterestCalculator } from "@/hooks/use-compound-interest-calculator"
import { CalculatorInputs } from "./calculator-inputs"
import { CalculatorSummary } from "./calculator-summary"
import { CalculatorCharts } from "./calculator-charts"
import { AmortizationTable } from "./amortization-table"
import { CalculatorTabs } from "./calculator-tabs"
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

  const [activeTab, setActiveTab] = useState<string>("chart")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Función para cambiar de pestaña
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Renderizado condicional basado en el tamaño de pantalla
  if (isMobile) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 shadow-sm">
        {/* Sección de inputs */}
        <div className="mb-6">
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

        {/* Sección de resumen */}
        <div className="mb-6">
          <CalculatorSummary summary={summary} formatCurrency={formatCurrency} />
        </div>

        {/* Pestañas y contenido */}
        <div className="mb-6">
          <CalculatorTabs activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="mt-4">
            {activeTab === "chart" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <CalculatorCharts
                  lineChartData={lineChartData}
                  pieChartData={pieChartData}
                  formatCurrency={formatCurrency}
                  showPieChart={false}
                />
              </div>
            )}

            {activeTab === "summary" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                  <div className="p-3 bg-finanzas-DEFAULT/10 dark:bg-finanzas-DEFAULT/20 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-DEFAULT dark:text-finanzas-DEFAULT">Inversión inicial:</span>{" "}
                      {formatCurrency(initialDeposit)}
                    </p>
                  </div>

                  <div className="p-3 bg-finanzas-DEFAULT/10 dark:bg-finanzas-DEFAULT/20 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-DEFAULT dark:text-finanzas-DEFAULT">
                        Aporte {contributionFrequency === 12 ? "mensual" : "anual"}:
                      </span>{" "}
                      {formatCurrency(contribution)}
                    </p>
                  </div>

                  <div className="p-3 bg-finanzas-DEFAULT/10 dark:bg-finanzas-DEFAULT/20 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-DEFAULT dark:text-finanzas-DEFAULT">Tasa de interés:</span>{" "}
                      {interestRate}%
                    </p>
                  </div>

                  <div className="p-3 bg-finanzas-DEFAULT/10 dark:bg-finanzas-DEFAULT/20 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-DEFAULT dark:text-finanzas-DEFAULT">Inflación:</span> {inflation}%
                    </p>
                  </div>

                  <div className="p-3 bg-finanzas-DEFAULT/10 dark:bg-finanzas-DEFAULT/20 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-DEFAULT dark:text-finanzas-DEFAULT">Plazo:</span> {years} años
                    </p>
                  </div>

                  <hr className="my-4 border-gray-200 dark:border-gray-700" />

                  <div className="p-3 bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-dark dark:text-finanzas-DEFAULT">Balance final:</span>{" "}
                      {formatCurrency(summary.balanceNet)}
                    </p>
                  </div>

                  <div className="p-3 bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-dark dark:text-finanzas-DEFAULT">Ganancia neta:</span>{" "}
                      {formatCurrency(summary.netGain)}
                    </p>
                  </div>

                  <div className="p-3 bg-finanzas-DEFAULT/20 dark:bg-finanzas-DEFAULT/30 rounded-md">
                    <p className="font-medium">
                      <span className="text-finanzas-dark dark:text-finanzas-DEFAULT">Rendimiento total:</span>{" "}
                      {summary.totalReturn}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Versión de escritorio (sin pestañas móviles)
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-6 shadow-sm">
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

      <div className="mb-8">
        <CalculatorCharts
          lineChartData={lineChartData}
          pieChartData={pieChartData}
          formatCurrency={formatCurrency}
          showPieChart={true}
        />
      </div>

      <div className="mb-6">
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
  )
}
