# Plan Holentia — checklist por fases

> Repo `daurydicaprio/holentia-app`. Rama trabajo `dev` → preview `dev.holentia.com`.
> Prod `holentia.com → main`. No tocar dominios.
> Principios: sin DB, sin registro, local-first privado (`holentia:*` en navegador), cero tracking.

## Estado actual (20-Oct-2026) — 35 herramientas (grasa corporal + planificador de comidas + rutinas HIIT + seguimiento de hábitos + proteína + test de calidad del sueño) en `dev` y producción; roadmap de herramientas completado (0 «Próximamente»); proteína de calorías corregida; red de enlaces de cuerpo, favicon H y pase UI/UX móvil completos
- [x] Stack: Next 15.5.26 + React 19.3 + Tailwind 3.4 + next-themes 0.4.6 + Framer Motion 12 + Lucide + Chart.js 4.5 — `tsc 0 errores`, build estricto sin ignores, `lint 0`
- [x] Cobertura: **35 herramientas** activas + **0 tarjetas «Próximamente»** en `lib/data.ts`; sitio de **46 URLs** (home + 4 hubs + directorio + 35 herramientas + 5 informativas)
- [x] SEO/GEO moderno: metaTitle+metaDescription por tool, JSON-LD (WebApplication/Breadcrumb/FAQPage/Collection/WebSite), OG por ruta (**46 archivos**), twitter `summary_large_image`, robots con bots de IA, `lang es-DO`, manifest, footer enlazado (sin páginas huérfanas), sitemap 46 URLs con lastmod fijo, llms.txt 35 tools; auditorías registradas en la skill `seo-geo-audit`
- [x] UI/UX móvil: pase completo por herramientas (cuerpo, mente, relaciones, finanzas ×3) y superficies globales (chrome, hubs, informativas, shell) — contraste AA con tiers por sección, tap targets ≥40/44px, inputs ≥16px sin zoom iOS, recetas en `design.md`
- [x] Rendimiento de campo (Fase BL, 19-Oct-2026): cabecera y héroe del planificador en SSR, variantes responsive por CSS, CLS **0**, LCP móvil **2.1 s**, Lighthouse **87-88/100** y axe **12/12**
- [x] Vercel `holentia-app` Node 22.x, env vacío, `dev.holentia.com → dev`, `holentia.com → main` — **`main` se sincroniza con `dev` al cierre de cada fase (sync previa: Fase BK)**
- [x] `tsc 0 errores + next build OK + pnpm lint 0` en estricto
- [x] **Sync a `main` aprobada** por el usuario (19-Oct-2026): `dev` → `main` por fast-forward con la Fase BK (planificador de comidas). Producción con **34 herramientas activas y 0 «Próximamente»**; roadmap de herramientas completado. Los cambios siguientes vuelven a requerir aprobación explícita antes de tocar `main`.
- [x] **Deploy de producción (20-Oct-2026)**: `main` avanzado por fast-forward a `0c59ac1` (Fase BM) y desplegado en Vercel. `holentia.com/calculadora-grasa-corporal` responde **200**, con title, canonical, H1 y OG correctos; sitemap con **46** URLs. Incluye la Fase BL (`fa86ef2`/`55de0e6`), por lo que el header/héroe SSR queda publicado. Queda pendiente repetir Lighthouse de campo sobre producción.

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
- [x] `tools-grid.tsx` rama `relaciones text-relaciones` (corregido: la clave DEFAULT genera clase sin sufijo)
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
- [x] `politica-cookies` lista las 13 claves `holentia:*` activas (11 tools con persistencia, compuesto/préstamo con simulations) + `README` privacidad y catálogo
- [x] Cero fetch/analytics/env nuevos — `vercel env ls` vacío

## Fase 4 — Plantilla + móvil + muertos — HECHA (en Fase 1)
Muertos borrados, icons opacos, hover tilt único en cards (fix franja), `any[]` tipados, Chart.js v4 API.
- [x] Higiene completa: `postcss autoprefixer`, `AmortizationRow` en `types` (fin `any[]` préstamo), `formatCurrency useCallback` en 3 hooks, `MobileFab` → wrapper de `ScrollToTop mobileOnly` (haptics + color relaciones), animación charts 2000→600ms en móvil.
- [x] Hidratación rediseñada (patrón 5-col como luz/tarjeta): chips icono actividad/clima (sin selects), héroe ámbar con número + minis 3-col + desglose fórmula, plan del día 5 hitos (acento `sky` solo agua), tarjeta contraste verde/rojo de señales, haptics, draft intacto.

## Fase 5 — Finanzas foco + deploy
- [ ] `planificador-ahorros Tipo S` reutilizando hooks compound/budget
- [ ] `tracker-gastos-hormiga Tipo D`
- [x] `test-perfil-riesgo` (finanzas, **Tipo D**, quiz **12 preguntas** lenguaje principiante/escenarios, niveles 1–3 con candado de conocimiento, gráfico arco SVG 5 niveles colapsado por defecto con botón "Ver niveles de inversor · Daury" (4–5 rojos, AFI/mercado local), resultado en **9 bloques con jerarquía de pasos** (`SectionHeader` con badge **Paso 1 fondo · Paso 2 dinero · Paso 3 distribución · Extra proyección**, títulos `text-2xl`, cuerpo `text-sm`, `space-y-8/10`, tarjetas con borde), héroe **"Eres Conservador"** (campo `profileName` en `LEVELS`) + pill "Sugerencia: nivel N de 5" + descripción del nivel plegada en **`disclosure.tsx`** (details/summary + icono Info, labels con information scent: nivel / mínimos y penalidades / "lo dejas parado"), fondo con **tarjeta "Sugerencia para tu colchón" en 4 tramos** (<RD$5,000 cuenta · RD$5,000–10k 100% AFI · RD$10k–35k 20% cuenta + 80% AFI · ≥RD$35k 30/40/30 cuenta/AFI/cert vía web · USD 100% fondo 30 días) con barra apilada y montos exactos (suma = colchón), 2 cajas explícitas **"Si inviertes tu fondo" (+rendimiento) / "Si lo dejas parado" (−con inflación ~3%)**, línea de estado deduplicada, CTAs "Aprende a crear tu presupuesto" y "Comprende tu fecha de corte y vencimiento", montos en pasteles A/B/C solo si capital ≥ umbral por moneda (DOP ≥ RD$100,000 / USD ≥ $3,000) o 1 tarjeta "Tu distribución sugerida" + instrumentos alcanzables si no, **distribución respeta mínimos reales**: `feasibleSlices` sube rodajas al mínimo quitando de las que sobren y si no cabe todo → `singleSliceFor` (1 instrumento: A→AFI líquido · B→Certificado · C→AFI líquido · USD→Fondo 30 días), pcts fraccionales con monto exacto al mostrar (ej. RD$15,000 → 5,000/10,000), banner "aún no alcanza para abrir un instrumento" cuando < piso (RD$5,000 / $200), mínimo invertir RD$5,000 / USD $200 con cap de nivel (DOP RD$5,000 · USD $3,000, chip héroe "Capital pequeño…"), fondo de emergencia FUERA de los pasteles (chips Sin fondo default · 2× · 4× + input % ahorro → meses al colchón con **gráfico `FundProjectionChart`** colchón vs meta 2× punteada, input % oculto si ya hay ≥2× + caja "Ya tienes tu colchón mínimo ✓", rendimiento vs inflación, opciones AFI/certificado/fondo 30 días gateadas a DOP con mínimos RD y penalidad 3% resumida, links corte/vencimiento y **`crear-presupuesto-personal`**), pasteles USD sin AFI (nivel 1 = 100% Fondo 30 días · nivel 2 usa Fondo 30 días), chips tasa 8/10/15% (default 8 DOP / 10 USD, moneda default DOP con placeholder adaptativo), proyección 5–10 años + links interés compuesto y tarjeta corte/vencimiento, anti-hacerte-rico 20–30 años)
- [x] `test-perfil-riesgo` **ronda 6** (feedback 13 puntos, reemplaza lo de la ronda 5): héroe sin "Eres" → título = `profileName` + **pill "Quédate en el nivel N"** (fijo) + copy de razón sin prefijo + `blurb` del nivel bajo la razón (inflado por `disclosure`), títulos de lista/arco solo **"Nivel N"** (nombre de perfil va en el copy), **arco navegable** (`selectedLevel`/`onSelect`, clic colorea fila + nodo, "Tuyo" solo nivel activo, inactivos `opacity-60`/`INACTIVE_GRAY`), copia "tu ingreso es estable" (sin contradecir estabilidad), **umbral pasteles DOP RD$100,000 → RD$50,000** (USD $3,000 sin cambio), **colchón >RD$50,000 → 20% cuenta + 56%/24% AFI/cert (regla 70/30)**, **tasas editables por instrumento** (`rates` en el draft, `RateKey afi/cert/afi30/etf/usd30`, defaults 8/6/9/10/10, grid en Paso 2 con nota por campo, sin chips globales), **% ahorro = chips 5/10/15/20 (default 10) + campo manual**, **proyección ponderada por rodaja** (`sliceRate` por instrumento, integrada al Paso 3 con "Tasa combinada ~N%", pie cita solo las tasas de la moneda activa), input % del ahorro ancho fijo (wrapper `w-24`, sin salto de línea), bloque **"¿Prefieres no invertir?"** reescrito (tarjeta, 2–3 días antes del vencimiento, CTA flecha a la derecha), bloque **instituciones SIB** en paleta `sky` con `Landmark` + `href="#"`, gráfico colchón con **curva azul punteada "Ahorro + AFI líquido (~N%)"** y altura 240px, money inputs `type=text` + `filterNumeric/formatWithCommas` (coma de miles). Verificado: `tsc 0` · `next build OK` · 54/54 tests de lógica · capturas claro/oscuro/USD.
- [x] `test-perfil-riesgo` **ronda 7** (auto-auditoría 13 puntos A–M): `profileName` **sin artículo** ("Inversor en crecimiento", "Buscador de oportunidades", "Inversor apalancado", "Jugador de derivados"), draft **a medio camino reanuda en el quiz** (`phase: quiz` + `currentQuestion = answered.length`, ya no exige 12 respuestas), **`Borrar mis datos` → `resetAll()`** (el autosave ya no re-graba el borrador a los 500ms), **"Volver a finanzas" solo navega** (conserva el test guardado), proyección con **gate `capital > 0 && maxTogether > 0`** + pie **`rateSummary(...)`** (cita solo las tasas de rodajas realmente usadas: DOP "AFI líquido 8% · certificado 6%", USD "fondo 30 días 10%", dedupe ETF/acciones, "Cuenta a la vista" excluida, sin tasas → "sin inversión (todo en cuenta)"), caja de colchón **verde con `rateSummary` si `fundCanInvest`, si no caja ámbar "Todavía no abres el instrumento"** con el mínimo real (sin "+RD$0" falso), `FundProjectionChart` con **prop `rateLabel`** y leyenda/caption "con la tasa que definiste (~N%)", nota del fondo **condicional** (1 instrumento por mínimos / USD "todo va al fondo a 30 días"), quiz accesible (**botón "← Atrás"**, opción marcada `aria-pressed`, filas de nivel `role="button" tabIndex aria-pressed aria-label` + Enter/Espacio), banner capital **ámbar/rojo según `canInvestNow`** (USD $200–3,000 ámbar con mínimo, por debajo rojo), tasas **`onBlur` normaliza 0–100%** (vacío/inválido → default; `readRate` clampa el cálculo), CTA instituciones → **`https://www.sb.gob.do/supervisados/`** (`target="_blank" rel="noopener noreferrer"`). Verificado: `tsc 0` · `next build OK` · 69/69 tests de lógica (54 + 15 de `readRate`/`sliceRate`/`rateSummary`) · 32 aserciones e2e vía CDP · capturas claras (héroe, caja ámbar, banner USD, quiz con Atrás).
- [x] `test-perfil-riesgo` **ronda 8** (feedback 8 capturas): **montos `10,000.00`** (`formatWithCommas` ya no toma la coma existente como decimal: escribir sobre "1,000" ya no da "1.0000"; coma = miles siempre, punto = máximo 2 decimales; `inputMode="decimal"` en capital e ingreso), **tasas con `filterRate` = 2 dígitos + decimales** (pegar "12,000.00" → "12.00", "350" → "35", tope efectivo 99.99 con `onBlur` y `readRate`), **USD fondo a 30 días default `2.5%`** (hint "Referencia ~2.5%: casi siempre, a veces un poco más"), héroe: **recuadro translúcido `bg-white/15` alrededor de "Nivel 1"** + microanimación `animate-fadeIn` que se repite en cada apertura (`Disclosure` remonta el contenido con un `key` por toggle), **"Instrumentos a los que alcanza tu monto" movido bajo los pasteles** y convertido en `Disclosure` con icono Info + chevron (arranca cerrado), **CTA "Comprende tu fecha de corte y vencimiento" en contorno** (borde verde sin relleno sólido, mensaje arriba y libre para 2 líneas), **"Sugerencia para tu colchón" en 3 bloques grid `sm:grid-cols-3`** (20/56/24, cada bloque con su fondo claro y su "why"), **bloque "Sin fondo" rediseñado en 5 sub-bloques** (qué es + cuánto ahorras + gráfico + **recuadro de interés compuesto** "el mismo colchón toma ~N meses en vez de M: ahorra ~X meses" (`monthsToFundInvested`) + **recuadro de mínimos** AFI RD$5,000 / fondo y certificado RD$10,000, "elige el que más te convenga; históricamente las AFI son las que más rinden"), `FundProjectionChart` con la línea **"Ahorro + AFI" en `#0ea5e9` a 3px sin relleno** (antes `#0284c7` con relleno: se perdía sobre el verde). Verificado: `tsc 0` · `next build OK` · **94/94 tests de lógica** (54 + 15 r7 + 25 r8) · **41 aserciones e2e CDP** (2 escenarios: con colchón 80k y sin fondo) + 5 en tema claro + conteo de píxeles del gráfico (1,435 px `#0ea5e9`).
- [x] `test-perfil-riesgo` **ronda 9** (plan aprobado: niveles + héroe + tasas + motor + gráfico + secciones + inflación): **niveles/copy N1–N5** en `risk-levels-graphic.tsx` con `profileName` nuevos **N2 "Invertir en la bolsa de valores EE.UU. / mundial"** y **N3 "Invertir en acciones individuales"** (N1 sigue "Conservador"); **héroe en 1 solo `<p>`** (`result.reason` + `blurb`, h2 `text-3xl sm:text-4xl lg:text-5xl max-w-3xl`); **campos de tasa vacíos con placeholder gris = default** (`DEFAULT_RATES` 8 / 7.5 / 9 / 8.5 / 2.5, `EMPTY_RATES` en el draft, escribir no rellena, blur no rellena, grid 2/3/6 columnas y monto `sm:max-w-md`); **motor: el nivel limita los instrumentos y el monto reparte los %** (`USD_RATE = 60`, `isUsdLabel`, `sliceMinFor`, `adjustSituation`, `dopBaseSlices`/`usdBaseSlices` — `Math.min(Math.max(capital*0.1, 500), capital)` con fallback "Cuenta en dólares 100%" si la restante < US$200 —, `distributionOptionsFor`/`distributionFor`; N1 = 4 métodos locales + cuenta USD desde US$500, N2 = +ETF, N3 = +acciones; mínimos AFI/cuenta RD$5,000, fondo/cert RD$10,000, cuenta USD US$500, fondo 30 días US$200; `LEVEL_CAP = {DOP: 5000, USD: 3000}` → chip "Capital pequeño" y banner "aún no alcanza para abrir un instrumento"); **Paso 3** con badge `US$1 ≈ RD$60 · el peso pierde ~3–5% anual frente al dólar` (solo DOP con instrumentos USD), filas USD "RD$X · ≈ $Y" y disclosure agrupado En pesos / En dólares; **gráfico del Paso 1 interactivo** (`FundProjectionChart` con `mode`, control segmentado "Solo ahorrar | Ahorrar + invertir", `pointRadius` 2.5/1.8/1.2 a ≤24/≤48 meses, `pointHoverRadius: 5`, `endLabelsPlugin` con etiqueta persistente del último punto y recuadro celeste `border-sky-200 bg-sky-50` con las 2 variantes de copy, solo sin fondo); **secciones rediseñadas**: 3 tarjetas numeradas en el Paso 1 (`1 · Ver detalles` con tinte verde, `2 · ¿Prefieres no invertir tu fondo de emergencia?` con la pregunta "¿cuándo fue tu última emergencia?" dentro de "Leer más", `3 · ¿No dominas…` con CTA en fila `sm:justify-between` y botón contorneado sin anidar); **inflación ~4% (meta del BCRD)** en las 3 cajas + instituciones **SIB** (AFI/certificados) y **SMV** (bonos/reportos) + caption de proyección "monto × (1 + tasa) por año"; **dead code eliminado** (`portfolios`, `portfoliosUsd`, `feasibleSlices`). Verificado: `tsc 0` · `next build OK` · **88/88 tests de lógica** (`extract.py` + `tsc --target es2020` + Node) · **49/49 aserciones e2e CDP** (5 escenarios: nivel 1 DOP 10k/30k/40k/150k/600k, sin fondo con alternancia de modo, nivel 2 USD 1,000, nivel 2 DOP 150k + capital 4,000, capturas oscuras/móvil) + 14 capturas claro/oscuro/móvil.
- [x] `test-perfil-riesgo` **ronda 10** (pulido de 6 detalles tras feedback): **título del héroe = nombre de perfil establecido** (`profileName` restaurados: Conservador / Inversor en crecimiento / Buscador de oportunidades / Inversor apalancado / Jugador de derivados) y las frases "Invertir en la bolsa de valores EE.UU. / mundial" e "Invertir en acciones individuales" pasan al **copy** (`blurb`, dentro del mismo `<p>` del héroe); **"Ver niveles" como píldora compacta arriba-derecha dentro del recuadro del héroe** (icono + label + chevron, `absolute right-3 top-3 sm:right-5 sm:top-5`, `border-white/40 bg-white/15`) que abre el panel de los 5 niveles justo debajo del héroe — se elimina la barra ancha "Ver niveles de inversor · Daury" (el aviso "Apetito alto, conocimiento bajo" sigue a ancho completo); **Paso 1 sin numeración**: las 3 tarjetas quedan "Ver detalles: mínimos, horarios y penalidades" / "¿Prefieres no invertir tu fondo de emergencia?" / "¿No dominas tus fechas de corte y vencimiento?…"; **Paso 2 en 2 recuadros centrados** (`grid gap-4 lg:grid-cols-2`: izquierda "¿Cuánto planeas invertir?" + monto + chips de moneda centrados y **copy bajo el monto** "Es lo que repartes entre instrumentos en el Paso 3. Tu fondo de emergencia no se invierte…", derecha tasas en `grid-cols-2` con títulos y notas centrados, caja izquierda centrada verticalmente con `flex flex-col justify-center`); **mercado de valores local default 10%** (`DEFAULT_RATES.mv = "10"` + hint); **"En pesos"/"En dólares" como píldora centrada** `rounded-full border-[#388e3c]/40 bg-[#388e3c]/15 px-4 py-1 text-sm` en el disclosure de instrumentos. Verificado: `tsc 0` · `next build OK` · **94/94 tests de lógica** · **55/55 aserciones e2e CDP** + capturas héroe nivel 1/2 (claro), Paso 2, píldoras "EN PESOS/EN DÓLARES" y móvil.
- [x] `calculadora de calorías` (cuerpo, Tipo D, Mifflin-St Jeor, objetivos Bajar grasa −20% / Mantener / Subir +10%, guía EL EQUILIBRIO ES LA CLAVE + báscula)
- [x] `tarjeta-corte-vencimiento` (finanzas, Tipo D, timeline, gráfico ciclo, nombre+terminación tarjeta, borradores)
- [x] Cuerpo reordenado: activas primero (calorías, hidratación)
- [x] `calculadora de interés de tarjeta` (tasa default 60% anual ajustable, Tipo D, meses para liquidar + interés total, aviso si pago ≤ interés mensual)
- [x] Merge `dev → main` (09-Oct-2026), verificar `curl -sI https://holentia.com 200` + `vercel inspect holentia.com` nuevo ID

