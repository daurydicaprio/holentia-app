"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

export interface BudgetItem {
  id: string
  concept: string
  amount: number
  percentage?: number
}

export interface ExpenseItem extends BudgetItem {
  target: number
  targetPercentage?: number
  difference?: number
}

export interface BudgetSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  totalSaved: number
  savedPercentage: number
}

export interface SavingProjection {
  sixMonth: {
    amount: number
    multiplier: number
  }
  oneYear: {
    amount: number
    multiplier: number
  }
}

export interface TopExpense {
  name: string
  amount: number
  percentage: number
}

const BUDGET_DRAFT_KEY = draftKey("crear-presupuesto-personal")

const DEFAULT_INCOME: BudgetItem[] = [
  { id: "income-1", concept: "Salario principal", amount: 0 },
  { id: "income-2", concept: "Ingresos extra", amount: 0 },
]

const DEFAULT_EXPENSES: ExpenseItem[] = [
  { id: "expense-1", concept: "Ahorro fijo", target: 0, amount: 0 },
  { id: "expense-2", concept: "Vivienda", target: 0, amount: 0 },
  { id: "expense-3", concept: "Alimentación", target: 0, amount: 0 },
]

interface BudgetDraft {
  incomeItems?: BudgetItem[]
  expenseItems?: ExpenseItem[]
}

