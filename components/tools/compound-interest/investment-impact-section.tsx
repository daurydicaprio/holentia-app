"use client"

import { AlertCircle, TrendingUp, ArrowRight, AlertTriangle } from "lucide-react"
import type { SummaryData } from "@/hooks/use-compound-interest-calculator"

interface InvestmentImpactSectionProps {
  summary: SummaryData
  formatCurrency: (value: number) => string
  inflation: number
  years: number
}

export function InvestmentImpactSection({ summary, formatCurrency, inflation, years }: InvestmentImpactSectionProps) {
  // Calcular el balance sin inflación (balance bruto)
  const grossBalance = summary.balanceNet + summary.inflationEffect

  // Calcular correctamente cuánto valdría el dinero sin invertir después de la inflación
  const totalInvested = summary.initialDeposit + summary.totalContributions
  const nonInvestedValue = inflation > 0 ? totalInvested / Math.pow(1 + inflation / 100, years) : totalInvested

  // Calcular el poder adquisitivo perdido
  const purchasingPowerLost = totalInvested - nonInvestedValue

  // Calcular el costo de oportunidad (lo que se deja de ganar por no invertir)
  const opportunityCost = summary.balanceNet - totalInvested

  // Calcular el rendimiento anual promedio
  const annualReturn = Number.parseFloat(summary.annualizedReturn.replace("%", ""))

  // Calcular cuánto tiempo tomaría duplicar el dinero con diferentes tasas
  const timeToDouble = (rate: number) => (72 / rate).toFixed(1)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="bg-[#388e3c]/10 dark:bg-[#388e3c]/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-[#388e3c] flex items-center gap-2">
          <AlertCircle size={20} />
          El impacto de invertir vs. no invertir
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Impacto de la inflación */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#388e3c]" />
              Impacto de la inflación en tu dinero
            </h4>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Si no invirtieras tu dinero, el valor real de tus <strong>{formatCurrency(totalInvested)}</strong> se
              reduciría a aproximadamente <strong>{formatCurrency(nonInvestedValue)}</strong> en {years} años debido a
              la inflación del {inflation.toFixed(2)}% anual.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-4">
              {/* Recuadro: Si no inviertes tu dinero - CORREGIDO */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Si no inviertes tu dinero:
                </div>
                <div className="text-lg font-bold text-red-500 dark:text-red-400">
                  {formatCurrency(nonInvestedValue)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Total que ahorraste: {formatCurrency(totalInvested)}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Sin inflación, tu inversión valdría:
                </div>
                <div className="text-lg font-bold text-[#388e3c]">{formatCurrency(grossBalance)}</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Con inflación, tu inversión valdría:
                </div>
                <div className="text-lg font-bold text-[#388e3c]">{formatCurrency(summary.balanceNet)}</div>
                <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Pérdida por inflación: {formatCurrency(summary.inflationEffect)}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Datos importantes */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Datos importantes
            </h4>

            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-[#388e3c]" />
                <span>
                  Históricamente, la inflación promedio en Latinoamérica ha sido del 3-5% anual, erosionando el valor
                  del dinero no invertido.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-[#388e3c]" />
                <span>
                  Invertir regularmente pequeñas cantidades suele ser más efectivo que grandes inversiones ocasionales
                  debido al costo promedio en dólares.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-[#388e3c]" />
                <span>
                  El mercado de valores ha generado un rendimiento promedio anual de aproximadamente 10% a largo plazo,
                  superando significativamente la inflación.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-[#388e3c]" />
                <span>
                  Al invertir, no solo proteges tu dinero de la inflación, sino que también lo haces crecer con el
                  tiempo gracias al interés compuesto.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