## Fase 6 — Mayores diferidos
- [ ] Tailwind 4, framer-motion 13, lucide 1.x, eslint 9, TS nuevo — con prod verificada

---

## Fase S — SEO/GEO + dark mode + pastel (11-Oct-2026) — HECHA
Plan por herramientas, ejecutado sobre `dev` (preview `dev.holentia.com`), sin tocar `main`.

- [x] **Fase 0**: entorno (pnpm 10.34.6, node 24) + baseline `tsc 0 + build OK`; **fix pastel interés compuesto** en `use-compound-interest-calculator.ts` (`prepareChartData` recibía `summary` stale del closure; ahora pasa `nextSummary` local)
- [x] **Fase 1 — paleta**: `globals.css` reescrito (275 líneas) con canónicos `#1976d2/#7c3aed/#ffa000/#388e3c`, eliminadas clases muertas (`.logo-aura*`, `.section-tab*`, `.section-title-highlight*`, `.tool-header-line*`, slider genérico, ripple, animate-in, menu); `tailwind.config.ts` safelist recortado; `getSectionColor` y `styles/globals.css` borrados
- [x] **Fase 2 — SSR de secciones**: `tool-card.tsx` reescrito (mapa `sectionCardClasses` con tokens, sin hex inline → dark mode correcto, hover real, badge "Próximamente" + Lock siempre visibles); `section-tabs.tsx` server (array `TABS`, sin mounted guard); `tools-grid.tsx` server (todas las disponibles en HTML, próximamente tras toggle); `TOOL_ROUTES` en `section-swipe-navigation.tsx`
- [x] **Fase 3 — shell de herramientas**: `lib/seo.ts` (`toolMetadata`, `sectionMetadata`, `pageMetadata`, `toolJsonLd`, `sectionJsonLd`, `faqJsonLd`, `SITE_URL`), `components/tool-seo/` (`tool-page-shell`, `json-ld`, `tool-faq`), `app/layout.tsx` con `metadataBase` + title template `{página} | HOLENTIA` + viewport/themeColor; las 11 herramientas migradas a shell server con `generateMetadata` + FAQ + JSON-LD; **`tool-page-client.tsx` eliminado** (vació el HTML de las herramientas)
- [x] **Fase 4 — hubs y home**: `components/sections/section-page.tsx` (server) unifica las 4 secciones; metadata + CollectionPage/Breadcrumb por sección; home con metadata + WebSite/Organization
- [x] **Fase 5 — infra SEO**: `app/sitemap.ts` (21 URLs), `app/robots.ts`, `app/error.tsx` + `app/global-error.tsx`, `app/ayuda/loading.tsx` (skeleton real), `public/llms.txt`, iconos movidos a `app/icon.svg` + `app/apple-icon.png`, metadata de las 5 páginas informativas, FAQPage JSON-LD en `/ayuda`
- [x] **Fase 6 — verificación + docs**: `.eslintrc.json` (`next/core-web-vitals`, `no-html-link-for-pages` off por bug de resolución); `eslint` 8.0.0 → 8.57.1 y `eslint-config-next` → 15.5.26 (crash de reglas con 8.0.0); `chartColors` memorizado en `calculator-charts.tsx` (lint 0 warnings); `tsc 0 · lint 0 · build OK`; smoke test `pnpm start` con 22 rutas en 200 (11 tools + 4 secciones + 5 informativas + robots/sitemap/llms); README y design.md actualizados
- Commits en `dev`: `d3facf1` (pastel) · `80c0e1b` (globals) · `7389891` (SSR secciones) · `89d8963` (shell finanzas) · `1a5ccbb` (shell restantes) · `885f508` (hubs/home) · `2a53352` (infra SEO) · pendiente: docs/lint

---

## Fase T — Auditoría UI + SEO/GEO moderno + social (14-Oct-2026) — HECHA
Auditoría triple (secciones / herramientas / infra SEO) + correcciones + skills. Commit `bb82c6e` en `dev` y `main`.

