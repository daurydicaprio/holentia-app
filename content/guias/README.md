# Guías HOLENTIA

Contenido editorial en **Markdown puro** para que se pueda revisar, exportar y publicar sin depender de un editor propietario. La estructura y la validación viven en el repo; el renderizado vive en `app/guias/` y `components/guides/` (Fase BQ de `plan-mejoras.md`).

## Estructura

```text
content/guias/
  README.md                 # este documento
  _template.md              # punto de partida (no se publica)
  _briefs/                  # investigación y outline (no se publica)
    mi-guia.md
  mi-guia.md                # guía publicable
```

- `_template.md` y `_briefs/` empiezan con `_` y no se validan ni se publican.
- Cada guía publicada es un archivo `.md` con frontmatter YAML y cuerpo Markdown.
- No se usa MDX ni HTML crudo. Así el archivo se puede copiar a cualquier plataforma.
- `draft: true` mantiene la guía fuera de producción: no se genera su página, no entra al sitemap y no se añade a `llms.txt`. En desarrollo y en previews de Vercel sí se renderiza, con `noindex, nofollow`, para poder revisarla.

## Frontmatter

```yaml
---
title: "Título claro, con la consulta principal"
seoTitle: "Título corto para buscadores" # opcional, 25–49; el H1 sigue siendo title
slug: "slug-en-kebab-case"
description: "Meta description de 120–155 caracteres, concreta y sin clickbait."
excerpt: "Una o dos frases para la tarjeta del índice."
category: "finanzas" # cuerpo | mente | relaciones | finanzas | general
primaryTool: "calculadora-sueldo-neto"
relatedTools:
  - "calculadora-aguinaldo"
  - "calculadora-prestaciones-laborales"
publishedAt: "2026-10-20"
updatedAt: "2026-10-20"
reviewedAt: "2026-10-20" # obligatorio en finanzas y salud
author: "Daury DiCaprio"
cover: "salary" # fallback si no hay foto: growth | salary | body | invest | default
image: "/guias/mi-guia.jpg" # foto local en public/guias/
imageAlt: "Descripción breve de la foto para lectores de pantalla."
keywords:
  - "sueldo neto RD"
  - "TSS"
  - "ISR"
sources:
  - title: "DGII — Impuesto sobre la Renta"
    url: "https://dgii.gov.do/..."
    accessedAt: "2026-10-20"
faq:
  - question: "¿Qué diferencia hay entre bruto y neto?"
    answer: "El bruto es lo que se acuerda antes de descuentos; el neto es lo que llega después de TSS e ISR."
draft: true
---
```

Reglas:

- `slug` debe coincidir con el nombre del archivo.
- `seoTitle` es opcional (25–49 caracteres). Se usa solo en `<title>` y Open Graph; el H1 y el JSON-LD conservan `title`.
- `category`: `cuerpo`, `mente`, `relaciones`, `finanzas` o `general`.
- `primaryTool` y `relatedTools` deben existir en `lib/data.ts`.
- `description`: 120–155 caracteres; sin promesas absolutas.
- `sources`: mínimo 2 en finanzas y salud; mínimo 1 en general. Enlaces `https`.
- `faq`: 3–6 preguntas. Se usan para `FAQPage`.
- `reviewedAt`: obligatorio en finanzas y salud.
- `image` y `imageAlt`: foto editorial local del índice. Descarga el archivo en `public/guias/` y usa una ruta que empiece por `/guias/`; `imageAlt` describe la foto para lectores de pantalla. Nunca uses URLs remotas en runtime.
- `cover`: fallback visual (`growth`, `salary`, `body`, `invest`) si la guía todavía no tiene foto. Si falta o es `default`, `GuideCover` usa el color y el icono de la categoría.
- `draft: true` hasta que el contenido, las fuentes y los enlaces estén revisados.
- No incluir H1 en el cuerpo: el H1 sale del `title`.
- Enlaces internos con rutas absolutas (`/calculadora-sueldo-neto`, `/guias/...`).

## Imágenes

