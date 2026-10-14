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

// Mapa estático para que Tailwind genere las clases (texto + foco canónico por sección)
const sectionButtonClasses: Record<SectionType, string> = {
  mente:
    "text-mente hover:text-mente-darkest dark:text-mente-light dark:hover:text-mente-lighter focus-visible:ring-mente dark:focus-visible:ring-mente-light",
  relaciones:
    "text-relaciones hover:text-relaciones-darkest dark:text-relaciones-light dark:hover:text-relaciones-lighter focus-visible:ring-relaciones dark:focus-visible:ring-relaciones-light",
  cuerpo:
    "text-cuerpo-dark hover:text-cuerpo-darkest dark:text-cuerpo-light dark:hover:text-cuerpo-lighter focus-visible:ring-cuerpo dark:focus-visible:ring-cuerpo-light",
  finanzas:
    "text-finanzas hover:text-finanzas-darkest dark:text-finanzas-light dark:hover:text-finanzas-lighter focus-visible:ring-finanzas dark:focus-visible:ring-finanzas-light",
}

export default function ToolsGrid({ cards, section }: ToolsGridProps) {
  const [showComingSoon, setShowComingSoon] = useState(false)

  // Las herramientas disponibles siempre están visibles y en el HTML (SEO + descubrimiento)
  const availableCards = cards.filter((card) => card.isAvailable)
  const comingSoonCards = cards.filter((card) => !card.isAvailable)

  const buttonTextClass =
    sectionButtonClasses[section as SectionType] ??
    "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 focus-visible:ring-gray-500"

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {availableCards.map((card, index) => (
          <ToolCard key={card.id} card={card} index={index} />
        ))}
      </div>

      {comingSoonCards.length > 0 && (
        <>
          <div
            id="proximas-herramientas"
            className={cn(
              "mt-6 gap-4 sm:grid-cols-2 lg:grid-cols-4",
              showComingSoon ? "grid" : "hidden",
            )}
          >
            {comingSoonCards.map((card, index) => (
              <ToolCard key={card.id} card={card} index={availableCards.length + index} />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              variant="ghost"
              data-interactive="true"
              aria-expanded={showComingSoon}
              aria-controls="proximas-herramientas"
              className={cn(
                "flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                buttonTextClass,
              )}
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
