# HOLENTIA — Plan de mejoras 2.0

> Fecha: 20-Oct-2026
> Estado: propuesta en ejecución. BQ parcial; ver estado de ejecución abajo. `main` no se toca.
> Base: `main` y `dev` en `3638175`; 35 herramientas, 46 URLs, 46 OG, 39 claves `holentia:*`.
> Principios: local-first, sin tracking, server-first, español (es-DO) y documentación en el mismo commit.
>
> **Estado de ejecución (21-Oct-2026):** Humanizer instalado (MIT); skills `create-guide` y `guia-voz` creadas; `content/guias/` con README, plantilla, cuatro briefs y cuatro guías publicadas (`como-invertir-en-rd-desde-cero`, `interes-compuesto-rd`, `sueldo-neto-rd-2027` y `grasa-corporal-como-medirla`); `/guias` rediseñado (destacada + tres recientes + archivo paginado de 4 en 4), sitemap de 51 URLs, `llms.txt` y `RelatedGuides` activos; barra de progreso de lectura global; `pnpm guides:check` en verde. Pendiente: fases BN/BO/BP.

## 1. Diagnóstico

### Fortalezas

- Producto completo: 35 herramientas activas, 0 «Próximamente», 4 hubs y directorio.
- SEO/GEO técnico sólido: auditoría 51/51, FAQ y JSON-LD en SSR, OG por ruta, `llms.txt`, sitemap y `robots` con bots de IA.
- Accesibilidad por encima de la media: axe limpio, teclado, foco, contraste y `prefers-reduced-motion`.
- Producción desplegada y verificada; el problema de deploy de la Fase BL quedó resuelto.
- Search Console ya conectado. Aún sin datos: las primeras fases no dependen de métricas.

### Riesgos

- **Datos sensibles al tiempo**: tasas de TSS/ISR, ITBIS, aguinaldo, tarifas eléctricas, combustible, certificados y tipo de cambio están repartidas en componentes.
- **Sin red de seguridad**: no hay CI ni tests de cálculo; un cambio en una fórmula o una tasa puede pasar desapercibido.
- **Dependencias**: `pnpm audit --prod` reporta 29 avisos (18 high), en su mayoría del árbol de build de Tailwind. `tailwindcss-animate` está en `dependencies` aunque solo se usa en `tailwind.config.ts`.
- **Enlaces internos débiles**: 13 herramientas no reciben ningún enlace contextual desde otra herramienta y solo 6 usan el bloque compartido `RelatedTools`.
- **Gráficos**: los canvas de interés compuesto no tienen alternativa textual; axe no detecta ese tipo de barrera.
- **Datos locales sin portabilidad**: 39 claves, incluyendo diarios, hábitos, pasos y planificador; no hay exportación, importación ni panel agregado.

### Oportunidades

- Guías editoriales propias que capten búsquedas informacionales y refuercen E-E-A-T.
- Páginas de metodología/fuentes y accesibilidad.
- Panel «Mi progreso» y backup local para convertir la colección de calculadoras en una app de seguimiento.
- Contenido en Markdown, editable y exportable, sin lock-in.

## 2. Criterios de orden

1. **Primero lo barato y seguro**: limpieza, baseline, a11y de gráficos y enlaces internos.
2. **Después lo que protege la confianza**: tasas centralizadas, fechas de revisión y tests.
3. **El contenido va en paralelo**: la estructura de guías se crea pronto para que el autor pueda escribir mientras se hace la parte técnica.
4. **Producto local-first al final**: «Mis datos» y «Mi progreso» son apuestas mayores y dependen de decisiones de alcance.
5. **No añadir otra calculadora ahora**: el roadmap está completo; la ventaja vendrá de profundidad, contenido y retención.

## 3. Secuencia recomendada

| Ola | Fase | Entregable | Esfuerzo | Impacto | Depende de |
|---|---|---|---|---|---|
| 1 | BN | Baseline, dependencias y medición | 0.5–1 día | Alto | — |
| 1 | BO | Accesibilidad de gráficos | 1 día | Medio | — |
| 1 | BP | Red de enlaces internos 2.0 | 1–2 días | Alto (SEO/UX) | — |
| 2 | BQ | Estructura de guías en Markdown | 1–2 días | Alto (desbloquea contenido) | — |
| 2 | BR | Tasas centralizadas y fechas de revisión | 2–3 días | Muy alto (confianza) | BN |
| 2 | BS | Tests de cálculo y CI | 2–4 días | Muy alto (regresiones) | BR |
| 2 | BT | Metodología/fuentes y accesibilidad | 1–2 días | Alto (E-E-A-T) | — |
| 2 | BU | Primeras guías publicadas | 2–3 días | Alto (tráfico) | BQ, BT |
| 3 | BV | «Mis datos»: exportar/importar | 2–3 días | Alto (confianza) | Decisión de alcance |
| 3 | BW | «Mi progreso»: panel local | 4–6 días | Muy alto (retención) | BV |
| 4 | BX | PWA/offline | 3–5 días | Medio | BV |
| 4 | BY | Performance data-driven | 1–2 días | Medio | PSI/GSC |
| 4 | BZ | `llms-full.txt` y GEO ampliado | 1 día | Medio | BQ/BU |
| 4 | CA | Next 16 / Tailwind 4 | Evaluar | — | No ahora |

