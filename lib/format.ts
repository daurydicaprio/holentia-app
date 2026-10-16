/**
 * Formato canónico de moneda del sitio: pesos dominicanos con locale es-DO.
 * Fuente única para evitar divergencias de locale/moneda entre herramientas.
 */
export function formatDOP(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}
