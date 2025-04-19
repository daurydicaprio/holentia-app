"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { sectionsData } from "@/lib/data"
import MainMenuButton from "@/components/common/main-menu-button/main-menu-button"

interface MobileHeaderProps {
  section?: string | null
}

export default function MobileHeader({ section }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const isDark = currentTheme === "dark"

  // Determinar los estilos basados en la sección
  let headerBgColor = isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"
  let headerBorderColor = isDark ? "#333333" : "#e5e7eb"
  let headerGradient = "none"

  // Actualizar los colores y gradientes para el header móvil en páginas de herramientas
  if (isToolPage) {
    if (toolSection === "mente") {
      headerBgColor = isDark ? "rgba(21, 101, 192, 0.6)" : "rgba(21, 101, 192, 0.6)"
      headerBorderColor = isDark ? "rgba(144, 202, 249, 0.6)" : "rgba(144, 202, 249, 0.6)"
      headerGradient = "linear-gradient(to bottom, rgba(21, 101, 192, 0.6), rgba(13, 71, 161, 0.6))"
    } else if (toolSection === "cuerpo") {
      headerBgColor = isDark ? "rgba(239, 108, 0, 0.6)" : "rgba(239, 108, 0, 0.6)"
      headerBorderColor = isDark ? "rgba(255, 224, 130, 0.6)" : "rgba(255, 224, 130, 0.6)"
      headerGradient = "linear-gradient(to bottom, rgba(239, 108, 0, 0.6), rgba(230, 81, 0, 0.6))"
    } else if (toolSection === "finanzas") {
      headerBgColor = isDark ? "rgba(46, 125, 50, 0.6)" : "rgba(46, 125, 50, 0.6)"
      headerBorderColor = isDark ? "rgba(165, 214, 167, 0.6)" : "rgba(165, 214, 167, 0.6)"
      headerGradient = "linear-gradient(to bottom, rgba(46, 125, 50, 0.6), rgba(27, 94, 32, 0.6))"
    }
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

  // Si estamos en una página de herramienta, mantener el diseño original
  if (isToolPage) {
    return (
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: headerBgColor,
          backgroundImage: headerGradient,
          borderBottom: `1px solid ${headerBorderColor}`,
          width: "100%",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              height: "44px",
              width: "44px",
              color: isDark ? "#ffffff" : "#ffffff",
            }}
            className="hover:bg-white/30 dark:hover:bg-white/30 active:scale-90 active:bg-white/50 dark:active:bg-white/50 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Volver</span>
          </Button>

          <Link
            href="/"
            className="font-bold text-xl hover:bg-white/60 dark:hover:bg-white/60 active:bg-white/80 dark:active:bg-white/80 transition-all duration-200 active:scale-95"
            onClick={() => triggerHapticFeedback("light")}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              transition: "all 0.2s ease",
              color: isDark ? "#ffffff" : "#ffffff",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            HOLENTIA
          </Link>

          <MainMenuButton variant="mobile" section={toolSection} />
        </div>
      </header>
    )
  }

  // Para home o secciones, usar el nuevo diseño con el botón de menú a la derecha
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        backgroundColor: headerBgColor,
        borderBottom: `1px solid ${headerBorderColor}`,
        width: "100%",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex-1"></div>

        <Link
          href="/"
          className="font-bold text-lg hover:bg-white/60 dark:hover:bg-gray-700/60 active:bg-white/80 dark:active:bg-gray-700/80 transition-all duration-200 active:scale-95"
          onClick={() => triggerHapticFeedback("light")}
          style={{
            backgroundColor: isDark ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.4)",
            padding: "0.375rem 1rem",
            borderRadius: "0.375rem",
            transition: "background-color 0.3s ease",
          }}
        >
          HOLENTIA
        </Link>

        <div className="flex-1 flex justify-end">
          <MainMenuButton variant="mobile" section={section} />
        </div>
      </div>
    </header>
  )
}
