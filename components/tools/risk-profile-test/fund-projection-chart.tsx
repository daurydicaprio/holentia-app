"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"

function formatMoney(value: number, currency: "USD" | "DOP"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(value)
}

interface FundProjectionChartProps {
  start: number
  monthly: number
  target: number
  months: number
  currency: "USD" | "DOP"
}

/** Línea del colchón mes a mes con la meta (2×) como referencia punteada. */
export function FundProjectionChart({ start, monthly, target, months, currency }: FundProjectionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const { resolvedTheme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const last = Math.min(Math.max(Math.round(months), 1), 72)
    const labels: string[] = []
    const values: number[] = []
    for (let m = 0; m <= last; m++) {
      labels.push(String(m))
      values.push(Math.round(start + monthly * m))
    }
    const targetLine = labels.map(() => target)

    const isDark = resolvedTheme === "dark"
    try {
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Tu colchón",
              data: values,
              borderColor: "#388e3c",
              backgroundColor: "rgba(56, 142, 60, 0.15)",
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHitRadius: 8,
              borderWidth: 2.5,
            },
            {
              label: "Meta (2× sueldo)",
              data: targetLine,
              borderColor: "#9ca3af",
              borderDash: [6, 5],
              borderWidth: 1.5,
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: isMobile ? 400 : 800 },
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                boxWidth: 8,
                boxHeight: 8,
                font: { size: 10 },
                usePointStyle: true,
                padding: 12,
                color: isDark ? "#9ca3af" : "#6b7280",
              },
            },
            tooltip: {
              callbacks: {
                title: (items) => (items.length > 0 ? `Mes ${items[0].label}` : ""),
                label: (c) => `${c.dataset.label}: ${formatMoney(c.parsed.y ?? 0, currency)}`,
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: "Meses", font: { size: 10 }, color: isDark ? "#9ca3af" : "#6b7280" },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 9,
                font: { size: 10 },
                color: isDark ? "#9ca3af" : "#6b7280",
              },
              grid: { display: false },
            },
            y: {
              ticks: {
                font: { size: 10 },
                maxTicksLimit: 5,
                color: isDark ? "#9ca3af" : "#6b7280",
                callback: (v) => formatMoney(Number(v), currency),
              },
              grid: { color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" },
            },
          },
        },
      })
    } catch {
      // chart no crítico: el texto de arriba indica meses y monto final
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [start, monthly, target, months, currency, resolvedTheme, isMobile])

  return (
    <div className="h-[180px] w-full mt-3">
      <canvas ref={canvasRef} aria-hidden />
    </div>
  )
}
