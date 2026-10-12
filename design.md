# HOLENTIA Design System

> Fuente única de verdad para color, tipografía, espaciado y patrones de UI.
> Tokens en `app/globals.css` · mapeo Tailwind en `tailwind.config.ts` · recetas en este documento.
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

### Base neutra

- Fondo light `#f8f9fa` · texto `#212529` / secundario `#495057` · borde `#dee2e6`
- Fondo dark `#121212` · texto `#e0e0e0` / secundario `#a0a0a0` · borde `#333333`
- Tokens shadcn (`--background`, `--primary`, etc.) en `globals.css:5-66` — se mantienen para `components/ui/*`; el resto de la app usa los tokens de sección.

---

## 2. Tipografía

- Sin fuente custom: `system-ui` stack (heredado de Next).
- Jerarquía de página: `h1` herramienta `text-2xl sm:text-3xl font-bold` en color de sección · `h2` secciones internas `text-xl font-bold` · `h3` títulos de tarjeta/lista.
- Énfasis con gradiente de texto solo en H1 de home y H1 de sección: `bg-gradient-to-r from-{A} to-{B} bg-clip-text text-transparent`.
- Números en tableros: `tabular-nums`.
- Texto utilitario: `text-balance` en títulos largos, `text-pretty` en párrafos.

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

H1 centrado en color de sección + descripción + underline · botones outline "Volver a {sección}" / "Hacer donación" (`border-{s} text-{s} hover:bg-{s}-glass dark:border-{s}-light dark:text-{s}-light`) · `children` · FAQ · `JsonLd`. Sin breadcrumb visible (el `BreadcrumbList` va en JSON-LD).

### FAQ acordeón (`components/tool-seo/tool-faq.tsx`)

Client component. Una pregunta abierta a la vez (`openIndex`). Fila `button` con `aria-expanded`/`aria-controls`; panel con `grid-rows-[0fr→1fr]` + `overflow-hidden` (el contenido permanece en el HTML para SEO). Icono `Plus`/`Minus` en círculo `bg-{s}-lighter/50`; hover de fila `hover:bg-{s}-lighter/30` (cuerpo `/40`).

### Botones (`components/ui/button.tsx` + custom)

- shadcn `Button` para UI genérica (fantasma en toggle de grid).
- Botones de herramienta: outline sección (ver shell) o sólidos `{s}` → hover `{s}-dark`.

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
