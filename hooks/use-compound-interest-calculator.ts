"use client"

import { useState, useEffect } from "react"

export interface SimulationData {
  year: number
  period?: number
  startBalance: number
  interest: number
  contribution: number
  balance: number
}

export interface SummaryData {
  balanceNet: number
  netGain: number
  totalContributions: number
  initialDeposit: number
  inflationEffect: number
  doubleTime: string
  annualizedReturn: string
  totalReturn: string
}

export interface ChartData {
  labels: string[]
  lineData: number[]
  capitalData: number[]
  interestData: number[]
}

export interface PieChartData {
  data: number[]
  labels: string[]
  colors: string[]
}

export function useCompoundInterestCalculator() {
  // Inputs con valores iniciales más realistas
  const [initialDeposit, setInitialDeposit] = useState<number>(10000)
  const [contribution, setContribution] = useState<number>(1000)
  const [contributionFrequency, setContributionFrequency] = useState<number>(12) // 1: anual, 12: mensual
  const [years, setYears] = useState<number>(10)
  const [interestRate, setInterestRate] = useState<number>(8)
  const [inflation, setInflation] = useState<number>(4)

  // Resultados
  const [summary, setSummary] = useState<SummaryData>({
    balanceNet: 0,
    netGain: 0,
    totalContributions: 0,
    initialDeposit: 0,
    inflationEffect: 0,
    doubleTime: "--",
    annualizedReturn: "--",
    totalReturn: "--",
  })

  // Datos de simulación
  const [annualSimData, setAnnualSimData] = useState<SimulationData[]>([])
  const [monthlySimData, setMonthlySimData] = useState<SimulationData[]>([])
  const [tableView, setTableView] = useState<"annual" | "monthly">("annual")

  // Datos para gráficos
  const [lineChartData, setLineChartData] = useState<ChartData>({
    labels: [],
    lineData: [],
    capitalData: [],
    interestData: [],
  })

  const [pieChartData, setPieChartData] = useState<PieChartData>({
    data: [],
    labels: [],
    colors: [],
  })

  // Función para formatear moneda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Función para simular inversión anual
  const simulateInvestmentAnnual = (
    P: number,
    PMT: number,
    years: number,
    r: number,
    freqContrib: number,
  ): SimulationData[] => {
    const annualPMT = freqContrib === 12 ? PMT * 12 * 1.0446 : PMT
    const simulation: SimulationData[] = []
    let balance = P

    for (let y = 1; y <= years; y++) {
      const startBalance = balance
      const interest = startBalance * r
      balance = startBalance * (1 + r) + annualPMT
      simulation.push({ year: y, startBalance, interest, contribution: annualPMT, balance })
    }

    return simulation
  }

  // Función para simular inversión mensual
  const simulateInvestmentMonthly = (
    P: number,
    PMT: number,
    years: number,
    r: number,
    freqContrib: number,
  ): SimulationData[] => {
    const simulation: SimulationData[] = []
    const totalMonths = years * 12
    let balance = P
    const monthlyRate = r / 12

    for (let m = 1; m <= totalMonths; m++) {
      const startBalance = balance
      const interest = startBalance * monthlyRate
      balance = startBalance * (1 + monthlyRate)
      const contrib = freqContrib === 12 ? PMT : m % 12 === 0 ? PMT : 0
      balance += contrib
      simulation.push({
        period: m,
        year: Math.ceil(m / 12),
        startBalance,
        interest,
        contribution: contrib,
        balance,
      })
    }

    return simulation
  }

  // Función para calcular el NPV (Valor Presente Neto)
  const computeNPV = (rate: number, cashFlows: { time: number; value: number }[]): number => {
    let npv = 0
    if (rate <= -1) {
      let hasFutureFlow = false
      for (let i = 0; i < cashFlows.length; i++) {
        if (cashFlows[i].time > 0 && cashFlows[i].value !== 0) {
          hasFutureFlow = true
          break
        }
      }
      if (hasFutureFlow) return Number.NaN
      const initialFlow = cashFlows.find((cf) => cf.time === 0)
      return initialFlow ? initialFlow.value : 0
    }
    for (let i = 0; i < cashFlows.length; i++) {
      if (
        typeof cashFlows[i].value !== "number" ||
        typeof cashFlows[i].time !== "number" ||
        isNaN(cashFlows[i].value) ||
        isNaN(cashFlows[i].time)
      ) {
        continue
      }
      try {
        npv += cashFlows[i].value / Math.pow(1 + rate, cashFlows[i].time)
      } catch (e) {
        return Number.NaN
      }
    }
    if (!isFinite(npv)) {
      return Number.NaN
    }
    return npv
  }

  // Función para calcular el IRR (Tasa Interna de Retorno)
  const computeIRR = (cashFlows: { time: number; value: number }[], guess = 0.1): number => {
    const hasNegative = cashFlows.some((cf) => cf.value < 0)
    const hasPositive = cashFlows.some((cf) => cf.value > 0)
    if (!hasNegative || !hasPositive) {
      if (hasPositive && !hasNegative) return Number.POSITIVE_INFINITY
      if (!hasPositive && hasNegative) return -1
      return Number.NaN
    }

    let rateLow = -0.99999
    let rateHigh = 10
    let irr = guess
    const maxIterations = 100
    const tolerance = 0.00001

    let npvLow = computeNPV(rateLow, cashFlows)
    let npvHigh = computeNPV(rateHigh, cashFlows)

    if (isNaN(npvLow) || isNaN(npvHigh) || npvLow * npvHigh > 0) {
      const npvGuess = computeNPV(guess, cashFlows)
      if (!isNaN(npvGuess) && Math.abs(npvGuess) < tolerance * 10) return guess
      return Number.NaN
    }

    for (let i = 0; i < maxIterations; i++) {
      irr = (rateLow + rateHigh) / 2
      if (irr <= -1) {
        irr = -0.999999
      }
      const npv = computeNPV(irr, cashFlows)
      if (isNaN(npv)) {
        if (irr === rateLow) rateLow += tolerance
        else if (irr === rateHigh) rateHigh -= tolerance
        else return Number.NaN
        continue
      }
      if (Math.abs(npv) < tolerance) {
        return irr
      }
      if (npv * npvLow > 0) {
        rateLow = irr
        npvLow = npv
      } else {
        rateHigh = irr
        npvHigh = npv
      }
      if (Math.abs(rateHigh - rateLow) < tolerance / 100) {
        break
      }
    }

    const finalNpv = computeNPV(irr, cashFlows)
    if (isNaN(finalNpv) || Math.abs(finalNpv) > tolerance * 100) {
      return Number.NaN
    }
    return irr
  }

  // Función principal para calcular todo
  const calculate = () => {
    try {
      const r = interestRate / 100
      const infl = inflation / 100

      // Determinar si mostrar vista mensual
      const canShowMonthly = contributionFrequency === 12

      // Simular inversión
      let simData: SimulationData[] = []
      let monthlyData: SimulationData[] = []

      if (years <= 0) {
        simData = []
        monthlyData = []
      } else if (contributionFrequency === 12) {
        simData = simulateInvestmentMonthly(initialDeposit, contribution, years, r, contributionFrequency)
        monthlyData = simData
      } else {
        simData = simulateInvestmentAnnual(initialDeposit, contribution, years, r, contributionFrequency)
        monthlyData = simulateInvestmentMonthly(initialDeposit, contribution, years, r, contributionFrequency)
      }

      setAnnualSimData(simData)
      setMonthlySimData(monthlyData)

      // Si no podemos mostrar vista mensual, forzar a anual
      if (!canShowMonthly && tableView === "monthly") {
        setTableView("annual")
      }

      // Calcular resumen
      const saldoFinal = simData.length > 0 ? simData[simData.length - 1].balance || 0 : initialDeposit
      const totalContrib = contributionFrequency === 12 ? contribution * 12 * years : contribution * years

      // Calcular balance ajustado por inflación
      let balanceAjustado
      if (simData.length > 0) {
        if (contributionFrequency === 12) {
          const lastPeriod = simData[simData.length - 1].period
          balanceAjustado = infl > 0 && lastPeriod ? saldoFinal / Math.pow(1 + infl, lastPeriod / 12) : saldoFinal
        } else {
          balanceAjustado = infl > 0 && years > 0 ? saldoFinal / Math.pow(1 + infl, years) : saldoFinal
        }
      } else {
        balanceAjustado = initialDeposit
      }

      if (!isFinite(balanceAjustado)) balanceAjustado = 0

      const gananciaAjustada = balanceAjustado - initialDeposit - totalContrib
      const inflacionTotalEfecto = saldoFinal - balanceAjustado
      const totalInvertido = initialDeposit + totalContrib

      // Calcular rendimiento de inversión
      let rendimientoInversion = 0
      if (totalInvertido > 0) {
        rendimientoInversion = (gananciaAjustada / totalInvertido) * 100
      } else if (gananciaAjustada > 0) {
        rendimientoInversion = Number.POSITIVE_INFINITY
      }

      // Calcular flujos de efectivo para IRR
      const cashFlows: { time: number; value: number }[] = []
      if (initialDeposit > 0) {
        cashFlows.push({ time: 0, value: -initialDeposit })
      }

      if (simData.length > 0) {
        const finalBalance = simData[simData.length - 1].balance
        if (simData[0].hasOwnProperty("period")) {
          simData.forEach((item) => {
            if (item.contribution > 0) {
              cashFlows.push({ time: (item.period as number) / 12, value: -item.contribution })
            }
          })
          if (isFinite(finalBalance))
            cashFlows.push({ time: (simData[simData.length - 1].period as number) / 12, value: finalBalance })
        } else {
          simData.forEach((item) => {
            if (item.contribution > 0) {
              cashFlows.push({ time: item.year, value: -item.contribution })
            }
          })
          if (isFinite(finalBalance)) cashFlows.push({ time: simData[simData.length - 1].year, value: finalBalance })
        }
      } else if (cashFlows.length > 0 && isFinite(initialDeposit)) {
        cashFlows.push({ time: years > 0 ? years : 0.1, value: initialDeposit })
      }

      // Calcular IRR nominal y real
      let nominalIRR = Number.NaN
      if (cashFlows.length > 1 && cashFlows.some((cf) => cf.value < 0)) {
        try {
          nominalIRR = computeIRR(cashFlows)
        } catch (e) {
          nominalIRR = Number.NaN
        }
      }

      let realIRR = Number.NaN
      if (!isNaN(nominalIRR) && isFinite(nominalIRR)) {
        realIRR = infl > 0 ? (1 + nominalIRR) / (1 + infl) - 1 : nominalIRR
      }

      // Actualizar resumen
      setSummary({
        balanceNet: balanceAjustado,
        netGain: gananciaAjustada,
        totalContributions: totalContrib,
        initialDeposit: initialDeposit,
        inflationEffect: inflacionTotalEfecto,
        doubleTime: r > 0 && r < 1 ? (72 / (r * 100)).toFixed(1) + " años" : "--",
        annualizedReturn:
          !isNaN(realIRR) && isFinite(realIRR)
            ? (realIRR * 100).toFixed(2) + "%"
            : nominalIRR === Number.POSITIVE_INFINITY
              ? "∞%"
              : "--",
        totalReturn:
          totalInvertido > 0 || gananciaAjustada !== 0
            ? isFinite(rendimientoInversion)
              ? rendimientoInversion.toFixed(2) + "%"
              : "∞%"
            : "--",
      })

      // Preparar datos para gráficos
      prepareChartData(simData, monthlyData)
    } catch (error) {
      console.error("Error en la función calcular():", error)
    }
  }

  // Función para preparar datos de gráficos
  const prepareChartData = (simData: SimulationData[], monthlyData: SimulationData[]) => {
    try {
      // Preparar datos para gráfico de línea
      let annualDataForChart: SimulationData[] = []
      const currentYear = new Date().getFullYear()

      if (years > 0) {
        const sourceData = contributionFrequency === 1 ? simData : monthlyData
        if (sourceData.length > 0 && sourceData[0].hasOwnProperty("period")) {
          for (let y = 1; y <= years; y++) {
            const monthIndex = y * 12 - 1
            if (monthIndex < sourceData.length) {
              const entry = { ...sourceData[monthIndex] }
              if (!entry.hasOwnProperty("year")) {
                entry.year = Math.ceil((entry.period as number) / 12)
              }
              annualDataForChart.push(entry)
            }
          }
        } else if (sourceData.length > 0 && sourceData[0].hasOwnProperty("year")) {
          annualDataForChart = sourceData
        }
      }

      // Preparar datos para gráfico de línea
      const labels: string[] = []
      const lineData: number[] = []
      const capitalData: number[] = []
      const interestData: number[] = []

      const factorG1 = contributionFrequency === 12 ? 12 : 1
      let datosValidosG1 = true

      if (annualDataForChart && annualDataForChart.length > 0) {
        annualDataForChart.forEach((item) => {
          if (
            typeof item.year !== "number" ||
            isNaN(item.year) ||
            typeof item.balance !== "number" ||
            !isFinite(item.balance)
          ) {
            datosValidosG1 = false
            return
          }

          labels.push((currentYear + item.year - 1).toString())

          let bAjust = inflation > 0 ? item.balance / Math.pow(1 + inflation / 100, item.year) : item.balance
          if (!isFinite(bAjust)) {
            datosValidosG1 = false
            bAjust = 0
          }
          lineData.push(bAjust)

          let capAcum = initialDeposit + contribution * factorG1 * item.year
          if (!isFinite(capAcum)) {
            datosValidosG1 = false
            capAcum = 0
          }
          capitalData.push(capAcum)

          let intAcum = bAjust - capAcum
          if (!isFinite(intAcum)) {
            datosValidosG1 = false
            intAcum = 0
          }
          interestData.push(Math.max(0, intAcum))
        })
      } else {
        datosValidosG1 = false
      }

      if (datosValidosG1 && labels.length > 0) {
        setLineChartData({
          labels,
          lineData,
          capitalData,
          interestData,
        })
      } else {
        setLineChartData({
          labels: [],
          lineData: [],
          capitalData: [],
          interestData: [],
        })
      }

      // Preparar datos para gráfico de pastel
      const depositoVal = Math.max(0, isNaN(initialDeposit) ? 0 : initialDeposit)
      const totalContribVal = Math.max(0, isNaN(summary.totalContributions) ? 0 : summary.totalContributions)
      const totalGainVal = Math.max(0, isNaN(summary.netGain) ? 0 : summary.netGain)
      const inflacionTotalVal = Math.max(0, isNaN(summary.inflationEffect) ? 0 : summary.inflationEffect)

      const dataDoughnut = [depositoVal, totalContribVal, totalGainVal]
      const labelsDoughnut = ["Inversión inicial", "Contribuciones", "Ganancia"]
      const bgColors = ["#325832", "#2b613a", "#8FBC8F"]

      if (inflation > 0) {
        dataDoughnut.push(inflacionTotalVal)
        labelsDoughnut.push("Inflación")
        bgColors.push("#2d5335")
      }

      const filteredDataPie: number[] = []
      const filteredLabelsPie: string[] = []
      const filteredBgColorsPie: string[] = []

      dataDoughnut.forEach((value, index) => {
        if (value > 0.001) {
          filteredDataPie.push(value)
          filteredLabelsPie.push(labelsDoughnut[index])
          filteredBgColorsPie.push(bgColors[index])
        }
      })

      setPieChartData({
        data: filteredDataPie,
        labels: filteredLabelsPie,
        colors: filteredBgColorsPie,
      })
    } catch (error) {
      console.error("Error preparando datos de gráficos:", error)
    }
  }

  // Efecto para recalcular cuando cambian los inputs
  useEffect(() => {
    calculate()
  }, [initialDeposit, contribution, contributionFrequency, years, interestRate, inflation])

  return {
    // Inputs
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

    // Resultados
    summary,
    annualSimData,
    monthlySimData,
    tableView,
    setTableView,
    lineChartData,
    pieChartData,

    // Funciones
    formatCurrency,
    calculate,
  }
}
