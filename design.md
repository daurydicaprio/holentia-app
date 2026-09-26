# Design System Holentia — estructura, plantilla, colores, bordes

> Fuente única de color: CSS vars en `app/globals.css:78-188`.
> Tailwind mapea vars en `tailwind.config.ts:20-70`. No usar hex suelto en componentes nuevos.

## 1. Tokens por sección

| Sección | Active | Dark | Light | Lighter | Darkest | Glass bg light | Glass border light | Text card | Category | Accent |
|---|---|---|---|---|---|---|---|---|---|---|
| mente | `#1976d2` (`--color-mente-active`) | `#0d47a1` | `#42a5f5` | `#90caf9` | `#0a3880` | `rgba(21,101,192,0.45)` | `rgba(144,202,249,0.55)` | `#fff` | `#e3f2fd` | `#7b1fa2` |
| relaciones | `#7c3aed` | `#5b21b6` | `#a78bfa` | `#c4b5fd` | `#4c1d95` | `rgba(124,58,237,0.45)` | `rgba(196,181,253,0.55)` | `#fff` | `#ede9fe` | `#ec4899` |
| cuerpo | `#ffa000` | `#e65100` | `#ff9800` | `#ffcc80` | `#bf360c` | `rgba(239,108,0,0.45)` | `rgba(255,224,130,0.65)` | `#000` light / `#fff` dark | `#000` light / `#ffe082` dark | `#ff5722` |
| finanzas | `#388e3c` | `#1b5e20` | `#4caf50` | `#a5d6a7` | `#1a4314` | `rgba(46,125,50,0.45)` | `rgba(165,214,167,0.65)` | `#fff` | `#e8f5e9` | `#00796b` |

Modo oscuro `globals.css:153-188`: glass baja a `0.25`, borders a `0.4`, `text-card #fff`, fondo `#121212`, texto `#e0e0e0`.
Base: `--color-background #f8f9fa`, `--color-text-primary #212529`, `--color-text-secondary #495057`, `--radius 0.5rem`.

Canónicos obligatorios en inline styles: mente `#1976d2`, relaciones `#7c3aed`, cuerpo `#ffa000`, finanzas `#388e3c`. Ver bugs a unificar en `plan.md Fase 1` (`logo.tsx:77-85`, `#1565c0/#ef6c00/#2e7d32`).

## 2. Estructura páginas sección

Ruta: `app/{mente,relaciones,cuerpo,finanzas}/page.tsx` (ej `app/mente/page.tsx:15-40`).

```
main.min-h-screen.flex.flex-col.items-center.p-4.sm:p-6
├─ <SectionSwipeNavigation />               // swipe entre secciones, desactivado dentro de tools
├─ div.flex-1.flex-col.items-center.w-full.max-w-6xl.mx-auto
│  ├─ div.relative.w-full.flex.justify-center.mb-2
│  │  ├─ div.mt-6 > <Logo section size="lg" />   // círculo + aura
│  │  └─ div.absolute.top-6.right-0 > <MenuButton section />
│  ├─ <SectionTabs />                        // 4 links, activo color sección + underline 2remx3px
│  ├─ <SectionHeader sectionData />           // h1 + span gradiente + subtitle + h2 ¿Qué quieres aprender?
│  └─ <ToolsGrid cards section />             // grid 1/2/4 cols, gap-5, botón ver-más color sección
├─ <Footer section />
└─ <MobileFab />                              // wrapper de ScrollToTop mobileOnly (solo móvil scrollY>300)
```

## 3. Estructura páginas herramienta (plantilla obligatoria)

Ruta: `app/{slug}/page.tsx` (ej `app/diario-guiado/page.tsx:5-16`):

```tsx
const section = "finanzas" // o mente/relaciones/cuerpo
const toolData = sectionsData[section].cards.find(c => c.slug === toolSlug)
return <ToolPageClient params={{section, tool: toolSlug}} toolData={toolData} toolContent={<MiTool />} />
```

`components/tool-page-client.tsx:68-161`:

