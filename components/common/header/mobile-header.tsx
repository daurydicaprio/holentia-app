"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface MobileHeaderProps {
  section?: string | null
}

export default function MobileHeader({ section }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Verificar si estamos en una página de herramienta
  const pathParts = pathname ? pathname.split("/").filter(Boolean) : []
  const isToolPage = pathParts.length > 1

  // Determinar los estilos basados en la sección
  let headerBgColor = theme === "dark" ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"
  let headerBorderColor = theme === "dark" ? "#333333" : "#e5e7eb"
  let donationTextColor = "#3B82F6" // Color azul por defecto

  if (section === "mente") {
    headerBgColor = theme === "dark" ? "rgba(25, 118, 210, 0.2)" : "rgba(25, 118, 210, 0.4)"
    headerBorderColor = theme === "dark" ? "rgba(144, 202, 249, 0.3)" : "rgba(144, 202, 249, 0.5)"
    donationTextColor = "#1976d2" // Color mente
  } else if (section === "cuerpo") {
    headerBgColor = theme === "dark" ? "rgba(255, 160, 0, 0.2)" : "rgba(255, 160, 0, 0.4)"
    headerBorderColor = theme === "dark" ? "rgba(255, 224, 130, 0.3)" : "rgba(255, 224, 130, 0.6)"
    donationTextColor = "#ffa000" // Color cuerpo
  } else if (section === "finanzas") {
    headerBgColor = theme === "dark" ? "rgba(56, 142, 60, 0.2)" : "rgba(56, 142, 60, 0.4)"
    headerBorderColor = theme === "dark" ? "rgba(165, 214, 167, 0.3)" : "rgba(165, 214, 167, 0.6)"
    donationTextColor = "#388e3c" // Color finanzas
  }

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

  const handleMenuToggle = () => {
    triggerHapticFeedback("light")
    setIsMenuOpen(!isMenuOpen)
  }

  const handleBackClick = () => {
    triggerHapticFeedback("medium")
    router.back()
  }

  if (!mounted) return null

  return (
    <>
      <div className="menu-backdrop"></div>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          backgroundColor: headerBgColor,
          borderBottom: `1px solid ${headerBorderColor}`,
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          {isToolPage ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              style={{
                marginRight: "0.5rem",
                backgroundColor: "transparent",
              }}
              className="hover:bg-white/30 dark:hover:bg-gray-700/30"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Button>
          ) : (
            <div className="w-10"></div> // Espacio vacío para mantener el centrado
          )}

          <Link
            href="/"
            className="font-bold text-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
            onClick={() => triggerHapticFeedback("light")}
            style={{
              backgroundColor: theme === "dark" ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.4)",
              padding: "0.375rem 1rem",
              borderRadius: "0.375rem",
            }}
          >
            HOLENTIA
          </Link>

          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/30 dark:hover:bg-gray-700/30 active:scale-95 transition-transform"
                onClick={handleMenuToggle}
                style={{
                  backgroundColor: "transparent",
                }}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem asChild>
                <Link href="/" className="mobile-menu-item" onClick={() => triggerHapticFeedback("light")}>
                  Inicio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/mente" className="mobile-menu-item" onClick={() => triggerHapticFeedback("light")}>
                  Mente
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cuerpo" className="mobile-menu-item" onClick={() => triggerHapticFeedback("light")}>
                  Cuerpo
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finanzas" className="mobile-menu-item" onClick={() => triggerHapticFeedback("light")}>
                  Finanzas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ayuda" className="mobile-menu-item" onClick={() => triggerHapticFeedback("light")}>
                  Ayuda
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/apoyar"
                  className="mobile-menu-item"
                  onClick={() => triggerHapticFeedback("light")}
                  style={{ color: donationTextColor }}
                >
                  Hacer donación
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  triggerHapticFeedback("medium")
                  setTheme(theme === "dark" ? "light" : "dark")
                }}
                className="mobile-menu-item flex items-center justify-between"
              >
                <span>Modo {theme === "dark" ? "Claro" : "Oscuro"}</span>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
