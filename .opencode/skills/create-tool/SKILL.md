---
name: create-tool
description: Use when creating a new HOLENTIA tool (herramienta nueva, nueva calculadora, nuevo test, añadir herramienta, activar tarjeta próximamente) — full end-to-end recipe covering lib/data.ts registration, app/{slug}/page.tsx template, ToolPageShell, sitemap, llms.txt, opengraph-image and verification commands.
---

# Crear una herramienta nueva

Receta canónica de punta a punta. Complementos: skill `section-ui` (UI/colores), `tool-persistence` (si guarda datos), `chart-chartsjs` (si tiene gráficos), **`seo-geo` (metadata, OG image, llms.txt, checklist SEO/GEO — OBLIGATORIO)** y **`seo-geo-audit` (auditoría final de 16 puntos — OBLIGATORIA antes del push)**. Fuente de verdad de estilos: `design.md`.

## 1. Elegir slug y sección

- Slug kebab-case en español, descriptivo: `calculadora-interes-compuesto`, `test-perfil-riesgo`.
- Sección (`SectionType`): `mente` | `relaciones` | `cuerpo` | `finanzas`.

## 2. Registrar en el catálogo — `lib/data.ts`

En `sectionsData[seccion].cards` crear la tarjeta (o activar una existente poniendo `isAvailable: true`):

```ts
{
  id: "mi-herramienta",
  title: "Título visible",
  description: "Una línea corta para la tarjeta.",
  slug: "mi-herramienta",
  isAvailable: true,          // false = "Próximamente" en el grid
  category: "finanzas",        // igual a la sección padre
  metaTitle: "Calculadora de algo",            // ≤60 chars, keyword primero (SEO)
  metaDescription: "Descripción de 120 a 155 caracteres con keyword, beneficio y gancho para el snippet de Google.", // OBLIGATORIA
}
```

Con `isAvailable: true`, `app/sitemap.ts` la incluye **automáticamente** (deriva de `sectionsData`); no tocar sitemap. `toolMetadata()` usa `metaTitle`/`metaDescription` (con fallback al blurb — no depender del fallback).

## 3. Componente client — `components/tools/{kebab}/`

- Directorio con el componente principal (ej. `compound-interest-calculator.tsx`) + subcomponentes.
- `"use client"` solo donde haya interactividad.
- Colores SIEMPRE con tokens de sección (skill `section-ui`). Iconos: `lucide-react` con el vocabulario de `design.md` §Iconos.
- **Escala unificada obligatoria** (`design.md` §3 / skill `section-ui` §3b): controles `rounded-md` · recuadros internos `rounded-lg p-4` · tarjetas/tablas/modales `rounded-xl p-5` · paneles mayores `rounded-2xl p-6 sm:p-8` · foco `focus:border-transparent focus:ring-2 focus:ring-{s}` (nunca hex ni `ring-green-500`). Si la herramienta guarda drafts: patrón D; si guarda listas de simulaciones: patrón S (skill `tool-persistence`).
- Copiar estructura visual de la herramienta más parecida ya existente (formulario→`compound-interest` · test→`risk-profile-test` · lista+buscador→`glosario`).
- Lógica de cálculo en `hooks/use-{kebab}.ts` cuando sea reusable/pura (patrones D/S/E: skill `tool-persistence`).
- Elementos interactivos: `data-interactive="true"`; acciones importantes con `useHapticFeedback`.
- Resultado hero numérico: `animate-result-in` + `aria-live="polite"` en el contenedor + `useCountUp` (o `<CountUp>` en JSX condicional) sobre el valor formateado — receta `design.md` §6 / skill `section-ui` §8.
- **Moneda**: `formatDOP` de `lib/format.ts` (es-DO/DOP) — nunca `es-MX`/`MXN` ni `$` pelado.
- **Mobile**: inputs con `text-base md:text-sm` (evita el zoom de iOS) + `inputMode` en numéricos; tap targets ≥44px; tablas en `overflow-x-auto`; leyenda de doughnut `position: isMobile ? "bottom" : "left"`. Detalle: `design.md` §3.7.

