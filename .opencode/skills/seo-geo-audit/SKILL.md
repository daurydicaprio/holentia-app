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
| 11 | Sitemap | `<loc>` presente; total = 5 informativas + 4 secciones + n herramientas | `sitemap.xml.body` |
| 12 | Hub | tarjeta visible y enlazada en la sección correcta | `app/{seccion}.html` |
| 13 | `noindex` | 0 apariciones (salvo `_not-found`, que lo lleva a propósito) | HTML |
| 14 | Persistencia (si aplica) | clave en la tabla de `politica-cookies` + botón «Borrar mis datos» + FAQ de privacidad coherente | `app/politica-cookies/page.tsx` |
| 15 | OG runtime | HTTP **200 `image/png`** (la URL en el HTML no garantiza que la imagen se genere) | `pnpm start` + curl |
| 16 | Prohibidos | sin `new Date()` en sitemap/páginas estáticas; sin `images` explícitos en metadata; bots de IA permitidos en `robots.ts` | código / `robots.txt` |

## 2. Barrido automatizado (todas las herramientas)

### 2.1 Estático (HTML prerenderado)

```bash
slugs=$(ls .next/server/app/*.html | sed 's|.*/||;s|\.html$||' \
  | grep -vE '^(index|finanzas|mente|cuerpo|relaciones|ayuda|apoyar|aviso-legal|politica-cookies|que-es-holentia|_not-found)$' | sort)

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
# Total sitemap = 9 + nº de herramientas (5 informativas + 4 hubs)
grep -c '<loc>' .next/server/app/sitemap.xml.body
# Hubs + informativas + home: og:image y canonical presentes
for r in index finanzas mente cuerpo relaciones ayuda apoyar aviso-legal politica-cookies que-es-holentia; do
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

Esperado: `og:200 image/png` en las 19. Comprobar también las no-herramienta: `/{ruta}/opengraph-image` (home = `/opengraph-image`).

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

> Añadir una fila por auditoría (barrido completo o por herramienta). El registro vive aquí.

## 5. Errores frecuentes

- **La URL de `og:image` en el HTML no garantiza que la imagen exista**: un 404 se cuela como URL válida. Siempre smoke runtime (§2.3).
- Meta description copiada del blurb de la tarjeta (27–47 ch) → snippet pobre. Escribirla aparte y medirla.
- Olvidar la línea de `llms.txt` **o** el recuento del header / README / architecture / skill `seo-geo` en el mismo commit.
- FAQ de privacidad con una clave inventada: debe coincidir con `lib/storage.ts` (`holentia:{slug}:draft:v1`).
- Herramientas sin persistencia: no llevan clave, pero la FAQ de privacidad sigue siendo obligatoria (responder que no se guarda nada).
- Recuentos globales al añadir herramienta: `llms.txt` (header + sección + línea), README (×2), architecture.md (×3), `seo-geo` (×2).
