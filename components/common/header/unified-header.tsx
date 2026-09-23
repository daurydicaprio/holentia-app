"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { useTheme } from "next-themes"
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
  const { resolvedTheme } = useTheme()
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

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const isDark = currentTheme === "dark"

  // Determinar los estilos basados en la sección
  let sectionColor = "#3B82F6" // Color azul por defecto
  let headerBgColor = "rgba(59, 130, 246, 0.7)" // Color azul con 70% de opacidad para mejor contraste

  // Actualizar los colores basados en la sección
  if (toolSection === "mente") {
    sectionColor = "#1976d2" // Color mente
    headerBgColor = "rgba(25, 118, 210, 0.7)" // Color mente con 70% de opacidad
  } else if (toolSection === "cuerpo") {
    sectionColor = "#ffa000" // Color cuerpo
    headerBgColor = "rgba(255, 160, 0, 0.7)" // Color cuerpo con 70% de opacidad
  } else if (toolSection === "finanzas") {
    sectionColor = "#388e3c" // Color finanzas
    headerBgColor = "rgba(56, 142, 60, 0.7)" // Color finanzas con 70% de opacidad
  } else if (toolSection === "relaciones") {
    sectionColor = "#7c3aed" // Color relaciones
    headerBgColor = "rgba(124, 58, 237, 0.7)" // Color relaciones con 70% de opacidad
  }

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
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center justify-between px-3 py-2">
          {/* Botón volver con efecto hover */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="h-9 w-9 p-0 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Logo adaptado con recuadro y efectos */}
          <Link
            href="/"
            className="flex items-center justify-center px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-200 active:scale-95"
            onClick={() => triggerHapticFeedback("light")}
          >
            <span className="font-bold text-lg text-white">HOLENTIA</span>
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
          <div className="absolute right-6 top-0" style={{ zIndex: 50 }}>
            <MenuButton section={toolSection} />
          </div>

          {/* Logo centrado con margen reducido */}
          <div className="flex flex-col items-center mb-2">
            <div className="transform transition-transform hover:scale-105 duration-300">
              <Logo section={toolSection} size="md" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Header para home o secciones en escritorio (no visible, solo para mantener la estructura)
  return null
}
