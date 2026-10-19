---
name: section-ui
description: Use for ANY HOLENTIA UI work (componente nuevo, colores por sección, tokens Tailwind, tipografía Inter, iconos lucide, hover, modo claro/oscuro, contraste, gradiente vs glass) — canonical palette, class recipes and dark mode rules extracted from design.md.
---

# UI por sección (colores, tipografía, iconos, modos)

Receta visual canónica. Antes de tocar UI, leer `design.md` (mantiene más detalle). **Si cambias un patrón visual, actualizar `design.md` §recetas y esta skill en el mismo commit.**

## 1. Tokens — la clave `DEFAULT` va SIN sufijo

Claves en `tailwind.config.ts` por sección: `DEFAULT dark light lighter darkest foreground glass border text category accent`.

```text
✅ bg-mente · text-finanzas · from-cuerpo · border-relaciones · focus:ring-finanzas
❌ bg-mente-DEFAULT · text-finanzas-DEFAULT · from-cuerpo-DEFAULT   (NO EXISTEN → clases muertas)
```

Si una clase nueva no aparece en el CSS compilado (`.next/static/css/*.css`), casi siempre es esto.

**Tampoco hay modificadores `/opacidad` sobre tokens de sección** (`bg-finanzas/10`, `bg-mente-lighter/50`): los valores son `var(--…)` sin `<alpha-value>` → Tailwind **no genera la clase** (muerta en silencio). Usa tokens `glass`/`glass-border` (ya con `rgba`), colores sólidos, o nativos de Tailwind (`bg-black/5`, `bg-white/10`).

## 2. Paleta canónica

| Sección | Canónico | Dark | Light | Lighter | Darkest |
|---|---|---|---|---|---|
| Mente | `#1976d2` | `#0d47a1` | `#64b5f6` | `#90caf9` | `#0a3880` |
| Relaciones | `#7c3aed` | `#5b21b6` | `#a78bfa` | `#c4b5fd` | `#4c1d95` |
| Cuerpo | `#ffa000` | `#e65100` | `#ffb74d` | `#ffcc80` | `#bf360c` |
| Finanzas | `#388e3c` | `#1b5e20` | `#66bb6a` | `#a5d6a7` | `#1a4314` |

Nunca hex suelto en componentes: clases Tailwind o CSS vars (`var(--color-finanzas-active)`).

**Favicon/PWA** (18-Oct-2026): `app/icon.svg` = cuadrado redondeado `#121212` + H geométrica blanca, con inversión clara/oscura vía `prefers-color-scheme`. `app/apple-icon.png` 180×180 y los `public/icon-*` se generan desde la misma marca; no volver al logo heredado de Vercel.

## 3. Tipografía

- Fuente única: **Inter** (`next/font/google` en `app/layout.tsx`, body hereda). No cargar otras fuentes.
- H1 herramienta: `text-2xl sm:text-3xl font-bold text-{s} dark:text-{s}-light` (lo pinta `ToolPageShell`).
- H2 interno: `text-xl font-bold` · H3: `text-lg font-semibold`.
- Cuerpo: UI densa `text-sm` · hero/buscador `text-base` · captions `text-xs`.
- Números en tableros: `tabular-nums`. Énfasis de home/hub: gradiente `bg-clip-text`.

## 3b. Escala unificada (SSOT: design.md §3 — resumen operativo)

Un rol = una clase. No inventar radios/paddings nuevos; copiar del componente de referencia.

| Rol | Clase | Referencia |
|---|---|---|
| Control (botón/input/chip/tab) | `rounded-md` | botones shell, input glosario, tabs |
| Micro-contenedor (recuadro interno) | `rounded-lg` + `p-4` tip / `p-3` stat | caja de ejemplo, stats |
| Sub-superficie (item/tabla/modal/dropdown) | `rounded-xl` + `p-5` | item FAQ, tarjeta de resultado |
| Superficie mayor de herramienta | `rounded-2xl` + `p-6 sm:p-8` hero / `p-6` FAQ | ToolCard, panel hero |
| Superficie mayor de página de contenido (ayuda/apoyar/legales) | `rounded-2xl` (tarjeta) / `rounded-xl` (mini) | info cards §4c |
| Círculo/pill | `rounded-full` | círculo FAQ, dots |