```
main.min-h-screen.flex.flex-col
├─ <UnifiedHeader section />                 // móvil: sticky rgba(X,0.7)+blur8 [Volver|HOLENTIA|Menu]; desktop: Logo md centrado + MenuButton
├─ <SectionSwipeNavigation />
├─ div.flex-1.p-4.sm:p-6.max-w-6xl.mx-auto.w-full
│  ├─ (!isMobile) motion.div.text-center.mb-6
│  │  ├─ h1.text-2xl.sm:text-3xl.font-bold style color:sectionColor
│  │  ├─ p.text-gray-600.dark:text-gray-300 description
│  │  └─ div.tool-header-line 4rem x 0.175rem rounded-full bg:headerLineColor
│  ├─ (!isMobile) div.flex.justify-between.mb-6 > Button Volver + Button Donación (border/color sectionColor, blur4)
│  └─ {toolContent}                           // contenedor herramienta: bg-white dark:bg-gray-900 rounded-lg (p-4 móvil / p-6 desktop)
├─ <Footer section />                         // link color var(--color-X-active)
└─ <ScrollToTop section />                    // fixed bottom-6 right-6 3rem rounded-full bg sección
```

En móvil el título vive en el header compacto, no duplicar `h1` dentro del tool.

## 4. Componentes y recetas

**Logo + aura** `logo.tsx:112-148`: wrapper `relative flex center`, aura `motion.div absolute z-0 rounded-full blur 8-10px opacity 0.25 hover 0.45` con `auraColor` sección, animación circular 10s + hover scale 1.03. Tamaños: `sm w-10 h-10 text-xs`, `md w-24 h-24 text-sm`, `lg w-32 h-32 sm:w-40 sm:h-40 text-lg sm:text-2xl`. Clases CSS equivalentes: `.logo-aura`, `.logo-aura-{mente,cuerpo,finanzas,relaciones}`.

**SectionTabs** `section-tabs.tsx:58-99`: links con `baseTabStyle` gris + activo `color var(--color-X-active) font 600 opacity 1`, underline `div absolute bottom -4px w 2rem h 3px rounded-full bg sección`. Clases: `.section-tab`, `.section-tab-{X}`, `.section-tab-active`.

**SectionHeader** `section-header.tsx:9-31`: `h1 text-3xl sm:text-4xl font-bold` + `span style backgroundImage linear-gradient(var(--color-X-active),var(--color-X-active-dark)) + backgroundClip text + transparent`. Clases: `.section-title-highlight-{X}`.

**ToolCard** `tool-card.tsx:40-90,137-157`: glass `padding 1.5rem, radius 16px, border 1px solid borderColor, backdrop blur 20px, height fija 180px, flex column space-between, shadow 0 12px 28px rgba(0,0,0,0.1)` si disponible sino `0 6px 16px + opacity 0.6`. Fondos: disponible `rgba(X,0.75) light / 0.4 dark`, no disponible `0.35 / 0.2`. Textos: categoría `uppercase 0.7rem tracking 0.05em`, título `1rem semibold (1.25rem móvil)`, descripción `0.8rem (0.9rem móvil)`. Excepción cuerpo light texto `#000`. `ChevronRight h-6` derecha centro. No disponible → `.card-coming-soon::before "Próximamente" blur4`.
Bordes: `--card-border-radius 14px`, `--card-padding-v 18px / -h 22px`, `--card-gap 20px`, `--card-shadow 0 10px 25px rgba(0,0,0,0.06)`, hover `0 15px 35px rgba(0,0,0,0.08)`, `.card-hover-effect translateY -2px scale 1.05`.

**Botones**: outline sección `border sectionColor + text sectionColor + bg rgba(255,255,255,0.6) light / rgba(0,0,0,0.2) dark + blur4 + h-10 px-5 hover scale 1.05`. Sólido sección `bg #388e3c hover #1b5e20 text white` (finanzas; equivalente por sección). Tabs móviles activos `bg sección text white` (`budget-tabs.tsx`, `mobile-tabs-navigation.tsx`, `loan-calculator-tabs.tsx` con `layoutId activeTab`).

