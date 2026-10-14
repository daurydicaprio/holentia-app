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
│   ├── [herramienta]/        # Páginas individuales para cada herramienta
│   ├── que-es-holentia/      # Página informativa sobre Holentia
│   ├── aviso-legal/          # Página con el aviso legal
│   ├── politica-cookies/     # Página con la política de cookies
│   ├── ayuda/                # Centro de ayuda con FAQs
│   ├── apoyar/               # Página de donaciones y apoyo
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página principal (home)
├── components/               # Componentes reutilizables
│   ├── common/               # Componentes comunes
│   │   ├── header/           # Componentes de encabezado
│   │   ├── footer/           # Componente de pie de página
│   │   ├── logo/             # Componente de logo con efectos
│   │   ├── mobile-fab/       # Wrapper de ScrollToTop (solo móvil) para secciones
│   │   ├── menu-button/      # Botón de menú desplegable
│   │   ├── scroll-to-top/    # Botón para volver arriba
│   │   └── tab-swipe-navigation/ # Navegación por gestos para pestañas
│   ├── sections/             # Componentes específicos por sección
│   │   ├── section-header.tsx # Encabezado de sección
│   │   ├── section-tabs.tsx   # Pestañas de navegación entre secciones
│   │   ├── section-swipe-navigation.tsx # Navegación por gestos
│   │   ├── tool-card.tsx      # Tarjeta de herramienta
│   │   └── tools-grid.tsx     # Cuadrícula de herramientas
│   ├── tools/                # Componentes específicos de herramientas
│   │   ├── budget-simulator/  # Simulador de presupuesto
│   │   ├── compound-interest/ # Calculadora de interés compuesto
│   │   ├── loan-calculator/   # Calculadora de préstamos
│   │   ├── guided-journal/    # Diario guiado (Mente)
│   │   ├── love-languages-test/ # Test de lenguajes del amor (Relaciones)
│   │   ├── hydration-calculator/ # Calculadora de hidratación (Cuerpo)
│   │   ├── calorie-calculator/  # Calculadora de calorías (Cuerpo)
│   │   ├── electricity-calculator/ # Consumo eléctrico (Finanzas)
│   │   ├── fuel-expense-calculator/ # Gasto de combustible (Finanzas)
│   │   ├── card-cutoff/         # Corte y vencimiento tarjeta (Finanzas)
│   │   ├── card-interest/       # Interés de tarjeta (Finanzas)
│   │   ├── risk-profile-test/   # Test de perfil de riesgo (Finanzas)
│   │   └── glossary/            # Glosario financiero (Finanzas)
│   ├── ui/                   # Componentes de interfaz (botones, tarjetas, etc.)
│   └── tool-seo/             # Shell server de herramientas: tool-page-shell, json-ld, tool-faq
├── hooks/                    # Custom hooks
│   ├── use-budget-simulator.ts    # Lógica para el simulador de presupuesto
│   ├── use-compound-interest-calculator.ts # Lógica para calculadora de interés compuesto
│   ├── use-haptic-feedback.ts     # Hook para feedback háptico
│   ├── use-loan-calculator.ts     # Lógica para calculadora de préstamos
│   └── use-media-query.ts         # Hook para consultas de medios
├── lib/                      # Utilidades y funciones
│   ├── data.ts               # Datos de secciones y herramientas
│   ├── seo.ts                # Metadata + JSON-LD (WebApplication, Breadcrumb, FAQPage, sitemap)
│   ├── storage.ts            # Helper localStorage namespaced holentia:*
│   └── utils.ts              # Funciones de utilidad
├── types/                    # Definiciones de tipos
│   └── index.ts              # Tipos principales
├── app/sitemap.ts            # Sitemap XML (23 URLs)
├── app/robots.ts             # Robots.txt
├── app/error.tsx             # Página de error de ruta
├── app/global-error.tsx      # Error global (raíz)
├── app/icon.svg              # Favicon (convención App Router)
├── app/apple-icon.png        # Icono touch 180x180
└── public/                   # Archivos estáticos (llms.txt, assets)
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
- **Optimización Táctil**: Mejoras específicas para la interacción en dispositivos táctiles
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

