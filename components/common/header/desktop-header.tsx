"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

export default function DesktopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null

  // Efecto para manejar el backdrop del menú
  useEffect(() => {
    const backdrop = document.querySelector(".menu-backdrop")
    if (backdrop) {
      if (isMenuOpen) {
        backdrop.classList.add("active")
      } else {
        backdrop.classList.remove("active")
      }
    }
  }, [isMenuOpen])

  // Determinar el color del texto para el botón de donación
  let donationTextColor = "#3B82F6" // Color azul por defecto
  if (section === "mente") {
    donationTextColor = "#1976d2" // Color mente
  } else if (section === "cuerpo") {
    donationTextColor = "#ffa000" // Color cuerpo
  } else if (section === "finanzas") {
    donationTextColor = "#388e3c" // Color finanzas
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const buttonBgColor = currentTheme === "dark" ? "#1e1e1e" : "#ffffff"
  const buttonBorderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"

  if (!mounted) {
    // Renderizar un placeholder mientras se monta para evitar parpadeos
    return null
  }

  // Ya no renderizamos el botón de menú aquí, se moverá al contenedor principal
  return null
}
