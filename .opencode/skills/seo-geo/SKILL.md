---
name: seo-geo
description: Use when adding or auditing SEO/GEO in HOLENTIA (metadata, metaTitle/metaDescription, canonical, sitemap, robots, JSON-LD, llms.txt, OG images, twitter cards, breadcrumbs, contenido para buscadores generativos) — receta técnica completa por página y por herramienta, con checklist de verificación.
---

# SEO + GEO en HOLENTIA (receta canónica)

Objivo: que Google, Bing y los buscadores generativos (ChatGPT, Claude, Perplexity, AI Overviews) encuentren, entiendan y recomienden HOLENTIA. **Toda herramienta nueva debe pasar el checklist §6 antes del push.** SSOT de implementación: `lib/seo.ts`, `lib/data.ts`, `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`.

## 1. Metadata por página (una sola fuente)

- **Herramientas**: `toolMetadata(section, slug)` en `lib/seo.ts` deriva de la card en `lib/data.ts`:
  - `metaTitle` (obligatorio por herramienta): ≤60 chars, keyword principal primero, sin marcas raras. El `titleTemplate` del layout añade `| HOLENTIA`.
  - `metaDescription` (obligatoria): **120–155 chars**, keyword + beneficio + gancho («Gratis y sin registro», «en tu navegador»). NUNCA reutilizar el blurb corto de la tarjeta (mide 27–47 chars → snippet pobre).
  - `description` corto se queda solo como subtítulo del shell.
- **Secciones**: `sectionMetadata()` usa `metaDescription` del catálogo (**120–155 chars**, copy factual: qué hay en la página, keywords de las tools) con fallback a `subtitle`. El `subtitle` visible bajo el H1 es **inspiracional** (sin cifras inventadas — «8,000 personas» = afirmación no verificable; el sitio no tiene analytics → riesgo E-E-A-T/GEO). El copy largo NO se renderiza en el hub (decisión 14-Oct-2026: sin `intro` visible → vive en la meta description).
- **Informativas**: `pageMetadata(title, description, path)`.
- `html lang="es-DO"`, `locale: "es_DO"` en OG, `inLanguage: "es-DO"` en JSON-LD.

## 2. Imágenes sociales (og:image / twitter)

- File-convention **por ruta**: `app/{ruta}/opengraph-image.tsx` (1200×630, PNG). Next la inyecta como `og:image` Y `twitter:image` con dims/alt. **No** declarar `images` en metadata (pisa la convención).
- Plantilla compartida: `components/seo/og-template.tsx` (`ogTemplate({ title, subtitle })`) + fuente `app/og-font.ts` (INTER_BOLD_BASE64). Cada variante: `import { INTER_BOLD_BASE64 } from "../og-font"`.
- Variantes existentes: raíz (`app/opengraph-image.tsx`), 4 secciones, 15 herramientas y 5 informativas (`ayuda`, `apoyar`, `aviso-legal`, `politica-cookies`, `que-es-holentia`) = **25 archivos**. **Al añadir herramienta o página: crear `app/{ruta}/opengraph-image.tsx`** (copiar de otra y cambiar title/subtitle/alt). La convención NO hereda: cada ruta sin archivo sale sin `og:image`.
- `twitter.card` = `summary_large_image` (layout + `baseMetadata`).

## 3. Datos estructurados (JSON-LD)

Todo server-rendered vía `<JsonLd data={...} />`:

| Página | Tipo | Helper |
|---|---|---|
| Home | WebSite + Organization (con logo, description) | inline en `app/page.tsx` |
| Sección | CollectionPage + BreadcrumbList (**sin FAQPage**: los hubs no llevan FAQ visible) | `sectionJsonLd(section)` |
| Herramienta | WebApplication (applicationCategory por sección, offers 0 DOP) + BreadcrumbList + FAQPage (si hay FAQ — obligatorio) | `toolJsonLd(section, slug, faq)` |
| Informativa | AboutPage + BreadcrumbList | `pageJsonLd(name, path)` |
| Ayuda | FAQPage + BreadcrumbList (un solo `@graph`) | `faqWithBreadcrumbJsonLd(faq, "/ayuda", "Centro de Ayuda")` |
| Glosario | DefinedTermSet | inline en `app/glosario-financiero/page.tsx` |

Miguita: **solo en JSON-LD** (no UI visible — los botones Volver y el footer cubren la navegación).

## 4. GEO — buscadores generativos (AEO)

