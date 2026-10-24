"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { simulationsKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import { formatDOP } from "@/lib/format"
import { calculateMonthlyPayment, generateAmortizationTable } from "@/lib/calculations/loan"

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
  const formatCurrency = useCallback((value: number): string => formatDOP(value), [])

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
