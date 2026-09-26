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
  /** Tasa anual de referencia (%): curva comparativa de "si lo inviertes". */
  rate?: number
  /** Nombre del instrumento para la leyenda ("AFI líquido", "fondo a 30 días"). */
  rateLabel?: string
  /** "both" = las dos curvas · "save" = solo la línea de ahorro. */
  mode?: "save" | "both"
}

/** Línea del colchón mes a mes con la meta (2×) y la curva de inversión como referencia. */
export function FundProjectionChart({
  start,
  monthly,
  target,
  months,
  currency,
  rate,
  rateLabel = "AFI líquido",
  mode = "both",
}: FundProjectionChartProps) {
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
    const invested: number[] = []
    const monthlyRate = rate && rate > 0 ? rate / 100 / 12 : 0
    for (let m = 0; m <= last; m++) {
      labels.push(String(m))
      values.push(Math.round(start + monthly * m))
      // Valor futuro de aportes mensuales al AFI líquido (interés compuesto mensual).
      invested.push(
        Math.round(monthlyRate > 0 ? start * Math.pow(1 + monthlyRate, m) + monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) : start + monthly * m),
      )
    }
    const targetLine = labels.map(() => target)

    const isDark = resolvedTheme === "dark"
    const showInvested = mode === "both" && monthlyRate > 0
    // Un punto por mes visible (grande si hay pocos meses, más pequeño si hay muchos).
    const pt = last <= 24 ? 2.5 : last <= 48 ? 1.8 : 1.2
    // Etiqueta persistente con el valor del último mes de cada curva.
    const endLabelsPlugin = {
      id: "endLabels",
      afterDatasetsDraw(chart: Chart) {
        const ctx2 = chart.ctx
        const items: Array<{ y: number; text: string; color: string }> = [
          { y: values[last], text: formatMoney(values[last], currency), color: "#388e3c" },
        ]
        if (showInvested) items.push({ y: invested[last], text: formatMoney(invested[last], currency), color: "#0ea5e9" })
        const anchor = chart.getDatasetMeta(0).data[last]
        if (!anchor) return
        ctx2.save()
        ctx2.font = "600 10px system-ui, sans-serif"
        ctx2.textAlign = "right"
        ctx2.textBaseline = "middle"
        items.forEach((item, i) => {
          const y = chart.scales.y.getPixelForValue(item.y) - (i === 0 ? 9 : -9)
          const w = ctx2.measureText(item.text).width + 8
          ctx2.fillStyle = isDark ? "rgba(31, 41, 55, 0.92)" : "rgba(255, 255, 255, 0.94)"
          ctx2.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"
          ctx2.beginPath()
          ctx2.rect(anchor.x - w - 6, y - 8, w, 16)
          ctx2.fill()
          ctx2.stroke()
          ctx2.fillStyle = item.color
          ctx2.fillText(item.text, anchor.x - 10, y)
        })
        ctx2.restore()
      },
    }
    try {
      chartRef.current = new Chart(ctx, {
        type: "line",
        plugins: [endLabelsPlugin],
        data: {
          labels,
          datasets: [
            {
              label: "Solo ahorro",
              data: values,
              borderColor: "#388e3c",
              backgroundColor: "rgba(56, 142, 60, 0.15)",
              fill: true,
              tension: 0.3,
              pointRadius: pt,
              pointHoverRadius: 5,
              pointHitRadius: 8,
              borderWidth: 2.5,
            },
            ...(showInvested
              ? [
                  {
                    label: `Ahorro + ${rateLabel} (~${rate ?? 0}%)`,
                    data: invested,
                    borderColor: "#0ea5e9",
                    backgroundColor: "transparent",
                    fill: false,
                    tension: 0.3,
                    pointRadius: pt,
                    pointHoverRadius: 5,
                    pointHitRadius: 8,
                    borderWidth: 3,
                    borderDash: [7, 4],
                  },
                ]
              : []),
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
  }, [start, monthly, target, months, currency, rate, rateLabel, mode, resolvedTheme, isMobile])

  return (
    <div className="h-[240px] w-full mt-3">
      <canvas ref={canvasRef} aria-hidden />
    </div>
  )
}
