"use client"

import type { SummaryData } from "@/hooks/use-compound-interest-calculator"
import { CompoundInterestResult } from "./compound-interest-result"

interface CalculatorSummaryProps {
  summary: SummaryData
  formatCurrency: (value: number) => string
  showDetailedCards?: boolean
  inflation?: number
}

export function CalculatorSummary({
  summary,
  formatCurrency,
  showDetailedCards = true,
  inflation = 0,
}: CalculatorSummaryProps) {
  // Siempre mostrar solo el resultado principal, ya que las tarjetas detalladas ya no son necesarias
  return <CompoundInterestResult summary={summary} formatCurrency={formatCurrency} inflation={inflation} />
}
