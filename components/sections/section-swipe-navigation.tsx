"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function SectionSwipeNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isToolPage, setIsToolPage] = useState(false)

  // Configuración de sensibilidad del swipe
  const minSwipeDistance = 50

  // Verificar si estamos dentro de una herramienta
  const isInsideTool = useCallback(() => {
    // Lista de rutas de herramientas conocidas
    const toolRoutes = [
      "/calculadora-prestamo",
      "/calculadora-interes-compuesto",
      "/crear-presupuesto-personal",
      "/diario-guiado",
      "/test-lenguajes-amor",
      "/calculadora-hidratacion",
    ]

    // Verificar si la ruta actual comienza con alguna de las rutas de herramientas
    return toolRoutes.some((route) => pathname.startsWith(route))
  }, [pathname])

  useEffect(() => {
    setIsToolPage(isInsideTool())
  }, [isInsideTool])

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