- [x] **Secciones**: tablas/headers/footer/tabs/grid/cards/swipe — contraste AA (scroll-to-top cuerpo, overlay 0.45, tabs sin opacity, gradiente H1 cuerpo `-dark`), `animate-fadeIn` movido al `<Link>` (keyframe pisaba hover/tilt), hover de relleno+texto, foco `ring-{s}`, `gap-4`/`mt-6` a la escala, swipe con guard de interactividad + dirección dominante, logo sin `scale`, home con tabs `neutral` (monocromo), alineación header home/sección
- [x] **Herramientas (33 archivos)**: locale `es-MX/MXN → es-DO/DOP`, hex fuera de paleta → tokens (`#2e7d32`, `#ffee58`, blue/purple/amber/sky/green-600), estilos `color:#ffffff` redundantes quitados, foco canónico completo en ~28 inputs, `dark:` en ~45 tokens de sección, glifos `⚠️ × + ✓` → lucide, ~100 `data-interactive`, h2 a `text-xl font-bold`, contenedores a `rounded-xl`, presupuesto FAQ 4→5
- [x] **SEO/GEO**: `metaTitle`+`metaDescription` (120–155 ch) en las 13 tools; subtitles de secciones sin cifras inventadas (E-E-A-T); intro+mini-FAQ por sección (thin content); JSON-LD en las 4 informativas (`pageJsonLd`); breadcrumb visible (luego retirado de UI, queda JSON-LD); footer con enlaces server-rendered (fin de páginas huérfanas); `lang es-DO` + `inLanguage`; robots explícitos GPTBot/ClaudeBot/PerplexityBot/Google-Extended; sitemap `LAST_UPDATED` fijo; `manifest.ts`; 404 `noindex`; Organization enriquecida; `llms.txt` consumo eléctrico corregido
- [x] **Social**: 17 `opengraph-image.tsx` (4 secciones + 13 tools) vía `ogTemplate`; raíz con texto ajustado (no roza el círculo); `twitter:card summary_large_image`
- [x] **Skills/docs**: nueva `seo-geo` (receta + checklist por tool), `create-tool` (metaFields/OG/FAQ≥5/smoke SEO), `section-ui`, `AGENTS.md`, `design.md` (recetas ToolCard/ToolsGrid/SectionTabs/ToolPageShell/Footer/glosario/paleta budget/swipe), README/architecture/plan recuentos 13/23
- [x] **Pulido post-feedback**: footer restaura `❤ 🇩🇴` (excepción documentada en design.md §4b), miguita visible eliminada de `ToolPageShell` (solo JSON-LD; navegación por botones), `pt-6` de aire bajo header en herramientas
- [x] ~~FAQ fuera de las herramientas~~ **CORREGIDO 14-Oct-2026 (malentendido)**: el dueño quería el FAQ **fuera de los hubs**, no de las herramientas. Estado final: acordeón `tool-faq.tsx` + `faq` en el shell + `FAQPage` **en las 13 tools**; **sin FAQ** en los hubs (`SectionData.faq` y `sectionJsonLd` sin FAQ).
- [x] **Pulido de secciones/tarjetas** (feedback 14-Oct-2026): tabs activos **sin subrayado** (solo texto en color + `aria-current`); quitado el H2 «¿Qué quieres aprender?» de los hubs; ToolCard hover con aclarado del extremo `to-` del gradiente (`group-hover:to-{s}`, AA-safe) y chevron con círculo `group-hover:bg-white/20` + slide. Docs: design.md (§4b, §Tabs, §ToolCard, FAQ acordeón restaurado), README, architecture, skills `create-tool` + `seo-geo` + `section-ui`
- [x] **Microanimaciones** (paquete aprobado 14-Oct-2026): nuevo `hooks/use-count-up.ts` (count-up rAF + ease-out, 500ms, reduced-motion) + `<CountUp>` (`components/ui/count-up.tsx`) para JSX condicional; keyframe `result-in` (fade+6px) en `tailwind.config.ts` aplicado a los heroes de resultado; press `active:scale-[0.97]` en botones/chips (button base, shell, chipClass combustible/hidratación/riesgo, tarjetas calorías); guarda global `prefers-reduced-motion` en `globals.css`; count-up en 11 herramientas (diario/glosario: sin números). Docs: `design.md` §6 + skill `section-ui` §8
- [x] **Hubs sin intro visible + auditoría SEO/GEO completa** (14-Oct-2026): `SectionData.intro` eliminado (4 hubs) — su copy factual pasó a `metaDescription` (143–148 ch) que alimenta `sectionMetadata` y el `description` del `CollectionPage`; `subtitle` visible reescrito con copy **inspiracional sin cifras inventadas**; tabs con hover **solo de color** (sin recuadro `bg-black/5`); descripciones de home/`que-es-holentia` recortadas a ≤165 ch; `faqWithBreadcrumbJsonLd` añade BreadcrumbList a `/ayuda` (helper nuevo, `faqJsonLd` retirado); **5 `opengraph-image.tsx` nuevos** para informativas (`ayuda`, `apoyar`, `aviso-legal`, `politica-cookies`, `que-es-holentia`) = 22+raíz. **Auditoría tool-by-tool: 23/23 páginas OK** (title ≤60, desc, canonical, og:url, og:image+dims, twitter large, `es-DO`, JSON-LD completo, FAQ visible en tools, sitemap 23 URLs, llms.txt 13 tools, robots bots IA) + smoke runtime: todos los `opengraph-image` responden **200 image/png**. Docs: design.md §SectionPage/§Tabs, skill `seo-geo` (§1/§2/§3/§4/§5)
- Verificado: `tsc 0 · lint 0 · build OK` + smoke HTML (titles, descriptions 140–150 ch, canonical, og:image por ruta, footer links, JSON-LD informativas, robots con bots IA, lastmod fijo, manifest)

---

## Fase U — Auditoría mobile + tema + DX (16-Oct-2026) — HECHA

