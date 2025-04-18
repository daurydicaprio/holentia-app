"use client"

import { DollarSign, Calendar, Percent, TrendingUp } from "lucide-react"
import type { SummaryData } from "@/hooks/use-compound-interest-calculator"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CompoundInterestResultProps {
  summary: SummaryData
  formatCurrency: (value: number) => string
}

export function CompoundInterestResult({ summary, formatCurrency }: CompoundInterestResultProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div
      className="rounded-xl p-6 shadow-lg"
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
            Con un depósito inicial de <strong>{formatCurrency(summary.initialDeposit)}</strong> y aportaciones totales
            de <strong>{formatCurrency(summary.totalContributions)}</strong>, tu inversión crecerá hasta{" "}
            <strong>{formatCurrency(summary.balanceNet)}</strong> con un rendimiento total de{" "}
            <strong>{summary.totalReturn}</strong>.
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
              <Percent size={14} />
              <span>Retorno anualizado</span>
            </div>
            <div className="font-semibold" style={{ color: "#ffffff" }}>
              {summary.annualizedReturn}
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
  )
}
