"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { sectionsData } from "@/lib/data"

export default function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const firstPart = pathParts.length > 0 ? pathParts[0] : null

  // Determinar si estamos en una sección o en una herramienta
  let section = null
  let isToolPage = false

  if (["mente", "cuerpo", "finanzas"].includes(firstPart)) {
    // Estamos en una página de sección
    section = firstPart
    isToolPage = pathParts.length > 1
  } else if (firstPart) {
    // Podría ser una herramienta, buscar en todas las secciones
    for (const [sectionId, sectionData] of Object.entries(sectionsData)) {
      const toolExists = sectionData.cards.some((card) => card.slug === firstPart)
      if (toolExists) {
        section = sectionId
        isToolPage = true
        break
      }
    }
  }

  useEffect(() => {
    setMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  if (!mounted) return null

  // Ya no necesitamos mostrar el header móvil aquí, ya que lo manejamos directamente en tool-page-client.tsx
  if (isMobile && isToolPage) {
    return null
  }

  // En todos los demás casos, no mostramos nada aquí ya que el botón de menú estará en el contenedor principal
  return null
}