- Página herramienta: `p-4 sm:p-6 max-w-6xl mx-auto` · header→contenido `mb-6` · grupos `space-y-6/10` · grids `gap-4` (tarjetas de herramientas y contenido) / `gap-6` (formularios).
- **Foco canónico** (un solo patrón): `focus:border-transparent focus:ring-2 focus:ring-{s}` + `dark:focus:border-transparent dark:focus:ring-{s}-light`. Prohibido `ring-green-500`/hex en foco.
- **Migración de legado**: hex bare de paleta → token (mismo valor); hex **con opacidad** `[#388e3c]/10` se deja así (tokens no admiten `/n`); `#81c784` ya migrado → `finanzas-light` en clases y `#66bb6a` en JS (Chart.js necesita hex crudo).
- **Chrome global** (menu-button/logo/scroll-to-top/unified-header): acento por defecto **neutro** (nunca `#3B82F6`), **sin framer-motion** (CSS puro), sin estilos inline de color (mapa de clases por sección, patrón footer), sin `scale` en hovers. Ver `design.md` §4d.

## 3c. Formularios de herramienta (inputs, ayuda ⓘ y agrupación)

Receta para cualquier calculadora/test con varios campos numéricos (referencias canónicas: `compound-interest/calculator-inputs.tsx`, `fuel-expense-calculator/fuel-expense-calculator.tsx`):

- **Labels limpios, sin paréntesis de unidad** ("Precio del combustible", no "Precio (por galón)"). La unidad va como **icono a la izquierda del input** (`DollarSign`/`MapPin`/`Calendar`/`Gauge`/`Percent`, `absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`, input con `pl-10`).
- **Ayuda contextual con ⓘ**: a la derecha del label, botón `HelpCircle size={16}` (`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400`, `aria-label="Información sobre …"`) con tooltip `absolute right-0 top-full mt-2 p-3 w-64 z-20` (`bg-white dark:bg-gray-800 border rounded-lg shadow-lg text-xs`) gestionado por estado `activeTooltip` (`onMouseEnter`/`onMouseLeave`). Texto del tooltip en un mapa `TOOLTIPS` en el componente. No uses framer-motion para esto.
- **Agrupar en la misma línea los campos cortos** (1–2 dígitos: viajes/día, días/semana, años/tasa): `grid grid-cols-2 gap-3` (o `cols-3`) con un `Field` por celda. Los campos que ameriten ancho completo (precio, distancia, consumo) van solos, `w-full`. Regla: agrupa siempre que quepan sin apretar; no agrupes por rellenar.
- **Chips de preset** debajo de su campo relacionado (distancia corta/media/larga, días 5/6/7): `chipClass(selected)` = outline con `border-finanzas text-finanzas-dark dark:border-finanzas-light dark:text-finanzas-lighter` si activo (ver §7 finanzas), neutro si no; `py-2.5` (36–40px); `data-interactive="true"` + haptic `light`.
- Sin títulos redundantes dentro del panel ("Tu rutina" y similares sobran: el label de la herramienta ya da contexto; ahorra pantalla).
- **Selector de vehículo** (si existe): `grid grid-cols-3 gap-2`, celdas `p-2 gap-0.5 rounded-xl` con icono `h-4 w-4`, nombre `text-xs` y dato clave `text-[11px]`; seleccionado = `border-2 border-{s} text-{s}-dark dark:border-{s}-light dark:text-{s}-lighter` (el texto base directo solo si pasa AA a 12px; radiogroup accesible).
- **Mobile (obligatorio)**: input nunca `text-sm` a secas (iOS hace zoom al enfocar): genérico `text-base md:text-sm`, **numéricos de herramienta `text-lg font-semibold`** + `type="text"` + `inputMode` (`numeric`/`decimal`) con saneado (el `type="number"` rompe decimales parciales). Filas que no caben (presets de 3 columnas, inputs con sufijo tipo kg/lb) → apiladas a ancho completo en móvil (`grid gap-*` + `sm:grid-cols-*`; preset en fila = label izquierda + valor derecha). Tap targets ≥44px (steppers `h-10 w-10`); tabla en `overflow-x-auto`.
- **Dos variantes del input canónico (17-Oct-2026)**: numéricos `text-lg font-semibold`; texto libre (nombre, y también `type="date"`) → `text-base` sin semibold (`inputClassText`). El `inputMode`/saneado aplica igual a días, años y tasas (coma decimal normalizada en el parser: `"60,5"` → 60.5). Sobre `components/ui/input.tsx`: el base trae `h-10`/`md:text-sm` y gana en el merge → el override debe anular con `h-auto` y `md:text-lg`. **Celdas de tabla editables** (budget-simulator): borrador local por celda (`Record<string,string>` con commit al parsear y limpieza en `onBlur`) + `type="text"`; medidas compactas `px-2 py-2 text-base` (≥16px anti-zoom).
- **Nombres accesibles (Fase BG, 18-Oct-2026)**: todo campo visible lleva `id` + `htmlFor`; el `placeholder` nunca sustituye al label. Grupos de botones/radios: `<span id>`/`<p id>` + `role="group" aria-labelledby`. Tablas editables: `aria-label` por celda con la fila (`Objetivo de {concepto}`) y cabecera de acciones con `<span className="sr-only">Acciones</span>`. Sliders Radix: `thumbAriaLabel` (el thumb es el `role="slider"`). Botones icon-only con `aria-label` y SVG `aria-hidden`; los hubs añaden un `h2` real/oculto antes de las tarjetas (`h3`) y los formularios usan `h2`, no `h3` suelto.
- **Moneda**: siempre `formatDOP` de `lib/format.ts` (es-DO/DOP) — nunca locales/monedas ajenas (`es-MX`/`MXN`) ni `$` pelado. Botones de resultado con `animate-result-in` llevan `aria-live="polite"`.

