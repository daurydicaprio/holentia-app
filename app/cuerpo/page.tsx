import SectionPage from "@/components/sections/section-page"
import { sectionMetadata } from "@/lib/seo"

export function generateMetadata() {
  return sectionMetadata("cuerpo")
}

export default function CuerpoPage() {
  return <SectionPage section="cuerpo" />
}
