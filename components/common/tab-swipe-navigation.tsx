"use client"

import { useEffect, useState, useRef } from "react"

interface TabSwipeNavigationProps {
  activeTab: string
  tabs: string[]
  onTabChange: (tab: string) => void
}

export default function TabSwipeNavigation({ activeTab, tabs, onTabChange }: TabSwipeNavigationProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartElementRef = useRef<HTMLElement | null>(null)

  // Configuración de sensibilidad del swipe
  const minSwipeDistance = 50

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
      "[data-state]",
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
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      // Guardar referencia al elemento donde comenzó el touch
      touchStartElementRef.current = e.target as HTMLElement

      // No capturar eventos si el touch comenzó en un elemento interactivo
      if (isInteractiveElement(e.target as HTMLElement)) return

      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)

      // Prevenir la propagación para evitar que otros manejadores de swipe lo capturen
      e.stopPropagation()
    }

    const handleTouchMove = (e: TouchEvent) => {
      // No capturar eventos si el touch comenzó en un elemento interactivo
      if (isInteractiveElement(touchStartElementRef.current)) return

      setTouchEnd(e.targetTouches[0].clientX)

      // Prevenir la propagación para evitar que otros manejadores de swipe lo capturen
      e.stopPropagation()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // No procesar eventos si el touch comenzó en un elemento interactivo
      if (isInteractiveElement(touchStartElementRef.current)) return

      if (!touchStart || !touchEnd) return

      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      // Solo procesar swipes horizontales significativos
      if (!isLeftSwipe && !isRightSwipe) return

      const currentIndex = tabs.indexOf(activeTab)

      if (isLeftSwipe && currentIndex < tabs.length - 1) {
        // Navegar a la siguiente pestaña
        onTabChange(tabs[currentIndex + 1])
        e.stopPropagation()
      } else if (isRightSwipe && currentIndex > 0) {
        // Navegar a la pestaña anterior
        onTabChange(tabs[currentIndex - 1])
        e.stopPropagation()
      }
    }

    // Usar el evento de captura para asegurarnos de que este manejador se ejecute primero
    document.addEventListener("touchstart", handleTouchStart, { capture: true })
    document.addEventListener("touchmove", handleTouchMove, { capture: true })
    document.addEventListener("touchend", handleTouchEnd, { capture: true })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart, { capture: true })
      document.removeEventListener("touchmove", handleTouchMove, { capture: true })
      document.removeEventListener("touchend", handleTouchEnd, { capture: true })
    }
  }, [touchStart, touchEnd, activeTab, tabs, onTabChange, isMobile])

  // Este componente no renderiza nada visible, solo añade la funcionalidad de swipe
  return null
}
