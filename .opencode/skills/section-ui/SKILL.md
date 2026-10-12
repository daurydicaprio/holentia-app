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
| Círculo/pill | `rounded-full` | círculo FAQ, dots, underline |

- Página herramienta: `p-4 sm:p-6 max-w-6xl mx-auto` · header→contenido `mb-6` · grupos `space-y-6/10` · grids `gap-4` (contenido) / `gap-5` (home) / `gap-6` (formularios).
- **Foco canónico** (un solo patrón): `focus:border-transparent focus:ring-2 focus:ring-{s}` + `dark:focus:border-transparent dark:focus:ring-{s}-light`. Prohibido `ring-green-500`/hex en foco.
- **Migración de legado**: hex bare de paleta → token (mismo valor); hex **con opacidad** `[#388e3c]/10` se deja así (tokens no admiten `/n`); `#81c784` pendiente de decisión (≈`finanzas-light`).

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
- Probar siempre ambos modos: `:root` y `.dark` en `app/globals.css`.

## 8. Movimiento, haptics, accesibilidad

- Entrada de tarjetas `animate-fadeIn` + `animationDelay = index * 0.1s`.
- `data-interactive="true"` en todo interactivo; `useHapticFeedback` (`medium` guardar/navegar, `light` tabs).
- `aria-expanded`/`aria-controls` en acordeones; `aria-hidden` en paneles colapsados.
- Chart.js: ver skill `chart-chartsjs` (la leyenda necesita `fontColor` por item en oscuro).
