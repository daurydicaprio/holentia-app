# HOLENTIA — Arquitectura

> Next.js 15.5.28 (App Router) · React 19.3.1 · TypeScript · Tailwind 3.4 · sin backend, sin BD, sin registro.
> Rama `dev` → preview `dev.holentia.com` · `main` → producción `holentia.com`.

## 1. Modelo mental

**Catálogo → páginas → hooks → localStorage.** Toda la información de herramientas (título, descripción, slug, sección, disponibilidad) vive en un único catálogo (`lib/data.ts`). Las páginas son delgadas: componen un shell server-rendered + el componente client de la herramienta. La lógica de cálculo vive en `hooks/` y los dominios compartidos en `lib/` (p. ej. `protein.ts`, usado por dos herramientas; `calendar.ts`, fechas de semana compartidas por hábitos y comidas); la persistencia en `lib/storage.ts` con claves namespaced `holentia:{slug}:{draft|simulations|entries}:v1` (localStorage, solo navegador).

```
lib/data.ts (catálogo: sectionsData)
   │
   ├── app/{mente,relaciones,cuerpo,finanzas}/page.tsx  → SectionPage (server)
   │       └── ToolsGrid → ToolCard (client, gradiente por sección)
   │
   ├── app/{slug}/page.tsx  (35 herramientas)
   │       ├── generateMetadata() ← lib/seo.ts (title/canonical/OG)
   │       └── ToolPageShell (server: H1, botones, FAQ acordeón, JsonLd)
   │               └── children = componente client de la herramienta
   │                       └── hooks/use-{tool}.ts (lógica pura)
   │                               └── lib/storage.ts (borrador/snapshots)
   │
   ├── app/herramientas/page.tsx  (directorio: índice server-rendered de las 35)
   │
   └── app/sitemap.ts · app/robots.ts · public/llms.txt  (SEO/GEO)
```

## 2. Server vs client

| Capa | Tipo | Por qué |
|---|---|---|
| `app/**/page.tsx`, `ToolPageShell`, `SectionPage`, `ToolsGrid` (estructura), `SectionTabs`, `JsonLd` | Server | HTML inicial completo: enlaces, H1, FAQ de herramientas/ayuda y JSON-LD visibles para buscadores y crawlers de AI sin ejecutar JS |
| `ToolCard` (efecto 3D/haptic), `ToolFaq` (acordeón), componentes de herramientas, `hooks/*` | Client | Interactividad; el contenido (preguntas FAQ, respuestas) **sigue en el HTML inicial** aunque el panel esté colapsado vía CSS |

Regla: nada de `useEffect`/`mounted` guard para decidir si se renderiza contenido. Antes `ToolPageClient` vaciaba el HTML (bug corregido); hoy todo lo importante está en el primer HTML.

## 3. SEO / GEO

