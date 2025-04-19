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

  if (!["mente", "cuerpo", "finanzas"].includes(firstPart)) {
    // Podría ser una herramienta, buscar en todas las secciones
    for (const [sectionId, sectionData] of Object.entries(sectionsData)) {
      const toolExists = sectionData.cards.some((card) => card.slug === firstPart)
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

  // Actualizar los colores basados en la sección
  if (toolSection === "mente") {
    sectionColor = "#1976d2" // Color mente
  } else if (toolSection === "cuerpo") {
    sectionColor = "#ffa000" // Color cuerpo
  } else if (toolSection === "finanzas") {
    sectionColor = "#388e3c" // Color finanzas
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

  // Header para páginas de herramientas en móvil
  if (isMobile && isToolPage) {
    return (
      <div className="relative">
        {/* Barra superior con botones en extremos opuestos */}
        <div className="flex justify-between items-center px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
              color: isDark ? "#ffffff" : "#333333",
              height: "40px",
              width: "40px",
              borderRadius: "8px", // Cuadrado con bordes redondeados
            }}
            className="flex items-center justify-center hover:bg-white/40 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <MenuButton section={toolSection} isSquare={true} />
        </div>

        {/* Logo centrado debajo de la barra de navegación */}
        <div className="flex justify-center mb-4">
          <Logo section={toolSection} size="md" />
        </div>
      </div>
    )
  }

  // Header para home o secciones en móvil - no renderizamos nada aquí
  if (isMobile) {
    return null
  }

  // Header para páginas de herramientas en escritorio - ahora sin fondo
  if (isToolPage) {
    return (
      <div className="w-full py-6 mb-6 relative">
        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Botón de menú posicionado en la esquina superior derecha */}
          <div className="absolute right-6 top-0" style={{ zIndex: 50 }}>
            <MenuButton section={toolSection} />
          </div>

          {/* Logo centrado */}
          <div className="flex flex-col items-center mb-6">
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
