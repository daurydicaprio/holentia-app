"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { CompoundInterestResult } from "@/hooks/use-compound-interest-calculator"

Chart.register(...registerables)

interface CalculatorChartsProps {
  results: CompoundInterestResult
}

export const CalculatorCharts: React.FC<CalculatorChartsProps> = ({ results }) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Prepare data for the chart
    const labels = Array.from({ length: results.years + 1 }, (_, i) => i)

    // Create datasets
    const totalContributionsData = [0]
    const totalInterestData = [0]

    for (let i = 1; i <= results.years; i++) {
      const yearData = results.yearlyData[i - 1]
      totalContributionsData.push(yearData.totalContributions)
      totalInterestData.push(yearData.totalInterest)
    }

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Aportaciones",
            data: totalContributionsData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            borderRadius: 8, // Add border radius to bars
            borderSkipped: false, // Don't skip any borders (to make all corners rounded)
          },
          {
            label: "Intereses",
            data: totalInterestData,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
            borderRadius: 8, // Add border radius to bars
            borderSkipped: false, // Don't skip any borders (to make all corners rounded)
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                family: "var(--font-sans)",
              },
              color: "#666",
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleFont: {
              family: "var(--font-sans)",
            },
            bodyFont: {
              family: "var(--font-sans)",
            },
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(context.parsed.y)
                }
                return label
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: "Años",
              font: {
                family: "var(--font-sans)",
                size: 14,
              },
              color: "#666",
            },
            ticks: {
              font: {
                family: "var(--font-sans)",
              },
              color: "#666",
            },
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Valor (€)",
              font: {
                family: "var(--font-sans)",
                size: 14,
              },
              color: "#666",
            },
            ticks: {
              font: {
                family: "var(--font-sans)",
              },
              color: "#666",
              callback: (value) =>
                new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value as number),
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [results])

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-md">
      <canvas ref={chartRef} />
    </div>
  )
}