## 3d. Bloque «Sigue por aquí» (enlaces internos sutiles)

Componente compartido: `components/tools/related-tools/related-tools.tsx`. Úsalo al cerrar una herramienta; no inventes otra rejilla de enlaces.

- **Formato compacto**: superficie `rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800`, título `text-sm font-semibold` + intro opcional `text-xs`, y enlaces en línea `text-sm` con icono `h-4 w-4` + `ArrowRight h-3.5 w-3.5`.
- **Máximo 3 enlaces** (2 es lo ideal). Sin descripciones por enlace, sin tarjetas-enlace grandes, sin rejillas de 4. Cada enlace conserva `data-interactive="true"`, haptic `medium` y `py-2.5` (área táctil ~40 px).
- Hover neutro: texto `text-gray-600 dark:text-gray-300` → acento de sección; no cambiar el fondo de toda la superficie.
- Solo relaciones reales (calorías ↔ proteína ↔ pasos ↔ hidratación ↔ IMC; test de sueño desde calorías/pasos). No enlaces de relleno ni “todo con todo”.
- **Acento**: por defecto `cuerpo` (ámbar). Hidratación usa `accent="sky"` (sky-600/400) porque su tema de agua es una excepción semántica ya establecida; no mezclar ámbar en esa herramienta.
- **Enlaces contextuales primero**: cuando el texto ya menciona la relación (p. ej. «cubre tu proteína», «8,000–10,000 pasos», «usa la calculadora de hidratación»), convierte esas palabras en `Link` inline y no añadas un bloque extra. El bloque compacto es el cierre, no la única vía de enlazado.

## 3e. Layout de herramienta sin huecos (18-Oct-2026)

Regla obligatoria para calculadoras con formulario + resultado. Nace del hueco enorme que dejaba la calculadora de proteína al apilar 4 tarjetas secundarias en la columna derecha mientras la izquierda solo tenía el formulario.