## 4. Página — `app/{slug}/page.tsx` (server component)

Plantilla canónica (referencia: `app/calculadora-interes-compuesto/page.tsx`):

```tsx
import { notFound } from "next/navigation"
import { findToolCard, toolMetadata } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { MiHerramienta } from "@/components/tools/mi-herramienta/mi-herramienta"

const section = "finanzas"
const toolSlug = "mi-herramienta"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

export default function MiHerramientaPage() {
  const toolData = findToolCard(section, toolSlug)
  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData}>
      <MiHerramienta />
    </ToolPageShell>
  )
}
```

- `ToolPageShell` ya renderiza: H1 + descripción + underline + botones Volver/Donación + FAQ acordeón + JSON-LD (WebApplication + Breadcrumb + FAQPage). **No duplicar nada de eso dentro del componente.**
- Nombres de función/ruta en kebab→PascalCase (`CalculadoraInteresCompuestoPage`).

## 5. FAQ (obligatorio, SEO)

- **5–6 preguntas** en español con respuestas útiles y reales (no relleno); responder en 1–3 frases (bueno para GEO). Renderizadas en `app/{slug}/page.tsx` como `const faq: FaqItem[]` + prop `faq={faq}` al shell (acordeón con hover por sección vía `tool-faq.tsx`).
- **Siempre incluir** la de privacidad: «¿Guardan ustedes mis datos?» → que mencione `localStorage` y `holentia:{slug}:draft:v1` (o la clave que uses).
- El contenido queda en el HTML inicial aunque el acordeón esté cerrado (no ocultarlo con JS).
- **Los hubs de sección NO llevan FAQ** (corrección 14-Oct-2026): el FAQ vive en cada herramienta y en `/ayuda`. No reintroducir `SectionData.faq`.

## 6. Persistencia (si aplica)

- Claves solo vía `lib/storage.ts` (`draftKey(slug)`, `simulationsKey(slug)`) → `holentia:{slug}:{draft|simulations}:v1`.
- Añadir la clave a la tabla de `app/politica-cookies/page.tsx`.
- Si hay botón «Borrar mis datos» global, asegurar que `storageClearAll()` cubre las claves (prefijo `holentia:` ✓).

## 7. Doc externo + imagen social — `public/llms.txt` y `opengraph-image`

- Añadir la línea de la herramienta bajo `## Herramientas` en `public/llms.txt` y actualizar el recuento (ver skill `seo-geo` §4).
- **Crear `app/{slug}/opengraph-image.tsx`** (imagen social 1200×630 para compartir en redes/mensajeros): copiar otra herramienta y cambiar `title`/`subtitle`/`alt`; usa la plantilla `ogTemplate` de `components/seo/og-template.tsx` (ver skill `seo-geo` §2). Sin esto, WhatsApp/X muestran la imagen genérica de la raíz.

## 8. Verificación (los tres en verde antes de push)

```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm build
```

Smoke SEO (skill `seo-geo` §6–7): en `.next/server/app/{slug}.html` comprobar `<title>`, `meta description`, `canonical`, `og:image`, `twitter:card` y JSON-LD con FAQPage. Y **smoke runtime del OG** (la URL en el HTML no garantiza que la imagen se genere): `pnpm start` + `curl -o /dev/null -w '%{http_code} %{content_type}' localhost:3000/{slug}/opengraph-image` → `200 image/png`.

**Auditoría final de 16 puntos (obligatoria)**: cargar la skill `seo-geo-audit` y pasar su checklist §1 + barrido §2 sobre la herramienta nueva antes del push; ninguna herramienta se considera terminada sin los 16 puntos en PASS (y anotar la fila en su registro §4).

## 9. Mantenimiento de docs

- Si la herramienta introdujo un **patrón UI nuevo**, documentarlo en `design.md` §4 Recetas y, si cambia el proceso, actualizar esta skill (regla en `AGENTS.md`).
- Commits en español, en `dev`.
