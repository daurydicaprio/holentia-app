"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpOptions {
  /** Duración en ms del conteo (default 500) */
  duration?: number
  /** Decimales al mostrar (default 0 → enteros) */
  decimals?: number
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Count-up compartido de HOLENTIA (design.md §6 Movimiento).
 * Devuelve el número animado hacia `value` cuando este cambia; el caller
 * lo envuelve con su formateador (formatCurrency, formatRD, toLocaleString…).
 * En JSX condicional usar el componente `<CountUp>` (components/ui/count-up.ts).
 * - Render inicial = valor final (sin hydration mismatch).
 * - No anima en el primer mount: la primera aparición la cubre `animate-result-in`.
 * - Al interrumpir a mitad (tecleo rápido) continúa desde el valor mostrado.
 * - Respeta prefers-reduced-motion (salta al final sin rAF).
 */
export function useCountUp(value: number, options?: CountUpOptions): number {
  const duration = options?.duration ?? 500
  const decimals = options?.decimals ?? 0

  const [display, setDisplay] = useState(value)
  const rafRef = useRef<number | null>(null)
  const fromRef = useRef(value)
  const displayRef = useRef(value)

  useEffect(() => {
    const target = Number(value.toFixed(decimals))

    if (prefersReducedMotion()) {
      fromRef.current = target
      displayRef.current = target
      setDisplay(target)
      return
    }

    if (fromRef.current === target && displayRef.current === target) return

    const from = fromRef.current === target ? displayRef.current : fromRef.current
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const current = from + (target - from) * easeOutCubic(t)
      displayRef.current = current
      setDisplay(current)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
        displayRef.current = target
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      // Continuar desde donde quedó la animación interrumpida.
      fromRef.current = displayRef.current
    }
  }, [value, decimals, duration])

  return decimals > 0 ? Number(display.toFixed(decimals)) : Math.round(display)
}
