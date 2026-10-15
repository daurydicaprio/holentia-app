import { notFound } from "next/navigation"
import { findToolCard, toolMetadata, type FaqItem } from "@/lib/seo"
import ToolPageShell from "@/components/tool-seo/tool-page-shell"
import { RiskProfileTest } from "@/components/tools/risk-profile-test/risk-profile-test"

const section = "finanzas"
const toolSlug = "test-perfil-riesgo"

export function generateMetadata() {
  return toolMetadata(section, toolSlug)
}

const faq: FaqItem[] = [
  {
    question: "¿Qué hace el test de perfil de riesgo?",
    answer:
      "Son 12 preguntas sobre tu situación financiera, conocimientos y tolerancia al riesgo. Al terminar recibes un nivel de inversión (1 a 3), una sugerencia de cómo armar tu fondo de emergencia y una distribución de ejemplo entre instrumentos según tu monto.",
  },
  {
    question: "¿Qué es el perfil de riesgo?",
    answer:
      "Es la combinación de cuánta volatilidad estás dispuesto a soportar y qué tan bien entiendes los instrumentos. Un perfil conservador prioriza liquidez y seguridad; uno más agresivo acepta más fluctuación a cambio de potencial retorno a largo plazo.",
  },
  {
    question: "¿Por qué primero el fondo de emergencia?",
    answer:
      "Porque un imprevisto (pérdida de empleo, médico, reparación) sin colchón te obliga a endeudarte o a vender inversiones en mal momento. La herramienta calcula un colchón sugerido y te muestra dónde dejarlo según tu monto.",
  },
  {
    question: "¿Las tasas que muestra son garantizadas?",
    answer:
      "No, son tasas de referencia editables (puedes ajustarlas en la herramienta) basadas en instrumentos del mercado dominicano. Los rendimientos reales fluctúan y ningún instrumento garantiza la tasa mostrada. La fuente oficial de referencia es la Superintendencia de Bancos (sb.gob.do).",
  },
  {
    question: "¿Esto es asesoría financiera?",
    answer:
      "No. Es una herramienta educativa para orientar tus decisiones; no conoce todos tus detalles ni reemplaza a un asesor certificado. Invertir implica riesgos, incluida la pérdida del capital.",
  },
  {
    question: "¿Dónde se guardan mis respuestas?",
    answer:
      "En tu propio navegador (clave holentia:test-perfil-riesgo:draft:v1), sin servidores de por medio. Puedes borrarlo cuando quieras con «Borrar mis datos».",
  },
]

export default function TestPerfilRiesgoPage() {
  const toolData = findToolCard(section, toolSlug)

  if (!toolData) notFound()

  return (
    <ToolPageShell section={section} tool={toolData} faq={faq}>
      <RiskProfileTest />
    </ToolPageShell>
  )
}
