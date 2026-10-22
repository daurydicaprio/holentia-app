/**
 * Red de enlaces contextuales entre herramientas (Fase BP).
 *
 * Cada herramienta declara 2–3 siguientes pasos reales. El bloque se renderiza
 * una sola vez desde `ToolPageShell`, así que ninguna página queda aislada.
 * Las relaciones son dirigidas: A puede recomendar B sin que B repita A.
 */
export const RELATED_TOOL_SLUGS: Record<string, readonly string[]> = {
  // Mente
  "diario-guiado": ["seguimiento-habitos", "tecnicas-respiracion", "test-ansiedad"],
  "seguimiento-habitos": ["diario-guiado", "pasos-al-dia", "calculadora-sueno"],
  "tecnicas-respiracion": ["test-ansiedad", "calculadora-sueno", "diario-guiado"],
  "test-ansiedad": ["tecnicas-respiracion", "test-calidad-sueno", "diario-guiado"],
  "calculadora-sueno": ["test-calidad-sueno", "tecnicas-respiracion", "seguimiento-habitos"],
  "test-calidad-sueno": ["calculadora-sueno", "test-ansiedad", "rutinas-hiit"],

  // Relaciones
  "test-lenguajes-amor": ["test-apego", "preguntas-profundas", "diario-parejas"],
  "diario-parejas": ["preguntas-profundas", "test-lenguajes-amor", "test-apego"],
  "test-apego": ["test-lenguajes-amor", "diario-parejas", "preguntas-profundas"],
  "preguntas-profundas": ["diario-parejas", "test-lenguajes-amor", "test-apego"],

  // Cuerpo
  "calculadora-calorias": ["calculadora-proteina-diaria", "calculadora-imc", "calculadora-grasa-corporal"],
  "calculadora-hidratacion": ["calculadora-calorias", "pasos-al-dia", "rutinas-hiit"],
  "calculadora-imc": ["calculadora-grasa-corporal", "calculadora-calorias", "calculadora-proteina-diaria"],
  "calculadora-grasa-corporal": ["calculadora-imc", "calculadora-calorias", "calculadora-proteina-diaria"],
  "calculadora-proteina-diaria": ["calculadora-calorias", "calculadora-imc", "planificador-comidas"],
  "rutinas-hiit": ["pasos-al-dia", "calculadora-hidratacion", "planificador-comidas"],
  "planificador-comidas": ["calculadora-calorias", "planificador-compras", "calculadora-proteina-diaria"],
  "pasos-al-dia": ["calculadora-hidratacion", "rutinas-hiit", "calculadora-calorias"],

  // Finanzas: ingreso y gasto
  "crear-presupuesto-personal": ["tracker-gastos-hormiga", "calculadora-sueldo-neto", "calculadora-consumo-electrico"],
  "tracker-gastos-hormiga": ["crear-presupuesto-personal", "planificador-compras", "calculadora-gasto-combustible"],
  "calculadora-sueldo-neto": ["crear-presupuesto-personal", "calculadora-prestaciones-laborales", "calculadora-aguinaldo"],
  "calculadora-aguinaldo": ["calculadora-sueldo-neto", "planificador-ahorros", "calculadora-prestaciones-laborales"],
  "calculadora-prestaciones-laborales": ["calculadora-sueldo-neto", "calculadora-aguinaldo", "planificador-ahorros"],
  "calculadora-itbis": ["planificador-compras", "tracker-gastos-hormiga", "glosario-financiero"],
  "calculadora-consumo-electrico": ["calculadora-gasto-combustible", "crear-presupuesto-personal", "tracker-gastos-hormiga"],
  "calculadora-gasto-combustible": ["calculadora-consumo-electrico", "planificador-compras", "tracker-gastos-hormiga"],

  // Finanzas: ahorro, deuda e inversión
  "calculadora-interes-compuesto": ["planificador-ahorros", "calculadora-certificado-financiero", "test-perfil-riesgo"],
  "planificador-ahorros": ["calculadora-interes-compuesto", "calculadora-aguinaldo", "calculadora-prestaciones-laborales"],
  "planificador-compras": ["calculadora-itbis", "calculadora-interes-compuesto", "tracker-gastos-hormiga"],
  "calculadora-prestamo": ["calculadora-interes-tarjeta", "tarjeta-corte-vencimiento", "glosario-financiero"],
  "tarjeta-corte-vencimiento": ["calculadora-interes-tarjeta", "calculadora-prestamo", "crear-presupuesto-personal"],
  "calculadora-interes-tarjeta": ["calculadora-prestamo", "tarjeta-corte-vencimiento", "crear-presupuesto-personal"],
  "test-perfil-riesgo": ["calculadora-interes-compuesto", "planificador-ahorros", "calculadora-certificado-financiero"],
  "calculadora-certificado-financiero": ["calculadora-interes-compuesto", "planificador-ahorros", "test-perfil-riesgo"],
  "glosario-financiero": ["crear-presupuesto-personal", "calculadora-interes-compuesto", "calculadora-itbis"],
}

export function getRelatedToolSlugs(slug: string): readonly string[] {
  return RELATED_TOOL_SLUGS[slug] ?? []
}
