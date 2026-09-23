# Plan Holentia — checklist por fases

> Repo `daurydicaprio/holentia-app`. Rama trabajo `dev` → preview `dev.holentia.com`.
> Prod `holentia.com → main`. No tocar dominios.
> Principios: sin DB, sin registro, local-first privado (`holentia:*` en navegador), cero tracking.

## Estado base verificado (20-Sep-2026)
- [x] Stack: Next 15.2.8 + React 19 + Tailwind 3.3 + next-themes + Framer Motion + Lucide + Chart.js
- [x] Cobertura: 6/32 tools (`diario-guiado, test-lenguajes-amor, calculadora-hidratacion, crear-presupuesto-personal, calculadora-interes-compuesto, calculadora-prestamo`)
- [x] Vercel `holentia-app prj_kzMB8iQtVXy722bi8R3C05PpEKme` Node 22.x, env vacío
- [x] GitHub `dev + main`, en `dev`, `?? .gitignore` pendiente trackear
- [x] Sin `node_modules` local

---

## Fase 0 — Calculadora consumo eléctrico (Finanzas) — EN CURSO
Tarjeta `finanzas`: `Calculadora consumo eléctrico` / slug `calculadora-consumo-electrico` / Tipo D draft.
Réplica factura RD actual subsidiada: cargo fijo `127.83` base fija + tramos `200x6.17 + 100x8.71 + resto x13.04`.
Objetivo: usuario anticipa total a pagar + subsidio gobierno estimado (~45% ref. facturas 397/438/445 kWh) + promedio RD$/kWh.
- [x] Spec cerrada con 3 facturas (Jul 45.47%, Ago 45.02%, Sep 44.65% — % no fijo, usar estimado con disclaimer)
- [x] Card en `lib/data.ts` finanzas `isAvailable:true`
- [x] Componente `components/tools/electricity-calculator/electricity-calculator.tsx` plantilla Finanzas + responsive + draft local
- [x] Ruta `app/calculadora-consumo-electrico/page.tsx` vía `ToolPageClient section=finanzas`
- [x] Añadir slug a `section-swipe-navigation.tsx` toolRoutes
- [x] Verificar `tsc + build` — `next build OK, ruta /calculadora-consumo-electrico 2.72 kB` (errores TS preexistentes en todo el proyecto, build los ignora por config)
- [ ] Preview `dev.holentia.com` tras push a `dev`
Fórmula: si `kwh < 700`: `total = 127.83 + min(kwh,200)*6.17 + min(max(kwh-200,0),100)*8.71 + max(kwh-300,0)*13.04`, `subsidio_est = total*0.819` (±RD$100 por picos de generación y consumo), `sin_subsidio_est = total+subsidio_est`. Si `kwh >= 700`: `total = 127.83 + kwh*13.04` sin tramos ni subsidio.

## Fase 1 — Seguridad e higiene
- [ ] `pnpm install` (hoy no existe `node_modules`)
- [ ] Trackear `.gitignore` (hoy untracked, riesgo `.env.local`)
- [ ] Parche mínimo seguro:
  - [ ] `next 15.2.8 → 15.5.x` (corrige RCE GHSA-p293 + DoS)
  - [ ] `react 19.0 → 19.3`, `@types/react 19.0 → 19.3`, `@types/react-dom igual`
  - [ ] `next-themes 0.2.1 → 0.4.6`, `chart.js 4.4 → 4.5`, `@radix-ui/react-slider 1.3.6 → 1.4.7`
  - [ ] NO hacer aún: tailwind 4, framer-motion 13, lucide 1.x, eslint 10, TS 7
- [ ] `next.config.mjs:5-8` quitar `ignoreBuildErrors + ignoreDuringBuilds`
- [ ] Fijar Node `22.x` igual que Vercel (local hoy 25)
- [ ] Quitar `alert()` en `compound-interest-calculator.tsx:51`, `loan-calculator.tsx:61`
- [ ] Quitar `console.log` en `use-compound-interest-calculator.ts:450`, `calculator-charts.tsx:228,232`, `use-budget-simulator.ts:217`
- [ ] Hidratación: no vibrar por tecla (`hydration-calculator.tsx:45-49`), solo al mostrar resultado
- [ ] Verificación: `pnpm tsc --noEmit` + `pnpm build` + `vercel inspect dev.holentia.com Ready`

