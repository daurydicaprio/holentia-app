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

  // Determinar las clases de color basadas en la sección
  let backButtonClass = ""
  let donateButtonClass = ""
  let titleClass = ""
  let headerLineClass = "tool-header-line"

  if (section === "mente") {
    backButtonClass = "hover:text-mente-DEFAULT hover:border-mente-DEFAULT"
    donateButtonClass = "text-mente-DEFAULT border-mente-DEFAULT hover:bg-blue-50"
    titleClass = "text-mente-DEFAULT"
    headerLineClass = "tool-header-line tool-header-line-mente"
  } else if (section === "cuerpo") {
    backButtonClass = "hover:text-cuerpo-DEFAULT hover:border-cuerpo-DEFAULT"
    donateButtonClass = "text-cuerpo-DEFAULT border-cuerpo-DEFAULT hover:bg-amber-50"
    titleClass = "text-cuerpo-DEFAULT"
    headerLineClass = "tool-header-line tool-header-line-cuerpo"
  } else if (section === "finanzas") {
    backButtonClass = "hover:text-finanzas-DEFAULT hover:border-finanzas-DEFAULT"
    donateButtonClass = "text-finanzas-DEFAULT border-finanzas-DEFAULT hover:bg-green-50"
    titleClass = "text-finanzas-DEFAULT"
    headerLineClass = "tool-header-line tool-header-line-finanzas"
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SectionSwipeNavigation />

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* Logo y botones solo visibles en desktop */}
        {mounted && !isMobile && (
          <>
            <div className="flex justify-center mb-6">
              <Logo section={section} size="md" />
            </div>

            <div className="flex justify-between items-center mt-4 mb-6 px-4">
              <Link href={`/${section}`}>
                <Button variant="outline" size="sm" className={`flex items-center gap-2 text-sm ${backButtonClass}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Volver a {sectionTitle}
                </Button>
              </Link>

              <Link href="/apoyar">
                <Button variant="outline" size="sm" className={`flex items-center gap-2 text-sm ${donateButtonClass}`}>
                  <Coffee className="h-4 w-4" />
                  Hacer donación
                </Button>
              </Link>
            </div>
          </>
        )}

        <div className={`mb-8 text-center ${mounted && isMobile ? "mt-4" : ""}`}>
          <h1 className={`text-2xl sm:text-3xl font-bold ${titleClass}`}>{toolData.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{toolData.description}</p>
          <div className={headerLineClass}></div>
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
