"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { CardData } from "@/types"
import { cn } from "@/lib/utils"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface ToolCardProps {
  card: CardData
  index: number
}

export default function ToolCard({ card, index }: ToolCardProps) {
  const { title, description, slug, isAvailable, category } = card
  const { triggerHapticFeedback } = useHapticFeedback()

  // Clases específicas por categoría usando clases explícitas en lugar de interpolación
  let bgClass = ""
  let borderClass = ""
  let categoryTextClass = ""
  let titleTextClass = ""
  let descriptionTextClass = ""

  if (category === "mente") {
    bgClass = "bg-mente-glass"
    borderClass = "border-mente-border"
    categoryTextClass = "text-mente-category"
    titleTextClass = "text-mente-text"
    descriptionTextClass = "text-mente-text"
  } else if (category === "cuerpo") {
    bgClass = "bg-cuerpo-glass"
    borderClass = "border-cuerpo-border"
    categoryTextClass = "text-cuerpo-category"
    titleTextClass = "text-cuerpo-text"
    descriptionTextClass = "text-cuerpo-text"
  } else if (category === "finanzas") {
    bgClass = "bg-finanzas-glass"
    borderClass = "border-finanzas-border"
    categoryTextClass = "text-finanzas-category"
    titleTextClass = "text-finanzas-text"
    descriptionTextClass = "text-finanzas-text"
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

  const CardContent = () => (
    <div
      className={cn(
        "relative p-6 rounded-[14px] border backdrop-blur-md shadow-md h-[165px]",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]",
        bgClass,
        borderClass,
        !isAvailable && "card-coming-soon",
        isAvailable && "shadow-md hover:shadow-lg",
      )}
      style={{ animationDelay }}
      onTouchStart={handleCardPress}
    >
      <div className="pr-6">
        <span className={cn("text-xs font-medium uppercase tracking-wider opacity-85", categoryTextClass)}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        <h3 className={cn("text-lg font-semibold mt-1", titleTextClass)}>{title}</h3>
        <p className={cn("text-sm mt-1 opacity-90", descriptionTextClass)}>{description}</p>
      </div>
      <div
        className={cn(
          "absolute top-1/2 right-4 -translate-y-1/2 opacity-65 transition-all group-hover:translate-x-1",
          titleTextClass,
          "card-arrow",
        )}
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

  return (
    <Link
      href={`/${category}/${slug}`}
      className="animate-fadeIn group"
      onClick={() => triggerHapticFeedback("medium")}
    >
      <CardContent />
    </Link>
  )
}
