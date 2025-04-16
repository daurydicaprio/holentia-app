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
            className={cn(`text-${section}-DEFAULT hover:text-${section}-dark flex items-center gap-2`)}
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
