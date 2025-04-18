"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export default function MainMenuButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()

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
    <>
      <div className={`menu-backdrop ${isMenuOpen ? "active" : ""}`}></div>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          {/* Asegurarse de que el botón tenga un tamaño adecuado y sea visible */}
          <Button
            variant="outline"
            size="icon"
            style={{
              height: "48px", // Ligeramente más grande
              width: "48px", // Ligeramente más grande
              borderRadius: "9999px",
              backgroundColor: buttonBgColor,
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)", // Sombra menos preponderante
              border: `1.5px solid ${buttonBorderColor}`, // Borde más fijo
              transition: "all 0.2s ease",
              zIndex: 50, // Asegurar que esté por encima de otros elementos
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
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50"
        >
          <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
          </div>
          <div className="py-1">
            <DropdownMenuItem asChild>
              <Link href="/" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Inicio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/mente" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                Mente
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/cuerpo" className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                Cuerpo
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/finanzas"
                className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                Finanzas
              </Link>
            </DropdownMenuItem>
          </div>
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <DropdownMenuItem asChild>
              <Link href="/ayuda" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Ayuda
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/apoyar"
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ color: donationTextColor }}
              >
                Hacer donación
              </Link>
            </DropdownMenuItem>
          </div>
          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <DropdownMenuItem
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              <span>Modo {currentTheme === "dark" ? "Claro" : "Oscuro"}</span>
              {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