**Sliders** `globals.css:190-210,342-377`: track `h 8px rounded gray-200/424242`, fill `var(--color-finanzas-active)`, thumb `20px white border 2px sección shadow`. Usar `data-interactive="true"` para no chocar con swipe.

**Headers/footers**: línea tool `.tool-header-line 4remx0.175rem` + `.tool-header-line-{X}`. Header móvil tool `sticky top-0 z-50 blur8`. Footer link hover a `*-dark`. ScrollTop/FAB `fixed bottom-6 right-6 3rem rounded-full shadow`.

## 5. Responsive / móvil — cuándo qué

Umbral único `useMediaQuery("(max-width:768px)")` (`hooks/use-media-query.ts`).
- **Wizard con tabs** si tool tiene >2 bloques o tablas (patrón `budget-simulator.tsx:97-197`): `BudgetTabs + render condicional activeTab + Anterior/[N de M]/Siguiente + barra progreso 33/66/100% + p-4`. Financieras añaden `TabSwipeNavigation tabs=[...] 50px` + tabs visibles abajo. Tablas ocultas en móvil tras tab `Amortización/Gráficos/Simulaciones`.
- **Responsive simple** si form de un paso (`hydration`, `journal`, `love-test`): mismo árbol, `space-y-6 p-6`, `w-full p-3 inputs`, `grid sm:grid-cols-2`, `textarea min-h 100px`, `button w-full p-4 border-2`. Shell móvil global hace el resto.
- Swipe secciones desactivado dentro de tools (`section-swipe-navigation.tsx:20-31`). Swipe intra-tool ignora `input,button,a,select,textarea,[role=slider],[data-interactive]` (`tab-swipe-navigation.tsx:34-76`).
- Haptic en acciones: `medium` guardar/volver, `light` tabs/links (`hooks/use-haptic-feedback.ts`).

## 6. Datos y tipos

`types/index.ts`: `SectionType mente|cuerpo|finanzas|relaciones`, `CardData {id,title,description,slug,isAvailable,category}`, `SectionData`.
`lib/data.ts`: 36 cards, 11 disponibles (cuerpo: calorías + hidratación primero; finanzas suma consumo eléctrico, tarjeta, interés de tarjeta y test de perfil de riesgo). Nueva card debe traer `slug = ruta app/{slug}` y `category = sección` para heredar color. Las activas van primero en su sección.
Storage: helper `lib/storage.ts`, keys `holentia:{slug}:{draft|simulations|entries}:v1` (diario migrado de clave legada). Taxonomía E/D/S por herramienta (ver `plan.md Fase 3`).
Patrones de layout por tool (todos sobre `ToolPageClient` + color de sección): wizard por pasos (presupuesto), inputs+resultado lado a lado (interés), form+tabla con tabs (préstamo), timeline vertical (tarjeta), factura-papel (luz), objetivo-primero (calorías), controles+heroe+plan-dia (hidratación: chips icono en vez de selects, héroe ámbar con desglose de fórmula y minis vasos/botellas/litros, plan del día 5 hitos con acento `sky` solo para agua, tarjeta contraste verde/rojo de señales), controles+heroe+desglose (interés tarjeta: 5-col, héroe verde o rojo según si el pago baja el saldo, minis interés/total/costo%), quiz honestidad con resultado (perfil de riesgo: wizard **12 preguntas** como `love-test` en lenguaje de escenarios para principiantes, héroe "Perfil de riesgo" + sugerencia + descripción del nivel, candado de conocimiento, arco SVG 5 niveles en `risk-levels-graphic.tsx` con 4–5 en rojo, sección niveles colapsada con botón "Ver niveles de inversor · Daury" y título grande centrado al abrir, resultado en **9 bloques con jerarquía de pasos** (`SectionHeader` con badge Paso 1/2/3 + Extra, títulos `text-2xl`, cuerpo `text-sm`, `space-y-8/10`, tarjetas con borde), héroe **"Eres {profileName}"** (Conservador / un inversor en crecimiento / un buscador de oportunidades) + pill "Sugerencia: nivel N de 5" + nivel plegado en `disclosure.tsx` (details/summary + Info, labels con information scent), tarjeta **"Sugerencia para tu colchón" en 4 tramos** (<5k cuenta · 5k–10k AFI · 10k–35k 20/80 cuenta/AFI · ≥35k 30/40/30 · USD fondo 30 días) con barra apilada, cajas explícitas "Si inviertes tu fondo" / "Si lo dejas parado" (inflación **3%**), 3 doughnuts situacionales Chart.js con montos A/B/C solo si capital ≥ umbral por moneda (DOP ≥ 100k / USD ≥ $3k) o 1 tarjeta "Tu distribución sugerida" + instrumentos alcanzables si no, distribución con mínimos reales (`feasibleSlices` clampa rodajas al mínimo por instrumento · fallback `singleSliceFor` 1 instrumento A→AFI/B→Cert/C→AFI/USD→Fondo 30 días · pcts fraccionales con monto exacto · banner si < piso RD$5,000/$200), fondo de emergencia FUERA de pasteles con chips Sin fondo/2×/4× + input % ahorro → meses + **gráfico `FundProjectionChart`** (línea colchón + meta 2× punteada, cap 72 meses, legend abajo) + link `crear-presupuesto-personal`, pasteles USD sin AFI (nivel 1 = 100% Fondo 30 días), capitales mínimo RD$5,000 / USD **$200** con cap de nivel (DOP $5,000 · USD $3,000) (sin conversión visible), tasa 8/10/15% default 8 DOP / 10 USD, moneda default DOP, proyección 5–10 años + botón interés compuesto + link tarjeta corte/vencimiento, Tipo D), responsive simple (diario, amor).

