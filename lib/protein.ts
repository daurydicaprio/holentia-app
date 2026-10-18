// Rangos de proteína diaria (g/kg de peso corporal) para adultos sanos.
// Fuentes: RDA 0,8 g/kg (IOM/NAM); 1,2–1,6 g/kg para actividad y fuerza
// (ACSM/AND/DC 2016; ISSN 2017); 1,6–2,2 g/kg en déficit para conservar
// músculo; 1,0–1,2 g/kg desde los 60 años (PROT-AGE/ESPEN).
// El total del día manda; repartir 20–40 g por comida ayuda (ISSN 2017).
export const KG_PER_LB = 0.45359237
export const LB_PER_KG = 2.2046226218

export interface ProteinProfile {
  id: "sedentario" | "activo" | "fuerza" | "deficit" | "mayor"
  label: string
  hint: string
  min: number
  max: number
}

export const PROTEIN_PROFILES: ProteinProfile[] = [
  {
    id: "sedentario",
    label: "Sedentario",
    hint: "Poco o ningún ejercicio",
    min: 0.8,
    max: 1,
  },
  {
    id: "activo",
    label: "Activo",
    hint: "Ejercicio moderado 3–5 días/semana",
    min: 1.2,
    max: 1.6,
  },
  {
    id: "fuerza",
    label: "Fuerza / ganar músculo",
    hint: "Con buena distribución, suele ser suficiente",
    min: 1.2,
    max: 1.6,
  },
  {
    id: "deficit",
    label: "Pérdida de grasa",
    hint: "Déficit calórico, cuidando el músculo",
    min: 1.6,
    max: 2.2,
  },
  {
    id: "mayor",
    label: "60 años o más",
    hint: "Prevenir la pérdida de masa muscular",
    min: 1,
    max: 1.2,
  },
]

export type ProteinProfileId = ProteinProfile["id"]

export const DEFAULT_PROTEIN_PROFILE: ProteinProfileId = "activo"

/** Perfil de proteína por id, con «Activo» como respaldo ante un valor inválido. */
export function getProteinProfile(id: string): ProteinProfile {
  return PROTEIN_PROFILES.find((profile) => profile.id === id) ?? PROTEIN_PROFILES[1]
}
