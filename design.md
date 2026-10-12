# HOLENTIA Design System

> Fuente única de verdad para color, tipografía, iconos, espaciado y patrones de UI.
> Tokens en `app/globals.css` · mapeo Tailwind en `tailwind.config.ts` · recetas en este documento.
> Skills de operación en `.opencode/skills/` (`section-ui` para UI, `create-tool` para herramientas nuevas) — **al cambiar cualquier patrón visual, actualizar este documento y la skill afectada en el mismo commit** (regla en `AGENTS.md`).
> Regla de oro: **nunca hex suelto en componentes nuevos** — siempre tokens Tailwind (`bg-mente`, etc.) o CSS vars.
> Importante: la clave `DEFAULT` genera la clase **sin sufijo** (`bg-mente`, `text-finanzas`), nunca `bg-mente-DEFAULT`.

---

## 1. Paleta por sección (canónica)

Cada sección tiene un color canónico de Material (o equivalente) y su escala. Los hex canónicos son **obligatorios** en cualquier estilo inline o dato nuevo.

| Sección | Canónico | Dark | Light | Lighter | Darkest | Acento |
|---|---|---|---|---|---|---|
| Mente | `#1976d2` | `#0d47a1` | `#64b5f6` | `#90caf9` | `#0a3880` | `#7b1fa2` |
| Relaciones | `#7c3aed` | `#5b21b6` | `#a78bfa` | `#c4b5fd` | `#4c1d95` | `#ec4899` |
| Cuerpo | `#ffa000` | `#e65100` | `#ffb74d` | `#ffcc80` | `#bf360c` | `#ff5722` |
| Finanzas | `#388e3c` | `#1b5e20` | `#66bb6a` | `#a5d6a7` | `#1a4314` | `#00796b` |

Tokens Tailwind por sección (`tailwind.config.ts`): `DEFAULT`, `dark`, `light`, `lighter`, `darkest`, `foreground`, `glass`, `border`, `text`, `category`, `accent`. Uso típico: `text-mente`, `bg-finanzas-lighter/30`, `border-cuerpo`. La clave `DEFAULT` se usa **sin sufijo** en las clases (`text-mente`, no `text-mente-DEFAULT`).

### Glass y bordes (vars `:root` / `.dark`)

| Token | Light | Dark |
|---|---|---|
| `glass-bg` | `rgba(color, 0.45)` | `rgba(color, 0.25)` |
| `glass-border` | `rgba(lighter, 0.55–0.65)` | `rgba(lighter, 0.4)` |
| `text-card` | `#fff` (cuerpo: `#000`) | `#fff` |
| `text-category` | tinte claro (cuerpo: `#000`) | tinte `lighter` |

> El glass es para **superficies translúcidas sobre fondo con contenido detrás** (headers, overlays). No usar glass como fondo de tarjeta en modo claro: el texto blanco pierde contraste. Las tarjetas usan gradiente (ver §4).

> **⚠️ Los tokens de sección NO admiten modificadores `/opacidad`** (`bg-finanzas/10`, `bg-mente-lighter/50`): los valores son `var(--…)` sin placeholder `<alpha-value>`, así que Tailwind **no genera la clase** (clase silenciosamente muerta). Para translúcidos usa los tokens `glass`/`glass-border` (ya llevan `rgba`), o colores sólidos. Los colores nativos de Tailwind (`bg-black/5`, `bg-white/10`, `bg-gray-100/70`) sí admiten opacidad.

### Base neutra

- Fondo light `#f8f9fa` · texto `#212529` / secundario `#495057` · borde `#dee2e6`
- Fondo dark `#121212` · texto `#e0e0e0` / secundario `#a0a0a0` · borde `#333333`
- Tokens shadcn (`--background`, `--primary`, etc.) en `globals.css:5-66` — se mantienen para `components/ui/*`; el resto de la app usa los tokens de sección.

---

## 2. Tipografía

- Fuente única: **Inter** vía `next/font/google` en `app/layout.tsx` (subconjunto latin, heredada por `body`). No cargar fuentes adicionales ni usar `font-family` hardcodeado.
- Jerarquía de página: `h1` herramienta `text-2xl sm:text-3xl font-bold` en color de sección (lo pinta `ToolPageShell`) · `h2` secciones internas `text-xl font-bold` · `h3` `text-lg font-semibold` títulos de tarjeta/lista.
- Énfasis con gradiente de texto solo en H1 de home y H1 de sección: `bg-gradient-to-r from-{A} to-{B} bg-clip-text text-transparent`.
- Números en tableros: `tabular-nums`.
- Texto utilitario: `text-balance` en títulos largos, `text-pretty` en párrafos.

