"use client"

import { useEffect, useState } from "react"

interface TabSwipeNavigationProps {
  activeTab: string
  tabs: string[]
  onTabChange: (tab: string) => void
}

export default function TabSwipeNavigation({ activeTab, tabs, onTabChange }: TabSwipeNavigationProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

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

      const currentIndex = tabs.indexOf(activeTab)

      if (isLeftSwipe && currentIndex < tabs.length - 1) {
        // Navegar a la siguiente pestaña
        onTabChange(tabs[currentIndex + 1])
      } else if (isRightSwipe && currentIndex > 0) {
        // Navegar a la pestaña anterior
        onTabChange(tabs[currentIndex - 1])
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [touchStart, touchEnd, activeTab, tabs, onTabChange, isMobile])

  // Este componente no renderiza nada visible, solo añade la funcionalidad de swipe
  return null
}