- [x] **Tema (FOUC)**: `components/theme-provider.tsx` sin gate de `mounted` — next-themes ahora inyecta su script anti-flash en el HTML inicial (antes el tema oscuro llegaba recién tras la hidratación → destello claro→oscuro). Gates locales `mounted` intactos en menú/header/charts.
- [x] **Contraste móvil**: header sticky de herramienta con fondo **sólido** `{s}-active-dark` + texto blanco (≥4.5:1 en ambos temas; el glass al 70% daba cuerpo ≈1.9:1 en claro) y sin `backdrop-blur`; tap targets `h-11 w-11` (44px) en volver/menú y chip de logo `py-2`; `isDark` muerto eliminado.
- [x] **Bug de moneda**: 3 hooks (`compound-interest`, `loan`, `budget`) seguían formateando `es-MX`/`MXN` → nuevo `lib/format.ts` (`formatDOP`, es-DO/DOP) como fuente única.
- [x] **Mobile**: 2 inputs con `text-sm` (zoom iOS) → `text-base md:text-sm` (income-table, risk-profile-test); leyenda del doughnut `position: isMobile ? "bottom" : "left"`; 13 contenedores de resultado con `aria-live="polite"`.
- [x] **PWA**: iconos `public/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (generados con ruta temporal `ImageResponse`, retirada tras generar) + manifest con los 4 iconos.
- [x] **Menores**: `LAST_UPDATED` sitemap → 2026-10-16; home JSON-LD «en tu navegador» (consistencia con meta); docs `design.md` (§3.7 Mobile, §4d header móvil, §5 anti-flash), skills `section-ui` (mobile/formato/aria-live), `create-tool` (formato + checklist mobile + smoke OG runtime), `seo-geo` (smoke runtime OG), `chart-chartsjs` (leyenda móvil).
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (script de tema en HTML, manifest con 4 iconos, aria-live ×13, RD$ en hooks, header sólido en tool móvil).

---

## Fase V — Finanzas: Tracker Gastos Hormiga (17-Oct-2026) — HECHA

- [x] **Nueva herramienta `/tracker-gastos-hormiga` (14ª del sitio)**: registro de gastos pequeños con frecuencia anualizada (diario ×365, 3–4/sem ×182, semanal ×52, quincenal ×24, mensual ×12); hero gradiente con count-up del total anual + promedios mes/semana/día; lista con % y barra de proporción por gasto; editar/borrar por fila; chips de nombres rápidos (Café, Delivery, Snack, Colmado, Recarga, Soda); bloque de tips de ahorro.
- [x] **Persistencia** patrón S «entries»: `holentia:tracker-gastos-hormiga:entries:v1` (registrada en `politica-cookies`; FAQ de privacidad incluida). Card activada en `lib/data.ts` (metaTitle 47 ch · metaDescription 122 ch) → sitemap y hub automáticos.
- [x] **SEO/GEO**: `app/tracker-gastos-hormiga/opengraph-image.tsx` propia; `llms.txt` 13→14 herramientas; FAQ ×6 (¿qué es un gasto hormiga?, anualización, «3–4 veces por semana», privacidad, editar/borrar, relación con presupuesto).
- [x] **Docs**: `design.md` §4 receta «Lista de entradas con proporción» (filas, barra `h-1.5`, hit area `h-11 w-11` en acciones de fila).
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/canonical/FAQ JSON-LD, hub finanzas con la card activa, sitemap 24 URLs, og runtime 200 image/png).

---

## Fase W — Finanzas: Calculadora de Aguinaldo (17-Oct-2026) — HECHA

- [x] **Nueva herramienta `/calculadora-aguinaldo` (15ª del sitio)**: salario mensual ordinario + meses trabajados (slider 1–12) → aguinaldo = salario × meses ÷ 12; hero gradiente con count-up, desglose contable (salario del año, duodécima parte, «Descuentos RD$ 0.00 — exento»), mini-chips legales (exento de ISR, sin AFP ni ARS, pago antes del 20 de dic) y nota legal.
- [x] **Investigación previa (fuentes)**: arts. 219–222 del Código de Trabajo (1/12, proporcional, pago a más tardar el 20 dic), Ley 30-26 jun-2026 (exención completa de ISR), TSS no cotizable, DGII. Fuentes: DGII, Pellerano & Herrera, Revista Mercado, Siempre Al Día.
- [x] **Persistencia** patrón D draft: `holentia:calculadora-aguinaldo:draft:v1` (registrada en `politica-cookies`; FAQ de privacidad incluida). Card activada en `lib/data.ts` (metaTitle 46 ch · metaDescription 147 ch) → sitemap y hub automáticos; `LAST_UPDATED` → 2026-10-17; `metaDescription` del hub finanzas sin «50/30/20» y con aguinaldo.
- [x] **SEO/GEO**: `app/calculadora-aguinaldo/opengraph-image.tsx` propia; `llms.txt` 14→15 herramientas; FAQ ×6 (qué es y cuándo, proporcional, ISR, AFP/ARS, qué salarios cuentan, privacidad).
- [x] **Docs**: `design.md` §4 receta «Calculadora de ingreso único (aguinaldo)»; README/architecture recuentos 15 herramientas / 25 URLs.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/canonical/FAQ JSON-LD, sitemap 25 URLs, og runtime 200 image/png).

---

## Fase X — Finanzas: Calculadora de ITBIS (17-Oct-2026) — HECHA

- [x] **Nueva herramienta `/calculadora-itbis` (16ª del sitio)**: modos agregar (base × 1.18) y quitar (total ÷ 1.18 — evita el error de multiplicar por 0.82) con tasas 18% general / 16% reducida (café, azúcar, cacao y chocolate, yogurt, mantequilla y grasas); hero con count-up adaptado al modo, desglose base/ITBIS/total y mini-chips de tasas.
- [x] **Persistencia** patrón D draft: `holentia:calculadora-itbis:draft:v1` (registrada en `politica-cookies`; FAQ de privacidad incluida). Card activada en `lib/data.ts` (metaTitle 43 ch · metaDescription 137 ch) → sitemap y hub automáticos (26 URLs).
- [x] **SEO/GEO**: `app/calculadora-itbis/opengraph-image.tsx` propia; `llms.txt` 15→16 herramientas; FAQ ×6 (qué es, agregar, quitar sin ×0.82, 16% reducido, precios al público, privacidad).
- [x] **Docs**: `design.md` §4 receta «Calculadora de impuesto con modo agregar/quitar»; recuentos 16 herramientas / 26 URLs.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/canonical/FAQ JSON-LD, sitemap 26 URLs, og runtime 200 image/png).

---

## Fase Y — SEO: interés compuesto como rendimiento de inversiones (17-Oct-2026) — HECHA

- [x] **Card `lib/data.ts`**: `metaTitle` → «Calculadora de interés compuesto y rendimiento» (46 ch), `metaDescription` (144 ch) y blurb «Simula el rendimiento de tus inversiones.»
- [x] **FAQ ×6**: nueva pregunta «¿Sirve para calcular el rendimiento de mis inversiones?» (simulador: aportes + tasa esperada + inflación).
- [x] **OG** de la tool: subtítulo → «Rendimiento de tus inversiones, paso a paso»; línea de `llms.txt` alineada.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/og actualizados en HTML prerenderado, og runtime 200).

---

## Fase Z — Finanzas: Calculadora de Certificado Financiero (17-Oct-2026) — HECHA

- [x] **Nueva herramienta `/calculadora-certificado-financiero` (17ª del sitio)**: monto + tasa anual + plazo (días/meses) + modalidad (interés mensual o al vencimiento) → interés bruto (simple, año 365), retención ISR 10% (Norma General 07-2019) y ganancia neta; hero con count-up, desglose contable y fila por modalidad (total al vencer / pago mensual ≈).
- [x] **Investigación previa**: plazos 30–910 días (BHD) y 2–60 meses (Banreservas), tasas de referencia 2026 7%–11%, retención 10% sobre intereses (DGII), protección del Fondo de Contingencia (Ley 92-04).
- [x] **Persistencia** patrón D draft: `holentia:calculadora-certificado-financiero:draft:v1` (en `politica-cookies`; FAQ de privacidad). Card en `lib/data.ts` (metaTitle 40 ch · metaDescription 144 ch) → sitemap y hub automáticos (27 URLs).
- [x] **SEO/GEO**: OG propia («Intereses, retención y ganancia neta»); `llms.txt` 16→17; FAQ ×6 (qué es, cálculo por modalidad, qué tasa/plazo, retención ISR, cancelación anticipada, privacidad).
- [x] **Docs**: receta `design.md` §4 «Calculadora de tasa con retención»; recuentos 17 herramientas / 27 URLs.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/canonical/FAQ JSON-LD, sitemap 27 URLs, og runtime 200 image/png).

---

## Fase AA — Finanzas: Planificador de Ahorros (17-Oct-2026) — HECHA

- [x] **Herramienta `/planificador-ahorros` activada (18ª del sitio)** (la card existía como «Próximamente»): dos modos — «¿Cuándo llego?» (meta + ahorro inicial + aporte mensual + rendimiento → meses y fecha estimada) y «¿Cuánto aporto?» (meta + plazo → aporte mensual necesario), con interés compuesto mensual.
- [x] **Resultado**: hero con count-up (tiempo en meses o aporte mensual), desglose meta/ya tienes/aportes/intereses y «Sale de tu bolsillo»; estados borde (meta cubierta, plan > 100 años); fecha objetivo renderizada solo en el cliente; enlace cruzado a interés compuesto.
- [x] **Persistencia** patrón D draft: `holentia:planificador-ahorros:draft:v1` (en `politica-cookies`; FAQ de privacidad). Card activada en `lib/data.ts` (metaTitle 48 ch · metaDescription 135 ch) → sitemap y hub automáticos (28 URLs).
- [x] **SEO/GEO**: OG propia («Cuándo llegas a tu meta»); `llms.txt` 17→18; FAQ ×6 (cálculo, qué rendimiento, por qué invertir, aporte bajo, compras, privacidad).
- [x] **Docs**: receta `design.md` §4 «Planificador de ahorros»; recuentos 18 herramientas / 28 URLs.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/canonical/FAQ JSON-LD, sitemap 28 URLs, og runtime 200 image/png).

---

## Fase AB — Finanzas: Planificador de Compras (17-Oct-2026) — HECHA

- [x] **Nueva herramienta `/planificador-compras` (19ª del sitio)**: precio + meses de espera (slider 1–60) + rendimiento anual → cuánto gana la paciencia invirtiendo el precio (interés compuesto mensual); hero «La paciencia te paga», comparativa «Comprar hoy vs. esperar e invertir» («Al comprar te quedan +RD$…») y estado educativo si el rendimiento es 0%. Lema del dueño: esperar e ir invirtiendo con planificación gana.
- [x] **Persistencia** patrón D draft: `holentia:planificador-compras:draft:v1` (en `politica-cookies`; FAQ de privacidad). Card en `lib/data.ts` (metaTitle 47 ch · metaDescription 142 ch) → sitemap y hub automáticos (29 URLs).
- [x] **SEO/GEO**: OG propia («¿Comprar ya o esperar e invertir?»); `llms.txt` 18→19; FAQ ×6 (cómo compara, qué rendimiento, sin el dinero completo, precio cambiante, qué compras aplican, privacidad).
- [x] **Docs**: receta `design.md` §4 «Planificador de compras»; recuentos 19 herramientas / 29 URLs.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/canonical/FAQ JSON-LD, sitemap 29 URLs, og runtime 200 image/png).

---

## Fase AC — Auditoría SEO/GEO/llms de todo el sitio + skill de auditoría (17-Oct-2026) — HECHA

- [x] **Auditoría completa 29/29 PASS** (19 herramientas + 4 hubs + 5 informativas + home): títulos ≤60, descripciones 120–155 únicas, canonical/og:image/twitter propios, JSON-LD completo (WebApplication + BreadcrumbList + FAQPage), FAQ 5–6 visibles, línea en llms.txt, `<loc>` en sitemap, 0 `noindex`, 0 `new Date()` en estáticas; OG runtime **29/29 `200 image/png`**. Sin correcciones necesarias.
- [x] **Skill nueva `seo-geo-audit`** (`.opencode/skills/seo-geo-audit/SKILL.md`): checklist de 16 puntos por herramienta, barrido estático + extras + runtime, severidad FAIL/WARN, flujo de corrección y registro de auditorías (primera fila: 17-Oct-2026).
- [x] **Enganches al proceso**: `create-tool` §8 exige la auditoría antes del push; fila nueva en la tabla de skills de `AGENTS.md`; referencia cruzada en `seo-geo` §6.
- Verificado: barrido completo estático + runtime OG 29/29 `200 image/png`.

---

## Fase AD — Mente: mejoras del Diario Guiado (17-Oct-2026) — HECHA

- [x] **Modernización del Diario** (`guided-journal`): chips de ánimo con emoji, confirmación de borrado en 2 pasos (auto-cancel a 4 s), racha de días + tira de ánimo (≤7), borrador autosave del formulario (incluye `editingId`), copiar entrada, estado vacío con `Feather`, fechas `es-DO`, edición que conserva la fecha original y carga de entradas en cliente (sin desajuste de hidratación); fuera azules sueltos (tokens `mente`).
- [x] **SEO**: metaTitle «Diario guiado para escribir emociones y gratitud» (48 ch) y metaDescription nueva (152 ch); FAQ ×6 (nueva «¿Escribir un diario ayuda de verdad?» y privacidad con claves `entries` + `draft`).
- [x] **Persistencia**: nueva clave `holentia:diario-guiado:draft:v1` en `politica-cookies` (la de entradas ya existía).
- [x] **Docs**: receta `design.md` §4 «Diario guiado» + patrón transversal «Confirmación de borrado en 2 pasos»; auditoría targeted registrada en `seo-geo-audit`.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (title/desc/canonical/FAQ JSON-LD ×6, OG runtime 200).

---

## Fase AE — Mente: Respiración guiada (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (20ª): card `tecnicas-respiracion` activada; 3 técnicas (4-7-8 para dormir · caja 4-4-4-4 concentración · calma 4-6 relajación), rondas 3/5/10, círculo guía animado con `requestAnimationFrame`, pausa/reanudar, haptics por fase y aviso de seguridad; preferencias con patrón D (`holentia:tecnicas-respiracion:draft:v1`).
- [x] **SEO**: metaTitle «Respiración guiada 4-7-8 para calmar la ansiedad» (48 ch) · metaDescription 138 ch; FAQ ×6; OG propia; hub de mente actualizado (subtitle + metaDescription).
- [x] **Docs/recuentos**: llms.txt 20 herramientas (header + sección Mente + línea), README (×5), architecture (×3), `seo-geo` (30 archivos OG); receta `design.md` §4 «Respiración guiada».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AF — Mente: Test de ansiedad GAD-7 (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (21ª, card `test-ansiedad`): cuestionario de cribado GAD-7 (7 ítems 0–3), flujo intro → quiz (una pregunta a la vez) → resultado con puntaje 0–21 y 4 bandas (mínima/leve/moderada/grave), escala visual con marcador, aviso de crisis en banda grave, enlaces cruzados a respiración y diario; patrón D con reanudación a medias (`holentia:test-ansiedad:draft:v1`).
- [x] **SEO**: metaTitle «Test de ansiedad GAD-7: mide tu nivel en 7 preguntas» (52 ch) · metaDescription 152 ch; FAQ ×6; OG propia.
- [x] **Docs/recuentos**: llms.txt 21 (header + sección Mente + línea), README (×5), architecture (×3), `seo-geo` (31 archivos OG); receta `design.md` §4 «Test de ansiedad GAD-7».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AG — Mente: Calculadora del sueño (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (22ª, card `calculadora-sueno`): modo «me levanto a las…» / «me acuesto a las…» con `<input type="time">`, 3 opciones de ciclos (6/5/4 × 90 min + 15 min de conciliación), 5 ciclos marcada como recomendada, formato 12 h `a.m./p.m.` y tips de descanso; patrón D `holentia:calculadora-sueno:draft:v1` (`{mode, wakeTime, bedTime}`).
- [x] **SEO**: metaTitle «Calculadora del sueño: ¿a qué hora debo dormir?» (47 ch) · metaDescription 140 ch; FAQ ×6; OG propia.
- [x] **Docs/recuentos**: llms.txt 22 (header + sección Mente + línea), README (×5), architecture (×3), `seo-geo` (32 archivos OG); receta `design.md` §4 «Calculadora del sueño».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AH — Relaciones: mejoras al test de lenguajes del amor (17-Oct-2026) — HECHA

- [x] **Reescritura** de `love-languages-test.tsx`: tokens `relaciones` (fuera `purple-*` sueltos), patrón D reanudable (`holentia:test-lenguajes-amor:draft:v1`), «← Atrás» conservando selección, copiar resultado, «Borrar mis datos» y flash de guardado; las 5 preguntas quedan intactas.
- [x] **SEO**: metaTitle «Test de los 5 lenguajes del amor: ¿cuál es el tuyo?» (51 ch) · metaDescription 147 ch (antes 31/139 con keyword débil); FAQ ×6 (nueva «¿Y si mi pareja y yo tenemos lenguajes distintos?» + privacidad con clave).
- [x] **Docs**: politica-cookies (clave nueva), receta `design.md` §4; sin cambios de recuentos (misma herramienta).
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría targeted PASS.

---

## Fase AI — Relaciones: test de estilo de apego (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (23ª, card `test-apego` activada): 12 afirmaciones 0–3, 4 estilos (seguro/ansioso/evitativo/temeroso), dominante + distribución + consejos, patrón D reanudable (`holentia:test-apego:draft:v1`), copiar resultado y enlace cruzado a lenguajes del amor; disclaimer educativo.
- [x] **SEO**: metaTitle «Test de estilo de apego: ¿seguro, ansioso o evitativo?» (54 ch) · metaDescription 151 ch; FAQ ×6; OG propia; hub de relaciones actualizado (subtitle + metaDescription).
- [x] **Docs/recuentos**: llms.txt 23 (header + sección Relaciones + línea), README (×5), architecture (×3), `seo-geo` (33 archivos OG); receta `design.md` §4 «Test de estilo de apego».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AJ — Relaciones: preguntas profundas (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (24ª, card `preguntas-profundas` activada): 45 preguntas en 3 categorías (Pareja / Familia y amistad / Para conocerte tú), orden curado + «Mezclar el orden» (Fisher–Yates en cliente, nunca en SSR), «← Anterior» / «Otra pregunta» con contador, copiar pregunta; patrón D mínimo (solo categoría, `holentia:preguntas-profundas:draft:v1`).
- [x] **SEO**: metaTitle «Preguntas profundas para parejas, familia y amigos» (50 ch) · metaDescription 154 ch; FAQ ×6; OG propia; hub de relaciones actualizado (3 herramientas vivas).
- [x] **Docs/recuentos**: llms.txt 24 (header + sección Relaciones + línea), README (×5), architecture (×3), `seo-geo` (34 archivos OG); receta `design.md` §4 «Preguntas profundas».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AK — Relaciones: diario para parejas (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (25ª, card `diario-parejas` activada): pregunta del día determinista (30 preguntas, rotación por fecha local calculada tras el montaje), dos campos con borrador autoguardado (patrón D, `holentia:diario-parejas:draft:v1`), upsert diario en `holentia:diario-parejas:entries:v1`, historial con racha, copiar y borrado en 2 pasos + «Borrar todo»; enlace cruzado a preguntas profundas.
- [x] **SEO**: metaTitle «Diario para parejas: pregunta diaria para conectar» (50 ch) · metaDescription 148 ch; FAQ ×6; OG propia; hub de relaciones actualizado (4 herramientas vivas).
- [x] **Docs/recuentos**: llms.txt 25 (header + sección Relaciones + línea), README (×5), architecture (×3), `seo-geo` (35 archivos OG); receta `design.md` §4 «Diario para parejas».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AL — Cuerpo: plan de pasos 5-10-20 (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (26ª, card `monitor-pasos` → `pasos-al-dia` activada): objetivo diario con presets (4,000/7,000/10,000) + input libre, plan 5-10-20 repartido en bloques Mañana/Tarde/Noche (steppers de 5 en 5 + presets de 40/60/80 min), registro del día con progreso vs. objetivo, racha y últimos 7 días, beneficios por banda de objetivo, 10 trucos para sumar pasos y tarjeta «los pasos son el primer paso, no el único» (OMS: cardio, fuerza, alimentación, descanso); conversión 100 pasos/min; mito Manpo-kei desmontado. Patrón D doble (`holentia:pasos-al-dia:draft:v1` + `:entries:v1`), fecha local tras el montaje, formato de miles con coma.
- [x] **SEO**: metaTitle «¿Cuántos pasos al día? Plan 5-10-20 y beneficios» (48 ch) · metaDescription 154 ch; FAQ ×6; OG propia; hub de cuerpo actualizado (3 herramientas vivas).
- [x] **Docs/recuentos**: llms.txt 26 (header + sección Cuerpo + línea), README (×5), architecture (×3), `seo-geo` (36 archivos OG); claves nuevas en politica-cookies (×2); receta `design.md` §4 «Plan de pasos 5-10-20».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AM — Cuerpo: calculadora de IMC (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (27ª, card `calculadora-imc` activada): peso + estatura al instante con toggle kg/lb dentro del input, bandas OMS (bajo peso/normal/sobrepeso/obesidad) con héroe gradiente y escala proporcional 15-40 con marcador, peso saludable por estatura con mensaje de diferencia, tarjeta «El IMC no lo dice todo» (músculo, cintura 88/102 cm, etapas de la vida, tendencia) y «Del número a la acción» con enlaces a calorías, hidratación y pasos; disclaimers educativos. Patrón D (`holentia:calculadora-imc:draft:v1`), inputs de texto con `inputMode` (decimales sin glitches).
- [x] **SEO**: metaTitle «¿Cuál es mi IMC? Calculadora de índice de masa corporal» (55 ch) · metaDescription 147 ch; FAQ ×6; OG propia; hub de cuerpo actualizado (4 herramientas vivas).
- [x] **Docs/recuentos**: llms.txt 27 (header + sección Cuerpo + línea), README (×5), architecture (×3), `seo-geo` (37 archivos OG); clave nueva en politica-cookies; receta `design.md` §4 «Calculadora de IMC».
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría 16 puntos PASS.

---

## Fase AN — Cuerpo: pulido de la calculadora de calorías (17-Oct-2026) — HECHA

- [x] **FAQ ×6**: nueva «¿Cuánto peso puedo bajar a la semana?» (ritmo ≈0.5 kg/semana con déficit del 20%, ACSM).
- [x] **Consistencia**: números a `es-DO` (antes `es-ES`), 0 clases `amber-*` (tokens `cuerpo` en objetivos, tips y enlaces), héroe con variante dark (`dark:bg-cuerpo-glass dark:text-cuerpo-text`) y chips internos con contraste corregido (texto oscuro sobre el gradiente ámbar; el blanco sobre ámbar quedaba ≈1.9:1), metaTitle con el método (49 ch).
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría targeted PASS.

---

## Fase AO — Cuerpo: pulido de la calculadora de hidratación (17-Oct-2026) — HECHA

- [x] **FAQ ×6**: nueva «¿El café, el té o las infusiones cuentan como agua?» (EFSA: todas las bebidas cuentan; azucaradas con moderación).
- [x] **Meta corregida**: la metaDescription decía «fórmula de Watson ajustada» y el cálculo real es 35 ml/kg + ajustes aditivos EFSA/NASEM; metaTitle ahora cita la referencia (46 ch) y la meta describe el plan por horas (142 ch).
- [x] **Consistencia**: números a `es-DO`, 0 clases `amber-*` (tokens `cuerpo`), héroe con variante dark y chips internos con contraste corregido (texto oscuro sobre el gradiente ámbar).
- Verificado: `tsc 0 · lint 0 · build OK` + smoke + auditoría targeted PASS.

---

## Fase AP — Cuerpo: pase UI/UX móvil de las 4 herramientas (espaciado, tipografía y contraste) (17-Oct-2026) — HECHA

- [x] **Receta de input unificada** (las 4): `rounded-md border bg-white px-3 py-2.5 text-lg font-semibold` + foco canónico `ring-2` (las hermanas usaban `ring-1`/`p-3` dispares), `type="text"` + `inputMode` con saneado (el `type="number"` rompía decimales parciales en móvil), selects largos en `text-base`.
- [x] **Calorías**: objetivo en filas de ancho completo en móvil (3 columnas desde `sm`, `aria-pressed`), héroe `rounded-2xl` + borde `cuerpo-border` + `p-6 sm:p-8`, sección editorial sin `uppercase`, contraste de chips seleccionados (`border-cuerpo-dark`, texto `gray-900`).
- [x] **Hidratación**: chips con contraste corregido, héroe `rounded-2xl` + borde + `p-6 sm:p-8` con las 3 celdas igualadas (una salía blanca sin motivo), plan del día con la última celda a ancho completo en móvil, fuera `animate-pulse` decorativo, tips a `sky-600` (3:1).
- [x] **Pasos**: h2 internos a `text-xl` (eran `text-lg`, únicos de la sección), presets de objetivo/plan como filas en móvil (label + valor), steppers `h-10 w-10` (40px), registro de hoy sin el «pasos» redundante y `+1,000` con feedback `active`, clases muertas por `/opacidad` (`border-cuerpo/40`, `ring-cuerpo/30`) sustituidas por tokens sólidos, puntos de la semana con contraste AA.
- [x] **IMC**: peso y estatura apilados en móvil (`sm:grid-cols-2`; el sufijo kg/lb no cabía a 2 columnas ≤360px), botón kg/lb AA con hover funcional (los `/opacidad` previos eran clases muertas), iconos de aviso a `amber-600`.
- [x] **Docs**: `design.md` §3.3 (inputs), §3.7 (filas que no caben, steppers), §7 (caso cuerpo sobre ámbar) y recetas de pasos/IMC; skill `section-ui` §3c/§7.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (4 páginas 200 + OG `200 image/png`) + auditoría targeted PASS.

---

## Fase AQ — Mente: pase UI/UX móvil de las 4 herramientas (espaciado, tipografía y contraste) (17-Oct-2026) — HECHA

- [x] **Test de ansiedad (GAD-7)**: etiquetas del héroe a `text-white` sólido (el `/85` y `/75` sobre `#1976d2` caían a 3.8/3.2:1; el `/ 21` grande conserva su `/80` por ser texto grande ≥3:1), h2 del resultado a `text-xl` (era `font-semibold` a 16px), aviso de crisis a `p-4 text-sm leading-relaxed` (era `text-xs`), paneles de resultado a `p-6`, opciones de quiz y botones con press feedback `active:scale-[0.97]`, «Empezar» a `rounded-md`.
- [x] **Sueño**: input de hora con la receta unificada (era `p-3 text-base md:text-sm` → `px-3 py-2.5 text-lg font-semibold`, foco `ring-2`, sin `shadow-sm`), subtexto de la fila «Recomendado» a `text-gray-700 dark:text-gray-200` (el `gray-500` sobre `mente-lighter` quedaba en 2.7:1), h2 del resultado a `text-xl`, tarjetas a `p-6` y modos segmentados con press feedback.
- [x] **Respiración**: detalle de la técnica seleccionada con color condicional (`gray-700`/`gray-200`; el `gray-500` sobre `mente-lighter` fallaba AA), rondas a `py-2.5` (40px), tarjetas de técnica y segmentados con press feedback, tarjetas `p-6` y tips con h2 `text-xl`.
- [x] **Diario**: textareas con la receta canónica (16px, `focus:outline-none`, placeholder `gray-400`/`gray-500` en ambos modos — antes sin color de placeholder), acciones de tarjeta `h-9 w-9` centradas (antes `p-2` = 32px) con press feedback, tarjeta de racha a `p-6`.
- [x] **Docs**: `design.md` §6 (press en filas de opción), §7 (caso mente) y recetas de las 4; skill `section-ui` §7/§8.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (4 páginas SSR con H1 ×1 y 0 `noindex` + OG `200 image/png`) + auditoría targeted PASS.

