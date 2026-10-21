---
name: create-guide
description: Use when creating, updating or publishing a HOLENTIA guide (guía nueva, guía editorial, actualizar guía, CTA de herramienta, content/guias, Markdown, fuentes, FAQ, sitemap, llms.txt) — flujo completo desde el brief hasta la validación y el mantenimiento.
---

# Crear y actualizar una guía

Receta canónica para las guías editoriales de HOLENTIA. El contenido vive en **Markdown puro** para que se pueda exportar, revisar y reutilizar fuera del sitio. La estructura, el frontmatter y las reglas editoriales están en `content/guias/README.md`; la plantilla es `content/guias/_template.md`.

Skills de apoyo:
- **`guia-voz`** — tono relajado, sencillo y con ejemplos. Cárgala antes de escribir o editar.
- **`humanizer`** — pase final para quitar patrones de escritura AI. No añade datos.
- **`seo-geo`** y **`seo-geo-audit`** — metadata, JSON-LD, OG, sitemap, `llms.txt` y auditoría.

> Estado: contenido, validación, rutas `/guias` y renderer Markdown listos (Fase BQ). Los borradores se ven en desarrollo y en previews de Vercel con `noindex`; en producción `draft: true` queda fuera de páginas, sitemap y `llms.txt`. La publicación (`draft: false`, `llms.txt` y enlaces desde herramientas) sigue siendo una decisión explícita.

## 1. Antes de escribir: brief

Cada guía nace de un brief en `content/guias/_briefs/`. Debe responder:

- Consulta objetivo e intención de búsqueda (informacional, comparación, decisión).
- Lector concreto: quién es, qué problema tiene, qué sabe ya.
- Ángulo propio: qué aporta esta guía que no esté en las otras diez de Google.
- Outline H2/H3.
- Preguntas que debe resolver.
- Fuentes oficiales o primarias que hay que verificar.
- Ejemplos, casos o experiencia real que se van a incluir.
- Herramienta principal y herramientas relacionadas.
- Meta title y meta description.
- CTA final.
- Qué evitar (mitos, afirmaciones sin fuente, relleno).

Si el brief no tiene fuentes ni ejemplos, la guía no está lista para escribirse.

## 2. Archivos y frontmatter

```text
content/guias/
  README.md
  _template.md
  _briefs/
    mi-guia.md
  mi-guia.md
```

Reglas mínimas:

- `slug` en kebab-case y **igual al nombre del archivo**.
- `title`, `description`, `category`, `primaryTool`, `author`, `publishedAt`, `updatedAt`, `sources` y `faq` son obligatorios.
- `draft: true` hasta que el contenido y las fuentes estén revisados. En desarrollo/preview se renderiza para revisión con `noindex`; en producción queda fuera del sitio.
- `description` de 120–155 caracteres; sin clickbait.
- `sources`: mínimo 2 en finanzas y salud; mínimo 1 en general.
- `faq`: 3–6 preguntas; se usan para `FAQPage`.
- `reviewedAt` obligatorio en finanzas y salud.
- No incluir H1 en el cuerpo: el H1 sale del `title`.
- No usar HTML crudo ni MDX. Markdown estándar con tablas y blockquotes.
- Enlaces internos con rutas absolutas: `/calculadora-sueldo-neto`, `/guias/...`.

La plantilla completa y el esquema comentado están en `content/guias/README.md`. No dupliques el esquema en cada guía.

## 3. CTAs y enlaces a herramientas

Una guía no termina en un callejón. Cada guía debe tener:

### CTA contextual dentro del contenido

Después de explicar el problema y antes de que el lector tenga que buscar la herramienta, añade un blockquote con el siguiente paso:

```md
> **Haz la cuenta con tu salario:** usa la [calculadora de sueldo neto](/calculadora-sueldo-neto) y compara tu bruto con tu neto.
```

Reglas:
- Máximo 2 CTAs contextuales por guía.
- Solo cuando la herramienta resuelve el paso que acabas de explicar.
- El enlace debe ser útil, no una cuña publicitaria.
- No uses mayúsculas, urgencia falsa ni «haz clic aquí».

### CTA final obligatorio

Cierra con una sección `## Calcula tu caso` (o equivalente) que incluya la herramienta principal y, si aportan, 1–2 relacionadas:

```md
## Calcula tu caso

> **Calculadora de sueldo neto:** [de bruto a neto con TSS e ISR](/calculadora-sueldo-neto).
>
> **También te puede servir:** [calculadora de aguinaldo](/calculadora-aguinaldo) y [calculadora de prestaciones](/calculadora-prestaciones-laborales).
```

El frontmatter `primaryTool` y `relatedTools` alimentan el bloque automático del sitio. El CTA explícito en Markdown se mantiene para que la guía funcione al exportarla.

## 4. SEO y GEO

- `title`: claro, con la consulta principal; sin promesas absolutas.
- `description`: responde a la consulta en una frase concreta.
- H2 como preguntas o acciones: «Qué te descuentan», «Cómo se calcula el ISR», «Qué hacer con el resultado».
- FAQ visible y en `FAQPage`; no inventes preguntas para llenar.
- Fuentes en el frontmatter (para JSON-LD) y, para exportación, una sección `## Fuentes` en el cuerpo. Mantén ambas sincronizadas.
- `Article` + `FAQPage` + `BreadcrumbList` en la página de guía; `CollectionPage` en el índice.
- OG propia por guía (título + subtítulo).
- Sitemap con `lastModified` = `updatedAt`; `llms.txt` con una línea por guía publicada.
- OG propia por guía (`app/guias/[slug]/opengraph-image.tsx`, automática). El índice tiene la suya en `app/guias/opengraph-image.tsx`.
- Enlaces bidireccionales: la guía enlaza a la herramienta y, al publicar, la herramienta muestra sus guías relacionadas.
- Canónica automática (`guideMetadata`); no la escribas a mano salvo caso especial.
- `draft: true` aplica `robots: noindex, nofollow`; no lo quites a mano.
- No keywords stuffing. Las `keywords` del frontmatter son organización interna, no meta keywords.

