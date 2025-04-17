"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { CardData } from "@/types"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"

interface ToolCardProps {
  card: CardData
  index: number
}

export default function ToolCard({ card, index }: ToolCardProps) {
  const { title, description, slug, isAvailable, category } = card
  const { triggerHapticFeedback } = useHapticFeedback()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"

  // Determinar los colores basados en la categoría y disponibilidad
  let bgColor = currentTheme === "dark" ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.4)"
  let borderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"
  let categoryTextColor = currentTheme === "dark" ? "#a0a0a0" : "#4b5563"
  let titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#1f2937"
  let descriptionTextColor = currentTheme === "dark" ? "#a0a0a0" : "#4b5563"

  if (category === "mente") {
    // Colores más vividos para tarjetas activas
    if (isAvailable) {
      bgColor = currentTheme === "dark" ? "rgba(25, 118, 210, 0.35)" : "rgba(25, 118, 210, 0.65)"
      borderColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.5)" : "rgba(144, 202, 249, 0.8)"
      categoryTextColor = currentTheme === "dark" ? "#90caf9" : "#e3f2fd"
    } else {
      bgColor = currentTheme === "dark" ? "rgba(25, 118, 210, 0.15)" : "rgba(25, 118, 210, 0.3)"
      borderColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.2)" : "rgba(144, 202, 249, 0.4)"
      categoryTextColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.7)" : "rgba(227, 242, 253, 0.7)"
    }
    titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
  } else if (category === "cuerpo") {
    if (isAvailable) {
      bgColor = currentTheme === "dark" ? "rgba(255, 160, 0, 0.35)" : "rgba(255, 160, 0, 0.65)"
      borderColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.5)" : "rgba(255, 224, 130, 0.8)"
      categoryTextColor = currentTheme === "dark" ? "#ffe082" : "#795548"
    } else {
      bgColor = currentTheme === "dark" ? "rgba(255, 160, 0, 0.15)" : "rgba(255, 160, 0, 0.3)"
      borderColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.2)" : "rgba(255, 224, 130, 0.4)"
      categoryTextColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.7)" : "rgba(121, 85, 72, 0.7)"
    }
    titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#3e2723"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#3e2723"
  } else if (category === "finanzas") {
    if (isAvailable) {
      bgColor = currentTheme === "dark" ? "rgba(56, 142, 60, 0.35)" : "rgba(56, 142, 60, 0.65)"
      borderColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.5)" : "rgba(165, 214, 167, 0.8)"
      categoryTextColor = currentTheme === "dark" ? "#a5d6a7" : "#e8f5e9"
    } else {
      bgColor = currentTheme === "dark" ? "rgba(56, 142, 60, 0.15)" : "rgba(56, 142, 60, 0.3)"
      borderColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.2)" : "rgba(165, 214, 167, 0.4)"
      categoryTextColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.7)" : "rgba(232, 245, 233, 0.7)"
    }
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

  // Efecto para manejar la animación 3D al mover el mouse
  useEffect(() => {
    const card = cardRef.current
    if (!card || !isAvailable) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isAvailable, mounted])

  if (!mounted) return null

  const CardContent = () => (
    <div
      ref={cardRef}
      style={{
        position: "relative",
        padding: "1.5rem",
        borderRadius: "14px",
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(20px)",
        backgroundColor: isAvailable
          ? `${bgColor.replace(/[^,]+(?=\))/, "0.7")}`
          : `${bgColor.replace(/[^,]+(?=\))/, "0.5")}`,
        boxShadow: isAvailable ? "0 10px 25px rgba(0, 0, 0, 0.08)" : "0 5px 15px rgba(0, 0, 0, 0.04)",
        height: "165px",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        opacity: isAvailable ? 1 : 0.6,
        animationDelay,
      }}
      className={`animate-fadeIn hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] ${!isAvailable ? "card-coming-soon" : ""}`}
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
