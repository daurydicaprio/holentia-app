interface BrandDotsProps {
  className?: string
}

/** Los 4 puntos de sección de la identidad HOLENTIA (motivo de la imagen OG) */
export default function BrandDots({ className = "" }: BrandDotsProps) {
  return (
    <div aria-hidden="true" className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="h-2 w-2 rounded-full bg-mente" />
      <span className="h-2 w-2 rounded-full bg-relaciones" />
      <span className="h-2 w-2 rounded-full bg-cuerpo" />
      <span className="h-2 w-2 rounded-full bg-finanzas" />
    </div>
  )
}
