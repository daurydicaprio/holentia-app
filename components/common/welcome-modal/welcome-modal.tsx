"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Logo from "@/components/common/logo/logo"
import { ArrowRight } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { triggerHapticFeedback } = useHapticFeedback()

  useEffect(() => {
    setMounted(true)

    // Verificar si es la primera visita
    const hasVisited = localStorage.getItem("holentia-visited")

    if (!hasVisited) {
      // Pequeño retraso para asegurar que el componente esté montado
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem("holentia-visited", "true")
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    triggerHapticFeedback("medium")
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-2xl p-0 overflow-hidden border-0 shadow-xl bg-white dark:bg-gray-900"
        style={{
          width: "95vw",
          maxWidth: "700px",
        }}
      >
        {/* Encabezado con diseño más neutro */}
        <div className="relative bg-gray-100 dark:bg-gray-800 p-8 pb-16">
          <DialogHeader>
            <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">Bienvenido a HOLENTIA</h2>
          </DialogHeader>
        </div>

        {/* Logo superpuesto sobre el borde del encabezado */}
        <div className="flex justify-center -mt-12 mb-4">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
            <Logo size="sm" />
          </div>
        </div>

        {/* Contenido */}
        <div className="px-8 pt-2 pb-6">
          <div className="space-y-4 text-center">
            <p className="text-base text-gray-600 dark:text-gray-300">
              Descubre herramientas que transformarán tu bienestar integral. HOLENTIA te ofrece recursos para:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg transform transition-transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400">Cultivar tu mente</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Claridad y bienestar emocional</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg transform transition-transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-amber-600 dark:text-amber-400">Energizar tu cuerpo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Salud y actividad física</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg transform transition-transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-green-600 dark:text-green-400">Dominar tus finanzas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Planificación y crecimiento</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Explora, aprende y crece con nuestras calculadoras, simuladores y planificadores diseñados para mejorar tu
              calidad de vida.
            </p>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-2">
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto px-8 py-6 text-base relative group"
            style={{
              backgroundColor: "#f8f9fa",
              color: "#212529",
              border: "1px solid #dee2e6",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#e9ecef"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa"
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-4 transition-all duration-300">
              Comenzar a explorar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
