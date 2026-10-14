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

### Open Graph (imagen social)

- `app/opengraph-image.tsx` (next/og): PNG 1200×630, fondo `#121212`, logo circular «HOLENTIA», 4 puntos de sección (azul/violeta/ámbar/verde), tagline y dominio. `app/twitter-image.tsx` re-exporta la misma. Inter Bold va embebida en base64 en `app/og-font.ts` (satori no acepta woff2; sin fs en runtime).
- Las páginas con `generateMetadata` deben declarar `openGraph.images` (lo hace `baseMetadata` en `lib/seo.ts`): Next **no** inyecta la imagen de la file-convention cuando existe un objeto `openGraph` propio.

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
- Tamaños: micro en fila (borrar, cerrar) `h-3.5 w-3.5` · inline en botones/filas/links `h-4 w-4` · destacados `h-5 w-5` + `flex-shrink-0` · cabecera de paso/grupo `h-6 w-6` · estado vacío/hero decorativo `h-12 w-12` + `opacity-40`. Coherencia: mismo icono = misma acción en todas las herramientas.

## 3. Escala unificada (radios, espaciado, tipografía de cuerpo, foco, sombras)

Un rol = una clase. Ante la duda, copiar el valor del componente de referencia, no inventar.

### 3.1 Radios por rol

| Rol | Radio | Referencia |
|---|---|---|
| **Control** (botón, input, chip, tab) | `rounded-md` | botones ToolPageShell, input del glosario, chips, tabs, shadcn `Button` |
| **Micro-contenedor** (recuadro dentro de una tarjeta) | `rounded-lg` | recuadro de ejemplo/tip, cajas de stats, inputs de herramientas |
| **Sub-superficie** (tarjeta anidada, item de lista, modal, dropdown, tabla) | `rounded-xl` | item FAQ, tarjeta de resultado, modales, tabla de amortización, dropdowns |
| **Superficie mayor de herramienta** | `rounded-2xl` | ToolCard, panel hero, sección FAQ, panel de resultado grande, estado vacío |
| **Superficie mayor de página de contenido** (ayuda, apoyar, legales, que-es) | `rounded-3xl` | tarjetas grandes de esas páginas — **no usar en herramientas** |
| **Círculo / pill** | `rounded-full` | círculo del icono FAQ, dots, underline, botones circulares |

### 3.2 Ritmo de espaciado

| Nivel | Clase | Uso |
|---|---|---|
| Página herramienta | `p-4 sm:p-6 max-w-6xl mx-auto` | `ToolPageShell` |
| Bloque header → contenido | `mb-6` | H1/descripción → children/FAQ |
| Superficie mayor | `p-6 sm:p-8` (hero con contenido) · `p-6` (FAQ, resultado) | paneles `rounded-2xl` |
| Sub-superficie | `p-5` | tarjetas de resultado/lista `rounded-xl` |
| Micro-contenedor | `p-4` (tip/ejemplo) · `p-3` (stat) | recuadros `rounded-lg` |
| Grupos hermanos | `space-y-6` (lista) · `space-y-10` (grupos de sección) | |
| Grids | `gap-4` (tarjetas de herramientas y contenido 2-col) · `gap-6` (formularios) | |

### 3.3 Tipografía de cuerpo

- UI densa (herramientas, listas, tablas): `text-sm` · hero/landing y buscadores: `text-base` · captions/micro: `text-xs`.
- Labels de input: `text-sm font-medium` (los inputs grandes de buscador usan `text-base`).

### 3.4 Foco (canónico, un solo patrón)

```text
focus:border-transparent focus:ring-2 focus:ring-{s}
dark:focus:border-transparent dark:focus:ring-{s}-light
```

El borde se vuelve transparente al enfocar: solo el anillo de sección marca el foco. Nunca `ring-green-500`/`ring-blue-500`/colores genéricos ni hex en el foco.

### 3.5 Sombras

