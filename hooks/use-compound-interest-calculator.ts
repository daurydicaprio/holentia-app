"use client"

import { useState, useEffect } from "react"

export interface SimulationData {
  year: number
  period?: number
  startBalance: number
  contributions: number
  interest: number
  balance: number
}

export interface SummaryData {
  initialDeposit: number
  totalContributions: number
  interestEarned: number
  balanceNet: number
  inflationEffect: number
  annualizedReturn: string
  doubleTime: string
}

export function useCompoundInterestCalculator() {
  // Estados para los inputs del usuario
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(1000)
  const [interestRate, setInterestRate] = useState(8)
  const [years, setYears] = useState(10)
  const [inflationRate, setInflationRate] = useState(3)
  const [reinvestDividends, setReinvestDividends] = useState(true)

  // Estados para los resultados calculados
  const [finalAmount, setFinalAmount] = useState(0)
  const [totalContributions, setTotalContributions] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [inflationAdjustedAmount, setInflationAdjustedAmount] = useState(0)
  const [chartData, setChartData] = useState<any>({
    labels: [],
    lineData: [],
    capitalData: [],
    interestData: [],
  })
  const [pieChartData, setPieChartData] = useState<any>({
    labels: [],
    data: [],
  })

  // Función para formatear valores monetarios
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Efecto para calcular los resultados cuando cambian los inputs
  useEffect(() => {
    calculateResults()
  }, [initialInvestment, monthlyContribution, interestRate, years, inflationRate, reinvestDividends])

  // Función principal de cálculo
  const calculateResults = () => {
    // Validar inputs para evitar cálculos con valores inválidos
    if (initialInvestment < 0 || monthlyContribution < 0 || interestRate < 0 || years <= 0 || inflationRate < 0) {
      return
    }

    // Convertir tasas anuales a mensuales
    const monthlyInterestRate = interestRate / 100 / 12
    const monthlyInflationRate = inflationRate / 100 / 12
    const totalMonths = years * 12

    // Arrays para almacenar datos para los gráficos
    const yearlyLabels: string[] = []
    const yearlyLineData: number[] = []
    const yearlyCapitalData: number[] = []
    const yearlyInterestData: number[] = []

    // Variables para el seguimiento de los valores
    let currentAmount = initialInvestment
    let totalContributions = initialInvestment
    let yearlyAmount = 0
    let yearlyInflationAdjustedAmount = 0
    let yearlyCapital = 0
    let yearlyInterest = 0

    // Calcular el crecimiento mes a mes
    for (let month = 1; month <= totalMonths; month++) {
      // Añadir la contribución mensual
      currentAmount += monthlyContribution
      totalContributions += monthlyContribution

      // Aplicar el interés mensual
      const monthlyInterest = currentAmount * monthlyInterestRate
      currentAmount += monthlyInterest

      // Al final de cada año, guardar los datos para los gráficos
      if (month % 12 === 0) {
        const year = month / 12
        yearlyLabels.push(`Año ${year}`)

        // Calcular el valor ajustado por inflación
        yearlyInflationAdjustedAmount = currentAmount / Math.pow(1 + monthlyInflationRate, month)
        yearlyAmount = currentAmount
        yearlyCapital = totalContributions
        yearlyInterest = yearlyAmount - yearlyCapital

        yearlyLineData.push(Math.round(yearlyInflationAdjustedAmount))
        yearlyCapitalData.push(Math.round(yearlyCapital))
        yearlyInterestData.push(Math.round(yearlyInterest))
      }
    }

    // Actualizar los estados con los resultados calculados
    setFinalAmount(Math.round(currentAmount))
    setTotalContributions(Math.round(totalContributions))
    setTotalInterest(Math.round(currentAmount - totalContributions))
    setInflationAdjustedAmount(Math.round(currentAmount / Math.pow(1 + monthlyInflationRate, totalMonths)))

    // Actualizar los datos para los gráficos
    setChartData({
      labels: yearlyLabels,
      lineData: yearlyLineData,
      capitalData: yearlyCapitalData,
      interestData: yearlyInterestData,
    })

    // Datos para el gráfico de pastel
    setPieChartData({
      labels: ["Inversión inicial", "Aportaciones", "Interés generado", "Pérdida por inflación"],
      data: [
        Math.round(initialInvestment),
        Math.round(totalContributions - initialInvestment),
        Math.round(currentAmount - totalContributions),
        Math.round(currentAmount - currentAmount / Math.pow(1 + monthlyInflationRate, totalMonths)),
      ],
    })
  }

  return {
    // Inputs
    initialInvestment,
    setInitialInvestment,
    monthlyContribution,
    setMonthlyContribution,
    interestRate,
    setInterestRate,
    years,
    setYears,
    inflationRate,
    setInflationRate,
    reinvestDividends,
    setReinvestDividends,
    // Resultados
    finalAmount,
    totalContributions,
    totalInterest,
    inflationAdjustedAmount,
    formatCurrency,
    // Datos para gráficos
    chartData,
    pieChartData,
  }
}
