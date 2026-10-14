"use client"
import { DollarSign, Calendar, Percent, TrendingUp } from "lucide-react"

interface LoanResultProps {
  monthlyPayment: number
  loanAmount: number
  interestRate: number
  loanTerm: number
  formatCurrency: (value: number) => string
}

export function LoanResult({ monthlyPayment, loanAmount, interestRate, loanTerm, formatCurrency }: LoanResultProps) {
  // Calcular el total a pagar y el total de intereses
  const totalPayment = monthlyPayment * loanTerm
  const totalInterest = totalPayment - loanAmount
  const interestPercentage = loanAmount > 0 ? (totalInterest / loanAmount) * 100 : 0

  return (
    <div className="rounded-xl p-6 shadow-lg bg-gradient-to-br from-finanzas to-finanzas-dark text-white dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text">
      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
        <TrendingUp size={20} />
        <span>Resultado del Préstamo</span>
      </h3>

      <div className="text-3xl font-bold mb-4 flex items-center">
        <span className="text-xl mr-2 opacity-90">
          Cuota mensual:
        </span>
        {formatCurrency(monthlyPayment)}
      </div>

      <div className="space-y-4">
        <div className="text-sm space-y-1">
          <p className="leading-relaxed">
            La cuota mensual sería de <strong>{formatCurrency(monthlyPayment)}</strong> considerando un monto de{" "}
            <strong>{formatCurrency(loanAmount)}</strong> a una tasa de interés de{" "}
            <strong>{interestRate.toFixed(2)}%</strong> por un plazo de{" "}
            <strong>
              {loanTerm} {loanTerm === 1 ? "mes" : "meses"}
            </strong>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/30">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs mb-1">
              <DollarSign size={14} />
              <span>Total a pagar</span>
            </div>
            <div className="font-semibold">
              {formatCurrency(totalPayment)}
            </div>
          </div>

          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs mb-1">
              <Percent size={14} />
              <span>Total intereses</span>
            </div>
            <div className="font-semibold">
              {formatCurrency(totalInterest)}
            </div>
            <div className="text-xs mt-1 opacity-90">
              ({interestPercentage.toFixed(1)}% del préstamo)
            </div>
          </div>

          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs mb-1">
              <Calendar size={14} />
              <span>Último pago</span>
            </div>
            <div className="font-semibold">
              {new Date(Date.now() + loanTerm * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