export function useBudgetSimulator() {
  // Estado para ingresos y gastos
  const [incomeItems, setIncomeItems] = useState<BudgetItem[]>(DEFAULT_INCOME)

  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>(DEFAULT_EXPENSES)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restored = useRef(false)

  // Restaurar borrador solo en cliente (evita hydration mismatch)
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    const draft = storageGet<BudgetDraft>(BUDGET_DRAFT_KEY, {})
    if (draft.incomeItems && draft.incomeItems.length > 0) setIncomeItems(draft.incomeItems)
    if (draft.expenseItems && draft.expenseItems.length > 0) setExpenseItems(draft.expenseItems)
  }, [])

  // Estado para el resumen
  const [summary, setSummary] = useState<BudgetSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    totalSaved: 0,
    savedPercentage: 0,
  })

  // Estado para proyecciones de ahorro
  const [savingProjection, setSavingProjection] = useState<SavingProjection>({
    sixMonth: { amount: 0, multiplier: 0 },
    oneYear: { amount: 0, multiplier: 0 },
  })

  // Estado para los principales gastos
  const [topExpenses, setTopExpenses] = useState<TopExpense[]>([])

  // Estado para advertencia de presupuesto excedido
  const [showBudgetWarning, setShowBudgetWarning] = useState(false)

  // Efecto para actualizar cálculos cuando cambian los ingresos o gastos
  // Reemplazar el useEffect actual con esta versión:
  useEffect(() => {
    // Calcular total de ingresos
    const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0)

    // Calcular porcentajes de ingresos sin actualizar el estado
    const updatedIncomeItems = incomeItems.map((item) => ({
      ...item,
      percentage: totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0,
    }))

    // Calcular totales de gastos
    const totalExpenseTarget = expenseItems.reduce((sum, item) => sum + item.target, 0)
    const totalExpenseAmount = expenseItems.reduce((sum, item) => sum + item.amount, 0)

    // Encontrar el ahorro fijo
    const fixedSavingsItem = expenseItems.find((item) => item.concept === "Ahorro fijo")
    const fixedSavingsAmount = fixedSavingsItem ? fixedSavingsItem.amount : 0

    // Calcular balance y ahorro total
    const balance = totalIncome - totalExpenseAmount
    const totalSaved = balance + fixedSavingsAmount
    const savedPercentage = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0

    // Actualizar el resumen
    setSummary({
      totalIncome,
      totalExpenses: totalExpenseAmount,
      balance,
      totalSaved,
      savedPercentage,
    })

    // Actualizar proyecciones de ahorro
    setSavingProjection({
      sixMonth: {
        amount: totalSaved * 6,
        multiplier: totalIncome > 0 ? (totalSaved * 6) / totalIncome : 0,
      },
      oneYear: {
        amount: totalSaved * 12,
        multiplier: totalIncome > 0 ? (totalSaved * 12) / totalIncome : 0,
      },
    })

    // Actualizar gastos principales (excluyendo ahorro fijo y vivienda)
    const expensesForInsights = expenseItems.filter((item) => {
      const housingTerms = ["vivienda", "casa", "alquiler", "apartamento", "renta", "hipoteca", "mortgage"]
      const isHousing = housingTerms.some((term) => item.concept.toLowerCase().includes(term))
      const isSavings = item.concept === "Ahorro fijo"

      return !isHousing && !isSavings && item.amount > 0
    })

    // Ordenar por cantidad (de mayor a menor)
    const sortedExpenses = [...expensesForInsights].sort((a, b) => b.amount - a.amount)

    // Tomar los dos principales gastos
    const topTwoExpenses = sortedExpenses.slice(0, 2).map((item) => ({
      name: item.concept,
      amount: item.amount,
      percentage: totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0,
    }))

    setTopExpenses(topTwoExpenses)

    // Verificar si se debe mostrar la advertencia de presupuesto
    setShowBudgetWarning((totalExpenseTarget > totalIncome || totalExpenseAmount > totalIncome) && totalIncome > 0)

    // Actualizar los gastos con porcentajes y diferencias calculados sin modificar el estado original
    const updatedExpenseItems = expenseItems.map((item) => {
      return {
        ...item,
        targetPercentage: totalIncome > 0 ? (item.target / totalIncome) * 100 : 0,
        percentage: totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0,
        difference: item.target - item.amount,
      }
    })

    // Actualizar los estados de forma segura
    setIncomeItems(updatedIncomeItems)
    setExpenseItems(updatedExpenseItems)
  }, [
    incomeItems.map((item) => item.amount).join(","),
    expenseItems.map((item) => `${item.id}-${item.target}-${item.amount}`).join(","),
  ])

  // Función para formatear moneda
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }, [])

  // Función para añadir un nuevo ingreso
  const addIncome = (concept: string) => {
    const newId = `income-${Date.now()}`
    setIncomeItems([...incomeItems, { id: newId, concept, amount: 0 }])
  }

  // Función para añadir un nuevo gasto
  const addExpense = (concept: string) => {
    const newId = `expense-${Date.now()}`
    setExpenseItems([...expenseItems, { id: newId, concept, target: 0, amount: 0 }])
  }

  // Función para eliminar un ingreso
  const removeIncome = (id: string) => {
    setIncomeItems(incomeItems.filter((item) => item.id !== id))
  }

  // Función para eliminar un gasto
  const removeExpense = (id: string) => {
    setExpenseItems(expenseItems.filter((item) => item.id !== id))
  }

  // Función para actualizar el monto de un ingreso
  const updateIncomeAmount = (id: string, amount: number) => {
    setIncomeItems(incomeItems.map((item) => (item.id === id ? { ...item, amount: amount } : item)))
  }

  // Función para actualizar el objetivo de un gasto
  const updateExpenseTarget = (id: string, target: number) => {
    setExpenseItems(expenseItems.map((item) => (item.id === id ? { ...item, target: target } : item)))
  }

  // Función para actualizar el monto consumido de un gasto
  const updateExpenseAmount = (id: string, amount: number) => {
    setExpenseItems(expenseItems.map((item) => (item.id === id ? { ...item, amount: amount } : item)))
  }

  // Autoguardado del borrador (Tipo D) con debounce 500ms
  // (se salta el primer render para no pisar lo restaurado)
  const firstSave = useRef(true)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      storageSet(BUDGET_DRAFT_KEY, { incomeItems, expenseItems })
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [incomeItems, expenseItems])

  // Borra el borrador local y restaura valores iniciales
  const clearBudgetData = () => {
    storageRemove(BUDGET_DRAFT_KEY)
    setIncomeItems(DEFAULT_INCOME)
    setExpenseItems(DEFAULT_EXPENSES)
  }

  // Modificar la función updateAllCalculations para que no actualice estados directamente
  // y solo se use para cálculos iniciales o cuando sea explícitamente llamada
  const updateAllCalculations = () => {
    // Toda la lógica vive en el useEffect; se mantiene por compatibilidad
  }

  return {
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
    updateAllCalculations,
    clearBudgetData,
  }
}
