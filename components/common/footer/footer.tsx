import Link from "next/link"
import { getSectionColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface FooterProps {
  section?: string | null
}

export default function Footer({ section }: FooterProps) {
  const sectionColor = getSectionColor(section)

  return (
    <footer className="w-full mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="mb-2">Hecho con ❤ 🇩🇴 #VERyGoodforlife</div>
      <div className="text-xs opacity-75">
        <Link
          href="https://daurydicaprio.com"
          target="_blank"
          className={cn(
            sectionColor
              ? `text-${sectionColor}-DEFAULT hover:text-${sectionColor}-dark`
              : "text-blue-500 hover:text-blue-700",
          )}
        >
          Daury DiCaprio
        </Link>
      </div>
    </footer>
  )
}
