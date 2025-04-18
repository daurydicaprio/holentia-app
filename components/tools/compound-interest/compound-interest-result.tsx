"use client"

import { DollarSign, Calendar, Percent, TrendingUp } from "lucide-react"
import type { SummaryData } from "@/hooks/use-compound-interest-calculator"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CompoundInterestResultProps {
  summary: SummaryData
  formatCurrency: (value: number) => string
  inflation: number
}

export function CompoundInterestResult({ summary, formatCurrency, inflation }: CompoundInterestResultProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Calcular el balance sin inflación (balance bruto)
  const grossBalance = summary.balanceNet + summary.inflationEffect

  // Calcular correctamente cuánto valdría el dinero sin invertir después de la inflación
  const totalInvested = summary.initialDeposit + summary.totalContributions

  // Obtener el número de años de la inversión
  const years = summary.doubleTime !== "--" ? Number.parseInt(summary.doubleTime) : 5

  const nonInvestedValue = inflation > 0 ? totalInvested / Math.pow(1 + inflation / 100, years) : totalInvested

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl p-6 shadow-lg border border-[#1b5e20]/20"
        style={{
          background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
          color: "#ffffff",
        }}
      >
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2" style={{ color: "#ffffff" }}>
          <TrendingUp size={20} />
          <span>Resultado de la Inversión</span>
        </h3>

        <div className="text-3xl font-bold mb-4 flex items-center" style={{ color: "#ffffff" }}>
          <span className="text-xl mr-2 opacity-90" style={{ color: "#ffffff" }}>
            Balance final:
          </span>
          {formatCurrency(summary.balanceNet)}
        </div>

        <div className="space-y-4">
          <div className="text-sm space-y-1" style={{ color: "#ffffff" }}>
            <p className="leading-relaxed">
              Con un depósito inicial de <strong>{formatCurrency(summary.initialDeposit)}</strong> y aportaciones
              totales de <strong>{formatCurrency(summary.totalContributions)}</strong>, tu inversión crecerá hasta{" "}
              <strong>{formatCurrency(summary.balanceNet)}</strong> con un rendimiento total de{" "}
              <strong>{summary.totalReturn}</strong>.
              {inflation > 0 && (
                <>
                  {" "}
                  Este resultado ya considera una inflación del <strong>{inflation.toFixed(2)}%</strong> anual.
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/30">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#ffffff" }}>
                <DollarSign size={14} />
                <span>Ganancia neta</span>
              </div>
              <div className="font-semibold" style={{ color: "#ffffff" }}>
                {formatCurrency(summary.netGain)}
              </div>
            </div>

            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#ffffff" }}>
                <DollarSign size={14} />
                <span>Aportes totales</span>
              </div>
              <div className="font-semibold" style={{ color: "#ffffff" }}>
                {formatCurrency(summary.totalContributions)}
              </div>
            </div>

            {isMobile ? (
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm group hover:bg-red-500/30 transition-colors">
                <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#ffffff" }}>
                  <Percent size={14} />
                  <span>Inflación</span>
                </div>
                <div className="font-semibold" style={{ color: "#ffffff" }}>
                  {formatCurrency(summary.inflationEffect)}
                </div>
              </div>
            ) : (
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "#ffffff" }}>
                  <Calendar size={14} />
                  <span>Tiempo en duplicar</span>
                </div>
                <div className="font-semibold" style={{ color: "#ffffff" }}>
                  {summary.doubleTime}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
