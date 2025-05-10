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

// Añadir la interfaz para las simulaciones guardadas después de la interfaz PieChartData
export interface SavedSimulation {
  id: number
  name: string
  initialDeposit: number
  contribution: number
  contributionFrequency: number
  years: number
  interestRate: number
  inflation: number
  balanceNet: number
  netGain: number
  totalContributions: number
  totalReturn: string
}

export interface useCompoundInterestCalculatorResult {
  initialDeposit: number
  setInitialDeposit: (value: number) => void
  contribution: number
  setContribution: (value: number) => void
  contributionFrequency: number
  setContributionFrequency: (value: number) => void
  years: number
  setYears: (value: number) => void
  interestRate: number
  setInterestRate: (value: number) => void
  inflation: number
  setInflation: (value: number) => void
  summary: SummaryData
  annualSimData: SimulationData[]
  monthlySimData: SimulationData[]
  tableView: "annual" | "monthly"
  setTableView: (view: "annual" | "monthly") => void
  lineChartData: ChartData
  pieChartData: PieChartData
  formatCurrency: (value: number) => string
  calculate: () => void
  savedSimulations: SavedSimulation[]
  saveSimulation: () => { success: boolean; message?: string }
  removeSimulation: (id: number) => void
  updateSimulationName: (id: number, name: string) => void
}

