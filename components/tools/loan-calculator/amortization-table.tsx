"use client"

interface AmortizationRow {
  month: number
  initialBalance: number
  payment: number
  interest: number
  principal: number
  remainingBalance: number
}

interface AmortizationTableProps {
  data: AmortizationRow[]
  formatCurrency: (value: number) => string
}

export function AmortizationTable({ data, formatCurrency }: AmortizationTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Ingresa los datos del préstamo para generar la tabla de amortización.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left bg-[#388e3c]/20 dark:bg-[#388e3c]/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
              N° Cuota
            </th>
            <th className="p-3 text-left bg-[#388e3c]/20 dark:bg-[#388e3c]/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
              Saldo Inicial
            </th>
            <th className="p-3 text-left bg-[#388e3c]/20 dark:bg-[#388e3c]/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
              Cuota
            </th>
            <th className="p-3 text-left bg-[#388e3c]/20 dark:bg-[#388e3c]/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
              Interés
            </th>
            <th className="p-3 text-left bg-[#388e3c]/20 dark:bg-[#388e3c]/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
              Capital
            </th>
            <th className="p-3 text-left bg-[#388e3c]/20 dark:bg-[#388e3c]/30 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700">
              Saldo Final
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month} className="hover:bg-[#388e3c]/5 dark:hover:bg-[#388e3c]/10">
              <td className="p-3 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {row.month}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {formatCurrency(row.initialBalance)}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {formatCurrency(row.payment)}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {formatCurrency(row.interest)}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {formatCurrency(row.principal)}
              </td>
              <td className="p-3 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {formatCurrency(row.remainingBalance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
