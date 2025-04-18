"use client"

import { useState, useEffect } from "react"

const CompoundInterestCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(1000)
  const [monthlyContribution, setMonthlyContribution] = useState(100)
  const [interestRate, setInterestRate] = useState(5)
  const [years, setYears] = useState(10)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768) // Adjust the breakpoint as needed
    }

    // Set initial value
    handleResize()

    // Listen for window resize events
    window.addEventListener("resize", handleResize)

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const calculateCompoundInterest = () => {
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfMonths = years * 12
    let futureValue = initialInvestment

    for (let i = 0; i < numberOfMonths; i++) {
      futureValue = (futureValue + monthlyContribution) * (1 + monthlyInterestRate)
    }

    return futureValue.toFixed(2)
  }

  const futureValue = calculateCompoundInterest()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Calculadora de Interés Compuesto</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="initialInvestment" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Inversión Inicial:
          </label>
          <input
            type="number"
            id="initialInvestment"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number.parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label
            htmlFor="monthlyContribution"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Contribución Mensual:
          </label>
          <input
            type="number"
            id="monthlyContribution"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number.parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Tasa de Interés Anual (%):
          </label>
          <input
            type="number"
            id="interestRate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            value={interestRate}
            onChange={(e) => setInterestRate(Number.parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="years" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Años:
          </label>
          <input
            type="number"
            id="years"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            value={years}
            onChange={(e) => setYears(Number.parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-[#388e3c] mb-2">Resultado:</h2>
        <p className="text-gray-700 dark:text-gray-300">Valor futuro estimado: ${futureValue}</p>
      </div>
    </div>
  )
}

export default CompoundInterestCalculator
