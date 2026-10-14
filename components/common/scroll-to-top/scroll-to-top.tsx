"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface ScrollToTopProps {
  section?: string | null
  /** Si es true, solo se muestra en pantallas < 768px (patrón FAB de secciones). */
  mobileOnly?: boolean
}

// Mapa estático para que Tailwind genere las clases por sección.
// Cuerpo usa texto negro sobre ámbar (blanco no alcanza contraste AA).
const sectionButtonClass: Record<string, string> = {
  mente:
    "bg-mente text-white hover:bg-mente-dark dark:bg-mente-light dark:text-gray-900 dark:hover:bg-mente-lighter",
  relaciones:
    "bg-relaciones text-white hover:bg-relaciones-dark dark:bg-relaciones-light dark:text-gray-900 dark:hover:bg-relaciones-lighter",
  cuerpo:
    "bg-cuerpo text-black hover:bg-cuerpo-dark dark:bg-cuerpo-light dark:text-gray-900 dark:hover:bg-cuerpo-lighter",
  finanzas:
    "bg-finanzas text-white hover:bg-finanzas-dark dark:bg-finanzas-light dark:text-gray-900 dark:hover:bg-finanzas-lighter",
}

const fallbackButtonClass =
  "bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"

export default function ScrollToTop({ section, mobileOnly = false }: ScrollToTopProps) {
  const [showButton, setShowButton] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { triggerHapticFeedback } = useHapticFeedback()

  // Extraer la sección del pathname si no se proporciona
  const pathParts = pathname.split("/").filter(Boolean)
  const currentSection = section || (pathParts.length > 0 ? pathParts[0] : null)

  const buttonClass = currentSection ? sectionButtonClass[currentSection] : undefined

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
    <button
      type="button"
      data-interactive="true"
      aria-label="Volver arriba"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
        buttonClass ?? fallbackButtonClass
      }`}
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  )
}
