"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ToolCard from "./tool-card"
import type { CardData, SectionType } from "@/types"
import { cn } from "@/lib/utils"

interface ToolsGridProps {
  cards: CardData[]
  section: string
}

// Mapa estático para que Tailwind genere las clases
const sectionButtonClasses: Record<SectionType, string> = {
  mente: "text-mente-DEFAULT hover:text-mente-darkest",
  relaciones: "text-relaciones-DEFAULT hover:text-relaciones-darkest",
  cuerpo: "text-cuerpo-DEFAULT hover:text-cuerpo-darkest",
  finanzas: "text-finanzas-DEFAULT hover:text-finanzas-darkest",
}

export default function ToolsGrid({ cards, section }: ToolsGridProps) {
  const [showComingSoon, setShowComingSoon] = useState(false)

  // Las herramientas disponibles siempre están visibles y en el HTML (SEO + descubrimiento)
  const availableCards = cards.filter((card) => card.isAvailable)
  const comingSoonCards = cards.filter((card) => !card.isAvailable)

  const buttonTextClass = sectionButtonClasses[section as SectionType] ?? "text-gray-600 hover:text-gray-800"

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {availableCards.map((card, index) => (
          <ToolCard key={card.id} card={card} index={index} />
        ))}
      </div>

      {comingSoonCards.length > 0 && (
        <>
          <div
            className={cn(
              "mt-5 gap-5 sm:grid-cols-2 lg:grid-cols-4",
              showComingSoon ? "grid" : "hidden",
            )}
          >
            {comingSoonCards.map((card, index) => (
              <ToolCard key={card.id} card={card} index={availableCards.length + index} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              variant="ghost"
              className={cn("flex items-center gap-2", buttonTextClass)}
              onClick={() => setShowComingSoon(!showComingSoon)}
            >
              <span>{showComingSoon ? "Mostrar menos" : "Ver todas las herramientas"}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", showComingSoon ? "rotate-180" : "")} />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
