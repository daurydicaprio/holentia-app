"use client"

import { useState } from "react"
import { useCompoundInterestCalculator } from "@/hooks/use-compound-interest-calculator"
import dynamic from "next/dynamic"
import { CalculatorInputs } from "./calculator-inputs"
import { AmortizationTable } from "./amortization-table"
import { MobileTabsNavigation } from "./mobile-tabs-navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useCountUp } from "@/hooks/use-count-up"
import { CompoundInterestResult } from "./compound-interest-result"
import { InvestmentImpactSection } from "./investment-impact-section"
import { TrendingUp, DollarSign, Calendar, AlertCircle, ArrowRight, X } from "lucide-react"
import TabSwipeNavigation from "@/components/common/tab-swipe-navigation"

// chart.js y los paneles con framer-motion fuera del bundle inicial: se cargan
// solo cuando la vista los monta (tab de móvil o layout de escritorio).
const CalculatorCharts = dynamic(() => import("./calculator-charts").then((m) => m.CalculatorCharts), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-[400px]" aria-hidden />
  ),
})

const SavedSimulations = dynamic(() => import("./saved-simulations").then((m) => m.SavedSimulations), {
  ssr: false,
  loading: () => <div className="h-24 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" aria-hidden />,
})

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
    savedSimulations,
    saveSimulation,
    removeSimulation,
    updateSimulationName,
    clearCompoundData,
  } = useCompoundInterestCalculator()

  const [activeTab, setActiveTab] = useState<string>("calculator")
  const [saveError, setSaveError] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Función para manejar el guardado de simulaciones
  const handleSaveSimulation = () => {
    const result = saveSimulation()
    if (!result.success && result.message) {
      setSaveError(result.message)
    } else {
      setSaveError(null)
    }
  }

  // Calcular valores para la sección de impacto
  const totalInvested = summary.initialDeposit + summary.totalContributions
  const nonInvestedValue = inflation > 0 ? totalInvested / Math.pow(1 + inflation / 100, years) : totalInvested
  const grossBalance = summary.balanceNet + summary.inflationEffect
  const animatedBalance = useCountUp(summary.balanceNet)

  // Función para cambiar de pestaña
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Definir las pestañas disponibles para la navegación por swipe
  const availableTabs = ["calculator", "simulations", "charts"]

  // Renderizado para móvil con pestañas
  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4">
          {saveError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center justify-between gap-2">
              <span>{saveError}</span>
              <button onClick={() => setSaveError(null)} className="font-bold" aria-label="Cerrar aviso" data-interactive="true">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
          {/* Añadir navegación por swipe para las pestañas */}
          <TabSwipeNavigation activeTab={activeTab} tabs={availableTabs} onTabChange={handleTabChange} />

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
                onSaveSimulation={handleSaveSimulation}
                disableSave={savedSimulations.length >= 3}
                onClearData={clearCompoundData}
              />
              <div className="mt-6">
                <CompoundInterestResult summary={summary} formatCurrency={formatCurrency} inflation={inflation} />
              </div>

              {/* Sección de impacto optimizada para móvil */}
              <div className="mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="mt-1 text-finanzas dark:text-finanzas-light flex-shrink-0">
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
                    <div className="text-lg font-bold text-red-700 dark:text-red-300">
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
                      <div className="text-lg font-bold text-finanzas-dark dark:text-finanzas-lighter">{formatCurrency(summary.balanceNet)}</div>
                    </div>
                  </div>

                  {/* Dato importante */}
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-3">
                    <ArrowRight size={14} className="mt-1 flex-shrink-0 text-finanzas dark:text-finanzas-light" />
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

          {activeTab === "simulations" && (
            <>
              <SavedSimulations
                simulations={savedSimulations}
                onRemove={removeSimulation}
                onUpdateName={updateSimulationName}
                formatCurrency={formatCurrency}
              />

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
        {saveError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center justify-between gap-2">
            <span>{saveError}</span>
            <button onClick={() => setSaveError(null)} className="font-bold" aria-label="Cerrar aviso" data-interactive="true">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
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
              onSaveSimulation={handleSaveSimulation}
              disableSave={savedSimulations.length >= 3}
              onClearData={clearCompoundData}
            />
          </div>
          <div>
            {/* Solo mostrar el resultado principal sin la sección de impacto */}
            <div
              className="rounded-xl p-6 shadow-lg border border-[#1b5e20]/20 bg-gradient-to-br from-finanzas to-finanzas-dark text-white dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text"
            >
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <TrendingUp size={20} />
                <span>Resultado de la Inversión</span>
              </h3>

              <div aria-live="polite" className="animate-result-in text-3xl font-bold mb-4 flex items-center">
                <span className="text-xl mr-2">
                  Balance final:
                </span>
                {formatCurrency(animatedBalance)}
              </div>

              <div className="space-y-4">
                <div className="text-sm space-y-1">
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
                  <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <DollarSign size={14} />
                      <span>Ganancia neta</span>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(summary.netGain)}
                    </div>
                  </div>

                  <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <DollarSign size={14} />
                      <span>Aportes totales</span>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(summary.totalContributions)}
                    </div>
                  </div>

                  <div className="bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <Calendar size={14} />
                      <span>Tiempo en duplicar</span>
                    </div>
                    <div className="font-semibold">
                      {summary.doubleTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de simulaciones guardadas */}
        {savedSimulations.length > 0 && (
          <div className="mt-6 mb-8">
            <SavedSimulations
              simulations={savedSimulations}
              onRemove={removeSimulation}
              onUpdateName={updateSimulationName}
              formatCurrency={formatCurrency}
            />
          </div>
        )}

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
