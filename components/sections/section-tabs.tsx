"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useTheme } from "next-themes"

export default function SectionTabs() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { triggerHapticFeedback } = useHapticFeedback()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)

    // Extraer la sección del pathname
    const section = pathname.split("/")[1]
    if (section && ["mente", "cuerpo", "finanzas"].includes(section)) {
      setActiveTab(section)
    } else {
      setActiveTab(null)
    }
  }, [pathname])

  const handleTabClick = () => {
    triggerHapticFeedback("light")
  }

  if (!mounted) return null

  // Estilos base para las pestañas
  const baseTabStyle = {
    position: "relative" as const,
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 500 as const,
    transition: "color 0.2s ease, background-color 0.2s ease",
    color: theme === "dark" ? "#a0a0a0" : "#4b5563",
    opacity: 0.7,
  }

  // Estilos para las pestañas activas
  const activeTabStyle = {
    fontWeight: 600 as const,
    opacity: 1,
  }

  // Colores específicos para cada sección
  const menteColor = "#1976d2"
  const cuerpoColor = "#ffa000"
  const finanzasColor = "#388e3c"

  return (
    <div className="flex gap-4 justify-center flex-wrap mt-6">
      <Link
        href="/mente"
        onClick={handleTabClick}
        style={{
          ...baseTabStyle,
          ...(activeTab === "mente" ? { ...activeTabStyle, color: menteColor } : {}),
        }}
        onMouseOver={(e) => {
          if (activeTab !== "mente") {
            e.currentTarget.style.opacity = "0.9"
            e.currentTarget.style.color = menteColor
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== "mente") {
            e.currentTarget.style.opacity = "0.7"
            e.currentTarget.style.color = theme === "dark" ? "#a0a0a0" : "#4b5563"
          }
        }}
      >
        <span>Mente</span>
        <div
          style={{
            content: '""',
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: activeTab === "mente" ? "2rem" : "0",
            height: "3px",
            borderRadius: "9999px",
            backgroundColor: menteColor,
            transition: "width 0.3s ease",
          }}
        />
      </Link>

      <Link
        href="/cuerpo"
        onClick={handleTabClick}
        style={{
          ...baseTabStyle,
          ...(activeTab === "cuerpo" ? { ...activeTabStyle, color: cuerpoColor } : {}),
        }}
        onMouseOver={(e) => {
          if (activeTab !== "cuerpo") {
            e.currentTarget.style.opacity = "0.9"
            e.currentTarget.style.color = cuerpoColor
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== "cuerpo") {
            e.currentTarget.style.opacity = "0.7"
            e.currentTarget.style.color = theme === "dark" ? "#a0a0a0" : "#4b5563"
          }
        }}
      >
        <span>Cuerpo</span>
        <div
          style={{
            content: '""',
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: activeTab === "cuerpo" ? "2rem" : "0",
            height: "3px",
            borderRadius: "9999px",
            backgroundColor: cuerpoColor,
            transition: "width 0.3s ease",
          }}
        />
      </Link>

      <Link
        href="/finanzas"
        onClick={handleTabClick}
        style={{
          ...baseTabStyle,
          ...(activeTab === "finanzas" ? { ...activeTabStyle, color: finanzasColor } : {}),
        }}
        onMouseOver={(e) => {
          if (activeTab !== "finanzas") {
            e.currentTarget.style.opacity = "0.9"
            e.currentTarget.style.color = finanzasColor
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== "finanzas") {
            e.currentTarget.style.opacity = "0.7"
            e.currentTarget.style.color = theme === "dark" ? "#a0a0a0" : "#4b5563"
          }
        }}
      >
        <span>Finanzas</span>
        <div
          style={{
            content: '""',
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: activeTab === "finanzas" ? "2rem" : "0",
            height: "3px",
            borderRadius: "9999px",
            backgroundColor: finanzasColor,
            transition: "width 0.3s ease",
          }}
        />
      </Link>
    </div>
  )
}
