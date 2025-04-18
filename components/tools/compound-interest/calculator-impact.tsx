"use client"

import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"
import { Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CalculatorImpactProps {
  finalAmount: number
  totalContributions: number
  totalInterest: number
  inflationAdjustedAmount: number
  formatCurrency: (value: number) => string
  years: number
  initialInvestment: number
  monthlyContribution: number
  interestRate: number
  inflationRate: number
}

export function CalculatorImpact({
  finalAmount,
  totalContributions,
  totalInterest,
  inflationAdjustedAmount,
  formatCurrency,
  years,
  initialInvestment,
  monthlyContribution,
  interestRate,
  inflationRate,
}: CalculatorImpactProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Calcular el valor futuro sin invertir (solo considerando la inflación)
  const futureValueWithoutInvesting =
    (initialInvestment + monthlyContribution * 12 * years) * Math.pow(1 - inflationRate / 100, years)

  // Calcular la diferencia entre invertir y no invertir
  const investmentDifference = inflationAdjustedAmount - futureValueWithoutInvesting

  // Calcular el multiplicador de la inversión
  const investmentMultiplier = finalAmount / (initialInvestment + monthlyContribution * 12 * years)

  // Calcular el porcentaje de interés generado
  const interestPercentage = (totalInterest / finalAmount) * 100

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#388e3c] w-full text-center">
          El impacto de invertir vs. no invertir
          <span className="block w-16 h-1 bg-[#388e3c] mx-auto mt-2"></span>
        </h2>

        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            onMouseEnter={() => setActiveTooltip("impact")}
            onMouseLeave={() => setActiveTooltip(null)}
            aria-label="Información sobre el impacto de invertir"
          >
            <Info size={18} />
          </button>

          {activeTooltip === "impact" && (
            <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 z-10 text-xs text-gray-600 dark:text-gray-300">
              Esta sección muestra la diferencia entre invertir tu dinero y no hacerlo, considerando el efecto de la
              inflación. También puedes ver cuánto se ha multiplicado tu inversión inicial y el porcentaje de tus
              ganancias que proviene de los intereses.
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="comparison">Comparación</TabsTrigger>
          <TabsTrigger value="metrics">Métricas clave</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-green-200 dark:border-green-900">
              <h3 className="text-lg font-semibold text-[#388e3c] mb-2">Invirtiendo</h3>
              <p className="text-2xl font-bold">{formatCurrency(inflationAdjustedAmount)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Valor ajustado por inflación después de {years} años
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-red-200 dark:border-red-900">
              <h3 className="text-lg font-semibold text-red-500 mb-2">Sin invertir</h3>
              <p className="text-2xl font-bold">{formatCurrency(futureValueWithoutInvesting)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Valor ajustado por inflación después de {years} años
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-900">
            <h3 className="text-lg font-semibold text-blue-500 mb-2">Diferencia</h3>
            <p className="text-2xl font-bold">{formatCurrency(investmentDifference)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {investmentDifference > 0 ? "Ganancia adicional por invertir" : "Pérdida por no invertir"} después de{" "}
              {years} años
            </p>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-purple-200 dark:border-purple-900">
              <h3 className="text-lg font-semibold text-purple-500 mb-2">Multiplicador de inversión</h3>
              <p className="text-2xl font-bold">{investmentMultiplier.toFixed(2)}x</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tu dinero se ha multiplicado por {investmentMultiplier.toFixed(2)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-amber-200 dark:border-amber-900">
              <h3 className="text-lg font-semibold text-amber-500 mb-2">Interés generado</h3>
              <p className="text-2xl font-bold">{interestPercentage.toFixed(1)}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Porcentaje del total que proviene de intereses</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Mostrar los recuadros informativos solo en móvil */}
      {isMobile && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-[#388e3c] mb-2">Costo de oportunidad</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              El dinero no invertido pierde valor con el tiempo debido a la inflación. Al invertir, no solo generas
              rendimientos, sino que también proteges tu capital de la pérdida de poder adquisitivo.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-[#388e3c] mb-2">El poder del interés compuesto</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              El interés compuesto hace que tus inversiones crezcan exponencialmente con el tiempo. Cuanto antes
              comiences a invertir y más tiempo mantengas tu inversión, mayor será el efecto multiplicador.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
