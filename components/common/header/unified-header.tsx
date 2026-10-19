"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { sectionsData } from "@/lib/data"
import MenuButton from "@/components/common/menu-button/menu-button"
import Logo from "@/components/common/logo/logo"
import Link from "next/link"

interface UnifiedHeaderProps {
  section?: string | null
}

export default function UnifiedHeader({ section }: UnifiedHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

  // Verificar si estamos en una página de herramienta
  const pathParts = pathname ? pathname.split("/").filter(Boolean) : []
  const firstPart = pathParts.length > 0 ? pathParts[0] : null

  // Determinar si estamos en una herramienta
  let isToolPage = false
  let toolSection = section

  if (!["mente", "cuerpo", "finanzas"].includes(firstPart ?? "")) {
    // Podría ser una herramienta, buscar en todas las secciones
    for (const [sectionId, sectionData] of Object.entries(sectionsData)) {
      const toolExists = sectionData.cards.some((card) => card.slug === (firstPart ?? ""))
      if (toolExists) {
        isToolPage = true
        toolSection = sectionId
        break
      }
    }
  } else if (pathParts.length > 1) {
    isToolPage = true
  }

  // Fondo del header móvil de herramienta: sólido con el tono más oscuro de la sección.
  // Cuerpo necesita `-darkest`: el logo lleva un velo blanco/20 y blanco sobre #e65100
  // se queda en 2.97:1. Con #bf360c el icono blanco supera 3:1 y el texto del logo
  // usa negro para pasar AA. Fallback: gray-900 de marca.
  const headerBgBySection: Record<string, string> = {
    mente: "var(--color-mente-active-dark)",
    relaciones: "var(--color-relaciones-active-dark)",
    cuerpo: "var(--color-cuerpo-active-darkest)",
    finanzas: "var(--color-finanzas-active-dark)",
  }
  const headerBgColor = headerBgBySection[toolSection ?? ""] ?? "rgb(17, 24, 39)"

  const handleBackClick = () => {
    triggerHapticFeedback("medium")

    // Si estamos en una página de herramienta, ir a la sección correspondiente
    if (isToolPage && toolSection) {
      router.push(`/${toolSection}`)
      return
    }

    // Comportamiento por defecto: volver atrás
    router.back()
  }

  if (!mounted) return null

  // Header compacto para páginas de herramientas en móvil
  if (isMobile && isToolPage) {
    return (
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: headerBgColor,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center justify-between px-3 py-2">
          {/* Botón volver con efecto hover */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            aria-label="Volver"
            className="h-11 w-11 p-0 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Logo adaptado con recuadro y efectos */}
          <Link
            href="/"
            className="flex items-center justify-center rounded-md bg-white/20 px-3 py-2 transition-colors duration-200 hover:bg-white/30 active:bg-white/40"
            onClick={() => triggerHapticFeedback("light")}
          >
            <span className={`font-bold text-lg ${toolSection === "cuerpo" ? "text-black" : "text-white"}`}>
              HOLENTIA
            </span>
          </Link>

          {/* Botón menú con z-index elevado */}
          <div className="relative z-[200]">
            <MenuButton section={toolSection} isSquare={true} isCompact={true} />
          </div>
        </div>
      </header>
    )
  }

  // Header para home o secciones en móvil - no renderizamos nada aquí
  if (isMobile) {
    return null
  }

  // Header para páginas de herramientas en escritorio - ahora con margen reducido
  if (isToolPage) {
    return (
      <div className="w-full py-4 mb-2 relative">
        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Botón de menú posicionado en la esquina superior derecha */}
          <div className="absolute right-6 top-0 z-50">
            <MenuButton section={toolSection} />
          </div>

          {/* Logo centrado con margen reducido */}
          <div className="flex flex-col items-center mb-2">
            <Logo section={toolSection} size="md" />
          </div>
        </div>
      </div>
    )
  }

  // Header para home o secciones en escritorio (no visible, solo para mantener la estructura)
  return null
}
