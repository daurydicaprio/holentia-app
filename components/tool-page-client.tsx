"use client"

import { useState, useEffect } from "react"
import Header from "@/components/common/header/header"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import { ArrowLeft, Coffee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MobileFab from "@/components/common/mobile-fab/mobile-fab"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import type { CardData } from "@/types"
import { useTheme } from "next-themes"

interface ToolPageClientProps {
  params: {
    section: string
    tool: string
  }
  toolData: CardData
}

export default function ToolPageClient({ params, toolData }: ToolPageClientProps) {
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

  if (section === "mente") {
    sectionColor = "#1976d2" // Color mente
    sectionColorDark = "#0d47a1" // Color mente oscuro
    headerLineColor = "#1976d2" // Color mente
  } else if (section === "cuerpo") {
    sectionColor = "#ffa000" // Color cuerpo
    sectionColorDark = "#e65100" // Color cuerpo oscuro
    headerLineColor = "#ffa000" // Color cuerpo
  } else if (section === "finanzas") {
    sectionColor = "#388e3c" // Color finanzas
    sectionColorDark = "#1b5e20" // Color finanzas oscuro
    headerLineColor = "#388e3c" // Color finanzas
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

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* Logo y botones solo visibles en desktop */}
        {!isMobile && (
          <>
            <div className="flex justify-center mb-6">
              <Logo section={section} size="md" />
            </div>

            <div className="flex justify-between items-center mt-4 mb-6 px-4">
              <Link href={`/${section}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-sm"
                  style={{
                    borderColor: buttonBorderColor,
                    color: buttonTextColor,
                    backgroundColor: "transparent",
                    transition: "all 0.2s ease",
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
                  <ArrowLeft className="h-4 w-4" />
                  Volver a {sectionTitle}
                </Button>
              </Link>

              <Link href="/apoyar">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-sm"
                  style={{
                    borderColor: sectionColor,
                    color: sectionColor,
                    backgroundColor: "transparent",
                    transition: "all 0.2s ease",
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
                  <Coffee className="h-4 w-4" />
                  Hacer donación
                </Button>
              </Link>
            </div>
          </>
        )}

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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="p-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center">
            <p className="text-gray-500 dark:text-gray-400">Contenido de la herramienta pendiente de implementación</p>
          </div>
        </div>
      </div>

      <Footer section={section} />
      <MobileFab />
    </main>
  )
}
