"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function SectionSwipeNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [swipeDisabled, setSwipeDisabled] = useState(false)

  // Configuración de sensibilidad del swipe
  const minSwipeDistance = 50

  // Verificar si estamos dentro de una herramienta
  const isInsideTool = () => {
    const pathParts = pathname.split("/").filter(Boolean)
    // Si hay más de 1 parte en la ruta, estamos dentro de una herramienta o subpágina
    return pathParts.length > 1
  }

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

  // Efecto para actualizar el estado de swipeDisabled cuando cambia la ruta
  useEffect(() => {
    setSwipeDisabled(isInsideTool())
  }, [pathname])

  useEffect(() => {
    if (!isMobile) return

    // Función para verificar si un elemento es interactivo
    const isInteractiveElement = (element: EventTarget | null): boolean => {
      if (!element || !(element instanceof Element)) return false

      // Verificar si el elemento o sus ancestros tienen alguna de estas características
      let current: Element | null = element
      while (current) {
        // Verificar por etiquetas interactivas comunes
        const tagName = current.tagName.toLowerCase()
        if (["input", "button", "a", "select", "textarea", "label", "slider"].includes(tagName)) {
          return true
        }

        // Verificar por atributos y clases que indican interactividad
        if (
          current.getAttribute("role") === "slider" ||
          current.getAttribute("role") === "button" ||
          current.classList.contains("slider") ||
          current.hasAttribute("data-interactive") ||
          current.hasAttribute("data-radix-slider-thumb") ||
          current.hasAttribute("data-state") ||
          current.classList.contains("loan-calculator-form") ||
          current.classList.contains("calculator-inputs")
        ) {
          return true
        }

        current = current.parentElement
      }

      return false
    }

    const handleTouchStart = (e: TouchEvent) => {
      // No procesar swipes si estamos dentro de una herramienta
      if (swipeDisabled) return

      // No procesar swipes si el toque comenzó en un elemento interactivo
      if (isInteractiveElement(e.target)) return

      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      // No procesar swipes si estamos dentro de una herramienta
      if (swipeDisabled) return

      // No procesar swipes si el toque comenzó en un elemento interactivo
      if (touchStart === null || isInteractiveElement(e.target)) return

      setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
      // No procesar swipes si estamos dentro de una herramienta
      if (swipeDisabled) return

      if (!touchStart || !touchEnd) return

      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      // Solo procesar swipes horizontales significativos
      if (!isLeftSwipe && !isRightSwipe) return

      // Obtener la sección actual del pathname
      const pathParts = pathname.split("/").filter(Boolean)
      const currentSection = pathParts.length > 0 ? pathParts[0] : null

      // Orden de las secciones
      const sections = ["mente", "cuerpo", "finanzas"]

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

    // Añadir event listeners con la opción passive para mejorar el rendimiento
    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd)

    // Limpiar event listeners
    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [touchStart, touchEnd, pathname, router, isMobile, swipeDisabled])

  // Este componente no renderiza nada visible, solo añade la funcionalidad de swipe
  return null
}
