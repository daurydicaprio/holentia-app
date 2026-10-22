---
name: seo-geo-audit
description: Use when auditing SEO/GEO/llms of a HOLENTIA tool (auditoría de una herramienta nueva o existente, revisar metadata, FAQ, JSON-LD, OG image, llms.txt, sitemap, hubs, robots) — checklist de 16 puntos, barrido automatizado de todas las herramientas, criterios PASS/FAIL, flujo de corrección y registro de auditorías.
---

# Auditoría SEO/GEO/llms por herramienta (procedimiento canónico)

**Cuándo pasar esta auditoría**:

1. **Al crear una herramienta nueva** — paso final obligatorio, junto a `create-tool` y `seo-geo`. Ninguna herramienta se considera terminada sin los 16 puntos en PASS.
2. Al **modificar** metadata, FAQ, OG o llms.txt de una existente.
3. En **barridos globales** del sitio (herramientas + hubs + informativas + home).

Reglas de referencia (SSOT): skill `seo-geo` §1–5. Esta skill es el **procedimiento de verificación, corrección y registro**.

> Requisito previo del barrido: `pnpm build` reciente (los checks leen `.next/server/app/*.html`). Ejecutar desde la raíz del repo.

## 1. Checklist por herramienta (16 puntos)

| # | Punto | Criterio PASS | Fuente a revisar |
|---|---|---|---|
| 1 | `metaTitle` | ≤60 ch, keyword principal primero | `lib/data.ts` |
| 2 | `metaDescription` | 120–155 ch, **única en todo el sitio**, con beneficio + gancho | `lib/data.ts` |
| 3 | `<title>` | `{metaTitle} \| HOLENTIA` (template del layout) | HTML prerenderado |
| 4 | H1 | exactamente 1 | HTML |
| 5 | Canonical | autorreferencial `https://holentia.com/{slug}` | HTML |
| 6 | `og:image` | propia `/{slug}/opengraph-image` (con hash de convención) | HTML |
| 7 | `twitter:card` + `twitter:image` | `summary_large_image` + propia | HTML |
| 8 | JSON-LD | los 3 tipos presentes: WebApplication + BreadcrumbList + FAQPage | HTML |
| 9 | FAQ | 5–6 preguntas **visibles en el HTML inicial**; incluye la de privacidad con la clave `holentia:` real | `app/{slug}/page.tsx` |
| 10 | `llms.txt` | línea `- [Nombre](https://holentia.com/{slug}): …` + recuento del header coherente | `public/llms.txt` |
| 11 | Sitemap | `<loc>` presente; total = 5 informativas + 4 secciones + directorio + n herramientas | `sitemap.xml.body` |
| 12 | Hub | tarjeta visible y enlazada en la sección correcta | `app/{seccion}.html` |
| 13 | `noindex` | 0 apariciones (salvo `_not-found`, que lo lleva a propósito) | HTML |
| 14 | Persistencia (si aplica) | clave en la tabla de `politica-cookies` + botón «Borrar mis datos» + FAQ de privacidad coherente | `app/politica-cookies/page.tsx` |
| 15 | OG runtime | HTTP **200 `image/png`** (la URL en el HTML no garantiza que la imagen se genere) | `pnpm start` + curl |
| 16 | Prohibidos | sin `new Date()` en sitemap/páginas estáticas; sin `images` explícitos en metadata; bots de IA permitidos en `robots.ts` | código / `robots.txt` |

### 1b. Guías publicadas (checklist específico)

Una guía `draft: false` debe cumplir:

| # | Punto | Criterio PASS |
|---|---|---|
| G1 | Metadata | `guideMetadata`: title propio, description 120–155, canonical `/guias/{slug}` |
| G2 | Indexación | sin `noindex`; línea propia en `public/llms.txt`; `<loc>` en sitemap; el índice `/guias` también lleva línea en `llms.txt` |
| G3 | JSON-LD | `Article` + `BreadcrumbList` + `FAQPage` (FAQ ≥3; las guías usan 6) |
| G4 | OG | `app/guias/[slug]/opengraph-image.tsx` responde `200 image/png` y usa el título de la guía |
| G5 | H1/HTML | un H1, contenido y FAQ visibles en el HTML inicial; tablas y CTAs en SSR |
| G6 | Enlaces | herramienta principal y relacionadas existen en `lib/data.ts`; enlaces bidireccionales al publicar |

Las drafts se validan con `GUIDES_PREVIEW=1 pnpm build` + smoke manual, **no** con `audit:seo` (el script recorre el sitemap y las drafts no están).

## 2. Barrido automatizado (todas las herramientas)

### 2.0 Script `pnpm audit:seo` (primera opción, 17-Oct-2026)

```bash
pnpm build && pnpm audit:seo
```

`scripts/audit-seo.mjs` arranca `next start` en un puerto de auditoría y valida **cada ruta del sitemap** (hoy 46 herramientas/hubs/informativas; las guías publicadas se suman): title/description (rango en herramientas y guías), canonical autorreferencial, 0 `noindex`, `og:image` propia, twitter, JSON-LD por tipo de página, FAQ ≥5 (herramientas) / ≥3 (guías), línea en `llms.txt` para herramientas y guías, H1 ×1, estructura a11y (`lang="es-DO"`, skip link `#contenido`, `<main>` único) y **runtime OG** (`200 image/png`), más cobertura cruzada `llms.txt ⊆ sitemap`. Exit 1 si hay FAIL. `AUDIT_BASE=http://127.0.0.1:3000` reutiliza un server ya en marcha (p. ej. `pnpm start` en otra terminal). Los barridos manuales de §2.1–2.3 quedan para auditorías puntuales (una sola herramienta/guía) o diagnóstico fino.