export function useCompoundInterestCalculator(): useCompoundInterestCalculatorResult {
  // Inputs con valores iniciales en cero, excepto años (5) y frecuencia (mensual)
  const [initialDeposit, setInitialDeposit] = useState<number>(0)
  const [contribution, setContribution] = useState<number>(0)
  const [contributionFrequency, setContributionFrequency] = useState<number>(12) // 1: anual, 12: mensual
  const [years, setYears] = useState<number>(5)
  const [interestRate, setInterestRate] = useState<number>(0)
  const [inflation, setInflation] = useState<number>(0)

  // Estado para las simulaciones guardadas
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([])

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

  // Función para simular inversión mensual - CORREGIDA según el código original
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

      // Primero aplicamos el interés al balance actual (como en el código original)
      balance = startBalance * (1 + monthlyRate)

      // Luego añadimos la contribución mensual o anual según corresponda
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

  // Función para simular inversión anual - CORREGIDA según el código original
  const simulateInvestmentAnnual = (
    P: number,
    PMT: number,
    years: number,
    r: number,
    freqContrib: number,
  ): SimulationData[] => {
    // Aplicar el factor de corrección para aportes mensuales como en el código original
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

  // Corregir la función calculate para que calcule correctamente la inflación y la ganancia
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
      } else {
        // Usar la simulación mensual para ambos casos cuando la frecuencia es mensual
        if (contributionFrequency === 12) {
          monthlyData = simulateInvestmentMonthly(initialDeposit, contribution, years, r, contributionFrequency)

          // Filtrar datos mensuales para obtener solo los datos anuales (último mes de cada año)
          const annualData: SimulationData[] = []
          for (let y = 1; y <= years; y++) {
            const monthsOfYear = monthlyData.filter((item) => item.year === y)
            if (monthsOfYear.length > 0) {
              annualData.push(monthsOfYear[monthsOfYear.length - 1])
            }
          }
          simData = annualData
        } else {
          simData = simulateInvestmentAnnual(initialDeposit, contribution, years, r, contributionFrequency)
          monthlyData = simulateInvestmentMonthly(initialDeposit, contribution, years, r, contributionFrequency)
        }
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

      // Calcular balance ajustado por inflación - CORREGIDO según el código original
      let balanceAjustado = saldoFinal
      if (simData.length > 0) {
        if (contributionFrequency === 12) {
          const lastPeriod = simData[simData.length - 1].period || 0
          balanceAjustado = infl > 0 && lastPeriod > 0 ? saldoFinal / Math.pow(1 + infl, lastPeriod / 12) : saldoFinal
        } else {
          balanceAjustado = infl > 0 && years > 0 ? saldoFinal / Math.pow(1 + infl, years) : saldoFinal
        }
      } else {
        balanceAjustado = initialDeposit
      }

      if (!isFinite(balanceAjustado)) balanceAjustado = 0

      // Calcular ganancia ajustada y efecto de inflación - CORREGIDO según el código original
      const totalInvertido = initialDeposit + totalContrib
      const gananciaAjustada = balanceAjustado - initialDeposit - totalContrib
      const inflacionTotalEfecto = saldoFinal - balanceAjustado

      // Calcular rendimiento de inversión
      let rendimientoInversion = 0
      if (totalInvertido > 0) {
        rendimientoInversion = (gananciaAjustada / totalInvertido) * 100
      } else if (gananciaAjustada > 0) {
        rendimientoInversion = Number.POSITIVE_INFINITY
      }

      // Actualizar resumen
      setSummary({
        balanceNet: balanceAjustado,
        netGain: Math.max(0, gananciaAjustada),
        totalContributions: totalContrib,
        initialDeposit: initialDeposit,
        inflationEffect: Math.max(0, inflacionTotalEfecto),
        doubleTime: r > 0 && r < 1 ? (72 / (r * 100)).toFixed(1) + " años" : "--",
        annualizedReturn: (r * 100).toFixed(2) + "%",
        totalReturn: isFinite(rendimientoInversion) ? rendimientoInversion.toFixed(2) + "%" : "∞%",
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
        // Usar los datos anuales directamente
        annualDataForChart = [...simData]
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

          // Calcular balance ajustado por inflación
          let bAjust = item.balance
          if (inflation > 0) {
            bAjust = item.balance / Math.pow(1 + inflation / 100, item.year)
          }

          if (!isFinite(bAjust)) {
            datosValidosG1 = false
            bAjust = 0
          }
          lineData.push(bAjust)

          // Calcular capital acumulado (depósito inicial + contribuciones)
          let capAcum = initialDeposit + contribution * factorG1 * item.year
          if (!isFinite(capAcum)) {
            datosValidosG1 = false
            capAcum = 0
          }
          capitalData.push(capAcum)

          // Calcular interés acumulado (balance ajustado - capital acumulado)
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

      // Definir colores específicos para cada categoría
      const colorInicial = "#2e7d32" // Verde oscuro
      const colorContribuciones = "#1b5e20" // Verde más oscuro
      const colorGanancias = "#81c784" // Verde claro
      const colorInflacion = "#c8e6c9" // Verde muy claro

      // Crear arrays para los datos del gráfico de pastel
      const dataDoughnut: number[] = []
      const labelsDoughnut: string[] = []
      const bgColors: string[] = []

      // Añadir depósito inicial si es mayor que cero
      if (depositoVal > 0) {
        dataDoughnut.push(depositoVal)
        labelsDoughnut.push("Inversión inicial")
        bgColors.push(colorInicial)
      }

      // Añadir contribuciones si son mayores que cero
      if (totalContribVal > 0) {
        dataDoughnut.push(totalContribVal)
        labelsDoughnut.push("Contribuciones")
        bgColors.push(colorContribuciones)
      }

      // Añadir ganancia si es mayor que cero
      if (totalGainVal > 0) {
        dataDoughnut.push(totalGainVal)
        labelsDoughnut.push("Ganancia")
        bgColors.push(colorGanancias)
      }

      // Añadir inflación si es relevante
      if (inflation > 0 && inflacionTotalVal > 0) {
        dataDoughnut.push(inflacionTotalVal)
        labelsDoughnut.push("Inflación")
        bgColors.push(colorInflacion)
      }

      // Actualizar el estado con los datos del gráfico de pastel
      setPieChartData({
        data: dataDoughnut,
        labels: labelsDoughnut,
        colors: bgColors,
      })

      console.log("Datos del gráfico de pastel:", {
        data: dataDoughnut,
        labels: labelsDoughnut,
        colors: bgColors,
      })
    } catch (error) {
      console.error("Error preparando datos de gráficos:", error)
    }
  }

  // Función para guardar una simulación
  const saveSimulation = () => {
    if (savedSimulations.length >= 3) {
      return { success: false, message: "Ya has guardado el máximo de 3 simulaciones." }
    }

    if (initialDeposit <= 0 && contribution <= 0) {
      return {
        success: false,
        message: "Por favor, ingresa al menos un valor para depósito inicial o aportación periódica.",
      }
    }

    // Crear objeto con los datos de la simulación
    const simulation: SavedSimulation = {
      id: Date.now(),
      name: `Opción ${savedSimulations.length + 1}`,
      initialDeposit,
      contribution,
      contributionFrequency,
      years,
      interestRate,
      inflation,
      balanceNet: summary.balanceNet,
      netGain: summary.netGain,
      totalContributions: summary.totalContributions,
      totalReturn: summary.totalReturn,
    }

    // Agregar la simulación al arreglo
    setSavedSimulations([...savedSimulations, simulation])

    return { success: true }
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

    // Simulaciones guardadas
    savedSimulations,
    saveSimulation,
    removeSimulation,
    updateSimulationName,
  }
}
