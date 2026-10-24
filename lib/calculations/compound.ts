export interface SimulationData {
  year: number
  period?: number
  startBalance: number
  interest: number
  contribution: number
  balance: number
}

export interface SummaryData {
  balanceNet: number
  netGain: number
  totalContributions: number
  initialDeposit: number
  inflationEffect: number
  doubleTime: string
  annualizedReturn: string
  totalReturn: string
}

export interface CompoundSummaryInput {
  initialDeposit: number
  contribution: number
  years: number
  /** Tasa anual en decimal (0.12 = 12%). */
  interestRate: number
  /** Inflación anual en decimal (0.04 = 4%). */
  inflation: number
  contributionFrequency: number
}

/**
 * Simulación mes a mes. El interés se aplica al saldo y después se suma el
 * aporte; con frecuencia anual el aporte entra cada 12 meses.
 */
export function simulateInvestmentMonthly(
  initialDeposit: number,
  contribution: number,
  years: number,
  interestRate: number,
  contributionFrequency: number,
): SimulationData[] {
  const simulation: SimulationData[] = []
  const totalMonths = years * 12
  let balance = initialDeposit
  const monthlyRate = interestRate / 12

  for (let month = 1; month <= totalMonths; month++) {
    const startBalance = balance
    const interest = startBalance * monthlyRate

    balance = startBalance * (1 + monthlyRate)

    const monthlyContribution = contributionFrequency === 12 ? contribution : month % 12 === 0 ? contribution : 0
    balance += monthlyContribution

    simulation.push({
      period: month,
      year: Math.ceil(month / 12),
      startBalance,
      interest,
      contribution: monthlyContribution,
      balance,
    })
  }

  return simulation
}

/**
 * Simulación anual. Con aportes mensuales usa el factor histórico 1.0446 para
 * aproximar el efecto de aportar durante el año; es el comportamiento que ya
 * mostraba la herramienta y se conserva para no alterar resultados.
 */
export function simulateInvestmentAnnual(
  initialDeposit: number,
  contribution: number,
  years: number,
  interestRate: number,
  contributionFrequency: number,
): SimulationData[] {
  const annualContribution = contributionFrequency === 12 ? contribution * 12 * 1.0446 : contribution
  const simulation: SimulationData[] = []
  let balance = initialDeposit

  for (let year = 1; year <= years; year++) {
    const startBalance = balance
    const interest = startBalance * interestRate
    balance = startBalance * (1 + interestRate) + annualContribution
    simulation.push({ year, startBalance, interest, contribution: annualContribution, balance })
  }

  return simulation
}

/** Del detalle mensual, queda el último mes de cada año para la tabla anual. */
export function annualFromMonthly(monthlyData: SimulationData[], years: number): SimulationData[] {
  const annualData: SimulationData[] = []
  for (let year = 1; year <= years; year++) {
    const monthsOfYear = monthlyData.filter((item) => item.year === year)
    if (monthsOfYear.length > 0) {
      annualData.push(monthsOfYear[monthsOfYear.length - 1])
    }
  }
  return annualData
}

/** Resumen con saldo ajustado por inflación, ganancia y rendimiento. */
export function summarizeCompound(annualData: SimulationData[], input: CompoundSummaryInput): SummaryData {
  const { initialDeposit, contribution, years, interestRate, inflation, contributionFrequency } = input
  const finalBalance = annualData.length > 0 ? annualData[annualData.length - 1].balance || 0 : initialDeposit
  const totalContributions = contributionFrequency === 12 ? contribution * 12 * years : contribution * years

  let adjustedBalance = finalBalance
  if (annualData.length > 0) {
    if (contributionFrequency === 12) {
      const lastPeriod = annualData[annualData.length - 1].period || 0
      adjustedBalance =
        inflation > 0 && lastPeriod > 0
          ? finalBalance / Math.pow(1 + inflation, lastPeriod / 12)
          : finalBalance
    } else {
      adjustedBalance = inflation > 0 && years > 0 ? finalBalance / Math.pow(1 + inflation, years) : finalBalance
    }
  } else {
    adjustedBalance = initialDeposit
  }

  if (!Number.isFinite(adjustedBalance)) adjustedBalance = 0

  const totalInvested = initialDeposit + totalContributions
  const adjustedGain = adjustedBalance - initialDeposit - totalContributions
  const inflationEffect = finalBalance - adjustedBalance

  let investmentReturn = 0
  if (totalInvested > 0) {
    investmentReturn = (adjustedGain / totalInvested) * 100
  } else if (adjustedGain > 0) {
    investmentReturn = Number.POSITIVE_INFINITY
  }

  return {
    balanceNet: adjustedBalance,
    netGain: Math.max(0, adjustedGain),
    totalContributions,
    initialDeposit,
    inflationEffect: Math.max(0, inflationEffect),
    doubleTime: interestRate > 0 && interestRate < 1 ? (72 / (interestRate * 100)).toFixed(1) + " años" : "--",
    annualizedReturn: (interestRate * 100).toFixed(2) + "%",
    totalReturn: Number.isFinite(investmentReturn) ? investmentReturn.toFixed(2) + "%" : "∞%",
  }
}