## 2b. Iconos

Librería única: **`lucide-react`**. Nuevos iconos solo de ese set (sin SVGs sueltos ni otra librería).

- **Por sección** (nivel sección: estados vacíos, acentos de encabezado, menús): Mente `Brain` · Relaciones `Heart` · Cuerpo `Activity` · Finanzas `Wallet`. Color con token `text-{s}` / `dark:text-{s}-light`.
- **Vocabulario de acciones compartidas** (reutilizar siempre que encaje): guardar `Save` · borrar `Trash2` · info `Info` · disclaimer `AlertTriangle`/`AlertCircle` · editar `Edit2` · tiempo `Calendar` · dinero `DollarSign` · tasa `Percent` · tendencia `TrendingUp` · calculadora `Calculator` · ejemplo/tip `Lightbulb` · buscar `Search` · reset `RotateCcw` · cerrar `X` · navegación `ChevronRight`/`ChevronLeft`/`ChevronDown`/`ArrowRight` · resultado OK `CheckCircle2` · lista `ClipboardList`.
- Tamaños: inline en botones/filas `h-4 w-4` · destacados `h-5 w-5` + `flex-shrink-0`. Coherencia: mismo icono = misma acción en todas las herramientas.

## 3. Espaciado, radios y sombras

- Radios: chips/inputs `rounded-md` (0.375rem) · tarjetas/paneles `rounded-2xl` (1rem) · hero/FAQ `rounded-3xl`.
- Padding de página: `p-4 sm:p-6` (hubs) · `p-4 sm:p-6 max-w-6xl` (herramientas).
- Grid de tarjetas: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`.
- Sombras: tarjeta `0 12px 28px rgba(0,0,0,0.1)` light / `0.35` dark · hover `0 16px 36px` (`0.16` / `0.45`).

## 4. Recetas de componente

### ToolCard (`components/sections/tool-card.tsx`)

Superficie **gradiente** por sección (no glass) para garantizar contraste en claro:

- **Light**: `bg-gradient-to-br from-{s} to-{s}-dark`, texto blanco (cuerpo: `text-black`).
- **Dark**: `dark:bg-none dark:bg-{s}-glass dark:text-{s}-text`.
- Borde `border-{s}-border`, hover `hover:border-{s}-light hover:-translate-y-0.5` + sombra mayor + efecto 3D (solo `hover:hover`).
- Categoría: `text-white/85 dark:text-{s}-lighter` (cuerpo: `text-black/70`).
- No disponible: capa `.card-coming-soon` (overlay blur + "Próximamente") + candado + `opacity-60`, `cursor-default`.
- Contenedor es `<Link>` con `group` + `data-interactive="true"`; haptic en touch.

### ToolsGrid (`components/sections/tools-grid.tsx`)

- **Disponibles primero** (siempre en HTML), no disponibles colapsados tras botón "Ver todas las herramientas" (`hidden`/`grid`).
- Botón fantasma con color de sección (`text-{s} hover:text-{s}-darkest dark:text-{s}-light`) + chevron rotable.

### SectionTabs (`components/sections/section-tabs.tsx`)

Server component. Links a `/` + 4 secciones desde array estático. Activa: `color: var(--color-{s}-active)` + underline `div` (2rem × 3px, `rounded-full`). Inactiva: `text-gray-600 dark:text-gray-400`.

### ToolPageShell (`components/tool-seo/tool-page-shell.tsx`)

H1 centrado en color de sección + descripción + underline · botones outline "Volver a {sección}" / "Hacer donación" (`border-{s} text-{s} dark:border-{s}-light dark:text-{s}-light`; hover claro: relleno `{s}-dark` + texto blanco — cuerpo: `{s}` + texto negro; hover oscuro: relleno `{s}-light` + texto negro; sin escala) · `children` · FAQ · `JsonLd`. Sin breadcrumb visible (el `BreadcrumbList` va en JSON-LD).

### FAQ acordeón (`components/tool-seo/tool-faq.tsx`)

Client component. Una pregunta abierta a la vez (`openIndex`). Fila `button` con `aria-expanded`/`aria-controls`; panel con `grid-rows-[0fr→1fr]` + `overflow-hidden` (el contenido permanece en el HTML para SEO). Icono `Plus`/`Minus` en círculo sólido `bg-{s} group-hover:bg-{s}-dark dark:bg-{s}-light dark:group-hover:bg-{s}-lighter` con icono `text-white dark:text-black` (en cuerpo: `bg-cuerpo-dark`→`bg-cuerpo-darkest` por claridad). Hover de fila: relleno neutro visible `hover:bg-black/5` / `dark:hover:bg-white/10` + texto al tinte de sección (`hover:text-{s}` / `dark:hover:text-{s}-light`).

### Botones (`components/ui/button.tsx` + custom)

- shadcn `Button` para UI genérica (fantasma en toggle de grid).
- Botones de herramienta: outline sección (ver shell) o sólidos `{s}` → hover `{s}-dark`.

### Listas filtrables / Glosario (`components/tools/glossary/`)

Patrón buscador + chips + resultados agrupados (referencia: `glossary.tsx`):

- **Panel hero del buscador**: tarjeta a ancho completo con la receta ToolCard (§4): `rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 sm:p-8 text-white dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text`. Dentro, contenido centrado en `mx-auto max-w-2xl`: `h2 text-center text-xl sm:text-2xl font-bold` (hereda el color), subtítulo `text-center text-sm text-white/85 dark:text-finanzas-lighter` e input `relative mt-4`. El input búsqueda: `h-12 rounded-md border-gray-300 bg-white pl-12 pr-12 text-base` + icono `Search` absoluto `left-4 h-5 w-5` · foco `focus:ring-finanzas focus:border-finanzas` · dark: `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100` + foco `-light` · botón limpiar `X` a la derecha · `type="search"` + `sr-only` label.
- **Chips de categoría** (`rounded-md`, no pill): base `border px-3 py-1.5 text-sm font-medium` · activo `border-finanzas-dark bg-finanzas-dark text-white dark:border-finanzas-light dark:bg-finanzas-light dark:text-black` · inactivo con el hover de fila FAQ (`hover:bg-black/5 hover:text-finanzas dark:hover:bg-white/10 dark:hover:text-finanzas-light`) · `aria-pressed`.
- **Contador** con icono `Wallet` + `aria-live="polite"` (`N de M términos`), alineado a la derecha de la barra de chips (`ml-auto` en el flex).
- **Resultados**: agrupados por categoría con `h2 text-xl font-bold text-finanzas-dark dark:text-finanzas-light` (SIN conteo numérico) y separación `space-y-10` entre grupos, grid `sm:grid-cols-2 gap-4`; tarjetas `group rounded-xl border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800` con hover de escaneo (no son enlaces): `transition-colors hover:border-finanzas hover:bg-black/5 dark:hover:border-finanzas-light dark:hover:bg-white/10` + título que reacciona `group-hover:text-finanzas-darkest dark:group-hover:text-finanzas-lighter`; título `h3 text-lg font-semibold text-finanzas-dark dark:text-finanzas-light`, cuerpo `text-sm text-gray-700 dark:text-gray-300`, ejemplo opcional en recuadro sólido `bg-finanzas-lighter text-gray-800 dark:bg-finanzas-dark dark:text-gray-200` con icono `Lightbulb text-finanzas-dark dark:text-finanzas-light`.
- **Estado vacío**: panel centrado con `Search`, mensaje con la consulta y botón outline (receta shell) «Limpiar filtros».
- Búsqueda sin distinción de acentos (`normalize("NFD")` + strip diacríticos). Persistencia: efímera (patrón E, nada en localStorage).

## 5. Modo oscuro

- Gestión con `next-themes` (`resolvedTheme`), clase `.dark` en `<html>`.
- Chart.js: colores por `resolvedTheme` (memorizados en `useMemo`, ver `calculator-charts.tsx`).
- Regla: todo componente con color propio debe tener variante `dark:`. Probar ambos modos antes de mergear.

## 6. Movimiento

- Entrada de tarjetas: `animate-fadeIn` (0.5s) con `animationDelay` escalonado `index * 0.1s`.
- Transiciones de estado: `transition-all duration-300 ease-out`.
- Haptics en móviles: `useHapticFeedback` (`medium` en guardar/navegar, `light` en tabs).

## 7. Accesibilidad

- `aria-expanded` + `aria-controls` en acordeones/desplegables; `aria-hidden` en paneles colapsados.
- Opciones de quiz con `aria-pressed`; elementos navegables con `role="button" tabIndex` + Enter/Espacio.
- `data-interactive="true"` en todo elemento que deba ignorar el swipe navigation.
- Contraste: texto blanco solo sobre fondos con alpha efectivo ≥ ~0.75 sobre blanco (gradiente sólido) o sobre dark glass. Nunca blanco sobre glass claro.
