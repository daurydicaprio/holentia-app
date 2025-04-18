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
  const { theme, resolvedTheme } = useTheme()

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
  let sectionColorDark = "#1D4ED8" // Color azul oscuro por defecto
  let headerLineColor = "#3B82F6" // Color azul por defecto
  let headerBgColor = "rgba(59, 130, 246, 0.05)" // Color de fondo azul muy claro

  if (section === "mente") {
    sectionColor = "#1976d2" // Color mente
    sectionColorDark = "#0d47a1" // Color mente oscuro
    headerLineColor = "#1976d2" // Color mente
    headerBgColor = "rgba(25, 118, 210, 0.05)" // Color de fondo mente muy claro
  } else if (section === "cuerpo") {
    sectionColor = "#ffa000" // Color cuerpo
    sectionColorDark = "#e65100" // Color cuerpo oscuro
    headerLineColor = "#ffa000" // Color cuerpo
    headerBgColor = "rgba(255, 160, 0, 0.05)" // Color de fondo cuerpo muy claro
  } else if (section === "finanzas") {
    sectionColor = "#388e3c" // Color finanzas
    sectionColorDark = "#1b5e20" // Color finanzas oscuro
    headerLineColor = "#388e3c" // Color finanzas
    headerBgColor = "rgba(56, 142, 60, 0.05)" // Color de fondo finanzas muy claro
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const buttonBorderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"
  const buttonTextColor = currentTheme === "dark" ? "#e0e0e0" : "#4b5563"

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SectionSwipeNavigation />

      {/* Header especial para herramientas - más alto y con efectos */}
      {!isMobile && (
        <div
          className="w-full py-6 mb-6 relative"
          style={{
            backgroundColor: currentTheme === "dark" ? "rgba(30, 30, 30, 0.5)" : headerBgColor,
            borderBottom: `1px solid ${currentTheme === "dark" ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.8)"}`,
            zIndex: 40,
          }}
        >
          <div className="max-w-6xl mx-auto px-6 relative">
            {/* Botón de menú posicionado en la esquina superior derecha, alineado con el borde superior del logo */}
            <div className="absolute right-6 top-0 z-[200]">
              <MainMenuButton />
            </div>

            {/* Logo centrado */}
            <div className="flex justify-center mb-4">
              <div className="transform transition-transform hover:scale-110 duration-300">
                <Logo section={section} size="md" />
              </div>
            </div>

            {/* Botones alineados en los extremos */}
            <div className="flex justify-between items-center w-full px-8">
              <Link href={`/${section}`}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-xs h-8 px-3 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: buttonBorderColor,
                    color: buttonTextColor,
                    backgroundColor: "transparent",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = sectionColor
                    e.currentTarget.style.color = sectionColor
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = buttonBorderColor
                    e.currentTarget.style.color = buttonTextColor
                  }}
                >
                  <ArrowLeft className="h-3 w-3" />
                  Volver a {sectionTitle}
                </Button>
              </Link>

              <Link href="/apoyar">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-xs h-8 px-3 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: sectionColor,
                    color: sectionColor,
                    backgroundColor: "transparent",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      section === "mente"
                        ? "rgba(25, 118, 210, 0.1)"
                        : section === "cuerpo"
                          ? "rgba(255, 160, 0, 0.1)"
                          : "rgba(56, 142, 60, 0.1)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <Coffee className="h-3 w-3" />
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
