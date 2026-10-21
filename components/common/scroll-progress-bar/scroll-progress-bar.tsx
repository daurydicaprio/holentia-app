"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Progreso de lectura del documento, fijo en el borde inferior.
 * Recorta el relleno directamente en el DOM para no re-renderizar en cada scroll.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      bar.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    bar.style.clipPath = "inset(0 100% 0 0)"
    update()

    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    window.addEventListener("load", requestUpdate)

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestUpdate) : null
    observer?.observe(document.documentElement)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      window.removeEventListener("load", requestUpdate)
      observer?.disconnect()
    }
  }, [pathname])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] h-[3px] print:hidden"
    >
      <div
        ref={barRef}
        style={{ clipPath: "inset(0 100% 0 0)" }}
        className="scroll-progress-bar h-full w-full will-change-[clip-path]"
      />
    </div>
  )
}
