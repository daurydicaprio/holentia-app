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

  // Reducir el tamaño del aura para que sea más discreta
  const auraSize = {
    sm: "w-[3.75rem] h-[3.75rem]", // 15px más que el logo
    md: "w-[8.5rem] h-[8.5rem]", // 20px más que el logo
    lg: "w-[9.5rem] h-[9.5rem] sm:w-[11.5rem] sm:h-[11.5rem]", // 20px más que el logo
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

  // Determinar la clase de aura basada en la sección
  let auraClass = ""
  if (section === "mente") auraClass = "logo-aura-mente"
  else if (section === "cuerpo") auraClass = "logo-aura-cuerpo"
  else if (section === "finanzas") auraClass = "logo-aura-finanzas"

  const LogoContent = () => (
    <div className="relative flex items-center justify-center">
      {section && <motion.div className={`logo-aura ${auraClass} ${auraSize[size]}`} animate={auraAnimation} />}
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
