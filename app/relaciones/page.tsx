import SectionPage from "@/components/sections/section-page"
import { sectionMetadata } from "@/lib/seo"

export function generateMetadata() {
  return sectionMetadata("relaciones")
}

export default function RelacionesPage() {
  return <SectionPage section="relaciones" />
}
