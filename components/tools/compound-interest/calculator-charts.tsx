"use client"

import { useEffect, useRef } from "react"
import type { ChartData, PieChartData } from "@/hooks/use-compound-interest-calculator"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"
import Chart from "chart.js/auto"

interface CalculatorChartsProps {
  lineChartData: ChartData
  pieChartData: PieChartData
  formatCurrency: (value: number) => string
  showPieChart: boolean
}

export function CalculatorCharts({ lineChartData, pieChartData, formatCurrency, showPieChart }: CalculatorChartsProps) {
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const pieChartRef = useRef<HTMLCanvasElement>(null)
  const lineChartInstance = useRef<Chart | null>(null)
  const pieChartInstance = useRef<Chart | null>(null)
  const { resolvedTheme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Colores para los gráficos
  const chartColors = {
    line: "#388e3c",
    deposit: "#325832",
    contribution: "#2b613a",
    interest: "#8FBC8F",
    grid: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: resolvedTheme === "dark" ? "#e0e0e0" : "#1E3A2E",
  }

  // Crear/actualizar gráfico de línea
  useEffect(() => {
    if (!lineChartRef.current) return

    // Destruir gráfico existente si hay uno
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy()
    }

    // Verificar si hay datos para mostrar
    if (lineChartData.labels.length === 0) return

    const ctx = lineChartRef.current.getContext("2d")
    if (!ctx) return

    lineChartInstance.current = new Chart(ctx, {
      data: {
        labels: lineChartData.labels,
        datasets: [
          {
            type: "line",
            label: "Balance final ajustado",
            data: lineChartData.lineData,
            borderColor: chartColors.line,
            backgroundColor: "transparent",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: chartColors.line,
            order: 0,
          },
          {
            type: "bar",
            label: "Capital inicial",
            data: lineChartData.capitalData,
            backgroundColor: chartColors.deposit,
            stack: "stack1",
            order: 1,
          },
          {
            type: "bar",
            label: "Interés acumulado",
            data: lineChartData.interestData,
            backgroundColor: chartColors.interest,
            stack: "stack1",
            borderRadius: {
              topLeft: 10,
              topRight: 10,
              bottomLeft: 0,
              bottomRight: 0,
            },
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: {
              font: { weight: "bold" },
              color: chartColors.text,
            },
            title: { display: false },
          },
          y: {
            stacked: true,
            grid: {
              display: true,
              color: chartColors.grid,
            },
            ticks: {
              font: { weight: "bold" },
              color: chartColors.text,
            },
          },
        },
        interaction: { mode: "index", intersect: false },
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.dataset.label || ""}: ${formatCurrency(c.parsed.y)}`,
            },
          },
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              font: { size: 13, weight: "bold" },
              color: chartColors.text,
              padding: 15,
            },
          },
        },
      },
    })

    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy()
      }
    }
  }, [lineChartData, resolvedTheme])

  // Crear/actualizar gráfico de pastel
  useEffect(() => {
    if (!pieChartRef.current || !showPieChart) return

    // Destruir gráfico existente si hay uno
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy()
    }

    // Verificar si hay datos para mostrar
    if (pieChartData.data.length === 0) return

    const ctx = pieChartRef.current.getContext("2d")
    if (!ctx) return

    pieChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: pieChartData.labels,
        datasets: [
          {
            data: pieChartData.data,
            backgroundColor: pieChartData.colors,
            borderColor: resolvedTheme === "dark" ? "#1e1e1e" : "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "50%",
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.label || ""}: ${formatCurrency(c.raw as number)}`,
            },
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              font: { size: 12 },
              color: chartColors.text,
              padding: 15,
            },
          },
        },
      },
    })

    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
      }
    }
  }, [pieChartData, resolvedTheme, showPieChart])

  return (
    <div className="space-y-8">
      {/* Gráfico de línea */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-center text-finanzas-dark dark:text-finanzas-DEFAULT mb-6">
          Composición de la inversión
          <span className="block w-16 h-1 bg-finanzas-DEFAULT mx-auto mt-2"></span>
        </h2>
        <div className="h-[250px] sm:h-[300px]">
          <canvas ref={lineChartRef}></canvas>
        </div>
      </div>

      {/* Gráfico de pastel - solo mostrar en escritorio o si showPieChart es true */}
      {showPieChart && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-center text-finanzas-dark dark:text-finanzas-DEFAULT mb-6">
            Inversión total
            <span className="block w-16 h-1 bg-finanzas-DEFAULT mx-auto mt-2"></span>
          </h2>
          <div className="h-[300px] sm:h-[400px]">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  )
}