- Tarjeta: `0 12px 28px rgba(0,0,0,0.1)` light / `0.35` dark · hover: `0 16px 36px` (`0.16` / `0.45`).
- Superficies planas de herramienta: `shadow-sm` · modales/popovers: `shadow-xl`/`shadow-lg`.

### 3.6 Estado del legado (migración en curso, sin cambio visual)

- Los componentes canónicos (ToolCard, shell, FAQ, glosario) ya son 100% tokens.
- Los hex de paleta **sin opacidad** (`bg-[#388e3c]`) se han migrado a tokens (`bg-finanzas`) — valores idénticos.
- Los hex **con opacidad** (`bg-[#388e3c]/10`) se quedan así deliberadamente: los tokens no admiten `/n` (clase muerta). Usar nativos con alpha (`bg-black/5`) o glass.
- `#81c784` (verde claro legado en dark de finanzas) **migrado**: en clases → `finanzas-light` (#66bb6a); en gráficos JS (Chart.js, `sliceColors`, `FUND_COLORS`) → hex canónico `#66bb6a` (o `#388e3c` si había colisión cromática en un pie). Los gráficos usan hex literales porque Chart.js necesita valores crudos, no clases.
- Acentos locales de herramienta (budget-simulator, familia verde salvia documentada): `#1e3a2b` (texto/fondo profundo), `#6a9c77` (acento medio) y `#a4c3a2` (acento claro). Se usan con opacidad (`/10`–`/80`) porque los tokens no admiten `/n`; solo dentro de budget.

### 4b. Página de sección (hub mente/relaciones/cuerpo/finanzas)

`SectionPage` = Logo + `SectionTabs` + `SectionHeader` + intro (opcional, server) + `ToolsGrid` + mini-FAQ nativa (`<details>`, si la sección define `faq`) + `Footer`, todo con tokens:

- **Gradiente del H1** (`section-header.tsx`): mapa estático `gradientBySection` con vars `--color-{s}-active` / `-dark` (sin hex; fallback finanzas). **Cuerpo arranca en `-active-dark` → `-active-darkest`**: el ámbar puro no alcanza AA sobre fondo claro. H2 «¿Qué quieres aprender?»: `text-xl sm:text-2xl font-bold`.
- **Footer** (`footer.tsx`): nav server-rendered de enlaces internos (`/que-es-holentia`, `/ayuda`, `/apoyar`, `/aviso-legal`, `/politica-cookies` — obligatorio para rastreo de páginas legales) + enlace de crédito por sección con clases `text-{s} hover:text-{s}-dark dark:text-{s}-light dark:hover:text-{s}-lighter` (cuerpo arranca en `-dark`); sin sección → neutro `text-gray-600 dark:text-gray-300` + `underline underline-offset-2`. Sin estilos inline ni opacidades que hundan contraste. **Excepción**: el footer es el ÚNICO lugar del sitio permitido para emoticones decorativos (`❤ 🇩🇴` en la línea de crédito — decisión explícita del dueño del proyecto; la lista "sin emojis" de §4c aplica al resto del contenido).

### 4c. Páginas básicas (home, ayuda, apoyar, legales, qué-es) — monocromo de marca

La marca HOLENTIA es **monocroma** (logo negro/blanco, OG `#121212` + blanco). Las páginas genéricas NO usan colores de sección ni degradados: su acento es el motivo de los **4 puntos** (`components/common/brand-dots`, los mismos de la imagen OG) bajo el logo. Recetas:

- **Superficie**: `border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900`; interactiva + `hover:border-gray-300 dark:hover:border-gray-600`. Radios: tarjeta `rounded-2xl`, mini `rounded-xl`, control `rounded-md`.
- **Icon tile**: `h-10 w-10 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900` (lucide `h-5 w-5`).
- **Botón primario**: `h-10 rounded-md bg-gray-900 px-5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100` + `data-interactive="true"`.
- **Volver**: flecha + texto, sin chip circular: `text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`.
- **FAQ nativa** (`<details>`): respuesta en el HTML inicial; `ChevronDown` que rota con `group-open:rotate-180` (nunca emoji ▼).
- **Sin**: texto degradado, blobs `blur-*`, tarjetas pastel, `animate-pulse`, `hover:scale-*`, `shadow-xl`, emojis decorativos. Colores semánticos solo en avisos (`border-l-4 border-amber-500 bg-amber-50`) y borrado destructivo (`hover:bg-red-600`).

**Burbuja de ayuda** (campo que requiere verificación del usuario, ej. precio de combustible): chip ámbar bajo el input con muesca rotada 45° (`-top-[5px] left-6 h-2.5 w-2.5 rotate-45 border-l border-t`), texto `text-xs`, variantes `border-amber-200 bg-amber-50 text-amber-800` / dark `border-amber-800/40 bg-amber-900/20 text-amber-200`.

### 4d. Chrome global (menú, logo, header, scroll-to-top)

Reglas del armazón compartido, en línea con la identidad monocroma:

- **Acento por defecto neutro**: fuera de sección, ningún azul genérico (`#3B82F6` prohibido). Estados abiertos/activos → `ring-gray-900 dark:ring-white`, `bg-gray-100 dark:bg-gray-800`.
- **Sin framer-motion en el chrome global** (menu-button, logo): animaciones con CSS puro (`transition-*`, `group-hover:*`, keyframes en `globals.css` si hacen falta). framer-motion queda para herramientas de finanzas.
- **Sin estilos inline ni manipulación JS de color/hover** (patrón footer): mapas estáticos de clases por sección + fallback neutro. Los valores crudos (rgba con alpha) solo en JS de Chart.js o fondos `headerBgColor` que necesitan opacidad.
- **Sin `hover:scale-*`/`active:scale-*`** en chrome; feedback con `transition-colors`.
- Menú desplegable: panel sólido `bg-white dark:bg-gray-900` + `border-gray-200 dark:border-gray-700` + `shadow-lg`; backdrop `bg-black/60` sin blur; entrada con keyframe `hol-menu-in`.
- `data-interactive="true"` en botones, enlaces y toggle del menú.

## 4. Recetas de componente

### ToolCard (`components/sections/tool-card.tsx`)

Superficie **gradiente** por sección (no glass) para garantizar contraste en claro:

- **Light**: `bg-gradient-to-br from-{s} to-{s}-dark`, texto blanco (cuerpo: `text-black`).
- **Dark**: `dark:bg-none dark:bg-{s}-glass dark:text-{s}-text`.
- Borde `border-{s}-border`, hover `hover:border-{s}-light hover:-translate-y-0.5` + sombra mayor + efecto 3D (solo `hover:hover`; el tilt JS pisa el transform — coexisten porque `animate-fadeIn` vive en el `<Link>` externo, NUNCA en el div con transform).
- Categoría: `text-white/85 dark:text-{s}-lighter` (cuerpo: `text-black/70`).
- No disponible: capa `.card-coming-soon` (overlay `rgba(0,0,0,0.45)` + blur + "Próximamente") + candado + `opacity-60`, `cursor-default`.
- Contenedor es `<Link>` con `group` + `data-interactive="true"` + `animate-fadeIn` + `style={{ animationDelay }}`; haptic en touch.

### ToolsGrid (`components/sections/tools-grid.tsx`)

- **Disponibles primero** (siempre en HTML), no disponibles colapsados tras botón "Ver todas las herramientas" (`hidden`/`grid`) con `aria-expanded`/`aria-controls` + `data-interactive="true"`.
- Botón fantasma con color de sección (`text-{s} hover:text-{s}-darkest dark:text-{s}-light`) + chevron rotable + foco visible `focus-visible:ring-{s}`.
- Grilla `gap-4`.

### SectionTabs (`components/sections/section-tabs.tsx`)

Client component. Links a 4 secciones desde array estático. Activa: token `{s}` + underline `div` (2rem × 3px, `rounded-full`). Inactiva: `text-gray-600 dark:text-gray-400` + `hover:bg-black/5 dark:hover:bg-white/10` (relleno Y texto; sin `opacity-*`). Foco `focus-visible:ring-2 ring-{s}`. Prop `neutral` (home, página monocroma): hovers neutros `hover:text-gray-900 dark:hover:text-white`, sin colores de sección.

### ToolPageShell (`components/tool-seo/tool-page-shell.tsx`)

Header con `pt-6` de aire bajo el logo/menú + H1 centrado en color de sección + descripción + underline · botones outline "Volver a {sección}" / "Hacer donación" visibles también en móvil (`border-{s} text-{s} dark:border-{s}-light dark:text-{s}-light`; hover claro: relleno `{s}-dark` + texto blanco — cuerpo: `{s}` + texto negro; hover oscuro: relleno `{s}-light` + texto negro; sin escala; `data-interactive="true"`) · `children` · FAQ · `JsonLd` (WebApplication + BreadcrumbList + FAQPage). **Sin miguita visible**: la navegación la dan los botones Volver y el footer; el `BreadcrumbList` va solo en JSON-LD (no obliga a UI visual).

### FAQ acordeón (`components/tool-seo/tool-faq.tsx`)

Client component. Una pregunta abierta a la vez (`openIndex`). Fila `button` con `aria-expanded`/`aria-controls`; panel con `grid-rows-[0fr→1fr]` + `overflow-hidden` (el contenido permanece en el HTML para SEO). Icono `Plus`/`Minus` en círculo sólido `bg-{s} group-hover:bg-{s}-dark dark:bg-{s}-light dark:group-hover:bg-{s}-lighter` con icono `text-white dark:text-black` (en cuerpo: `bg-cuerpo-dark`→`bg-cuerpo-darkest` por claridad). Hover de fila: relleno neutro visible `hover:bg-black/5` / `dark:hover:bg-white/10` + texto al tinte de sección (`hover:text-{s}` / `dark:hover:text-{s}-light`).

### Botones (`components/ui/button.tsx` + custom)

- shadcn `Button` para UI genérica (fantasma en toggle de grid).
- Botones de herramienta: outline sección (ver shell) o sólidos `{s}` → hover `{s}-dark`.

### Listas filtrables / Glosario (`components/tools/glossary/`)

Patrón buscador + chips + resultados agrupados (referencia: `glossary.tsx`):

- **Panel hero del buscador**: tarjeta a ancho completo con la receta ToolCard (§4): `rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 sm:p-8 text-white dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text`. Dentro, contenido centrado en `mx-auto max-w-2xl`: `h2 text-center text-xl sm:text-2xl font-bold` (hereda el color), subtítulo `text-center text-sm text-white/85 dark:text-finanzas-lighter` e input `relative mt-4`. El input búsqueda: `h-12 rounded-md border-gray-300 bg-white pl-12 pr-12 text-base` + icono `Search` absoluto `left-4 h-5 w-5` · foco canónico `focus:border-transparent focus:ring-2 focus:ring-finanzas dark:focus:border-transparent dark:focus:ring-finanzas-light` · dark: `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100` · botón limpiar `X` a la derecha · `type="search"` + `sr-only` label.
- **Chips de categoría** (`rounded-md`, no pill): base `border px-3 py-1.5 text-sm font-medium` · activo `border-finanzas-dark bg-finanzas-dark text-white dark:border-finanzas-light dark:bg-finanzas-light dark:text-black` · inactivo con el hover de fila FAQ (`hover:bg-black/5 hover:text-finanzas dark:hover:bg-white/10 dark:hover:text-finanzas-light`) · `aria-pressed`.
- **Contador** con icono `Wallet` + `aria-live="polite"` (`N de M términos`), alineado a la derecha de la barra de chips (`ml-auto` en el flex).
- **Resultados**: agrupados por categoría con `h2 text-xl font-bold text-finanzas-dark dark:text-finanzas-light` (SIN conteo numérico) y separación `space-y-10` entre grupos, grid `sm:grid-cols-2 gap-4`; tarjetas `group rounded-xl border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800` con hover de escaneo (no son enlaces): `transition-colors hover:border-finanzas hover:bg-black/5 dark:hover:border-finanzas-light dark:hover:bg-white/10` + título que reacciona `group-hover:text-finanzas-darkest dark:group-hover:text-finanzas-lighter`; título `h3 text-lg font-semibold text-finanzas-dark dark:text-finanzas-light`, cuerpo `text-sm text-gray-700 dark:text-gray-300`, ejemplo opcional en recuadro sólido `bg-finanzas-lighter text-gray-800 dark:bg-finanzas-dark dark:text-gray-200` con icono `Lightbulb text-finanzas-dark dark:text-finanzas-light`. Enlace interno a herramienta (campo `related` del término): `Link` de next/link `mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-finanzas hover:text-finanzas-dark dark:text-finanzas-light dark:hover:text-finanzas-lighter` + icono `ArrowRight h-4 w-4`, con `data-interactive` y haptic `medium` (interlinking SEO + UX).
- **Estado vacío**: panel centrado con `Search`, mensaje con la consulta y botón outline (receta shell) «Limpiar filtros».
- Búsqueda sin distinción de acentos (`normalize("NFD")` + strip diacríticos). Persistencia: efímera (patrón E, nada en localStorage).

### Formularios de herramienta (inputs, ayuda ⓘ, agrupación)

Receta canónica para calculadoras/tests con varios campos (refs: `compound-interest/calculator-inputs.tsx`, `fuel-expense-calculator/fuel-expense-calculator.tsx`; detalle operativo en skill `section-ui` §3c):

- **Labels limpios, sin paréntesis de unidad**; la unidad va como **icono izquierdo del input** (`absolute inset-y-0 left-0 pl-3`, input `pl-10`; `DollarSign`/`MapPin`/`Calendar`/`Gauge`/`Percent`).
- **Ayuda contextual con ⓘ**: botón `HelpCircle size={16}` a la derecha del label (`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`, `aria-label="Información sobre …"`) + tooltip `absolute right-0 top-full mt-2 p-3 w-64 z-20` gestionado por estado `activeTooltip`. Textos en mapa `TOOLTIPS` del componente; sin framer-motion.
- **Agrupar campos cortos en la misma línea** (`grid grid-cols-2 gap-3`, un `Field` por celda) cuando quepan sin apretar; los que ameriten ancho completo van solos (`w-full`). No agrupar por rellenar.
- **Chips de preset** debajo de su campo (outline `{s}` si activo, neutro si no, haptic `light`).
- Sin títulos redundantes dentro del panel ("Tu rutina" sobra: ahorra pantalla).
- **Selector de vehículo**: `grid grid-cols-3 gap-2`, celdas `p-2 gap-0.5 rounded-xl`, icono `h-4 w-4`, nombre `text-xs`, dato `text-[11px]`; activo `border-2 border-{s} text-{s} dark:border-{s}-light dark:text-{s}-light` (radiogroup accesible).
- **Bloque de tips de ahorro** (cuando la herramienta los tenga): tarjeta a ancho del grid con icono `Lightbulb text-{s}` + título `text-lg font-bold`, lista en `grid sm:grid-cols-2` con bullets `h-1.5 w-1.5 rounded-full bg-{s}` y líneas `text-sm text-gray-600 dark:text-gray-300` (breve: 4–6 tips de una línea).

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
- `data-interactive="true"` en todo elemento que deba ignorar el swipe navigation. El guard de `SectionSwipeNavigation` también excluye por tag (`input, button, a, select, textarea`) y exige dirección horizontal dominante; el de `TabSwipeNavigation` consume `data-interactive`. Mantener ambos: defensa en profundidad.
- Contraste: texto blanco solo sobre fondos con alpha efectivo ≥ ~0.75 sobre blanco (gradiente sólido) o sobre dark glass. Nunca blanco sobre glass claro.
