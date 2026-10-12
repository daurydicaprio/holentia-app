"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { cn } from "@/lib/utils"

const TABS = [
  {
    href: "/mente",
    label: "Mente",
    section: "mente",
    activeClass: "text-mente dark:text-mente-light",
    hoverClass: "hover:text-mente-darkest dark:hover:text-mente-light",
    underlineClass: "bg-mente dark:bg-mente-light",
  },
  {
    href: "/relaciones",
    label: "Relaciones",
    section: "relaciones",
    activeClass: "text-relaciones dark:text-relaciones-light",
    hoverClass: "hover:text-relaciones-darkest dark:hover:text-relaciones-light",
    underlineClass: "bg-relaciones dark:bg-relaciones-light",
  },
  {
    href: "/cuerpo",
    label: "Cuerpo",
    section: "cuerpo",
    activeClass: "text-cuerpo-dark dark:text-cuerpo-light",
    hoverClass: "hover:text-cuerpo-darkest dark:hover:text-cuerpo-light",
    underlineClass: "bg-cuerpo-dark dark:bg-cuerpo-light",
  },
  {
    href: "/finanzas",
    label: "Finanzas",
    section: "finanzas",
    activeClass: "text-finanzas dark:text-finanzas-light",
    hoverClass: "hover:text-finanzas-darkest dark:hover:text-finanzas-light",
    underlineClass: "bg-finanzas dark:bg-finanzas-light",
  },
] as const

export default function SectionTabs() {
  const pathname = usePathname()
  const { triggerHapticFeedback } = useHapticFeedback()

  const activeSection = pathname?.split("/").filter(Boolean)[0] ?? null

  return (
    <nav aria-label="Secciones" className="mt-6 flex flex-wrap justify-center gap-4">
      {TABS.map((tab) => {
        const isActive = activeSection === tab.section
        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={() => triggerHapticFeedback("light")}
            data-interactive="true"
            className={cn(
              "relative rounded-md px-4 py-2 text-sm transition-all duration-200",
              "text-gray-600 opacity-70 hover:opacity-90 dark:text-gray-400",
              isActive ? cn(tab.activeClass, "font-semibold opacity-100") : tab.hoverClass,
            )}
          >
            {tab.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute -bottom-1 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all duration-300",
                isActive ? "w-8" : "w-0",
                tab.underlineClass,
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}