> La secuencia no es estrictamente «fácil → difícil»: es una secuencia por dependencias. BN–BP son quick wins; BQ desbloquea el contenido; BR–BS protegen la exactitud; BV–BW son la apuesta de producto.

## 4. Ola 1 — Quick wins

### Fase BN — Baseline, dependencias y medición

**Objetivo:** dejar una foto del estado actual y quitar ruido técnico antes de tocar nada funcional.

Tareas:
- Confirmar en Search Console: propiedad, sitemap enviado, cobertura inicial y consultas (aunque todavía no haya datos).
- Guardar baseline de PageSpeed Insights de producción: home + 3 herramientas clave (móvil y escritorio).
- Mover `tailwindcss-animate` a `devDependencies` (solo se usa en `tailwind.config.ts`).
- Actualizar parches seguros: React/React DOM 19.3.1 y el último parche 15.5.x de Next si existe.
- Revisar `pnpm audit --prod` y documentar qué avisos quedan y por qué.
- No migrar a Next 16 ni Tailwind 4 en esta fase.

Aceptación:
- `tsc`, `lint` y `build` verdes.
- `pnpm audit --prod` con menos avisos y sin avisos runtime accionables.
- Baseline de PSI/GSC documentado en `plan.md` o en un anexo.

### Fase BO — Accesibilidad de gráficos

**Objetivo:** que los gráficos no dependan solo del canvas y del color.

Tareas:
- Auditar los 4 tools con Chart.js: interés compuesto, préstamo, perfil de riesgo y presupuesto.
- Añadir `role="img"` y `aria-label` con el mensaje principal del gráfico.
- Añadir una tabla de datos visible en `<details>` o una tabla visualmente oculta con los valores clave.
- Revisar que las series se distingan sin depender solo del color.
- Documentar la receta en `design.md` y en la skill `chart-chartsjs`.

Aceptación:
- Cada gráfico tiene alternativa textual comprobable.
- Navegación por teclado y lector de pantalla sin callejones.
- Axe sigue limpio.

### Fase BP — Red de enlaces internos 2.0

**Objetivo:** que ninguna herramienta quede aislada y que el usuario encuentre el siguiente paso natural.

Tareas:
- Crear un mapa de relaciones en `lib/related.ts` (o extender `lib/data.ts`).
- Garantizar 2–3 enlaces contextuales entrantes y salientes por herramienta.
- Estandarizar el bloque `RelatedTools`; hoy solo lo usan 6 componentes.
- Priorizar las 13 herramientas sin enlace contextual entrante: sueldo neto, aguinaldo, ITBIS, prestaciones, certificado, combustible, perfil de riesgo, planificador de compras, planificador de comidas, rutinas HIIT, seguimiento de hábitos, glosario y tracker de gastos.
- Evitar enlaces aleatorios: cada relación debe tener sentido de uso.

Aceptación:
- Todas las herramientas tienen al menos 2 enlaces contextuales entrantes desde otras herramientas.
- Sin URLs nuevas; auditoría 46/46.
- `design.md` y `create-tool` actualizados con el patrón.

## 5. Ola 2 — Confianza y contenido

### Fase BQ — Estructura de guías en Markdown

**Objetivo:** crear el pipeline para que el autor escriba guías en Markdown y el sitio las publique sin fricción.

Entregables:
- [x] `content/guias/` con `_template.md`, `_briefs/` y `README.md` editorial.
- [x] Parser de frontmatter (`lib/guides.ts`) y renderer Markdown server-side (`components/guides/guide-markdown.tsx`).
- [x] Rutas `/guias` y `/guias/[slug]` con visibilidad de borradores solo en desarrollo/preview.
- [x] `Article` + `FAQPage` + `BreadcrumbList` JSON-LD y OG dinámica por guía.
- [x] Sitemap, `llms.txt` y enlaces desde herramientas: activos con la primera guía publicada (`interes-compuesto-rd`). `RelatedGuides` enlaza automáticamente las guías publicadas desde sus herramientas.
- [x] `scripts/validate-guides.mjs`, comando `pnpm guides:check` y soporte de guías en `audit-seo.mjs`.
- [x] Skills `create-guide` y `guia-voz`; Humanizer instalado.
- [x] Tres guías para validar el pipeline: una publicada y dos en borrador para revisión.

