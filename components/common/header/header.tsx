"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { sectionsData } from "@/lib/data"
import UnifiedHeader from "./unified-header"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const firstPart = pathParts.length > 0 ? pathParts[0] : null

  // Determinar si estamos en una sección o en una herramienta
  let section = null

  if (["mente", "cuerpo", "finanzas"].includes(firstPart)) {
    // Estamos en una página de sección
    section = firstPart
  } else if (firstPart) {
    // Podría ser una herramienta, buscar en todas las secciones
    for (const [sectionId, sectionData] of Object.entries(sectionsData)) {
      const toolExists = sectionData.cards.some((card) => card.slug === firstPart)
      if (toolExists) {
        section = sectionId
        break
      }
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Renderizar el header unificado solo una vez
  return <UnifiedHeader section={section} />
}
