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
| Superficie mayor de página de contenido (ayuda/apoyar/legales) | `rounded-3xl` | SOLO esas páginas, nunca herramientas |
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
- **Chips de preset** debajo de su campo relacionado (distancia corta/media/larga, días 5/6/7): `chipClass(selected)` = outline con `border-finanzas text-finanzas dark:border-finanzas-light dark:text-finanzas-light` si activo, neutro si no; `data-interactive="true"` + haptic `light`.
- Sin títulos redundantes dentro del panel ("Tu rutina" y similares sobran: el label de la herramienta ya da contexto; ahorra pantalla).
- **Selector de vehículo** (si existe): `grid grid-cols-3 gap-2`, celdas `p-2 gap-0.5 rounded-xl` con icono `h-4 w-4`, nombre `text-xs` y dato clave `text-[11px]`; seleccionado = `border-2 border-{s} text-{s} dark:border-{s}-light dark:text-{s}-light` (radiogroup accesible).
- **Mobile (obligatorio)**: input nunca `text-sm` a secas (iOS hace zoom al enfocar): genérico `text-base md:text-sm`, **numéricos de herramienta `text-lg font-semibold`** + `type="text"` + `inputMode` (`numeric`/`decimal`) con saneado (el `type="number"` rompe decimales parciales). Filas que no caben (presets de 3 columnas, inputs con sufijo tipo kg/lb) → apiladas a ancho completo en móvil (`grid gap-*` + `sm:grid-cols-*`; preset en fila = label izquierda + valor derecha). Tap targets ≥44px (steppers `h-10 w-10`); tabla en `overflow-x-auto`.
- **Moneda**: siempre `formatDOP` de `lib/format.ts` (es-DO/DOP) — nunca locales/monedas ajenas (`es-MX`/`MXN`) ni `$` pelado. Botones de resultado con `animate-result-in` llevan `aria-live="polite"`.

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
- **Tabs activos**: `text-{s} dark:text-{s}-light` + underline `bg-{s} dark:bg-{s}-light`. Inactivos `text-gray-600 dark:text-gray-400`; hover oscuro `dark:hover:text-{s}-light` (NUNCA `-darkest` en oscuro: queda invisible).
- **Tarjeta de contenido no enlazada** (glosario, listas): `group` + `transition-colors hover:border-{s} hover:bg-black/5 dark:hover:border-{s}-light dark:hover:bg-white/10` y el título `group-hover:text-{s}-darkest dark:group-hover:text-{s}-lighter`.
- **Link inline a herramienta** (dentro de tarjetas de contenido): `Link` `inline-flex items-center gap-1.5 text-sm font-medium text-{s} hover:text-{s}-dark dark:text-{s}-light dark:hover:text-{s}-lighter` + `ArrowRight h-4 w-4`.
- Regla general: el hover debe cambiar **relleno Y texto**, perceptible en ambos modos.

## 7. Contraste (AA)

- Blanco solo sobre fondos sólidos oscuros (gradiente, `{s}-dark`, `{s}`). Mente/relaciones/finanzas blanco ✓; **cuerpo usa texto negro**.
- `{s}-light` + texto negro para superficies de hover/fulles en modo oscuro (7–10:1).
- Texto `{s}` sobre blanco pasa para bold/títulos; para 14px usa `{s}-dark` si dudas (finanzas `#388e3c` sobre blanco ≈ 3.7:1 — borderline).
- **Caso cuerpo (ámbar medio, no pasa AA para texto pequeño en claro)**: pequeño sobre blanco/gris-800 → `text-cuerpo-darkest` (5.6:1) / `dark:text-cuerpo-light` (8.3:1) — `text-cuerpo-dark` (3.8:1) solo iconos y bordes. Sobre `bg-cuerpo-lighter`/`dark:bg-cuerpo-dark` (chips, bloques de total) → texto `text-gray-900` (12:1/4.6:1), iconos `text-cuerpo-darkest`/`dark:text-white`, borde de chip seleccionado `border-cuerpo-dark` (`border-cuerpo` = 2:1). Detalle: design.md §7.
- **Caso mente (azul `#1976d2`)**: `text-mente` en blanco pasa justo (4.6:1, ≥14px). Sobre `bg-mente-lighter`/`dark:bg-mente-dark` (filas seleccionadas) el texto base es seguro, pero el **secundario nunca `text-gray-500`** (2.7:1) → `text-gray-700`/`dark:text-gray-200`. Nada de `text-white/85` sobre `#1976d2` (3.8:1): `text-white` sólido. Detalle: design.md §7.
- **Caso relaciones (violeta `#7c3aed`)**: en oscuro, `relaciones-light` (`#a78bfa`) sobre `gray-800` = 3.1:1 → **solo iconos, barras y texto ≥20px**; texto pequeño/mediano en `dark:text-relaciones-lighter` (5.0:1). Subtexto de fila seleccionada (`bg-relaciones-lighter`/`dark:bg-relaciones-dark`) → `text-gray-700`/`dark:text-gray-200`, nunca `gray-500` (2.6:1). Detalle: design.md §7.
- Probar siempre ambos modos: `:root` y `.dark` en `app/globals.css`.

## 8. Movimiento, haptics, accesibilidad

- Entrada de tarjetas `animate-fadeIn` + `animationDelay = index * 0.1s`.
- **Entrada de resultados**: `animate-result-in` (0.3s, fade+sube 6px) en el contenedor del bloque de resultado de cada herramienta, con `aria-live="polite"` (los lectores de pantalla anuncian el resultado al calcular). CSS puro, sin framer.
- **Count-up en números hero**: `useCountUp(value, {duration?, decimals?})` (`hooks/use-count-up.ts`) envuelto en el formateador propio; en JSX condicional (tests/fases) usar `<CountUp value format />` (`components/ui/count-up.tsx`). Solo heroes/totales, nunca filas secundarias. Detalle completo: `design.md` §6.
- **Press**: `transition-[colors,transform] duration-150 active:scale-[0.97]` en botones sólidos, chips y filas de opción seleccionables (opciones de quiz, tarjetas de técnica, modos segmentados) — máx. escala 0.97. Base ya lo trae `components/ui/button.tsx`.
- **Guarda `prefers-reduced-motion`**: global en `globals.css` + salto en `useCountUp` (las dos vías, obligatorias).
- `data-interactive="true"` en todo interactivo; `useHapticFeedback` (`medium` guardar/navegar, `light` tabs).
- `aria-expanded`/`aria-controls` en acordeones; `aria-hidden` en paneles colapsados.
- Chart.js: ver skill `chart-chartsjs` (la leyenda necesita `fontColor` por item en oscuro).
- **Anti-slop**: sin confetti, parallax ni scroll-reveal; no meter framer-motion donde baste CSS.
