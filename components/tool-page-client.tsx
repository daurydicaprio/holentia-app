"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "@/components/common/header/header"
import Footer from "@/components/common/footer/footer"
import ScrollToTop from "@/components/common/scroll-to-top/scroll-to-top"
import SectionSwipeNavigation from "@/components/sections/section-swipe-navigation"
import type { CardData } from "@/types"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

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
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SectionSwipeNavigation />

      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
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
        </motion.div>

        {toolContent}
      </div>

      <Footer section={section} />
      <ScrollToTop section={section} />
    </main>
  )
}
