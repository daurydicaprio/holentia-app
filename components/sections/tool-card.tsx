"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { CardData } from "@/types"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

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
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Determinar los colores basados en la categoría y disponibilidad
  let bgColor = currentTheme === "dark" ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.4)"
  let borderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"
  let categoryTextColor = currentTheme === "dark" ? "#a0a0a0" : "#4b5563"
  let titleTextColor = currentTheme === "dark" ? "#e0e0e0" : "#1f2937"
  let descriptionTextColor = currentTheme === "dark" ? "#a0a0a0" : "#4b5563"

  // Actualizar los colores de fondo de las tarjetas para mente con mejor contraste

  if (category === "mente") {
    // Colores más vividos para tarjetas activas con mejor contraste
    if (isAvailable) {
      bgColor = currentTheme === "dark" ? "rgba(21, 101, 192, 0.4)" : "rgba(21, 101, 192, 0.75)"
      borderColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.6)" : "rgba(144, 202, 249, 0.9)"
      categoryTextColor = currentTheme === "dark" ? "#90caf9" : "#ffffff"
    } else {
      bgColor = currentTheme === "dark" ? "rgba(21, 101, 192, 0.2)" : "rgba(21, 101, 192, 0.35)"
      borderColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.3)" : "rgba(144, 202, 249, 0.5)"
      categoryTextColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.8)" : "rgba(255, 255, 255, 0.8)"
    }
    titleTextColor = currentTheme === "dark" ? "#ffffff" : "#ffffff"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
  } else if (category === "relaciones") {
    if (isAvailable) {
      bgColor = currentTheme === "dark" ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.75)"
      borderColor = currentTheme === "dark" ? "rgba(196, 181, 253, 0.6)" : "rgba(196, 181, 253, 0.9)"
      categoryTextColor = currentTheme === "dark" ? "#c4b5fd" : "#ffffff"
    } else {
      bgColor = currentTheme === "dark" ? "rgba(124, 58, 237, 0.2)" : "rgba(124, 58, 237, 0.35)"
      borderColor = currentTheme === "dark" ? "rgba(196, 181, 253, 0.3)" : "rgba(196, 181, 253, 0.5)"
      categoryTextColor = currentTheme === "dark" ? "rgba(196, 181, 253, 0.8)" : "rgba(255, 255, 255, 0.8)"
    }
    titleTextColor = currentTheme === "dark" ? "#ffffff" : "#ffffff"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#ffffff"
  } else if (category === "cuerpo") {
    if (isAvailable) {
      bgColor = currentTheme === "dark" ? "rgba(239, 108, 0, 0.4)" : "rgba(239, 108, 0, 0.75)"
      borderColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.6)" : "rgba(255, 224, 130, 0.9)"
      categoryTextColor = currentTheme === "dark" ? "#ffe082" : "#000000"
    } else {
      bgColor = currentTheme === "dark" ? "rgba(239, 108, 0, 0.2)" : "rgba(239, 108, 0, 0.35)"
      borderColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.3)" : "rgba(255, 224, 130, 0.5)"
      categoryTextColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.8)" : "rgba(0, 0, 0, 0.8)"
    }
    // Ajustado para mejor contraste
    titleTextColor = currentTheme === "dark" ? "#ffffff" : "#000000"
    descriptionTextColor = currentTheme === "dark" ? "#e0e0e0" : "#000000"
  } else if (category === "finanzas") {
    if (isAvailable) {
      bgColor = currentTheme === "dark" ? "rgba(46, 125, 50, 0.4)" : "rgba(46, 125, 50, 0.75)"
      borderColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.6)" : "rgba(165, 214, 167, 0.9)"
      categoryTextColor = currentTheme === "dark" ? "#a5d6a7" : "#ffffff"
    } else {
      bgColor = currentTheme === "dark" ? "rgba(46, 125, 50, 0.2)" : "rgba(46, 125, 50, 0.35)"
      borderColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.3)" : "rgba(165, 214, 167, 0.5)"
      categoryTextColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.8)" : "rgba(255, 255, 255, 0.8)"
    }
    titleTextColor = currentTheme === "dark" ? "#ffffff" : "#ffffff"
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
      card.style.transform = ""
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
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(20px)",
        backgroundColor: isAvailable
          ? `${bgColor.replace(/[^,]+(?=\))/, "0.75")}`
          : `${bgColor.replace(/[^,]+(?=\))/, "0.5")}`,
        boxShadow: isAvailable ? "0 12px 28px rgba(0, 0, 0, 0.1)" : "0 6px 16px rgba(0, 0, 0, 0.05)",
        height: "180px", // Altura fija para todas las tarjetas
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.35s ease",
        willChange: "transform",
        transformStyle: "preserve-3d",
        opacity: isAvailable ? 1 : 0.6,
        animationDelay,
      }}
      className={`animate-fadeIn hover:shadow-xl ${!isAvailable ? "card-coming-soon" : ""}`}
      onTouchStart={handleCardPress}
    >
      <div style={{ paddingRight: "1.75rem" }}>
        <span
          style={{
            fontSize: isMobile ? "0.8rem" : "0.7rem", // Reducido para escritorio
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            opacity: 0.9,
            color: categoryTextColor,
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        <h3
          style={{
            fontSize: isMobile ? "1.25rem" : "1rem", // Reducido para escritorio
            fontWeight: 600,
            marginTop: "0.35rem",
            color: titleTextColor,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: isMobile ? "0.9rem" : "0.8rem", // Reducido para escritorio
            marginTop: "0.35rem",
            opacity: 0.95,
            color: descriptionTextColor,
            lineHeight: "1.4",
          }}
        >
          {description}
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "1.25rem",
          transform: "translateY(-50%)",
          opacity: 0.75,
          color: titleTextColor,
          transition: "transform 0.3s ease",
        }}
        className="group-hover:translate-x-1"
      >
        <ChevronRight className="h-6 w-6" />
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