- **Fila principal = formulario + héroe de resultado**. El héroe va compacto (alto natural); si el formulario es más alto, cierra la columna derecha con **una sola tarjeta secundaria útil** debajo del héroe (proteína: fuentes; hidratación: de dónde sale el agua; combustible: gasto en perspectiva). Debe aportar información real, no relleno. Si no existe esa tarjeta, deja el formulario `h-fit` y un hueco pequeño de página, nunca un panel de color gigante semivacío.
- **Contenido secundario pesado (desglose, referencias, notas legales) va a ancho completo**, debajo de la fila principal. Agrúpalo en **una tarjeta** con subgrid interno (`lg:grid-cols-2` o una fila de stats) en vez de una pila larga al lado del formulario.
- **Prohibido**: columna derecha con 3+ tarjetas apiladas + columna izquierda corta con `h-fit` → hueco de cientos de píxeles. Si detectas huecos > ~100 px, mueve un bloque a ancho completo o añade **una** tarjeta útil; no rellenes con texto de relleno.
- **Resultado corto + formulario alto** (combustible, corte de tarjeta): añade debajo del resultado una tarjeta compacta de perspectiva/ayuda (2–4 filas) o traslada una guía al formulario. No dejes 200–400 px vacíos.
- **Empty states**: ocupan el alto disponible (`h-full`/`flex-1`), pero incluyen una frase útil y, si aporta, 2–3 viñetas de lo que verá el usuario. Nunca un panel gigante con solo un icono.
- **Editores (diarios)**: la columna de escritura es la principal; el historial vacío puede ser corto. Se permite onboarding útil dentro del empty state (cómo empezar, progreso, privacidad), pero no tarjetas de relleno. La regla estricta de alturas aplica sobre todo a calculadoras formulario + resultado.
- **Móvil**: orden natural formulario → resultado → detalle → referencias → enlaces. El contenido secundario no debe adelantarse al resultado.
- **Verificación visual obligatoria** con Playwright/Chromium si está disponible: desktop 1440 px y móvil 390 px, claro y oscuro, con resultado y sin resultado. Revisar que no haya huecos > ~100 px dentro de una columna y que el primer pantallazo móvil no quede vacío. El barrido automatizado puede medir la diferencia entre alto de columna y contenido visible de sus hijos.
- **Trackers de hábito (19-Oct-2026)**: héroe de progreso a ancho completo + lista de hábitos (3/5) + formulario `h-fit` (2/5). Semana `grid-cols-7` con botones de día de 40×62 px en móvil 390 (alto suficiente; no añadir min-width que rompa la tira), futuros `disabled`, check circular `h-11 w-11` con `aria-pressed` y label que nombra hábito/fecha; icono sin marcar en `text-gray-500`/`dark:text-gray-400` (no `gray-400` sobre blanco). Confirmación inline para borrar un hábito y para «Borrar todo». Referencia: `design.md` §4 «Seguimiento de hábitos».
- **Generadores con temporizador (19-Oct-2026)**: configuración en tarjeta + héroe de sesión con barra de progreso y controles en el mismo bloque. Reloj derivado de `Date.now()`: en pausa guarda elapsed; al reanudar/saltar, `startedAt = now − elapsed × 1000` y el tick **no vuelve a sumar elapsed**. `role="timer"` con `aria-label`, `role="progressbar"` con valores y `aria-live="polite"` en el segmento actual; el foco va al botón pausar/reanudar. Para cuerpo, texto del héroe en **negro** en claro (gray-800/900 sobre `#e65100` no llega a 4.5) y blanco/gray-100 en oscuro. Referencia: `design.md` §4 «Rutinas HIIT».
- **Planificadores semanales (19-Oct-2026)**: grid 7 × 3 a ancho completo (día + 3 comidas), no sidebar estrecha; en móvil cada día apila sus celdas con label `sm:hidden`. Cada celda es un botón de ≥84 px. Editor en `<dialog>` nativo (`showModal` atrapa foco y Escape); restaurar foco al disparador con `requestAnimationFrame` + ref. La lista de compras va debajo en `sm:grid-cols-2 xl:grid-cols-3`; checks por semana. Referencia: `design.md` §4 «Planificador de comidas».
- **SSR de chrome/héroe y nombres accesibles (Fase BL, 19-Oct-2026)**: no devolver `null` hasta `mounted` en cabeceras ni héroes (provoca CLS y retrasa el LCP). Renderiza las variantes responsive en SSR y altérnalas con `md:hidden` / `hidden md:block`; deja tras el montaje solo lo que lee localStorage/fecha. Para celdas con texto visible rico, **no uses un `aria-label` que omita etiquetas**: prefijo `sr-only` + contenido visible (Lighthouse `label-content-name-mismatch`). Verificado: CLS 0.093→0, LCP 2.5→2.1 s, Lighthouse móvil 87-88 / desktop 100. Referencia: `design.md` §3.8 y §4d.

