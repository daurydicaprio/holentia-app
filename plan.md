# Plan Holentia — checklist por fases

> Repo `daurydicaprio/holentia-app`. Rama trabajo `dev` → preview `dev.holentia.com`.
> Prod `holentia.com → main`. No tocar dominios.
> Principios: sin DB, sin registro, local-first privado (`holentia:*` en navegador), cero tracking.

## Estado actual (09-Oct-2026) — 11 tools en `dev` + `main`
- [x] Stack: Next 15.5.26 + React 19.3 + Tailwind 3.4 + next-themes 0.4.6 + Framer Motion 12 + Lucide + Chart.js 4.5 — `tsc 0 errores`, build estricto sin ignores
- [x] Cobertura: 11 tools (`diario-guiado, test-lenguajes-amor, calculadora-hidratacion, calculadora-calorias, crear-presupuesto-personal, calculadora-interes-compuesto, calculadora-prestamo, calculadora-consumo-electrico, tarjeta-corte-vencimiento, calculadora-interes-tarjeta, test-perfil-riesgo`)
- [x] Vercel `holentia-app` Node 22.x, env vacío, `dev.holentia.com → dev`, `holentia.com → main`
- [x] `tsc 0 errores + next build OK` en estricto

---

## Fase 0 — Calculadora consumo eléctrico (Finanzas) — HECHA
Tarjeta `finanzas`: `Calculadora consumo eléctrico` / slug `calculadora-consumo-electrico` / Tipo D draft.
Réplica factura RD actual subsidiada: cargo fijo `127.83` base fija + tramos `200x6.17 + 100x8.71 + resto x13.04`.
- [x] Spec cerrada con 3 facturas (Jul 45.47%, Ago 45.02%, Sep 44.65% — % no fijo, usar estimado con disclaimer)
- [x] Card en `lib/data.ts` finanzas `isAvailable:true`
- [x] Componente `electricity-calculator.tsx` + ruta vía `ToolPageClient section=finanzas` + slug en `section-swipe-navigation`
- [x] Rediseño factura-papel (cabecera celeste, filas mono, barra amarilla total) + slider/medidor + tabs RD$
- [x] Regla 700 kWh (tasa plena sin tramos) + aviso ±RD$100
Fórmula: si `kwh < 700`: `total = 127.83 + min(kwh,200)*6.17 + min(max(kwh-200,0),100)*8.71 + max(kwh-300,0)*13.04`, `subsidio_est = total*0.819`, `sin_subsidio_est = total+subsidio_est`. Si `kwh >= 700`: `total = 127.83 + kwh*13.04` sin tramos ni subsidio.

## Fase 1 — Seguridad e higiene — HECHA
- [x] `pnpm install` + `.gitignore` trackeado con ignores estándar
- [x] Parche: `next 15.2.8 → 15.5.26` (RCE+DoS), `react 19.3`, `@types/react 19.3`, `next-themes 0.4.6`, `chart.js 4.5.1`, `radix-slider 1.4.7`, `framer-motion 12.43` (tipos React 19), `@radix-ui/react-slot 1.3.3` (faltaba), `engines node 22.x`
- [x] Quitados `ignoreBuildErrors + ignoreDuringBuilds` — 48 → 0 errores TS (guards `notFound`, motion v12, Chart.js v4 API, `useCallback`-safe)
- [x] `alert()` → banner inline en compound/préstamo; fuera `console.log`; hidratación sin vibración por tecla
- [x] Muertos borrados: `header/desktop/mobile-header.tsx`, `main-menu-button.tsx`

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
- [x] Taxonomía: `E efímero` (test-amor) / `D draft` autosave 500ms + `Guardado local ✓` / `S snapshots` máx 3 · `perfil-riesgo` pasó a **D** (guarda último test + fecha por pedido del autor)
- [x] `budget D` (borrador ingresos/gastos + botón borrar) · `compound D+S` (inputs + sims persistentes + `clearCompoundData`) · `préstamo D+S` (inputs + sims persistentes + `clearLoanSimulations`, Restablecer intacto) · `diario D` (clave `v1` con migración legada + Borrar todo) · `consumo eléctrico D` (migrado a helper)
- [x] `alert()` sustituidos por banner inline en compound/préstamo
- [x] Botón `Borrar mis datos`/`Borrar todas`/`Borrar todo` por tool + `ClearAllData` global en Ayuda
- [x] `politica-cookies` lista las 7 claves + `README` privacidad y catálogo (7 tools)
- [x] Cero fetch/analytics/env nuevos — `vercel env ls` vacío

## Fase 4 — Plantilla + móvil + muertos — HECHA (en Fase 1)
Muertos borrados, icons opacos, hover tilt único en cards (fix franja), `any[]` tipados, Chart.js v4 API.
- [x] Higiene completa: `postcss autoprefixer`, `AmortizationRow` en `types` (fin `any[]` préstamo), `formatCurrency useCallback` en 3 hooks, `MobileFab` → wrapper de `ScrollToTop mobileOnly` (haptics + color relaciones), animación charts 2000→600ms en móvil.
- [x] Hidratación rediseñada (patrón 5-col como luz/tarjeta): chips icono actividad/clima (sin selects), héroe ámbar con número + minis 3-col + desglose fórmula, plan del día 5 hitos (acento `sky` solo agua), tarjeta contraste verde/rojo de señales, haptics, draft intacto.

## Fase 5 — Finanzas foco + deploy
- [ ] `planificador-ahorros Tipo S` reutilizando hooks compound/budget
- [ ] `tracker-gastos-hormiga Tipo D`
- [x] `test-perfil-riesgo` (finanzas, **Tipo D**, quiz **12 preguntas** lenguaje principiante/escenarios, niveles 1–3 con candado de conocimiento, gráfico arco SVG 5 niveles (4–5 rojos, AFI/mercado local), 3 pasteles situacionales A/B/C con montos, fondo de emergencia 2/4/6× sueldo, capital+moneda, chips tasa 8/10/15%, banner &lt;$3k, proyección 5–10 años + link interés compuesto, anti-hacerte-rico 20–30 años)
- [x] `calculadora de calorías` (cuerpo, Tipo D, Mifflin-St Jeor, objetivos Bajar grasa −20% / Mantener / Subir +10%, guía EL EQUILIBRIO ES LA CLAVE + báscula)
- [x] `tarjeta-corte-vencimiento` (finanzas, Tipo D, timeline, gráfico ciclo, nombre+terminación tarjeta, borradores)
- [x] Cuerpo reordenado: activas primero (calorías, hidratación)
- [x] `calculadora de interés de tarjeta` (tasa default 60% anual ajustable, Tipo D, meses para liquidar + interés total, aviso si pago ≤ interés mensual)
- [x] Merge `dev → main` (09-Oct-2026), verificar `curl -sI https://holentia.com 200` + `vercel inspect holentia.com` nuevo ID

## Fase 6 — Mayores diferidos
- [ ] Tailwind 4, framer-motion 13, lucide 1.x, eslint 9, TS nuevo — con prod verificada

---

## Comandos de verificación (solo lectura)
```bash
pnpm tsc --noEmit
pnpm build
vercel inspect https://dev.holentia.com
curl -sI https://holentia.com
gh repo view daurydicaprio/holentia-app --json name,defaultBranchRef,pushedAt
```
