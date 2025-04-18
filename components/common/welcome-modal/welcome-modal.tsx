"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    // Verificar si es la primera visita
    if (typeof window !== "undefined") {
      // Para forzar que aparezca el modal (solo para pruebas)
      localStorage.removeItem("holentia-visited")

      const hasVisited = localStorage.getItem("holentia-visited")

      if (!hasVisited) {
        // Pequeño retraso para asegurar que el componente esté montado
        const timer = setTimeout(() => {
          setIsOpen(true)
          localStorage.setItem("holentia-visited", "true")
        }, 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  useEffect(() => {
    // Manejar clic fuera del modal para cerrarlo
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    // Manejar tecla Escape para cerrar el modal
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
      // Restaurar scroll cuando el componente se desmonta o el modal se cierra
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleClose = () => {
    triggerHapticFeedback("medium")
    setIsOpen(false)
  }

  if (!mounted) return null

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={handleClose} // Cerrar al hacer clic en cualquier parte
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-[95vw] max-w-md overflow-hidden"
        style={{
          transform: "translateY(0)",
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()} // Evitar que los clics dentro del modal lo cierren
      >
        {/* Encabezado con diseño minimalista */}
        <div className="relative bg-gradient-to-r from-blue-500 to-green-500 p-6">
          <h2 className="text-center text-2xl font-bold text-white mb-2">HOLENTIA</h2>
          <div className="w-16 h-1 bg-white mx-auto"></div>
        </div>

        {/* Contenido */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-center text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Bienvenido a tu bienestar integral
          </h2>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
            Descubre herramientas que transformarán tu bienestar en tres áreas clave:
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 transition-transform hover:scale-105">
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Mente</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 transition-transform hover:scale-105">
              <span className="text-amber-600 dark:text-amber-400 font-medium text-sm">Cuerpo</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 transition-transform hover:scale-105">
              <span className="text-green-600 dark:text-green-400 font-medium text-sm">Finanzas</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0">
          <button
            onClick={handleClose}
            className="w-full py-2 relative group transition-all duration-300 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white border-0 rounded-md"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
              Comenzar a explorar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
