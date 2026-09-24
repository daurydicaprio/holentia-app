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
          duration: isMobile ? 600 : 2000,
          easing: "easeOutQuart",
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
            border: {
              display: false,
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
            },
            border: {
              display: false,
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
                const value = formatCurrency(c.parsed.y ?? 0)
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
              pointStyle: "circle",
              boxWidth: 10,
              boxHeight: 10,
              padding: 20,
              font: { size: 14, weight: "bold" }, // Tamaño de fuente aumentado
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
  }, [lineChartData, resolvedTheme, formatCurrency, isMobile])

  // Crear/actualizar gráfico de pastel - Implementación completamente nueva
  useEffect(() => {
    // Solo ejecutar si el gráfico debe mostrarse y el canvas existe
    if (!pieChartRef.current || !showPieChart) return

    // Destruir gráfico existente si hay uno
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy()
      pieChartInstance.current = null
    }

    // Verificar si hay datos para mostrar
    if (!pieChartData || !pieChartData.data || pieChartData.data.length === 0) {
      return
    }

    // Obtener el contexto del canvas
    const ctx = pieChartRef.current.getContext("2d")
    if (!ctx) return

    // Definir colores específicos para el modo oscuro y claro
    const getColors = () => {
      if (resolvedTheme === "dark") {
        return [
          "#4caf50", // Verde para inversión inicial
          "#2e7d32", // Verde oscuro para contribuciones
          "#a5d6a7", // Verde claro para ganancias
          "#e8f5e9", // Verde muy claro para inflación
        ]
      } else {
        return [
          "#2e7d32", // Verde oscuro para inversión inicial
          "#1b5e20", // Verde más oscuro para contribuciones
          "#81c784", // Verde claro para ganancias
          "#c8e6c9", // Verde muy claro para inflación
        ]
      }
    }

    // Asignar colores según las etiquetas
    const getColorForLabel = (label: string) => {
      const colors = getColors()
      if (label.includes("inicial")) return colors[0]
      if (label.includes("Contribuciones")) return colors[1]
      if (label.includes("Ganancia")) return colors[2]
      if (label.includes("Inflación")) return colors[3]
      return colors[0] // Color por defecto
    }

    // Asignar colores basados en las etiquetas si no se proporcionaron
    const backgroundColors =
      pieChartData.colors && pieChartData.colors.length > 0
        ? pieChartData.colors
        : pieChartData.labels.map(getColorForLabel)

    // Crear el gráfico de pastel
    try {
      pieChartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: pieChartData.labels,
          datasets: [
            {
              data: pieChartData.data,
              backgroundColor: backgroundColors,
              borderColor: resolvedTheme === "dark" ? "#2d2d2d" : "#ffffff",
              borderWidth: 2,
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
            duration: isMobile ? 600 : 2000,
            easing: "easeOutQuart",
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
              position: "left",
              align: "center",
              labels: {
                font: { size: 13, weight: "bold" },
                color: chartColors.text,
                padding: 25,
                usePointStyle: true,
                generateLabels: (chart) => {
                  const data = chart.data
                  if (data.labels && data.datasets.length && data.datasets[0].data) {
                    return data.labels.map((label, i) => {
                      const dataset = data.datasets[0]
                      const value = (dataset.data[i] as number) || 0
                      const total = dataset.data.reduce<number>(
                        (acc, val) => acc + ((val as number) || 0),
                        0,
                      )
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"

                      return {
                        text: `${label}: ${percentage}% (${formatCurrency(value)})`, // Añadir valor monetario
                        fillStyle: backgroundColors[i],
                        strokeStyle: backgroundColors[i],
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
          },
        },
      })
    } catch (error) {
      console.error("Error al crear el gráfico de pastel:", error)
    }

    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
        pieChartInstance.current = null
      }
    }
  }, [pieChartData, resolvedTheme, showPieChart, formatCurrency, isMobile])

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
