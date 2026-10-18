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
- **Inputs de herramienta (canónico, 17-Oct-2026)**: `w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-lg font-semibold` + `placeholder:font-normal placeholder:text-gray-400` y foco de §3.4 · `dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500`. `text-lg` (18px ≥ 16px) evita el zoom de iOS y da peso al dato; los selects con etiquetas largas usan `text-base` (a 18px se clipean). `type="text"` + `inputMode` (`numeric`/`decimal`) con saneado: el `type="number"` rompe la escritura de decimales parciales en móvil. Con icono interior (`DollarSign`, `Percent`…): `py-2.5 pl-10 pr-3`, icono `text-gray-500 dark:text-gray-400`. Referencia: `components/tools/bmi-calculator/bmi-calculator.tsx`. **Variantes (17-Oct-2026)**: texto libre (nombre de tarjeta) y `type="date"` → misma receta con `text-base` sin `font-semibold` (`inputClassText`; a 18px el nombre se ve pesado). **Celdas de tabla editables (17-Oct-2026, budget-simulator)**: `type="text"` + `inputMode="decimal"` con **borrador local** por celda (`Record<string,string>`; parsea y hace commit al teclear, limpia en `onBlur`) — el valor controlado `number` borra comas/puntos parciales a mitad de tecleo; medidas compactas `px-2 py-2 text-base` (≥16px, evita el zoom de iOS). Sobre `components/ui/input.tsx`: el override debe anular el base con `h-auto` y `md:text-lg` (el `h-10`/`md:text-sm` del componente gana en el merge de Tailwind).

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

