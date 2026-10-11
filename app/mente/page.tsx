import SectionPage from "@/components/sections/section-page"
import { sectionMetadata } from "@/lib/seo"

export function generateMetadata() {
  return sectionMetadata("mente")
}

export default function MentePage() {
  return <SectionPage section="mente" />
}
