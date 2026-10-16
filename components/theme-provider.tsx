"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

// Sin gate de montaje: next-themes inyecta su script anti-flash en el HTML inicial
// (SSR) y evita el destello claro→oscuro. El gate local `mounted` de los componentes
// que leen el tema (menú, header, charts) sigue siendo necesario para su icono/estado.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