## 5. Voz y edición

1. Escribe el borrador con `guia-voz`.
2. Verifica cada dato, tasa, fecha y fuente. Si no puedes verificar algo, quítalo o dilo como límite.
3. Pasa `humanizer` sobre el texto. No dejes que añada hechos, nombres o cifras.
4. Lee en voz alta. Si una frase no se dice natural, reescríbela.
5. Revisa que cada sección añada algo. Corta introducciones genéricas y cierres que repiten.
6. Comprueba los CTAs: que aparezcan en el momento útil y que los enlaces existan.
7. Actualiza `updatedAt` y `reviewedAt` cuando corresponda.

Prohibido:
- «En el mundo actual», «es importante destacar», «no solo... sino también», tríadas decorativas, frases de una línea que solo enfatizan.
- Afirmaciones médicas, financieras o legales sin fuente o sin límite.
- Inventar experiencia personal, casos, cifras o fuentes.
- Relleno para llegar a una longitud.
- Prometer resultados («vas a adelgazar», «te vas a ahorrar X») sin contexto.

## 6. Validación

Antes de publicar:

```bash
pnpm guides:check
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

`pnpm guides:check` revisa frontmatter, slug, categorías, herramientas, fuentes, FAQ, fechas, H2, palabras, placeholders y enlaces internos. No mide voz humana; eso lo hace la edición.

**Vista previa del borrador** (sin publicarlo):

```bash
GUIDES_PREVIEW=1 pnpm build
GUIDES_PREVIEW=1 pnpm start
# abrir /guias y /guias/{slug}
```

El borrador debe verse, llevar `noindex, nofollow` y no aparecer en `sitemap.xml` ni en `public/llms.txt`. Comprueba también que su `opengraph-image` responda `200 image/png` y que el HTML inicial tenga un solo H1, `Article`, `BreadcrumbList` y `FAQPage`.

`pnpm audit:seo` recorre el sitemap, así que **no audita borradores**. Para que una guía entre a la auditoría hay que publicarla (`draft: false`) en el mismo cambio; si no, valida el HTML y la OG a mano.

## 7. Publicar

1. Cambia `draft: false`.
2. Verifica que `publishedAt`, `updatedAt` y `reviewedAt` sean correctos.
3. Añade la línea de la guía a `public/llms.txt` en `## Guías` (URL + resumen de una frase) y, la primera vez, la línea del índice `https://holentia.com/guias`.
4. El índice `/guias`, la ruta de la guía, el JSON-LD, la OG y el sitemap se generan solos: no añadas rutas a mano en `app/sitemap.ts`.
5. Enlaces bidireccionales: el bloque `RelatedGuides` de `ToolPageShell` muestra automáticamente las guías publicadas cuyo `primaryTool` o `relatedTools` coincide con la herramienta. No edites la página de la herramienta para añadir el enlace; basta con declarar bien el frontmatter. Si la guía enlaza a 1–2 guías relacionadas, usa rutas absolutas en el Markdown.
6. Ejecuta `pnpm guides:check`, `tsc`, `lint`, `build` y `pnpm audit:seo` (ahora sí incluye la guía en el sitemap).
7. Revisa la página en móvil, claro/oscuro, teclado y con el HTML inicial (sin JS).
8. Commit en `dev`; `main` solo cuando el usuario lo pida.

## 8. Actualizar una guía existente

Las guías de finanzas y salud caducan. Mantenimiento:

- Revisa fuentes y tasas al menos una vez al año o cuando cambie la ley.
- Si cambia una tasa, actualiza la guía **y** la calculadora en el mismo trabajo.
- Cambia `updatedAt` y `reviewedAt`.
- Añade una nota breve si el cambio es relevante: «Actualizado el 20 de octubre de 2026: nueva escala de ISR 2027».
- Revisa los enlaces internos y las herramientas relacionadas.
- Vuelve a ejecutar `pnpm guides:check` y `pnpm audit:seo`.
- No cambies el slug de una guía publicada sin redirección 301.

Checklist de actualización:

- [ ] La fecha y la fuente siguen vigentes.
- [ ] Los ejemplos siguen dando el mismo resultado.
- [ ] La calculadora vinculada usa los mismos supuestos.
- [ ] El CTA sigue siendo el paso correcto.
- [ ] La guía no contradice otra guía o herramienta.
- [ ] `draft` está en `false` solo si está lista para publicar.

## 9. Referencias

- `content/guias/README.md` — esquema, plantilla y flujo editorial.
- `content/guias/_template.md` — punto de partida.
- `lib/guides.ts` — parseo, orden, `isGuidePreview()` y sitemap de publicadas.
- `app/guias/page.tsx` y `app/guias/[slug]/page.tsx` — índice y detalle.
- `components/guides/guide-markdown.tsx` — renderer Markdown server-side.
- `plan-mejoras.md` — Fases BQ, BR y BU.
- `.opencode/skills/guia-voz/SKILL.md` — tono.
- `.opencode/skills/humanizer/SKILL.md` — limpieza de patrones AI.
- `.opencode/skills/seo-geo/SKILL.md` — SEO/GEO.
- `.opencode/skills/seo-geo-audit/SKILL.md` — auditoría.
