---
name: create-tool
description: Use when creating a new HOLENTIA tool (herramienta nueva, nueva calculadora, nuevo test, añadir herramienta, activar tarjeta próximamente) — full end-to-end recipe covering lib/data.ts registration, app/{slug}/page.tsx template, ToolPageShell, FAQ, sitemap, llms.txt and verification commands.
---

# Crear una herramienta nueva

Receta canónica de punta a punta. Complementos: skill `section-ui` (UI/colores), `tool-persistence` (si guarda datos), `chart-chartsjs` (si tiene gráficos). Fuente de verdad de estilos: `design.md`.

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
}
```

Con `isAvailable: true`, `app/sitemap.ts` la incluye **automáticamente** (deriva de `sectionsData`); no tocar sitemap.

## 3. Componente client — `components/tools/{kebab}/`

- Directorio con el componente principal (ej. `compound-interest-calculator.tsx`) + subcomponentes.
- `"use client"` solo donde haya interactividad.
- Colores SIEMPRE con tokens de sección (skill `section-ui`). Iconos: `lucide-react` con el vocabulario de `design.md` §Iconos.
- Lógica de cálculo en `hooks/use-{kebab}.ts` cuando sea reusable/pura (patrones D/S/E: skill `tool-persistence`).
- Elementos interactivos: `data-interactive="true"`; acciones importantes con `useHapticFeedback`.

## 4. Página — `app/{slug}/page.tsx` (server component)

Plantilla canónica (referencia: `app/calculadora-interes-compuesto/page.tsx`):

```tsx
import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { MiHerramienta } from "@/components/tools/mi-herramienta/mi-herramienta"

const section = "finanzas"
const toolSlug = "mi-herramienta"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  { question: "…", answer: "…" }, // 4-6 preguntas reales
  // OBLIGATORIA: privacidad — ver paso 5
]

export default function MiHerramientaPage() {
  const toolData = findToolCard(section, toolSlug)
  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <MiHerramienta />
    </ToolPageShell>
  )
}
```

- `ToolPageShell` ya renderiza: H1 + descripción + underline + botones Volver/Donación + FAQ acordeón + JSON-LD (WebApplication + Breadcrumb + FAQPage). **No duplicar nada de eso dentro del componente.**
- Nombres de función/ruta en kebab→PascalCase (`CalculadoraInteresCompuestoPage`).

## 5. FAQ (obligatorio, SEO)

- 4–6 preguntas en español con respuestas útiles y reales (no relleno).
- **Siempre incluir** la de privacidad: «¿Guardan ustedes mis datos?» → que mencione `localStorage` y `holentia:{slug}:draft:v1` (o la clave que uses).
- El contenido queda en el HTML inicial aunque el acordeón esté cerrado (no ocultarlo con JS).

## 6. Persistencia (si aplica)

- Claves solo vía `lib/storage.ts` (`draftKey(slug)`, `simulationsKey(slug)`) → `holentia:{slug}:{draft|simulations}:v1`.
- Añadir la clave a la tabla de `app/politica-cookies/page.tsx`.
- Si hay botón «Borrar mis datos» global, asegurar que `storageClearAll()` cubre las claves (prefijo `holentia:` ✓).

## 7. Doc externo — `public/llms.txt`

- Añadir la línea de la herramienta bajo `## Herramientas`.
- Actualizar el recuento «Las N herramientas…» y, si procede, la línea de la sección bajo `## Secciones`.

## 8. Verificación (los tres en verde antes de push)

```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm build
```

Smoke opcional: `pnpm build && pnpm start` + `curl -s localhost:3000/{slug} | grep -o '<h1[^>]*>.*</h1>'`.

## 9. Mantenimiento de docs

- Si la herramienta introdujo un **patrón UI nuevo**, documentarlo en `design.md` §4 Recetas y, si cambia el proceso, actualizar esta skill (regla en `AGENTS.md`).
- Commits en español, en `dev`.
