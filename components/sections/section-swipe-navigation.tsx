"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { sectionsData } from "@/lib/data"

// Rutas de herramientas derivadas del catálogo (una sola fuente de verdad)
const TOOL_ROUTES = Object.values(sectionsData).flatMap((section) =>
  section.cards.filter((card) => card.isAvailable).map((card) => `/${card.slug}`),
)

const SECTIONS = ["mente", "relaciones", "cuerpo", "finanzas"]

const MIN_SWIPE_DISTANCE = 50

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest("input, button, a, select, textarea, [data-interactive]"))
}

export default function SectionSwipeNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchEndX = useRef<number | null>(null)

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
      if (isInteractiveTarget(e.target)) {
        touchStartX.current = 0
        touchEndX.current = null
        return
      }
      touchEndX.current = null
      touchStartX.current = e.targetTouches[0].clientX
      touchStartY.current = e.targetTouches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === 0) return
      touchEndX.current = e.targetTouches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === 0 || touchEndX.current === null) return

      const dx = touchStartX.current - touchEndX.current
      const dy = touchStartY.current - e.changedTouches[0].clientY

      // Solo swipes horizontales dominantes (ignora scroll diagonal)
      if (Math.abs(dy) >= Math.abs(dx)) return

      const isLeftSwipe = dx > MIN_SWIPE_DISTANCE
      const isRightSwipe = dx < -MIN_SWIPE_DISTANCE
      if (!isLeftSwipe && !isRightSwipe) return

      const pathParts = pathname.split("/").filter(Boolean)
      const currentSection = pathParts.length > 0 ? pathParts[0] : null

      if (!currentSection || !SECTIONS.includes(currentSection)) {
        if (isLeftSwipe) {
          router.push(`/${SECTIONS[0]}`)
        }
        return
      }

      const currentIndex = SECTIONS.indexOf(currentSection)

      if (isLeftSwipe && currentIndex < SECTIONS.length - 1) {
        router.push(`/${SECTIONS[currentIndex + 1]}`)
      } else if (isRightSwipe && currentIndex > 0) {
        router.push(`/${SECTIONS[currentIndex - 1]}`)
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
  }, [pathname, router, isMobile])

  if (isToolPage) {
    return null
  }

  // Este componente no renderiza nada visible, solo añade la funcionalidad de swipe
  return null
}
