import SectionPage from "@/components/sections/section-page"
import { sectionMetadata } from "@/lib/seo"

export function generateMetadata() {
  return sectionMetadata("finanzas")
}

export default function FinanzasPage() {
  return <SectionPage section="finanzas" />
}
