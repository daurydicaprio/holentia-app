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

  // Clases específicas por categoría
  const categoryClasses = {
    mente: {
      bg: "bg-mente-glass",
      border: "border-mente-border",
      category: "text-mente-category",
      title: "text-mente-text",
      description: "text-mente-text",
    },
    cuerpo: {
      bg: "bg-cuerpo-glass",
      border: "border-cuerpo-border",
      category: "text-cuerpo-category",
      title: "text-cuerpo-text",
      description: "text-cuerpo-text",
    },
    finanzas: {
      bg: "bg-finanzas-glass",
      border: "border-finanzas-border",
      category: "text-finanzas-category",
      title: "text-finanzas-text",
      description: "text-finanzas-text",
    },
  }

  const classes = categoryClasses[category]

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
        classes.bg,
        classes.border,
        !isAvailable && "card-coming-soon",
        isAvailable && "shadow-md hover:shadow-lg",
      )}
      style={{ animationDelay }}
      onTouchStart={handleCardPress}
    >
      <div className="pr-6">
        <span className={cn("text-xs font-medium uppercase tracking-wider opacity-85", classes.category)}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        <h3 className={cn("text-lg font-semibold mt-1", classes.title)}>{title}</h3>
        <p className={cn("text-sm mt-1 opacity-90", classes.description)}>{description}</p>
      </div>
      <div
        className={cn(
          "absolute top-1/2 right-4 -translate-y-1/2 opacity-65 transition-all group-hover:translate-x-1",
          classes.title,
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
