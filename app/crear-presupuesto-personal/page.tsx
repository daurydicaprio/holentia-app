import { sectionsData } from "@/lib/data"
import ToolPageClient from "@/components/tool-page-client"

export default function CrearPresupuestoPersonalPage() {
  const section = "finanzas"
  const toolSlug = "crear-presupuesto-personal"

  // Buscar la herramienta en la sección correspondiente
  const toolData = sectionsData[section].cards.find((card) => card.slug === toolSlug)

  // Crear los parámetros necesarios para el componente ToolPageClient
  const toolPageParams = {
    section,
    tool: toolSlug,
  }

  return <ToolPageClient params={toolPageParams} toolData={toolData} />
}
