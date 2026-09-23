"use client"

import { useState, useEffect, useRef } from "react"
import { draftKey, simulationsKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

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
  clearCompoundData: () => void
}

const COMPOUND_DRAFT_KEY = draftKey("calculadora-interes-compuesto")
const COMPOUND_SIMS_KEY = simulationsKey("calculadora-interes-compuesto")

interface CompoundDraft {
  initialDeposit?: number
  contribution?: number
  contributionFrequency?: number
  years?: number
  interestRate?: number
  inflation?: number
}

export function useCompoundInterestCalculator(): useCompoundInterestCalculatorResult {
  // Inputs con valores iniciales en cero, excepto años (5) y frecuencia (mensual)
  const [initialDeposit, setInitialDeposit] = useState<number>(0)
  const [contribution, setContribution] = useState<number>(0)
  const [contributionFrequency, setContributionFrequency] = useState<number>(12) // 1: anual, 12: mensual
  const [years, setYears] = useState<number>(5)
  const [interestRate, setInterestRate] = useState<number>(0)
  const [inflation, setInflation] = useState<number>(0)

  // Estado para las simulaciones guardadas (Tipo S, máx 3, persistentes)
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restored = useRef(false)

  // Restaurar borrador + simulaciones solo en cliente (evita hydration mismatch)
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    const draft = storageGet<CompoundDraft>(COMPOUND_DRAFT_KEY, {})
    if (draft.initialDeposit !== undefined) setInitialDeposit(draft.initialDeposit)
    if (draft.contribution !== undefined) setContribution(draft.contribution)
    if (draft.contributionFrequency !== undefined) setContributionFrequency(draft.contributionFrequency)
    if (draft.years !== undefined) setYears(draft.years)
    if (draft.interestRate !== undefined) setInterestRate(draft.interestRate)
    if (draft.inflation !== undefined) setInflation(draft.inflation)
    setSavedSimulations(storageGet<SavedSimulation[]>(COMPOUND_SIMS_KEY, []))
  }, [])

  // Autoguardado del borrador (Tipo D) con debounce 500ms
  // (se salta el primer render para no pisar lo restaurado)
  const firstDraftSave = useRef(true)
  useEffect(() => {
    if (firstDraftSave.current) {
      firstDraftSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      storageSet(COMPOUND_DRAFT_KEY, {
        initialDeposit,
        contribution,
        contributionFrequency,
        years,
        interestRate,
        inflation,
      })
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [initialDeposit, contribution, contributionFrequency, years, interestRate, inflation])

  // Persistir simulaciones (Tipo S) en cada cambio
  const firstSimsSave = useRef(true)
  useEffect(() => {
    if (firstSimsSave.current) {
      firstSimsSave.current = false
      return
    }
    storageSet(COMPOUND_SIMS_KEY, savedSimulations)
  }, [savedSimulations])

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

      // Preparar datos para gráfico de pastel - SIMPLIFICADO para mayor claridad
      const pieData = []
      const pieLabels = []

      // Añadir inversión inicial si es mayor que cero
      if (initialDeposit > 0) {
        pieData.push(initialDeposit)
        pieLabels.push("Inversión inicial")
      }

      // Añadir contribuciones si son mayores que cero
      const totalContrib = summary.totalContributions
      if (totalContrib > 0) {
        pieData.push(totalContrib)
        pieLabels.push("Contribuciones")
      }

      // Añadir ganancia si es mayor que cero
      const netGain = summary.netGain
      if (netGain > 0) {
        pieData.push(netGain)
        pieLabels.push("Ganancia")
      }

      // Añadir inflación si es relevante
      const inflationEffect = summary.inflationEffect
      if (inflation > 0 && inflationEffect > 0) {
        pieData.push(inflationEffect)
        pieLabels.push("Inflación")
      }

      // Si no hay datos pero hay contribuciones o inflación, mostrar datos estimados
      if (pieData.length === 0 && (contribution > 0 || inflation > 0)) {
        // Si hay contribuciones, mostrarlas
        if (contribution > 0) {
          const estimatedContrib = contribution * (contributionFrequency === 12 ? 12 : 1) * years
          pieData.push(estimatedContrib)
          pieLabels.push("Contribuciones estimadas")
        }

        // Si hay inflación, mostrar un valor estimado
        if (inflation > 0) {
          // Valor estimado para mostrar el efecto de la inflación
          const estimatedInflation =
            contribution > 0
              ? contribution * (contributionFrequency === 12 ? 12 : 1) * years * (inflation / 100)
              : 1000 * (inflation / 100)

          if (estimatedInflation > 0) {
            pieData.push(estimatedInflation)
            pieLabels.push("Inflación estimada")
          }
        }
      }

      // Definir colores específicos para cada categoría
      const colorInicial = "#2e7d32" // Verde oscuro
      const colorContribuciones = "#1b5e20" // Verde más oscuro
      const colorGanancias = "#81c784" // Verde claro
      const colorInflacion = "#c8e6c9" // Verde muy claro

      // Asignar colores según las etiquetas
      const pieColors = pieLabels.map((label) => {
        if (label.includes("inicial")) return colorInicial
        if (label.includes("Contribuciones")) return colorContribuciones
        if (label.includes("Ganancia")) return colorGanancias
        if (label.includes("Inflación")) return colorInflacion
        return colorContribuciones // Color por defecto
      })

      // Actualizar el estado con los datos del gráfico de pastel
      setPieChartData({
        data: pieData,
        labels: pieLabels,
        colors: pieColors,
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

  // Borra borrador + simulaciones y restaura valores iniciales
  const clearCompoundData = () => {
    storageRemove(COMPOUND_DRAFT_KEY)
    storageRemove(COMPOUND_SIMS_KEY)
    setSavedSimulations([])
    setInitialDeposit(0)
    setContribution(0)
    setContributionFrequency(12)
    setYears(5)
    setInterestRate(0)
    setInflation(0)
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
    clearCompoundData,
  }
}
