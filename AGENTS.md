# HOLENTIA — Instrucciones de agente

App de bienestar integral (Next.js 15 App Router · React 19 · TS · Tailwind 3.4 · pnpm). Sin backend, sin BD, sin registro: todo local-first en el navegador. Español (es_DO) en UI, contenido y commits.

## Reglas de oro

1. **Rama `dev`** para todo el trabajo (preview dev.holentia.com). **`main` NO se toca** hasta que el usuario lo pida (producción holentia.com).
2. **Verificación obligatoria antes de cada push**: `pnpm exec tsc --noEmit && pnpm lint && pnpm build` — los tres en verde.
3. **Nunca hex suelto en componentes nuevos**: tokens Tailwind de sección (`text-finanzas`, `bg-mente-light`, …) o CSS vars. La clave `DEFAULT` genera la clase **sin sufijo** (`bg-mente`, NO `bg-mente-DEFAULT`).
4. **Todo componente con color propio necesita variante `dark:`**. Probar ambos modos conceptualmente (contraste AA).
5. **Sin tracking, sin envíos de red, sin backend.** Privacidad del usuario por encima de todo.
6. **Server-first**: páginas y shells server-rendered; client solo para interactividad. El contenido importante (H1, FAQ, JSON-LD) vive en el HTML inicial.
7. **`data-interactive="true"`** en todo elemento interactivo (evita swipe-navigation). Haptics en acciones importantes (`useHapticFeedback`).

## Fuente única de verdad

| Documento | Contenido |
|---|---|
| `design.md` | Design system: paleta, tipografía, iconos, espaciado, recetas de componente, contraste |
| `architecture.md` | Arquitectura: modelo mental server/client, SEO, persistencia, estructura |
| `content/guias/README.md` | Guías editoriales: frontmatter, CTAs, fuentes, flujo y validación |
| `README.md` | Setup, comandos, contribución |

## Skills del proyecto (`.opencode/skills/`)

Cargar la skill correspondiente antes de la tarea; cada una es la receta canónica:

| Skill | Cuándo usarla |
|---|---|
| `create-tool` | Crear una herramienta nueva de punta a punta (registro, página, FAQ, sitemap, llms.txt, verificación) |
| `seo-geo` | Cualquier trabajo de SEO/GEO: metadata, metaTitle/metaDescription, canonical, sitemap, robots, JSON-LD, llms.txt, OG images, breadcrumbs, checklist por herramienta |
| `seo-geo-audit` | Auditoría SEO/GEO/llms antes del push (herramienta nueva o existente): checklist de 16 puntos, barrido automatizado y registro de auditorías |
| `section-ui` | Cualquier trabajo de UI: colores por sección, tokens, tipografía, iconos, hovers, dark mode, contraste |
| `tool-persistence` | Persistencia local: drafts/snapshots, `lib/storage.ts`, claves `holentia:*`, integración «Borrar mis datos» |
| `chart-chartsjs` | Gráficos Chart.js: theming por tema, leyendas (`fontColor`), efectos y destrucción |
| `create-guide` | Crear, actualizar y publicar una guía en Markdown: brief, frontmatter, CTAs, fuentes, validación, sitemap/llms.txt |
| `guia-voz` | Tono relajado, sencillo y con ejemplos para las guías; checklist de voz antes de publicar |
| `humanizer` | Pase final para quitar patrones de escritura AI (instalada de `blader/humanizer`, MIT) |

## Regla de mantenimiento (obligatoria)

> **Cada modificación de UI, patrón, token, icono, proceso o flujo editorial debe actualizar `design.md`, `content/guias/README.md` y/o las skills afectadas en el MISMO commit.** Si introduces un patrón nuevo, docméntalo en `design.md` §recetas y refleja el proceso en la skill correspondiente (normalmente `create-tool`, `create-guide` o `section-ui`). El docs nunca debe quedar desincronizado del código.

## Comandos

```bash
pnpm dev                  # desarrollo
pnpm exec tsc --noEmit    # typecheck
pnpm lint                 # ESLint (next/core-web-vitals)
pnpm build                # producción (estricto, sin ignoreBuildErrors)
pnpm start                # sirve build de producción
pnpm guides:check         # valida frontmatter, fuentes, FAQ y enlaces de content/guias
```
