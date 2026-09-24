"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { simulationsKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import type { AmortizationRow } from "@/types"

// Tipos para las simulaciones guardadas
export interface LoanSimulation {
  id: number
  name: string
  loanAmount: number
  interestRate: number
  loanTerm: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
}

const LOAN_SIMS_KEY = simulationsKey("calculadora-prestamo")

export function useLoanCalculator() {
  // Estado para las simulaciones guardadas (Tipo S, máx 3, persistentes)
  const [savedSimulations, setSavedSimulations] = useState<LoanSimulation[]>([])

  const restored = useRef(false)
  const firstSimsSave = useRef(true)

  // Restaurar simulaciones solo en cliente (evita hydration mismatch)
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    setSavedSimulations(storageGet<LoanSimulation[]>(LOAN_SIMS_KEY, []))
  }, [])

  // Persistir simulaciones en cada cambio (se salta el primer render)
  useEffect(() => {
    if (firstSimsSave.current) {
      firstSimsSave.current = false
      return
    }
    storageSet(LOAN_SIMS_KEY, savedSimulations)
  }, [savedSimulations])

  // Función para formatear moneda
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }, [])

  // Función para calcular la cuota mensual
  const calculateMonthlyPayment = (loanAmount: number, interestRate: number, loanTerm: number): number => {
    // Tasa de interés mensual (anual dividida por 12)
    const monthlyInterestRate = interestRate / 100 / 12

    // Fórmula para calcular la cuota mensual
    if (monthlyInterestRate === 0) {
      return loanAmount / loanTerm
    }

    return (
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
    )
  }

  // Función para generar la tabla de amortización
  const generateAmortizationTable = (loanAmount: number, interestRate: number, loanTerm: number) => {
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm)
    let remainingBalance = loanAmount
    const monthlyInterestRate = interestRate / 100 / 12
    const amortizationData: AmortizationRow[] = []

    for (let month = 1; month <= loanTerm; month++) {
      // Calcular el interés mensual
      const interestPayment = remainingBalance * monthlyInterestRate

      // Calcular el pago al capital
      const principalPayment = monthlyPayment - interestPayment

      // Calcular el nuevo saldo
      const initialBalance = remainingBalance
      remainingBalance -= principalPayment

      // Agregar datos a la tabla
      amortizationData.push({
        month,
        initialBalance,
        payment: monthlyPayment,
        interest: interestPayment,
        principal: principalPayment,
        remainingBalance: Math.max(0, remainingBalance),
      })
    }

    return {
      monthlyPayment,
      amortizationData,
    }
  }

  // Función para guardar una simulación
  const saveSimulation = (loanAmount: number, interestRate: number, loanTerm: number) => {
    if (savedSimulations.length >= 3) {
      return { success: false, message: "Ya has guardado el máximo de 3 simulaciones." }
    }

    if (loanAmount <= 0 || loanTerm <= 0) {
      return { success: false, message: "Por favor, ingresa valores válidos para el monto y el plazo del préstamo." }
    }

    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm)

    // Crear objeto con los datos de la simulación
    const simulation: LoanSimulation = {
      id: Date.now(),
      name: `Opción ${savedSimulations.length + 1}`,
      loanAmount,
      interestRate,
      loanTerm,
      monthlyPayment,
      totalPayment: monthlyPayment * loanTerm,
      totalInterest: monthlyPayment * loanTerm - loanAmount,
    }

    // Agregar la simulación al arreglo
    setSavedSimulations([...savedSimulations, simulation])

    return { success: true, simulation }
  }

  // Función para eliminar una simulación guardada
  const removeSimulation = (simulationId: number) => {
    setSavedSimulations(savedSimulations.filter((sim) => sim.id !== simulationId))
  }

  // Función para actualizar el nombre de una simulación
  const updateSimulationName = (simulationId: number, newName: string) => {
    setSavedSimulations(
      savedSimulations.map((sim) =>
        sim.id === simulationId ? { ...sim, name: newName || `Opción ${savedSimulations.indexOf(sim) + 1}` } : sim,
      ),
    )
  }

  // Borra las simulaciones guardadas en memoria y en local
  const clearLoanSimulations = () => {
    storageRemove(LOAN_SIMS_KEY)
    setSavedSimulations([])
  }

  return {
    savedSimulations,
    formatCurrency,
    calculateMonthlyPayment,
    generateAmortizationTable,
    saveSimulation,
    removeSimulation,
    updateSimulationName,
    clearLoanSimulations,
  }
}
