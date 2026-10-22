// Salario de Navidad (aguinaldo): duodécima parte del salario ordinario
// devengado en el año (arts. 219–222 del Código de Trabajo).
export const MESES_ANIO = 12

export interface AguinaldoResult {
  anual: number
  aguinaldo: number
}

export function calculateAguinaldo(salario: number, meses: number): AguinaldoResult {
  const anual = salario * meses
  return { anual, aguinaldo: anual / MESES_ANIO }
}
