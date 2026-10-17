"use client"

import Link from "next/link"
import { ChevronRight, Lock } from "lucide-react"
import type { CardData, SectionType } from "@/types"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useState, useEffect, useRef } from "react"

interface ToolCardProps {
  card: CardData
  index: number
}

// Mapas estáticos (sin template literals) para que Tailwind genere las clases
// Claro: gradiente sólido sección → sección-oscura con texto blanco (cuerpo/ámbar usa texto oscuro).
// Hover: el extremo `to-` se aclara un paso (el bloque de texto vive sobre `from-`, sin recorte de contraste).
// Oscuro: glass translúcido sobre #121212 con texto blanco.
const sectionCardClasses: Record<SectionType, string> = {
  mente:
    "bg-gradient-to-br from-mente to-mente-dark group-hover:to-mente text-white dark:bg-none dark:bg-mente-glass dark:text-mente-text border-mente-border hover:border-mente-light",
  relaciones:
    "bg-gradient-to-br from-relaciones to-relaciones-dark group-hover:to-relaciones text-white dark:bg-none dark:bg-relaciones-glass dark:text-relaciones-text border-relaciones-border hover:border-relaciones-light",
  cuerpo:
    "bg-gradient-to-br from-cuerpo to-cuerpo-dark group-hover:to-cuerpo text-black dark:bg-none dark:bg-cuerpo-glass dark:text-cuerpo-text border-cuerpo-border hover:border-cuerpo-light",
  finanzas:
    "bg-gradient-to-br from-finanzas to-finanzas-dark group-hover:to-finanzas text-white dark:bg-none dark:bg-finanzas-glass dark:text-finanzas-text border-finanzas-border hover:border-finanzas-light",
}

// Color de la etiqueta de categoría (texto secundario dentro de la tarjeta).
// Blanco sólido en el gradiente: el `/85` sobre `from-{s}` da 3.4–3.8:1 en mente/finanzas
// (12.8px no es texto grande); cuerpo usa negro translúcido sobre ámbar (6.2:1).
const sectionCategoryClasses: Record<SectionType, string> = {
  mente: "text-white dark:text-mente-lighter",
  relaciones: "text-white dark:text-relaciones-lighter",
  cuerpo: "text-black/70 dark:text-cuerpo-lighter",
  finanzas: "text-white dark:text-finanzas-lighter",
}

export default function ToolCard({ card, index }: ToolCardProps) {
  const { title, description, slug, isAvailable, category } = card
  const { triggerHapticFeedback } = useHapticFeedback()
  const cardRef = useRef<HTMLDivElement>(null)

  // Animación de entrada escalonada
  const animationDelay = `${index * 0.1}s`

  const handleCardPress = () => {
    triggerHapticFeedback(isAvailable ? "medium" : "light")
  }

  // Efecto 3D al mover el mouse (solo dispositivos con hover y tarjetas disponibles)
  useEffect(() => {
    const el = cardRef.current
    if (!el || !isAvailable) return
    if (typeof window === "undefined") return
    if (!window.matchMedia("(hover: hover)").matches) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const rotateX = (y - rect.height / 2) / 20
      const rotateY = (rect.width / 2 - x) / 20
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      el.style.transform = ""
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isAvailable])

  const sectionClasses = sectionCardClasses[category] ?? sectionCardClasses.finanzas
  const categoryClasses = sectionCategoryClasses[category] ?? sectionCategoryClasses.finanzas

  const cardBody = (
    <div
      ref={cardRef}
      className={[
        "relative flex h-[180px] min-h-[180px] flex-col justify-between rounded-2xl border p-6 backdrop-blur-xl",
        "shadow-[0_12px_28px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.35)]",
        "transition-all duration-300 ease-out will-change-transform [transform-style:preserve-3d]",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)]",
        sectionClasses,
        isAvailable ? "" : "card-coming-soon cursor-default opacity-60",
      ].join(" ")}
      onTouchStart={handleCardPress}
    >
      <div className="pr-7">
        <span
          className={`text-[0.8rem] font-medium uppercase tracking-[0.05em] md:text-[0.7rem] ${categoryClasses}`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        <h3 className="mt-1 text-xl font-semibold leading-tight md:text-base">{title}</h3>
        <p className="mt-1 line-clamp-2 text-[0.9rem] leading-snug opacity-95 md:text-[0.8rem]">{description}</p>
      </div>
      <div
        className="absolute right-5 top-1/2 -translate-y-1/2 opacity-75 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
        aria-hidden="true"
      >
        {isAvailable ? (
          <ChevronRight className="h-6 w-6 rounded-full p-0.5 transition-colors duration-300 group-hover:bg-white/20 dark:group-hover:bg-white/10" />
        ) : (
          <Lock className="h-5 w-5" />
        )}
      </div>
    </div>
  )

  if (!isAvailable) {
    return (
      <div
        aria-disabled="true"
        title="Próximamente"
        className="animate-fadeIn"
        style={{ animationDelay }}
      >
        {cardBody}
      </div>
    )
  }

  return (
    <Link
      href={`/${slug}`}
      className="group block animate-fadeIn"
      style={{ animationDelay }}
      onClick={() => triggerHapticFeedback("medium")}
      data-interactive="true"
    >
      {cardBody}
    </Link>
  )
}
