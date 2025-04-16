"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ToolCard from "./tool-card"
import type { CardData } from "@/types"
import { cn } from "@/lib/utils"

interface ToolsGridProps {
  cards: CardData[]
  section: string
}

export default function ToolsGrid({ cards, section }: ToolsGridProps) {
  const [showAll, setShowAll] = useState(false)

  const visibleCards = showAll ? cards : cards.slice(0, 4)
  const hasMoreCards = cards.length > 4

  // Determinar las clases de color basadas en la sección
  let buttonTextClass = "text-gray-600 hover:text-gray-800"

  if (section === "mente") {
    buttonTextClass = "text-mente-DEFAULT hover:text-mente-dark"
  } else if (section === "cuerpo") {
    buttonTextClass = "text-cuerpo-DEFAULT hover:text-cuerpo-dark"
  } else if (section === "finanzas") {
    buttonTextClass = "text-finanzas-DEFAULT hover:text-finanzas-dark"
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {visibleCards.map((card, index) => (
          <ToolCard key={card.id} card={card} index={index} />
        ))}
      </div>

      {hasMoreCards && (
        <div className="flex justify-center mt-8">
          <Button
            variant="ghost"
            className={cn("flex items-center gap-2", buttonTextClass)}
            onClick={() => setShowAll(!showAll)}
          >
            <span>{showAll ? "Mostrar menos" : "Ver todas las herramientas"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
          </Button>
        </div>
      )}
    </div>
  )
}