## Fase 2 — Consistencia color por sección (prioridad) — HECHA
Fuente única: vars `app/globals.css:100-150` + dark `153-188`.
Canónicos: mente `#1976d2`, relaciones `#7c3aed`, cuerpo `#ffa000`, finanzas `#388e3c`.
- [x] `tailwind.config.ts` color `relaciones` + ~60 entradas safelist
- [x] `lib/utils.ts` `getSectionColor` retorna `relaciones`
- [x] `tool-page-client.tsx` rama `relaciones #7c3aed`
- [x] `unified-header.tsx` rama `relaciones rgba(124,58,237,0.7)`
- [x] `footer.tsx` rama `relaciones`
- [x] `tools-grid.tsx` rama `relaciones text-relaciones-DEFAULT`
- [x] `menu-button.tsx` quitada clase dinámica rota `ring-${section}-400` (el ring open ya sale de `accentColor` en boxShadow)
- [x] `logo.tsx` aura unificada a RGB canónicos
- [x] Nota: vars `globals #1565c0/#ef6c00/#2e7d32` se dejan — fueron oscurecidas a propósito para contraste en cards; los hex inline de headers usan canónicos. No tocar sin revisión visual.
- [x] `tsc 0 errores + next build OK`

## Fase 3 — Local privado — HECHA
- [x] `lib/storage.ts`: `storageGet/Set/Remove/ClearAll`, keys `holentia:{slug}:{draft|simulations|entries}:v1`, `try/catch`, `window guard`
- [x] Taxonomía: `E efímero` (perfil-riesgo, test-amor) / `D draft` autosave 500ms + `Guardado local ✓` / `S snapshots` máx 3
- [x] `budget D` (borrador ingresos/gastos + botón borrar) · `compound D+S` (inputs + sims persistentes + `clearCompoundData`) · `préstamo D+S` (inputs + sims persistentes + `clearLoanSimulations`, Restablecer intacto) · `diario D` (clave `v1` con migración legada + Borrar todo) · `consumo eléctrico D` (migrado a helper)
- [x] `alert()` sustituidos por banner inline en compound/préstamo
- [x] Botón `Borrar mis datos`/`Borrar todas`/`Borrar todo` por tool + `ClearAllData` global en Ayuda
- [x] `politica-cookies` lista las 7 claves + `README` privacidad y catálogo (7 tools)
- [x] Cero fetch/analytics/env nuevos — `vercel env ls` vacío

## Fase 4 — Plantilla + móvil + muertos
- [ ] Borrar muertos: `header.tsx`, `desktop-header.tsx` (retorna null), `mobile-header.tsx`, `main-menu-button.tsx` (duplicado + `w-${menuWidth}:202` roto). Solo `UnifiedHeader + MenuButton`
- [ ] Fix `theme-provider.tsx:14-16` flicker (retorna children sin provider)
- [ ] `postcss.config.mjs` añadir `autoprefixer`
- [ ] Unificar `mobile-fab` vs `scroll-to-top` duplicados
- [ ] Tipar `loan-calculator.tsx:30 any[]`
- [ ] `formatCurrency` a `useCallback` (hoy recrea Chart.js en `calculator-charts.tsx:213,364`), bajar `animation 2000ms` en móvil
- [ ] Regla nueva tool (ver `design.md § Plantilla`): `app/{slug}/page.tsx → ToolPageClient {section,tool}`, color sección, `useMediaQuery 768`: wizard si >2 bloques/tablas (`budget-simulator.tsx:97-197 p-4`), si simple responsive (`p-6 grid sm:grid-cols-2`)

## Fase 5 — Finanzas foco + deploy
- [ ] `planificador-ahorros Tipo S` reutilizando hooks compound/budget
- [ ] `tracker-gastos-hormiga Tipo D`
- [ ] `test-perfil-riesgo Tipo E` hacer/ver/imprimir, sin persistencia
- [ ] Backlog pedido: `calculadora de calorías` (cuerpo, Tipo D) + `fecha de corte y vencimiento tarjeta de crédito` (finanzas, Tipo D/E a definir)
- [ ] Merge `dev → main`, verificar `curl -sI https://holentia.com 200` + `vercel inspect holentia.com` nuevo ID

## Fase 6 — Mayores diferidos (solo con Fase 0-4 verde)
- [ ] Tailwind 4, framer-motion 13, lucide 1.x, eslint 9, TS nuevo — con Preview `dev.holentia.com` verificado

---

## Comandos de verificación (solo lectura)
```bash
pnpm tsc --noEmit
pnpm build
vercel inspect https://dev.holentia.com
curl -sI https://holentia.com
gh repo view daurydicaprio/holentia-app --json name,defaultBranchRef,pushedAt
```
