interface ChartDataTableProps {
  /** Texto del acordeón: «Ver datos del gráfico». */
  summary: string
  columns: string[]
  rows: Array<Array<string | number>>
  /** Descripción para lectores de pantalla. */
  caption: string
}

/**
 * Alternativa textual a un canvas de Chart.js.
 * El detalle es nativo, accesible por teclado y no añade JavaScript.
 */
export function ChartDataTable({ summary, columns, rows, caption }: ChartDataTableProps) {
  if (rows.length === 0) return null

  return (
    <details className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60">
      <summary
        className="cursor-pointer select-none text-sm font-medium text-finanzas-dark marker:text-finanzas dark:text-finanzas-light dark:marker:text-finanzas-light"
        data-interactive="true"
      >
        {summary}
      </summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left text-xs sm:text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="border-b border-gray-300 px-2 py-1.5 font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b border-gray-200 px-2 py-1.5 text-gray-600 last:border-0 dark:border-gray-700 dark:text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