Aceptación:
- Una guía draft renderiza en local/preview, queda `noindex` y no aparece en sitemap/llms.
- Al pasar a `draft: false`, aparece en `/guias`, sitemap, llms y auditoría.
- `audit:seo` valida también las guías.
- El autor puede escribir un `.md` y publicarlo sin tocar TSX.

### Fase BR — Tasas centralizadas y fechas de revisión

**Objetivo:** que actualizar una tasa sea un cambio de un solo sitio y que el usuario vea cuándo se revisó.

Tareas:
- Crear `lib/rates.ts` con valores, `effectiveFrom`, `source` y `reviewedAt`.
- Mover TSS (SFS/AFP y topes), escala ISR, ITBIS, tarifas eléctricas, combustible, referencia de certificados, tipo de cambio y reglas de aguinaldo.
- Mostrar «Datos revisados: …» en las herramientas financieras.
- Crear `docs/rates.md` con fuentes oficiales y checklist anual.
- No cambiar los valores en esta fase; solo centralizarlos.

Aceptación:
- No quedan tasas duplicadas en componentes.
- Los resultados numéricos no cambian.
- Cada herramienta financiera muestra fecha de revisión y fuente.

### Fase BS — Tests de cálculo y CI

**Objetivo:** proteger las fórmulas y las tasas con casos dorados.

Tareas:
- Extraer funciones puras de los cálculos de mayor riesgo: sueldo neto, aguinaldo, ITBIS, préstamo, interés compuesto, IMC, grasa corporal y calorías.
- Tests con casos conocidos (entradas → salida esperada).
- CI con `tsc`, `lint`, `build` y tests.
- Si no se aprueba Vitest, usar `node:test` y un script `pnpm verify:calc`; CI puede ser un workflow mínimo.

Aceptación:
- Los tests fallan si se cambia una tasa o fórmula sin actualizar el caso.
- CI verde en `dev`.
- Sin cambios de comportamiento.

### Fase BT — Metodología/fuentes y accesibilidad

**Objetivo:** dar transparencia y un lugar canónico para las fuentes.

Tareas:
- Página `/metodologia`: cómo se eligen fórmulas, fuentes, fecha de revisión, límites y política editorial.
- Página `/accesibilidad`: conformidad, limitaciones conocidas y contacto.
- Enlaces en footer, home y páginas relacionadas.
- OG, sitemap, `llms.txt` y auditoría actualizados.

Aceptación:
- Ambas páginas publicadas y enlazadas.
- Auditoría con las nuevas URLs en verde.
- Las guías y herramientas pueden enlazar a metodología/fuentes.

### Fase BU — Primeras guías publicadas

**Objetivo:** publicar 3 guías sólidas, con apoyo de brief, edición, fuentes y SEO. El autor revisa y corrige; el agente puede escribir el primer borrador.

Candidatas:
1. Interés compuesto en RD: 10% o 17% del sueldo, AFI y test de riesgo. **Publicada.**
2. Sueldo neto RD 2027: TSS, ISR y ejemplos. **Borrador listo para revisión.**
3. Grasa corporal: cómo medirla y qué hacer con el resultado. **Borrador listo para revisión.**
4. Aguinaldo: cálculo, exención y fecha de pago.
5. ITBIS: cómo calcularlo y cuándo aplica.
6. IMC vs. grasa corporal: cuál usar y cuándo.

Flujo:
- Creamos un brief por guía: intención, audiencia, tesis, outline, fuentes a verificar, ejemplos, enlaces y CTA.
- El autor escribe o corrige el borrador en Markdown; el agente puede preparar el primer draft.
- Editamos estructura, claridad, precisión, SEO y enlaces.
- Pasamos `pnpm guides:check` y `pnpm audit:seo`.
- Publicamos y enlazamos desde la herramienta principal y las relacionadas.

Aceptación:
- 3 guías publicadas, cada una con fuentes, FAQ, enlaces internos y OG.
- Sin contenido genérico, sin relleno y sin afirmaciones sin fuente.
- Enlaces bidireccionales guía ↔ herramienta.

## 6. Ola 3 — Producto local-first

### Fase BV — «Mis datos»: exportar/importar

