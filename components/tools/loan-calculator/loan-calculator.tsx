"use client"

import { useState, useEffect, useRef } from "react"
import { useLoanCalculator } from "@/hooks/use-loan-calculator"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import { LoanCalculatorForm } from "./loan-calculator-form"
import { LoanResult } from "./loan-result"
import { SavedSimulations } from "./saved-simulations"
import { AmortizationTable } from "./amortization-table"
import { LoanDisclaimer } from "./disclaimer"
import { LoanCalculatorTabs } from "./loan-calculator-tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"
import TabSwipeNavigation from "@/components/common/tab-swipe-navigation"

export function LoanCalculator() {
  const {
    savedSimulations,
    formatCurrency,
    calculateMonthlyPayment,
    generateAmortizationTable,
    saveSimulation,
    removeSimulation,
    updateSimulationName,
    clearLoanSimulations,
  } = useLoanCalculator()

  const [loanAmount, setLoanAmount] = useState<number>(100000)
  const [interestRate, setInterestRate] = useState<number>(24)
  const [loanTerm, setLoanTerm] = useState<number>(12)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0)
  const [amortizationData, setAmortizationData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("calculator")
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restoredDraft = useRef(false)
  const firstDraftSave = useRef(true)
  const LOAN_DRAFT_KEY = draftKey("calculadora-prestamo")

  // Restaurar borrador (Tipo D) solo en cliente
  useEffect(() => {
    if (restoredDraft.current) return
    restoredDraft.current = true
    const draft = storageGet<{ loanAmount?: number; interestRate?: number; loanTerm?: number }>(
      LOAN_DRAFT_KEY,
      {},
    )
    if (draft.loanAmount !== undefined) setLoanAmount(draft.loanAmount)
    if (draft.interestRate !== undefined) setInterestRate(draft.interestRate)
    if (draft.loanTerm !== undefined) setLoanTerm(draft.loanTerm)
  }, [LOAN_DRAFT_KEY])

  // Autoguardado del borrador con debounce 500ms (se salta el primer render)
  useEffect(() => {
    if (firstDraftSave.current) {
      firstDraftSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      storageSet(LOAN_DRAFT_KEY, { loanAmount, interestRate, loanTerm })
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [LOAN_DRAFT_KEY, loanAmount, interestRate, loanTerm])

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

  const [saveError, setSaveError] = useState<string | null>(null)

  // Función para guardar una simulación
  const handleSaveSimulation = () => {
    const result = saveSimulation(loanAmount, interestRate, loanTerm)
    if (!result.success) {
      setSaveError(result.message ?? "No se pudo guardar la simulación.")
    } else {
      setSaveError(null)
    }
  }

  // Función para resetear el formulario
  const handleResetForm = () => {
    handleCalculate(100000, 24, 12)
  }

  // Borra borrador local + simulaciones y restaura el formulario
  const handleClearAllData = () => {
    storageRemove(LOAN_DRAFT_KEY)
    clearLoanSimulations()
    handleCalculate(100000, 24, 12)
  }

  // Función para cambiar de pestaña (solo móvil)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Definir las pestañas disponibles para la navegación por swipe
  const availableTabs = ["calculator", "simulations", "table"].filter(
    (tab) => tab !== "simulations" || savedSimulations.length > 0,
  )

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

        {/* Añadir navegación por swipe para las pestañas */}
        <TabSwipeNavigation activeTab={activeTab} tabs={availableTabs} onTabChange={handleTabChange} />

        <div className="p-5">
          {saveError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center justify-between gap-2">
              <span>{saveError}</span>
              <button onClick={() => setSaveError(null)} className="font-bold" aria-label="Cerrar aviso">
                ×
              </button>
            </div>
          )}
          {activeTab === "calculator" && (
            <motion.div variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <LoanCalculatorForm
                  onCalculate={handleCalculate}
                  onSaveSimulation={handleSaveSimulation}
                  onResetForm={handleResetForm}
                  onClearData={handleClearAllData}
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
        {saveError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center justify-between gap-2">
            <span>{saveError}</span>
            <button onClick={() => setSaveError(null)} className="font-bold" aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <LoanCalculatorForm
              onCalculate={handleCalculate}
              onSaveSimulation={handleSaveSimulation}
              onResetForm={handleResetForm}
              onClearData={handleClearAllData}
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
