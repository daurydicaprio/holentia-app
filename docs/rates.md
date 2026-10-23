# Tasas y referencias financieras

Fuente única: `lib/rates.ts`. Los componentes **no** escriben tasas; importan de ahí. Las fórmulas puras de `lib/calculations/` también leen el mismo archivo, y `tests/rates.test.mjs` falla si cambia un valor sin actualizar el caso.

- **Última revisión:** 23 de octubre de 2026 (`REVIEWED_AT`).
- **Sin red en runtime:** son valores estáticos; la app no consulta APIs ni bancos.
- **Nota visible:** `components/rates/rates-note.tsx` se renderiza en las 17 herramientas financieras desde `ToolPageShell`.

## Valores centralizados

| Grupo | Valores | Vigente desde | Fuente |
|---|---|---|---|
| TSS | SFS 3.04% · AFP 2.87% · topes RD$232,230 / RD$464,460 | 2026-02-01 | TSS — Resolución 01-2025 |
| ISR | Exento hasta RD$416,220.01; tramos 15/20/25% | 2026-01-01 | DGII — escala anual de asalariados |
| ITBIS | General 18% · reducido 16% | 2026-01-01 | DGII |
| Prestaciones | Divisor diario 23.83 | 2026-01-01 | Ministerio de Trabajo — Ley 16-92 |
| Electricidad | Cargo fijo RD$127.83; tramos RD$6.17 / RD$8.71 / RD$13.04; umbral 700 kWh; factor 0.819 | 2026-10-01 | SIE/EDES — pliego tarifario |
| Combustible | Galón de referencia RD$358; 3.78541 L/galón | 2026-10-23 | MICM |
| Certificados | Referencia 7%–11%; retención 10%; año 365 días | 2026-01-01 | Superintendencia de Bancos / SIMV |
| Tipo de cambio | RD$60 por US$1 (redondeo de referencia BCRD) | 2026-10-23 | BCRD |
| Aguinaldo | 12 meses; pago máximo 20 de diciembre; exento de ISR | 2026-01-01 | Ministerio de Trabajo — arts. 219–222 |
| Inflación | Referencia anual 4% | 2026-01-01 | BCRD |
| General | Referencias para herramientas sin tasa propia | 2026-10-23 | BCRD, DGII, TSS, MT y SIE |

## Cómo actualizar una tasa

1. Cambia el valor en `RATES` y, si aplica, la `effectiveFrom` en `RATE_META` (`lib/rates.ts`).
2. Actualiza `REVIEWED_AT` y la fecha de revisión del grupo.
3. Ajusta el caso dorado de `tests/rates.test.mjs` y los tests de la calculadora afectada.
4. Revisa la copy que menciona la tasa (`/metodologia`, guías y FAQ) y la fecha que muestra `RatesNote`.
5. Ejecuta `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm links:check`, `pnpm build` y `pnpm audit:seo`.
6. Si el cambio es editorial, actualiza también la guía correspondiente y `docs/rates.md`.

## Checklist anual

- [ ] TSS: salario mínimo, topes y porcentajes.
- [ ] DGII: escala ISR, exenciones y ITBIS.
- [ ] Ministerio de Trabajo: divisor de prestaciones y reglas de aguinaldo.
- [ ] SIE/EDES: cargo fijo, tramos y subsidio.
- [ ] MICM: precio de referencia de combustibles.
- [ ] BCRD: tipo de cambio y meta de inflación.
- [ ] Bancos/SIMV: rango de referencia de certificados.
- [ ] `pnpm test` y build en verde antes de publicar.

## Nota técnica

Los módulos de `lib/calculations/` importan `../rates.ts` con extensión explícita para que `node:test` pueda resolverlos sin bundler. TypeScript lo permite con `allowImportingTsExtensions`; Next resuelve el archivo en build.
