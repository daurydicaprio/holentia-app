"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface LogoProps {
  section?: string | null
  size?: "sm" | "md" | "lg"
}

// Mapa estático para que Tailwind genere las clases por sección
// (la transparencia la aporta opacity-25/45 de la clase, no modificadores sobre tokens)
const auraClass: Record<string, string> = {
  mente: "bg-mente",
  relaciones: "bg-relaciones",
  cuerpo: "bg-cuerpo",
  finanzas: "bg-finanzas",
}

export default function Logo({ section = null, size = "lg" }: LogoProps) {
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-24 h-24 text-sm",
    lg: "w-32 h-32 sm:w-40 sm:h-40 text-lg sm:text-2xl",
  }

  const auraSizes = {
    sm: "h-11 w-11",
    md: "h-24 w-24",
    lg: "h-32 w-32 sm:h-48 sm:w-48",
  }

  const handleLogoClick = () => {
    triggerHapticFeedback("medium")
  }

  if (!mounted) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-white font-bold text-gray-800 shadow-lg dark:bg-gray-900 dark:text-white flex items-center justify-center`}
      >
        HOLENTIA
      </div>
    )
  }

  return (
    <Link href="/" data-interactive="true" className="group block" onClick={handleLogoClick}>
      <div className="relative flex items-center justify-center">
        {section && auraClass[section] && (
          <div
            aria-hidden="true"
            className={`absolute ${auraSizes[size]} rounded-full opacity-25 blur-[8px] transition-all duration-300 group-hover:opacity-45 group-hover:blur-[10px] ${auraClass[section]}`}
          />
        )}
        <div
          className={`${sizeClasses[size]} relative z-10 flex items-center justify-center rounded-full border border-gray-200 bg-white font-bold text-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-[1.03] dark:border-gray-700 dark:bg-gray-900 dark:text-white`}
        >
          HOLENTIA
        </div>
      </div>
    </Link>
  )
}