---

## Fase AR — Relaciones: pase UI/UX móvil de las 4 herramientas (espaciado, tipografía y contraste) (17-Oct-2026) — HECHA

- [x] **Contraste (fallos AA)**: `relaciones-light` (#a78bfa) a 14px en oscuro quedaba 3.1:1 → porcentajes de quiz (lenguajes, apego) y enlaces cruzados (apego, parejas) pasan a `dark:text-relaciones-lighter` (5.0:1); subtexto de la categoría seleccionada en preguntas profundas de `gray-500` sobre `relaciones-lighter` (2.6:1) a `gray-700`/`dark:text-gray-200`; «(opcional)» del diario de `gray-400`/`gray-500` a `gray-500`/`gray-400`.
- [x] **Inputs**: textarea del diario de parejas con la receta unificada (era `text-sm` + `ring-1` + `focus:border-relaciones` → 16px sin zoom iOS, `ring-2`, `focus:border-transparent`, dark completo).
- [x] **Tipografía**: h2 de «Pregunta de hoy» y «Nuestro historial» a `text-xl` (eran `text-lg`, únicos de la sección); «Cómo aprovecharlas» de h3 `text-sm` a h2 `text-xl` con tarjeta `p-6`.
- [x] **Mobile/táctil**: opciones de quiz (lenguajes y apego), filas de categoría, botones grises y sólidos con press feedback `active:scale-[0.97]` (había 0.98/0.99 sueltos y `transition-colors` sin transform); acciones de las entradas de parejas de 32px a `h-9 w-9` centradas.
- [x] **Docs**: `design.md` §7 (caso relaciones) y recetas de las 4; skill `section-ui` §7.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (4 páginas SSR con H1 ×1 y 0 `noindex` + OG `200 image/png`) + auditoría targeted PASS.

---

## Fase AS — Finanzas tanda 1: pase UI/UX móvil de las 5 calculadoras de cálculo rápido (17-Oct-2026) — HECHA

- [x] **Receta de input con icono** (aguinaldo, ITBIS, certificado): el `inputClass` compartido (`p-3 pl-10 text-base md:text-sm shadow-sm`) pasa a la canónica (`py-2.5 pl-10 pr-3 text-lg font-semibold`, placeholder en ambos modos, foco `ring-2`); combustible reescribe su `inputClass` (orden viejo, `py-2`, `shadow-sm`) y sus 5 campos pasan de `type="number"` a `type="text"` + `inputMode` con saneado (`[^\d.,]` precio/distancia/consumo; `[^\d]` viajes/días); eléctrico igual en el kWh (saneado `[^\d]`).
- [x] **Contraste verde (fallos AA)**: etiquetas de los héroes en `text-white/85` (~4.2:1 en móvil; el blanco sólido queda en ~5.0) → `text-white`; `finanzas-light` a 14px en oscuro (3.6:1) → `dark:text-finanzas-lighter` en la fila neta de las 3 calculadoras; texto pequeño en claro (`text-finanzas` = 4.1:1) → `text-finanzas-dark`/`finanzas-lighter` en chips de tasa y quick chips; segmented activo y banda del ticket de combustible de `bg-finanzas`+blanco (4.1:1) → `bg-finanzas-dark` (7.9:1); icono Info del ticket de combustible con `dark:text-finanzas-light`.
- [x] **Táctil**: chips de tasa/presets/días (36–40px con `py-2.5`), iconos de campo de combustible a `gray-500 dark:text-gray-400`.
- [x] **Respiración**: tarjetas `p-5`/`p-5 sm:p-6` → `p-6` (desgloses de aguinaldo/ITBIS/certificado, tarjeta de formulario, ticket y tips de combustible, ticket eléctrico).
- [x] **Docs**: `design.md` §3.3 (variante con icono), §7 (caso finanzas), recetas (pase en aguinaldo/ITBIS/certificado + nuevas de combustible y eléctrico); skill `section-ui` §3c/§7.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (5 páginas SSR con H1 ×1 y 0 `noindex` + OG `200 image/png`) + auditoría targeted PASS.

---

## Fase AT — Finanzas tanda 2: pase UI/UX móvil de crédito e inversión (préstamo, interés tarjeta, corte/vencimiento, interés compuesto) (17-Oct-2026) — HECHA

- [x] **Receta de input extendida**: préstamo con override sobre `ui/Input` (`h-auto md:text-lg` — el base `h-10`/`md:text-sm` ganaba el merge), compuesto con 5 campos canónicos, corte/vencimiento con variante `inputClassText` para texto libre y `type="date"`. 8 `type="number"` → `type="text"` + `inputMode` con saneado (días `[^\d]` + `slice(0,2)`; años/tasas/inflación con coma decimal normalizada en `handleNumberChange`); parsers de tarjeta de interés tolerantes a comas (`.replace(/,/g, "")`).
- [x] **Contraste (fallos AA)**: cajas de stats del héroe `bg-white/20` (≈3.8:1) → `bg-black/20` (préstamo, compuesto en ambos héroes duplicados, interés tarjeta); etiquetas `text-white` sólido también en la rama roja; badge `#22c55e`+blanco (2.3:1) → `bg-finanzas-dark`/`finanzas-light dark:text-gray-900`; tabs/segmentados/tabla de préstamo y compuesto de `bg-finanzas`+blanco (4.1:1) → `bg-finanzas-dark` (7.9:1) sin `shadow-sm`; textos `finanzas-light` a 14–18px → `finanzas-lighter` (3.6→5.2:1); rojos de pérdida `red-500` (2.9–3.3:1) → `red-600`/`text-red-700` + iconos.
- [x] **Estilos inline de color fuera** (`saved-simulations` y `amortization-table` de préstamo): `iconColor`/`headerBg`/`buttonColor` (rgba/#388e3c) ignoraban el modo oscuro → clases con tokens y tintes `bg-[#388e3c]/10–30`; paginación con iconos a `p-2.5`, acciones de simulaciones a `h-10 w-10`; hex `#6a9c77` (×3) y `#4caf50` (charts) fuera (canvas on-token `#66bb6a`).
- [x] **Respiración**: tarjetas `p-5` → `p-6` (formulario, tabla y charts del compuesto, impacto móvil, contenedor móvil del préstamo); Guardar/Reiniciar a `py-2.5`; tabs pequeñas a `py-2.5`.
- [x] **Docs**: `design.md` §3.3 (variante de texto/`type="date"` + `ui/Input`), §7 (finanzas tanda 2), 4 recetas nuevas (préstamo, interés tarjeta, corte/vencimiento, interés compuesto); skill `section-ui` §3c/§7.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (4 páginas SSR con H1 ×1 y 0 `noindex` + OG `200 image/png`) + auditoría targeted PASS.

---

## Fase AU — Finanzas tanda 3: pase UI/UX móvil de presupuesto y hábitos (presupuesto, gastos hormiga, ahorros, compras, perfil de riesgo, glosario) (17-Oct-2026) — HECHA

- [x] **Tablas editables con borrador local** (budget-simulator): los 3 `type="number"` controlados restantes (objetivo, consumido, ingreso) → `type="text"` + `inputMode="decimal"` + estado `drafts` por celda (commit al parsear con coma decimal, limpieza en `onBlur`); inputs de celda `px-2 py-2 text-base`; botones de fila `w-6 h-6` → `h-10 w-10`.
- [x] **Contraste (fallos AA)**: textos salvia `dark:text-[#6a9c77]` (2.7:1, no pasa ni a ≥20px) → `dark:text-[#a5d6a7]` (5.2:1) en budget (insights, summary, tips, tablas); `text-finanzas` a 12px → `text-finanzas-dark`; ahorro `green-600` (3.3:1) → `green-700`; sólidos `bg-finanzas text-white` (tabs del simulador, CTAs y badges del perfil de riesgo, añadir ingreso/gasto) → `bg-finanzas-dark` + hover `finanzas-darkest` (4.1→7.9:1); héroe del test: píldoras/cajas `bg-white/15` → `bg-black/20` y `text-white/85–90`/`opacity-80–90` → blanco sólido; `Disclosure` `tone="light"` en blanco sólido; h3 del glosario 18px/600 → `finanzas-lighter`; puntos de paginación de tips invisibles en dark → tokens.
- [x] **Tap targets y respiración**: cierres de modal/advertencia `h-11 w-11`; acciones de fila del presupuesto `h-10 w-10`; dots de tips de 8px → botón `h-10 w-10`; chips del glosario/tracker/perfil a `py-2.5`; toggle de curva del gráfico `px-3 py-2.5`; «Ver niveles» `px-3 py-2`; tarjetas `p-4`/`p-5` → `p-5`/`p-6` donde había inconsistencia; inputs nuevos con la receta canónica (tracker, compras, ahorros, perfil: campos propios a `text-base`/`text-lg`, foco canónico, sin `shadow-sm`).
- [x] **Parsers tolerantes**: `"60,000"`/`"8,5"` — coma decimal vs. miles resuelta con `,(?=\d{1,2}$)` → `.` antes de quitar miles (tracker, compras, ahorros y tablas del presupuesto).
- [x] **Docs**: `design.md` §3.3 (borrador en celdas de tabla), §3.6 (salvia dark → `#a5d6a7`), §4 (recetas simulador de presupuesto y perfil de riesgo; glosario y tracker actualizados), §7 (tanda 3); skill `section-ui` §3c/§7; registro en `seo-geo-audit`.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (6 páginas SSR con H1 ×1 y 0 `noindex` + OG `200 image/png`) + auditoría targeted PASS.

---

## Fase AV — Superficies globales: pase UI/UX móvil del chrome, hubs, informativas y shell de herramientas (17-Oct-2026) — HECHA

- [x] **Contraste AA (textos 12–14px)**: la base de sección no siempre llega → tiers en claro: tabs de sección activas (cuerpo `-darkest` 3.8→5.6; finanzas `-dark` 4.1→7.9), botón «Ver todas» del hub, botones del shell de herramienta (`Volver a {sección}` / `Hacer donación`), crédito del footer (12px) e ítem activo del menú (mente sobre `gray-100` 4.2→7.9; en oscuro `relaciones` sobre `gray-800` 2.6→5.4 vía `-light`); H1 del shell en cuerpo `-darkest`; categoría de ToolCard a `text-white` sólido (3.4–3.8→4.6–5.7; cuerpo conserva `text-black/70` sobre ámbar, 6.2); hover del FAQ con los mismos tiers; `hover:bg-red-500` del borrado total → `hover:bg-red-600` (3.8→4.8 con blanco).
- [x] **Tipografía**: descripción del shell con `mx-auto max-w-2xl leading-relaxed` (la medida se estiraba a lo ancho en escritorio).
- [x] **Tap targets y ritmo**: tabs de sección `py-2.5` (40px); nav del footer `inline-block py-1.5` y crédito `py-1`; «Volver» de las 5 informativas `py-3` (44px; sin cambio visual, la fila ya mide 44 por el menú); `space-y-10` → `space-y-12` en aviso-legal y política de cookies.
- [x] **Identidad monocroma**: `app/error.tsx` fuera el `bg-blue-600` genérico → receta primaria `h-10` gray-900/blanco (§4c) en «Reintentar» e «Ir al inicio».
- [x] **Docs**: `design.md` §3.7 (enlaces de texto con área táctil), §4 (ToolCard, ToolsGrid, SectionTabs, ToolPageShell, FAQ acordeón), §4b (footer), §4c (Volver, botón primario/error, ritmo `space-y-12`), §4d (ítem activo del menú), §7 (caso chrome global); skill `section-ui` §3b (radio de páginas de contenido corregido a `rounded-2xl`/`rounded-xl`) y §7.
- Verificado: `tsc 0 · lint 0 · build OK` + smoke (13 rutas SSR con H1 ×1, canonical ×1 y 0 `noindex`; clases nuevas en el CSS compilado) + runtime 7 páginas `200` + OG `200 image/png` + auditoría targeted PASS.

---

## Fase AW — Accesibilidad estructural + auditoría automatizada (17-Oct-2026) — HECHA

- [x] **Enlace «Saltar al contenido»** global (`app/layout.tsx`, primero en el DOM): oculto fuera del viewport (`-translate-y-20`) y visible al foco (`focus:translate-y-0`) con la receta del botón primario monocromo + `focus:ring-2`.
- [x] **Destino `#contenido`**: todos los `<main>` llevan `id="contenido" tabIndex={-1} focus:outline-none` (home, hubs, 27 herramientas, error y 404 — el 404 pasa de `<div>` a `<main>`); `global-error` corrige `lang="es"` → `es-DO`.
- [x] **Script `pnpm audit:seo`** (`scripts/audit-seo.mjs`): arranca `next start` en puerto de auditoría y valida las 37 rutas del sitemap (title/description con rango en herramientas, canonical autorreferencial, 0 `noindex`, `og:image` propia, twitter, JSON-LD por tipo de página, FAQ ≥5, llms.txt, H1 ×1, estructura a11y) + runtime OG (`200 image/png`) + cobertura cruzada `llms.txt ⊆ sitemap`; exit 1 con FAIL. `AUDIT_BASE` reutiliza un server existente.
- [x] **Docs**: `design.md` §4d (skip link), skill `section-ui` §8, skill `seo-geo-audit` §2.0 + §4 (fila nueva), `create-tool` §8 (atajo), README (comando), architecture §8.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` → **37/37 rutas PASS, 0 FAIL, 0 WARN** (OG runtime `200 image/png` en las 37).

## Fase AX — Rendimiento móvil: Chart.js y paneles pesados fuera del bundle inicial (17-Oct-2026) — HECHA

- [x] **Interés compuesto**: `CalculatorCharts` con `next/dynamic` (`ssr:false` + skeleton que reserva altura); inputs con `animate-result-in` en vez de framer-motion; `SavedSimulations` diferido — la ruta pasa de **251 a 139 kB** First Load.
- [x] **Perfil de riesgo**: fuera el `import Chart from "chart.js/auto"` estático — la dona `PortfolioPie` hace `import("chart.js/auto")` dentro del `useEffect` (bandera `cancelled` + `instance.destroy()` en cleanup); `FundProjectionChart` diferido con `next/dynamic` — la ruta pasa de **220 a 151 kB**.
- [x] **Préstamo**: framer-motion fuera del camino crítico (variantes → `animate-result-in`, tabs con `active:scale-[0.98]` en vez de `whileTap` + `layoutId`, disclaimer estático, tabla sin `motion.tr`); `SavedSimulations` y `AmortizationTable` diferidos — la ruta pasa de **186 a 145 kB**.
- [x] **Sin regresiones**: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` → **37/37 rutas PASS, 0 FAIL, 0 WARN** (estructura SEO/a11y intacta).
- [x] **Docs**: `design.md` §3.8 (presupuesto y reglas de carga) + §4d; skill `chart-chartsjs` (§Carga); skill `create-tool` §8 (presupuesto); `architecture.md` §8; README.
- Medición: tabla de `pnpm build` (Route Size / First Load JS). Los CWV de campo (Lighthouse/PSI) se comprueban sobre `dev.holentia.com` tras el deploy.

---

## Fase AY — Herramienta nueva: calculadora de sueldo neto (TSS + ISR 2026) (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (28ª, card `calculadora-sueldo-neto`): de bruto a neto con desglose de la TSS (SFS 3.04% tope RD$232,230 · AFP 2.87% tope RD$464,460 — Resolución 01-2025, vigente desde feb-2026) y retención de ISR por tramos de la DGII (base anual = bruto − TSS, ÷ 12); héroe con neto mensual, «≈ por quincena», neto anual y tasa efectiva de descuentos; presets de salario y campo opcional de otros descuentos fijos. Patrón D (`holentia:calculadora-sueldo-neto:draft:v1`).
- [x] **SEO/GEO**: metaTitle «Calculadora de sueldo neto RD 2026 (TSS e ISR)» (47 ch) · metaDescription 144 ch; FAQ ×6 (bruto vs. neto, topes TSS 2026, cálculo del ISR, quincena, bonificaciones, privacidad); OG propia (`app/calculadora-sueldo-neto/opengraph-image.tsx`); hub de finanzas actualizado automáticamente.
- [x] **Verificación**: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` (smoke completo del sitio, OG runtime `200 image/png`).
- [x] **Docs/recuentos**: llms.txt 28 (header + sección Finanzas + línea), README y architecture con los recuentos al día (28 herramientas / 38 URLs / 32 claves), clave nueva en `politica-cookies`; receta `design.md` §4 «Calculadora de sueldo neto (descuentos laborales RD)».

---

## Fase AZ — Directorio de herramientas `/herramientas` (17-Oct-2026) — HECHA

- [x] **Página nueva `/herramientas`** (server-rendered, sin JS propio): índice de las 29 herramientas agrupadas por sección (Mente · Relaciones · Cuerpo · Finanzas) con chips ancla (`#mente`…), contador por sección, enlace «Ver sección» y las `ToolCard` reutilizadas (mismas tarjetas que los hubs; las «Próximamente» no aparecen).
- [x] **Descubribilidad**: enlace «Directorio de herramientas» en el footer (primero de la lista, server-rendered), `<loc>` en el sitemap (40 URLs, prioridad 0.6) y sección `## Directorio` en `llms.txt`.
- [x] **SEO/GEO**: metadata propia, JSON-LD `CollectionPage + BreadcrumbList` (`directoryJsonLd` en `lib/seo.ts`) y OG propia (`app/herramientas/opengraph-image.tsx`); `pnpm audit:seo` clasifica `/herramientas` como página de colección (nuevo set `COLLECTIONS` = hubs + directorio).
- [x] **Docs**: `design.md` §4 receta «Directorio de herramientas»; recuentos 29 herramientas / 40 URLs / 40 OG en README, architecture y skills.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **40/40 rutas PASS**.

---

## Fase BA — Herramienta nueva: calculadora de prestaciones laborales RD (17-Oct-2026) — HECHA

- [x] **Herramienta nueva** (29ª, card `calculadora-prestaciones-laborales`): salario mensual promedio + fechas (`type="date"`) + motivo (despido sin causa / desahucio con preaviso cumplido / renuncia) → desglose de **preaviso (art. 76: 7/14/28 días)**, **auxilio de cesantía (art. 80: 6/13/21 por año/23 por año; fracción de año mayor de 3 meses según ordinales 1.º y 2.º)**, **vacaciones (arts. 177/180: escala 6–12 días hasta el año; 14 días de 1–5 años y 18 desde más de 5)** y **salario de Navidad (art. 219: meses del año ÷ 12)**; salario diario = mensual ÷ 23.83 (criterio del Ministerio de Trabajo). Héroe con total + «≈ N meses de salario», notas condicionales del cálculo (fracciones, menos de 3 meses, escala de 23 días), bloque de cifras vigentes y nota legal. Patrón D (`holentia:calculadora-prestaciones-laborales:draft:v1`).
- [x] **Investigación previa (fuentes)**: Código de Trabajo Ley 16-92 (texto del art. 80 publicado por el MT: «toda fracción de un año mayor de tres meses» se paga según los ordinales 1.º y 2.º; «no menor de cinco años» → 23 días para todos los años), escala proporcional del art. 180, práctica del salario diario ÷ 23.83 y plazo de pago de 10 días.
- [x] **SEO/GEO**: metaTitle «Calculadora de prestaciones laborales RD (cesantía)» (51 ch) · metaDescription 144 ch; FAQ ×6 (qué corresponde según el motivo, cálculo de la cesantía con ejemplo 2a4m → 48 días, días de preaviso, vacaciones y Navidad, ÷23.83, privacidad); OG propia; llms.txt 29 herramientas.
- [x] **Docs/recuentos**: clave nueva en `politica-cookies`; receta `design.md` §4 «Calculadora de prestaciones laborales»; recuentos 29/40/40 en README, architecture y skills.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **40/40 rutas PASS**.

---

## Fase BB — Herramienta nueva: calculadora de proteína diaria (18-Oct-2026) — HECHA

- [x] **Herramienta nueva** (30ª, card `calculadora-proteina-diaria`, sección Cuerpo): peso kg/lb + perfil (`Sedentario 0,8–1,0`, `Activo 1,2–1,6`, `Fuerza / ganar músculo 1,2–1,6`, `Pérdida de grasa 1,6–2,2`, `60+ 1,0–1,2` g/kg) + 3/4/5 comidas → rango diario y por comida. Corrección explícita: **1,2–1,6 g/kg suele bastar para ganar músculo** con buena distribución de comidas, salvo fisiculturismo. Patrón D (`holentia:calculadora-proteina-diaria:draft:v1`).
- [x] **SEO/GEO**: metaTitle «Calculadora de proteína diaria: cuánta necesitas» (48 ch) · metaDescription 147 ch; FAQ ×6 (cuánta, ganar músculo, exceso, reparto, suplementos, privacidad); OG propia; llms.txt.
- [x] **Docs**: clave nueva en `politica-cookies`; receta `design.md` §4 «Calculadora de proteína diaria».

---

## Fase BC — Herramienta nueva: test de calidad del sueño (18-Oct-2026) — HECHA

- [x] **Herramienta nueva** (31ª, card `test-calidad-sueno`, sección Mente, separada de la calculadora del sueño): 11 preguntas (duración, latencia, despertares, volver a dormirse, causa —baño/ruido/estrés/dolor—, sensación al despertar, ronquidos, cafeína, pantallas, regularidad y somnolencia diurna) → 0–33 normalizado a 0–100, 4 bandas, consejos según respuestas y bandera de consulta por posible apnea. Inspirado en PSQI/ISI/STOP-BANG e higiene del sueño (AASM), sin diagnosticar. Patrón D (`holentia:test-calidad-sueno:draft:v1`).
- [x] **Enlaces cruzados**: tarjeta «¿Y la calidad de tu sueño?» en el resultado de la calculadora del sueño; desde el test, enlaces a la calculadora de ciclos y a respiración 4-7-8.
- [x] **SEO/GEO**: metaTitle «Test de calidad del sueño: ¿cómo duermes?» (41 ch) · metaDescription 152 ch; FAQ ×6 (qué mide, puntuación, despertares, horas recomendadas, apnea/insomnio, privacidad); OG propia; llms.txt 31 herramientas.
- [x] **Docs/recuentos**: claves nuevas en `politica-cookies` (proteína + test); recetas en `design.md` §4; recuentos **31 herramientas / 42 URLs / 42 OG / 35 claves** en README, architecture y skills.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **42/42 rutas PASS**.

---

## Fase BD — Corrección de proteína en la calculadora de calorías y diferenciación SEO (18-Oct-2026) — HECHA

- [x] **Corrección**: la guía de calorías afirmaba que «desde 0,8 g/kg es suficiente». Ahora la tarjeta «Tu proteína diaria» muestra un rango según objetivo/actividad/edad y aclara que 0,8 g/kg es el mínimo para sedentarios, no la meta si entrenas. La lógica de perfiles se movió a `lib/protein.ts` y la comparten ambas calculadoras.
- [x] **Perfiles en calorías**: bajar grasa → déficit 1,6–2,2; subir músculo → fuerza 1,2–1,6; mantener → sedentario 0,8–1,0, activo 1,2–1,6 o 60+ sedentario 1,0–1,2.
- [x] **Decisión SEO**: se mantienen las dos páginas porque responden a intenciones distintas (calorías/TDEE vs proteína). Calorías resume y enlaza; proteína detalla perfiles, reparto y fuentes. Enlaces cruzados en ambos resultados; no se fusionan.
- [x] **SEO/GEO**: FAQ ×7 (nueva «¿Cuánta proteína debo comer al día?»), metaDescription 141 ch con «rango de proteína según tu objetivo» y `llms.txt` actualizado.
- [x] **Docs**: receta «Calculadora de calorías + proteína» en `design.md` §4 y auditoría registrada en `seo-geo-audit`.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **42/42 rutas PASS**.

---

## Fase BE — Red de enlaces de cuerpo, favicon H y pulido móvil/contraste (18-Oct-2026) — HECHA

- [x] **Enlaces internos**: nuevo `components/tools/related-tools/related-tools.tsx` («Sigue por aquí») con tarjetas-enlace de target completo y haptic `medium`. Calorías enlaza proteína, pasos, hidratación y **test de calidad del sueño**; proteína enlaza calorías, IMC, hidratación y pasos; pasos enlaza calorías, proteína, hidratación y test de sueño; hidratación enlaza calorías, proteína, IMC y pasos; IMC suma proteína a sus 3 enlaces existentes (4 tarjetas).
- [x] **Favicon**: `app/icon.svg` rediseñado como cuadrado redondeado `#121212` con H geométrica blanca (invierte a fondo claro/H negra en `prefers-color-scheme: dark`); `app/apple-icon.png` 180×180 y `public/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` regenerados desde la misma marca con Sharp. Se retira el icono heredado de Vercel.
- [x] **Móvil**: formulario de calorías a una columna en <640 px (`sm:grid-cols-2`) para que «Hombre/Mujer» no se apriete; `min-w-0` en la cabecera de la tarjeta de proteína; enlaces cruzados con `py-2.5` (40 px); bloque relacionado apilado en móvil.
- [x] **Contraste**: botón de sexo seleccionado y textos secundarios sobre `dark:bg-cuerpo-dark` (hint/rango de perfil, guía de calorías, nota legal de proteína) pasan a `text-gray-900`; se elimina `text-white` sobre ámbar pequeño.
- [x] **SEO**: `metaDescription` del hub Cuerpo (149 ch) incluye proteína; enlaces internos recíprocos entre 5 herramientas + sueño. `pnpm audit:seo` **42/42 PASS**.
- [x] **Docs**: recetas en `design.md` §4b-bis/§4c/§7 y `section-ui`; esta fase y auditoría en `plan.md` + `seo-geo-audit`.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` 42/42 + smoke `/icon.svg` y `/apple-icon.png` 200.

---

## Fase BF — Layout equilibrado y enlaces contextuales (18-Oct-2026) — HECHA

- [x] **Proteína**: se eliminó la pila de tarjetas de la columna derecha. Fila principal = formulario (2/5) + héroe compacto + tarjeta de fuentes (3/5); debajo, tarjeta full-width con 4 stats, referencias y nota legal. Empty state con 3 viñetas y `h-full`. Cierre compacto de 3 enlaces.
- [x] **Hidratación**: H1 «Calculadora de Hidratación»; inputs asociados, `aria-pressed` y `type="button"`; actividad/clima en 4 chips por fila desde `sm`; héroe + tarjeta «De dónde sale tu agua» que cierra la altura; empty state útil; cierre `sky` de 3 enlaces.
- [x] **Combustible**: resultado corto cerrado con tarjeta «Tu gasto en perspectiva» (por viaje, por día, ahorro al reducir 10% y al mejorar 1 km/L); consejos a ancho completo; enlace inline a consumo eléctrico.
- [x] **Corte de tarjeta**: empty state `h-full` con 3 viñetas; bloque «¿No encuentras tus fechas?» en el formulario para equilibrar la timeline; enlace a interés de tarjeta.
- [x] **Diarios**: onboarding útil en el empty state (cómo empezar, progreso, privacidad, frases de arranque) para reducir el hueco de la columna de historial; sin tarjetas de relleno.
- [x] **Enlaces contextuales sutiles**: calorías → proteína/pasos/hidratación/sueño; respiración ↔ sueño; lenguajes → apego; preguntas → diario de parejas; combustible → luz; interés tarjeta → préstamo; corte → interés tarjeta; aguinaldo → ahorros; sueldo neto → presupuesto; certificado → interés compuesto. `RelatedTools` compacto de 2–3 enlaces, sin rejillas de 4.
- [x] **Auditoría de layout**: barrido Playwright 1440/390 px, claro/oscuro, con y sin resultado. Huecos de columna resultantes ≤ ~100 px; sin overflow móvil; sin errores de consola.
- [x] **Docs**: `design.md` §3.9/§4 (proteína, hidratación, combustible, corte), `section-ui` §3e y `create-tool`.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **42/42 rutas PASS** · 31 herramientas / 42 URLs / 42 OG / 17 «Próximamente» · 43 enlaces internos únicos, 0 rotos.

## Fase BG — Auditoría de accesibilidad real: axe + teclado/foco (18-Oct-2026) — HECHA

- [x] **Barrido axe-core 4.11** con Chromium/Playwright sobre las 42 rutas × claro/oscuro × 1440/390 px. Primer pase: 7 reglas (`color-contrast`, `button-name`, `heading-order`, `label`, `aria-input-field-name`, `empty-table-header`, `select-name`) y 101 combinaciones con avisos; al finalizar las animaciones `fadeIn` desaparecieron los falsos positivos de tarjetas a medio aparecer. **Resultado final: 168/168 combinaciones sin violaciones.**
- [x] **Estados interactivos**: segunda pasada con resultado/datos en calculadoras (calorías, hidratación, IMC, proteína, pasos, ahorros en ambos modos, compras, aguinaldo, sueldo neto, ITBIS, certificado, tarjeta, préstamo, combustible, corte, compuesto, presupuesto), tests completados (ansiedad, calidad de sueño, lenguajes, apego, perfil de riesgo), diarios con entrada, tracker y glosario filtrado: **0 violaciones**.
- [x] **Correcciones**: botón «Volver» móvil con `aria-label` (crítico `button-name` en todas las herramientas); header móvil de cuerpo a `-darkest` + logo negro (blanco sobre el velo `#eb7433` = 2.97:1); enlaces mente de 12–14px a `text-mente-dark` (4.37→8.19) en tabs, footer, «Ver todas», directorio y botones del shell; `dark:text-gray-500` de cookies → `gray-400` (3.93→7.49); `heading-order` (h2 oculto en hubs, h2 en el formulario de préstamo, grupos de combustible como `<p>`); labels asociados en calorías/corte/interés tarjeta/electricidad y `select` de actividad; celdas del presupuesto con `aria-label` por fila y cabecera de acciones `sr-only`; sliders de préstamo con `thumbAriaLabel`; sufijos kg/cm en `dark:text-gray-300` (4.06→7.00); pérdidas en oscuro a `red-300` (4.48→6.53).
- [x] **Teclado/foco**: skip link enfoca `#contenido`; 30 tab stops por flujo en home, hubs, calculadoras, presupuesto y diarios, todos con anillo visible; menú abre/cierra con Enter/Escape devolviendo el foco al botón; back móvil con nombre accesible; 0 overflow horizontal a 390 px.
- [x] **Docs**: `design.md` §3.3/§3.4/§4/§7, `section-ui` §3c/§6/§7/§8, `architecture.md` §8 y registro en `seo-geo-audit`.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **42/42 rutas PASS** · axe **168/168 + estados, 0 violaciones** · 31 herramientas / 42 URLs / 42 OG / 17 «Próximamente».

---

## Fase BH — Poda del roadmap: solo 3 próximas con demanda real (19-Oct-2026) — HECHA

- [x] **Análisis de las 17 tarjetas**: se conservan las 3 con mejor relación entre demanda, intención de uso, encaje local-first y recurrencia: **Seguimiento de Hábitos** (visita diaria y retención), **Planificador de Comidas** (demanda amplia; enlaza nutrición, compras y presupuesto) y **Rutinas HIIT** (entrenamiento corto, formato generador/temporizador sin depender de vídeo).
- [x] **Descarte de 14 tarjetas** en `lib/data.ts`: Meditación Mindfulness, Visualización Positiva, Ejercicios de Gratitud, Mapas Mentales, Afirmaciones Diarias, Guía de comunicación asertiva, Resolución de conflictos, Establecer límites saludables, Ejercicios de empatía, Yoga para Principiantes, Recetario Saludable, Retos Fitness, Guía de Estiramientos y Comparador Préstamos. Motivos: solapamiento con diario/respiración, formato de artículo sin herramienta, competencia alta con contenido pesado (yoga/recetario) o mantenimiento de tasas bancarias ajeno al modelo local-first (comparador).
- [x] **UI**: los hubs de mente y cuerpo conservan el toggle «Ver todas» con 1 y 2 tarjetas respectivamente; relaciones y finanzas ya no muestran tarjetas ni botón de próximas. Sin rutas nuevas, sin cambios de sitemap ni de metadata.
- [x] **Docs**: estado actual, esta fase y registro en `seo-geo-audit`.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **42/42 rutas PASS** · 31 herramientas / 42 URLs / 42 OG / **3 «Próximamente»**.

## Fase BI — Seguimiento de Hábitos: tracker local-first (19-Oct-2026) — HECHA

- [x] **Producto**: crear/editar/eliminar hábitos con nombre, icono y meta de días por semana; check-in diario con selector de semana (lunes–domingo); navegación a semanas anteriores sin permitir días futuros; sugerencias iniciales para empezar en un clic.
- [x] **Progreso**: héroe con completados del día, avance semanal y racha activa; barra de progreso del día; cada hábito muestra su semana, racha y meta. La racha cuenta días consecutivos y, si hoy aún no hay marca, arranca desde ayer para no romperse antes de terminar el día.
- [x] **Persistencia local (patrón entries)**: una sola clave `holentia:seguimiento-habitos:entries:v1` con hábitos + marcas normalizadas al cargar; guardado inmediato, aviso si el navegador bloquea localStorage y confirmaciones inline para eliminar un hábito o borrar todo.
- [x] **UI mente**: héroe con gradiente/glass, tarjetas de hábito, fila semanal con días deshabilitados si son futuros, iconos Lucide, formulario con selector de icono, metas 1–7, foco visible y tap targets ≥40/44 px; claro/oscuro.
- [x] **SEO/GEO**: card activa con metaTitle (38 ch) y metaDescription (133 ch), página con FAQ ×6, JSON-LD desde el shell, OG propia, `sitemap` 43 rutas, `llms.txt` 32 herramientas y clave nueva en `politica-cookies`.
- [x] **Limpieza**: eliminados `components/tools/compound-interest/calculator-summary.tsx` y `calculator-tabs.tsx`, sin referencias (código muerto).
- [x] **Docs**: estado actual, `README`, `architecture`, `design.md` y registro en `seo-geo-audit`.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **43/43 rutas PASS** · 32 herramientas / 43 URLs / 43 OG / **2 «Próximamente»**.

## Fase BJ — Rutinas HIIT: generador y temporizador local-first (19-Oct-2026) — HECHA

- [x] **Producto**: generador de circuitos de 10/15/20/25 min con nivel (principiante, intermedio, avanzado), enfoque (cuerpo completo, piernas y glúteos, core, cardio) y modo bajo impacto opcional. Estructura exacta: 3 min de calentamiento (4 × 45 s) + 5 ejercicios por ronda (trabajo/descanso según nivel) + 2 min de vuelta a la calma (4 × 30 s); 10/15/20/25 min = 1/2/3/4 rondas.
- [x] **Temporizador**: estados `idle · running · paused · done`; inicio, pausa, reanudación, salto de segmento, detención y repetición; progreso continuo, bloque actual y siguiente, cambio automático de intervalo y resumen final (trabajo, descanso y duración). El reloj deriva de `Date.now()` para no desviarse con pestañas en segundo plano.
- [x] **Persistencia local (solo preferencias)**: `holentia:rutinas-hiit:draft:v1` guarda nivel, enfoque, duración y bajo impacto. No se guarda historial de entrenamientos; una primera visita sin tocar controles no crea la clave. «Restablecer» y «Borrar mis datos» limpian todo.
- [x] **UI cuerpo + a11y**: héroe gradiente/glass con texto negro (AA), controles segmentados con `aria-pressed`, switch de bajo impacto, lista de circuito con iconos Lucide, foco gestionado al iniciar/pausar, región `aria-live`, `role="timer"`/`progressbar`, tap targets ≥44 px y haptics; claro/oscuro y móvil 390 px.
- [x] **SEO/GEO**: card activa con metaTitle (46 ch) y metaDescription (147 ch), FAQ ×6 (incluye privacidad y seguridad), OG propia, `sitemap` 44 rutas, `llms.txt` 33 herramientas, hub de cuerpo actualizado y clave nueva en `politica-cookies`.
- [x] **QA**: flujo funcional (preferencias, recarga, reset, inicio/pausa/reanudar/saltar/completar/repetir/detener), transición automática real a los 45 s, sin overflow a 390 px y axe-core **12/12 combinaciones sin violaciones** (idle/running/done × claro/oscuro × 1440/390).
- [x] **Docs**: `README`, `architecture`, `design.md`, `section-ui`, `seo-geo`, `seo-geo-audit` y esta fase.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **44/44 rutas PASS** · 33 herramientas / 44 URLs / 44 OG / **1 «Próximamente»**.

## Fase BK — Planificador de Comidas: semana + lista de compras local-first (19-Oct-2026) — HECHA

- [x] **Producto**: planificador de 7 días × 3 comidas (desayuno, almuerzo, cena) con 24 ideas curadas (8 por comida) que incluyen ingredientes y etiquetas (rápido, vegetariano, alto en proteína). Permite escribir comidas propias con ingredientes y nota, editar o quitar, rellenar solo los huecos con ideas sin repetir mientras haya variedad y vaciar la semana con confirmación en dos pasos.
- [x] **Lista de compras**: se genera con los ingredientes de la semana, elimina duplicados, indica en cuántas comidas aparece cada uno y permite marcar lo comprado. No inventa cantidades; el texto lo aclara y la FAQ lo refuerza.
- [x] **Editor accesible**: `<dialog>` nativo con `showModal()` (foco atrapado, Escape, clic en el fondo), sugerencias que se aplican en un clic y formulario personalizado; el foco vuelve a la celda que abrió el editor. Celdas con nombre accesible y estados vacíos claros.
- [x] **Persistencia por semanas**: `holentia:planificador-comidas:entries:v1` guarda un mapa de semanas (lunes ISO) con comidas y checks; normaliza datos corruptos, limpia checks huérfanos y no crea la clave en una visita sin cambios. Las semanas se conservan al navegar y la compra marcada es independiente por semana.
- [x] **UI cuerpo + responsive**: héroe gradiente/glass con texto negro (AA), progreso `role="progressbar"`, estadísticas `aria-live`, planner a ancho completo y en móvil apilado por día; lista de compras en 1/2/3 columnas; tarjetas sin altura forzada; tap targets ≥44 px y haptics.
- [x] **Refactor compartido**: `lib/calendar.ts` centraliza `localDayKey`, `parseDayKey`, `addDays`, `startOfWeek`, `getWeekDays`, `formatLongDate` y `formatWeekRange`; hábitos y comidas lo consumen. Smoke test de hábitos sin errores.
- [x] **SEO/GEO**: card activa con metaTitle (52 ch) y metaDescription (151 ch), FAQ ×6 (funcionamiento, comidas propias, lista, semanas, límites nutricionales, privacidad), OG propia, `sitemap` 45 rutas, `llms.txt` 34 herramientas, hub de cuerpo actualizado y clave nueva en `politica-cookies`.
- [x] **QA**: flujo funcional (idea, comida propia, edición, checks, recarga, semanas, vaciado, relleno), 0 overflow a 390 px, teclado (Escape, clic en fondo, foco restaurado) y axe-core **12/12 combinaciones sin violaciones** (idle/plan/editor × claro/oscuro × 1440/390).
- [x] **Docs**: `README`, `architecture`, `design.md`, `section-ui`, `tool-persistence`, `seo-geo`, `seo-geo-audit` y esta fase.
- Verificado: `tsc 0 · lint 0 · build OK` + `pnpm audit:seo` **45/45 rutas PASS** · 34 herramientas / 45 URLs / 45 OG / **0 «Próximamente»**.

## Fase BL — Rendimiento de campo y a11y fina del planificador (19-Oct-2026) — HECHA

- [x] **Auditoría real post-deploy**: Lighthouse 13.5 sobre `holentia.com/planificador-comidas` (Chrome headless de Playwright vía CDP). Baseline: móvil **79** (FCP 0.9 s, LCP 2.5 s, TBT 750 ms, CLS 0), desktop **98** con **CLS 0.093**; `label-content-name-mismatch` en 21 celdas; a11y/BP/SEO 100.
- [x] **Nombres accesibles**: las celdas del planner pasan de `aria-label` (omitía el texto visible «Rápido · 4 ingredientes») a prefijo `sr-only` + contenido visible, de modo que el nombre incluye todo lo que se ve. Lighthouse: **21 → 0 nodos** con fallo.
- [x] **CLS del chrome**: `UnifiedHeader` deja de devolver `null` hasta montar y server-renderiza las dos variantes (`md:hidden` móvil / `hidden md:block` desktop). Cabecera visible desde el primer paint, sin insertar 144 px al hidratar: **CLS 0.093 → 0** y desktop **100**.
- [x] **LCP del héroe**: el héroe del planificador se renderiza en SSR (fallback «Semana actual» y cifras a 0); solo la UI que depende de localStorage/fecha espera al montaje, con skeleton debajo. Element render delay **852 → 412 ms**; LCP móvil **2.5 → 2.1 s** (mediana local); TBT ~750 → ~460 ms.
- [x] **QA**: `tsc 0`, `lint 0`, build OK; `pnpm audit:seo` **45/45**; axe-core **12/12** (idle/plan/editor × claro/oscuro × 1440/390); flujo funcional completo; teclado (Escape/backdrop/foco restaurado); 0 overflow; capturas claro/oscuro 390/1440; cabecera SSR verificada también en `calculadora-imc`.
- [x] **Docs**: `design.md` §3.8/§4/§4d, skill `section-ui` y esta fase.
- Verificado: Lighthouse local móvil **87-88 de mediana** (rango 76-88 por varianza del entorno) y desktop **100**, con a11y/BP/SEO 100. La confirmación de campo (CrUX) queda pendiente del sync a producción.

## Fase BM — Cuerpo: calculadora de grasa corporal (método US Navy) (20-Oct-2026) — HECHA

- [x] **Producto**: nueva herramienta `/calculadora-grasa-corporal` (35ª del sitio) para estimar el porcentaje de grasa y la composición corporal en adultos. Entradas: sexo, altura, peso (kg/lb), cuello, cintura y cadera (solo mujeres). Salidas: % de grasa, categoría de referencia, masa grasa y masa magra, más una escala visual de rangos.
- [x] **Fórmula**: densidad corporal del método US Navy con medidas en centímetros — hombres `1,0324 − 0,19077·log10(cintura − cuello) + 0,15456·log10(altura)`; mujeres `1,29579 − 0,35004·log10(cintura + cadera − cuello) + 0,22100·log10(altura)` — y conversión a % con la ecuación de Siri (`495 / densidad − 450`). Rangos orientativos ACE (esencial, atlético, fitness, promedio, alto) y estado «Muy bajo» para valores por debajo del rango esencial. Validación de rangos realistas y de la relación cintura/cuello.
- [x] **Persistencia** patrón D: borrador `holentia:calculadora-grasa-corporal:draft:v1` ({sex, height, weight, unit, neck, waist, hip}) con debounce de 500 ms tras la primera edición, «Guardado local» y «Borrar mis datos» (el borrado no se reescribe solo). Clave añadida a `politica-cookies`.
- [x] **UI cuerpo**: formulario con sexo como radios nativos accesibles, toggle kg/lb dentro del peso (convierte el valor), cadera condicional en mujeres; héroe gradiente/glass con % y badge; tarjeta con masa grasa/magra y escala ACE activa; guía de medición en la pista sex-specific del formulario y en la FAQ; tarjeta full-width «La fórmula, sin cajas negras» (fórmula, límites y para quién es) y cierre `RelatedTools` con IMC, calorías y proteína. Sin `Chart.js` (CSS/HTML puro).
- [x] **A11y/móvil**: `fieldset`/`legend`, `label htmlFor`, `aria-invalid` en campos fuera de rango, alerta `role="alert"`, `aria-live` en el resultado, `data-interactive` y haptics; escala con `role="list"` y `aria-label` por rango; inputs `text-lg` sin zoom iOS; layout 1 columna → 2 columnas; contraste AA en ambos temas.
- [x] **SEO/GEO**: card en `lib/data.ts` con metaTitle (46 ch) y metaDescription (140 ch) única, hub de cuerpo actualizado (subtitle 206 ch · metaDescription 147 ch), FAQ ×6 (fórmula, exactitud, cómo medir, rangos, IMC vs. grasa, privacidad), OG propia, `llms.txt` 35 herramientas, sitemap 46 URLs y `LAST_UPDATED` al 20-Oct-2026.
- [x] **QA**: `tsc 0`, `lint 0`, build OK; `pnpm audit:seo` **46/46**; axe-core sin violaciones (idle/resultado × claro/oscuro × 1440/390); flujo funcional (hombre/mujer, kg/lb, validaciones, borrado, recarga); teclado (skip link, flechas de sexo, orden de foco, FAQ); 0 overflow; capturas claro/oscuro.
- [x] **Docs**: `README`, `architecture.md`, `design.md` §4/§4b-bis, `plan.md`, skills `seo-geo`, `seo-geo-audit` y esta fase.
- Verificado: **35 herramientas / 46 URLs / 46 OG / 0 «Próximamente»**.

---

## Backlog propuesto (17-Oct-2026, pendiente de decisión)

Sin fase asignada; se convierte en fase al aprobar el frente. Candidatos analizados tras cerrar el pase UI/UX:

1. ~~Auditoría integral de cierre~~ **HECHA (Fase AW)**: `pnpm audit:seo` valida las 37 rutas en un paso (SEO/GEO + estructura a11y + runtime OG); barrido 37/37 PASS.
2. ~~Accesibilidad más allá del color~~ **HECHA (Fase BG)**: barrido axe-core 4.11 en navegador real (42 rutas × temas × viewports, 0 violaciones) + estados interactivos + revisión de foco/orden de tabulación; hallazgos corregidos y documentados.
3. ~~Rendimiento móvil~~ **HECHO (Fase AX)**: lazy-load de Chart.js y de paneles pesados (compuesto 251→139 kB, riesgo 220→151 kB, préstamo 186→145 kB First Load) + framer-motion fuera del camino crítico. Pendiente de campo: CWV reales (Lighthouse/PSI) sobre `dev.holentia.com` tras el deploy.
4. ~~Directorio `/herramientas`~~ **HECHO (Fase AZ)**: índice server-rendered de las 29 por sección (chips ancla) + enlace en el footer; como mejora opcional queda el filtro interactivo y un enlace desde el chrome de home.
5. **«Mis datos»**: exportar/importar JSON de las claves `holentia:*` (respaldo local, sin nube) + enlace en `/ayuda`.
6. **PWA offline**: service worker para que las herramientas funcionen sin conexión (manifest y iconos ya existen).
7. **Nuevas herramientas** (a especificar con el dueño; keywords RD): ~~sueldo neto (TSS + ISR)~~ **HECHA (Fase AY)**; ~~prestaciones laborales/indemnización~~ **HECHA (Fase BA)**; ~~proteína diaria~~ **HECHA (Fase BB)**; ~~test de calidad del sueño~~ **HECHA (Fase BC)**; ~~seguimiento de hábitos~~ **HECHA (Fase BI)**; ~~rutinas HIIT~~ **HECHA (Fase BJ)**; ~~planificador de comidas~~ **HECHA (Fase BK)**; ~~grasa corporal~~ **HECHA (Fase BM)**. Roadmap de herramientas completado: 35 activas y 0 «Próximamente».
8. **Infra de calidad**: CI (GitHub Actions: `tsc` + `lint` + `build` en push a `dev`) y Vitest para los parsers/formatters (hoy sus casos se prueban ad hoc).

---

## Comandos de verificación (solo lectura)
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
vercel inspect https://dev.holentia.com
curl -sI https://holentia.com
gh repo view daurydicaprio/holentia-app --json name,defaultBranchRef,pushedAt
```
