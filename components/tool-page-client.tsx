"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "@/components/common/header/header"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import { ArrowLeft, Coffee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ScrollToTop from "@/components/common/scroll-to-top/scroll-to-top"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import type { CardData } from "@/types"
import { useTheme } from "next-themes"
import MainMenuButton from "@/components/common/main-menu-button/main-menu-button"
import MobileHeader from "@/components/common/header/mobile-header"

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
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

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

  // Asegurarnos de que section es una cadena válida antes de usar charAt
  const sectionTitle =
    section && typeof section === "string" ? section.charAt(0).toUpperCase() + section.slice(1) : "Sección"

  // Determinar los colores basados en la sección
  let sectionColor = "#3B82F6" // Color azul por defecto
  let headerLineColor = "#3B82F6" // Color azul por defecto
  let headerBgGradient = "linear-gradient(to bottom, rgba(59, 130, 246, 0.08), rgba(29, 78, 216, 0.05))"

  if (section === "mente") {
    sectionColor = "#1976d2" // Color mente
    headerLineColor = "#1976d2" // Color mente
    headerBgGradient = "linear-gradient(to bottom, rgba(25, 118, 210, 0.08), rgba(13, 71, 161, 0.05))"
  } else if (section === "cuerpo") {
    sectionColor = "#ffa000" // Color cuerpo
    headerLineColor = "#ffa000" // Color cuerpo
    headerBgGradient = "linear-gradient(to bottom, rgba(255, 160, 0, 0.08), rgba(230, 81, 0, 0.05))"
  } else if (section === "finanzas") {
    sectionColor = "#388e3c" // Color finanzas
    headerLineColor = "#388e3c" // Color finanzas
    headerBgGradient = "linear-gradient(to bottom, rgba(56, 142, 60, 0.08), rgba(27, 94, 32, 0.05))"
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const isDark = currentTheme === "dark"
  const buttonBorderColor = isDark ? "#333333" : "#e5e7eb"
  const buttonTextColor = isDark ? "#e0e0e0" : "#4b5563"

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col">
      {/* Solo mostrar el Header estándar en escritorio o cuando no es una página de herramienta */}
      {(!isMobile || !toolData) && <Header />}
      <SectionSwipeNavigation />

      {/* Header móvil personalizado para herramientas */}
      {isMobile && toolData && <MobileHeader section={section} />}

      {/* Header especial para herramientas - más alto y con efectos */}
      {!isMobile && (
        <div
          className="w-full py-8 mb-6 relative"
          style={{
            background: headerBgGradient,
            borderBottom: `1px solid ${isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.8)"}`,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 40,
            position: "relative",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 relative">
            {/* Botón de menú posicionado en la esquina superior derecha */}
            <div className="absolute right-6 top-0" style={{ zIndex: 50 }}>
              <MainMenuButton variant="tool" section={section} />
            </div>

            {/* Logo centrado */}
            <div className="flex flex-col items-center mb-6">
              <div className="transform transition-transform hover:scale-105 duration-300">
                <Logo section={section} size="md" />
              </div>
            </div>

            {/* Botones alineados en los extremos */}
            <div className="flex justify-between items-center w-full px-8">
              <Link href={`/${section}`}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm h-9 px-4 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: buttonBorderColor,
                    color: buttonTextColor,
                    backgroundColor: isDark ? "rgba(30, 30, 30, 0.5)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = sectionColor
                    e.currentTarget.style.color = sectionColor
                    e.currentTarget.style.backgroundColor = isDark
                      ? `rgba(30, 30, 30, 0.7)`
                      : `rgba(255, 255, 255, 0.7)`
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = buttonBorderColor
                    e.currentTarget.style.color = buttonTextColor
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(30, 30, 30, 0.5)"
                      : "rgba(255, 255, 255, 0.5)"
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a {sectionTitle}
                </Button>
              </Link>

              <Link href="/apoyar">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm h-9 px-4 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: sectionColor,
                    color: sectionColor,
                    backgroundColor: isDark ? `rgba(0, 0, 0, 0.15)` : `rgba(255, 255, 255, 0.5)`,
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? `rgba(0, 0, 0, 0.25)` : `rgba(255, 255, 255, 0.7)`
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? `rgba(0, 0, 0, 0.15)` : `rgba(255, 255, 255, 0.5)`
                  }}
                >
                  <Coffee className="h-4 w-4" />
                  Hacer donación
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        <div className={`mb-8 text-center ${isMobile ? "mt-4" : ""}`}>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{
              color: sectionColor,
              marginBottom: "0.5rem",
            }}
          >
            {toolData.title}
          </h1>
          <p
            className="text-gray-600 dark:text-gray-300 mt-2"
            style={{
              marginBottom: "0.75rem",
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
              marginBottom: "1.5rem",
              borderRadius: "9999px",
              backgroundColor: headerLineColor,
            }}
          ></div>
        </div>

        {toolContent}
      </div>

      <Footer section={section} />
      <ScrollToTop section={section} />
    </main>
  )
}
