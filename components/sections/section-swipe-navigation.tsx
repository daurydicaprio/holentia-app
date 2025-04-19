"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function SectionSwipeNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartElementRef = useRef<HTMLElement | null>(null)

  // Configuración de sensibilidad del swipe
  const minSwipeDistance = 50

  // Verificar si estamos dentro de una herramienta
  const isInsideTool = () => {
    const pathParts = pathname.split("/").filter(Boolean)
    // Si hay más de 1 parte en la ruta, estamos dentro de una herramienta o subpágina
    return pathParts.length > 1
  }

  // Verificar si el elemento o sus padres son interactivos (slider, input, etc.)
  const isInteractiveElement = (element: HTMLElement | null): boolean => {
    if (!element) return false

    // Lista de selectores para elementos interactivos
    const interactiveSelectors = [
      "input",
      "button",
      "a",
      "select",
      "textarea",
      '[role="slider"]',
      '[role="button"]',
      ".slider",
      '[data-interactive="true"]',
      "[data-radix-slider-thumb]",
      "[data-state]", // Elementos de Radix UI
      ".loan-calculator-form",
      ".calculator-inputs",
    ]

    // Verificar si el elemento o alguno de sus padres coincide con los selectores
    let currentElement: HTMLElement | null = element
    while (currentElement) {
      // Verificar si el elemento coincide con alguno de los selectores
      if (
        interactiveSelectors.some((selector) => {
          if (selector.startsWith(".")) {
            return currentElement?.classList.contains(selector.substring(1))
          } else if (selector.startsWith("[")) {
            const attrName = selector.match(/\[(.*?)=/) || selector.match(/\[(.*?)\]/)
            return attrName && attrName[1] && currentElement?.hasAttribute(attrName[1])
          } else {
            return currentElement?.tagName.toLowerCase() === selector
          }
        })
      ) {
        return true
      }

      // Subir al elemento padre
      currentElement = currentElement.parentElement
    }

    return false
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

  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      // Guardar referencia al elemento donde comenzó el touch
      touchStartElementRef.current = e.target as HTMLElement

      // No capturar eventos si estamos dentro de una herramienta
      if (isInsideTool()) return

      // No capturar eventos si el touch comenzó en un elemento interactivo
      if (isInteractiveElement(e.target as HTMLElement)) return

      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      // No capturar eventos si estamos dentro de una herramienta
      if (isInsideTool()) return

      // No capturar eventos si el touch comenzó en un elemento interactivo
      if (isInteractiveElement(touchStartElementRef.current)) return

      setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
      // No procesar eventos si estamos dentro de una herramienta
      if (isInsideTool()) return

      // No procesar eventos si el touch comenzó en un elemento interactivo
      if (isInteractiveElement(touchStartElementRef.current)) return

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

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [touchStart, touchEnd, pathname, router, isMobile])

  // Este componente no renderiza nada visible, solo añade la funcionalidad de swipe
  return null
}
