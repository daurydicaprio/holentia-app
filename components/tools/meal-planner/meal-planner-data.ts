export const MEAL_PLANNER_STORAGE_KEY = "holentia:planificador-comidas:entries:v1"

export type MealType = "desayuno" | "almuerzo" | "cena"

export type MealTag = "rapido" | "vegetariano" | "proteico"

export interface MealSuggestion {
  id: string
  type: MealType
  title: string
  note: string
  ingredients: string[]
  tags: MealTag[]
}

export interface PlannedMeal {
  title: string
  note: string
  ingredients: string[]
  suggestionId?: string
}

export interface WeekPlan {
  meals: Record<string, PlannedMeal>
  checked: Record<string, true>
}

export interface MealPlannerState {
  weeks: Record<string, WeekPlan>
}

export const EMPTY_WEEK_PLAN: WeekPlan = { meals: {}, checked: {} }

export const EMPTY_MEAL_PLANNER_STATE: MealPlannerState = { weeks: {} }

export const MEAL_TYPES: { id: MealType; label: string; cellLabel: string }[] = [
  { id: "desayuno", label: "Desayuno", cellLabel: "Añadir desayuno" },
  { id: "almuerzo", label: "Almuerzo", cellLabel: "Añadir almuerzo" },
  { id: "cena", label: "Cena", cellLabel: "Añadir cena" },
]

export const MEAL_TAG_LABELS: Record<MealTag, string> = {
  rapido: "Rápido",
  vegetariano: "Vegetariano",
  proteico: "Alto en proteína",
}

