"use client"

import { useCountUp } from "@/hooks/use-count-up"

interface CountUpProps {
  value: number
  format: (n: number) => string
  duration?: number
}

/**
 * Contenedor del count-up compartido (design.md §Microanimaciones).
 * Usarlo donde el hook no pueda llamarse de forma incondicional
 * (JSX condicional: resultados de tests, fases, ramas ternarias).
 */
export function CountUp({ value, format, duration }: CountUpProps) {
  const animated = useCountUp(value, { duration })
  return <>{format(animated)}</>
}
