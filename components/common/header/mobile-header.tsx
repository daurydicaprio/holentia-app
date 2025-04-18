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
import { sectionsData } from "@/lib/data"

interface MobileHeaderProps {
  section?: string | null
}

export default function MobileHeader({ section }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Verificar si estamos en una página de herramienta
  const pathParts = pathname ? pathname.split("/").filter(Boolean) : []
  const firstPart = pathParts.length > 0 ? pathParts[0] : null

  // Determinar si estamos en una herramienta
  let isToolPage = false
  let toolSection = section

  if (!["mente", "cuerpo", "finanzas"].includes(firstPart)) {
    // Podría ser una herramienta, buscar en todas las secciones
    for (const [sectionId, sectionData] of Object.entries(sectionsData)) {
      const toolExists = sectionData.cards.some((card) => card.slug === firstPart)
      if (toolExists) {
        isToolPage = true
        toolSection = sectionId
        break
      }
    }
  }

  // Usar el tema resuelto para evitar parpadeos
  const currentTheme = mounted ? resolvedTheme : "light"

  // Determinar los estilos basados en la sección
  let headerBgColor = currentTheme === "dark" ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"
  let headerBorderColor = currentTheme === "dark" ? "#333333" : "#e5e7eb"
  let donationTextColor = "#3B82F6" // Color azul por defecto

  // Actualizar los colores de fondo del header para que usen las variables CSS

  if (toolSection === "mente") {
    headerBgColor = currentTheme === "dark" ? "var(--color-mente-glass-bg)" : "var(--color-mente-glass-bg)"
    headerBorderColor = currentTheme === "dark" ? "var(--color-mente-glass-border)" : "var(--color-mente-glass-border)"
    donationTextColor = "var(--color-mente-active)" // Color mente
  } else if (toolSection === "cuerpo") {
    headerBgColor = currentTheme === "dark" ? "var(--color-cuerpo-glass-bg)" : "var(--color-cuerpo-glass-bg)"
    headerBorderColor =
      currentTheme === "dark" ? "var(--color-cuerpo-glass-border)" : "var(--color-cuerpo-glass-border)"
    donationTextColor = "var(--color-cuerpo-active)" // Color cuerpo
  } else if (toolSection === "finanzas") {
    headerBgColor = currentTheme === "dark" ? "var(--color-finanzas-glass-bg)" : "var(--color-finanzas-glass-bg)"
    headerBorderColor =
      currentTheme === "dark" ? "var(--color-finanzas-glass-border)" : "var(--color-finanzas-glass-border)"
    donationTextColor = "var(--color-finanzas-active)" // Color finanzas
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

    // Si estamos en una página de herramienta, ir a la sección correspondiente
    if (isToolPage && toolSection) {
      router.push(`/${toolSection}`)
      return
    }

    // Comportamiento por defecto: volver atrás
    router.back()
  }

  if (!mounted) return null

  // Si estamos en una página de herramienta, mantener el diseño original
  if (isToolPage) {
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
            transition: "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              style={{
                backgroundColor: "transparent",
                height: "44px",
                width: "44px",
              }}
              className="hover:bg-white/30 dark:hover:bg-gray-700/30 active:scale-90 transition-all duration-200"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Button>

            <Link
              href="/"
              className="font-bold text-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 active:scale-95"
              onClick={() => triggerHapticFeedback("light")}
              style={{
                backgroundColor: currentTheme === "dark" ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.4)",
                padding: "0.5rem 1.25rem",
                borderRadius: "0.5rem",
                transition: "all 0.2s ease",
              }}
            >
              HOLENTIA
            </Link>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/30 dark:hover:bg-gray-700/30 active:scale-90 transition-all duration-200"
                  onClick={handleMenuToggle}
                  style={{
                    backgroundColor: "transparent",
                    height: "44px",
                    width: "44px",
                  }}
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
              >
                <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
                </div>
                <div className="py-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Inicio
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/mente"
                      className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Mente
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/cuerpo"
                      className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Cuerpo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/finanzas"
                      className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Finanzas
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/ayuda"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Ayuda
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/apoyar"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                      style={{ color: donationTextColor }}
                    >
                      Hacer donación
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem
                    onClick={() => {
                      triggerHapticFeedback("medium")
                      setTheme(currentTheme === "dark" ? "light" : "dark")
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  >
                    <span>Modo {currentTheme === "dark" ? "Claro" : "Oscuro"}</span>
                    {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </>
    )
  }

  // Para home o secciones, usar el nuevo diseño con el botón de menú a la derecha
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
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex-1"></div>

          <Link
            href="/"
            className="font-bold text-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
            onClick={() => triggerHapticFeedback("light")}
            style={{
              backgroundColor: currentTheme === "dark" ? "rgba(30, 30, 30, 0.4)" : "rgba(255, 255, 255, 0.4)",
              padding: "0.375rem 1rem",
              borderRadius: "0.375rem",
              transition: "background-color 0.3s ease",
            }}
          >
            HOLENTIA
          </Link>

          <div className="flex-1 flex justify-end">
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
                className="w-64 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
              >
                <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
                </div>
                <div className="py-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Inicio
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/mente"
                      className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Mente
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/cuerpo"
                      className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Cuerpo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/finanzas"
                      className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Finanzas
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/ayuda"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      Ayuda
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/apoyar"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => triggerHapticFeedback("light")}
                      style={{ color: donationTextColor }}
                    >
                      Hacer donación
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem
                    onClick={() => {
                      triggerHapticFeedback("medium")
                      setTheme(currentTheme === "dark" ? "light" : "dark")
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  >
                    <span>Modo {currentTheme === "dark" ? "Claro" : "Oscuro"}</span>
                    {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