Patrón `perfil-riesgo` ronda 6 (prevalece sobre lo descrito arriba): héroe = `{profileName}` + pill "Quédate en el nivel N" + razón (sin prefijo "Eres") + `blurb` del nivel; títulos solo "Nivel N"; arco SVG navegable (`selectedLevel`/`onSelect`, clic pinta fila y nodo, "Tuyo" únicamente en el nivel activo, inactivos `opacity-60`/`#9ca3af`); `SectionHeader` con badge **inline** en la fila icono+título; pasteles A/B/C desde **RD$50,000** (USD $3,000); colchón >RD$50,000 reparte 20% cuenta / 56% AFI líquido / 24% certificado (70/30); tasas **editables por instrumento** en Paso 2 (`rates` en el draft: `afi 8 · cert 6 · afi30 9 · etf 10 · usd30 10`, sin chips globales); % de ahorro = chips 5/10/15/20 (default 10) + campo manual (`w-24` fijo, no salta de línea); proyección **ponderada por rodaja** dentro del Paso 3 con "Tasa combinada ~N%" y pie que cita solo las tasas de la moneda activa; inputs de dinero `type=text` + `filterNumeric/formatWithCommas` (coma de miles); bloque "¿Prefieres no invertir?" con CTA alineado a la derecha; bloque instituciones SIB en paleta `sky` (`Landmark`, `href="#"` placeholder); `FundProjectionChart` con curva azul punteada "Ahorro + AFI líquido (~N%)" y 240px de alto. Moneda USD sin AFI: pasteles = Fondo 30 días.

