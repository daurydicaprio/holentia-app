"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { getSectionColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function MobileFab() {
  const [showButton, setShowButton] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Extraer la sección del pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const section = pathParts.length > 0 ? pathParts[0] : null
  const sectionColor = getSectionColor(section)

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

  const buttonClasses = sectionColor
    ? `bg-${sectionColor}-DEFAULT hover:bg-${sectionColor}-dark text-white`
    : "bg-gray-700 hover:bg-gray-800 text-white"

  return (
    <Button
      size="icon"
      className={cn("fixed bottom-6 right-6 rounded-full shadow-lg z-40 h-12 w-12", buttonClasses)}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  )
}