- **Metadata**: `lib/seo.ts` expone `toolMetadata`, `sectionMetadata`, `pageMetadata` (construyen title + description + canonical + OG + Twitter). `app/layout.tsx` pone `metadataBase`, `title.template` ("{página} | HOLENTIA") y `viewport`.
- **JSON-LD**: `toolJsonLd` (WebApplication + BreadcrumbList + FAQPage), `sectionJsonLd` (CollectionPage + BreadcrumbList), home (WebSite + Organization), `/ayuda` (FAQPage). Se emite vía `<JsonLd>` (script `application/ld+json`).
- **FAQ visible**: cada herramienta renderiza su FAQ en el HTML (acordeón, pero el texto está en el DOM) y `/ayuda`. Los hubs de sección **no** llevan FAQ (corrección 14-Oct-2026).
- **Indexación**: `app/sitemap.ts` (55 URLs: home + 4 secciones + directorio + 35 herramientas + 8 informativas + `/guias` + 5 guías publicadas), `app/robots.ts` (allow all + sitemap), `public/llms.txt` (índice legible por LLMs, incluye guías publicadas).
- **Imágenes sociales**: `app/{ruta}/opengraph-image.tsx` por ruta (51: raíz + 4 hubs + directorio + 35 herramientas + 8 informativas + índice de guías + OG dinámica por guía) sobre `components/seo/og-template.tsx`; la convención **no hereda**, cada ruta nueva necesita su OG propia. `app/manifest.ts` (PWA: iconos 192/512/maskable, themeColor claro/oscuro).
- **Auditoría**: checklist de 16 puntos, barrido estático + runtime de OG y registro histórico en la skill `seo-geo-audit` (obligatoria antes de push con rutas nuevas).
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
app/           páginas (server-first): 4 hubs, 35 herramientas, directorio, 8 informativas, guías `/guias`, layout, error, manifest, sitemap, robots + OG por ruta
components/
  common/      header, footer, logo, brand-dots, menu-button, scroll-to-top, clear-all-data, tab-swipe-navigation
  guides/      guide-card, guide-markdown (react-markdown server), guide-tool-links
  sections/    section-page, section-tabs, section-header, section-swipe-navigation, tool-card, tools-grid
  tool-seo/    tool-page-shell, tool-faq (acordeón), json-ld
  tools/       35 componentes client de herramientas (+ subcomponentes y `related-tools/` compartido)
  charts/      chart-data-table (alternativa textual accesible a los canvas)
  rates/       rates-note (fecha de revisión y fuentes en herramientas financieras)
  mis-datos/   data-backup (exportar/importar datos locales)
  seo/         og-template (plantilla compartida de las imágenes OG)
  ui/          primitivas shadcn (button, count-up, input, slider)
