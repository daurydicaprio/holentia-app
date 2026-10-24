"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { draftKey, simulationsKey, storageGet, storageSet, storageRemove } from "@/lib/storage"
import { formatDOP } from "@/lib/format"
import {
  annualFromMonthly,
  simulateInvestmentAnnual,
  simulateInvestmentMonthly,
  summarizeCompound,
} from "@/lib/calculations/compound"
import type { SimulationData, SummaryData } from "@/lib/calculations/compound"

export type { SimulationData, SummaryData }

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
  const formatCurrency = useCallback((value: number): string => formatDOP(value), [])

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

          // Del detalle mensual, el último mes de cada año.
          simData = annualFromMonthly(monthlyData, years)
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
      const nextSummary = summarizeCompound(simData, {
        initialDeposit,
        contribution,
        years,
        interestRate: r,
        inflation: infl,
        contributionFrequency,
      })
      setSummary(nextSummary)

      // Preparar datos para gráficos con los valores recién calculados
      // (no con el estado `summary`, que aún no se ha aplicado)
      prepareChartData(simData, monthlyData, nextSummary)
    } catch (error) {
      console.error("Error en la función calcular():", error)
    }
  }

  // Función para preparar datos de gráficos
  const prepareChartData = (
    simData: SimulationData[],
    monthlyData: SimulationData[],
    summaryActual: SummaryData,
  ) => {
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
      const totalContrib = summaryActual.totalContributions
      if (totalContrib > 0) {
        pieData.push(totalContrib)
        pieLabels.push("Contribuciones")
      }

      // Añadir ganancia si es mayor que cero
      const netGain = summaryActual.netGain
      if (netGain > 0) {
        pieData.push(netGain)
        pieLabels.push("Ganancia")
      }

      // Añadir inflación si es relevante
      const inflationEffect = summaryActual.inflationEffect
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
      const colorGanancias = "#66bb6a" // Verde claro (finanzas-light)
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