## 4. Iconos (`lucide-react`)

- **Por sección** (nivel sección/estados vacíos/acentos): Mente `Brain` · Relaciones `Heart` · Cuerpo `Activity` · Finanzas `Wallet`. Colorear con `text-{s}`.
- **Acciones compartidas** (vocabulario ya en uso — reutilizar, no inventar): guardar `Save` · borrar `Trash2` · info/disclaimer `Info`/`AlertTriangle` · editar `Edit2` · tiempo `Calendar` · dinero `DollarSign` · tasa `Percent` · tendencia `TrendingUp` · calculadora `Calculator` · ejemplo/tip `Lightbulb` · buscar `Search` · reset `RotateCcw` · cerrar `X` · navegación `ChevronRight/Left/Down`, `ArrowRight`.
- Tamaños: micro en fila (borrar) `h-3.5 w-3.5` · inline `h-4 w-4` · destacados `h-5 w-5`+`flex-shrink-0` · cabecera de paso `h-6 w-6` · estado vacío `h-12 w-12 opacity-40`.

## 5. Superficies — gradiente vs glass (CRÍTICO para contraste)

- **Tarjetas en LIGHT**: gradiente sólido `bg-gradient-to-br from-{s} to-{s}-dark` + `text-white` (cuerpo: `from-cuerpo to-cuerpo-dark text-black`). Jamás glass claro con texto blanco (queda blanco sobre blanco).
- **Superficies en DARK**: `dark:bg-none dark:bg-{s}-glass dark:text-{s}-text` (glass translúcido sobre `#121212`).
- Glass (`rgba(color, 0.45/0.25)`) solo para headers/overlays, nunca como fondo de tarjeta en claro.
- **Panel hero dentro de una herramienta** (p. ej. el buscador del glosario): misma receta que ToolCard — `rounded-2xl border border-{s}-border bg-gradient-to-br from-{s} to-{s}-dark p-6 sm:p-8 text-white dark:bg-none dark:bg-{s}-glass dark:text-{s}-text`, a ancho completo del shell con el contenido centrado dentro (`mx-auto max-w-2xl`, títulos `text-center`).
- Categoría dentro de tarjeta: `text-white/85 dark:text-{s}-lighter` (cuerpo: `text-black/70`).

## 6. Hovers canónicos (ambos modos con contraste)

- **Botones outline (ToolPageShell)**: base `border-{s} text-{s} dark:border-{s}-light dark:text-{s}-light` · hover claro `hover:bg-{s}-dark hover:text-white` (cuerpo: `hover:bg-cuerpo hover:text-black`) · hover oscuro `dark:hover:bg-{s}-light dark:hover:text-black`. Sin escala, `transition-colors`.
- **Fila FAQ**: `hover:bg-black/5 hover:text-{s} dark:hover:bg-white/10 dark:hover:text-{s}-light`. Icono del círculo: sólido `bg-{s} group-hover:bg-{s}-dark dark:bg-{s}-light dark:group-hover:bg-{s}-lighter` + `text-white dark:text-black` (cuerpo: `bg-cuerpo-dark`→`bg-cuerpo-darkest`).
- **Tabs activos**: `text-{s} dark:text-{s}-light` + underline `bg-{s} dark:bg-{s}-light`. Excepción mente a 14px en claro: `text-mente-dark` (la base sobre `#f8f9fa` = 4.37, no pasa). Inactivos `text-gray-600 dark:text-gray-400`; hover oscuro `dark:hover:text-{s}-light` (NUNCA `-darkest` en oscuro: queda invisible).
- **Tarjeta de contenido no enlazada** (glosario, listas): `group` + `transition-colors hover:border-{s} hover:bg-black/5 dark:hover:border-{s}-light dark:hover:bg-white/10` y el título `group-hover:text-{s}-darkest dark:group-hover:text-{s}-lighter`.
- **Link inline a herramienta** (dentro de tarjetas de contenido): `Link` `inline-flex items-center gap-1.5 text-sm font-medium text-{s} hover:text-{s}-dark dark:text-{s}-light dark:hover:text-{s}-lighter` + `ArrowRight h-4 w-4`.
- Regla general: el hover debe cambiar **relleno Y texto**, perceptible en ambos modos.

