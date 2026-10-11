"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { sectionsData } from "@/lib/data"

// Rutas de herramientas derivadas del catálogo (una sola fuente de verdad)
const TOOL_ROUTES = Object.values(sectionsData).flatMap((section) =>
  section.cards.filter((card) => card.isAvailable).map((card) => `/${card.slug}`),
)

export default function SectionSwipeNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Configuración de sensibilidad del swipe
  const minSwipeDistance = 50

  // Si estamos dentro de una herramienta, no activar la navegación por swipe
  const isToolPage = TOOL_ROUTES.some((route) => pathname?.startsWith(route))

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return

      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      // Solo procesar swipes horizontales significativos
      if (!isLeftSwipe && !isRightSwipe) return

      // Obtener la sección actual del pathname
      const pathParts = pathname.split("/").filter(Boolean)
      const currentSection = pathParts.length > 0 ? pathParts[0] : null

      const sections = ["mente", "relaciones", "cuerpo", "finanzas"]

      if (!currentSection || !sections.includes(currentSection)) {
        // Si no estamos en una sección, ir a la primera sección con swipe izquierdo
        if (isLeftSwipe) {
          router.push(`/${sections[0]}`)
        }
        return
      }

      const currentIndex = sections.indexOf(currentSection)

      if (isLeftSwipe && currentIndex < sections.length - 1) {
        // Navegar a la siguiente sección
        router.push(`/${sections[currentIndex + 1]}`)
      } else if (isRightSwipe && currentIndex > 0) {
        // Navegar a la sección anterior
        router.push(`/${sections[currentIndex - 1]}`)
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [touchStart, touchEnd, pathname, router, isMobile])

  // Si estamos dentro de una herramienta, no activar la navegación por swipe
  if (isToolPage) {
    return null
  }

  // Este componente no renderiza nada visible, solo añade la funcionalidad de swipe
  return null
}
