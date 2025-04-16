"use client"

import { useEffect, useState } from "react"

type HapticIntensity = "light" | "medium" | "heavy"

export function useHapticFeedback() {
  const [hapticAvailable, setHapticAvailable] = useState(false)

  useEffect(() => {
    // Comprobar si la API de vibración está disponible
    setHapticAvailable("vibrate" in navigator)
  }, [])

  const triggerHapticFeedback = (intensity: HapticIntensity = "medium") => {
    if (!hapticAvailable) return

    // Diferentes patrones de vibración según la intensidad
    switch (intensity) {
      case "light":
        navigator.vibrate(10)
        break
      case "medium":
        navigator.vibrate(20)
        break
      case "heavy":
        navigator.vibrate([20, 30, 40])
        break
      default:
        navigator.vibrate(20)
    }
  }

  return { triggerHapticFeedback, hapticAvailable }
}
