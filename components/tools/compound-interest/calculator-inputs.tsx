"use client"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalculatorInputsProps {
  initialDeposit: number
  setInitialDeposit: (value: number) => void
  contribution: number
  setContribution: (value: number) => void
  contributionFrequency: string
  setContributionFrequency: (value: string) => void
  years: number
  setYears: (value: number) => void
  interestRate: number
  setInterestRate: (value: number) => void
  inflation: number
  setInflation: (value: number) => void
}

export function CalculatorInputs({
  initialDeposit,
  setInitialDeposit,
  contribution,
  setContribution,
  contributionFrequency,
  setContributionFrequency,
  years,
  setYears,
  interestRate,
  setInterestRate,
  inflation,
  setInflation,
}: CalculatorInputsProps) {
  // Formatear números para mostrar
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Formatear porcentajes
  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="calculator-inputs space-y-6" data-interactive="true">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="initial-deposit" className="text-sm font-medium">
            Depósito inicial
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(initialDeposit)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Slider
            id="initial-deposit-slider"
            min={0}
            max={1000000}
            step={1000}
            value={[initialDeposit]}
            onValueChange={(value) => setInitialDeposit(value[0])}
            className="flex-grow"
            data-interactive="true"
          />
          <div className="w-24 flex-shrink-0">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <Input
                id="initial-deposit"
                type="number"
                min={0}
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="pl-6 text-right"
                data-interactive="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="contribution" className="text-sm font-medium">
            Aportación periódica
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(contribution)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Slider
            id="contribution-slider"
            min={0}
            max={50000}
            step={100}
            value={[contribution]}
            onValueChange={(value) => setContribution(value[0])}
            className="flex-grow"
            data-interactive="true"
          />
          <div className="w-24 flex-shrink-0">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <Input
                id="contribution"
                type="number"
                min={0}
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
                className="pl-6 text-right"
                data-interactive="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="contribution-frequency" className="text-sm font-medium mb-2 block">
          Frecuencia de aportación
        </Label>
        <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
          <SelectTrigger id="contribution-frequency" className="w-full" data-interactive="true">
            <SelectValue placeholder="Selecciona frecuencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="semiannual">Semestral</SelectItem>
            <SelectItem value="annual">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="years" className="text-sm font-medium">
            Plazo (años)
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{years} años</span>
        </div>
        <div className="flex items-center space-x-4">
          <Slider
            id="years-slider"
            min={1}
            max={50}
            step={1}
            value={[years]}
            onValueChange={(value) => setYears(value[0])}
            className="flex-grow"
            data-interactive="true"
          />
          <div className="w-24 flex-shrink-0">
            <Input
              id="years"
              type="number"
              min={1}
              max={50}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="text-center"
              data-interactive="true"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="interest-rate" className="text-sm font-medium">
            Tasa de interés anual
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatPercent(interestRate)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Slider
            id="interest-rate-slider"
            min={0}
            max={30}
            step={0.1}
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            className="flex-grow"
            data-interactive="true"
          />
          <div className="w-24 flex-shrink-0">
            <div className="relative">
              <Input
                id="interest-rate"
                type="number"
                min={0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="pr-6 text-right"
                data-interactive="true"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 dark:text-gray-400">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="inflation" className="text-sm font-medium">
            Inflación anual estimada
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatPercent(inflation)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Slider
            id="inflation-slider"
            min={0}
            max={15}
            step={0.1}
            value={[inflation]}
            onValueChange={(value) => setInflation(value[0])}
            className="flex-grow"
            data-interactive="true"
          />
          <div className="w-24 flex-shrink-0">
            <div className="relative">
              <Input
                id="inflation"
                type="number"
                min={0}
                step={0.1}
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="pr-6 text-right"
                data-interactive="true"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 dark:text-gray-400">
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