Patrón `perfil-riesgo` ronda 7 (prevalece sobre lo anterior): héroe = `profileName` **sin artículo** ("Inversor en crecimiento", no "un inversor…"); draft a medio camino reanuda en el quiz (`currentQuestion = answered.length`) y `Borrar mis datos` llama a `resetAll()` (sin que el autosave re-grabe); "Volver a finanzas" solo navega; pie de proyección con `rateSummary(labels, rates)` que **cita únicamente las tasas de las rodajas usadas** (dedupe por clave, cuenta a la vista excluida, sin inversión → "sin inversión (todo en cuenta)"); caja de colchón verde unificada con `rateSummary` solo si `fundCanInvest`, si no **caja ámbar "Todavía no abres el instrumento"** con el mínimo real; proyección oculta con `capital > 0 && maxTogether > 0`; `FundProjectionChart` recibe `rateLabel` ("fondo a 30 días" en USD / "AFI líquido" en DOP) y copia "con la tasa que definiste (~N%)"; nota condicional (1 instrumento por mínimos / "En dólares y a tu nivel todo va al fondo a 30 días"); quiz con botón **"← Atrás"**, opción elegida marcada con `aria-pressed` y filas de nivel `role="button"` + `tabIndex` + `aria-label` + Enter/Espacio; banner capital **ámbar si `canInvestNow` (alcanza el mínimo, p.ej. USD $200–3,000) o rojo si no**; inputs de tasa con `onBlur` que normaliza 0–100% (vacío → default) y `readRate` clampa el cálculo; CTA instituciones apunta a `https://www.sb.gob.do/supervisados/` con `target="_blank" rel="noopener noreferrer"` (nunca `href="#"`).

Patrón `perfil-riesgo` ronda 8 (prevalece sobre lo anterior): **montos** con `formatWithCommas` donde la coma **siempre es de miles** y el punto admite máximo 2 decimales ("10,000.00"; nunca convertir una coma ya formateada en decimal) y `inputMode="decimal"`; **tasas** con `filterRate` limitado a **2 dígitos + 2 decimales** (tope 99.99 en `onBlur` y en `readRate`), `DEFAULT_RATES.usd30 = 2.5` con hint "Referencia ~2.5%: casi siempre, a veces un poco más"; héroe con el contenido del `Disclosure` dentro de un **recuadro translúcido** (`rounded-lg border-white/30 bg-white/15 px-4 py-3`) y **microanimación** `animate-fadeIn` que `Disclosure` repite en cada apertura (remonta con `key` por evento `toggle`); **todo bloque informativo largo va bajo su gráfico y dentro de un `Disclosure` con icono Info** (Paso 3: "Instrumentos a los que alcanza tu monto" va tras los pasteles, arranca cerrado); CTAs secundarios en **contorno** (borde `#388e3c`, fondo claro, `text-sm`, mensaje en su propia línea y libre para ocupar 2 líneas) en vez de botón verde sólido; **repartos en bloques grid** (`sm:grid-cols-3/2` con clase literal, nunca dinámica) y no en listas apiladas cuando hay 3 tramos (sugerencia del colchón 20/56/24, cada bloque `rounded-lg border-[#388e3c]/25 bg-white/70 p-3`); bloques largos **sub-divididos con icono + subtítulo** para que se entiendan ("Sin fondo" = qué es · cuánto ahorras · gráfico · recuadro de interés compuesto con los meses ahorrados (`monthsToFundInvested`) · recuadro de mínimos RD$5,000/RD$10,000 + "históricamente las AFI son las que más rinden"); `FundProjectionChart` con la curva de inversión en **`#0ea5e9` (sky-500), 3px, `fill: false`** para que se distinga del relleno verde.

