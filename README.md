# HOLENTIA

HOLENTIA es una aplicación web moderna que ofrece herramientas para el bienestar integral en cuatro áreas clave: mente, relaciones, cuerpo y finanzas. Incluye calculadoras, simuladores, test interactivos y más, con una interfaz intuitiva y adaptable a diferentes dispositivos.

## Visión General

HOLENTIA busca proporcionar recursos accesibles para mejorar el bienestar integral de las personas a través de herramientas digitales prácticas y fáciles de usar. La aplicación está diseñada con un enfoque en la experiencia de usuario, accesibilidad y rendimiento.

## Estructura del Proyecto

El proyecto está organizado siguiendo la estructura de Next.js App Router:

```
holentia/
├── app/                      # Directorio principal de Next.js App Router
│   ├── mente/                # Página de la sección mente
│   ├── relaciones/           # Página de la sección relaciones
│   ├── cuerpo/               # Página de la sección cuerpo
│   ├── finanzas/             # Página de la sección finanzas
│   ├── {slug}/               # Páginas de las 32 herramientas (una carpeta por slug)
│   ├── que-es-holentia/      # Página informativa sobre Holentia
│   ├── aviso-legal/          # Página con el aviso legal
│   ├── politica-cookies/     # Página con la política de cookies
│   ├── ayuda/                # Centro de ayuda con FAQs
│   ├── apoyar/               # Página de donaciones y apoyo
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página principal (home)
├── components/               # Componentes reutilizables
│   ├── common/               # Chrome global: header, footer, logo, brand-dots, menu-button,
│   │                         # mobile-fab, scroll-to-top, tab-swipe-navigation, clear-all-data
│   ├── sections/             # Hub de sección: section-page, section-tabs, section-header,
│   │                         # section-swipe-navigation, tool-card, tools-grid
│   ├── tools/                # 32 componentes client de herramientas (+ subcomponentes y `related-tools/`)
│   ├── tool-seo/             # Shell server: tool-page-shell, tool-faq (acordeón), json-ld
│   ├── seo/                  # og-template (plantilla compartida de las imágenes OG)
│   ├── ui/                   # Primitivas de interfaz (button, input, slider, count-up)
│   └── theme-provider.tsx    # next-themes sin gate de mounted (anti-FOUC)
├── hooks/                    # Custom hooks
│                             # Lógica por herramienta (budget, compound, loan) + use-count-up,
│                             # use-haptic-feedback y use-media-query
├── lib/                      # Utilidades y funciones
│   ├── data.ts               # Catálogo de secciones y herramientas (SSOT)
│   ├── seo.ts                # Metadata + JSON-LD (WebApplication, Breadcrumb, FAQPage, sitemap)
│   ├── storage.ts            # Helper localStorage namespaced holentia:*
│   ├── protein.ts            # Perfiles y rangos de proteína compartidos (g/kg)
│   ├── format.ts             # formatDOP (es-DO/DOP) — fuente única de moneda
│   └── utils.ts              # Funciones de utilidad
├── types/                    # Definiciones de tipos
│   └── index.ts              # Tipos principales
├── app/sitemap.ts            # Sitemap XML (43 URLs)
├── app/robots.ts             # Robots.txt
├── app/manifest.ts           # Manifest PWA (iconos 192/512/maskable)
├── app/error.tsx             # Página de error de ruta
├── app/global-error.tsx      # Error global (raíz)
├── app/icon.svg              # Favicon (convención App Router)
├── app/apple-icon.png        # Icono touch 180x180
└── public/                   # Archivos estáticos (llms.txt, iconos PWA, assets)
```

## Características Principales