### 2.1 Estático (HTML prerenderado)

```bash
slugs=$(ls .next/server/app/*.html | sed 's|.*/||;s|\.html$||' \
  | grep -vE '^(index|finanzas|mente|cuerpo|relaciones|herramientas|ayuda|apoyar|aviso-legal|politica-cookies|que-es-holentia|_not-found)$' | sort)

printf "%-38s %4s %4s %5s %4s %4s %4s %4s %4s %5s %4s %4s\n" "slug" "tLe" "dLe" "canon" "og" "tw" "ld+g" "tips" "Qs" "h1" "llms" "map"
for s in $slugs; do
  f=".next/server/app/$s.html"
  title=$(grep -o '<title>[^<]*' "$f" | head -1 | sed -e 's/<title>//' -e 's/ | HOLENTIA$//'); tl=${#title}
  desc=$(grep -o 'name="description" content="[^"]*' "$f" | head -1 | sed 's/name="description" content="//'); dl=${#desc}
  canon=$(grep -oF "rel=\"canonical\" href=\"https://holentia.com/$s\"" "$f" | wc -l | tr -d ' ')
  og=$(grep -oF "property=\"og:image\" content=\"https://holentia.com/$s/opengraph-image" "$f" | wc -l | tr -d ' ')
  tw=$(grep -o 'name="twitter:card" content="summary_large_image"' "$f" | wc -l | tr -d ' ')
  ld=$(grep -o 'application/ld+json' "$f" | wc -l | tr -d ' ')
  types=$(grep -o '"@type":"WebApplication"\|"@type":"BreadcrumbList"\|"@type":"FAQPage"' "$f" | sort -u | wc -l | tr -d ' ')
  qs=$(grep -o '"@type":"Question"' "$f" | wc -l | tr -d ' ')
  h1=$(grep -o '<h1' "$f" | wc -l | tr -d ' ')
  llms=$(grep -cF "](https://holentia.com/$s)" public/llms.txt | tr -d ' ')
  map=$(grep -cF "<loc>https://holentia.com/$s</loc>" .next/server/app/sitemap.xml.body | tr -d ' ')
  printf "%-38s %4s %4s %5s %4s %4s %4s %4s %4s %5s %4s %4s\n" "$s" "$tl" "$dl" "$canon" "$og" "$tw" "$ld" "$types" "$qs" "$h1" "$llms" "$map"
done
```

Esperado: `canon/og/tw/llms/map` = 1 · `tips` = 3 · `Qs` = 5–6 · `h1` = 1 · `tLe` ≤ 60 · `dLe` 120–155. (`ld+g` varía: ≥1 script; el glosario tiene extras legítimos.)

### 2.2 Extras estáticos

```bash
# Duplicados de metaDescription (debe salir vacío)
for s in $slugs; do grep -o 'name="description" content="[^"]*' ".next/server/app/$s.html" | head -1; done | sort | uniq -d
# noindex accidental (debe salir vacío)
grep -l 'noindex' .next/server/app/*.html | grep -v '_not-found' || echo "ninguno"
# Archivos OG presentes (debe salir vacío)
for s in $slugs; do [ -f "app/$s/opengraph-image.tsx" ] || echo "FALTA $s"; done
# new Date() prohibido en estáticas (debe salir vacío)
grep -n 'new Date()' app/sitemap.ts app/layout.tsx || echo "ninguno"
# Total sitemap = 10 + nº de herramientas (5 informativas + 4 hubs + directorio)
grep -c '<loc>' .next/server/app/sitemap.xml.body
# Hubs + directorio + informativas + home: og:image y canonical presentes
for r in index finanzas mente cuerpo relaciones herramientas ayuda apoyar aviso-legal politica-cookies que-es-holentia; do
  f=".next/server/app/$r.html"
  printf "%-22s og:%s canonical:%s\n" "$r" "$(grep -o 'property="og:image"' "$f" | wc -l | tr -d ' ')" "$(grep -o 'rel="canonical"' "$f" | wc -l | tr -d ' ')"
done
```

### 2.3 Runtime (OG de todas las rutas)

```bash
pnpm start > /tmp/opencode/holentia-start.log 2>&1 &
for i in $(seq 1 60); do grep -q "Ready" /tmp/opencode/holentia-start.log 2>/dev/null && break; sleep 0.5; done
for s in $slugs; do printf "%-38s " "$s"; curl -s -o /dev/null -w 'og:%{http_code} %{content_type}\n' "http://localhost:3000/$s/opengraph-image"; done
PID=$(ss -ltnp 2>/dev/null | grep ':3000 ' | sed -E 's/.*pid=([0-9]+).*/\1/' | head -1); [ -n "$PID" ] && kill "$PID"
```

Esperado: `og:200 image/png` en todas las herramientas. Comprobar también las no-herramienta: `/{ruta}/opengraph-image` (home = `/opengraph-image`).

## 3. Severidad y flujo de corrección

**FAIL duro — bloquea el push:**

