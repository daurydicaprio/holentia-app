"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Info, ChevronDown } from "lucide-react"

interface DisclosureProps {
  /** Etiqueta con information scent: nombra qué hay dentro (ej. "Ver detalles: penalidades"). */
  label: string
  children: ReactNode
  align?: "left" | "center"
  tone?: "green" | "light"
  className?: string
}

/** Contenedor progresivo: resumen visible, detalle plegado (patrón FAQ de app/ayuda). */
export function Disclosure({ label, children, align = "left", tone = "green", className = "" }: DisclosureProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  // Remonta el contenido en cada apertura para que la microanimación se repita.
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    const el = detailsRef.current
    if (!el) return
    const onToggle = () => setNonce((n) => n + 1)
    el.addEventListener("toggle", onToggle)
    return () => el.removeEventListener("toggle", onToggle)
  }, [])

  const summaryTone =
    tone === "light"
      ? "text-white/90 hover:text-white"
      : "text-[#388e3c] dark:text-[#81c784] hover:text-[#1b5e20] dark:hover:text-[#a5d6a7]"
  const contentTone = tone === "light" ? "text-white/85" : "text-gray-600 dark:text-gray-400"

  return (
    <details ref={detailsRef} className={`group ${className}`}>
      <summary
        className={`flex cursor-pointer list-none select-none items-center gap-2 text-sm font-medium transition-colors ${summaryTone} ${
          align === "center" ? "justify-center" : "justify-start"
        }`}
        data-interactive="true"
      >
        <Info className="h-4 w-4 flex-shrink-0" aria-hidden />
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div
        key={nonce}
        className={`mt-3 animate-fadeIn text-sm leading-relaxed ${contentTone} ${align === "center" ? "text-left" : ""}`}
      >
        {children}
      </div>
    </details>
  )
}
