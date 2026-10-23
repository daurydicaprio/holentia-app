import test from "node:test"
import assert from "node:assert/strict"
import { RATES, RATE_GROUPS_BY_TOOL, RATE_META } from "../lib/rates.ts"
import { sectionsData } from "../lib/data.ts"

test("tasas: valores base centralizados", () => {
  assert.deepEqual(
    {
      sfs: RATES.tss.sfsRate,
      afp: RATES.tss.afpRate,
      sfsCap: RATES.tss.sfsCap,
      afpCap: RATES.tss.afpCap,
      isrExempt: RATES.isr.exemptUpTo,
      itbisGeneral: RATES.itbis.general,
      itbisReduced: RATES.itbis.reduced,
      severanceDivisor: RATES.severance.dailyDivisor,
      fixedCharge: RATES.electricity.fixedCharge,
      fuelGallon: RATES.fuel.defaultGallonPrice,
      certificateWithholding: RATES.certificate.withholding,
      usdRate: RATES.exchange.usdToDop,
      aguinaldoMonths: RATES.aguinaldo.monthsPerYear,
    },
    {
      sfs: 0.0304,
      afp: 0.0287,
      sfsCap: 232230,
      afpCap: 464460,
      isrExempt: 416220.01,
      itbisGeneral: 0.18,
      itbisReduced: 0.16,
      severanceDivisor: 23.83,
      fixedCharge: 127.83,
      fuelGallon: 358,
      certificateWithholding: 0.1,
      usdRate: 60,
      aguinaldoMonths: 12,
    },
  )
})

test("tasas: cada herramienta financiera tiene nota de revisión", () => {
  const financeTools = sectionsData.finanzas.cards.filter((card) => card.isAvailable)
  for (const tool of financeTools) {
    assert.ok(
      Array.isArray(RATE_GROUPS_BY_TOOL[tool.slug]) && RATE_GROUPS_BY_TOOL[tool.slug].length > 0,
      `falta la nota de tasas para ${tool.slug}`,
    )
  }
})

test("tasas: todos los grupos tienen vigencia, revisión y fuente", () => {
  for (const [group, meta] of Object.entries(RATE_META)) {
    assert.match(meta.effectiveFrom, /^\d{4}-\d{2}-\d{2}$/, `${group}: effectiveFrom inválido`)
    assert.match(meta.reviewedAt, /^\d{4}-\d{2}-\d{2}$/, `${group}: reviewedAt inválido`)
    assert.ok(meta.source.length > 0, `${group}: falta la fuente`)
    assert.match(meta.sourceUrl, /^https:\/\//, `${group}: sourceUrl inválido`)
  }
})
