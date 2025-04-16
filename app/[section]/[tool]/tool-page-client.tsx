"use client"

import { useState, useEffect } from "react"
import Header from "@/components/common/header/header"
import Footer from "@/components/common/footer/footer"
import Logo from "@/components/common/logo/logo"
import { cn } from "@/lib/utils"
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
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    `hover:text-${section}-DEFAULT hover:border-${section}-DEFAULT transition-colors`,
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a {sectionTitle}
                </Button>
              </Link>

              <Link href="/apoyar">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    `text-${section}-DEFAULT border-${section}-DEFAULT hover:bg-${section}-glass transition-colors`,
                  )}
                >
                  <Coffee className="h-4 w-4" />
                  Hacer donación
                </Button>
              </Link>
            </div>
          </>
        )}

        <div className={cn("mb-8 text-center", mounted && isMobile ? "mt-4" : "")}>
          <h1 className={cn("text-2xl sm:text-3xl font-bold", `text-${section}-DEFAULT`)}>{toolData.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{toolData.description}</p>
          <div className={cn("tool-header-line", `tool-header-line-${section}`)}></div>
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
