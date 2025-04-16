"use client"

import Link from "next/link"

interface FooterProps {
  section?: string | null
}

export default function Footer({ section }: FooterProps) {
  // Determinar el color del enlace basado en la sección
  let linkColor = "#3B82F6" // Color azul por defecto
  let linkHoverColor = "#1D4ED8" // Color azul oscuro por defecto

  if (section === "mente") {
    linkColor = "#1976d2" // Color mente
    linkHoverColor = "#0d47a1" // Color mente oscuro
  } else if (section === "cuerpo") {
    linkColor = "#ffa000" // Color cuerpo
    linkHoverColor = "#e65100" // Color cuerpo oscuro
  } else if (section === "finanzas") {
    linkColor = "#388e3c" // Color finanzas
    linkHoverColor = "#1b5e20" // Color finanzas oscuro
  }

  return (
    <footer className="w-full mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="mb-2">Hecho con ❤ 🇩🇴 #VERyGoodforlife</div>
      <div className="text-xs opacity-75">
        <Link
          href="https://daurydicaprio.com"
          target="_blank"
          style={{
            color: linkColor,
            transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = linkHoverColor
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = linkColor
          }}
        >
          Daury DiCaprio
        </Link>
      </div>
    </footer>
  )
}
