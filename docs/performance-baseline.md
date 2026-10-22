# Baseline de rendimiento — 22-Oct-2026

> Producción medida: `holentia.com` en `448c529` (antes de BN). Build local medido después de BN, en `dev`.
> Objetivo: tener una foto antes de BP/BS y comparar después de BY.
> No es un sustituto de Core Web Vitals de campo: es la línea base que pudimos capturar hoy.

## PageSpeed Insights

La API pública de PSI devolvió **429 Quota exceeded** para la cuota anónima del proyecto. No se inventan métricas ni se presentan como si fueran de PSI.

Pendiente:
- Repetir PSI con API key propia o cuando se restablezca la cuota.
- Guardar móvil y escritorio de home + 3 herramientas clave.
- Cruzar con el informe de Core Web Vitals de Search Console.

## Respuesta de producción

Medición con `curl` desde el entorno de desarrollo, 3 pasadas por ruta, sin caché local. La mediana de TTFB es la referencia; la red del entorno no representa la de un móvil real.

| Ruta | HTTP | TTFB mediana | Bytes HTML |
|---|---:|---:|---:|
| `/` | 200 | 0,177 s | 24.650 |
| `/calculadora-sueldo-neto` | 200 | 0,095 s | 59.861 |
| `/calculadora-prestaciones-laborales` | 200 | 0,044 s | 65.232 |
| `/planificador-comidas` | 200 | 0,039 s | 50.126 |

## Presupuesto de build

Datos de `pnpm build` en `dev` después de BN (Next 15.5.27). First Load JS compartido: **103 kB**.

| Ruta | Tamaño de página | First Load JS |
|---|---:|---:|
| `/` | 978 B | 126 kB |
| `/calculadora-sueldo-neto` | 5,97 kB | 134 kB |
| `/calculadora-prestaciones-laborales` | 5,82 kB | 135 kB |
| `/planificador-comidas` | 14,2 kB | 139 kB |

## Search Console / Bing

Confirmado por el autor: propiedad verificada, sitemap enviado e indexación de la guía nueva solicitada. No se capturaron consultas ni impresiones porque todavía no hay una ventana de datos estable.

## Cómo repetirlo

```bash
# PSI con API key (no versionar la key)
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://holentia.com/&strategy=mobile&key=TU_API_KEY"

# Respuesta de producción
curl -sS -o /dev/null -w "http=%{http_code} ttfb=%{time_starttransfer}s bytes=%{size_download}\n" https://holentia.com/

# Presupuesto de build
pnpm build
```
