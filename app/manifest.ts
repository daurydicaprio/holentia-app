import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HOLENTIA — Herramientas de bienestar integral",
    short_name: "HOLENTIA",
    description:
      "Herramientas gratuitas de bienestar integral: mente, relaciones, cuerpo y finanzas. Funcionan en tu navegador, sin registrar tus datos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9fa",
    theme_color: "#f8f9fa",
    icons: [
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