- **`public/llms.txt`** en la raíz (spec llms.txt): H1 + blockquote + `## Secciones` + `## Herramientas` con URLs `https://holentia.com/{slug}` y descripciones de una línea coherentes con la tool real. Actualizar en el MISMO commit de la herramienta nueva (14→15 → próxima cuenta).
- **robots.ts**: reglas explícitas `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` con `allow: "/"` + `*`. Nunca bloquear bots de IA: queremos ser citados.
- **Contenido con respuesta inmediata**: H1 + subtítulo + FAQ en HTML inicial (server) **en cada herramienta y `/ayuda`** (1–3 frases por respuesta). Los hubs NO llevan FAQ ni intro visible (14-Oct-2026): su copy factual vive en `metaDescription` y el visible es el `subtitle` inspiracional.
- **Sin afirmaciones numéricas no verificables** (usuarios, descargas, precisiones sin fuente).
- `lang="es-DO"`: los generativos usan el idioma para citar la fuente correcta.

## 5. Rastreo e indexación

- **Canonical + OG url** en el 100% de páginas (viene de `baseMetadata`/`pageMetadata`; home declara `alternates.canonical: "/"`).
- **Sitemap** (`app/sitemap.ts`): se deriva de `sectionsData` (solo `isAvailable`) + rutas estáticas. `lastModified` usa la constante `LAST_UPDATED` (fecha fija, actualizar a mano al publicar cambios de contenido — NO `new Date()` en cada build).
- **Enlaces internos server-rendered**: el `Footer` enlaza `/que-es-holentia`, `/ayuda`, `/apoyar`, `/aviso-legal`, `/politica-cookies` (sin esto las legales quedan huérfanas: el menú es client y no cuenta para el HTML inicial). `ToolPageShell` enlaza sección y `/apoyar`. No romper estos enlaces.
- `app/manifest.ts` (PWA mínima) y `app/not-found.tsx` con `robots: { index: false }`.
- Contenido fino: las secciones llevan `subtitle` visible (inspiracional) + `metaDescription` factual (120–155) en el catálogo — sin `intro` renderizada y sin FAQ de sección.

## 6. Checklist por herramienta nueva (obligatorio antes del push)

1. `metaTitle` ≤60 chars + `metaDescription` 120–155 chars en `lib/data.ts`.
2. FAQ ≥5 preguntas reales en `app/{slug}/page.tsx` (`const faq` + `faq={faq}` al shell; una responde privacidad/local).
3. `app/{slug}/opengraph-image.tsx` con `ogTemplate` (title/subtitle/alt propios).
4. Línea en `public/llms.txt` (herramientas + total actualizado).
5. `toolMetadata` + `toolJsonLd` ya proveen canonical/OG/WebApplication/Breadcrumb — verificar con smoke.
6. Sitemap: solo agregar la card al catálogo (se genera solo); si tocas contenido existente, actualizar `LAST_UPDATED`.
7. Enlaces: el footer ya la enlaza indirectamente (catálogo); no hace falta link manual.
8. Verificación: `pnpm build` + comprobar en `.next/server/app/{slug}.html`: `<title>`, `meta description`, `canonical`, `og:image`, `twitter:card`, `<script type="application/ld+json">` con WebApplication + Breadcrumb + FAQPage y el acordeón «Preguntas frecuentes» en el HTML.

## 7. Verificación global (tras cambios SEO)

```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm build
# Smoke: title/description/canonical/og en HTML prerenderado
grep -o '<title>[^<]*' .next/server/app/{slug}.html
grep -c 'application/ld+json' .next/server/app/{slug}.html
grep -o 'og:image[^>]*' .next/server/app/{slug}.html | head -1
# Sitemap/robots/llms
cat .next/server/app/sitemap.xml.body | head
cat .next/server/app/robots.txt.body
```

**Smoke runtime de OG (obligatorio al añadir rutas o tocar imágenes):** las URLs `og:image` se generan al vuelo — comprobar que responden de verdad (un 404 se cuela como URL válida en el HTML):

```bash
pnpm start &
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' localhost:3000/{slug}/opengraph-image   # → 200 image/png
```

## 8. Prohibido

- `noindex` accidental, `images` explícitos en metadata (rompen la variante por ruta).
- Bloquear bots de IA en robots.
- Cifras de usuarios/precisiones sin fuente.
- Meta descriptions <120 chars o duplicadas entre herramientas.
- `new Date()` en sitemap o páginas estáticas (lastmod inconsistente).
