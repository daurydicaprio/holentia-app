"use client"

import { useEffect, useRef, useState } from "react"
import type { ChartData, PieChartData } from "@/hooks/use-compound-interest-calculator"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"
import Chart from "chart.js/auto"
import { motion } from "framer-motion"
import { Info } from "lucide-react"

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
    line: resolvedTheme === "dark" ? "#4caf50" : "#2e7d32", // Más brillante en modo oscuro
    deposit: resolvedTheme === "dark" ? "#388e3c" : "#2e7d32",
    contribution: resolvedTheme === "dark" ? "#1b5e20" : "#1b5e20",
    interest: resolvedTheme === "dark" ? "#a5d6a7" : "#81c784",
    grid: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)", // Más visible en modo oscuro
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
    if (!lineChartData || lineChartData.labels.length === 0) return

    const ctx = lineChartRef.current.getContext("2d")
    if (!ctx) return

    // Registrar plugin personalizado para animación
    Chart.register({
      id: "customAnimation",
      beforeDraw: (chart) => {
        const ctx = chart.ctx
        ctx.save()
        ctx.globalCompositeOperation = "destination-over"
        ctx.fillStyle = resolvedTheme === "dark" ? "rgba(30, 30, 30, 0.1)" : "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(0, 0, chart.width, chart.height)
        ctx.restore()
      },
    })

    lineChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: lineChartData.labels,
        datasets: [
          {
            type: "line",
            label: "Balance final ajustado",
            data: lineChartData.lineData,
            borderColor: chartColors.line,
            backgroundColor: "transparent",
            borderWidth: 3,
            fill: false,
            tension: 0.2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: chartColors.line,
            pointBorderColor: resolvedTheme === "dark" ? "#121212" : "#ffffff",
            pointBorderWidth: 2,
            order: 0,
            yAxisID: "y",
            // Añadir sombra a la línea para mejor visibilidad
            borderShadowColor: resolvedTheme === "dark" ? "rgba(76, 175, 80, 0.5)" : "rgba(46, 125, 50, 0.3)",
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowBlur: 6,
          },
          {
            type: "bar",
            label: "Capital inicial",
            data: lineChartData.capitalData,
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
            data: lineChartData.interestData,
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
              drawBorder: true,
              color: chartColors.grid,
            },
            ticks: {
              font: { weight: "bold", size: 11 },
              color: chartColors.text,
              maxRotation: 45,
              minRotation: 45,
            },
            title: {
              display: true,
              text: "Año",
              color: chartColors.text,
              font: { weight: "bold", size: 12 },
              padding: { top: 10 },
            },
          },
          y: {
            stacked: true,
            grid: {
              display: true,
              color: chartColors.grid,
              drawBorder: true,
            },
            ticks: {
              font: { weight: "bold", size: 11 },
              color: chartColors.text,
              callback: (value) => formatCurrency(value as number).replace(".00", ""),
            },
            title: {
              display: true,
              text: "Valor en pesos",
              color: chartColors.text,
              font: { weight: "bold", size: 12 },
              padding: { bottom: 10 },
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
                const capitalValue = lineChartData.capitalData[index]
                const interestValue = lineChartData.interestData[index]
                const totalValue = capitalValue + interestValue
                const lineValue = lineChartData.lineData[index]

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
              boxWidth: 15,
              boxHeight: 15,
              padding: 20,
              font: { size: 12, weight: "bold" },
              color: chartColors.text,
            },
          },
          title: {
            display: true,
            text: "Composición de la inversión",
            color: chartColors.line,
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 30,
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
  }, [lineChartData, resolvedTheme, formatCurrency])

  // Crear/actualizar gráfico de pastel
  useEffect(() => {
    if (!pieChartRef.current || !showPieChart) return

    // Destruir gráfico existente si hay uno
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy()
    }

    // Verificar si hay datos para mostrar
    if (!pieChartData || pieChartData.data.length === 0) return

    const ctx = pieChartRef.current.getContext("2d")
    if (!ctx) return

    pieChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: pieChartData.labels,
        datasets: [
          {
            data: pieChartData.data,
            backgroundColor: donutColors,
            borderColor: resolvedTheme === "dark" ? "#1e1e1e" : "#ffffff",
            borderWidth: 2,
            hoverBackgroundColor: donutColors.map((color) => {
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
          padding: 20,
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
                const percentage = (((c.raw as number) / pieChartData.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
                return `${value} (${percentage}%)`
              },
            },
          },
          legend: {
            display: true,
            position: "right",
            align: "center",
            labels: {
              font: { size: 12, weight: "bold" },
              color: chartColors.text,
              padding: 20,
              usePointStyle: true,
              generateLabels: (chart) => {
                const data = chart.data
                if (data.labels && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const dataset = data.datasets[0]
                    const value = dataset.data[i] as number
                    const total = dataset.data.reduce((acc, val) => acc + (val as number), 0)
                    const percentage = ((value / total) * 100).toFixed(1)

                    return {
                      text: `${label}: ${percentage}%`,
                      fillStyle: donutColors[i],
                      strokeStyle: donutColors[i],
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
            display: true,
            text: "Distribución de la inversión",
            color: chartColors.line,
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 30,
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#388e3c] w-full text-center">
            Composición de la inversión
            <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
          </h2>

          <div className="relative">
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              onMouseEnter={() => setActiveTooltip("line")}
              onMouseLeave={() => setActiveTooltip(null)}
              aria-label="Información sobre el gráfico de línea"
            >
              <Info size={18} />
            </button>

            {activeTooltip === "line" && (
              <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                {chartTooltips.line}
              </div>
            )}
          </div>
        </div>

        <div className="h-[300px] sm:h-[400px]">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#388e3c] w-full text-center">
              Distribución de la inversión
              <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
            </h2>

            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onMouseEnter={() => setActiveTooltip("pie")}
                onMouseLeave={() => setActiveTooltip(null)}
                aria-label="Información sobre el gráfico de distribución"
              >
                <Info size={18} />
              </button>

              {activeTooltip === "pie" && (
                <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
                  {chartTooltips.pie}
                </div>
              )}
            </div>
          </div>

          <div className="h-[300px] sm:h-[400px]">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </motion.div>
      )}
    </div>
  )
}