- **Páginas de herramienta server-rendered**: cada herramienta usa `ToolPageShell` (server component) con H1, descripción y breadcrumb en el HTML inicial; la interactividad vive dentro como client components
- **Metadata por página**: `generateMetadata` en las 13 herramientas, las 4 secciones, el home y las páginas informativas (title, description, canonical, openGraph, twitter) con template global `{página} | HOLENTIA` en `app/layout.tsx`
- **Datos estructurados JSON-LD**: `WebApplication` + `BreadcrumbList` + `FAQPage` por herramienta, `CollectionPage` + `BreadcrumbList` por sección, `WebSite` + `Organization` en el home, `FAQPage` en Ayuda
- **FAQ visible en el HTML inicial** de las 13 herramientas (no escondida tras hydration gates)
- **`app/sitemap.ts`**: 23 URLs (home, 4 secciones, 13 herramientas, 5 informativas)
- **`app/robots.ts`**: permite todo y apunta al sitemap
- **`public/llms.txt`**: índice legible por LLMs con las 13 herramientas y sus fórmulas
- **Enlaces a herramientas en el HTML inicial** de las secciones (tabs y tarjetas server-rendered, sin `mounted` guard)
- **Errores**: `app/error.tsx` + `app/global-error.tsx`; `app/ayuda/loading.tsx` con skeleton real

## Secciones

La aplicación está dividida en cuatro secciones principales, cada una con su paleta de colores distintiva:

1. **Mente** (Azul: `#1976d2`, `#0d47a1`): Herramientas para el bienestar mental y emocional
2. **Relaciones** (Violeta: `#7c3aed`, `#5b21b6`): Herramientas para mejorar vínculos interpersonales
3. **Cuerpo** (Ámbar: `#ffa000`, `#e65100`): Herramientas para la salud física y actividad
4. **Finanzas** (Verde: `#388e3c`, `#1b5e20`): Herramientas para la gestión financiera y económica

## Herramientas Implementadas

### Mente
- **Diario Guiado**: Herramienta de reflexión diaria con preguntas estructuradas para el autoconocimiento y bienestar emocional

### Relaciones
- **Test de Lenguajes del Amor**: Test interactivo para descubrir tu lenguaje del amor principal y mejorar tus relaciones

### Cuerpo
- **Calculadora de Hidratación**: Calcula tu ingesta diaria de agua recomendada según tu peso, actividad y clima
- **Calculadora de Calorías**: Estima tus calorías diarias para mantener, bajar o subir de peso

### Finanzas
- **Crear presupuesto personal**: Herramienta para gestionar ingresos y gastos con visualización de datos
- **Calculadora de interés compuesto**: Visualización del crecimiento de ahorros con capacidad para guardar y comparar simulaciones
- **Calculadora de préstamo**: Estrategia para eliminar deudas con capacidad para guardar y comparar simulaciones
- **Calculadora consumo eléctrico**: Estima tu factura por kWh (tarifa RD) con subsidio aproximado
- **Calculadora gasto combustible**: Estima tu gasto de gasolina por día, semana, mes y año según tu ruta, vehículo y precio del litro
- **Corte y vencimiento tarjeta**: Descubre a qué corte entra tu compra y cuándo la pagas
- **Calculadora interés tarjeta**: Mide cuánto te cuesta financiar el saldo de tu tarjeta y en cuántos meses liquidas
- **Test de perfil de riesgo**: 12 preguntas honestas para saber en qué nivel invertir (resultado en pasos: título con tu perfil y "Quédate en el nivel N", arco de niveles navegable, fondo de emergencia con sugerencia de reparto por montos y gráfico de ahorro con comparación AFI, tasas de referencia editables por instrumento, distribución que respeta los mínimos de cada instrumento y proyección ponderada por tasa)
- **Glosario financiero**: Términos de ahorro, crédito, intereses, fondos, bolsa y depósitos explicados con ejemplos

## Páginas Informativas

- **Home**: Página de inicio con introducción elegante y acceso directo a las secciones
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
- Los datos de herramientas se guardan solo en localStorage del navegador, bajo claves `holentia:{herramienta}:{draft|simulations|entries}:v1`
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

**Última actualización**: Octubre 2026 (13 herramientas, SEO server-rendered con metadata/JSON-LD/sitemap, build estricto, lint limpio, local-first, design system + skills de agente en `.opencode/skills/`)
