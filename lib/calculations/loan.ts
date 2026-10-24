import type { AmortizationRow } from "../../types"

/**
 * Cuota mensual de un préstamo con amortización francesa.
 * `interestRate` es la tasa anual en porcentaje (24 = 24%).
 */
export function calculateMonthlyPayment(loanAmount: number, interestRate: number, loanTerm: number): number {
  const monthlyInterestRate = interestRate / 100 / 12

  if (monthlyInterestRate === 0) {
    return loanAmount / loanTerm
  }

  return (
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
    (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
  )
}

export interface LoanCalculation {
  monthlyPayment: number
  amortizationData: AmortizationRow[]
}

/** Tabla de amortización mes a mes, con la misma cuota fija. */
export function generateAmortizationTable(
  loanAmount: number,
  interestRate: number,
  loanTerm: number,
): LoanCalculation {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm)
  let remainingBalance = loanAmount
  const monthlyInterestRate = interestRate / 100 / 12
  const amortizationData: AmortizationRow[] = []

  for (let month = 1; month <= loanTerm; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate
    const principalPayment = monthlyPayment - interestPayment
    const initialBalance = remainingBalance
    remainingBalance -= principalPayment

    amortizationData.push({
      month,
      initialBalance,
      payment: monthlyPayment,
      interest: interestPayment,
      principal: principalPayment,
      remainingBalance: Math.max(0, remainingBalance),
    })
  }

  return { monthlyPayment, amortizationData }
}
