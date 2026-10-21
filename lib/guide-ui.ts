import type { GuideCategory } from "@/types/guide"

/** Etiquetas de categoría con contraste AA para texto pequeño en ambos temas. */
export const guideCategoryText: Record<GuideCategory, string> = {
  mente: "text-mente-dark dark:text-mente-light",
  relaciones: "text-relaciones dark:text-relaciones-light",
  cuerpo: "text-cuerpo-darkest dark:text-cuerpo-light",
  finanzas: "text-finanzas-dark dark:text-finanzas-light",
  general: "text-gray-600 dark:text-gray-300",
}

/** Punto de color de categoría. */
export const guideCategoryDot: Record<GuideCategory, string> = {
  mente: "bg-mente",
  relaciones: "bg-relaciones",
  cuerpo: "bg-cuerpo",
  finanzas: "bg-finanzas",
  general: "bg-gray-400",
}

/** Borde de tarjeta en hover, con el acento de la categoría. */
export const guideCategoryHoverBorder: Record<GuideCategory, string> = {
  mente: "hover:border-mente dark:hover:border-mente-light",
  relaciones: "hover:border-relaciones dark:hover:border-relaciones-light",
  cuerpo: "hover:border-cuerpo-dark dark:hover:border-cuerpo-light",
  finanzas: "hover:border-finanzas dark:hover:border-finanzas-light",
  general: "hover:border-gray-400 dark:hover:border-gray-500",
}

/** Título en hover: tier AA sobre blanco/gris-900, no la base de sección. */
export const guideCategoryHoverTitle: Record<GuideCategory, string> = {
  mente: "group-hover:text-mente-dark dark:group-hover:text-mente-light",
  relaciones: "group-hover:text-relaciones-dark dark:group-hover:text-relaciones-lighter",
  cuerpo: "group-hover:text-cuerpo-darkest dark:group-hover:text-cuerpo-light",
  finanzas: "group-hover:text-finanzas-dark dark:group-hover:text-finanzas-lighter",
  general: "group-hover:text-gray-900 dark:group-hover:text-gray-100",
}
