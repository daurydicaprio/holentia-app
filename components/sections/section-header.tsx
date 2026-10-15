import type { SectionData } from "@/types"

interface SectionHeaderProps {
  section: SectionData
}

// Gradiente de título por sección (vars de paleta, sin hex hardcodeados).
// Cuerpo arranca en -dark: el ámbar puro no alcanza contraste AA sobre fondo claro.
const gradientBySection: Record<string, string> = {
  mente: "linear-gradient(to right, var(--color-mente-active), var(--color-mente-active-dark))",
  relaciones: "linear-gradient(to right, var(--color-relaciones-active), var(--color-relaciones-active-dark))",
  cuerpo: "linear-gradient(to right, var(--color-cuerpo-active-dark), var(--color-cuerpo-active-darkest))",
  finanzas: "linear-gradient(to right, var(--color-finanzas-active), var(--color-finanzas-active-dark))",
}

export default function SectionHeader({ section }: SectionHeaderProps) {
  const highlightGradient =
    gradientBySection[section.id] ??
    "linear-gradient(to right, var(--color-finanzas-active), var(--color-finanzas-active-dark))"

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
    </div>
  )
}