**Objetivo:** que el usuario pueda respaldar y restaurar todo lo que guarda en su navegador.

Tareas:
- Página `/mis-datos` con lista de claves, tamaño y última actualización.
- Exportar JSON de todas las claves `holentia:*` (o de una selección).
- Importar JSON con validación de versión, forma y límites; nada se envía a red.
- Borrar una clave o todo; enlace desde `/ayuda` y Política de Cookies.
- Tests de round-trip y de import inválido.

Aceptación:
- Exportar → borrar → importar restaura los datos.
- Un archivo inválido no rompe la app y muestra un error claro.
- Cero peticiones de red.

> Decisión pendiente: en su momento se descartó export/import. Si sigue fuera de alcance, se puede hacer solo la vista read-only de claves o saltar esta fase.

### Fase BW — «Mi progreso»: panel local

**Objetivo:** reunir señales de las herramientas stateful para que el usuario vuelva con un propósito.

Tareas:
- Panel server-first con datos locales leídos en cliente.
- Resumen de hábitos, pasos, diarios, planificador de comidas y ahorro.
- Rachas, últimas entradas y «siguiente paso» recomendado.
- Empty states claros y enlaces a las herramientas.
- Sin escritura de datos salvo que el usuario actúe; sin red.
- Página noindex o solo app; no necesita SEO.

Aceptación:
- El panel funciona con datos parciales y sin datos.
- No mezcla datos de herramientas ni rompe esquemas existentes.
- Móvil, claro/oscuro y teclado correctos.

## 7. Ola 4 — Escala y opcional

### Fase BX — PWA/offline

Service worker, caché del shell y de herramientas, fallback offline y versionado. Depende de BV para no arriesgar datos. Mantener fuera hasta que «Mis datos» esté resuelto.

### Fase BY — Performance data-driven

Solo después de tener PSI/GSC. Optimizar las 3 rutas más pesadas o con peor CWV: `test-perfil-riesgo` (151 kB), `calculadora-prestamo` (145 kB), `calculadora-interes-compuesto` (139 kB), entre otras. Lazy-load de paneles y gráficos; medir antes/después.

### Fase BZ — `llms-full.txt` y GEO ampliado

Versión extendida para buscadores generativos: resúmenes, fórmulas, supuestos y FAQ de las guías y herramientas principales. Generarlo desde el contenido para no duplicar mantenimiento.

### Fase CA — Next 16 / Tailwind 4

No hacer ahora. Es una migración mayor, con riesgo alto y poco valor inmediato para el usuario. Reevaluar cuando haya una razón técnica o de seguridad.

## 8. Estructura de guías en Markdown

### 8.1 Directorio

```text
content/
  guias/
    README.md
    _template.md
    _briefs/
      sueldo-neto-rd-2027.md
      grasa-corporal.md
    sueldo-neto-rd-2027.md
    grasa-corporal-como-medirla.md
```

- `_briefs/` no se publica; es material de trabajo.
- `_template.md` no se renderiza; sirve para copiar.
- Cada guía publicada es un `.md` con frontmatter YAML y cuerpo Markdown puro.
- No se usa MDX: así el archivo se puede exportar a cualquier plataforma.

### 8.2 Frontmatter propuesto

```yaml
---
title: "Sueldo neto en RD 2027: TSS, ISR y ejemplos"
slug: "sueldo-neto-rd-2027"
description: "Calcula tu sueldo neto en RD para 2027: nueva escala de ISR, TSS, topes y tres ejemplos con montos reales. Sin registro."
excerpt: "Lo que ya cambió para 2027, lo que todavía falta y cómo hacer la cuenta con tu salario."
category: "finanzas"
primaryTool: "calculadora-sueldo-neto"
relatedTools:
  - "calculadora-aguinaldo"
  - "crear-presupuesto-personal"
publishedAt: "2026-10-20"
updatedAt: "2026-10-20"
reviewedAt: "2026-10-20"
author: "Daury DiCaprio"
keywords:
  - "sueldo neto RD"
  - "TSS"
  - "ISR"
sources:
  - title: "DGII — Escala de retención de asalariados"
    url: "https://..."
    accessedAt: "2026-10-20"
faq:
  - question: "¿Qué diferencia hay entre sueldo bruto y neto?"
    answer: "El bruto es lo que acuerdas antes de descuentos; el neto es lo que recibes después de TSS, ISR y otros descuentos."
draft: true
---
```