## 7. Contraste (AA)

- Blanco solo sobre fondos sólidos oscuros (gradiente, `{s}-dark`, `{s}`). Mente (4.6) y relaciones (5.7) ✓; **finanzas solo ≥20px sobre `{s}`** (4.1:1) — texto pequeño sobre banda/sólido → `bg-finanzas-dark` (7.9:1); **cuerpo usa texto negro**.
- `{s}-light` + texto negro para superficies de hover/fulles en modo oscuro (7–10:1).
- Texto `{s}` sobre blanco: solo para iconos o texto grande real (≥24px, o ≥18.66px con `font-bold` 700); un h2/h3 de 20px en semibold (600) no cuenta. Para 12–20px usa `{s}-dark` (mente `#1976d2` sobre `#f8f9fa` = 4.37; finanzas `#388e3c` = 4.1; ambos fallan a 14px).
- **Caso cuerpo (ámbar medio, no pasa AA para texto pequeño en claro)**: pequeño sobre blanco/gris-800 → `text-cuerpo-darkest` (5.6:1) / `dark:text-cuerpo-light` (8.3:1) — `text-cuerpo-dark` (3.8:1) solo iconos y bordes. Sobre `bg-cuerpo-lighter`/`dark:bg-cuerpo-dark` (chips, bloques de total) → texto `text-gray-900` (12:1/4.6:1), iconos `text-cuerpo-darkest`/`dark:text-white`, borde de chip seleccionado `border-cuerpo-dark` (`border-cuerpo` = 2:1). Detalle: design.md §7.
- **Caso mente (azul `#1976d2`)**: en el fondo real `#f8f9fa` la base queda en **4.37:1** → 12–14px (tabs, footer, «Ver todas», botones del shell, directorio) usan `text-mente-dark` (8.19); `text-mente` queda para iconos, bordes y texto grande. Sobre `bg-mente-lighter`/`dark:bg-mente-dark` (filas seleccionadas) el texto base es seguro, pero el **secundario nunca `text-gray-500`** (2.7:1) → `text-gray-700`/`dark:text-gray-200`. Nada de `text-white/85` sobre `#1976d2` (3.8:1): `text-white` sólido. Detalle: design.md §7.
- **Caso relaciones (violeta `#7c3aed`)**: en oscuro, `relaciones-light` (`#a78bfa`) sobre `gray-800` = 3.1:1 → **solo iconos, barras y texto ≥20px**; texto pequeño/mediano en `dark:text-relaciones-lighter` (5.0:1). Subtexto de fila seleccionada (`bg-relaciones-lighter`/`dark:bg-relaciones-dark`) → `text-gray-700`/`dark:text-gray-200`, nunca `gray-500` (2.6:1). Detalle: design.md §7.
- **Caso finanzas (verde `#388e3c`)**: sobre blanco 4.1:1 → `text-finanzas` solo para iconos o texto grande real (≥24px, o ≥18.66px con `font-bold` 700; un h2 de 20px semibold no cuenta). Texto de 12–20px en claro → `finanzas-dark` (7.9). En oscuro `finanzas-light` sobre `gray-800` = 3.6:1 → iconos/≥20px; texto pequeño → `finanzas-lighter` (5.2). Blanco sobre `bg-finanzas` falla a 16px (4.1): bandas/sólidos → `bg-finanzas-dark` (7.9). Chips: borde `finanzas` + texto `finanzas-dark`/`finanzas-lighter`. **Tanda 2 (crédito/inversión)**: etiquetas de héroe `text-white` sólido en todas las ramas y cajas internas translúcidas → `bg-black/20` (`white/15–20` ≈3.8–4.1:1); badge celebratorio nunca con verdes sueltos + blanco (`#22c55e` = 2.3:1) → `finanzas-dark`/`finanzas-light`; rojos de pérdida `text-red-600`/`text-red-700` + `dark:text-red-300` (red-400 en superficie oscura se queda en 4.48); sin estilos inline JS de color en iconos/texto (ignoran dark): clases con tokens, hex solo en Chart.js. **Tanda 3 (presupuesto/hábitos, 17-Oct-2026)**: salvia `#6a9c77` en dark (2.7:1, ni ≥20px) → `#a5d6a7` (5.2); ahorros `green-700`; tabs/chips/CTAs `bg-finanzas-dark` + hover `finanzas-darkest` + press; celdas de tabla con borrador local (§3c). Detalle: design.md §7.
- **Chrome global y hubs (17-Oct-2026)**: los textos de 12–14px del armazón no pueden usar la base de sección — en claro: mente `text-mente` solo sobre blanco (sobre `gray-100` del menú → `mente-dark`), `relaciones` base ✓ (su `-light` en oscuro solo ≥20px), cuerpo `-darkest` (la base 3.8 nunca como texto), finanzas `-dark`; aplica a tabs activas, botón «Ver todas», botones del shell, crédito del footer y ítem activo del menú (en oscuro, `-light`/`cuerpo`). ToolCard: categoría `text-white` sólido (el `/85` caía a 3.4–3.8:1). Enlaces de texto con área táctil por padding (`py-1.5`/`py-3`), tabs de sección `py-2.5`. Detalle: design.md §7.
- Probar siempre ambos modos: `:root` y `.dark` en `app/globals.css`.

