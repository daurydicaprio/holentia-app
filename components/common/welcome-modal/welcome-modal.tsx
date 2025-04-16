"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Logo from "@/components/common/logo/logo"

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Verificar si es la primera visita
    const hasVisited = localStorage.getItem("holentia-visited")

    if (!hasVisited) {
      setIsOpen(true)
      localStorage.setItem("holentia-visited", "true")
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">Bienvenido a HOLENTIA</DialogTitle>
          <div className="flex justify-center py-6">
            <Logo size="md" />
          </div>
          <div className="text-center text-base text-muted-foreground">
            <div className="mb-4">
              Descubre herramientas que transformarán tu bienestar integral. HOLENTIA te ofrece recursos para cultivar
              tu mente, energizar tu cuerpo y dominar tus finanzas.
            </div>
            <div>
              Explora, aprende y crece con nuestras calculadoras, simuladores y planificadores diseñados para mejorar tu
              calidad de vida.
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-center pt-4">
          <Button onClick={() => setIsOpen(false)} className="w-full sm:w-auto px-8 py-2 text-base">
            Comenzar a explorar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
