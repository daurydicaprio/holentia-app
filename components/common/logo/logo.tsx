"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useTheme } from "next-themes"

interface LogoProps {
  section?: string | null
  size?: "sm" | "md" | "lg"
}

export default function Logo({ section = null, size = "lg" }: LogoProps) {
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Animación para el hover
  const hoverAnimation = isHovered
    ? {
        scale: 1.05,
        rotate: [0, 2, 0, -2, 0],
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      }
    : {}

  const handleLogoClick = () => {
    triggerHapticFeedback("medium")
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
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

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const logoBgColor = currentTheme === "dark" ? "#1e1e1e" : "#ffffff"
  const logoBorderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"
  const logoTextColor = currentTheme === "dark" ? "#ffffff" : "#1f2937"

  if (!mounted) {
    // Renderizar un placeholder mientras se monta para evitar parpadeos
    return (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold shadow-lg`}>
        HOLENTIA
      </div>
    )
  }

  const LogoContent = () => (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {section && (
        <motion.div
          animate={auraAnimation}
          style={{
            position: "absolute",
            zIndex: 0,
            width: auraWidth,
            height: auraHeight,
            borderRadius: "9999px",
            opacity: isHovered ? 0.5 : 0.3,
            filter: `blur(${isHovered ? "12px" : "8px"})`,
            backgroundColor: auraColor,
            transition: "opacity 0.3s ease, filter 0.3s ease",
          }}
        />
      )}
      <motion.div
        animate={hoverAnimation}
        className={`${sizeClasses[size]} backdrop-blur-md rounded-full flex items-center justify-center font-bold shadow-lg z-10 relative`}
        style={{
          backgroundColor: logoBgColor,
          color: logoTextColor,
          border: `1px solid ${logoBorderColor}`,
          transition: "transform 0.3s ease",
        }}
      >
        HOLENTIA
      </motion.div>
    </div>
  )

  return (
    <Link href="/" className="block" onClick={handleLogoClick}>
      <LogoContent />
    </Link>
  )
}
