"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { sectionsData } from "@/lib/data"
import MenuButton from "@/components/common/menu-button/menu-button"
import Logo from "@/components/common/logo/logo"
import { motion } from "framer-motion"

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
  let headerBgColor = isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"
  let headerBorderColor = isDark ? "#333333" : "#e5e7eb"
  let headerGradient = "none"

  // Actualizar los colores y gradientes para el header en páginas de herramientas
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

  // Header para páginas de herramientas en móvil
  if (isMobile && isToolPage) {
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
              color: "#ffffff",
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
              color: "#ffffff",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            HOLENTIA
          </Link>

          <MenuButton section={toolSection} />
        </div>
      </header>
    )
  }

  // Header para home o secciones en móvil
  if (isMobile) {
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
            <MenuButton section={section} />
          </div>
        </div>
      </header>
    )
  }

  // Header para páginas de herramientas en escritorio
  if (isToolPage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full py-6 mb-6 relative"
        style={{
          background: headerGradient,
          borderBottom: `1px solid ${isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.8)"}`,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 40,
        }}
      >
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

          {/* Botones alineados en los extremos */}
          <div className="flex justify-between items-center w-full px-8">
            <Link href={`/${toolSection}`}>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm h-9 px-4 transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: isDark ? "#333333" : "#e5e7eb",
                  color: isDark ? "#e0e0e0" : "#4b5563",
                  backgroundColor: isDark ? "rgba(30, 30, 30, 0.5)" : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Volver a {toolSection?.charAt(0).toUpperCase() + toolSection?.slice(1)}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  // Header para home o secciones en escritorio (no visible, solo para mantener la estructura)
  return null
}