Las fotos del índice viven en `public/guias/` y se sirven localmente: el navegador no hace peticiones a Unsplash ni a ningún otro tercero. Son fotografías de [Unsplash](https://unsplash.com/license), usadas bajo su licencia.

- `como-invertir-en-rd-desde-cero.jpg` — `photo-1579621970563-ebec7560ff3e`
- `sueldo-neto-rd-2027.jpg` — `photo-1554224154-26032ffc0d07`
- `interes-compuesto-rd.jpg` — `photo-1611974789855-9c2a0a7236a3`
- `grasa-corporal-como-medirla.jpg` — `photo-1571019613454-1cb2f99b2d8b`

Al añadir una guía, descarga una foto horizontal (1600×1000 aproximado), guárdala con el slug y declara `image` + `imageAlt` en el frontmatter. Si no hay foto, el índice cae en la portada generada con tokens.

## Renderizado y vista previa

- `lib/guides.ts` lee `content/guias/*.md`, parsea el frontmatter YAML y calcula el tiempo de lectura (220 palabras/minuto).
- `app/guias/page.tsx` es el índice: una guía destacada con foto + tres recientes en una columna editorial y, si hay más de cuatro, «Últimas guías» con las restantes y paginación local de cuatro en cuatro (`GuideArchive`). `app/guias/[slug]/page.tsx` renderiza el detalle con `react-markdown` + `remark-gfm` en el servidor y una barra superior con el logo centrado (`GuideNav`).
- `draft: true` se muestra en desarrollo (`NODE_ENV !== "production"`), en previews de Vercel (`VERCEL_ENV=preview`) o con `GUIDES_PREVIEW=1`. La página lleva `noindex, nofollow`; el índice también es `noindex` mientras no haya publicadas.
- Para revisar un build de producción en local:

```bash
GUIDES_PREVIEW=1 pnpm build
GUIDES_PREVIEW=1 pnpm start
# abrir /guias
```

- La metadata, los JSON-LD (`Article` + `BreadcrumbList` + `FAQPage` + `citation` desde `sources`) y la OG por guía se generan solos. El índice y las guías publicadas entran al sitemap cuando al menos una tiene `draft: false`.
- `public/llms.txt` y los enlaces desde las herramientas se añaden manualmente al publicar. Incluye una línea del índice `/guias` la primera vez.

## Cuerpo

- Empieza con un H2. El H1 es el `title`.
- Abre con una situación concreta, no con una definición.
- H2 como preguntas o acciones: «Qué te descuentan», «Cómo se calcula el ISR», «Qué hacer con el resultado».
- Párrafos de 2–4 líneas. Una idea por párrafo.
- Tablas para rangos, tasas y comparaciones; no para esconder texto.
- Ejemplos con montos en RD$, medidas en cm o situaciones reales.
- Fuentes en el frontmatter (para JSON-LD/SEO) y, para que el Markdown exportado se lea solo, una sección `## Fuentes` en el cuerpo. Mantén las dos sincronizadas; el renderer no debe duplicarlas. Si una afirmación no tiene fuente, se quita o se marca como límite.
- Cierra con un paso siguiente, no con un resumen que repite todo.

## CTAs

Cada guía tiene un CTA contextual (máximo 2) y un CTA final obligatorio.

Contextual:

```md
> **Haz la cuenta con tu salario:** usa la [calculadora de sueldo neto](/calculadora-sueldo-neto) y compara tu bruto con tu neto.
```

Final:

```md
## Calcula tu caso

> **Calculadora de sueldo neto:** [de bruto a neto con TSS e ISR](/calculadora-sueldo-neto).
>
> **También te puede servir:** [calculadora de aguinaldo](/calculadora-aguinaldo) y [calculadora de prestaciones](/calculadora-prestaciones-laborales).
```

El frontmatter `primaryTool` y `relatedTools` alimentan el bloque automático del sitio. El CTA explícito se mantiene para que la guía funcione al exportarla.

## Flujo editorial

1. Brief en `_briefs/`.
2. Borrador `.md` con `draft: true`.
3. `pnpm guides:check`.
4. Pase de voz con `guia-voz`.
5. Pase de limpieza con `humanizer` (no añade datos).
6. Verificación de fuentes, fechas y cálculos.
7. Revisión de CTAs y enlaces internos.
8. Revisión en `/guias` con `GUIDES_PREVIEW=1` (borrador visible, `noindex`).
9. `draft: false`, línea en `llms.txt` y enlaces desde herramientas / guías relacionadas.
10. `pnpm guides:check`, `tsc`, `lint`, `build` y `audit:seo`.

## Actualización

Las guías de finanzas y salud caducan. Revisa fuentes y tasas al menos una vez al año o cuando cambie la ley.

- Cambia `updatedAt` y `reviewedAt`.
- Si cambia una tasa, actualiza la guía y la calculadora en el mismo trabajo.
- Añade una nota breve si el cambio es relevante.
- No cambies el slug de una guía publicada sin redirección 301.
- Vuelve a ejecutar `pnpm guides:check` y `pnpm audit:seo`.

## Estado

- Contenido y validación: listos.
- Renderizado `/guias`, JSON-LD y OG: listos.
- Guías actuales (4 publicadas): `como-invertir-en-rd-desde-cero`, `interes-compuesto-rd`, `sueldo-neto-rd-2027` y `grasa-corporal-como-medirla`. Todas están en sitemap y `llms.txt`.
- El índice `/guias` y las guías publicadas entran al sitemap automáticamente. Las herramientas muestran sus guías publicadas con `RelatedGuides` (`primaryTool`/`relatedTools`); no hay que editar TSX al publicar.
- Las guías en borrador se revisan con `GUIDES_PREVIEW=1 pnpm build` y `GUIDES_PREVIEW=1 pnpm start`; llevan `noindex, nofollow` y no aparecen en sitemap ni `llms.txt`.
