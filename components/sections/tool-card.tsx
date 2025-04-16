"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { CardData } from "@/types"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

interface ToolCardProps {
  card: CardData
  index: number
}

export default function ToolCard({ card, index }: ToolCardProps) {
  const { title, description, slug, isAvailable, category } = card
  const { triggerHapticFeedback } = useHapticFeedback()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"

  // Determinar los colores basados en la categoría
  let bgColor = currentTheme === "dark" ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.4)"
  let borderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"
  let categoryTextColor = currentTheme === "dark" ? "#a0a0a0" : "#4b5563"
  let titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#1f2937"
  let descriptionTextColor = currentTheme === "dark" ? "#a0a0a0" : "#4b5563"

  if (category === "mente") {
    bgColor = currentTheme === "dark" ? "rgba(25, 118, 210, 0.2)" : "rgba(25, 118, 210, 0.4)"
    borderColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.3)" : "rgba(144, 202, 249, 0.5)"
    categoryTextColor = currentTheme === "dark" ? "#90caf9" : "#e3f2fd"
    titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
  } else if (category === "cuerpo") {
    bgColor = currentTheme === "dark" ? "rgba(255, 160, 0, 0.2)" : "rgba(255, 160, 0, 0.4)"
    borderColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.3)" : "rgba(255, 224, 130, 0.6)"
    categoryTextColor = currentTheme === "dark" ? "#ffe082" : "#795548"
    titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#3e2723"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#3e2723"
  } else if (category === "finanzas") {
    bgColor = currentTheme === "dark" ? "rgba(56, 142, 60, 0.2)" : "rgba(56, 142, 60, 0.4)"
    borderColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.3)" : "rgba(165, 214, 167, 0.6)"
    categoryTextColor = currentTheme === "dark" ? "#a5d6a7" : "#e8f5e9"
    titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
  }

  // Animación de entrada escalonada
  const animationDelay = `${index * 0.1}s`

  const handleCardPress = () => {
    if (isAvailable) {
      triggerHapticFeedback("medium")
    } else {
      triggerHapticFeedback("light")
    }
  }

  if (!mounted) return null

  const CardContent = () => (
    <div
      style={{
        position: "relative",
        padding: "1.5rem",
        borderRadius: "14px",
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(14px)",
        backgroundColor: bgColor,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
        height: "165px",
        transition: "all 0.3s ease",
        opacity: isAvailable ? 1 : 0.5,
        animationDelay,
      }}
      className={`animate-fadeIn hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] ${!isAvailable ? "card-coming-soon" : ""}`}
      onTouchStart={handleCardPress}
    >
      <div style={{ paddingRight: "1.5rem" }}>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            opacity: 0.85,
            color: categoryTextColor,
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            marginTop: "0.25rem",
            color: titleTextColor,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            marginTop: "0.25rem",
            opacity: 0.9,
            color: descriptionTextColor,
          }}
        >
          {description}
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "1rem",
          transform: "translateY(-50%)",
          opacity: 0.65,
          color: titleTextColor,
          transition: "transform 0.3s ease",
        }}
        className="group-hover:translate-x-1"
      >
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  )

  if (!isAvailable) {
    return (
      <div className="animate-fadeIn">
        <CardContent />
      </div>
    )
  }

  // Usar la ruta directa al slug de la herramienta
  return (
    <Link href={`/${slug}`} className="animate-fadeIn group" onClick={() => triggerHapticFeedback("medium")}>
      <CardContent />
    </Link>
  )
}
