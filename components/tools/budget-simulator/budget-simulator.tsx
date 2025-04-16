"use client"

import { useState } from "react"
import { useBudgetSimulator } from "@/hooks/use-budget-simulator"
import { BudgetTabs } from "./budget-tabs"
import { IncomeTable } from "./income-table"
import { ExpenseTable } from "./expense-table"
import { BudgetSummary } from "./budget-summary"
import { BudgetInsights } from "./budget-insights"
import { BudgetTips } from "./budget-tips"
import { BudgetWarning } from "./budget-warning"
import { AddConceptModal } from "./add-concept-modal"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChevronRight } from "lucide-react"

export function BudgetSimulator() {
  const {
    incomeItems,
    expenseItems,
    summary,
    savingProjection,
    topExpenses,
    showBudgetWarning,
    formatCurrency,
    addIncome,
    addExpense,
    removeIncome,
    removeExpense,
    updateIncomeAmount,
    updateExpenseTarget,
    updateExpenseAmount,
  } = useBudgetSimulator()

  const [activeTab, setActiveTab] = useState<string>("income")
  const [showTips, setShowTips] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<"income" | "expense">("income")
  const [showWarning, setShowWarning] = useState<boolean>(showBudgetWarning)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Función para abrir el modal
  const openModal = (type: "income" | "expense") => {
    setModalType(type)
    setShowModal(true)
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false)
  }

  // Función para cerrar la advertencia
  const closeWarning = () => {
    setShowWarning(false)
  }

  // Función para guardar un nuevo concepto
  const saveConcept = (concept: string) => {
    if (modalType === "income") {
      addIncome(concept)
    } else {
      addExpense(concept)
    }
    closeModal()
  }

  // Función para cambiar de pestaña (solo móvil)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Función para avanzar al siguiente tab
  const goToNextTab = () => {
    if (activeTab === "income") {
      setActiveTab("expenses")
    } else if (activeTab === "expenses") {
      setActiveTab("summary")
    }
  }

  // Función para retroceder al tab anterior
  const goToPreviousTab = () => {
    if (activeTab === "expenses") {
      setActiveTab("income")
    } else if (activeTab === "summary") {
      setActiveTab("expenses")
    }
  }

  // Función para mostrar/ocultar consejos en móvil
  const toggleTips = () => {
    setShowTips(!showTips)
  }

  // Renderizado condicional basado en el tamaño de pantalla
  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg">
        <BudgetTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="p-4">
          {activeTab === "income" && (
            <IncomeTable
              incomeItems={incomeItems}
              totalIncome={summary.totalIncome}
              formatCurrency={formatCurrency}
              onAddIncome={() => openModal("income")}
              onRemoveIncome={removeIncome}
              onUpdateAmount={updateIncomeAmount}
            />
          )}

          {activeTab === "expenses" && (
            <ExpenseTable
              expenseItems={expenseItems}
              totalIncome={summary.totalIncome}
              formatCurrency={formatCurrency}
              onAddExpense={() => openModal("expense")}
              onRemoveExpense={removeExpense}
              onUpdateTarget={updateExpenseTarget}
              onUpdateAmount={updateExpenseAmount}
            />
          )}

          {activeTab === "summary" && (
            <>
              <BudgetSummary summary={summary} formatCurrency={formatCurrency} />
              <BudgetInsights
                savingProjection={savingProjection}
                topExpenses={topExpenses}
                formatCurrency={formatCurrency}
              />
              <button
                onClick={toggleTips}
                className="w-full mt-6 px-4 py-2 bg-[#388e3c] hover:bg-[#1b5e20] text-white font-medium rounded-md transition-colors"
              >
                {showTips ? "Ocultar consejos financieros" : "Mostrar consejos financieros"}
              </button>
              {showTips && (
                <div className="mt-6">
                  <BudgetTips />
                </div>
              )}
            </>
          )}

          {/* Navegación entre tabs y progreso */}
          <div className="mt-8 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <button
                onClick={goToPreviousTab}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === "income"
                    ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
                disabled={activeTab === "income"}
              >
                Anterior
              </button>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {activeTab === "income" ? "1" : activeTab === "expenses" ? "2" : "3"} de 3
              </div>

              <button
                onClick={goToNextTab}
                className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                  activeTab === "summary"
                    ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    : "bg-[#388e3c] hover:bg-[#1b5e20] text-white"
                }`}
                disabled={activeTab === "summary"}
              >
                Siguiente <ChevronRight size={16} />
              </button>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-[#388e3c] h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: activeTab === "income" ? "33.3%" : activeTab === "expenses" ? "66.6%" : "100%",
                }}
              ></div>
            </div>
          </div>
        </div>

        {showBudgetWarning && showWarning && <BudgetWarning onClose={closeWarning} />}

        {showModal && <AddConceptModal type={modalType} onSave={saveConcept} onCancel={closeModal} />}
      </div>
    )
  }

  // Versión de escritorio (sin pestañas)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <IncomeTable
              incomeItems={incomeItems}
              totalIncome={summary.totalIncome}
              formatCurrency={formatCurrency}
              onAddIncome={() => openModal("income")}
              onRemoveIncome={removeIncome}
              onUpdateAmount={updateIncomeAmount}
            />

            <ExpenseTable
              expenseItems={expenseItems}
              totalIncome={summary.totalIncome}
              formatCurrency={formatCurrency}
              onAddExpense={() => openModal("expense")}
              onRemoveExpense={removeExpense}
              onUpdateTarget={updateExpenseTarget}
              onUpdateAmount={updateExpenseAmount}
            />

            <div>
              <BudgetSummary summary={summary} formatCurrency={formatCurrency} />
              <BudgetInsights
                savingProjection={savingProjection}
                topExpenses={topExpenses}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <BudgetTips />
          </div>
        </div>
      </div>

      {showBudgetWarning && showWarning && <BudgetWarning onClose={closeWarning} />}

      {showModal && <AddConceptModal type={modalType} onSave={saveConcept} onCancel={closeModal} />}
    </div>
  )
}
