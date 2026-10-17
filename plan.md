# Plan Holentia — checklist por fases

> Repo `daurydicaprio/holentia-app`. Rama trabajo `dev` → preview `dev.holentia.com`.
> Prod `holentia.com → main`. No tocar dominios.
> Principios: sin DB, sin registro, local-first privado (`holentia:*` en navegador), cero tracking.

## Estado actual (14-Oct-2026) — 13 tools en `dev` y en `main`; SEO + GEO moderno desplegado en ambas
- [x] Stack: Next 15.5.26 + React 19.3 + Tailwind 3.4 + next-themes 0.4.6 + Framer Motion 12 + Lucide + Chart.js 4.5 — `tsc 0 errores`, build estricto sin ignores, `lint 0`
- [x] Cobertura: 13 tools (`diario-guiado, test-lenguajes-amor, calculadora-calorias, calculadora-hidratacion, crear-presupuesto-personal, calculadora-interes-compuesto, calculadora-prestamo, calculadora-consumo-electrico, calculadora-gasto-combustible, tarjeta-corte-vencimiento, calculadora-interes-tarjeta, test-perfil-riesgo, glosario-financiero`)
- [x] SEO/GEO moderno: metaTitle+metaDescription por tool, JSON-LD (WebApplication/Breadcrumb/FAQPage/AboutPage/Collection), OG images por ruta (17), twitter `summary_large_image`, robots con bots de IA, `lang es-DO`, manifest, footer enlazado (sin páginas huérfanas), sitemap 23 URLs con lastmod fijo, llms.txt 13 tools; skill `seo-geo`
- [x] Vercel `holentia-app` Node 22.x, env vacío, `dev.holentia.com → dev`, `holentia.com → main` — **`main` actualizado a `bb82c6e` (14-Oct)**
- [x] `tsc 0 errores + next build OK + pnpm lint 0` en estricto
- [ ] **Próximo**: modificaciones en herramientas (pedido del usuario, pendiente de spec)

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

## Comandos de verificación (solo lectura)
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
vercel inspect https://dev.holentia.com
curl -sI https://holentia.com
gh repo view daurydicaprio/holentia-app --json name,defaultBranchRef,pushedAt
```
