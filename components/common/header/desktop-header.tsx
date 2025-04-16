"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DesktopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null

  // Determinar las clases de color basadas en la sección
  let sectionTextClass = ""
  if (section === "mente") sectionTextClass = "text-mente-DEFAULT"
  else if (section === "cuerpo") sectionTextClass = "text-cuerpo-DEFAULT"
  else if (section === "finanzas") sectionTextClass = "text-finanzas-DEFAULT"

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

  return (
    <>
      <div className="menu-backdrop"></div>
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-transform"
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
              <Link href="/apoyar" className={cn("mobile-menu-item", sectionTextClass)}>
                Hacer donación
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mobile-menu-item flex items-center justify-between"
            >
              <span>Modo {theme === "dark" ? "Claro" : "Oscuro"}</span>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
