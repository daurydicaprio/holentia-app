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
- [x] `politica-cookies` lista las 12 claves activas (11 tools, compuesto/préstamo con simulations) + `README` privacidad y catálogo
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