- Los componentes canónicos (ToolCard, shell, glosario) ya son 100% tokens.
- Los hex de paleta **sin opacidad** (`bg-[#388e3c]`) se han migrado a tokens (`bg-finanzas`) — valores idénticos.
- Los hex **con opacidad** (`bg-[#388e3c]/10`) se quedan así deliberadamente: los tokens no admiten `/n` (clase muerta). Usar nativos con alpha (`bg-black/5`) o glass.
- `#81c784` (verde claro legado en dark de finanzas) **migrado**: en clases → `finanzas-light` (#66bb6a); en gráficos JS (Chart.js, `sliceColors`, `FUND_COLORS`) → hex canónico `#66bb6a` (o `#388e3c` si había colisión cromática en un pie). Los gráficos usan hex literales porque Chart.js necesita valores crudos, no clases.
- Acentos locales de herramienta (budget-simulator, familia verde salvia documentada): `#1e3a2b` (texto/fondo profundo), `#6a9c77` (acento medio) y `#a4c3a2` (acento claro). Se usan con opacidad (`/10`–`/80`) porque los tokens no admiten `/n`; solo dentro de budget. **Textos en dark → `#a5d6a7` (AA 5.2:1 sobre `gray-800/900`)**: `#6a9c77` (2.7:1) no pasa ni a ≥20px y queda para bordes, fondos y acentos.

### 3.7 Mobile (reglas rápidas, 16-Oct-2026)

- **Breakpoint de móvil**: `<768px` (`md`) — swipe entre secciones, FAB `MobileFab`, header compacto de herramienta.
- **Inputs**: nunca `text-sm` a secas en un input — iOS Safari hace zoom al enfocar (<16px). Patrón canónico: `text-base md:text-sm` (como `components/ui/input.tsx`); los **numéricos de herramienta** usan `text-lg font-semibold` (§3.3) y `type="text"` + `inputMode` con saneado. Añadir `inputMode` (`numeric`/`decimal`) en inputs numéricos.
- **Filas que no caben**: presets/chips de 3 columnas y parejas de inputs con sufijo (p. ej. kg/lb del IMC) se apilan a ancho completo en móvil (`grid gap-*` + `sm:grid-cols-*`); en `sm+` recuperan la rejilla. Un preset en fila = label a la izquierda + valor a la derecha (≥44px de alto).
- **Tap targets ≥44px** en acciones táctiles (botones de header, menú); el resto de controles ≥40px (steppers `h-10 w-10`).
- **Enlaces de texto** (footer, «Volver» de informativas): área táctil por padding vertical sin cambiar el look — nav del footer `py-1.5` (28px), crédito `py-1`, «Volver» `py-3` (44px; la fila ya mide 44 por el botón del menú). Nunca dejar un enlace de navegación con la sola línea de texto en móvil.
- **Formato local**: moneda siempre con `formatDOP` de `lib/format.ts` (es-DO/DOP, `Intl.NumberFormat`) — nunca `es-MX`/`MXN` ni `$` pelado.
- **Charts**: leyendas de doughnut/radial → `position: isMobile ? "bottom" : "left"` (a la izquierda aplastan el gráfico en móvil).
- **Tablas**: siempre `overflow-x-auto` en contenedor.
- **PWA**: manifest con iconos 192/512 + maskable (`public/icon-{192,512}.png`, `icon-512-maskable.png`), generados desde la H monocroma de §4c; `themeColor` claro/oscuro en `viewport`.

### 3.8 Rendimiento (bundle móvil, 17-Oct-2026)

- **Presupuesto**: herramienta ≤ ~150 kB First Load (bundle compartido ~103 kB); ninguna lib pesada en el bundle inicial.
- **Chart.js nunca en el bundle inicial**: componente de gráfico propio → `next/dynamic` (`ssr: false`) + skeleton `animate-pulse` que reserva altura (`h-[300px] sm:h-[400px]` línea/pastel; `h-[240px]` proyección). Charts inline sin componente propio (dona `PortfolioPie` del perfil de riesgo) → `import("chart.js/auto")` dentro del `useEffect` con bandera `cancelled` y `instance.destroy()` en el cleanup.
- **Paneles secundarios pesados** (p. ej. `SavedSimulations` con framer-motion): `next/dynamic` con `ssr:false` y skeleton — se cargan al abrir la pestaña (móvil) o tras la hidratación (escritorio).
- **framer-motion**: solo en chunks diferidos; donde basta CSS se usa `animate-result-in` (fade + 6px). Regla: no añadir framer al camino crítico.
- **Medición**: la tabla de `pnpm build` (Route Size / First Load JS) es la referencia antes/después. Resultado de este pase: interés compuesto 251→139 kB · perfil de riesgo 220→151 kB · préstamo 186→145 kB.

### 3.9 Layout de herramienta sin huecos (18-Oct-2026)

Regla derivada del hueco de la calculadora de proteína: la columna izquierda (formulario) terminaba mucho antes que la derecha (héroe + desglose + fuentes + referencias + nota legal), dejando cientos de píxeles vacíos.

- **Fila principal**: formulario (`lg:col-span-2`) + columna derecha (`lg:col-span-3`) con héroe compacto. Si el formulario es más alto, la columna se cierra con **una sola tarjeta secundaria útil** debajo del héroe (proteína: fuentes; hidratación: desglose del cálculo; combustible: gasto en perspectiva). No es relleno: aporta información real y evita el panel de color semivacío.
- **Secundarios pesados a ancho completo**: desglose, referencias y nota legal van debajo en **una tarjeta** con subgrid interno (`lg:grid-cols-2` o fila de stats). Nunca una pila de 3+ tarjetas en la columna derecha mientras la izquierda es solo el formulario.
- **Prohibido** dejar huecos > ~100 px dentro de una columna. Si las alturas no cuadran, mueve un bloque a ancho completo o añade **una** tarjeta útil; no añadas relleno.
- **Resultado corto + formulario alto**: añade debajo del resultado una tarjeta de perspectiva/ayuda compacta (2–4 filas) o lleva una guía al formulario. Aplica a combustible y corte de tarjeta.
- **Empty states**: ocupan el alto disponible (`h-full`/`flex-1`), con una frase útil y 2–3 viñetas de lo que verá el usuario. No un panel gigante con solo un icono.
- **Editores (diarios)**: la escritura manda; el historial vacío puede ser corto. Se permite onboarding útil dentro del empty state (cómo empezar, progreso, privacidad), no tarjetas de relleno. La regla estricta de alturas aplica sobre todo a calculadoras formulario + resultado.
- **Móvil**: orden formulario → resultado → detalle → referencias → enlaces. El detalle nunca se adelanta al resultado.
- **Verificación visual**: Playwright/Chromium a 1440 px y 390 px, claro/oscuro, con y sin resultado; medir columna vs contenido visible de sus hijos y comprobar que no haya huecos > ~100 px ni el primer pantallazo móvil en blanco.

### 4b. Página de sección (hub mente/relaciones/cuerpo/finanzas)

`SectionPage` = Logo + `SectionTabs` + `SectionHeader` (H1 + `subtitle` inspiracional; el copy factual vive en `metaDescription`, **sin `intro` renderizada**) + `ToolsGrid` + `Footer`, todo con tokens. **Sin FAQ en los hubs** (decisión 14-Oct-2026: el FAQ vive en cada herramienta y en `/ayuda`), sin «¿Qué quieres aprender?» ni otros títulos de relleno:

- **Gradiente del H1** (`section-header.tsx`): mapa estático `gradientBySection` con vars `--color-{s}-active` / `-dark` (sin hex; fallback finanzas). **Cuerpo arranca en `-active-dark` → `-active-darkest`**: el ámbar puro no alcanza AA sobre fondo claro. **Sin H2 «¿Qué quieres aprender?»** ni otros títulos de relleno entre el header y el grid (quitado 14-Oct-2026: rompía el diseño).
- **Subtitle del hub** (`section.subtitle`): copy **inspiracional de 3 líneas o un poquito menos** (~185–240 chars) que nombra herramientas concretas y su beneficio; **sin la frase repetida** «gratuitas, en tu navegador y sin registro» y sin fórmulas ajenas al sitio (p.ej. «regla 50/30/20») — ese gancho vive solo en los `metaDescription` de las tools, no en el copy visible de los hubs. Estilo: `max-w-2xl mx-auto leading-relaxed` (`text-sm sm:text-base`) centrado bajo el H1. Aire: header `mt-8` (tabs→H1) y grid `mt-10 sm:mt-12` (subtitle→tarjetas) para que el copy no quede pegado ni al título ni a las cards.
- **Footer** (`footer.tsx`): nav server-rendered de enlaces internos (`/que-es-holentia`, `/ayuda`, `/apoyar`, `/aviso-legal`, `/politica-cookies` — obligatorio para rastreo de páginas legales) + enlace de crédito por sección con clases `text-{s} hover:text-{s}-dark dark:text-{s}-light dark:hover:text-{s}-lighter`; en claro cuerpo arranca en `-darkest` y finanzas en `-dark` (crédito a 12px: la base no llega a 4.5:1 — 17-Oct-2026); sin sección → neutro `text-gray-600 dark:text-gray-300` + `underline underline-offset-2`. Enlaces del nav con `inline-block py-1.5` y crédito `py-1` (área táctil en móvil, sin cambio visual). Sin estilos inline ni opacidades que hundan contraste. **Excepción**: el footer es el ÚNICO lugar del sitio permitido para emoticones decorativos (`❤ 🇩🇴` en la línea de crédito — decisión explícita del dueño del proyecto; la lista "sin emojis" de §4c aplica al resto del contenido).

### 4b-bis. Bloque «Sigue por aquí» y enlaces internos sutiles (18-Oct-2026)

`components/tools/related-tools/related-tools.tsx` — cierre de herramienta discreto, no una rejilla de tarjetas:

- **Formato**: `rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800`; título `text-sm font-semibold`, intro opcional `text-xs`, enlaces `text-sm` en una fila que envuelve. **Máximo 3 enlaces** (2 ideal).
- **Enlace**: icono `h-4 w-4` + texto + `ArrowRight h-3.5 w-3.5`; `data-interactive="true"`, haptic `medium`, `py-2.5` (~40 px). El target es el enlace, no toda la superficie.
- **Acento**: icono/flecha `text-cuerpo-darkest dark:text-cuerpo-light`; hover del texto al mismo acento. Hidratación usa `accent="sky"` (sky-600/400) para conservar su semántica de agua. Sin fondos de tarjeta que cambien en bloque.
- **Regla editorial**: solo relaciones reales y 2–3 por herramienta. Prioriza enlaces inline dentro de una frase que ya menciona la relación (p. ej. «cubre tu proteína», «8,000–10,000 pasos», «calcula tu agua») y deja el bloque compacto como cierre. Nunca “todo con todo”.
- **Cobertura**: cuerpo (calorías, proteína, IMC, pasos, hidratación); mente (sueño ↔ respiración, ansiedad → respiración/diario); relaciones (lenguajes → apego, preguntas → diario de pareja); finanzas (combustible → luz, corte → interés de tarjeta → préstamo, aguinaldo → ahorro, sueldo neto → presupuesto, certificado → interés compuesto).

### 4c. Páginas básicas (home, ayuda, apoyar, legales, qué-es) — monocromo de marca

La marca HOLENTIA es **monocroma** (logo negro/blanco, OG `#121212` + blanco). Las páginas genéricas NO usan colores de sección ni degradados: su acento es el motivo de los **4 puntos** (`components/common/brand-dots`, los mismos de la imagen OG) bajo el logo. Recetas:

- **Favicon/PWA**: `app/icon.svg` es un cuadrado redondeado `#121212` con una H geométrica blanca; en `prefers-color-scheme: dark` invierte a fondo claro y H negra. `app/apple-icon.png` (180×180) y `public/icon-{192,512}.png` + `icon-512-maskable.png` se generan desde la misma marca con Sharp. Trazo grueso y sin texto: legible a 16 px.
- **Superficie**: `border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900`; interactiva + `hover:border-gray-300 dark:hover:border-gray-600`. Radios: tarjeta `rounded-2xl`, mini `rounded-xl`, control `rounded-md`.
- **Icon tile**: `h-10 w-10 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900` (lucide `h-5 w-5`).
- **Botón primario**: `h-10 rounded-md bg-gray-900 px-5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100` + `data-interactive="true"`. También en `app/error.tsx` («Reintentar»/«Ir al inicio») — el primario era `bg-blue-600` (azul genérico prohibido, §4d) hasta el 17-Oct-2026.
- **Secciones**: separación entre bloques `mb-12`/`space-y-12` (unificado 17-Oct-2026; aviso-legal y cookies usaban `space-y-10`).
- **Volver**: flecha + texto, sin chip circular: `text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white` + `py-3` (área táctil 44px sin cambio visual: la fila ya mide 44 por el botón del menú).
- **FAQ nativa** (`<details>`): respuesta en el HTML inicial; `ChevronDown` que rota con `group-open:rotate-180` (nunca emoji ▼).
- **Sin**: texto degradado, blobs `blur-*`, tarjetas pastel, `animate-pulse`, `hover:scale-*`, `shadow-xl`, emojis decorativos. Colores semánticos solo en avisos (`border-l-4 border-amber-500 bg-amber-50`) y borrado destructivo (`hover:bg-red-600`).

**Burbuja de ayuda** (campo que requiere verificación del usuario, ej. precio de combustible): chip ámbar bajo el input con muesca rotada 45° (`-top-[5px] left-6 h-2.5 w-2.5 rotate-45 border-l border-t`), texto `text-xs`, variantes `border-amber-200 bg-amber-50 text-amber-800` / dark `border-amber-800/40 bg-amber-900/20 text-amber-200`.

### 4d. Chrome global (menú, logo, header, scroll-to-top)

Reglas del armazón compartido, en línea con la identidad monocroma:

- **Acento por defecto neutro**: fuera de sección, ningún azul genérico (`#3B82F6` prohibido). Estados abiertos/activos → `ring-gray-900 dark:ring-white`, `bg-gray-100 dark:bg-gray-800`.
- **Sin framer-motion en el chrome global** (menu-button, logo): animaciones con CSS puro (`transition-*`, `group-hover:*`, keyframes en `globals.css` si hacen falta). framer-motion queda para paneles de herramientas de finanzas **y siempre detrás de un chunk diferido** (§3.8); en el camino crítico, CSS (`animate-result-in`).
- **Sin estilos inline ni manipulación JS de color/hover** (patrón footer): mapas estáticos de clases por sección + fallback neutro. Los valores crudos (rgba con alpha) solo en JS de Chart.js o fondos `headerBgColor` que necesitan opacidad.
- **Sin `hover:scale-*`/`active:scale-*`** en chrome; feedback con `transition-colors`.
- Menú desplegable: panel sólido `bg-white dark:bg-gray-900` + `border-gray-200 dark:border-gray-700` + `shadow-lg`; backdrop `bg-black/60` sin blur; entrada con keyframe `hol-menu-in`.
- **Ítem activo del menú** (`bg-gray-100 dark:bg-gray-800`): texto en tier AA a 14px — claro `text-mente-dark` / `text-relaciones` / `text-cuerpo-darkest` / `text-finanzas-dark`; oscuro `-light` (cuerpo `text-cuerpo`). La base no pasa sobre esos fondos (`text-mente` sobre `gray-100` = 4.2:1; `text-relaciones` sobre `gray-800` = 2.6:1; corregido 17-Oct-2026).
- **Header móvil de herramienta** (`unified-header.tsx`, sticky <768px): fondo **sólido** con el token `--color-{s}-active-dark` de la sección (mapa estático; fallback `rgb(17,24,39)`), texto/iconos blancos — los `-active-dark` garantizan ≥4.5:1 en ambos temas (el glass al 70% no cumplía AA en claro, cuerpo ≈1.9:1; retirado 16-Oct-2026). **Sin `backdrop-blur`** (con fondo sólido no aporta). Tap targets de 44px (`h-11 w-11`) en volver y menú; chip de logo con `py-2`.
- `data-interactive="true"` en botones, enlaces y toggle del menú.
- **Skip link «Saltar al contenido»** (`app/layout.tsx`, primero en el DOM): oculto sobre el viewport (`fixed left-4 top-4 -translate-y-20`) y visible al foco (`focus:translate-y-0`) con la receta del botón primario monocromo (`rounded-md bg-gray-900 text-white shadow-lg dark:bg-white dark:text-gray-900`) + `focus:ring-2` (`ring-gray-500` / `dark:ring-gray-400` con offset). El destino `#contenido` vive en `<main id="contenido" tabIndex={-1} focus:outline-none>` de cada página (home, hubs, herramientas, error y 404). Añadido 17-Oct-2026 (Fase AW).

## 4. Recetas de componente

### ToolCard (`components/sections/tool-card.tsx`)

Superficie **gradiente** por sección (no glass) para garantizar contraste en claro:

- **Light**: `bg-gradient-to-br from-{s} to-{s}-dark`, texto blanco (cuerpo: `text-black`).
- **Dark**: `dark:bg-none dark:bg-{s}-glass dark:text-{s}-text`.
- Borde `border-{s}-border`, hover `hover:border-{s}-light hover:-translate-y-0.5` + sombra mayor + efecto 3D (solo `hover:hover`; el tilt JS pisa el transform — coexisten porque `animate-fadeIn` vive en el `<Link>` externo, NUNCA en el div con transform).
- **Hover aclarado** (feedback extra, AA-safe): el extremo del gradiente se aclara un paso con `group-hover:to-{s}` (el texto vive sobre `from-{s}`, color base sin tocar → contraste intacto; la zona `to-` es la vacía inferior). En oscuro el glass no cambia (borde/sombra/lift ya dan la señal).
- **Chevron**: se desliza a la derecha (`group-hover:translate-x-1`, sube a `opacity-100`) y su círculo aparece con `group-hover:bg-white/20 dark:group-hover:bg-white/10` — el «punto» que pide el usuario, sutil.
- Categoría: `text-white` sólido `dark:text-{s}-lighter` (cuerpo: `text-black/70`) — el `/85` sobre `from-{s}` quedaba en 3.4–3.8:1 en mente/finanzas (12.8px no es texto grande); cuerpo conserva el negro translúcido sobre ámbar (6.2:1).
- No disponible: capa `.card-coming-soon` (overlay `rgba(0,0,0,0.45)` + blur + "Próximamente") + candado + `opacity-60`, `cursor-default`.
- Contenedor es `<Link>` con `group` + `data-interactive="true"` + `animate-fadeIn` + `style={{ animationDelay }}`; haptic en touch.

### ToolsGrid (`components/sections/tools-grid.tsx`)

- **Disponibles primero** (siempre en HTML), no disponibles colapsados tras botón "Ver todas las herramientas" (`hidden`/`grid`) con `aria-expanded`/`aria-controls` + `data-interactive="true"`.
- Botón fantasma con color de sección (`text-{s} hover:text-{s}-darkest dark:text-{s}-light`) + chevron rotable + foco visible `focus-visible:ring-{s}`. En claro, cuerpo arranca en `-darkest` y finanzas en `-dark` (14px: la base no llega a 4.5:1); mente/relaciones conservan la base (17-Oct-2026).
- Grilla `gap-4`.

### SectionTabs (`components/sections/section-tabs.tsx`)

Client component. Links a 4 secciones desde array estático. Activa: token `{s}` + `font-semibold` + `aria-current="page"` — **sin subrayado** (pedido del dueño 14-Oct-2026: solo el texto en color de sección). Inactiva: `text-gray-600 dark:text-gray-400` y hover **solo de color** (`hover:text-{s}-darkest dark:hover:text-{s}-light`) — **sin relleno** (`bg-black/5` retirado 14-Oct-2026: nada de recuadro al pasar el cursor). Foco `focus-visible:ring-2 ring-{s}`. Prop `neutral` (home, página monocroma): hovers neutros `hover:text-gray-900 dark:hover:text-white`, sin colores de sección. Tap `px-4 py-2.5` (40px; 17-Oct-2026). Activa en claro por tier cuando la base no llega a 4.5:1 a 14px: cuerpo `text-cuerpo-darkest` (3.8→5.6), finanzas `text-finanzas-dark` (4.1→7.9); mente (`text-mente`, 4.6) y relaciones (`text-relaciones`, 5.7) conservan la base.

### ToolPageShell (`components/tool-seo/tool-page-shell.tsx`)

Header con `pt-6` de aire bajo el logo/menú + H1 centrado en color de sección (en claro cuerpo usa `-darkest`; finanzas conserva la base por ser ≥20px) + descripción (`max-w-2xl mx-auto leading-relaxed`; a ancho completo la medida se estiraba en escritorio) + underline · botones outline `h-10` "Volver a {sección}" / "Hacer donación" visibles también en móvil (`border-{s} text-{s} dark:border-{s}-light dark:text-{s}-light`; a 14px el texto sube de tier: cuerpo `text-cuerpo-darkest`, finanzas `text-finanzas-dark`; hover claro: relleno `{s}-dark` + texto blanco — cuerpo: `{s}` + texto negro; hover oscuro: relleno `{s}-light` + texto negro; press `active:scale-[0.97]` con `transition-[colors,transform] duration-150`; `data-interactive="true"`) · `children` · FAQ acordeón · `JsonLd` (WebApplication + BreadcrumbList + FAQPage). **Sin miguita visible**: la navegación la dan los botones Volver y el footer; el `BreadcrumbList` va solo en JSON-LD (no obliga a UI visual).

### FAQ acordeón (`components/tool-seo/tool-faq.tsx`)

Client component. Una pregunta abierta a la vez (`openIndex`). Fila `button` con `aria-expanded`/`aria-controls`; panel con `grid-rows-[0fr→1fr]` + `overflow-hidden` (el contenido permanece en el HTML para SEO). Icono `Plus`/`Minus` en círculo sólido `bg-{s} group-hover:bg-{s}-dark dark:bg-{s}-light dark:group-hover:bg-{s}-lighter` con icono `text-white dark:text-black` (en cuerpo: `bg-cuerpo-dark`→`bg-cuerpo-darkest` por claridad). Hover de fila: relleno neutro visible `hover:bg-black/5` / `dark:hover:bg-white/10` + texto al tinte de sección en tier AA a 14px (`hover:text-{s}`; cuerpo `hover:text-cuerpo-darkest` y finanzas `hover:text-finanzas-dark` — 17-Oct-2026). **Solo en herramientas** (el prop `faq` del shell) — los hubs de sección NO llevan FAQ (corrección 14-Oct-2026).

### Botones (`components/ui/button.tsx` + custom)

- shadcn `Button` para UI genérica (fantasma en toggle de grid).
- Botones de herramienta: outline sección (ver shell) o sólidos `{s}` → hover `{s}-dark`.

### Listas filtrables / Glosario (`components/tools/glossary/`)

Patrón buscador + chips + resultados agrupados (referencia: `glossary.tsx`):

- **Panel hero del buscador**: tarjeta a ancho completo con la receta ToolCard (§4): `rounded-2xl border border-finanzas-border bg-gradient-to-br from-finanzas to-finanzas-dark p-6 sm:p-8 text-white dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text`. Dentro, contenido centrado en `mx-auto max-w-2xl`: `h2 text-center text-xl sm:text-2xl font-bold` (hereda el color), subtítulo `text-center text-sm text-white dark:text-finanzas-lighter` e input `relative mt-4`. El input búsqueda: `h-12 rounded-md border-gray-300 bg-white pl-12 pr-12 text-base` + icono `Search` absoluto `left-4 h-5 w-5` · foco canónico `focus:border-transparent focus:ring-2 focus:ring-finanzas dark:focus:border-transparent dark:focus:ring-finanzas-light` · dark: `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100` · botón limpiar `X` a la derecha · `type="search"` + `sr-only` label.
- **Chips de categoría** (`rounded-md`, no pill): base `border px-3 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 active:scale-[0.97]` · activo `border-finanzas-dark bg-finanzas-dark text-white dark:border-finanzas-light dark:bg-finanzas-light dark:text-black` · inactivo con el hover de fila FAQ (`hover:bg-black/5 hover:text-finanzas dark:hover:bg-white/10 dark:hover:text-finanzas-light`) · `aria-pressed`.
- **Contador** con icono `Wallet` + `aria-live="polite"` (`N de M términos`), alineado a la derecha de la barra de chips (`ml-auto` en el flex).
- **Resultados**: agrupados por categoría con `h2 text-xl font-bold text-finanzas-dark dark:text-finanzas-light` (SIN conteo numérico) y separación `space-y-10` entre grupos, grid `sm:grid-cols-2 gap-4`; tarjetas `group rounded-xl border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800` con hover de escaneo (no son enlaces): `transition-colors hover:border-finanzas hover:bg-black/5 dark:hover:border-finanzas-light dark:hover:bg-white/10` + título que reacciona `group-hover:text-finanzas-darkest dark:group-hover:text-finanzas-lighter`; título `h3 text-lg font-semibold text-finanzas-dark dark:text-finanzas-lighter` (18px/600 no cuenta como large), cuerpo `text-sm text-gray-700 dark:text-gray-300`, ejemplo opcional en recuadro sólido `bg-finanzas-lighter text-gray-800 dark:bg-finanzas-dark dark:text-gray-200` con icono `Lightbulb text-finanzas-dark dark:text-finanzas-light`. Enlace interno a herramienta (campo `related` del término): `Link` de next/link `mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-finanzas-dark hover:text-finanzas-darkest dark:text-finanzas-lighter` + icono `ArrowRight h-4 w-4`, con `data-interactive` y haptic `medium` (interlinking SEO + UX).
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
- **Lista de entradas con proporción** (trackers tipo gastos hormiga): filas `rounded-xl border border-gray-200 dark:border-gray-700` con nombre + frecuencia, monto anual `font-semibold tabular-nums text-{s}-dark dark:text-{s}-light` (finanzas a 14px: `dark:text-finanzas-lighter`), `%` sobre el total en `text-xs` y barra `h-1.5 rounded-full bg-gray-100 dark:bg-gray-700` con relleno `bg-{s} dark:bg-{s}-light`; acciones de fila (editar/borrar) con hit area `h-11 w-11` (`aria-label` por fila). Hero de total anual en panel gradiente con `aria-live="polite"` + stats `rounded-lg bg-black/10 p-3`.

### Calculadora de ingreso único (aguinaldo, ref. `components/tools/aguinaldo-calculator/`)

Patrón de un dato económico + resultado desglosado (2 columnas: form `lg:col-span-2` `h-fit` / resultado `lg:col-span-3`):

- **Formulario**: input de dinero formateado con comas (`DollarSign` + `pl-10`) y slider 1–12 con número grande `text-4xl font-bold text-{s} dark:text-{s}-light` + leyendas `1 / 12` en `text-xs`.
- **Resultado**: hero gradiente ToolCard (`aria-live="polite"` + count-up, dato único) + tarjeta de desglose contable: filas `justify-between py-1.5 text-sm tabular-nums`, fila de exención («Descuentos: RD$ 0.00»), divisor `border-t border-gray-200 dark:border-gray-700` y fila neta `font-bold text-{s}-dark dark:text-{s}-light`.
- **Mini-chips legales** (`grid sm:grid-cols-3 gap-3`): celda `rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800` con icono `h-4 w-4 text-{s}`, título `text-sm font-semibold` y detalle `text-xs text-gray-500 dark:text-gray-400`.
- **Nota legal**: `rounded-lg bg-finanzas-lighter p-3 text-xs text-gray-800 dark:bg-finanzas-dark dark:text-gray-200` + icono `Info`.
- **Pase UI/UX móvil (17-Oct-2026)**: input a la receta canónica con icono (fuera `p-3`/`md:text-sm`/`shadow-sm`), etiquetas del hero a `text-white` sólido (el `/85` bajaba a ~4.2:1 en móvil), neta del desglose a `dark:text-finanzas-lighter` (el `finanzas-light` quedaba en 3.6:1) y tarjeta de desglose a `p-6`.

### Calculadora de impuesto con modo agregar/quitar (ITBIS, ref. `components/tools/itbis-calculator/`)

- **Modo**: segmented de 2 botones (`grid grid-cols-2 gap-2`, `py-2.5`): activo `bg-{s}-dark text-white` (el sólido directo solo si pasa AA con blanco: mente 4.6, relaciones 5.7; finanzas 4.1 → `finanzas-dark`), inactivo `bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`; helper `text-xs` que explica el modo.
- **Chips de tasa**: outline `{s}` activo / neutro inactivo (patrón tracker), con `aria-pressed` + haptic `light`.
- **Resultado**: hero con count-up cuyo número es el «resultado del modo» (agregar → total; quitar → impuesto) + desglose base/impuesto/total con la fila total en `font-bold text-{s}-dark dark:text-{s}-light` (misma tarjeta de desglose del aguinaldo).
- **Pase UI/UX móvil (17-Oct-2026)**: input canónico con icono; segmented activo a `bg-finanzas-dark` (ver §7), chips de tasa a `py-2.5` y texto `finanzas-dark`/`finanzas-lighter`; héroes `text-white`, neta `dark:text-finanzas-lighter` y desglose `p-6`.

### Calculadora de tasa con retención (certificado financiero, ref. `components/tools/certificate-calculator/`)

- **Formulario**: monto (input moneda), tasa anual (input + `Percent`) y plazo con segmented de unidad (Días/Meses) + modalidad (Cada mes/Al vencimiento) en `grid grid-cols-2 gap-2`; helpers `text-xs` con referencias reales (7%–11% anual, 30–910 días).
- **Desglose con retención**: filas depósito / interés bruto / retención en negativo (`− RD$…`) / ganancia neta `font-bold` + fila extra según modalidad (total al vencer o pago mensual `≈` + nº de meses) y cierre `text-xs` con rendimiento neto anual (tasa × 0.9).
- **Pase UI/UX móvil (17-Oct-2026)**: monto/tasa/plazo con la receta canónica con icono; segmented (unidad y modalidad) a `py-2.5` + activo `bg-finanzas-dark`; héroes `text-white`, neta `dark:text-finanzas-lighter` y desglose `p-6`.

### Calculadora de gasto de combustible (17-Oct-2026, ref. `components/tools/fuel-expense-calculator/`)

- **Formulario**: 5 inputs numéricos con la receta canónica + icono (`py-2.5 pl-10 pr-3`, icono `text-gray-500 dark:text-gray-400`), `type="text"` + `inputMode` con saneado (`[^\d.,]` precio/km/L; `[^\d]` viajes/días), burbuja ámbar «Verifícalo» para el precio del día, chips (presets Corto/Medio/Largo y días) con `chipClass` y tarjetas de vehículo en 3 columnas (`border-2` seleccionado, `text-finanzas-dark`/`dark:text-finanzas-lighter`).
- **Resultado ticket**: banda `bg-finanzas-dark text-white` (blanco sobre `finanzas` = 4.1:1, no pasa), cuerpo `p-6` con hero de gasto mensual, filas `font-mono tabular-nums`, banda anual `bg-gray-900 dark:bg-gray-100` y nota final; tarjeta de ahorro con h2 `text-xl` y bullets.
- **Layout (corregido 18-Oct-2026)**: el resultado corto se cierra con una tarjeta **«Tu gasto en perspectiva»** debajo (costo por viaje, por día de trabajo, ahorro al reducir 10% los km y al mejorar 1 km/L) para igualar el formulario. Los 6 consejos siguen a ancho completo; el enlace a consumo eléctrico es inline y sutil.

### Calculadora de consumo eléctrico (17-Oct-2026, ref. `components/tools/electricity-calculator/`)

- **Entrada**: slider 0–1000 kWh + input numérico canónico (saneado `[^\d]`) + quick chips (150/300/445/700) en tinte `bg-[#388e3c]/10` con texto `finanzas-dark`/`finanzas-lighter`.
- **Resultado ticket**: cabecera `bg-sky-200 dark:bg-sky-900/60`, cuerpo `p-6 font-mono` con desglose por tramos y subsidio, fila total `bg-yellow-300 dark:bg-yellow-500/90 text-gray-900` y nota de estimación.

### Calculadora de préstamo (17-Oct-2026, ref. `components/tools/loan-calculator/`)

- **Formulario**: campos sobre `Input` de `components/ui/input` con override canónico ampliado (`h-auto … text-lg font-semibold md:text-lg`; el base `h-10`/`md:text-sm` gana en el merge si no se anula) + sliders de monto/tasa/plazo; etiquetas de valor `text-sm font-semibold text-finanzas-dark dark:text-finanzas-lighter`.
- **Resultado**: hero gradiente con cajas de stats `bg-black/20` (las `bg-white/20` dejaban el texto pequeño en ≈3.8:1).
- **Tabs/amortización**: inactivo con hover `hover:bg-finanzas-dark hover:text-white` (el `bg-finanzas`+blanco = 4.1:1 no pasa a 14px); cabecera `bg-[#388e3c]/20 dark:bg-[#388e3c]/30`; fila Total `bg-[#388e3c]/10 dark:bg-[#388e3c]/20` con texto `finanzas-dark`/`finanzas-lighter`; paginación `p-2.5` por clases — fuera los estilos inline `#388e3c`/rgba que ignoraban el modo oscuro.
- **Pase UI/UX móvil (17-Oct-2026)**: contenedor a `p-6`; Guardar/Reiniciar a `py-2.5` con press feedback; acciones de simulaciones con hit area `h-10 w-10` (`aria-label`).

### Calculadora de interés de tarjeta (17-Oct-2026, ref. `components/tools/card-interest/`)

- **Formulario**: dos recetas de input — numéricos a `text-lg font-semibold` y texto libre a `text-base` (`inputClassText`); parsers de dinero/tasa tolerantes a comas (`.replace(/,/g, "")`); 3 campos a `type="text"` + `inputMode` con saneado (`[^\d.,]`).
- **Resultado**: hero `p-6 sm:p-8` (verde normal, rojo en «no bajas el saldo»), etiquetas `text-white` sólido en ambas ramas y cajas `bg-black/20` con label `text-xs`; h3 «El costo de financiar» a `text-xl font-bold`.

### Tarjeta: corte y vencimiento (17-Oct-2026, ref. `components/tools/card-cutoff/`)

- **Formulario**: 5 campos con la receta canónica; texto libre (nombre) y `type="date"` con `inputClassText` (`text-base`); días de corte/vencimiento `type="text"` + `inputMode="numeric"` + saneado y `slice(0,2)`.
- **Badge celebratorio**: el verde Tailwind `#22c55e` con blanco (2.3:1) → `bg-finanzas-dark text-white dark:bg-finanzas-light dark:text-gray-900`.
- **Héroe/timeline**: `p-6 sm:p-8` con etiquetas `text-white` sólido; quick chips `py-2.5` con press; notas de pasos y marcas a `finanzas-dark`/`finanzas-lighter` (iconos en `finanzas`/`finanzas-light`).
- **Empty state + ayuda (18-Oct-2026)**: el empty state ocupa el alto (`h-full`) y añade 3 viñetas de lo que verá el usuario; el formulario incluye «¿No encuentras tus fechas?» con 3 pistas (estado de cuenta, día fijo, pagar antes) para que la columna izquierda no quede corta frente a la timeline.

### Calculadora de interés compuesto (17-Oct-2026, ref. `components/tools/compound-interest/`)

- **Formulario**: 5 inputs canónicos con icono; años/tasa/inflación de `type="number"` a `type="text"` + `inputMode` con saneado y `handleNumberChange` normalizando la coma decimal (`"60,5"` → 60.5); Guardar `bg-finanzas-dark hover:bg-finanzas-darkest`.
- **Tabs/segmentados**: activos `bg-finanzas-dark` sin `shadow-sm`; tabs a `py-2.5` con press feedback.
- **Resultado (héroe duplicado mobile/desktop)**: cajas `bg-black/20` y «Balance final» sólido; impacto con verdes `finanzas-dark`/`finanzas-lighter` (18px) y rojos `text-red-700`/`red-400`; tabla y paginación como en préstamo.
- **Charts y guardadas**: tarjetas `p-6`; hex de canvas en la familia de tokens (`#4caf50` → `#66bb6a`); acciones con hit area `h-10 w-10` y «+4.04%» a `text-green-700`/`green-400` (3.3→5.0:1).

### Planificador de ahorros (meta + tiempo, ref. `components/tools/savings-planner/`)

- **Modo** (¿Cuándo llego? / ¿Cuánto aporto?) con segmented `grid-cols-2`; inputs de dinero formateados + plazo en meses + tasa con helper «0% si solo guardas».
- **Resultado**: hero con count-up cuyo dato es el tiempo (`X meses` + `≈ a años y b meses · llegas en {mes}`) o el aporte mensual; desglose meta/ya tienes/aportes/intereses con fila «Sale de tu bolsillo» en `font-bold`.
- **Fecha objetivo solo en el cliente** (`mounted` + `Intl.DateTimeFormat("es-DO")`) para evitar desajustes de hidratación; estados borde «¡Ya alcanzaste tu meta!» y «plan > 100 años»; nota con enlace cruzado a la calculadora de interés compuesto.

### Planificador de compras (esperar vs. invertir, ref. `components/tools/purchase-planner/`)

- **Formulario**: precio (input moneda) + slider de meses 1–60 con número grande + rendimiento anual (helper 7%–11% ref.).
- **Resultado**: hero «La paciencia te paga» con count-up; comparativa de 3 filas («Comprar hoy» / «Esperar e invertir» / «Al comprar te quedan `+RD$…`» en `font-bold`) con supuestos en `text-xs`; estado educativo a tasa 0% («sin invertir, esperar no gana nada») y nota con enlace a interés compuesto.

### Simulador de presupuesto (tablas editables + familia salvia, ref. `components/tools/budget-simulator/`)

- **Pestañas móviles** `py-2.5` con press (`active:scale-[0.97]`); activo `bg-finanzas-dark text-white` sin `shadow-sm`; inactivo `bg-white/80 dark:bg-gray-700/80`.
- **Tablas editables**: celdas con borrador local (§3.3, claves `t-/a-/v-{id}`); cabeceras `text-xs text-gray-600 dark:text-gray-300`; fila de total `text-[#1e3a2b] dark:text-[#a5d6a7]`; borrar fila `h-10 w-10` con tinte `bg-[#388e3c]/10` y token; «Añadir ingreso/gasto» `py-2.5 bg-finanzas-dark` + press; wrapper del botón `p-4`.
- **Salvia en dark**: textos `#1e3a2b` → `dark:text-[#a5d6a7]`; enlaces/acentos `text-[#388e3c]` a 12px → `text-finanzas-dark`; paneles `p-5`; tarjetas de tips `bg-[#1e3a2b]/80` con texto blanco; paginación de tips como botones `h-10 w-10` (dot `h-2.5 w-2.5`, dark `#a5d6a7`/`gray-600`); cierres de modal/advertencia `h-11 w-11`.
- **Verdes/rojos de dinero**: totales `text-green-700 dark:text-green-400`; pérdidas `red-600`/`red-700` + `dark:red-400`.

### Test de perfil de riesgo (ref. `components/tools/risk-profile-test/`)

- **Héroe de resultado**: gradiente finanzas + cajas internas `bg-black/20` (píldoras, caja del Disclosure), etiqueta «Tu resultado» sin `opacity`, «Ver niveles» como píldora `bg-black/20` + press; `Disclosure` con `tone="light"` en `text-white` sólido.
- **Quiz**: opciones `p-4` con press, selección `border-finanzas bg-[#388e3c]/10`; progreso «Pregunta N de M» + `text-finanzas-dark dark:text-finanzas-lighter`.
- **CTAs y chips**: activos `bg-finanzas-dark text-white` + hover `finanzas-darkest` + press; chips `py-2.5`; segmented `px-4 py-3`; enlaces outline `text-finanzas-dark dark:text-finanzas-lighter`.
- **Inputs**: canónico (`inputClass` 18px) + campos propios (capital, tasas, % ahorro) con foco canónico, `text-base`/`text-lg` y sin `shadow-sm`; botón ⓘ de tasas `p-1.5`.

### Confirmación de borrado en 2 pasos (patrón transversal)

Acción destructiva sobre datos del usuario: el primer toque **no borra**. El elemento cambia a estado rojo (`bg-red-600 text-white` + `Check` + «¿Seguro?») y se autodescancela a los 4 s (timer único con `clearTimeout` previo); el segundo toque ejecuta. Aplicado en `guided-journal` (borrado por entrada y «Borrar todo»). Usarlo en cualquier acción irreversible nueva.

### Diario guiado (modernizado 17-Oct-2026, ref. `components/tools/guided-journal/`)

- **Chips de ánimo** (5, `grid grid-cols-5 gap-2` con emoji, `aria-pressed`, re-toque quita la selección) en vez de `<select>`.
- **Racha + tira de ánimo**: tarjeta con `Flame` (días consecutivos, clave de día local vía `toLocaleDateString("en-CA")`) y últimos ≤7 ánimos en emojis con `title` de fecha.
- **Borrador del formulario** (patrón D ampliado): `draftKey(slug)` guarda el borrador **y el `editingId`**; se limpia al guardar/cancelar/borrar; indicador «Borrador guardado».
- **Copiar entrada** (`navigator.clipboard` + check temporal 1,5 s) como respaldo manual; estado vacío con `Feather`; fechas `es-DO`; editar **conserva la fecha original** (la racha y el historial no se mueven).
- **Pase UI/UX móvil (17-Oct-2026)**: textareas con la receta de input (16px, foco `ring-2`, `placeholder:text-gray-400 dark:placeholder:text-gray-500`); acciones de tarjeta `h-9 w-9` centradas con press feedback; tarjetas a `p-6`.

### Respiración guiada (17-Oct-2026, ref. `components/tools/breathing-exercises/`)

- **Motor por `requestAnimationFrame`**: el círculo interpola su escala según el progreso de la fase (`{name, seconds, from, to}`) escribiendo `style.transform` directo por ref (sin re-render por frame); pausar congela y reanudar continúa donde iba (el progreso vive en un ref con `phaseStart` acumulado).
- **Haptics**: `light` en cada cambio de fase, `medium` al completar las rondas.
- **Controles**: tarjetas de técnica (nombre + etiqueta + detalle, `aria-pressed`) y chips de rondas; cambiar la configuración detiene y resetea la práctica. Las cuentas de segundos van en `aria-hidden` (el `aria-live` anuncia solo el nombre de la fase, no cada segundo).
- **Preferencias** en `draftKey(slug)` (patrón D): técnica y rondas.
- **Seguridad**: aviso visible de que no sustituye tratamiento y de no retener el aire en el agua o conduciendo.
- **Pase UI/UX móvil (17-Oct-2026)**: detalle de la técnica seleccionada en `text-gray-700 dark:text-gray-200` (el `gray-500` caía a 2.7:1 sobre `mente-lighter`); tarjetas de técnica y chips de rondas con press feedback (rondas a `py-2.5`, 40px); tarjetas `p-6` y tips con h2 `text-xl`.

### Test de ansiedad GAD-7 (17-Oct-2026, ref. `components/tools/anxiety-test/`)

- **Flujo de test instrumentado**: intro (aviso de cribado, no diagnóstico) → quiz de una pregunta a la vez con auto-avance a 300 ms y «← Atrás» → resultado; patrón D con reanudación a medias (vuelve a la primera pregunta sin responder).
- **Resultado**: héroe gradiente `mente` con puntaje `useCountUp` sobre 21 + banda (badge por tramo) y **escala de severidad** de 4 segmentos (23/23/23/resto: emerald/amber/orange/red) con marcador en `left: calc((score/21)*100% − 2px)`.
- **Contenido por banda**: resumen + 3 tips + enlaces cruzados a respiración y diario; **aviso de crisis solo en banda grave** (`AlertTriangle` + 911/emergencias). Nunca ocultar el «no es un diagnóstico».
- **Tokens**: acciones y acentos en `mente`; los semáforos de severidad usan la paleta Tailwind estándar (emerald/amber/orange/red), no tokens de sección.
- **Pase UI/UX móvil (17-Oct-2026)**: etiquetas del héroe en `text-white` sólido (el `/85` y `/75` sobre `#1976d2` caían a 3.8/3.2:1); h2 de resultado («¿qué hago ahora?») a `text-xl`; aviso de crisis a `p-4 text-sm`; opciones de quiz y botones con press feedback; paneles de resultado a `p-6`.

### Calculadora del sueño (17-Oct-2026, ref. `components/tools/sleep-calculator/`)

- **Modo segmentado** («Me levanto a las…» / «Me acuesto a las…») + `<input type="time">` nativo (mobile-first, sin dependencias); resultado inmediato con `aria-live="polite"` + `animate-result-in`.
- **3 filas de ciclos** (6/5/4 × 90 min) con la de 5 ciclos resaltada como «Recomendado» (7 h 30 min); margen fijo de 15 min para conciliar el sueño.
- **Formato 12 h `a.m./p.m.`** con `formatTime` (normaliza cruzando medianoche con `((t % 1440) + 1440) % 1440`); nada de `Date` para aritmética de horas.
- **Patrón D** con `{mode, wakeTime, bedTime}`; validar con regex `HH:MM` al restaurar.
- **Pase UI/UX móvil (17-Oct-2026)**: input de hora con la receta unificada (`px-3 py-2.5 text-lg font-semibold`, foco `ring-2`); subtexto de la fila «Recomendado» en `text-gray-700 dark:text-gray-200` (antes `gray-500` sobre `mente-lighter`); botones de modo con press feedback; tarjetas `p-6` y h2 de resultado a `text-xl`.

### Test de lenguajes del amor (mejoras 17-Oct-2026, ref. `components/tools/love-languages-test/`)

- **Reescritura a estándar**: tokens `relaciones` en todo el componente (se eliminaron los `purple-*` sueltos, incluidos `hover:bg-purple-700` y `bg-purple-50`); quiz una pregunta a la vez con **auto-avance 300 ms** y «← Atrás» que conserva la selección (`aria-pressed`).
- **Patrón D reanudable**: respuestas parciales → vuelve a la primera sin responder; completas → resultado directo (`holentia:test-lenguajes-amor:draft:v1`). Resultado con **copiar resumen** (`navigator.clipboard` + check 1,5 s) y acciones Repetir / Borrar.
- **Pase UI/UX móvil (17-Oct-2026)**: porcentaje del quiz a `dark:text-relaciones-lighter` (el `relaciones-light` caía a 3.1:1 a 14px); botones y opciones con press feedback `active:scale-[0.97]`.

### Test de estilo de apego (17-Oct-2026, ref. `components/tools/attachment-test/`)

- **Likert por afirmación** (Nada/Poco/Bastante/Mucho = 0–3) con una afirmación por pantalla, auto-avance 300 ms y «← Atrás»; 12 afirmaciones → 4 estilos (3 ítems cada uno, máx. 9 puntos por estilo).
- **Sin semáforos**: los estilos no se colorean por «mejor/peor» — todos los acentos en tokens `relaciones` y el dominante se destaca con `bg-relaciones-lighter dark:bg-relaciones-dark`.
- **Patrón D** reanudable con copiar resultado; disclaimer educativo en ámbar («no es un test clínico ni una etiqueta») + nota de continuo al pie. Enlace cruzado al test de lenguajes del amor.
- **Pase UI/UX móvil (17-Oct-2026)**: enlace cruzado y porcentaje del quiz a `dark:text-relaciones-lighter` (3.1:1 → 5.0:1); botones y opciones con press feedback.

### Preguntas profundas (17-Oct-2026, ref. `components/tools/deep-questions/`)

- **Deck mezclado en cliente**: orden curado por categoría; «Mezclar el orden» usa Fisher–Yates solo dentro del handler (nunca en el `useState` inicial, para no romper la hidratación SSR). `aria-live="polite"` en la tarjeta de la pregunta.
- **Navegación**: «← Anterior» (deshabilitado en la primera) / «Otra pregunta» con contador «Pregunta X de 15»; copiar con clipboard + check.
- **Patrón D mínimo**: solo la categoría preferida (`holentia:preguntas-profundas:draft:v1`); tarjetas de categoría con `aria-pressed` y badge de conteo.
- **Pase UI/UX móvil (17-Oct-2026)**: subtexto de la categoría seleccionada a `gray-700`/`gray-200` (el `gray-500` sobre `relaciones-lighter` caía a 2.6:1); «Cómo aprovecharlas» con h2 `text-xl` y tarjeta `p-6`; filas, botones y badges con press feedback.

### Diario para parejas (17-Oct-2026, ref. `components/tools/couples-journal/`)

- **Pregunta del día determinista por fecha local** (índice = días desde epoch ÷ 30). Se calcula **después del montaje** (`useEffect`): las páginas son estáticas y un SSR prerenderizado quedaría con la fecha del build; placeholder `animate-pulse` estable para no romper la hidratación.
- **Dos campos** (tú / tu pareja) con borrador autoguardado **solo tras la primera edición** (`touched` ref: evita el flash «Borrador guardado» al precargar), upsert por día en `holentia:diario-parejas:entries:v1` y limpieza del borrador al guardar.
- **Historial con racha** (misma semántica que el diario guiado), copiar con clipboard + check y borrado en 2 pasos; «Borrar todo» con temporizador de 4 s.
- **Pase UI/UX móvil (17-Oct-2026)**: textareas con la receta unificada (eran `text-sm` + `ring-1`: zoom iOS y foco viejo); h2 de tarjetas a `text-xl`; enlace cruzado a `dark:text-relaciones-lighter`; «(opcional)» a `gray-500`/`gray-400`; acciones de tarjeta `h-9 w-9` con press feedback.

### Plan de pasos 5-10-20 (17-Oct-2026, ref. `components/tools/steps-plan/`)

- **Objetivo configurable**: 3 presets (`Base` 4,000 / `Recomendado` 7,000 / `Ideal` 10,000, `aria-pressed`) + input libre (1,000-30,000) con normalización al `blur`; conversión documentada **100 pasos/min** (cadencia moderada) y recuadro `Info` que desmonta el mito Manpo-kei. Autoguardado **solo tras la primera edición** (`dirty` ref) en `holentia:pasos-al-dia:draft:v1`.
- **Plan por bloques (steppers)**: presets `Mínimo 40′` / `Recomendado 60′` / `Ideal 80′` + bloques Mañana/Tarde/Noche con `−`/`+` de 5 en 5 (0-90, `aria-label` por bloque); resumen con total, equivalencia en pasos y chip de nivel por minutos (<40 · 40-59 · 60-69 · 70-100 · +100).
- **Móvil + contraste (17-Oct-2026)**: presets de objetivo y de plan como **filas de ancho completo** (label izquierda + valor derecha, ≥44px) y 3 columnas desde `sm`; steppers `h-10 w-10`; input «Otro objetivo» con la receta de §3.3 (`text-lg`, `type="text"` + saneado) y registro de hoy con `+1,000` pegado al input. Texto sobre ámbar según §7 (gray-900 / darkest); círculos de la semana: cumplido `bg-cuerpo text-gray-900`, registrado `border-cuerpo-dark`, hoy `ring-cuerpo-dark` (los `/opacidad` sobre tokens eran clases muertas).
- **Registro de hoy** (patrón diario-parejas): fecha local calculada tras el montaje (páginas estáticas), `touched` ref, upsert por día en `holentia:pasos-al-dia:entries:v1` con `entriesRef` para no re-disparar el efecto; barra de progreso vs. objetivo, racha (`Flame`, días seguidos cumpliendo) y fila de últimos 7 días (punto lleno con `Check` = cumplido, anillo = registrado, punteado = sin registro; hoy con `ring`).
- **Beneficios por banda de objetivo** (`<4000` arranque · `4000-5999` base · `6000-7999` recomendado · `8000+` ideal) + tarjeta «Los pasos son el primer paso, no el único» (OMS 150-300 min/semana, fuerza 2 días, alimentación, descanso).
- **Trucos que suman pasos**: grid `sm:grid-cols-2` de 10 micro-hábitos (icono + título + una línea): caminar 10-15 min tras comer, levantarse cada hora, parqueo lejos «si es seguro», bájate una parada antes, escaleras, caminar en llamadas, madrugar/atardecer (clima), compañía, música/pódcast y tenis a la vista.
- **Formato de miles**: coma (`toLocaleString("es-DO")`, «7,000»), coherente con el resto del sitio.

### Calculadora de IMC (17-Oct-2026, ref. `components/tools/bmi-calculator/`)

- **Dos datos, resultado al instante**: peso + estatura (rango realista 20-400 kg / 100-250 cm; si no, estado «Revisa tus datos»). **Toggle kg/lb dentro del input** (botón sufijo con `ChevronsUpDown` que convierte el valor al cambiar; útil en RD, donde se piensa en libras). Inputs `type="text"` + `inputMode` (el `type="number"` rompe la escritura de decimales parciales).
- **Héroe gradiente `cuerpo`** con IMC a un decimal (`useCountUp` + `toFixed(1)`, `tabular-nums`) + badge de banda OMS (bajo peso sky / normal emerald / sobrepeso amber / obesidad red — semáforos en paleta Tailwind estándar) + mensaje de la banda.
- **Escala proporcional** (14/26/20/40 sobre 15-40): segmentos por banda con marcador `left: calc(...% - 2px)` (patrón GAD-7, aquí con anchos proporcionales a los rangos IMC) y etiquetas `<18.5 · 18.5–24.9 · 25–29.9 · ≥30` con los mismos anchos.
- **Peso saludable** por estatura (18.5-24.9 × estatura²) en la unidad activa + mensaje de diferencia («te faltan ≈ X» / «estás ≈ X por encima» / «dentro del rango»).
- **Honestidad primero**: tarjeta «El IMC no lo dice todo» (`AlertTriangle` + 4 items: músculo ≠ grasa, cintura OMS 88/102 cm, embarazo/niños/mayores, tendencia) y cierre compacto «Del número a la acción» (`RelatedTools` + haptic medium) con 3 enlaces: calorías, proteína y pasos.
- **Patrón D**: borrador `holentia:calculadora-imc:draft:v1` ({weight, height, unit}) autoguardado tras la primera edición (`touched` ref) + «Borrar mis datos».
- **Móvil + contraste (17-Oct-2026)**: peso y estatura se **apilan a ancho completo** (el sufijo kg/lb no cabe a 2 columnas en pantallas ≤360px) y recuperan `sm:grid-cols-2`; inputs con la receta de §3.3 (foco `ring-2` canónico) y botón kg/lb `text-gray-900` sobre `bg-cuerpo-lighter` con hover `hover:bg-cuerpo-light dark:hover:bg-cuerpo` (los `/opacidad` previos eran clases muertas).

### Calculadora de sueldo neto (descuentos laborales RD, 17-Oct-2026, ref. `components/tools/net-salary-calculator/`)

Evolución de «ingreso único»: bruto → neto con dos capas (porcentaje con tope + impuesto por tramos).

- **Formulario**: salario bruto con la receta canónica (`DollarSign` + `pl-10`) + chips de preset monetario (RD$25,000/50,000/100,000, activo outline) + campo opcional «otros descuentos» con tooltip ⓘ; patrón D (`holentia:calculadora-sueldo-neto:draft:v1`).
- **Resultado**: hero ToolCard (neto mensual con count-up a 2 decimales, «≈ por quincena» y tasa efectiva) + tarjeta de desglose con sub-labels `text-xs` por fila (tope de SFS/AFP cuando aplica, tramo de ISR), neta `font-bold text-finanzas-dark dark:text-finanzas-lighter` y caja interna `rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50` («Cómo se calculó tu ISR»: base anual, tramo, anual ÷ 12).
- **Cifras vigentes**: strip `grid sm:grid-cols-3` con la receta de mini-chips del aguinaldo (SFS 3.04%, AFP 2.87%, escala ISR) + nota legal con fuentes (Resolución 01-2025 TSS · escala DGII 2026).
- **Dominio**: constantes (tasas, topes y tramos) en el módulo del componente con comentario de fuente; ISR sobre `bruto anual − TSS` (exento hasta 416,220.01 · 15% · 31,216+20% · 79,776+25%).

### Directorio de herramientas (17-Oct-2026, ref. `app/herramientas/`)

Superficie de navegación: índice server-rendered de las herramientas por sección, sin JS propio (las `ToolCard` son las mismas de los hubs).

- **Chrome**: `main#contenido` + fila superior «Volver» (44px) + `MenuButton`, encabezado centrado con `Logo size="lg"` + `BrandDots` + H1 + intro con el contador real de herramientas, con contenedor `max-w-6xl` (§4c se queda para páginas de texto).
- **Chips ancla** por sección (`<a href="#mente">`…): `rounded-full border px-4 py-2 text-sm font-medium` con los tiers de texto de §4d «Chrome global» (`text-mente`, `text-cuerpo-darkest`, `text-finanzas-dark`, `dark:text-{s}-light`) + contador `· N` en `gray-500`; el `nav` ancla lleva `aria-label`.
- **Grupos por sección**: `<section id={id} className="scroll-mt-6">` con h2 + «N herramientas disponibles» + enlace «Ver sección →» (mismo tier de color) y grid `grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4` con las `ToolCard` **disponibles** (las «Próximamente» no se listan: el índice es de lo usable).
- **Enlace**: primera posición del footer, server-rendered (§4b).

### Calculadora de prestaciones laborales (17-Oct-2026, ref. `components/tools/severance-calculator/`)

Variante laboral de la calculadora salarial para una liquidación (Código de Trabajo, Ley 16-92): el resultado es un desglose de **días de salario**, no de porcentajes.

- **Formulario**: salario mensual con la receta canónica (`DollarSign` + `pl-10` + presets 25/50/100k) + dos `type="date"` con la variante de texto de §3.3 (`px-3 py-2.5 text-base`) + motivo como **radiogroup apilado** (`role="radiogroup"`/`role="radio"` + `aria-checked`; fila activa `border-2 border-finanzas`, press `active:scale-[0.99]`) con título + subtítulo por opción; patrón D (`holentia:calculadora-prestaciones-laborales:draft:v1` con `{salario, ingreso, salida, motivo}`).
- **Dominio**: salario diario = mensual ÷ 23.83 (criterio del Ministerio de Trabajo); preaviso 7/14/28 días (art. 76); cesantía 6/13/21 por año/23 por año con la fracción de año mayor de 3 meses pagada como 6 o 13 días (art. 80); vacaciones con escala 6–12 días hasta el año y 14/18 después (arts. 177/180); Navidad = meses del año ÷ 12 (art. 219). Constantes y fórmulas en el módulo, con comentario de fuente.
- **Resultado**: hero de la sección con el total (count-up) + «≈ N meses de salario · antigüedad: …»; desglose con las filas «Antigüedad» y «Salario diario de prestaciones» arriba (sub `text-xs`, cierre con `border-b`) y las 4 partidas con sub citando artículo y días; las partidas que no aplican muestran **«—»** (no RD$0) según el motivo elegido; fila de total + línea del plazo de pago (10 días).
- **Notas condicionales** (caja `rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50` como «Cómo se calculó tu ISR»): fracción del art. 80 pagada o no, antigüedad <3 meses, escala de 23 días; además strip de cifras vigentes y nota legal.
- **Móvil**: fechas en `grid-cols-1 sm:grid-cols-2`; empty state con `Briefcase` que guía por pasos (salario → fechas → resultado) y mensaje propio cuando el rango de fechas es inválido.

### Calculadora de proteína diaria (18-Oct-2026, ref. `components/tools/protein-calculator/`)

- **Formulario**: peso con sufijo kg/lb dentro del input (convierte al cambiar, patrón IMC) + 5 perfiles como tarjetas (`Sedentario 0,8–1,0`, `Activo 1,2–1,6`, `Fuerza / ganar músculo 1,2–1,6`, `Pérdida de grasa 1,6–2,2`, `60+ 1,0–1,2` g/kg) + comidas 3/4/5; patrón D (`holentia:calculadora-proteina-diaria:draft:v1` con `{weight, unit, profile, meals}`, debounce 500 ms tras la primera edición).
- **Dominio**: g/kg con comentario de fuente (RDA IOM; 1,2–1,6 en actividad/fuerza —con la aclaración de que, bien repartida, suele bastar para ganar músculo salvo fisiculturismo—; 1,6–2,2 en déficit; 1,0–1,2 desde los 60 con PROT-AGE/ESPEN); peso válido 20–350 kg; reparto de 20–40 g por comida (ISSN 2017). La lógica vive en `lib/protein.ts` y la comparte la calculadora de calorías (tarjeta resumen), así los rangos no divergen.
- **Layout (corregido 18-Oct-2026)**: fila principal formulario (2/5) + columna derecha (3/5) con héroe compacto + **tarjeta de fuentes** que cierra la altura del formulario. Debajo, a ancho completo, una tarjeta de detalle con 4 stats («por kilo / rango diario / peso usado / por comida»), las 3 referencias y la nota legal. Se eliminó la pila de 5 tarjetas que dejaba el héroe de ~600 px semivacío. El empty state incluye 3 viñetas de lo que verá el usuario.
- **Resultado**: héroe `cuerpo` con gramos medios (count-up) + rango diario y perfil + reparto por comida; tarjeta de fuentes con 6 alimentos y enlace cruzado inline a `/calculadora-calorias`; desglose/referencias/legal full-width; cierre compacto con IMC, hidratación y pasos (3 enlaces).
- **Contraste**: héroe en negro sobre ámbar (§7), acentos `text-cuerpo-darkest` / `dark:text-cuerpo-light`; tarjetas `p-6`. En las tarjetas de perfil seleccionadas, hint y rango usan `text-gray-900` en ambos modos (sobre `bg-cuerpo-lighter`/`dark:bg-cuerpo-dark`); la nota legal en dark también `text-gray-900`.

### Calculadora de hidratación (18-Oct-2026, ref. `components/tools/hydration-calculator/`)

- **Título y accesibilidad**: H1 «Calculadora de Hidratación» (el slug y la metadata no cambian); inputs asociados con `label htmlFor`, botones de actividad/clima con `type="button"` y `aria-pressed`, sufijo kg dentro del campo.
- **Layout**: formulario (2/5) con actividad y clima en `grid-cols-2 sm:grid-cols-4` (4 chips compactos por fila) + columna derecha (3/5) con héroe y **tarjeta «De dónde sale tu agua»** (peso × 35 ml/kg, ajustes, total, −20% alimentos). El desglose evita el hueco del héroe y hace transparente el cálculo. Plan de 5 momentos y señales quedan a ancho completo.
- **Empty state**: ocupa el alto (`flex-1`), explica qué verá el usuario y añade 3 viñetas. El héroe solo se estira cuando hay resultado; no se usa `justify-between` para fingir altura.
- **Cierre**: `RelatedTools` compacto con acento `sky` (2–3 enlaces), nunca la rejilla de 4 tarjetas.

### Calculadora de calorías + proteína (18-Oct-2026, ref. `components/tools/calorie-calculator/`)

- **Corrección**: la guía decía «desde 0,8 g/kg es suficiente»; la RDA es un mínimo para adultos sedentarios, no una meta para gente activa. La tarjeta «Tu proteína diaria» muestra un rango orientativo según objetivo/actividad/edad, calculado con `lib/protein.ts` (misma fuente que la calculadora dedicada).
- **Selección de perfil**: bajar grasa → déficit (1,6–2,2); subir músculo → fuerza (1,2–1,6); mantener → sedentario (0,8–1,0), activo (1,2–1,6) o 60+ sedentario (1,0–1,2).
- **Diferenciación SEO**: se mantienen dos páginas con intenciones distintas (calorías/TDEE vs proteína). Calorías resume y enlaza; proteína detalla perfiles, reparto y fuentes. Fusionarlas alargaría una página y diluiría ambas queries.
- **UI**: panel `rounded-xl bg-white p-6`, icono `Utensils` sobre `bg-cuerpo-lighter`, rango `text-3xl tabular-nums`, línea de perfil/g/kg/4 comidas y enlace subrayado; tokens `cuerpo` y variantes dark. La guía «El equilibrio es la clave» enlaza **inline** proteína, pasos, hidratación y test de sueño; no lleva bloque de 4 tarjetas al cierre. El formulario de datos pasa a una columna en móvil (`sm:grid-cols-2`), evitando el sexo apretado en 320 px.
- **FAQ/SEO**: 7 preguntas (nueva «¿Cuánta proteína debo comer al día?»), metaDescription con «rango de proteína según tu objetivo» y `llms.txt` actualizado.

### Test de calidad del sueño (18-Oct-2026, ref. `components/tools/sleep-quality-test/`)

- **Flujo instrumentado** (mismo patrón que el GAD-7): intro con aviso educativo → 11 preguntas de una en una con auto-avance 300 ms y «← Atrás» → resultado; patrón D reanudable (`holentia:test-calidad-sueno:draft:v1`; a medias vuelve a la primera sin responder, completo abre el resultado). Las respuestas se guardan como **índice de opción**, no como valor: hay opciones con el mismo puntaje (causa del despertar) que deben distinguirse para personalizar los consejos.
- **Preguntas**: duración, latencia, despertares, volver a dormirse, causa (baño / ruido / estrés / dolor), sensación al despertar, ronquidos, cafeína, pantallas, regularidad y somnolencia diurna; 0–3 por pregunta, total 0–33 normalizado a 0–100 (más alto = mejor).
- **Bandas**: ≥80 buen descanso (emerald), 60–79 a mejorar (amber), 40–59 frágil (orange), <40 calidad baja (red); escala de 4 segmentos proporcionales (40/20/20/20) con marcador `left: calc(percent% − 2px)`.
- **Consejos personalizados** (`buildTips`): hasta 4 según respuestas (ventana de sueño, control de estímulo si tarda en dormirse, líquidos si se levanta al baño, mente si es estrés, ambiente, dolor, cafeína, pantallas, regularidad, somnolencia diurna); si todo va bien, tip de mantenimiento. **Bandera roja** (caja `AlertTriangle`): ronquido con pausas o somnolencia diurna con ronquido → consultar por posible apnea; el test no diagnostica.
- **Enlaces cruzados**: tarjeta «¿Y la calidad de tu sueño?» en el resultado de la calculadora del sueño; desde el test, enlaces a la calculadora de ciclos y a respiración 4-7-8.
- **Tokens**: sección `mente`; semáforos de banda en paleta Tailwind estándar (§7); héroe con `text-white` sólido; acciones con press feedback y `data-interactive`.

## 5. Modo oscuro

- Gestión con `next-themes` (`resolvedTheme`), clase `.dark` en `<html>`.
- **Anti-flash (FOUC)**: el `ThemeProvider` (`components/theme-provider.tsx`) se renderiza directo, **sin gate de `mounted`** — así next-themes inyecta su script inline en el HTML inicial y aplica el tema antes del primer pintado. Los gates locales `mounted` solo van en los componentes que leen el tema para su icono/estado (menú, header, charts).
- Chart.js: colores por `resolvedTheme` (memorizados en `useMemo`, ver `calculator-charts.tsx`).
- Regla: todo componente con color propio debe tener variante `dark:`. Probar ambos modos antes de mergear.

## 6. Movimiento (microanimaciones, 14-Oct-2026)

- **Entrada de tarjetas**: `animate-fadeIn` (0.5s) con `animationDelay` escalonado `index * 0.1s`.
- **Entrada de panel de resultado**: clase `animate-result-in` (keyframe `resultIn`, fade + sube 6px, 0.3s, `both`) en el contenedor del bloque de resultado. Se aplica al resultado de cada herramienta (también en los que siempre están visibles: monta 1 vez). Nunca framer-motion para esto — CSS puro.
- **Count-up de números hero**: hook `useCountUp(value, { duration?, decimals? })` (`hooks/use-count-up.ts`) → devuelve el número animado (rAF + ease-out, 500ms default) y el caller lo envuelve con su formateador (`formatCurrency`, `formatRD`, `toLocaleString…`). Reglas:
  - Solo heroes/totales (cuota, balance, factura, gasto, kcal, ml, meses, días, proyecciones); no animar filas secundarias.
  - Render inicial = valor final (sin hydration mismatch); anima **al cambiar el valor**, no en el primer mount.
  - En JSX condicional (tests con fases, ramas ternarias) usar el componente `<CountUp value format duration />` (`components/ui/count-up.tsx`) — así el hook nunca se llama condicionalmente.
  - `decimals: 0` default (enteros al volar); negativos soportados.
- **Press feedback**: `transition-[colors,transform] duration-150 active:scale-[0.97]` en botones sólidos, grupos de chips/filas seleccionables (opciones de quiz, tarjetas de técnica, modos segmentados, chips de rondas) y la base de `components/ui/button.tsx`, botones del shell, `chipClass()` de combustible/hidratación/riesgo y tarjetas de meta de calorías. Nunca escala mayor a `0.97`.
- **Haptics en móviles**: `useHapticFeedback` (`medium` en guardar/navegar, `light` en tabs/chips).
- **Guarda `prefers-reduced-motion`**: bloque global en `app/globals.css` (anula animaciones/transiciones CSS) + `useCountUp` salta al final vía `matchMedia`. Ambas vías son obligatorias: el CSS no corta un loop de rAF.
- **Prohibido (anti-slop)**: confetti al calcular, parallax, scroll-reveal por sección, animar todo el texto, framer-motion donde baste CSS.

## 7. Accesibilidad

- `aria-expanded` + `aria-controls` en acordeones/desplegables; `aria-hidden` en paneles colapsados.
- Opciones de quiz con `aria-pressed`; elementos navegables con `role="button" tabIndex` + Enter/Espacio.
- `data-interactive="true"` en todo elemento que deba ignorar el swipe navigation. El guard de `SectionSwipeNavigation` también excluye por tag (`input, button, a, select, textarea`) y exige dirección horizontal dominante; el de `TabSwipeNavigation` consume `data-interactive`. Mantener ambos: defensa en profundidad.
- Contraste: texto blanco solo sobre fondos con alpha efectivo ≥ ~0.75 sobre blanco (gradiente sólido) o sobre dark glass. Nunca blanco sobre glass claro.
- **Contraste cuerpo (ámbar `#ffa000` — caso especial, 17-Oct-2026)**: el ámbar es un color medio que no pasa AA para texto pequeño en fondos claros. Reglas por superficie:
  - Sobre blanco/gris-800: texto pequeño de acento = `text-cuerpo-darkest` (5.6:1) / `dark:text-cuerpo-light` (8.3:1). `text-cuerpo-dark` (#e65100) queda en 3.8:1 → solo iconos y bordes (≥3:1).
  - Sobre `bg-cuerpo-lighter` / `dark:bg-cuerpo-dark` (chips seleccionados, bloques de total, píldoras de nivel): texto = `text-gray-900` (12:1 / 4.6:1); iconos = `text-cuerpo-darkest` / `dark:text-white` (3.8:1). El borde de chip seleccionado usa `border-cuerpo-dark` (`border-cuerpo` se queda en 2:1 sobre blanco). Los textos secundarios dentro de `dark:bg-cuerpo-dark` (hints, rangos, notas legales) también van en `gray-900`: `gray-200/300` cae a 3.1/2.6 y falla AA a 12 px.
  - Nunca `/opacidad` sobre tokens de sección (clase muerta, §1) ni `text-white` sobre ámbar pequeño.
- **Excepción sky (hidratación)**: la calculadora de hidratación conserva `sky-600`/`dark:sky-400` en su contenido y en la barra compacta `RelatedTools` (`accent="sky"`) como semántica de agua, no como color de sección. No usar sky en las demás herramientas de cuerpo; su acento es `cuerpo`.
- **Contraste mente (azul `#1976d2`)**: `text-mente` sobre blanco pasa AA justo (4.6:1) para texto ≥14px; sobre `-lighter` el texto base (`#212529`, 10:1) es seguro, pero el **texto secundario nunca en `text-gray-500` sobre `bg-mente-lighter`** (2.7:1): en filas seleccionadas subir a `text-gray-700` / `dark:text-gray-200` (`dark:bg-mente-dark` + texto base queda en 4.67:1, el mínimo AA). `text-white/85` sobre `#1976d2` cae a ~3.8:1 → sobre el extremo claro del gradiente, `text-white` sólido (4.6:1).
- **Contraste relaciones (violeta `#7c3aed`)**: `text-relaciones` sobre blanco 5.7:1 y `text-relaciones-dark` 9:1 ✓. En oscuro, **`relaciones-light` (`#a78bfa`) sobre `gray-800` = 3.1:1 → solo iconos, barras y texto ≥20px (large)**; para texto pequeño/mediano, `dark:text-relaciones-lighter` (`#c4b5fd`, 5.0:1). Subtexto secundario sobre `bg-relaciones-lighter`/`dark:bg-relaciones-dark` (filas seleccionadas): `text-gray-700`/`dark:text-gray-200` (el `gray-500` cae a 2.6:1).
- **Caso finanzas (verde `#388e3c`)**: sobre blanco 4.1:1 → `text-finanzas` solo ≥20px o iconos; texto pequeño en claro → `text-finanzas-dark` (7.9:1). En oscuro, `finanzas-light` (`#66bb6a`) sobre `gray-800` = 3.6:1 → iconos/≥20px; texto pequeño → `dark:text-finanzas-lighter` (5.2:1). Blanco sobre `bg-finanzas` = 4.1:1 (falla a 16px): bandas de ticket y sólidos seleccionados usan `bg-finanzas-dark` (7.9:1 con blanco). Chips seleccionados: borde `finanzas`/`finanzas-light` + texto `finanzas-dark`/`finanzas-lighter`.
- **Caso finanzas, tanda 2 (crédito e inversión, 17-Oct-2026)**: en héroes degradados las etiquetas van `text-white` sólido en todas las ramas (verde y roja) y las cajas translúcidas internas → `bg-black/20` (con `bg-white/15–20` el texto blanco pequeño se queda en ≈3.8–4.1:1). Badge/acento celebratorio: nunca verdes Tailwind sueltos con blanco (`#22c55e` = 2.3:1) → `bg-finanzas-dark text-white dark:bg-finanzas-light dark:text-gray-900`. Acentos de pérdida en claro: `text-red-600` (12px) y `text-red-700` (valores 18px) — `red-500` queda en 2.9–3.3:1 sobre blanco/gris; `dark:text-red-400`. Sin estilos inline JS de color en iconos/texto (ignoran el modo oscuro): clases con tokens, y el hex crudo solo en Chart.js (on-token: `#388e3c`/`#66bb6a`/`#a5d6a7`; fuera `#6a9c77`/`#4caf50`).
- **Caso finanzas, tanda 3 (presupuesto y hábitos, 17-Oct-2026)**: salvia `dark:text-[#6a9c77]` (2.7:1) → `dark:text-[#a5d6a7]`; `text-finanzas` a 12px → `text-finanzas-dark`; verdes de ahorro `green-600` (3.3:1) → `green-700`; tabs/CTAs/badges restantes `bg-finanzas`+blanco → `bg-finanzas-dark` (7.9:1) con hover `finanzas-darkest`; héroes del test de riesgo con píldoras/cajas `bg-white/15` → `bg-black/20` y `opacity`/`white/85–90` → blanco sólido; puntos de paginación y acciones de fila como botones `h-10 w-10`/`h-11 w-11`; celdas de tabla con borrador local (§3.3).
- **Caso chrome global (superficies: tabs de sección, hubs, shell de herramienta, menú, footer, informativas; 17-Oct-2026)**: en textos de 12–14px del armazón la base de sección no siempre pasa → tiers en claro: tabs activas (cuerpo `-darkest` 3.8→5.6; finanzas `-dark` 4.1→7.9), botón «Ver todas» del hub, botones del shell de herramienta, crédito del footer y ítem activo del menú (mente sobre `gray-100` 4.2→`mente-dark`; en oscuro `relaciones` sobre `gray-800` 2.6→`relaciones-light`); H1 del shell en cuerpo `-darkest`; categoría de ToolCard a `text-white` sólido (el `/85` sobre `from-{s}` = 3.4–3.8); FAQ hover con los mismos tiers; `hover:bg-red-500` del borrado total (3.8 con blanco) → `hover:bg-red-600` (4.8); `error.tsx` sin `bg-blue-600` (identidad monocroma); área táctil en enlaces de texto (nav del footer `py-1.5`, crédito `py-1`, «Volver» `py-3` = 44px) y tabs de sección a `py-2.5` (40px); descripción del shell con medida `max-w-2xl`.
