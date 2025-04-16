import type { SectionData } from "@/types"

interface SectionHeaderProps {
  section: SectionData
}

export default function SectionHeader({ section }: SectionHeaderProps) {
  // Determinar el gradiente para el título destacado
  let highlightGradient = "linear-gradient(to right, #3B82F6, #1D4ED8)" // Gradiente azul por defecto

  if (section.id === "mente") {
    highlightGradient = "linear-gradient(to right, #1976d2, #0d47a1)" // Gradiente mente
  } else if (section.id === "cuerpo") {
    highlightGradient = "linear-gradient(to right, #ffa000, #e65100)" // Gradiente cuerpo
  } else if (section.id === "finanzas") {
    highlightGradient = "linear-gradient(to right, #388e3c, #1b5e20)" // Gradiente finanzas
  }

  return (
    <div className="text-center max-w-3xl mx-auto px-4 mt-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        {section.title}{" "}
        <span
          style={{
            backgroundImage: highlightGradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {section.highlightText}
        </span>
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{section.subtitle}</p>

      <div className="mt-8 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">¿Qué quieres aprender?</h2>
      </div>
    </div>
  )
}
