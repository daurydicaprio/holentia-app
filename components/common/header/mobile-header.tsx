"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
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
  let headerGradient = "none"

  // Actualizar los colores y gradientes para el header móvil en páginas de herramientas
  if (isToolPage) {
    if (toolSection === "mente") {
      // Azul para mente con mayor opacidad (60%)
      headerBgColor = currentTheme === "dark" ? "rgba(21, 101, 192, 0.6)" : "rgba(21, 101, 192, 0.6)"
      headerBorderColor = currentTheme === "dark" ? "rgba(144, 202, 249, 0.6)" : "rgba(144, 202, 249, 0.6)"
      headerGradient = "linear-gradient(to bottom, rgba(21, 101, 192, 0.6), rgba(13, 71, 161, 0.6))"
      donationTextColor = "#1976d2" // Color mente
    } else if (toolSection === "cuerpo") {
      // Ámbar para cuerpo con mayor opacidad (60%)
      headerBgColor = currentTheme === "dark" ? "rgba(239, 108, 0, 0.6)" : "rgba(239, 108, 0, 0.6)"
      headerBorderColor = currentTheme === "dark" ? "rgba(255, 224, 130, 0.6)" : "rgba(255, 224, 130, 0.6)"
      headerGradient = "linear-gradient(to bottom, rgba(239, 108, 0, 0.6), rgba(230, 81, 0, 0.6))"
      donationTextColor = "#ffa000" // Color cuerpo
    } else if (toolSection === "finanzas") {
      // Verde para finanzas con mayor opacidad (60%)
      headerBgColor = currentTheme === "dark" ? "rgba(46, 125, 50, 0.6)" : "rgba(46, 125, 50, 0.6)"
      headerBorderColor = currentTheme === "dark" ? "rgba(165, 214, 167, 0.6)" : "rgba(165, 214, 167, 0.6)"
      headerGradient = "linear-gradient(to bottom, rgba(46, 125, 50, 0.6), rgba(27, 94, 32, 0.6))"
      donationTextColor = "#388e3c" // Color finanzas
    }
  }

  // Efecto para manejar el backdrop del menú
  useEffect(() => {
    const backdrop = document.querySelector(".mobile-menu-backdrop") as HTMLDivElement
    if (!backdrop) {
      const newBackdrop = document.createElement("div")
      newBackdrop.className = "mobile-menu-backdrop"
      newBackdrop.style.position = "fixed"
      newBackdrop.style.inset = "0"
      newBackdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
      newBackdrop.style.backdropFilter = "blur(5px)"
      newBackdrop.style.zIndex = "80"
      newBackdrop.style.opacity = "0"
      newBackdrop.style.pointerEvents = "none"
      newBackdrop.style.transition = "opacity 300ms"
      document.body.appendChild(newBackdrop)
    }

    const currentBackdrop = document.querySelector(".mobile-menu-backdrop") as HTMLDivElement

    if (isMenuOpen) {
      currentBackdrop.style.opacity = "1"
      currentBackdrop.style.pointerEvents = "auto"
      document.body.style.overflow = "hidden" // Prevenir scroll
    } else {
      currentBackdrop.style.opacity = "0"
      currentBackdrop.style.pointerEvents = "none"
      document.body.style.overflow = "" // Restaurar scroll
    }

    // Función para cerrar el menú con la tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Función para cerrar el menú al hacer clic en el backdrop
    const handleBackdropClick = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Limpiar los event listeners anteriores
    currentBackdrop.removeEventListener("click", handleBackdropClick)
    document.removeEventListener("keydown", handleEscape)

    // Solo añadir event listeners cuando el menú está abierto
    if (isMenuOpen) {
      currentBackdrop.addEventListener("click", handleBackdropClick)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      // Limpiar los event listeners al desmontar
      currentBackdrop.removeEventListener("click", handleBackdropClick)
      document.removeEventListener("keydown", handleEscape)
      // Asegurar que el scroll se restaure
      document.body.style.overflow = ""
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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)", // Añadir soporte para Safari
          backgroundColor: headerBgColor,
          backgroundImage: headerGradient,
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
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              height: "44px",
              width: "44px",
              color: currentTheme === "dark" ? "#ffffff" : "#ffffff",
            }}
            className="hover:bg-white/30 dark:hover:bg-white/30 active:scale-90 active:bg-white/50 dark:active:bg-white/50 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Volver</span>
          </Button>

          <Link
            href="/"
            className="font-bold text-xl hover:bg-white/60 dark:hover:bg-white/60 active:bg-white/80 dark:active:bg-white/80 transition-all duration-200 active:scale-95"
            onClick={() => triggerHapticFeedback("light")}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              transition: "all 0.2s ease",
              color: currentTheme === "dark" ? "#ffffff" : "#ffffff",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            HOLENTIA
          </Link>

          <div className="relative" style={{ zIndex: 1000 }}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/30 dark:hover:bg-white/30 active:bg-white/50 dark:active:bg-white/50 active:scale-90 transition-all duration-200"
              onClick={handleMenuToggle}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                height: "44px",
                width: "44px",
                zIndex: 1000,
                color: currentTheme === "dark" ? "#ffffff" : "#ffffff",
              }}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-[60px] w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
                style={{
                  animation: "fadeIn 0.2s ease-out",
                  zIndex: 1001,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  backgroundColor: currentTheme === "dark" ? "rgba(30, 30, 30, 0.85)" : "rgba(255, 255, 255, 0.85)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
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
                    onClick={() => {
                      triggerHapticFeedback("light")
                      setIsMenuOpen(false)
                    }}
                    style={{ color: donationTextColor }}
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

            {isMenuOpen && (
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                style={{ zIndex: 999 }}
                onClick={() => setIsMenuOpen(false)}
              ></div>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Para home o secciones, usar el nuevo diseño con el botón de menú a la derecha
  return (
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
          className="font-bold text-lg hover:bg-white/60 dark:hover:bg-gray-700/60 active:bg-white/80 dark:active:bg-gray-700/80 transition-all duration-200 active:scale-95"
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
          <div className="relative" style={{ zIndex: 1000 }}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/30 dark:hover:bg-gray-700/30 active:bg-white/50 dark:active:bg-gray-700/50 active:scale-90 transition-all duration-200"
              onClick={handleMenuToggle}
              style={{
                backgroundColor: "transparent",
                height: "44px",
                width: "44px",
                zIndex: 1000,
              }}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-[60px] w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
                style={{
                  animation: "fadeIn 0.2s ease-out",
                  zIndex: 1001,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  backgroundColor: currentTheme === "dark" ? "rgba(30, 30, 30, 0.85)" : "rgba(255, 255, 255, 0.85)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
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
                    onClick={() => {
                      triggerHapticFeedback("light")
                      setIsMenuOpen(false)
                    }}
                    style={{ color: donationTextColor }}
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

            {isMenuOpen && (
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                style={{ zIndex: 999 }}
                onClick={() => setIsMenuOpen(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
