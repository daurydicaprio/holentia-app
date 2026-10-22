/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Las rutas de guía leen el Markdown con fs en build y en la OG dinámica.
  // Incluimos el contenido en el trazado del servidor para que Vercel no lo omita.
  outputFileTracingIncludes: {
    "/guias/[slug]": ["./content/guias/**/*.md"],
    "/guias/[slug]/opengraph-image": ["./content/guias/**/*.md"],
  },
}

export default nextConfig
