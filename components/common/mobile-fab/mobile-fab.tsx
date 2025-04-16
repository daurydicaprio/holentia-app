"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function MobileFab() {
  const [showButton, setShowButton] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null

  // Determinar las clases de color basadas en la sección
  let buttonClass = "bg-gray-700 hover:bg-gray-800 text-white"

  if (section === "mente") {
    buttonClass = "bg-mente-DEFAULT hover:bg-mente-dark text-white"
  } else if (section === "cuerpo") {
    buttonClass = "bg-cuerpo-DEFAULT hover:bg-cuerpo-dark text-white"
  } else if (section === "finanzas") {
    buttonClass = "bg-finanzas-DEFAULT hover:bg-finanzas-dark text-white"
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isMobile || !showButton) return null

  return (
    <Button
      size="icon"
      className={`fixed bottom-6 right-6 rounded-full shadow-lg z-40 h-12 w-12 ${buttonClass}`}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  )
}
