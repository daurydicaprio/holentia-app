import { notFound } from "next/navigation"
import { sectionsData } from "@/lib/data"
import ToolPageClient from "./tool-page-client"
import { generateStaticParams } from "./generateParams"

interface ToolPageProps {
  params: {
    section: string
    tool: string
  }
}

export { generateStaticParams }

export default function ToolPage({ params }: ToolPageProps) {
  // Verificar que los parámetros existen
  if (!params || !params.section || !params.tool) {
    notFound()
  }

  const { section, tool } = params

  // Verificar si la sección existe
  if (!sectionsData[section]) {
    notFound()
  }

  // Buscar la herramienta
  const toolData = sectionsData[section].cards.find((card) => card.slug === tool)

  // Verificar si la herramienta existe y está disponible
  if (!toolData || !toolData.isAvailable) {
    notFound()
  }

  return <ToolPageClient params={params} toolData={toolData} />
}
