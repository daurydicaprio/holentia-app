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

  // Modificar los tamaños del logo para que el tamaño "md" tenga letras más pequeñas
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-24 h-24 text-sm", // Cambiado de text-base a text-sm para reducir el tamaño del texto
    lg: "w-32 h-32 sm:w-40 sm:h-40 text-lg sm:text-2xl",
  }

  // Tamaños del aura
  const auraSizes = {
    sm: { width: "2.75rem", height: "2.75rem" },
    md: { width: "6.5rem", height: "6.5rem" },
    lg: { width: "9.5rem", height: "9.5rem", smWidth: "12rem", smHeight: "12rem" },
  }

  // Definir la animación del aura para que haga un movimiento circular sutil
  const auraAnimation = {
    x: [0, 2, 0, -2, 0],
    y: [0, -2, 0, 2, 0],
    scale: [0.99, 1.01, 0.99],
    transition: {
      duration: 10,
      ease: "easeInOut" as const,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop" as const,
    },
  }

  // Animación para el hover - más sutil
  const hoverAnimation = isHovered
    ? {
        scale: 1.03,
        rotate: [0, 1, 0, -1, 0],
        transition: {
          duration: 0.5,
          ease: "easeInOut" as const,
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

  // Determinar el color del aura basado en la sección - más sutil
  let auraColor = "transparent"
  if (section === "mente") {
    auraColor = "rgba(59, 130, 246, 0.4)" // Color azul para mente, más sutil
  } else if (section === "cuerpo") {
    auraColor = "rgba(245, 158, 11, 0.4)" // Color ámbar para cuerpo, más sutil
  } else if (section === "finanzas") {
    auraColor = "rgba(34, 197, 94, 0.4)" // Color verde para finanzas, más sutil
  } else if (section === "relaciones") {
    auraColor = "rgba(124, 58, 237, 0.4)" // Color violeta para relaciones, más sutil
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
            opacity: isHovered ? 0.45 : 0.25, // Más sutil
            filter: `blur(${isHovered ? "10px" : "8px"})`, // Más sutil
            backgroundColor: auraColor,
            transition: "opacity 0.3s ease, filter 0.3s ease",
          }}
        />
      )}
      <motion.div
        animate={hoverAnimation}
        className={`${sizeClasses[size]} backdrop-blur-md rounded-full flex items-center justify-center font-bold z-10 relative`}
        style={{
          backgroundColor: logoBgColor,
          color: logoTextColor,
          border: `1px solid ${logoBorderColor}`,
          transition: "transform 0.3s ease",
          boxShadow: currentTheme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 4px 12px rgba(0, 0, 0, 0.08)",
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
