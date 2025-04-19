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
  const menuRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null

  // Determinar el color del texto para el botón de donación
  let donationTextColor = "#3B82F6" // Color azul por defecto
  let buttonAccentColor = "#3B82F6" // Color azul por defecto
  let buttonHoverBgColor = "rgba(59, 130, 246, 0.1)" // Color de fondo hover azul

  if (section === "mente") {
    donationTextColor = "#1976d2" // Color mente
    buttonAccentColor = "#1976d2" // Color mente
    buttonHoverBgColor = "rgba(25, 118, 210, 0.1)" // Color de fondo hover mente
  } else if (section === "cuerpo") {
    donationTextColor = "#ffa000" // Color cuerpo
    buttonAccentColor = "#ffa000" // Color cuerpo
    buttonHoverBgColor = "rgba(255, 160, 0, 0.1)" // Color de fondo hover cuerpo
  } else if (section === "finanzas") {
    donationTextColor = "#388e3c" // Color finanzas
    buttonAccentColor = "#388e3c" // Color finanzas
    buttonHoverBgColor = "rgba(56, 142, 60, 0.1)" // Color de fondo hover finanzas
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"
  const buttonBgColor = currentTheme === "dark" ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 0.7)"
  const buttonBorderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"

  const handleMenuToggle = () => {
    triggerHapticFeedback("light")
    setIsMenuOpen(!isMenuOpen)
  }

  // Función para cerrar el menú después de hacer clic en un enlace
  const handleLinkClick = () => {
    triggerHapticFeedback("light")
    setIsMenuOpen(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <div ref={menuRef} className="relative z-[2000] main-menu-button-container">
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
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "all 0.2s ease",
          position: "relative",
          zIndex: 1000,
        }}
        className="active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={handleMenuToggle}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = buttonAccentColor
          e.currentTarget.style.backgroundColor = buttonHoverBgColor
          e.currentTarget.style.transform = "scale(1.05)"
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = buttonBorderColor
          e.currentTarget.style.backgroundColor = buttonBgColor
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Menu className="h-6 w-6 transition-transform duration-300" />
        )}
      </Button>

      {isMenuOpen && (
        <div
          className="absolute right-0 top-[60px] w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
          style={{
            animation: "fadeIn 0.2s ease-out",
            zIndex: 2001,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
          </div>
          <div className="py-1">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleLinkClick}
            >
              Inicio
            </Link>
            <Link
              href="/mente"
              className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              onClick={handleLinkClick}
            >
              Mente
            </Link>
            <Link
              href="/cuerpo"
              className="block px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              onClick={handleLinkClick}
            >
              Cuerpo
            </Link>
            <Link
              href="/finanzas"
              className="block px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              onClick={handleLinkClick}
            >
              Finanzas
            </Link>
          </div>
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/ayuda"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleLinkClick}
            >
              Ayuda
            </Link>
            <Link
              href="/apoyar"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: donationTextColor }}
              onClick={handleLinkClick}
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

      {/* Backdrop simple para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 1999 }}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  )
}
