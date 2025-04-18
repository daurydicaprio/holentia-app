"use client"

import { useState, useEffect } from "react"
import { useLoanCalculator } from "@/hooks/use-loan-calculator"
import { LoanCalculatorForm } from "./loan-calculator-form"
import { LoanResult } from "./loan-result"
import { SavedSimulations } from "./saved-simulations"
import { AmortizationTable } from "./amortization-table"
import { LoanDisclaimer } from "./disclaimer"
import { LoanCalculatorTabs } from "./loan-calculator-tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"

export function LoanCalculator() {
  const {
    savedSimulations,
    formatCurrency,
    calculateMonthlyPayment,
    generateAmortizationTable,
    saveSimulation,
    removeSimulation,
    updateSimulationName,
  } = useLoanCalculator()

  const [loanAmount, setLoanAmount] = useState<number>(100000)
  const [interestRate, setInterestRate] = useState<number>(24)
  const [loanTerm, setLoanTerm] = useState<number>(12)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0)
  const [amortizationData, setAmortizationData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("calculator")
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Inicializar cálculos al montar el componente
  useEffect(() => {
    if (!isInitialized) {
      const result = generateAmortizationTable(loanAmount, interestRate, loanTerm)
      setMonthlyPayment(result.monthlyPayment)
      setAmortizationData(result.amortizationData)
      setIsInitialized(true)
    }
  }, [isInitialized, generateAmortizationTable, loanAmount, interestRate, loanTerm])

  // Función para manejar el cálculo
  const handleCalculate = (amount: number, rate: number, term: number) => {
    setLoanAmount(amount)
    setInterestRate(rate)
    setLoanTerm(term)

    const { monthlyPayment, amortizationData } = generateAmortizationTable(amount, rate, term)
    setMonthlyPayment(monthlyPayment)
    setAmortizationData(amortizationData)
  }

  // Función para guardar una simulación
  const handleSaveSimulation = () => {
    const result = saveSimulation(loanAmount, interestRate, loanTerm)
    if (!result.success) {
      alert(result.message)
    }
  }

  // Función para resetear el formulario
  const handleResetForm = () => {
    handleCalculate(100000, 24, 12)
  }

  // Función para cambiar de pestaña (solo móvil)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Renderizado condicional basado en el tamaño de pantalla
  if (isMobile) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <LoanCalculatorTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasSimulations={savedSimulations.length > 0}
        />

        <div className="p-5">
          {activeTab === "calculator" && (
            <motion.div variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <LoanCalculatorForm
                  onCalculate={handleCalculate}
                  onSaveSimulation={handleSaveSimulation}
                  onResetForm={handleResetForm}
                  disableSave={savedSimulations.length >= 3}
                  loanAmount={loanAmount}
                  interestRate={interestRate}
                  loanTerm={loanTerm}
                />
              </motion.div>
              <motion.div className="mt-6" variants={itemVariants}>
                <LoanResult
                  monthlyPayment={monthlyPayment}
                  loanAmount={loanAmount}
                  interestRate={interestRate}
                  loanTerm={loanTerm}
                  formatCurrency={formatCurrency}
                />
              </motion.div>
              <motion.div className="mt-6" variants={itemVariants}>
                <LoanDisclaimer />
              </motion.div>
            </motion.div>
          )}

          {activeTab === "simulations" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <SavedSimulations
                simulations={savedSimulations}
                onRemove={removeSimulation}
                onUpdateName={updateSimulationName}
                formatCurrency={formatCurrency}
              />
            </motion.div>
          )}

          {activeTab === "table" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <AmortizationTable data={amortizationData} formatCurrency={formatCurrency} />
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // Versión de escritorio (sin pestañas)
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <LoanCalculatorForm
              onCalculate={handleCalculate}
              onSaveSimulation={handleSaveSimulation}
              onResetForm={handleResetForm}
              disableSave={savedSimulations.length >= 3}
              loanAmount={loanAmount}
              interestRate={interestRate}
              loanTerm={loanTerm}
            />
            <div className="mt-6">
              <LoanDisclaimer />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <LoanResult
              monthlyPayment={monthlyPayment}
              loanAmount={loanAmount}
              interestRate={interestRate}
              loanTerm={loanTerm}
              formatCurrency={formatCurrency}
            />

            {savedSimulations.length > 0 && (
              <div className="mt-6">
                <SavedSimulations
                  simulations={savedSimulations}
                  onRemove={removeSimulation}
                  onUpdateName={updateSimulationName}
                  formatCurrency={formatCurrency}
                />
              </div>
            )}
          </motion.div>
        </div>

        <motion.div className="mt-8" variants={itemVariants}>
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Tabla de Amortización</h3>
          <AmortizationTable data={amortizationData} formatCurrency={formatCurrency} />
        </motion.div>
      </div>
    </motion.div>
  )
}
