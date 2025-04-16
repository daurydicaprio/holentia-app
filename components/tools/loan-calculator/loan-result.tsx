"use client"

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

  return (
    <div className="bg-[#388e3c] rounded-lg p-6 text-white shadow-md">
      <h3 className="text-lg font-medium mb-2">Resultado</h3>
      <div className="text-3xl font-bold mb-4">{formatCurrency(monthlyPayment)}</div>
      <div className="text-sm space-y-2">
        <p>
          La cuota mensual sería de <strong>{formatCurrency(monthlyPayment)}</strong> considerando un monto de{" "}
          <strong>{formatCurrency(loanAmount)}</strong> a una tasa de interés de{" "}
          <strong>{interestRate.toFixed(2)}%</strong> por un plazo de{" "}
          <strong>
            {loanTerm} {loanTerm === 1 ? "mes" : "meses"}
          </strong>
          .
        </p>
        <div className="pt-2 border-t border-white/30">
          <p>
            <span className="inline-block w-32">Total a pagar:</span> <strong>{formatCurrency(totalPayment)}</strong>
          </p>
          <p>
            <span className="inline-block w-32">Total intereses:</span> <strong>{formatCurrency(totalInterest)}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
