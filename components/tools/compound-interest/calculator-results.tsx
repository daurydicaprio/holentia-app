import type React from "react"

interface CalculatorResultsProps {
  initialInvestment: number
  monthlyContribution: number
  interestRate: number
  years: number
  futureValue: number
  totalInterest: number
  totalContribution: number
  isMobile: boolean
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({
  initialInvestment,
  monthlyContribution,
  interestRate,
  years,
  futureValue,
  totalInterest,
  totalContribution,
  isMobile,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Resultados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-[#388e3c] mb-2">Valor Futuro</h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {futureValue.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-[#388e3c] mb-2">Interés Total Ganado</h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {totalInterest.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-[#388e3c] mb-2">Inversión Inicial</h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {initialInvestment.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-[#388e3c] mb-2">Contribuciones Totales</h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {totalContribution.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </p>
        </div>
      </div>
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
    </div>
  )
}

export default CalculatorResults