- **Diseño Responsive**: Adaptado para dispositivos móviles y escritorio
- **Modo Oscuro**: Activación automática según preferencias del sistema
- **Estructura Modular**: Organización por secciones y herramientas
- **URLs Amigables**: Rutas simples y descriptivas
- **Efecto Aura**: Efecto visual detrás del logo según la sección
- **Feedback Háptico**: Vibraciones sutiles en acciones en dispositivos móviles
- **Navegación por Gestos**: Deslizar para cambiar entre secciones y pestañas en móviles
- **Animaciones y Transiciones**: Efectos visuales para mejorar la experiencia de usuario
- **Tarjetas Interactivas**: Efectos 3D y animaciones en tarjetas de herramientas
- **Adaptación Contextual**: Colores y estilos adaptados según la sección actual
- **Formateo Numérico**: Visualización de números con separadores de miles para mejor legibilidad
- **Guardado de Simulaciones**: Capacidad para guardar y comparar diferentes escenarios en calculadoras
- **Optimización Táctil**: Controles ≥40px y acciones táctiles ≥44px; inputs ≥16px (sin zoom en iOS)
- **Contraste AA**: texto y controles con tiers por sección en claro/oscuro, revisados herramienta por herramienta
- **Rendimiento**: gráficos y paneles pesados cargados bajo demanda (Chart.js nunca en el bundle inicial; herramientas ~≤150 kB First Load)
- **Privacidad Total**: No se recopilan datos personales, todo se procesa localmente
- **Diseño Minimalista**: Interfaz limpia, moderna y atractiva con gradientes sutiles

## Tecnologías Utilizadas

- **Next.js 15.5.26**: Framework React con App Router
- **TypeScript**: Para tipado estático
- **Tailwind CSS**: Para estilos
- **next-themes**: Para gestionar el modo oscuro
- **Framer Motion**: Para animaciones suaves
- **Lucide React**: Para iconografía consistente
- **Chart.js**: Para visualizaciones de datos en herramientas financieras

## SEO y Rendimiento

- **Páginas de herramienta server-rendered**: cada herramienta usa `ToolPageShell` (server component) con H1, descripción y FAQ en el HTML inicial; la interactividad vive dentro como client components
- **Metadata por página**: `generateMetadata` en las 32 herramientas, las 4 secciones, el home, el directorio y las páginas informativas (title, description, canonical, openGraph, twitter) con template global `{página} | HOLENTIA` en `app/layout.tsx`
- **Datos estructurados JSON-LD**: `WebApplication` + `BreadcrumbList` + `FAQPage` por herramienta, `CollectionPage` + `BreadcrumbList` por sección, `WebSite` + `Organization` en el home, `FAQPage` en Ayuda
- **FAQ visible en el HTML inicial** de las 32 herramientas (acordeón, no escondido tras hydration gates) y de `/ayuda` — los hubs de sección no llevan FAQ
- **`app/sitemap.ts`**: 43 URLs (home, 4 secciones, directorio, 32 herramientas, 5 informativas)
- **`app/robots.ts`**: permite todo y apunta al sitemap
- **`public/llms.txt`**: índice legible por LLMs con las 32 herramientas y sus fórmulas
- **Enlaces a herramientas en el HTML inicial** de las secciones (tabs y tarjetas server-rendered, sin `mounted` guard)
- **Errores**: `app/error.tsx` + `app/global-error.tsx`; `app/ayuda/loading.tsx` con skeleton real

## Secciones

La aplicación está dividida en cuatro secciones principales, cada una con su paleta de colores distintiva:

1. **Mente** (Azul: `#1976d2`, `#0d47a1`): Herramientas para el bienestar mental y emocional
2. **Relaciones** (Violeta: `#7c3aed`, `#5b21b6`): Herramientas para mejorar vínculos interpersonales
3. **Cuerpo** (Ámbar: `#ffa000`, `#e65100`): Herramientas para la salud física y actividad
4. **Finanzas** (Verde: `#388e3c`, `#1b5e20`): Herramientas para la gestión financiera y económica

## Herramientas Implementadas

### Mente (6)
- **Diario Guiado**: reflexión diaria con preguntas estructuradas, ánimo, racha y borrador autoguardado
- **Seguimiento de Hábitos**: crea hábitos, marca tu día, sigue tu semana y tu racha con datos locales
- **Respiración guiada**: ejercicios 4-7-8, caja y calma con círculo en tiempo real, rondas y haptics
- **Test de ansiedad GAD-7**: cribado de 7 preguntas con puntaje 0–21 y orientación por nivel
- **Calculadora del sueño**: hora ideal para acostarte o despertarte según los ciclos de 90 minutos
- **Test de calidad del sueño**: 11 preguntas sobre tu descanso con puntuación y recomendaciones