export const MEAL_SUGGESTIONS: MealSuggestion[] = [
  {
    id: "avena-platano",
    type: "desayuno",
    title: "Avena con plátano y canela",
    note: "Puedes dejarla reposar la noche anterior.",
    ingredients: ["avena", "leche", "plátano", "canela"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "huevos-pan",
    type: "desayuno",
    title: "Huevos revueltos con pan integral",
    note: "Acompaña con tomate en rodajas.",
    ingredients: ["huevos", "pan integral", "tomate", "aceite de oliva"],
    tags: ["rapido", "proteico"],
  },
  {
    id: "yogur-granola",
    type: "desayuno",
    title: "Yogur con granola y fruta",
    note: "Elige fruta de temporada y yogur natural.",
    ingredients: ["yogur natural", "granola", "fruta de temporada"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "mangu-huevos",
    type: "desayuno",
    title: "Mangú con huevos y salami",
    note: "Un clásico dominicano para empezar con energía.",
    ingredients: ["plátano verde", "huevos", "salami", "cebolla roja", "vinagre"],
    tags: ["proteico"],
  },
  {
    id: "tostadas-aguacate",
    type: "desayuno",
    title: "Tostadas de aguacate y tomate",
    note: "Un chorrito de limón realza el sabor.",
    ingredients: ["pan integral", "aguacate", "tomate", "limón"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "tortilla-vegetales",
    type: "desayuno",
    title: "Tortilla de vegetales",
    note: "Aprovecha pimiento, cebolla o espinaca.",
    ingredients: ["huevos", "pimiento", "cebolla", "espinaca", "aceite de oliva"],
    tags: ["proteico", "vegetariano"],
  },
  {
    id: "smoothie-avena",
    type: "desayuno",
    title: "Smoothie de avena y banana",
    note: "Si quieres más textura, añade hielo.",
    ingredients: ["avena", "banana", "leche", "mantequilla de maní"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "panqueques-avena",
    type: "desayuno",
    title: "Panqueques de avena",
    note: "Sirve con fruta en lugar de sirope.",
    ingredients: ["avena", "huevos", "leche", "plátano", "canela"],
    tags: ["vegetariano", "proteico"],
  },
  {
    id: "pollo-arroz-ensalada",
    type: "almuerzo",
    title: "Pollo guisado con arroz y ensalada",
    note: "Cocina una porción extra para las sobras.",
    ingredients: ["pollo", "arroz", "tomate", "lechuga", "cebolla", "ajo"],
    tags: ["proteico"],
  },
  {
    id: "habichuelas-arroz",
    type: "almuerzo",
    title: "Habichuelas con arroz y aguacate",
    note: "Un plato económico y lleno de fibra.",
    ingredients: ["habichuelas rojas", "arroz", "aguacate", "cebolla", "ajo"],
    tags: ["vegetariano"],
  },
  {
    id: "atun-garbanzos",
    type: "almuerzo",
    title: "Ensalada de atún con garbanzos",
    note: "Escurre bien el atún y los garbanzos.",
    ingredients: ["atún", "garbanzos", "tomate", "pepino", "limón", "aceite de oliva"],
    tags: ["rapido", "proteico"],
  },
  {
    id: "pasta-vegetales",
    type: "almuerzo",
    title: "Pasta integral con vegetales",
    note: "Guarda un poco del agua de cocción para la salsa.",
    ingredients: ["pasta integral", "tomate", "calabacín", "cebolla", "aceite de oliva"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "bowl-pollo-quinoa",
    type: "almuerzo",
    title: "Bowl de pollo y quinoa",
    note: "Adereza con limón, aceite y hierbas.",
    ingredients: ["pollo", "quinoa", "zanahoria", "pepino", "aguacate"],
    tags: ["proteico"],
  },
  {
    id: "sancocho-pollo",
    type: "almuerzo",
    title: "Sancocho de pollo",
    note: "Rinde bien y sabe mejor al día siguiente.",
    ingredients: ["pollo", "yuca", "plátano verde", "auyama", "cebolla", "ajo"],
    tags: [],
  },
  {
    id: "arroz-vegetales-huevo",
    type: "almuerzo",
    title: "Arroz con vegetales y huevo",
    note: "Perfecto para aprovechar arroz cocido.",
    ingredients: ["arroz", "huevos", "zanahoria", "guisantes", "cebolla"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "wrap-pollo",
    type: "almuerzo",
    title: "Wrap de pollo y vegetales",
    note: "Usa yogur natural en lugar de salsa cremosa.",
    ingredients: ["tortilla integral", "pollo", "lechuga", "tomate", "yogur natural"],
    tags: ["rapido", "proteico"],
  },
  {
    id: "pescado-horno",
    type: "cena",
    title: "Pescado al horno con vegetales",
    note: "Con limón y un poco de aceite de oliva.",
    ingredients: ["pescado", "calabacín", "pimiento", "cebolla", "limón", "aceite de oliva"],
    tags: ["proteico"],
  },
  {
    id: "sopa-lentejas",
    type: "cena",
    title: "Sopa de lentejas",
    note: "Añade zanahoria y tomate para más color.",
    ingredients: ["lentejas", "zanahoria", "cebolla", "ajo", "tomate"],
    tags: ["vegetariano"],
  },
  {
    id: "ensalada-pollo",
    type: "cena",
    title: "Ensalada de pollo y aguacate",
    note: "Ideal si quieres una cena ligera y completa.",
    ingredients: ["pollo", "lechuga", "tomate", "aguacate", "limón"],
    tags: ["rapido", "proteico"],
  },
  {
    id: "tortilla-papa",
    type: "cena",
    title: "Tortilla de papa y cebolla",
    note: "Cocina la papa en láminas finas.",
    ingredients: ["papa", "huevos", "cebolla", "aceite de oliva"],
    tags: ["vegetariano"],
  },
  {
    id: "salteado-tofu",
    type: "cena",
    title: "Salteado de vegetales con tofu",
    note: "Añade salsa de soja al final.",
    ingredients: ["tofu", "brócoli", "pimiento", "zanahoria", "salsa de soja"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "quesadillas-frijoles",
    type: "cena",
    title: "Quesadillas de frijoles",
    note: "Calienta la tortilla en sartén seca.",
    ingredients: ["tortilla integral", "frijoles", "queso", "tomate", "aguacate"],
    tags: ["rapido", "vegetariano"],
  },
  {
    id: "pollo-batata",
    type: "cena",
    title: "Pollo al horno con batata",
    note: "Asa todo en la misma bandeja.",
    ingredients: ["pollo", "batata", "brócoli", "aceite de oliva", "ajo"],
    tags: ["proteico"],
  },
  {
    id: "pasta-atun",
    type: "cena",
    title: "Pasta con atún y tomate",
    note: "Una cena rápida con lo que tengas en la alacena.",
    ingredients: ["pasta", "atún", "tomate", "cebolla", "aceite de oliva"],
    tags: ["rapido", "proteico"],
  },
]
