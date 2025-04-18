"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export default function MainMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null

  // Crear el backdrop manualmente
  useEffect(() => {
    // Crear el backdrop si no existe
    let backdrop = document.querySelector(".menu-backdrop") as HTMLDivElement
    if (!backdrop) {
      backdrop = document.createElement("div")
      backdrop.className = "menu-backdrop"
      document.body.appendChild(backdrop)
    }

    // Manejar el estado del backdrop
    if (isMenuOpen) {
      backdrop.classList.add("active")
      document.body.style.overflow = "hidden" // Prevenir scroll
    } else {
      backdrop.classList.remove("active")
      document.body.style.overflow = "" // Restaurar scroll
    }

    // Función para cerrar el menú al hacer clic fuera
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Función para cerrar el menú con la tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Solo añadir event listeners cuando el menú está abierto
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      // Siempre limpiar los event listeners al desmontar
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      // Asegurar que el scroll se restaure
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // Determinar el color del texto para el botón de donación
  let donationTextColor = "var(--color-mente-active)" // Color azul por defecto
  if (section === "mente") {
    donationTextColor = "var(--color-mente-active)" // Color mente
  } else if (section === "cuerpo") {
    donationTextColor = "var(--color-cuerpo-active)" // Color cuerpo
  } else if (section === "finanzas") {
    donationTextColor = "var(--color-finanzas-active)" // Color finanzas
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"

  // Asegurarse de que el botón tenga un fondo visible
  const buttonBgColor = currentTheme === "dark" ? "#1e1e1e" : "#ffffff"
  const buttonBorderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"

  const handleMenuToggle = () => {
    triggerHapticFeedback("light")
    setIsMenuOpen(!isMenuOpen)
  }

  if (!mounted) {
    return null
  }

  return (
    <div ref={menuRef}>
      <Button
        variant="outline"
        size="icon"
        style={{
          height: "48px",
          width: "48px",
          borderRadius: "9999px",
          backgroundColor: buttonBgColor,
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
          border: `1.5px solid ${buttonBorderColor}`,
          transition: "all 0.2s ease",
          zIndex: 50,
          position: "relative",
        }}
        className="active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={handleMenuToggle}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Menu className="h-6 w-6 transition-transform duration-300" />
        )}
      </Button>

      {isMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-[60]"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
          </div>
          <div className="py-1">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                triggerHapticFeedback("light")
                setIsMenuOpen(false)
              }}
            >
              Inicio
            </Link>
            <Link
              href="/mente"
              className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              onClick={() => {
                triggerHapticFeedback("light")
                setIsMenuOpen(false)
              }}
            >
              Mente
            </Link>
            <Link
              href="/cuerpo"
              className="block px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              onClick={() => {
                triggerHapticFeedback("light")
                setIsMenuOpen(false)
              }}
            >
              Cuerpo
            </Link>
            <Link
              href="/finanzas"
              className="block px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              onClick={() => {
                triggerHapticFeedback("light")
                setIsMenuOpen(false)
              }}
            >
              Finanzas
            </Link>
          </div>
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/ayuda"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                triggerHapticFeedback("light")
                setIsMenuOpen(false)
              }}
            >
              Ayuda
            </Link>
            <Link
              href="/apoyar"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: donationTextColor }}
              onClick={() => {
                triggerHapticFeedback("light")
                setIsMenuOpen(false)
              }}
            >
              Hacer donación
            </Link>
          </div>
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                triggerHapticFeedback("medium")
                setTheme(currentTheme === "dark" ? "light" : "dark")
                setIsMenuOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              <span>Modo {currentTheme === "dark" ? "Claro" : "Oscuro"}</span>
              {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
