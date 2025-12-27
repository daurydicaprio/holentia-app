import type { SectionData } from "@/types"

interface SectionHeaderProps {
  section: SectionData
}

export default function SectionHeader({ section }: SectionHeaderProps) {
  // Determinar el gradiente para el título destacado
  let highlightGradient = "linear-gradient(to right, #3B82F6, #1D4ED8)" // Gradiente azul por defecto

  if (section.id === "mente") {
    highlightGradient = "linear-gradient(to right, var(--color-mente-active), var(--color-mente-active-dark))" // Gradiente mente
  } else if (section.id === "cuerpo") {
    highlightGradient = "linear-gradient(to right, var(--color-cuerpo-active), var(--color-cuerpo-active-dark))" // Gradiente cuerpo
  } else if (section.id === "finanzas") {
    highlightGradient = "linear-gradient(to right, var(--color-finanzas-active), var(--color-finanzas-active-dark))" // Gradiente finanzas
  } else if (section.id === "relaciones") {
    highlightGradient = "linear-gradient(to right, var(--color-relaciones-active), var(--color-relaciones-active-dark))" // Gradiente relaciones
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
