"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface LogoProps {
  section?: string | null
  size?: "sm" | "md" | "lg"
}

export default function Logo({ section = null, size = "lg" }: LogoProps) {
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const sizeClasses = {
    sm: "w-14 h-14 text-xs",
    md: "w-32 h-32 text-lg",
    lg: "w-36 h-36 sm:w-44 sm:h-44 text-lg sm:text-2xl",
  }

  // Tamaños del aura
  const auraSizes = {
    sm: { width: "3.75rem", height: "3.75rem" },
    md: { width: "8.5rem", height: "8.5rem" },
    lg: { width: "9.5rem", height: "9.5rem", smWidth: "11.5rem", smHeight: "11.5rem" },
  }

  // Definir la animación del aura para que haga un movimiento circular sutil
  const auraAnimation = {
    x: [0, 2, 0, -2, 0],
    y: [0, -2, 0, 2, 0],
    scale: [0.99, 1.01, 0.99],
    transition: {
      duration: 10,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop" as const,
    },
  }

  const handleLogoClick = () => {
    triggerHapticFeedback("medium")
  }

  // Determinar el color del aura basado en la sección
  let auraColor = "transparent"
  if (section === "mente") {
    auraColor = "rgba(59, 130, 246, 0.5)" // Color azul para mente
  } else if (section === "cuerpo") {
    auraColor = "rgba(245, 158, 11, 0.5)" // Color ámbar para cuerpo
  } else if (section === "finanzas") {
    auraColor = "rgba(34, 197, 94, 0.5)" // Color verde para finanzas
  }

  // Determinar el tamaño del aura basado en el tamaño del logo
  let auraWidth = auraSizes[size].width
  let auraHeight = auraSizes[size].height

  // Para tamaño lg, tenemos diferentes tamaños para pantallas pequeñas y grandes
  if (size === "lg" && typeof window !== "undefined" && window.innerWidth >= 640) {
    auraWidth = auraSizes.lg.smWidth
    auraHeight = auraSizes.lg.smHeight
  }

  const LogoContent = () => (
    <div className="relative flex items-center justify-center">
      {section && (
        <motion.div
          animate={auraAnimation}
          style={{
            position: "absolute",
            zIndex: 0,
            width: auraWidth,
            height: auraHeight,
            borderRadius: "9999px",
            opacity: 0.3,
            filter: "blur(8px)",
            backgroundColor: auraColor,
          }}
        />
      )}
      <div
        className={`${sizeClasses[size]} bg-white dark:bg-gray-800 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-gray-800 dark:text-white shadow-lg border border-gray-100 dark:border-gray-700 z-10 relative`}
      >
        HOLENTIA
      </div>
    </div>
  )

  return (
    <Link href="/" className="block" onClick={handleLogoClick}>
      <LogoContent />
    </Link>
  )
}
