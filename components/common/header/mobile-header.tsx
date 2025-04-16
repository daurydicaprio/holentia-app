"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { getSectionColor } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface MobileHeaderProps {
  section?: string | null
}

export default function MobileHeader({ section }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const sectionColor = getSectionColor(section)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()

  // Verificar si estamos en una página de herramienta
  const pathParts = pathname ? pathname.split("/").filter(Boolean) : []
  const isToolPage = pathParts.length > 1

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

  const headerClasses = sectionColor
    ? `bg-${sectionColor}-glass border-b border-${sectionColor}-border`
    : "bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700"

  return (
    <>
      <div className="menu-backdrop"></div>
      <header className={`sticky top-0 z-50 backdrop-blur-md ${headerClasses} w-full`}>
        <div className="flex items-center justify-between h-14 px-4">
          {isToolPage ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="mr-2 hover:bg-white/30 dark:hover:bg-gray-700/30"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Button>
          ) : (
            <div className="w-10"></div> // Espacio vacío para mantener el centrado
          )}

          <Link
            href="/"
            className="font-bold text-lg bg-white/40 dark:bg-gray-800/40 px-4 py-1.5 rounded-md hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
            onClick={() => triggerHapticFeedback("light")}
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
                  className={cn("mobile-menu-item", sectionColor ? `text-${sectionColor}-DEFAULT` : "")}
                  onClick={() => triggerHapticFeedback("light")}
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