- Falta canonical, `og:image`, `twitter:image` o cualquiera de los 3 tipos JSON-LD.
- `noindex` en una herramienta/hub, o bots de IA bloqueados.
- FAQ < 5 visibles o sin la pregunta de privacidad.
- OG runtime ≠ `200 image/png`.
- Sin línea en `llms.txt` o sin `<loc>` en sitemap.
- `metaDescription` duplicada.

**WARN — corregir antes del commit o justificar:**

- `metaDescription` fuera de 120–155 o `metaTitle` > 60.
- Recuentos desincronizados (`llms.txt` header, README, architecture, skill `seo-geo`).
- Texto visible contradice la meta (keywords prometidas y no cumplidas).

**Flujo**: corregir metadata en `lib/data.ts` · FAQ en `app/{slug}/page.tsx` · OG en `app/{slug}/opengraph-image.tsx` → `pnpm exec tsc --noEmit && pnpm lint && pnpm build` → repetir solo la parte afectada del barrido → commit en español → `dev` → merge `--ff-only` a `main` → push ambas.

## 4. Registro de auditorías

| Fecha | Alcance | Resultado | Correcciones |
|---|---|---|---|
| 17-Oct-2026 | 19 herramientas + 4 hubs + 5 informativas + home (29 rutas) | ✅ 29/29 PASS: metadata en rango, canonical/OG/twitter propios, JSON-LD completo, FAQ 5–6 visibles, llms.txt y sitemap al día, 0 `noindex`, 0 `new Date()`; OG runtime 29/29 `200 image/png` | Ninguna |
| 17-Oct-2026 | `diario-guiado` (mejoras) — targeted | ✅ PASS: metaTitle 48 ch · metaDescription 152 ch · FAQ ×6 visibles (nueva «¿Escribir un diario ayuda de verdad?» + privacidad con claves `entries` + `draft`) · canonical/OG/twitter/JSON-LD intactos · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `tecnicas-respiracion` (nueva, 20ª) — auditoría 16 puntos | ✅ PASS: metaTitle 48 ch · metaDescription 138 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 (WebApplication + Breadcrumb + FAQPage) · FAQ ×6 visibles · llms.txt línea 1/1 · sitemap 30 `<loc>` (hub mente enlaza) · 0 `noindex` · clave `holentia:tecnicas-respiracion:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `test-ansiedad` (nueva, 21ª) — auditoría 16 puntos | ✅ PASS: metaTitle 52 ch · metaDescription 153 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles · llms.txt línea 1/1 · sitemap 31 `<loc>` (hub mente enlaza) · 0 `noindex` · clave `holentia:test-ansiedad:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `calculadora-sueno` (nueva, 22ª) — auditoría 16 puntos | ✅ PASS: metaTitle 47 ch · metaDescription 140 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles · input `type="time"` en SSR · llms.txt línea 1/1 · sitemap 32 `<loc>` (hub mente enlaza) · 0 `noindex` · clave `holentia:calculadora-sueno:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `test-lenguajes-amor` (mejoras) — targeted | ✅ PASS: metaTitle 51 ch · metaDescription 147 ch única · FAQ ×6 visibles (nueva «¿Y si mi pareja y yo tenemos lenguajes distintos?» + privacidad con clave) · 0 clases `purple-*` (tokens `relaciones`) · canonical/OG/twitter/JSON-LD intactos · clave `holentia:test-lenguajes-amor:draft:v1` en politica-cookies · sitemap 32 sin cambios · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `test-apego` (nueva, 23ª) — auditoría 16 puntos | ✅ PASS: metaTitle 54 ch · metaDescription 151 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles · llms.txt línea 1/1 · sitemap 33 `<loc>` (hub relaciones enlaza) · 0 `noindex` · clave `holentia:test-apego:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `preguntas-profundas` (nueva, 24ª) — auditoría 16 puntos | ✅ PASS: metaTitle 50 ch · metaDescription 154 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles · pregunta y categorías en SSR · llms.txt línea 1/1 · sitemap 34 `<loc>` (hub relaciones enlaza) · 0 `noindex` · clave `holentia:preguntas-profundas:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `diario-parejas` (nueva, 25ª) — auditoría 16 puntos | ✅ PASS: metaTitle 50 ch · metaDescription 148 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles · «Pregunta de hoy»/historial/placeholder en SSR sin pregunta fechada (calculada tras el montaje) · llms.txt línea 1/1 · sitemap 35 `<loc>` (hub relaciones enlaza) · 0 `noindex` · claves `holentia:diario-parejas:entries:v1` + `:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `pasos-al-dia` (nueva, 26ª) — auditoría 16 puntos | ✅ PASS: metaTitle 48 ch · metaDescription 154 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles · fecha y «últimos 7 días» calculados tras el montaje (sin días de la semana en el SSR) · llms.txt línea 1/1 · sitemap 36 `<loc>` (hub cuerpo enlaza) · 0 `noindex` · claves `holentia:pasos-al-dia:draft:v1` + `:entries:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `calculadora-imc` (nueva, 27ª) — auditoría 16 puntos | ✅ PASS: metaTitle 55 ch · metaDescription 147 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles · resultado solo con datos válidos (nada de cálculos en el SSR) · llms.txt línea 1/1 · sitemap 37 `<loc>` (hub cuerpo enlaza) · 0 `noindex` · clave `holentia:calculadora-imc:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `calculadora-calorias` (pulido) — targeted | ✅ PASS: FAQ ×6 (nueva «¿Cuánto peso puedo bajar a la semana?») · metaTitle «Calculadora de calorías diarias (Mifflin-St Jeor)» (49 ch) · números `es-DO` (antes `es-ES`) · 0 clases `amber-*` (tokens `cuerpo`) · héroe con dark y chips con contraste corregido (texto oscuro sobre el gradiente ámbar) · canonical/OG/sitemap intactos · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `calculadora-hidratacion` (pulido) — targeted | ✅ PASS: FAQ ×6 (nueva «¿El café, el té o las infusiones cuentan como agua?») · metaTitle «Calculadora de hidratación diaria (EFSA/NASEM)» (46 ch) · metaDescription corregida (decía «Watson»; el cálculo real es 35 ml/kg + aditivos EFSA/NASEM) 142 ch · números `es-DO` · 0 clases `amber-*` (tokens `cuerpo`) · héroe con dark y chips con contraste corregido · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Cuerpo completo (calorías · hidratación · pasos · IMC) — pase UI/UX móvil (espaciado, tipografía, contraste) | ✅ PASS: metadata/canonical/OG/twitter/JSON-LD intactos · FAQ ×6 por herramienta visibles en SSR · receta de input unificada (`text-lg` ≥16px sin zoom iOS, foco `ring-2` canónico, `type="text"` + `inputMode` con saneado) · filas que no cabían (presets de 3 col, peso/estatura con sufijo kg/lb) apiladas en móvil · h2 internos a `text-xl` · tap targets ≥40px (steppers `h-10 w-10`) · contraste AA corregido con tokens `cuerpo` (texto en `gray-900` sobre ámbar, `cuerpo-darkest`, 0 `/opacidad` muertos) · 4 páginas 200 + OG `200 image/png` | Ninguna |
| 17-Oct-2026 | Mente completo (ansiedad GAD-7 · sueño · respiración · diario) — pase UI/UX móvil (espaciado, tipografía, contraste) | ✅ PASS: metadata/canonical/OG/twitter/JSON-LD intactos · contenido clave y FAQ visibles en SSR (H1 ×1, 0 `noindex`) · etiquetas del héroe de ansiedad a `text-white` sólido (3.8→4.6:1) · subtextos sobre `mente-lighter` a `gray-700`/`gray-200` (2.7→5.9:1, respiración y sueño) · input de hora con receta unificada (`text-lg`, foco `ring-2`) · textareas con placeholder en ambos modos · opciones/segmentados con press feedback `active:scale-[0.97]` · tarjetas `p-6` y h2 a `text-xl` · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Relaciones completo (lenguajes del amor · apego · preguntas profundas · diario de parejas) — pase UI/UX móvil (espaciado, tipografía, contraste) | ✅ PASS: metadata/canonical/OG/twitter/JSON-LD intactos · contenido clave y FAQ visibles en SSR (H1 ×1, 0 `noindex`) · `relaciones-light` a 14px (3.1:1) corregido a `relaciones-lighter` (porcentajes y enlaces cruzados) · subtexto sobre `relaciones-lighter` a `gray-700`/`gray-200` (2.6→5.9:1) · textarea de parejas con receta unificada (16px y `ring-2`; era `text-sm`/`ring-1`) · h2 a `text-xl` · press feedback en opciones/categorías · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Finanzas tanda 1 (aguinaldo · ITBIS · certificado · combustible · consumo eléctrico) — pase UI/UX móvil (espaciado, tipografía, contraste) | ✅ PASS: metadata/canonical/OG/twitter/JSON-LD intactos · contenido clave y FAQ visibles en SSR (H1 ×1, 0 `noindex`) · input canónico con icono (`py-2.5 pl-10 pr-3 text-lg`; fuera `md:text-sm`/`shadow-sm`) · 6 `type="number"` → `type="text"` + `inputMode` con saneado (5 de combustible + kWh) · hero `/85` → `text-white` (4.2→5.0:1 en móvil) · `finanzas-light` a 14px → `finanzas-lighter` (3.6→5.2:1) · `bg-finanzas`+blanco → `bg-finanzas-dark` en banda/segmentados (4.1→7.9:1) · chips `py-2.5`, iconos de campo con dark, tarjetas `p-6` · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Finanzas tanda 2 (préstamo · interés tarjeta · corte/vencimiento · interés compuesto) — pase UI/UX móvil (espaciado, tipografía, contraste) | ✅ PASS: metadata/canonical/OG/twitter/JSON-LD intactos · contenido clave y FAQ visibles en SSR (H1 ×1, 0 `noindex`) · 8 `type="number"` → `type="text"` + `inputMode` con saneado · inputs canónicos (variante `text-base` para texto libre/`type="date"`; `ui/Input` anulado con `h-auto md:text-lg`) · héroes `text-white` sólido + cajas `bg-black/20` (`white/15–20` ≈3.8–4.1:1) · badge `#22c55e`+blanco (2.3:1) → `finanzas-dark` · sólidos/tabs `bg-finanzas`+blanco → `bg-finanzas-dark` (4.1→7.9:1) · `finanzas-light` a 14–18px → `finanzas-lighter` · rojos `red-500` (2.9–3.3:1) → `red-600`/`red-700` · estilos inline de color sustituidos por clases (dark mode real) · hex `#6a9c77`/`#4caf50` fuera (charts on-token `#66bb6a`) · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Finanzas tanda 3 (presupuesto · gastos hormiga · ahorros · compras · perfil de riesgo · glosario) — pase UI/UX móvil (espaciado, tipografía, contraste) | ✅ PASS: metadata/canonical/OG/twitter/JSON-LD intactos · contenido clave y FAQ visibles en SSR (H1 ×1, 0 `noindex`; glosario 4 bloques JSON-LD) · 4 `type="number"` → `type="text"` + `inputMode` con saneado (tracker, compras, tablas del presupuesto) · tablas editables con borrador local (comas/puntos parciales) · salvia dark `#6a9c77` (2.7:1) → `#a5d6a7` · `text-finanzas` 12px → `finanzas-dark` · sólidos/tabs/chips/badges `bg-finanzas`+blanco → `bg-finanzas-dark` (4.1→7.9:1) · héroe del test `bg-black/20` + blancos sólidos · `green-600` (3.3:1) → `green-700` · tap targets (rotos `w-6 h-6` → `h-10 w-10`, dots → `h-10 w-10`, cierres → `h-11 w-11`) · `p-4/p-5` → `p-5/p-6` donde había inconsistencia · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Superficies globales (chrome: tabs de sección · menú · footer · shell de herramienta · home/hubs · 5 informativas) — pase UI/UX móvil (espaciado, tipografía, contraste, tap targets) | ✅ PASS: metadata/canonical/OG/twitter/JSON-LD intactos · contenido clave en SSR (H1 ×1, canonical ×1, 0 `noindex`; 13 rutas) · base de sección a 12–14px corregida a tiers AA (tabs activas: cuerpo `-darkest` 3.8→5.6 y finanzas `-dark` 4.1→7.9; botón «Ver todas»; botones del shell; crédito del footer; ítem activo del menú: mente sobre `gray-100` 4.2→7.9 y en oscuro relaciones sobre `gray-800` 2.6→5.4) · categoría de ToolCard `text-white` sólido (3.4–3.8→4.6–5.7; cuerpo conserva `text-black/70` 6.2) · hover del FAQ con tiers · H1 del shell en cuerpo `-darkest` · descripción del shell `max-w-2xl leading-relaxed` (medida estirada en escritorio) · tap targets en enlaces de texto (tabs `py-2.5` 40px, nav del footer `py-1.5`, «Volver» `py-3` 44px) · `hover:bg-red-500`→`red-600` en el borrado total (3.8→4.8) · `error.tsx` monocromo (fuera `bg-blue-600`) · ritmo de informativas `space-y-12` · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Barrido automatizado completo (37 rutas) — Fase AW | ✅ 37/37 PASS · 0 FAIL · 0 WARN: title/description, canonical ×1, 0 `noindex`, `og:image` propia, twitter, JSON-LD por tipo de página, FAQ ≥5, H1 ×1, estructura a11y (`lang="es-DO"`, skip link `#contenido`, `<main>` único) y runtime OG `200 image/png`; cobertura `llms.txt ⊆ sitemap`; script nuevo `pnpm audit:seo` (`scripts/audit-seo.mjs`) | Skip link + `#contenido` + `<main>` del 404 + `lang` del `global-error` (Fase AW); sin hallazgos SEO/GEO |
| 17-Oct-2026 | `calculadora-sueldo-neto` (nueva, 28ª) — auditoría 16 puntos | ✅ PASS: metaTitle 46 ch · metaDescription 144 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 (WebApplication + Breadcrumb + FAQPage) · FAQ ×6 visibles (bruto vs. neto, topes TSS 2026, ISR por tramos, quincena, bonificaciones, privacidad con clave) · estado vacío en SSR (0 cálculos prerenderados) · llms.txt línea 1/1 · sitemap 38 `<loc>` (hub finanzas enlaza) · 0 `noindex` · clave `holentia:calculadora-sueldo-neto:draft:v1` en politica-cookies · presupuesto 132 kB First Load · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | Directorio `/herramientas` (ruta nueva de índice, Fase AZ) — targeted | ✅ PASS: metadata propia · H1 ×1 · canonical/OG/twitter propias · JSON-LD `CollectionPage + BreadcrumbList` (`directoryJsonLd`) · clasificación nueva `COLLECTIONS` en `scripts/audit-seo.mjs` (hubs + directorio) · 29 herramientas por sección en SSR (chips ancla + «Ver sección») · llms.txt `## Directorio` 1/1 · sitemap 40 `<loc>` · enlace en el footer (server-rendered) · 0 `noindex` · OG runtime `200 image/png` | Ninguna |
| 17-Oct-2026 | `calculadora-prestaciones-laborales` (nueva, 29ª) — auditoría 16 puntos | ✅ PASS: metaTitle 51 ch · metaDescription 144 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles (motivo, cesantía con ejemplo 2a4m→48 días, preaviso, vacaciones+Navidad, ÷23.83, privacidad con clave) · estado vacío en SSR (0 cálculos prerenderados) · llms.txt línea 1/1 · sitemap 40 `<loc>` (hub finanzas enlaza) · 0 `noindex` · clave `holentia:calculadora-prestaciones-laborales:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 18-Oct-2026 | `calculadora-proteina-diaria` (nueva, 30ª) — auditoría 16 puntos | ✅ PASS: metaTitle 48 ch · metaDescription 147 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles (cuánta, ganar músculo con 1,2–1,6 g/kg, exceso, reparto, suplementos, privacidad con clave) · estado vacío en SSR · llms.txt línea 1/1 · sitemap 41 `<loc>` (hub cuerpo enlaza) · 0 `noindex` · clave `holentia:calculadora-proteina-diaria:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 18-Oct-2026 | `test-calidad-sueno` (nueva, 31ª) — auditoría 16 puntos | ✅ PASS: metaTitle 41 ch · metaDescription 152 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles (qué mide, puntuación, despertares, horas, apnea/insomnio, privacidad con clave) · intro en SSR y resultado solo tras responder · llms.txt línea 1/1 · sitemap 42 `<loc>` (hub mente enlaza) · 0 `noindex` · clave `holentia:test-calidad-sueno:draft:v1` en politica-cookies · OG runtime `200 image/png` | Ninguna |
| 18-Oct-2026 | Barrido automatizado completo (42 rutas) — Fases BB + BC | ✅ 42/42 PASS · 0 FAIL · 0 WARN: title/description, canonical ×1, 0 `noindex`, `og:image` propia, twitter, JSON-LD por tipo de página, FAQ ≥5, H1 ×1, estructura a11y y runtime OG `200 image/png`; cobertura `llms.txt ⊆ sitemap` | Sin hallazgos |
| 18-Oct-2026 | `calculadora-calorias` (corrección de proteína + diferenciación, Fase BD) — targeted | ✅ PASS: metaDescription 141 ch con «rango de proteína» · FAQ ×7 (nueva «¿Cuánta proteína debo comer al día?») · tarjeta «Tu proteína diaria» calculada con `lib/protein.ts` (déficit 1,6–2,2 · fuerza 1,2–1,6 · sedentario 0,8–1,0) · enlaces cruzados con `calculadora-proteina-diaria` · canonical/OG/JSON-LD intactos · llms.txt actualizado · OG runtime `200 image/png` · audit 42/42 | Ninguna |
| 18-Oct-2026 | Red de enlaces de cuerpo + favicon + pulido móvil/contraste (Fase BE) — targeted | ✅ PASS: `RelatedTools` en calorías, proteína, IMC, pasos e hidratación; test de calidad del sueño enlazado desde calorías/pasos; metaDescription del hub Cuerpo 149 ch con proteína; canonical/OG/twitter/JSON-LD y FAQ intactos; favicon `/icon.svg` y `/apple-icon.png` 200 con H de marca; contraste AA corregido sobre `dark:bg-cuerpo-dark`; audit 42/42 · 0 FAIL · 0 WARN | Ninguna |
| 18-Oct-2026 | Layout equilibrado + enlaces contextuales (proteína, hidratación, combustible, corte, diarios) — targeted | ✅ PASS: 31 herramientas / 42 URLs / 42 OG / 17 «Próximamente»; `pnpm audit:seo` 42/42 · 0 FAIL · 0 WARN; sitemap 42 `<loc>`; H1 SSR correcto en hidratación; canonical/OG/twitter/JSON-LD intactos; 43 enlaces internos únicos, 0 rotos; nuevas rutas contextuales verificadas con resultado (proteína→calorías, combustible→luz, corte→interés, interés→préstamo, aguinaldo→ahorros, sueldo→presupuesto, certificado→compuesto, parejas→apego); Playwright 1440/390 px claro/oscuro, huecos ≤~100 px; OG runtime `200 image/png` | Ninguna |
| 18-Oct-2026 | Accesibilidad real (axe-core 4.11 + teclado/foco) — Fase BG | ✅ 42 rutas × claro/oscuro × 1440/390 = **168/168 sin violaciones**; estados de resultado en calculadoras, tests, diarios, presupuesto, tracker y glosario: 0; 8 flujos de teclado con foco visible; skip link, menú Enter/Escape y back móvil OK; `pnpm audit:seo` 42/42 PASS; SEO/GEO intacto | Hallazgos corregidos: back móvil sin nombre; contraste mente 12–14px; header/logo cuerpo móvil; `gray-500` dark en cookies; `heading-order`; labels/select/sliders/tablas; kg/cm dark; red-400 dark |
| 19-Oct-2026 | Poda del roadmap: 17 → 3 tarjetas «Próximamente» (Fase BH) — targeted | ✅ PASS: 31 herramientas / 42 URLs / 42 OG / **3 «Próximamente»** (hábitos, HIIT, planificador de comidas); `pnpm audit:seo` 42/42 · 0 FAIL · 0 WARN; sin cambios de rutas, sitemap, metadata, JSON-LD ni OG; relaciones y finanzas sin toggle de próximas | Ninguna |
| 19-Oct-2026 | `seguimiento-habitos` (nueva, 32ª) — auditoría 16 puntos | ✅ PASS: metaTitle 38 ch · metaDescription 133 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles (funcionamiento, racha, meta semanal, editar/eliminar, privacidad con clave, sincronización) · estado vacío SSR con formulario y skeleton de carga · llms.txt línea 1/1 y total 32 · sitemap 43 `<loc>` (hub mente enlaza) · 0 `noindex` · clave `holentia:seguimiento-habitos:entries:v1` en politica-cookies · 0 referencias a los dos componentes muertos eliminados · OG runtime `200 image/png` · audit 43/43 | Ninguna |
| 19-Oct-2026 | `rutinas-hiit` (nueva, 33ª) — auditoría 16 puntos | ✅ PASS: metaTitle 46 ch · metaDescription 147 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles (qué es, duración/intervalos, casa sin equipo, frecuencia, seguridad, privacidad con clave) · preferencias en `holentia:rutinas-hiit:draft:v1` sin historial · llms.txt línea 1/1 y total 33 · sitemap 44 `<loc>` (hub cuerpo enlaza) · 0 `noindex` · OG runtime `200 image/png` · audit 44/44 · axe 12/12 estados (idle/running/done × claro/oscuro × 1440/390) | Ninguna |
| 19-Oct-2026 | `planificador-comidas` (nueva, 34ª) — auditoría 16 puntos | ✅ PASS: metaTitle 52 ch · metaDescription 151 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles (funcionamiento, comidas propias, lista, semanas, límites nutricionales, privacidad con clave) · planner 7×3 y weeks en `holentia:planificador-comidas:entries:v1` sin historial · `<dialog>` nativo con foco restaurado · llms.txt línea 1/1 y total 34 · sitemap 45 `<loc>` (hub cuerpo enlaza) · 0 `noindex` · OG runtime `200 image/png` · audit 45/45 · axe 12/12 estados (idle/plan/editor × claro/oscuro × 1440/390) | Ninguna |
| 19-Oct-2026 | Rendimiento de campo + a11y fina (Fase BL) — planificador y chrome | ✅ PASS: Lighthouse 13.5 sobre producción y build local (Chrome headless vía CDP) · baseline prod móvil 79 (TBT 750 ms) y desktop 98 (CLS 0.093) · `label-content-name-mismatch` 21→0 nodos, CLS 0.093→0, LCP 2.5→2.1 s · local móvil 87-88 de mediana y desktop 100 · a11y/BP/SEO 100 · axe 12/12 · `audit:seo` 45/45 · header SSR de 60/144 px sin salto | Ninguna |
| 20-Oct-2026 | `calculadora-grasa-corporal` (nueva, 35ª) — auditoría 16 puntos | ✅ PASS: metaTitle 46 ch · metaDescription 140 ch única · H1 ×1 · canonical/OG/twitter propias · JSON-LD ×3 · FAQ ×6 visibles (fórmula, exactitud, medición, rangos, IMC vs. grasa, privacidad con clave) · estado vacío en SSR · método US Navy (cm) + Siri, rangos ACE y validaciones de rango/relación · llms.txt línea 1/1 y total 35 · sitemap 46 `<loc>` (hub cuerpo enlaza) · 0 `noindex` · clave `holentia:calculadora-grasa-corporal:draft:v1` en politica-cookies · OG runtime `200 image/png` · `audit:seo` 46/46 · axe 8/8 estados (idle/resultado × claro/oscuro × 1440/390) · QA funcional (hombre/mujer, kg/lb, borrado/recarga), teclado y capturas claro/oscuro | Ninguna |
| 20-Oct-2026 | Renderer de guías `/guias` + `/guias/[slug]` (Fase BQ) — preview | ✅ PASS (preview): 2 borradores renderizados con `GUIDES_PREVIEW=1` · H1 ×1 · canonical propia · `noindex, nofollow` · `Article` + `BreadcrumbList` + `FAQPage` (6 preguntas) · OG dinámica `200 image/png` (guía + índice) · índice con banner de preview · sitemap 46 `<loc>` sin guías · audit 46/46 sin cambios · `guides:check` 2/2 | Ninguna |
| 20-Oct-2026 | `interes-compuesto-rd` publicada + `RelatedGuides` + sitemap/`llms.txt` | ✅ PASS: metaTitle 54 ch · metaDescription 138 ch única · H1 ×1 · canonical/OG/twitter propias · `Article` + `BreadcrumbList` + `FAQPage` (6 preguntas) + `citation` de 4 fuentes DGII/SIMV · índice `/guias` indexable con 1 guía publicada y 2 borradores fuera de producción · `RelatedGuides` server-rendered en calculadora de interés compuesto, test de perfil, sueldo neto y planificador de ahorros · llms.txt 2 líneas (`/guias` + guía) · sitemap 48 `<loc>` · 0 `noindex` en la guía publicada · OG dinámica `200 image/png` · `guides:check` 3/3 · `audit:seo` 48/48 · 0 FAIL · 0 WARN | Ninguna |
| 21-Oct-2026 | Set editorial de 4 guías + índice rediseñado + barra de progreso global | ✅ PASS: 4 guías publicadas (inversión desde cero, interés compuesto, sueldo 2027, grasa corporal) · nueva guía metaTitle 55 ch / metaDescription 137 ch · H1 ×1 · canonical/OG/twitter propias · `Article` + `BreadcrumbList` + `FAQPage` (6 preguntas) + `citation` (7 fuentes) · índice `/guias` indexable con destacada + 3 recientes + archivo paginado de 4 en 4 y portadas por tokens · `llms.txt` 5 líneas (índice + 4 guías) · sitemap 51 `<loc>` · 0 `noindex` · OG runtime `200 image/png` en las 51 rutas · `guides:check` 4/4 · `audit:seo` 51/51 · axe 20/20 (índice + 4 guías × claro/oscuro × 390/1280) · QA funcional 14/14 (menú «Guías» antes de «¿Qué es Holentia?», logo centrado, nav sticky, tap targets 44 px, progreso 0→50→100, tema oscuro) · QA visual 390/768/1280 claro y 390/1280 oscuro | Ninguna |
| 21-Oct-2026 | Rediseño foto-led de `/guias` + limpieza de etiquetas redundantes | ✅ PASS: 4 fotos locales 1600×1000 en `public/guias/` (sin peticiones a terceros) · 0 «Leer guía», 0 categoría, 0 «Guía destacada» y 0 «También te puede interesar» en el HTML · 1 destacada 16/9 + 3 compactas 6/5 + «Últimas guías» 3/2 ×4 · paginación oculta con una sola página · detalle sin etiqueta de categoría · `GuideToolLinks` sin eyebrows · `Article.image` y `hasPart.image` con URL absoluta · `imageAlt` validado por `guides:check` · sitemap 51 `<loc>` · 0 `noindex` · `guides:check` 4/4 · `audit:seo` 51/51 · axe 20/20 · sin overflow 320–1440 claro/oscuro · foco visible en tarjetas | Ninguna |
| 21-Oct-2026 | Verificación SEO/GEO previa a producción (`main`) — índice y 4 guías | ✅ PASS: `audit:seo` 51/51 · 0 FAIL · 0 WARN · `guides:check` 4/4 · índice con canonical/OG/twitter y `CollectionPage` + `BreadcrumbList`, `hasPart.image` 4/4 · guías con description 120–155, canonical/OG/twitter propias, H1 ×1, 0 `noindex`, `Article` + `BreadcrumbList` + `FAQPage` (6 preguntas visibles), `citation` 7/7/4/5, `Article.image` absoluta, tablas 3/2/5/3 y CTA «Calcula tu caso» en SSR · `llms.txt` 5/5 líneas (índice + 4 guías) · sitemap 51 `<loc>` · robots con GPTBot/ClaudeBot/PerplexityBot/Google-Extended + `*` y sitemap · OG runtime `200 image/png` en las 51 rutas | Ninguna |
| 22-Oct-2026 | Cierre de lanzamiento de `/guias`: archivo sin duplicados, imágenes optimizadas y `seoTitle` | ✅ PASS: 4 tarjetas, 4 enlaces y 4 imágenes únicas (antes 8/8/8) · «Últimas guías» oculto con 4 guías · `next/image` con `srcSet` y AVIF/WebP (384 px 3,6 KB; 1080 px 13,5 KB; 1920 px 26 KB frente a 144 KB del JPEG original) · `sharp` 0.35.5 · `seoTitle` en 3 guías, `<title>` final 53/47/52/54 ch · `guides:check` 4/4 · `tsc` · `lint` · build 107 páginas · `audit:seo` 51/51 · OG runtime 200 `image/png` | Ninguna |
| 22-Oct-2026 | Guía pilar «Prestaciones laborales en RD» (5ª) + límites de la calculadora | ✅ PASS: `seoTitle` 48 ch · `<title>` final 59 ch · metaDescription 134 ch · H1 ×1 · canonical/OG/twitter propias · `Article` + `BreadcrumbList` + `FAQPage` (6 preguntas visibles) + `citation` (7 fuentes MT/Código/DGII/SIDEL) · foto local 1600×1000 (85 KB) con AVIF 384/1080/1920 px (3,6/11,8/22,9 KB) · `/guias` con 5 enlaces y 5 imágenes únicas (destacada nueva + 3 compactas + 1 en «Últimas guías», sin duplicados) · enlaces bidireccionales en prestaciones, sueldo neto y aguinaldo · ejemplos 30k/50k/80k al 30-Sep-2026 con divisor 23.83 · calculadora alineada: preaviso 6 meses = 7 días, cesantía 6 meses = 13 días, vacaciones 5 años = 18 días, tope de Navidad documentado y nota de dimisión justificada (arts. 97/101) · 19/19 casos de borde · `llms.txt` 6 líneas (índice + 5 guías) · sitemap 52 `<loc>` · 0 `noindex` · OG runtime `200 image/png` (37,9 KB) · `guides:check` 5/5 · `tsc` · `lint` · build 108 páginas · `audit:seo` 52/52 · 0 FAIL · 0 WARN | Ninguna |

> Añadir una fila por auditoría (barrido completo o por herramienta). El registro vive aquí.

## 5. Errores frecuentes

- **La URL de `og:image` en el HTML no garantiza que la imagen exista**: un 404 se cuela como URL válida. Siempre smoke runtime (§2.3).
- Meta description copiada del blurb de la tarjeta (27–47 ch) → snippet pobre. Escribirla aparte y medirla.
- Olvidar la línea de `llms.txt` **o** el recuento del header / README / architecture / skill `seo-geo` en el mismo commit.
- FAQ de privacidad con una clave inventada: debe coincidir con `lib/storage.ts` (`holentia:{slug}:draft:v1`).
- Herramientas sin persistencia: no llevan clave, pero la FAQ de privacidad sigue siendo obligatoria (responder que no se guarda nada).
- Recuentos globales al añadir herramienta: `llms.txt` (header + sección + línea), README (×2), architecture.md (×3), `seo-geo` (×2).
