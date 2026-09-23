"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/common/footer/footer"
import ScrollToTop from "@/components/common/scroll-to-top/scroll-to-top"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import type { CardData } from "@/types"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import UnifiedHeader from "@/components/common/header/unified-header"
import { useRouter } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface ToolPageClientProps {
  params: {
    section: string
    tool: string
  }
  toolData: CardData
  toolContent?: React.ReactNode
}

export default function ToolPageClient({ params, toolData, toolContent }: ToolPageClientProps) {
  const { section } = params
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()
  const { triggerHapticFeedback } = useHapticFeedback()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determinar los colores basados en la sección
  let sectionColor = "#3B82F6" // Color azul por defecto
  let headerLineColor = "#3B82F6" // Color azul por defecto

  if (section === "mente") {
    sectionColor = "#1976d2" // Color mente
    headerLineColor = "#1976d2" // Color mente
  } else if (section === "cuerpo") {
    sectionColor = "#ffa000" // Color cuerpo
    headerLineColor = "#ffa000" // Color cuerpo
  } else if (section === "finanzas") {
    sectionColor = "#388e3c" // Color finanzas
    headerLineColor = "#388e3c" // Color finanzas
  } else if (section === "relaciones") {
    sectionColor = "#7c3aed" // Color relaciones
    headerLineColor = "#7c3aed" // Color relaciones
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const isDark = currentTheme === "dark"

  const handleBackClick = () => {
    triggerHapticFeedback("medium")
    router.push(`/${section}`)
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col">
      {/* Usar el header unificado para herramientas */}
      <UnifiedHeader section={section} />
      <SectionSwipeNavigation />

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* En móvil, no mostramos el título de nuevo porque ya está en el header */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 text-center"
          >
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{
                color: sectionColor,
                marginBottom: "0.25rem",
              }}
            >
              {toolData.title}
            </h1>
            <p
              className="text-gray-600 dark:text-gray-300 mt-1"
              style={{
                marginBottom: "0.5rem",
              }}
            >
              {toolData.description}
            </p>
            <div
              style={{
                height: "0.175rem",
                width: "4rem",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "0.25rem",
                marginBottom: "1rem",
                borderRadius: "9999px",
                backgroundColor: headerLineColor,
              }}
            ></div>
          </motion.div>
        )}

        {/* En móvil, añadimos un poco de espacio superior */}
        {isMobile && <div className="h-2"></div>}

        {/* Botones en extremos opuestos del recuadro de la herramienta (solo en escritorio) */}
        {!isMobile && (
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm h-10 px-5 transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{
                borderColor: sectionColor,
                color: sectionColor,
                backgroundColor: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(4px)",
                fontWeight: 500,
              }}
              onClick={handleBackClick}
            >
              <ChevronLeft className="h-4 w-4" />
              Volver a {section.charAt(0).toUpperCase() + section.slice(1)}
            </Button>

            <Link href="/apoyar">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm h-10 px-5 transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{
                  borderColor: sectionColor,
                  color: sectionColor,
                  backgroundColor: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(4px)",
                  fontWeight: 500,
                }}
              >
                <Coffee className="h-4 w-4" />
                Hacer donación
              </Button>
            </Link>
          </div>
        )}

        {toolContent}
      </div>

      <Footer section={section} />
      <ScrollToTop section={section} />
    </main>
  )
}
