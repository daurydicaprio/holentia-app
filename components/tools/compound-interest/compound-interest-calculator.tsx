"use client"

import { useState } from "react"
import { useCompoundInterestCalculator } from "@/hooks/use-compound-interest-calculator"
import { CalculatorInputs } from "./calculator-inputs"
import { CalculatorCharts } from "./calculator-charts"
import { AmortizationTable } from "./amortization-table"
import { MobileTabsNavigation } from "./mobile-tabs-navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { CompoundInterestResult } from "./compound-interest-result"
import { InvestmentImpactSection } from "./investment-impact-section"
import { TrendingUp, DollarSign, Calendar, AlertCircle, ArrowRight } from "lucide-react"

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

  // Calcular valores para la sección de impacto
  const totalInvested = summary.initialDeposit + summary.totalContributions
  const nonInvestedValue = inflation > 0 ? totalInvested / Math.pow(1 + inflation / 100, years) : totalInvested
  const grossBalance = summary.balanceNet + summary.inflationEffect

  // Función para cambiar de pestaña
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Renderizado para móvil con pestañas
  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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

              {/* Sección de impacto optimizada para móvil */}
              <div className="mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="mt-1 text-[#388e3c] dark:text-[#6a9c77] flex-shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div className="w-full">
                      <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">
                        El impacto de invertir vs. no invertir
                      </h4>
                    </div>
                  </div>

                  {/* Recuadro "Si no inviertes tu dinero" */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Si no inviertes tu dinero:
                    </div>
                    <div className="text-lg font-bold text-red-500 dark:text-red-400">
                      {formatCurrency(nonInvestedValue)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      Total que ahorraste: {formatCurrency(totalInvested)}
                    </div>
                  </div>

                  {/* Comparación de inversión con/sin inflación */}
                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Con inflación, tu inversión valdría:
                      </div>
                      <div className="text-lg font-bold text-[#388e3c]">{formatCurrency(summary.balanceNet)}</div>
                    </div>
                  </div>

                  {/* Dato importante */}
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-3">
                    <ArrowRight size={14} className="mt-1 flex-shrink-0 text-[#388e3c]" />
                    <span>
                      Al invertir, no solo proteges tu dinero de la inflación, sino que también lo haces crecer con el
                      tiempo gracias al interés compuesto.
                    </span>
                  </div>
                </div>
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

  // Asegurar que los bordes de los recuadros sean visibles
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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
            {/* Solo mostrar el resultado principal sin la sección de impacto */}
            <div
              className="rounded-xl p-6 shadow-lg border border-[#1b5e20]/20"
              style={{
                background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                color: "#ffffff",
              }}
            >
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: "#ffffff" }}>
                <TrendingUp size={20} />
                <span>Resultado de la Inversión</span>
              </h3>

              <div className="text-3xl font-bold mb-4 flex items-center" style={{ color: "#ffffff" }}>
                <span className="text-xl mr-2 opacity-90" style={{ color: "#ffffff" }}>
                  Balance final:
                </span>
                {formatCurrency(summary.balanceNet)}
              </div>

              <div className="space-y-4">
                <div className="text-sm space-y-1" style={{ color: "#ffffff" }}>
                  <p className="leading-relaxed">
                    Con un depósito inicial de <strong>{formatCurrency(summary.initialDeposit)}</strong> y aportaciones
                    totales de <strong>{formatCurrency(summary.totalContributions)}</strong>, tu inversión crecerá hasta{" "}
                    <strong>{formatCurrency(summary.balanceNet)}</strong> con un rendimiento total de{" "}
                    <strong>{summary.totalReturn}</strong>.
                    {inflation > 0 && (
                      <>
                        {" "}
                        Este resultado ya considera una inflación del <strong>{inflation.toFixed(2)}%</strong> anual.
                      </>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/30">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#ffffff" }}>
                      <DollarSign size={14} />
                      <span>Ganancia neta</span>
                    </div>
                    <div className="font-semibold" style={{ color: "#ffffff" }}>
                      {formatCurrency(summary.netGain)}
                    </div>
                  </div>

                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#ffffff" }}>
                      <DollarSign size={14} />
                      <span>Aportes totales</span>
                    </div>
                    <div className="font-semibold" style={{ color: "#ffffff" }}>
                      {formatCurrency(summary.totalContributions)}
                    </div>
                  </div>

                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#ffffff" }}>
                      <Calendar size={14} />
                      <span>Tiempo en duplicar</span>
                    </div>
                    <div className="font-semibold" style={{ color: "#ffffff" }}>
                      {summary.doubleTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de impacto que ocupa toda la línea */}
        <div className="mt-6 mb-8">
          <InvestmentImpactSection
            summary={summary}
            formatCurrency={formatCurrency}
            inflation={inflation}
            years={years}
          />
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