Patrón `perfil-riesgo` ronda 9 (prevalece sobre lo anterior): **niveles con copy propio** en `risk-levels-graphic.tsx` (`LEVELS` con `profileName` N2 "Invertir en la bolsa de valores EE.UU. / mundial" y N3 "Invertir en acciones individuales"); **héroe = 1 solo `<p>`** con `result.reason` + `blurb` (nunca dos párrafos) y `h2` `text-3xl sm:text-4xl lg:text-5xl max-w-3xl`; **campos de tasa siempre vacíos con placeholder gris = default** (`EMPTY_RATES` en el draft, `RATE_META`/`DEFAULT_RATES 8 · 7.5 · 9 · 8.5 · 2.5`, el placeholder es el valor que se usa y ni escribir ni `onBlur` rellenan el campo, grid `2/3/6` columnas, monto `sm:max-w-md`); **el nivel limita los instrumentos y el monto reparte los %** (`distributionFor` sobre `dopBaseSlices`/`usdBaseSlices` con `USD_RATE = 60`, `sliceMinFor`/`adjustSituation`, `distributionOptionsFor` para A/B/C, `LEVEL_CAP {DOP: 5000, USD: 3000}` para el chip "Capital pequeño"; N1 = 4 métodos locales + cuenta USD desde US$500, N2 = +ETF, N3 = + acciones; mínimos RD$5,000 / RD$10,000 / US$500 / US$200); **Paso 3** con badge de tipo de cambio `US$1 ≈ RD$60 · el peso pierde ~3–5% anual frente al dólar` (solo en vista DOP con instrumentos en dólares), filas USD como "RD$X · ≈ $Y" (`formatMoney(USD)` → "$2,000") y un `Disclosure` agrupado con los montos "En pesos" y "En dólares"; **gráfico del colchón interactivo** (`FundProjectionChart` con `mode: "save" | "both"`, control segmentado "Solo ahorrar | Ahorrar + invertir", `pointRadius` por tramos 2.5/1.8/1.2 a ≤24/≤48 meses, `pointHoverRadius: 5`, plugin `endLabelsPlugin` que deja la etiqueta del último punto con su cajita, recuadro celeste `border-sky-200 bg-sky-50` con 2 variantes de copy según el ahorro, todo solo cuando no hay fondo y el caption explica la línea punteada azul); **Paso 1 en 3 tarjetas numeradas** (`1 · Ver detalles` con tinte `border-[#388e3c]/25 bg-[#388e3c]/5`, `2 · ¿Prefieres no invertir tu fondo de emergencia?` con texto a ~3 líneas y la pregunta "¿cuándo fue tu última emergencia?" dentro del `Disclosure` "Leer más", `3 · ¿No dominas…` con mensaje a la izquierda y CTA en contorno a la derecha en fila `flex-col sm:flex-row sm:justify-between` — botón siempre hermano, nunca anidado); **inflación ~4% (meta del BCRD)** en las cajas "Si lo dejas parado", instituciones **SIB** para AFI/certificados y **SMV** para bonos/reportos, y caption de proyección con el cálculo "monto × (1 + tasa) por año, rodaja por rodaja".

Patrón `perfil-riesgo` ronda 10 (prevalece sobre lo anterior): **título del héroe = `profileName` con los nombres establecidos del perfil** (Conservador · Inversor en crecimiento · Buscador de oportunidades · Inversor apalancado · Jugador de derivados); las frases de acción ("Invertir en la bolsa de valores EE.UU. / mundial", "Invertir en acciones individuales") van en el **`blurb`/copy**, nunca en el `h2`. **El desplegable de niveles vive dentro del recuadro del héroe**: píldora `absolute right-3 top-3 sm:right-5 sm:top-5` + `rounded-full border border-white/40 bg-white/15 px-2.5 py-1.5` con icono + "Ver niveles" + chevron, y el panel se abre **justo debajo del héroe**; no existe la barra de ancho completo. **Sin numeración visible en las tarjetas** (nada de "1 ·", "2 ·", "3 ·"): los títulos se entienden solos. **Paso 2 = 2 recuadros `grid gap-4 lg:grid-cols-2`** con títulos `text-center`, contenido centrado y verticalmente centrado en la caja izquierda (`flex flex-col justify-center`), copy corto bajo el monto y las notas de tasa centradas; **toda tasa muestra su default real en el placeholder** (`mv = 10%`). **Encabezados de grupo en el disclosure de instrumentos = píldora centrada** `rounded-full border border-[#388e3c]/40 bg-[#388e3c]/15 px-4 py-1 text-sm font-bold uppercase tracking-wider` (antes `text-xs` suelto alineado a la izquierda).

## 7. Prohibido en nuevas herramientas

Hex suelto fuera de tokens, clases dinámicas `bg-${x}` / `ring-${x}` / `w-${x}` (Tailwind no las genera), `alert()`, `console.log` en prod, `any[]`, `ignoreBuildErrors`, guardar fuera de `holentia:*`, fetch/analytics, duplicar `h1` en móvil, romper `max-w-6xl + p-4/sm:p-6`.