Reglas:
- `slug` debe coincidir con el nombre del archivo.
- `category`: `cuerpo`, `mente`, `relaciones`, `finanzas` o `general`.
- `primaryTool` y `relatedTools` deben existir en `lib/data.ts`.
- `description`: 120–155 caracteres, específica y sin clickbait.
- `sources`: mínimo 2 en finanzas/salud; mínimo 1 en general.
- `faq`: 3–6 preguntas; se usan para `FAQPage`.
- `draft: true` excluye la guía de build, sitemap y `llms.txt`.
- `reviewedAt` obligatorio en finanzas/salud.
- No incluir H1 en el cuerpo: el H1 sale del `title`.
- No usar HTML crudo ni componentes MDX.
- Enlaces internos con rutas absolutas (`/calculadora-...`, `/guias/...`).

### 8.3 Render y SEO

- `/guias`: índice server-rendered por categoría, con título, excerpt, fecha y lectura estimada. `CollectionPage` + `BreadcrumbList`.
- `/guias/[slug]`: artículo server-rendered; H1, autor, fechas, lectura, contenido, fuentes, FAQ y bloque de herramientas relacionadas. `Article` + `FAQPage` + `BreadcrumbList`.
- OG dinámica por guía con `ogTemplate`; título y subtítulo desde el frontmatter.
- Sitemap: `lastModified` desde `updatedAt`.
- `llms.txt`: sección `## Guías` con una línea por guía publicada.
- `audit:seo`: validar title, description, canonical, OG, JSON-LD, H1 único, fuentes y enlaces.
- Enlaces bidireccionales: la guía enlaza a herramientas; la herramienta muestra sus guías relacionadas.

### 8.4 Validación editorial y técnica

`pnpm guides:check` debe comprobar:
- Frontmatter completo y tipos correctos.
- Slug único y coincidente con el archivo.
- Categoría, herramientas y guías relacionadas existentes.
- Longitud de title/description.
- Al menos 3 H2 y un mínimo de palabras para publicadas.
- Sin `TODO`, `lorem ipsum`, placeholders ni H1 en el cuerpo.
- FAQ 3–6 y respuestas no vacías.
- Fuentes mínimas según categoría.
- Enlaces internos existentes.
- Fechas válidas y `updatedAt >= publishedAt`.
- Borradores excluidos de sitemap/llms.

La validación no mide voz humana. Para eso:
- El autor escribe el borrador.
- Se aplica la skill de humanización si está instalada (opcional).
- Revisión editorial: precisión, ejemplos, fuentes, tono y utilidad real.
- Prohibido publicar relleno genérico, afirmaciones sin fuente o experiencia inventada.

### 8.5 Briefs de guía

Cada brief debe incluir:
- Consulta objetivo e intención de búsqueda.
- Audiencia y contexto (RD, adultos, principiantes).
- Tesis o ángulo propio.
- Outline H2/H3.
- Preguntas que debe responder.
- Datos y fuentes a verificar.
- Ejemplos o experiencia personal que aportar.
- Herramienta principal y enlaces internos.
- Meta title/description.
- CTA.
- Qué evitar.

## 9. Decisiones pendientes

1. **CI/Vitest**: ¿se mantiene la restricción? Si sí, usar `node:test` + script local y CI mínimo.
2. **Export/import**: ¿se aprueba «Mis datos»? Si no, saltar BV o dejar solo lectura.
3. **Humanizer**: instalado. La skill `guia-voz` define el tono y `humanizer` hace el pase final.
4. **Guías publicadas**: el set inicial de cuatro está completo —`como-invertir-en-rd-desde-cero`, `interes-compuesto-rd`, `sueldo-neto-rd-2027` y `grasa-corporal-como-medirla`—, todas en `/guias`, sitemap y `llms.txt`. Siguiente: revisión anual de fuentes y ampliación del archivo.
5. **Autoría**: nombre y credenciales que aparecerán en las guías para E-E-A-T (por ahora, Daury DiCaprio).

## 10. Primer paso propuesto

La estructura editorial ya está montada, con cuatro guías publicadas y el índice rediseñado (destacada + tres recientes + archivo paginado de 4 en 4). El siguiente paso es:

1. **Mantenimiento editorial**: revisar fuentes, tasas y fechas de las cuatro guías; actualizar `updatedAt`/`reviewedAt` y las calculadoras vinculadas en el mismo cambio.
2. **Nuevas guías**: usar el brief, la portada generada con `cover` y el flujo de `create-guide`; el archivo crece de cuatro en cuatro sin tocar el índice.
3. **BN — Baseline, dependencias y medición** en paralelo: limpieza de dependencias, baseline PSI/GSC, sin cambios de UI.
4. **BO/BP** después: a11y de gráficos y red de enlaces internos.
