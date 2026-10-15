# HOLENTIA — Arquitectura

> Next.js 15.5.26 (App Router) · React 19 · TypeScript · Tailwind 3.4 · sin backend, sin BD, sin registro.
> Rama `dev` → preview `dev.holentia.com` · `main` → producción `holentia.com`.

## 1. Modelo mental

**Catálogo → páginas → hooks → localStorage.** Toda la información de herramientas (título, descripción, slug, sección, disponibilidad) vive en un único catálogo (`lib/data.ts`). Las páginas son delgadas: componen un shell server-rendered + el componente client de la herramienta. La lógica de cálculo vive en `hooks/`; la persistencia en `lib/storage.ts` con claves namespaced `holentia:{slug}:{draft|simulations|entries}:v1` (localStorage, solo navegador).

```
lib/data.ts (catálogo: sectionsData)
   │
   ├── app/{mente,relaciones,cuerpo,finanzas}/page.tsx  → SectionPage (server)
   │       └── ToolsGrid → ToolCard (client, gradiente por sección)
   │
   ├── app/{slug}/page.tsx  (13 herramientas)
   │       ├── generateMetadata() ← lib/seo.ts (title/canonical/OG)
   │       └── ToolPageShell (server: H1, botones, JsonLd — sin FAQ)
   │               └── children = componente client de la herramienta
   │                       └── hooks/use-{tool}.ts (lógica pura)
   │                               └── lib/storage.ts (borrador/snapshots)
   │
   └── app/sitemap.ts · app/robots.ts · public/llms.txt  (SEO/GEO)
```

## 2. Server vs client

| Capa | Tipo | Por qué |
|---|---|---|
| `app/**/page.tsx`, `ToolPageShell`, `SectionPage`, `ToolsGrid` (estructura), `SectionTabs`, `JsonLd` | Server | HTML inicial completo: enlaces, H1, FAQ de hubs/ayuda y JSON-LD visibles para buscadores y crawlers de AI sin ejecutar JS |
| `ToolCard` (efecto 3D/haptic), componentes de herramientas, `hooks/*` | Client | Interactividad; lo importante (enlaces, H1, JSON-LD, FAQ de hubs/acordeones `<details>`) **sigue en el HTML inicial** aunque el panel esté colapsado vía CSS |

Regla: nada de `useEffect`/`mounted` guard para decidir si se renderiza contenido. Antes `ToolPageClient` vaciaba el HTML (bug corregido); hoy todo lo importante está en el primer HTML.

## 3. SEO / GEO

- **Metadata**: `lib/seo.ts` expone `toolMetadata`, `sectionMetadata`, `pageMetadata` (construyen title + description + canonical + OG + Twitter). `app/layout.tsx` pone `metadataBase`, `title.template` ("{página} | HOLENTIA") y `viewport`.
- **JSON-LD**: `toolJsonLd` (WebApplication + BreadcrumbList — sin FAQPage), `sectionJsonLd` (CollectionPage + BreadcrumbList + FAQPage si hay mini-FAQ), home (WebSite + Organization), `/ayuda` (FAQPage). Se emite vía `<JsonLd>` (script `application/ld+json`).
- **FAQ visible**: solo en hubs de sección (mini-FAQ nativa `<details>`) y `/ayuda`. Las 13 herramientas **no** llevan FAQ (decisión 14-Oct-2026): la respuesta vive en su propia UI.
- **Indexación**: `app/sitemap.ts` (23 URLs: home + 4 secciones + 13 herramientas + 5 informativas), `app/robots.ts` (allow all + sitemap), `public/llms.txt` (índice legible por LLMs).
- El breadcrumb **no se muestra al usuario**; solo existe como `BreadcrumbList` en JSON-LD.

## 4. Color y theming

- Tokens por sección en `app/globals.css` (`:root` light + `.dark`), mapeados a Tailwind en `tailwind.config.ts` (clases `bg-mente`, `text-finanzas-lighter`, etc.; la clave `DEFAULT` se usa sin sufijo). Paleta canónica: mente `#1976d2`, relaciones `#7c3aed`, cuerpo `#ffa000`, finanzas `#388e3c`.
- Tarjetas: **gradiente sólido** en light (contraste con texto blanco), **glass** en dark. Detalle en `design.md` §4.
- `next-themes` gestiona `resolvedTheme`; Chart.js y otros efectos reaccionan al tema.

## 5. Estado y persistencia

- Estado de herramienta: `hooks/use-{tool}.ts` (patrones Tipo D draft autosave, Tipo S snapshots, Tipo E efímero). Ver `lib/storage.ts` y la tabla de claves en `politica-cookies`.
- Sin estado global (no hay Redux/Zustand/Context de app). El tema es el único contexto externo (`next-themes`).
- Navegación: App Router + `SectionSwipeNavigation` (swipe entre secciones, desactivado dentro de herramientas) + `TabSwipeNavigation` (swipe intra-tool, ignora `input,button,a,select,textarea,[role=slider],[data-interactive]`).

## 6. Estructura de directorios

```
app/           páginas (server-first): 4 hubs, 13 herramientas, 5 informativas, layout, error, sitemap, robots
components/
  common/      header, footer, logo, menu-button, scroll-to-top, clear-all-data, tab-swipe-navigation
  sections/    section-page, section-tabs, section-header, section-swipe-navigation, tool-card, tools-grid
  tool-seo/    tool-page-shell, json-ld
  tools/       13 componentes client de herramientas (+ subcomponentes)
  ui/          primitivas shadcn (button, count-up, input, slider)
hooks/         lógica por herramienta + use-count-up, use-haptic-feedback, use-media-query
lib/           data.ts (catálogo), seo.ts, storage.ts, utils.ts
types/         index.ts (CardData, SectionType, AmortizationRow, …)
```

## 7. Skills y mantenimiento de docs

- `AGENTS.md` (cargado vía `opencode.json` → `instructions`) contiene reglas de oro e índice de skills; es la entrada para cualquier agente.
- **Skills** en `.opencode/skills/<nombre>/SKILL.md` (formato opencode: frontmatter `name` + `description`):
  - `create-tool` — receta de herramienta nueva (catálogo → página → sitemap → llms.txt → opengraph-image → verificación).
  - `section-ui` — paleta, tokens, tipografía, iconos, hovers, contraste, dark mode.
  - `tool-persistence` — `lib/storage.ts`, patrones E/D/S, claves `holentia:*`, privacidad.
  - `chart-chartsjs` — theming Chart.js por tema + pitfall `fontColor` de leyendas.
- **Regla**: cualquier cambio de UI/patrón/token/proceso actualiza `design.md` y/o las skills afectadas **en el mismo commit** (docs nunca desincronizados del código).

## 8. Calidad

- `pnpm exec tsc --noEmit` · `pnpm lint` (ESLint 8.57 + `next/core-web-vitals`) · `pnpm build` — los tres deben estar en verde antes de cada push.
- Build estricto: sin `ignoreBuildErrors`/`ignoreDuringBuilds`.
- Commits atómicos por fase en `dev`; `main` solo cuando se pide deploy a producción.
