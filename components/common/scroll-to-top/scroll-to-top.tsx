"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface ScrollToTopProps {
  section?: string | null
  /** Si es true, solo se muestra en pantallas < 768px (patrón FAB de secciones). */
  mobileOnly?: boolean
}

export default function ScrollToTop({ section, mobileOnly = false }: ScrollToTopProps) {
  const [showButton, setShowButton] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()
  const { triggerHapticFeedback } = useHapticFeedback()

  // Extraer la sección del pathname si no se proporciona
  const pathParts = pathname.split("/").filter(Boolean)
  const currentSection = section || (pathParts.length > 0 ? pathParts[0] : null)

  // Determinar el color del botón basado en la sección
  let buttonBgColor = "#4b5563" // Color gris por defecto
  let buttonHoverBgColor = "#374151" // Color gris oscuro por defecto

  if (currentSection === "mente") {
    buttonBgColor = "#1976d2" // Color mente
    buttonHoverBgColor = "#0d47a1" // Color mente oscuro
  } else if (currentSection === "cuerpo") {
    buttonBgColor = "#ffa000" // Color cuerpo
    buttonHoverBgColor = "#e65100" // Color cuerpo oscuro
  } else if (currentSection === "finanzas") {
    buttonBgColor = "#388e3c" // Color finanzas
    buttonHoverBgColor = "#1b5e20" // Color finanzas oscuro
  } else if (currentSection === "relaciones") {
    buttonBgColor = "#7c3aed" // Color relaciones
    buttonHoverBgColor = "#5b21b6" // Color relaciones oscuro
  }

  useEffect(() => {
    setMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    triggerHapticFeedback("medium")
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!mounted || !showButton || (mobileOnly && !isMobile)) return null

  return (
    <Button
      size="icon"
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        borderRadius: "9999px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        zIndex: 40,
        height: "3rem",
        width: "3rem",
        backgroundColor: buttonBgColor,
        color: "white",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = buttonHoverBgColor
        e.currentTarget.style.transform = "translateY(-2px)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = buttonBgColor
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  )
}
