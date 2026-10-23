/**
 * Fuente única de tasas, topes y referencias financieras de Holentia.
 *
 * Regla: los componentes no escriben tasas; importan de aquí. Las fórmulas
 * puras de `lib/calculations/` también leen estos valores para que un cambio
 * de tasa sea un solo cambio y los tests fallen si no se actualiza el caso.
 *
 * `effectiveFrom` es la fecha de vigencia del valor; `reviewedAt` es la última
 * revisión editorial. No hay peticiones de red: son valores estáticos.
 */
export const REVIEWED_AT = "2026-10-23"

export type RateGroup =
  | "general"
  | "tss"
  | "isr"
  | "itbis"
  | "severance"
  | "electricity"
  | "fuel"
  | "certificate"
  | "exchange"
  | "aguinaldo"
  | "inflation"

export interface RateMeta {
  effectiveFrom: string
  reviewedAt: string
  source: string
  sourceUrl: string
}

export const RATES = {
  tss: {
    sfsRate: 0.0304,
    afpRate: 0.0287,
    sfsCap: 232230,
    afpCap: 464460,
  },
  isr: {
    exemptUpTo: 416220.01,
    bracket15UpTo: 624329,
    bracket20UpTo: 867123,
    fixed20: 31216,
    fixed25: 79776,
  },
  itbis: {
    general: 0.18,
    reduced: 0.16,
  },
  severance: {
    dailyDivisor: 23.83,
  },
  electricity: {
    fixedCharge: 127.83,
    tier1Limit: 200,
    tier1Price: 6.17,
    tier2Limit: 100,
    tier2Price: 8.71,
    tier3Price: 13.04,
    noTierThreshold: 700,
    subsidyFactor: 0.819,
  },
  fuel: {
    defaultGallonPrice: 358,
    litersPerGallon: 3.78541,
  },
  certificate: {
    referenceMin: 0.07,
    referenceMax: 0.11,
    withholding: 0.1,
    daysPerYear: 365,
  },
  exchange: {
    usdToDop: 60,
  },
  aguinaldo: {
    monthsPerYear: 12,
    paymentDeadline: "20 de diciembre",
    isrExempt: true,
  },
  inflation: {
    referenceAnnual: 0.04,
  },
} as const

export const RATE_META: Record<RateGroup, RateMeta> = {
  general: {
    effectiveFrom: "2026-10-23",
    reviewedAt: REVIEWED_AT,
    source: "BCRD, DGII, TSS, Ministerio de Trabajo y SIE",
    sourceUrl: "https://www.bancentral.gov.do/",
  },
  tss: {
    effectiveFrom: "2026-02-01",
    reviewedAt: REVIEWED_AT,
    source: "TSS — Resolución 01-2025",
    sourceUrl: "https://www.tss.gob.do/",
  },
  isr: {
    effectiveFrom: "2026-01-01",
    reviewedAt: REVIEWED_AT,
    source: "DGII — escala anual de retención de asalariados",
    sourceUrl: "https://dgii.gov.do/",
  },
  itbis: {
    effectiveFrom: "2026-01-01",
    reviewedAt: REVIEWED_AT,
    source: "DGII — ITBIS general y reducido",
    sourceUrl: "https://dgii.gov.do/",
  },
  severance: {
    effectiveFrom: "2026-01-01",
    reviewedAt: REVIEWED_AT,
    source: "Ministerio de Trabajo — Código de Trabajo (Ley 16-92)",
    sourceUrl: "https://mt.gob.do/",
  },
  electricity: {
    effectiveFrom: "2026-10-01",
    reviewedAt: REVIEWED_AT,
    source: "SIE/EDES — pliego tarifario residencial",
    sourceUrl: "https://www.sie.gob.do/",
  },
  fuel: {
    effectiveFrom: "2026-10-23",
    reviewedAt: REVIEWED_AT,
    source: "MICM — precios de referencia de combustibles",
    sourceUrl: "https://www.micm.gob.do/",
  },
  certificate: {
    effectiveFrom: "2026-01-01",
    reviewedAt: REVIEWED_AT,
    source: "Superintendencia de Bancos / SIMV — referencias 2026",
    sourceUrl: "https://sb.gob.do/",
  },
  exchange: {
    effectiveFrom: "2026-10-23",
    reviewedAt: REVIEWED_AT,
    source: "BCRD — tipo de cambio de referencia",
    sourceUrl: "https://www.bancentral.gov.do/",
  },
  aguinaldo: {
    effectiveFrom: "2026-01-01",
    reviewedAt: REVIEWED_AT,
    source: "Ministerio de Trabajo — Código de Trabajo, arts. 219–222",
    sourceUrl: "https://mt.gob.do/",
  },
  inflation: {
    effectiveFrom: "2026-01-01",
    reviewedAt: REVIEWED_AT,
    source: "BCRD — meta de inflación",
    sourceUrl: "https://www.bancentral.gov.do/",
  },
}

/** Herramientas financieras y los grupos de tasas que muestran en su nota. */
export const RATE_GROUPS_BY_TOOL: Record<string, RateGroup[]> = {
  "calculadora-sueldo-neto": ["tss", "isr"],
  "calculadora-aguinaldo": ["aguinaldo", "isr"],
  "calculadora-itbis": ["itbis"],
  "calculadora-prestaciones-laborales": ["severance", "aguinaldo"],
  "calculadora-consumo-electrico": ["electricity"],
  "calculadora-gasto-combustible": ["fuel"],
  "calculadora-certificado-financiero": ["certificate"],
  "calculadora-interes-compuesto": ["certificate"],
  "planificador-ahorros": ["certificate"],
  "planificador-compras": ["certificate"],
  "test-perfil-riesgo": ["exchange", "inflation", "certificate"],
  "calculadora-prestamo": ["general"],
  "tarjeta-corte-vencimiento": ["general"],
  "calculadora-interes-tarjeta": ["general"],
  "crear-presupuesto-personal": ["general"],
  "tracker-gastos-hormiga": ["general"],
  "glosario-financiero": ["general"],
}

export const CERTIFICATE_REFERENCE_LABEL = `${RATES.certificate.referenceMin * 100}%–${
  RATES.certificate.referenceMax * 100
}% anual`

export function formatRateDate(iso: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`))
}
