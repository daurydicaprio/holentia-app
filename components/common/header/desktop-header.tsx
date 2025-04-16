"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
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
    return (
      <div className="absolute top-4 right-4 z-50">
        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800"></div>
      </div>
    )
  }

  return (
    <>
      <div className="menu-backdrop"></div>
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              style={{
                height: "48px",
                width: "48px",
                borderRadius: "9999px",
                backgroundColor: buttonBgColor,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: `1px solid ${buttonBorderColor}`,
                transition: "background-color 0.3s ease, border-color 0.3s ease",
              }}
              className="active:scale-95 transition-transform"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <DropdownMenuItem asChild>
              <Link href="/" className="mobile-menu-item">
                Inicio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/mente" className="mobile-menu-item">
                Mente
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/cuerpo" className="mobile-menu-item">
                Cuerpo
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/finanzas" className="mobile-menu-item">
                Finanzas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/ayuda" className="mobile-menu-item">
                Ayuda
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/apoyar" className="mobile-menu-item" style={{ color: donationTextColor }}>
                Hacer donación
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="mobile-menu-item flex items-center justify-between"
            >
              <span>Modo {currentTheme === "dark" ? "Claro" : "Oscuro"}</span>
              {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