### Relaciones (4)
- **Test de Lenguajes del Amor**: descubre tu lenguaje principal entre los 5 y mejora tus vínculos
- **Test de estilo de apego**: 12 afirmaciones → seguro, ansioso, evitativo o temeroso, con consejos
- **Preguntas profundas**: 45 preguntas para conversaciones significativas (pareja, familia y amigos)
- **Diario para parejas**: una pregunta diaria para responder juntos, con historial y racha

### Cuerpo (5)
- **Calculadora de Calorías**: TDEE (Mifflin-St Jeor) y objetivos bajar grasa / mantener / subir
- **Calculadora de Hidratación**: agua diaria según peso, actividad y clima (EFSA/NASEM)
- **Calculadora de Proteína**: rango diario 0,8–2,2 g/kg según objetivo, peso y contexto
- **Plan de pasos 5-10-20**: objetivo diario, plan por bloques de minutos y registro con racha
- **Calculadora de IMC**: peso, estatura, banda OMS, rango saludable y contexto honesto

### Finanzas (17)
- **Crear presupuesto personal**: ingresos y gastos con tablas editables y visualización
- **Calculadora de interés compuesto**: rendimiento de inversiones con aportes, inflación y gráfico
- **Calculadora de préstamo**: cuota mensual, interés total y tabla de amortización
- **Calculadora consumo eléctrico**: factura de luz por kWh (tarifa RD) con subsidio estimado
- **Calculadora gasto combustible**: gasto por día/semana/mes/año según ruta, vehículo y precio
- **Corte y vencimiento tarjeta**: a qué corte entra tu compra y cuándo la pagas
- **Calculadora interés tarjeta**: costo de financiar el saldo y meses para liquidarlo
- **Test de perfil de riesgo**: 12 preguntas, nivel de inversor, colchón y proyección de ahorro
- **Glosario financiero**: términos de ahorro, crédito, intereses, fondos, bolsa y depósitos
- **Tracker de gastos hormiga**: gastos pequeños anualizados con proporción y tips de ahorro
- **Calculadora de aguinaldo**: doble sueldo de diciembre, proporcional y exento de ISR/TSS
- **Calculadora de sueldo neto**: de bruto a neto con TSS (SFS/AFP) e ISR por tramos
- **Calculadora de prestaciones laborales**: liquidación en RD: cesantía, preaviso, vacaciones y Navidad (Código de Trabajo)
- **Calculadora de ITBIS**: agrega o quita el 18% (y 16% reducido) con base, impuesto y total
- **Calculadora de certificado financiero**: interés, retención del 10% y ganancia neta
- **Planificador de ahorros**: cuándo llegas a tu meta y cuánto aportar al mes
- **Planificador de compras**: comprar hoy vs. esperar e invertir el precio (paciencia)

## Páginas Informativas

- **Home**: Página de inicio con introducción elegante y acceso directo a las secciones
- **Directorio de herramientas**: índice completo de las 32 herramientas por sección (enlazado desde el footer)
- **¿Qué es Holentia?**: Información detallada sobre la misión, valores y características de la plataforma con diseño atractivo y moderno
- **Aviso Legal**: Términos de uso, propiedad intelectual y responsabilidades con presentación clara y profesional
- **Política de Cookies**: Explicación detallada del uso mínimo de cookies y compromiso con la privacidad
- **Ayuda**: Centro de ayuda con FAQs interactivos y guías de usuario
- **Apoyar**: Página de donaciones con opciones para contribuir al proyecto

## Directrices de Diseño

La fuente única de verdad es **`design.md`** (paleta completa, tipografía Inter, iconos `lucide-react`, espaciado, recetas de componente y contraste). Resumen canónico:

- **Paleta por sección**: Mente `#1976d2` · Relaciones `#7c3aed` · Cuerpo `#ffa000` · Finanzas `#388e3c` (+ escalas `dark/light/lighter/darkest`). Nunca hex suelto: tokens Tailwind (`text-finanzas`, `bg-mente-light`) — la clave `DEFAULT` va **sin sufijo** (`bg-mente`, no `bg-mente-DEFAULT`).
- **Tipografía**: Inter (única), jerarquía `h1` color de sección → `h2` → `h3`, gradientes de texto solo en H1 de home/hub.
- **Iconos**: solo `lucide-react`; por sección `Brain`/`Heart`/`Activity`/`Wallet`; vocabulario de acciones compartido en `design.md` §2b.
- **Tarjetas**: gradiente `from-{s} to-{s}-dark` en claro (texto blanco; cuerpo negro) · glass `dark:bg-{s}-glass` en oscuro. Todo componente con color necesita su variante `dark:`.
- **Hovers**: relleno + texto en ambos modos con contraste AA (recetas en `design.md` §4).

## Agentes y skills

- **`AGENTS.md`**: reglas de oro para agentes (rama `dev`, verificación `tsc+lint+build`, privacidad, server-first). Cargado por `opencode.json`.
- **Skills** en `.opencode/skills/`: `create-tool` (herramienta nueva de punta a punta), `section-ui` (colores/tipografía/iconos/dark), `tool-persistence` (localStorage patrones D/S/E), `chart-chartsjs` (teming de gráficos).
- **Mantenimiento**: cada modificación de UI o proceso actualiza `design.md` y la skill afectada en el mismo commit.

## Privacidad y Datos

**HOLENTIA no recopila, almacena ni procesa información personal de los usuarios.** Todos los datos se procesan localmente en el dispositivo del usuario:

- No utilizamos cookies de seguimiento o análisis
- No compartimos información con terceros
- No creamos perfiles de usuario
- Los datos de herramientas se guardan solo en localStorage del navegador, bajo claves `holentia:{herramienta}:{draft|simulations|entries}:v1` (35 claves activas, listadas en la Política de Cookies)
- Cada herramienta tiene botón «Borrar mis datos» y Ayuda permite borrarlo todo
- No hay servidores backend que almacenen información personal
- Solo usamos cookies técnicas esenciales (preferencias de tema)

## Desarrollo

```bash
# Instalar dependencias (pnpm)
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Lint (ESLint, .eslintrc.json con next/core-web-vitals)
pnpm lint

# Typecheck
pnpm exec tsc --noEmit

# Construir para producción
pnpm build

# Auditoría SEO/GEO + estructura a11y (usa el build; arranca `next start` solo)
pnpm audit:seo

# Iniciar en modo producción
pnpm start
```

## Contribución

Para contribuir al proyecto:

1. Seguir **`AGENTS.md`** (reglas de oro) y la skill correspondiente de `.opencode/skills/` según la tarea
2. Mantener la separación de lógica e interfaz
3. Asegurar compatibilidad con modo oscuro
4. Optimizar para dispositivos móviles y escritorio
5. Implementar feedback háptico en interacciones importantes
6. Probar en diferentes navegadores y dispositivos
7. Añadir atributo `data-interactive="true"` a elementos interactivos
8. Respetar la privacidad del usuario: no añadir tracking ni recopilación de datos
9. Mantener diseño minimalista y coherente con la esencia de la aplicación
10. Usar gradientes sutiles y efectos visuales con moderación
11. **Al cambiar UI o procesos: actualizar `design.md` y la skill afectada en el mismo commit**
12. Verificar `pnpm exec tsc --noEmit && pnpm lint && pnpm build` antes de cada push (rama `dev`)

## Licencia

Este proyecto es propiedad de Daury DiCaprio. Todos los derechos reservados.

---

**Última actualización**: Octubre 2026 (32 herramientas y 43 URLs, seguimiento de hábitos + calculadora de proteína + test de calidad del sueño, directorio `/herramientas` + calculadora de prestaciones, pase UI/UX móvil completo —contraste AA, tap targets, inputs sin zoom iOS—, SEO server-rendered con metadata/JSON-LD/sitemap, build estricto, lint limpio, local-first, design system + skills de agente en `.opencode/skills/`)