## 8. Movimiento, haptics, accesibilidad

- Entrada de tarjetas `animate-fadeIn` + `animationDelay = index * 0.1s`.
- **Entrada de resultados**: `animate-result-in` (0.3s, fade+sube 6px) en el contenedor del bloque de resultado de cada herramienta, con `aria-live="polite"` (los lectores de pantalla anuncian el resultado al calcular). CSS puro, sin framer.
- **Count-up en números hero**: `useCountUp(value, {duration?, decimals?})` (`hooks/use-count-up.ts`) envuelto en el formateador propio; en JSX condicional (tests/fases) usar `<CountUp value format />` (`components/ui/count-up.tsx`). Solo heroes/totales, nunca filas secundarias. Detalle completo: `design.md` §6.
- **Press**: `transition-[colors,transform] duration-150 active:scale-[0.97]` en botones sólidos, chips y filas de opción seleccionables (opciones de quiz, tarjetas de técnica, modos segmentados) — máx. escala 0.97. Base ya lo trae `components/ui/button.tsx`.
- **Guarda `prefers-reduced-motion`**: global en `globals.css` + salto en `useCountUp` (las dos vías, obligatorias).
- `data-interactive="true"` en todo interactivo; `useHapticFeedback` (`medium` guardar/navegar, `light` tabs).
- **A11y estructural (17-Oct-2026)**: skip link «Saltar al contenido» en el layout y `<main id="contenido" tabIndex={-1} focus:outline-none>` en cada página (un solo `<main>` por página; `lang="es-DO"` incluso en `global-error`). Validación automatizada de estructura: `pnpm audit:seo` (SEO/GEO + estructura + OG runtime).
- **A11y real (Fase BG, 18-Oct-2026)**: axe-core 4.11 sobre 42 rutas × claro/oscuro × 1440/390 = 168 combinaciones, más estados de resultado (calculadoras, tests, diarios, presupuesto, glosario): **0 violaciones**. Complemento de teclado: skip link, 30 tab stops por flujo con anillo visible, menú con Enter/Escape y back móvil con nombre. Reglas: icon-only `aria-label` + SVG `aria-hidden`; labels asociados; sliders con `thumbAriaLabel`; sin saltos h1→h3; header móvil de cuerpo `-darkest` + logo negro (blanco sobre `#eb7433` = 2.97); sufijos kg/cm dark en `gray-300`; cookies `dark:text-gray-400`; pérdidas `dark:text-red-300`. Finalizar animaciones `fadeIn` antes de medir. Detalle: `design.md` §7 y `plan.md` Fase BG.
- `aria-expanded`/`aria-controls` en acordeones; `aria-hidden` en paneles colapsados.
- Chart.js: ver skill `chart-chartsjs` (la leyenda necesita `fontColor` por item en oscuro).
- **Anti-slop**: sin confetti, parallax ni scroll-reveal; no meter framer-motion donde baste CSS.