hooks/         lógica por herramienta + use-count-up, use-haptic-feedback, use-media-query
lib/           data.ts (catálogo), rates.ts (tasas/fuentes), seo.ts, guides.ts (lectura/parseo), guide-format.ts, storage.ts, data-export.ts (backup/importación), protein.ts (perfiles/rangos), format.ts (formatDOP), calculations/ (fórmulas puras: sueldo, aguinaldo, ITBIS, prestaciones, préstamo, interés compuesto, IMC, grasa y calorías), utils.ts
content/guias/ guías editoriales en Markdown + briefs + plantilla (validación `guides:check`)
scripts/       audit-seo.mjs, validate-guides.mjs
types/         index.ts (CardData, SectionType, AmortizationRow, …), guide.ts
```

## 7. Skills y mantenimiento de docs

- `AGENTS.md` (cargado vía `opencode.json` → `instructions`) contiene reglas de oro e índice de skills; es la entrada para cualquier agente.
- **Skills** en `.opencode/skills/<nombre>/SKILL.md` (formato opencode: frontmatter `name` + `description`):
  - `create-tool` — receta de herramienta nueva (catálogo → página → sitemap → llms.txt → opengraph-image → verificación).
  - `section-ui` — paleta, tokens, tipografía, iconos, hovers, contraste, dark mode.
  - `tool-persistence` — `lib/storage.ts`, patrones E/D/S, claves `holentia:*`, privacidad.
  - `chart-chartsjs` — theming Chart.js por tema + pitfall `fontColor` de leyendas.
  - `seo-geo` — receta SEO/GEO por página y por herramienta (metadata, canonical, JSON-LD, OG, llms.txt).
  - `seo-geo-audit` — checklist de 16 puntos + barrido automatizado + registro de auditorías (obligatoria al añadir herramienta).
  - `create-guide` — flujo editorial completo: brief, frontmatter, CTAs, fuentes, validación, publicación y actualización.
  - `guia-voz` — tono relajado, sencillo y con ejemplos para las guías.
  - `humanizer` — pase final contra patrones de escritura AI (MIT, `blader/humanizer`).
- **Contenido editorial**: `content/guias/README.md` es la fuente de verdad de frontmatter, CTAs, fuentes y flujo. Las guías se escriben en Markdown puro. `pnpm guides:check` valida el contenido. El renderizado vive en `app/guias/` + `components/guides/` (Fase BQ). `draft: true` se muestra solo en desarrollo/preview con `noindex`; en producción queda fuera de páginas, sitemap y `llms.txt` hasta pasar a `draft: false`. El índice usa una guía destacada + tres recientes y un archivo paginado de 4 en 4 (`GuideArchive`), con fotos locales en `public/guias/` (`GuideCover`, con portada generada de respaldo) y una barra de logo centrada en el detalle (`GuideNav`). Las tarjetas no muestran categoría ni CTA «Leer guía». Las guías publicadas se enlazan automáticamente desde sus herramientas con `RelatedGuides` (`primaryTool`/`relatedTools`); así una herramienta nunca apunta a un borrador que no existe en producción.
- **Regla**: cualquier cambio de UI/patrón/token/proceso/flujo editorial actualiza `design.md`, `content/guias/README.md` y/o las skills afectadas **en el mismo commit** (docs nunca desincronizados del código).

## 8. Calidad

- `pnpm test` (22 casos de cálculo) · `pnpm exec tsc --noEmit` · `pnpm lint` (ESLint 8.57 + `next/core-web-vitals`) · `pnpm build` — todo debe estar en verde antes de cada push.
- CI: `.github/workflows/ci.yml` corre en Node 22 con pnpm 10.34.6: install congelado, tests, `links:check`, `tsc`, `lint`, `guides:check`, `audit --prod`, build y `audit:seo`.
- Guías: `pnpm guides:check` valida frontmatter, slug, herramientas, fuentes, FAQ, fechas y enlaces internos.
- Enlaces internos: `pnpm links:check` valida las 35 herramientas del grafo `lib/related-tools.ts` (2–3 salientes, ≥2 entrantes, destinos existentes, sin autorreferencias).
- Build estricto: sin `ignoreBuildErrors`/`ignoreDuringBuilds`.
- Smoke antes de cada push con rutas nuevas: HTML prerenderado (H1 ×1, canonical, `noindex` solo esperado en borradores de guía, JSON-LD) + runtime de `opengraph-image` (`200 image/png`).
- Auditoría automatizada: `pnpm audit:seo` (`scripts/audit-seo.mjs`) valida el sitemap completo — SEO/GEO, estructura a11y y runtime OG — en un paso (detalle: skill `seo-geo-audit` §2.0).
- **Accesibilidad real (Fase BG, 18-Oct-2026)**: barrido `axe-core 4.11` en Chromium (Playwright) sobre las 42 rutas × claro/oscuro × 1440/390 px, finalizando animaciones, más estados de resultado (calculadoras, tests, diarios, presupuesto, glosario): **168 combinaciones + estados, 0 violaciones**. Complemento manual de teclado/foco: skip link, orden de tabulación con anillo visible, menú Enter/Escape y botón «Volver» móvil con nombre accesible. Reglas y hallazgos: `design.md` §7 y `plan.md` Fase BG; el registro de auditorías vive en la skill `seo-geo-audit`.
- **Rendimiento de campo (Fase BL, 19-Oct-2026)**: el chrome de herramienta y el héroe crítico se renderizan en SSR; las variantes responsive se alternan por CSS (`md:hidden` / `hidden md:block`) y los gates `mounted` se limitan a datos locales/fecha. Resultado en Lighthouse 13.5: **CLS 0.093 → 0**, LCP móvil **2.5 → 2.1 s**, móvil 87-88 (mediana) y desktop 100; `audit:seo` 45/45, axe 12/12. Detalle: `design.md` §3.8/§4d y `plan.md` Fase BL.
- Presupuesto de rendimiento: herramienta ≤ ~150 kB First Load y Chart.js siempre en chunks diferidos (`next/dynamic`); medir con la tabla de `pnpm build` (design.md §3.8).
- Commits atómicos por fase en `dev`; `main` solo cuando se pide deploy a producción.
