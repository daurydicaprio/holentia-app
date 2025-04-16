import Link from "next/link"

interface FooterProps {
  section?: string | null
}

export default function Footer({ section }: FooterProps) {
  // Determinar las clases de color basadas en la sección
  let linkClass = "text-blue-500 hover:text-blue-700"

  if (section === "mente") {
    linkClass = "text-mente-DEFAULT hover:text-mente-dark"
  } else if (section === "cuerpo") {
    linkClass = "text-cuerpo-DEFAULT hover:text-cuerpo-dark"
  } else if (section === "finanzas") {
    linkClass = "text-finanzas-DEFAULT hover:text-finanzas-dark"
  }

  return (
    <footer className="w-full mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="mb-2">Hecho con ❤ 🇩🇴 #VERyGoodforlife</div>
      <div className="text-xs opacity-75">
        <Link href="https://daurydicaprio.com" target="_blank" className={linkClass}>
          Daury DiCaprio
        </Link>
      </div>
    </footer>
  )
}
