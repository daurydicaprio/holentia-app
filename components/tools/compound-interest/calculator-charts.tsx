"use client"

import { useEffect, useRef, useState } from "react"
import type { ChartData, PieChartData } from "@/hooks/use-compound-interest-calculator"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"
import Chart from "chart.js/auto"
import { motion } from "framer-motion"

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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  // Colores para los gráficos - Mejorados para mejor contraste
  const chartColors = {
    line: resolvedTheme === "dark" ? "#81c784" : "#66bb6a", // Verde más claro para la línea
    deposit: resolvedTheme === "dark" ? "#388e3c" : "#2e7d32",
    contribution: resolvedTheme === "dark" ? "#1b5e20" : "#1b5e20",
    interest: resolvedTheme === "dark" ? "#a5d6a7" : "#81c784",
    grid: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
    text: resolvedTheme === "dark" ? "#e0e0e0" : "#1E3A2E",
    tooltipBg: resolvedTheme === "dark" ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)",
    tooltipBorder: resolvedTheme === "dark" ? "#4caf50" : "#2e7d32",
  }

  // Colores más distinguibles para el gráfico de donut
  const donutColors =
    resolvedTheme === "dark"
      ? ["#388e3c", "#1b5e20", "#a5d6a7", "#e8f5e9"]
      : ["#2e7d32", "#1b5e20", "#81c784", "#c8e6c9"]

  // Crear/actualizar gráfico de línea
  useEffect(() => {
    if (!lineChartRef.current) return

    // Destruir gráfico existente si hay uno
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy()
    }

    // Verificar si hay datos para mostrar
    if (!lineChartData || !lineChartData.labels || lineChartData.labels.length === 0) return

    const ctx = lineChartRef.current.getContext("2d")
    if (!ctx) return

    lineChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: lineChartData.labels,
        datasets: [
          {
            type: "line",
            label: "Balance final ajustado",
            data: lineChartData.lineData || [],
            borderColor: chartColors.line,
            backgroundColor: "transparent",
            borderWidth: 3,
            fill: false,
            tension: 0.2,
            pointRadius: 6, // Puntos más grandes
            pointHoverRadius: 8,
            pointBackgroundColor: chartColors.line,
            pointBorderColor: resolvedTheme === "dark" ? "#121212" : "#ffffff",
            pointBorderWidth: 2,
            order: 0,
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "Capital inicial",
            data: lineChartData.capitalData || [],
            backgroundColor: chartColors.deposit,
            stack: "stack1",
            order: 1,
            yAxisID: "y",
            borderRadius: 4,
            hoverBackgroundColor: resolvedTheme === "dark" ? "#4caf50" : "#388e3c",
          },
          {
            type: "bar",
            label: "Interés acumulado",
            data: lineChartData.interestData || [],
            backgroundColor: chartColors.interest,
            stack: "stack1",
            order: 2,
            yAxisID: "y",
            borderRadius: 4,
            hoverBackgroundColor: resolvedTheme === "dark" ? "#c8e6c9" : "#a5d6a7",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              font: { weight: "bold", size: 11 },
              color: chartColors.text,
              maxRotation: 0, // Sin inclinación
              minRotation: 0, // Sin inclinación
            },
            title: {
              display: false, // Ocultar título del eje X
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false, // Quitar líneas de fondo
              drawBorder: false,
            },
            ticks: {
              font: { weight: "bold", size: 11 },
              color: chartColors.text,
              callback: (value) => formatCurrency(value as number).replace(".00", ""),
            },
            title: {
              display: false, // Ocultar título del eje Y
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          tooltip: {
            backgroundColor: chartColors.tooltipBg,
            titleColor: chartColors.text,
            bodyColor: chartColors.text,
            borderColor: chartColors.tooltipBorder,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 10,
            boxHeight: 10,
            boxPadding: 3,
            usePointStyle: true,
            callbacks: {
              title: (items) => `Año: ${items[0].label}`,
              label: (c) => {
                const label = c.dataset.label || ""
                const value = formatCurrency(c.parsed.y)
                return `${label}: ${value}`
              },
              footer: (items) => {
                const item = items[0]
                const index = item.dataIndex
                const capitalValue = lineChartData.capitalData?.[index] || 0
                const interestValue = lineChartData.interestData?.[index] || 0
                const totalValue = capitalValue + interestValue
                const lineValue = lineChartData.lineData?.[index] || 0

                return [
                  `Total acumulado: ${formatCurrency(totalValue)}`,
                  `Ajustado por inflación: ${formatCurrency(lineValue)}`,
                ]
              },
            },
          },
          legend: {
            display: true,
            position: "top",
            align: "center",
            labels: {
              usePointStyle: true,
              pointStyle: (context) => {
                // Usar línea para el dataset de balance final ajustado
                const datasetIndex = context.datasetIndex
                if (datasetIndex === 0) {
                  return "line"
                }
                return "rect"
              },
              boxWidth: 40, // Ancho más grande para la línea
              boxHeight: 3, // Altura más pequeña para la línea
              padding: 20, // Más espacio alrededor de la leyenda
              font: { size: 12, weight: "bold" },
              color: chartColors.text,
            },
          },
          title: {
            display: false, // Ocultar título dentro del gráfico
          },
        },
      },
    })

    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy()
      }
    }
  }, [lineChartData, resolvedTheme, formatCurrency])

  // Crear/actualizar gráfico de pastel
  useEffect(() => {
    if (!pieChartRef.current || !showPieChart) return

    // Destruir gráfico existente si hay uno
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy()
    }

    // Verificar si hay datos para mostrar
    if (!pieChartData || !pieChartData.data || pieChartData.data.length === 0) return

    const ctx = pieChartRef.current.getContext("2d")
    if (!ctx) return

    pieChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: pieChartData.labels || [],
        datasets: [
          {
            data: pieChartData.data || [],
            backgroundColor: donutColors.slice(0, pieChartData.data.length),
            borderColor: resolvedTheme === "dark" ? "#1e1e1e" : "#ffffff",
            borderWidth: 2,
            hoverBackgroundColor: donutColors.slice(0, pieChartData.data.length).map((color) => {
              // Hacer el color un poco más brillante en hover
              return color.replace(/\d+(?=\))/, (match) => {
                const value = Number.parseInt(match)
                return Math.min(value + 10, 255).toString()
              })
            }),
            hoverBorderWidth: 3,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: "easeOutQuart",
        },
        layout: {
          padding: 10, // Reducir el padding para que esté más pegado
        },
        plugins: {
          tooltip: {
            backgroundColor: chartColors.tooltipBg,
            titleColor: chartColors.text,
            bodyColor: chartColors.text,
            borderColor: chartColors.tooltipBorder,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 10,
            boxHeight: 10,
            boxPadding: 3,
            usePointStyle: true,
            callbacks: {
              title: (items) => items[0].label || "",
              label: (c) => {
                const value = formatCurrency(c.raw as number)
                const total = pieChartData.data.reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? (((c.raw as number) / total) * 100).toFixed(1) : "0.0"
                return `${value} (${percentage}%)`
              },
            },
          },
          legend: {
            display: true,
            position: "left", // Mantener a la izquierda
            align: "center",
            labels: {
              font: { size: 14, weight: "bold" }, // Aumentar tamaño de fuente
              color: chartColors.text,
              padding: 25, // Aumentar padding para mayor separación
              usePointStyle: true,
              boxWidth: 16, // Aumentar tamaño de los símbolos
              boxHeight: 16, // Aumentar tamaño de los símbolos
              generateLabels: (chart) => {
                const data = chart.data
                if (data.labels && data.datasets.length && data.datasets[0].data) {
                  return data.labels.map((label, i) => {
                    const dataset = data.datasets[0]
                    const value = (dataset.data[i] as number) || 0
                    const total = dataset.data.reduce((acc, val) => acc + ((val as number) || 0), 0)
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"

                    return {
                      text: `${label}: ${percentage}%`,
                      fillStyle: donutColors[i % donutColors.length],
                      strokeStyle: donutColors[i % donutColors.length],
                      lineWidth: 0,
                      hidden: false,
                      index: i,
                    }
                  })
                }
                return []
              },
            },
          },
          title: {
            display: false, // Ocultar título dentro del gráfico
          },
        },
      },
    })

    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
      }
    }
  }, [pieChartData, resolvedTheme, showPieChart, formatCurrency])

  // Tooltips informativos para los gráficos
  const chartTooltips = {
    line: "Este gráfico muestra cómo crece tu inversión a lo largo del tiempo. Las barras representan el capital inicial y los intereses acumulados, mientras que la línea muestra el balance ajustado por inflación.",
    pie: "Este gráfico muestra la distribución de tu inversión entre capital inicial, aportaciones e intereses generados. También muestra el impacto de la inflación si está configurada.",
  }

  // Asegurar que los bordes de los gráficos sean visibles
  return (
    <div className="space-y-8">
      {/* Gráfico de línea */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-[#388e3c] w-full text-center mb-6">
          Composición de la inversión
          <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
        </h2>

        <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
          <canvas ref={lineChartRef}></canvas>
        </div>
      </motion.div>

      {/* Gráfico de pastel - solo mostrar en escritorio o si showPieChart es true */}
      {showPieChart && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-[#388e3c] w-full text-center mb-6">
            Distribución de la inversión
            <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
          </h2>

          <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </motion.div>
      )}
    </div>
  )
}
