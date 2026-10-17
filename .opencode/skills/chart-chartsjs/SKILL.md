---
name: chart-chartsjs
description: Use when creating or fixing Chart.js graphs in HOLENTIA (gráfico de línea, doughnut/pastel, leyenda, tooltip, colores modo oscuro, chartColors, generateLabels, fontColor) — theming recipe, effect deps and known pitfalls.
---

# Gráficos Chart.js (v4)

Referencia canónica: `components/tools/compound-interest/calculator-charts.tsx`.

## Theming por tema

```tsx
const { resolvedTheme } = useTheme()          // next-themes
const chartColors = useMemo(
  () => ({
    line: "#66bb6a",                          // verde de sección (finanzas-light) en ambos modos
    text: resolvedTheme === "dark" ? "#e0e0e0" : "#1E3A2E",
    grid: resolvedTheme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
    tooltipBg: resolvedTheme === "dark" ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.9)",
    // …más colores por serie
  }),
  [resolvedTheme],
)
```

- **Memorizar siempre** con `useMemo([...resolvedTheme])` — recrear objetos en cada render dispara efectos en bucle.
- Efectos de crear/destruir chart: deps **`[datos, chartColors, resolvedTheme, …]`** para que el gráfico se reconstruya al cambiar de tema.

## Efecto canónico

```tsx
useEffect(() => {
  if (!ref.current) return
  instance.current?.destroy(); instance.current = null
  // …crear new Chart(ctx, {…})
  return () => { instance.current?.destroy(); instance.current = null }
}, [pieChartData, chartColors, resolvedTheme, isMobile])
```

## Carga: nunca en el bundle inicial (17-Oct-2026)

- **Componente de gráfico propio** → `next/dynamic` con `ssr:false` y skeleton `animate-pulse` que reserva altura (evita CLS):
  ```tsx
  const CalculatorCharts = dynamic(() => import("./calculator-charts").then((m) => m.CalculatorCharts), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-[400px]" aria-hidden />,
  })
  ```
- **Chart inline en un componente grande** (dona `PortfolioPie` del perfil de riesgo) → `import("chart.js/auto")` dentro del `useEffect`, con bandera `cancelled` y `instance.destroy()` en el cleanup; el tipo va con `import type { Chart as ChartJS } from "chart.js"` (no arrastra runtime):
  ```tsx
  let cancelled = false
  let instance: ChartJS | null = null
  import("chart.js/auto").then(({ default: Chart }) => {
    if (cancelled) return
    instance = new Chart(ctx, { … })
  })
  return () => { cancelled = true; instance?.destroy() }
  ```
- **Medir con el build**: la tabla de `pnpm build` (First Load JS) es la referencia; una tool no debe notar chart.js en su bundle inicial (el compuesto pasó de 251 a 139 kB). Presupuesto: ≤ ~150 kB.

## Errores conocidos (no volver a cometerlos)

1. **Leyenda con `generateLabels` personalizado**: Chart.js v4 dibuja el texto con `legendItem.fontColor` (`chart.cjs` lo lee directo en `ctx.fillStyle = legendItem.fontColor`). `labels.color` solo lo inyecta la `generateLabels` **por defecto**. Si overrideas, **cada item debe llevar `fontColor: chartColors.text`** — si no, queda `undefined` → texto NEGRO ilegible en modo oscuro.
   ```ts
   return data.labels.map((label, i) => ({
     text: `…`, fillStyle: backgroundColors[i], strokeStyle: backgroundColors[i],
     fontColor: chartColors.text,   // OBLIGATORIO
     lineWidth: 0, hidden: false, index: i,
   }))
   ```
2. Textos fijos `text-[#388e3c]` en títulos de gráfico: aceptable (verde sección, pasa AA large en ambos modos), pero preferir tokens si se toca.
3. Colores de series en oscuro: usar tonos `{s}-light`/`{s}-lighter` (claros) — los `{s}-dark` sobre fondo oscuro no se distinguen.
4. `options.plugins.legend.labels.color` y `tooltip.{title,body}Color: chartColors.text` — mantener sincronizados con `fontColor`.
5. **Leyenda en móvil**: los doughnut/radial con `position: "left"` aplastan el gráfico en pantallas <768px → `position: isMobile ? "bottom" : "left"` (el hook `useMediaQuery("(max-width: 768px)")` ya existe en `calculator-charts.tsx`). Las leyendas `"top"`/`"bottom"` pueden quedarse fijas.

## Si cambia este patrón

Actualizar esta skill y `design.md` §Modo oscuro en el mismo commit (regla de `AGENTS.md`).
