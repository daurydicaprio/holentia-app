export type HiitLevel = "principiante" | "intermedio" | "avanzado"
export type HiitFocus = "cuerpo-completo" | "piernas" | "core" | "cardio"
export type HiitDuration = 10 | 15 | 20 | 25

export interface HiitConfig {
  level: HiitLevel
  focus: HiitFocus
  duration: HiitDuration
  lowImpact: boolean
}

export interface HiitExercise {
  id: string
  name: string
  cue: string
  lowImpactName: string
  lowImpactCue: string
}

export type HiitSegmentType = "warmup" | "work" | "rest" | "cooldown"

export interface HiitSegment {
  type: HiitSegmentType
  seconds: number
  exercise?: HiitExercise
  nextExercise?: HiitExercise
  round?: number
}

export interface HiitLevelOption {
  id: HiitLevel
  label: string
  short: string
  work: number
  rest: number
}

export interface HiitFocusOption {
  id: HiitFocus
  label: string
  description: string
}

export const HIIT_DURATIONS: HiitDuration[] = [10, 15, 20, 25]
export const WARMUP_SECONDS = 45
export const COOLDOWN_SECONDS = 30

export const HIIT_LEVELS: HiitLevelOption[] = [
  {
    id: "principiante",
    label: "Principiante",
    short: "Para empezar",
    work: 30,
    rest: 30,
  },
  {
    id: "intermedio",
    label: "Intermedio",
    short: "Ya te mueves",
    work: 40,
    rest: 20,
  },
  {
    id: "avanzado",
    label: "Avanzado",
    short: "Técnica primero",
    work: 45,
    rest: 15,
  },
]

export const HIIT_FOCUSES: HiitFocusOption[] = [
  {
    id: "cuerpo-completo",
    label: "Cuerpo completo",
    description: "Empuje, piernas y core.",
  },
  {
    id: "piernas",
    label: "Piernas y glúteos",
    description: "Fuerza y potencia sin equipo.",
  },
  {
    id: "core",
    label: "Core",
    description: "Estabilidad y control.",
  },
  {
    id: "cardio",
    label: "Cardio",
    description: "Pulso arriba, impacto controlado.",
  },
]

export const DEFAULT_HIIT_CONFIG: HiitConfig = {
  level: "principiante",
  focus: "cuerpo-completo",
  duration: 15,
  lowImpact: false,
}

export const HIIT_WARMUP: HiitExercise[] = [
  {
    id: "warm-march",
    name: "Marcha en el sitio",
    cue: "Camina sin moverte del sitio; sube las rodillas y mueve los brazos.",
    lowImpactName: "Marcha en el sitio",
    lowImpactCue: "Camina sin moverte del sitio; sube las rodillas y mueve los brazos.",
  },
  {
    id: "warm-arms",
    name: "Círculos de brazos",
    cue: "Brazos estirados a los lados; dibuja círculos pequeños y ve agrandándolos.",
    lowImpactName: "Círculos de brazos",
    lowImpactCue: "Brazos estirados a los lados; dibuja círculos pequeños y ve agrandándolos.",
  },
  {
    id: "warm-squat",
    name: "Sentadilla al aire",
    cue: "Pies al ancho de hombros; baja la cadera como si te sentaras y sube empujando el suelo.",
    lowImpactName: "Sentadilla al aire",
    lowImpactCue: "Pies al ancho de hombros; baja la cadera como si te sentaras y sube empujando el suelo.",
  },
  {
    id: "warm-hips",
    name: "Movilidad de cadera",
    cue: "Manos en la cintura; dibuja círculos amplios con la cadera, sin forzar.",
    lowImpactName: "Movilidad de cadera",
    lowImpactCue: "Manos en la cintura; dibuja círculos amplios con la cadera, sin forzar.",
  },
]

export const HIIT_COOLDOWN: HiitExercise[] = [
  {
    id: "cool-march",
    name: "Marcha suave",
    cue: "Baja el ritmo y camina en el sitio mientras sueltas los hombros.",
    lowImpactName: "Marcha suave",
    lowImpactCue: "Baja el ritmo y camina en el sitio mientras sueltas los hombros.",
  },
  {
    id: "cool-breath",
    name: "Respiración nasal",
    cue: "Inhala por la nariz 4 s y exhala 6 s, sin retener el aire.",
    lowImpactName: "Respiración nasal",
    lowImpactCue: "Inhala por la nariz 4 s y exhala 6 s, sin retener el aire.",
  },
  {
    id: "cool-hamstring",
    name: "Estiramiento de isquiotibiales",
    cue: "Un pie al frente, pierna casi estirada; lleva la cadera atrás y mantén sin rebotar. Cambia de lado a mitad.",
    lowImpactName: "Estiramiento de isquiotibiales",
    lowImpactCue: "Un pie al frente, pierna casi estirada; lleva la cadera atrás y mantén sin rebotar. Cambia de lado a mitad.",
  },
  {
    id: "cool-quad",
    name: "Estiramiento de cuádriceps",
    cue: "De pie, lleva un talón al glúteo y mantén las rodillas juntas; cambia de lado a mitad.",
    lowImpactName: "Estiramiento de cuádriceps",
    lowImpactCue: "De pie, lleva un talón al glúteo y mantén las rodillas juntas; cambia de lado a mitad.",
  },
]

export const HIIT_EXERCISES: Record<HiitFocus, HiitExercise[]> = {
  "cuerpo-completo": [
    {
      id: "full-squat",
      name: "Sentadilla al aire",
      cue: "Pies al ancho de hombros, pecho arriba; baja hasta donde controles y sube empujando el suelo.",
      lowImpactName: "Sentadilla a silla",
      lowImpactCue: "Toca el asiento con la cadera y vuelve a subir; usa una silla estable si lo necesitas.",
    },
    {
      id: "full-pushup",
      name: "Flexiones",
      cue: "Manos bajo los hombros y cuerpo en línea; baja el pecho sin hundir la cadera.",
      lowImpactName: "Flexión en pared o con rodillas",
      lowImpactCue: "Apoya las manos en la pared o las rodillas en el suelo; baja y sube con control.",
    },
    {
      id: "full-lunge",
      name: "Zancada alterna",
      cue: "Da un paso atrás, baja la rodilla trasera y empuja con la pierna delantera; alterna.",
      lowImpactName: "Zancada estática con apoyo",
      lowImpactCue: "Apoya una mano en una silla y baja y sube sin mover los pies; cambia de lado a mitad.",
    },
    {
      id: "full-knees",
      name: "Rodillas al pecho",
      cue: "Corre en el sitio y sube las rodillas hacia la cadera; aterriza suave.",
      lowImpactName: "Marcha rápida con rodillas altas",
      lowImpactCue: "Camina en el sitio subiendo bien las rodillas, sin saltar.",
    },
    {
      id: "full-plank",
      name: "Plancha con toque de hombro",
      cue: "Plancha alta, pies más abiertos; toca un hombro y alterna sin mover la cadera.",
      lowImpactName: "Plancha con rodillas y toque de hombro",
      lowImpactCue: "Apoya las rodillas y toca un hombro con la mano contraria, sin girar la cadera.",
    },
  ],
  piernas: [
    {
      id: "legs-jump-squat",
      name: "Sentadilla con salto",
      cue: "Baja en sentadilla y salta; aterriza con las rodillas suaves y el pecho arriba.",
      lowImpactName: "Sentadilla al aire",
      lowImpactCue: "Sin salto: baja y sube a un ritmo que te permita mantener la técnica.",
    },
    {
      id: "legs-reverse-lunge",
      name: "Zancada inversa",
      cue: "Paso largo atrás, baja la rodilla y vuelve; mantén el torso erguido y alterna.",
      lowImpactName: "Zancada inversa con apoyo",
      lowImpactCue: "Haz el mismo movimiento con una mano en una silla para equilibrarte.",
    },
    {
      id: "legs-bridge",
      name: "Puente de glúteos",
      cue: "Acostado, pies apoyados; sube la cadera apretando glúteos sin arquear la espalda.",
      lowImpactName: "Puente de glúteos",
      lowImpactCue: "Acostado, pies apoyados; sube la cadera apretando glúteos sin arquear la espalda.",
    },
    {
      id: "legs-skater",
      name: "Skater",
      cue: "Salta de lado a lado y aterriza suave; lleva los brazos en sentido contrario.",
      lowImpactName: "Paso lateral sin salto",
      lowImpactCue: "Da un paso lateral amplio, toca el suelo con un pie y vuelve; sin saltar.",
    },
    {
      id: "legs-calves",
      name: "Elevación de talones",
      cue: "De pie, sube los talones, pausa arriba y baja controlado; usa una pared si lo necesitas.",
      lowImpactName: "Elevación de talones",
      lowImpactCue: "De pie, sube los talones, pausa arriba y baja controlado; usa una pared si lo necesitas.",
    },
  ],
  core: [
    {
      id: "core-plank",
      name: "Plancha frontal",
      cue: "Antebrazos bajo los hombros, cuerpo recto; aprieta abdomen y glúteos.",
      lowImpactName: "Plancha con rodillas",
      lowImpactCue: "Apoya las rodillas y mantén la línea del torso sin hundir la cadera.",
    },
    {
      id: "core-dead-bug",
      name: "Dead bug",
      cue: "Boca arriba, brazos y rodillas arriba; baja brazo y pierna contrarios sin arquear la espalda.",
      lowImpactName: "Dead bug",
      lowImpactCue: "Boca arriba, brazos y rodillas arriba; baja brazo y pierna contrarios sin arquear la espalda.",
    },
    {
      id: "core-climbers",
      name: "Mountain climbers",
      cue: "Plancha alta; lleva una rodilla al pecho y alterna a ritmo controlado.",
      lowImpactName: "Rodillas al pecho en cuadrupedia",
      lowImpactCue: "En cuadrupedia, lleva una rodilla al pecho y alterna lento, sin saltos.",
    },
    {
      id: "core-bicycle",
      name: "Bicicleta",
      cue: "Boca arriba, manos en las sienes; gira el torso y lleva el codo a la rodilla contraria.",
      lowImpactName: "Crunch suave",
      lowImpactCue: "Boca arriba, pies apoyados; sube solo los omóplatos y baja controlado.",
    },
    {
      id: "core-side-plank",
      name: "Plancha lateral",
      cue: "De lado, codo bajo el hombro; sube la cadera y mantén el cuerpo en línea.",
      lowImpactName: "Plancha lateral con rodilla apoyada",
      lowImpactCue: "De lado, apoya la rodilla de abajo y mantén la cadera elevada sin forzar.",
    },
  ],
  cardio: [
    {
      id: "cardio-jacks",
      name: "Jumping jacks",
      cue: "Salta abriendo piernas y brazos; aterriza suave y mantén un ritmo constante.",
      lowImpactName: "Step jacks",
      lowImpactCue: "Abre un pie a la vez y sube los brazos sin saltar.",
    },
    {
      id: "cardio-high-knees",
      name: "Rodillas altas",
      cue: "Corre en el sitio con rodillas a la cadera y brazos activos.",
      lowImpactName: "Marcha rápida con rodillas altas",
      lowImpactCue: "Camina en el sitio subiendo las rodillas, sin impacto.",
    },
    {
      id: "cardio-skater",
      name: "Skater",
      cue: "Salto lateral de un pie a otro, aterrizaje suave y brazos cruzados.",
      lowImpactName: "Paso lateral sin salto",
      lowImpactCue: "Da un paso lateral amplio y vuelve; mantén las rodillas suaves.",
    },
    {
      id: "cardio-burpee",
      name: "Burpee sin flexión",
      cue: "Sentadilla, manos al suelo, paso atrás, vuelve y sube con brazos arriba.",
      lowImpactName: "Sentadilla con brazos arriba",
      lowImpactCue: "Haz una sentadilla y sube con los brazos arriba; si necesitas apoyo, toca una silla al frente.",
    },
    {
      id: "cardio-heels",
      name: "Talones al glúteo",
      cue: "Corre en el sitio llevando los talones hacia los glúteos.",
      lowImpactName: "Marcha con talones",
      lowImpactCue: "Camina en el sitio tocando el suelo con todo el pie, sin correr.",
    },
  ],
}

export function isHiitLevel(value: unknown): value is HiitLevel {
  return typeof value === "string" && HIIT_LEVELS.some((level) => level.id === value)
}

export function isHiitFocus(value: unknown): value is HiitFocus {
  return typeof value === "string" && HIIT_FOCUSES.some((focus) => focus.id === value)
}

export function isHiitDuration(value: unknown): value is HiitDuration {
  return typeof value === "number" && HIIT_DURATIONS.includes(value as HiitDuration)
}

export function getHiitLevel(id: HiitLevel): HiitLevelOption {
  return HIIT_LEVELS.find((level) => level.id === id) ?? HIIT_LEVELS[0]
}

export function getHiitFocus(id: HiitFocus): HiitFocusOption {
  return HIIT_FOCUSES.find((focus) => focus.id === id) ?? HIIT_FOCUSES[0]
}

export function getHiitRounds(duration: HiitDuration): number {
  return (duration - 5) / 5
}

export function normalizeHiitConfig(value: unknown): HiitConfig | null {
  if (!value || typeof value !== "object") return null
  const candidate = value as Record<string, unknown>
  return {
    level: isHiitLevel(candidate.level) ? candidate.level : DEFAULT_HIIT_CONFIG.level,
    focus: isHiitFocus(candidate.focus) ? candidate.focus : DEFAULT_HIIT_CONFIG.focus,
    duration: isHiitDuration(candidate.duration) ? candidate.duration : DEFAULT_HIIT_CONFIG.duration,
    lowImpact: typeof candidate.lowImpact === "boolean" ? candidate.lowImpact : DEFAULT_HIIT_CONFIG.lowImpact,
  }
}

export function resolveHiitExercise(exercise: HiitExercise, lowImpact: boolean): HiitExercise {
  if (!lowImpact) return exercise
  return {
    ...exercise,
    name: exercise.lowImpactName,
    cue: exercise.lowImpactCue,
  }
}

export function generateHiitSegments(config: HiitConfig): HiitSegment[] {
  const level = getHiitLevel(config.level)
  const rounds = getHiitRounds(config.duration)
  const exercises = HIIT_EXERCISES[config.focus].map((exercise) => resolveHiitExercise(exercise, config.lowImpact))
  const segments: HiitSegment[] = []

  for (const exercise of HIIT_WARMUP) {
    segments.push({ type: "warmup", seconds: WARMUP_SECONDS, exercise })
  }

  for (let round = 1; round <= rounds; round += 1) {
    exercises.forEach((exercise, index) => {
      segments.push({ type: "work", seconds: level.work, exercise, round })
      const nextExercise =
        index < exercises.length - 1 ? exercises[index + 1] : round < rounds ? exercises[0] : undefined
      segments.push({ type: "rest", seconds: level.rest, round, nextExercise })
    })
  }

  for (const exercise of HIIT_COOLDOWN) {
    segments.push({ type: "cooldown", seconds: COOLDOWN_SECONDS, exercise })
  }

  return segments
}

export function getHiitTotalSeconds(segments: HiitSegment[]): number {
  return segments.reduce((total, segment) => total + segment.seconds, 0)
}

export function getHiitSegmentStarts(segments: HiitSegment[]): number[] {
  let elapsed = 0
  return segments.map((segment) => {
    const start = elapsed
    elapsed += segment.seconds
    return start
  })
}

export function locateHiitSegment(elapsed: number, segments: HiitSegment[], starts: number[]) {
  if (segments.length === 0) return { index: 0, remaining: 0 }
  const lastStart = starts[starts.length - 1] ?? 0
  const lastSegment = segments[segments.length - 1]
  const safeElapsed = Math.max(0, Math.min(elapsed, lastStart + lastSegment.seconds - 0.001))
  let index = 0
  for (let i = 0; i < segments.length; i += 1) {
    if (safeElapsed < starts[i] + segments[i].seconds) {
      index = i
      break
    }
    index = i
  }
  const remaining = Math.max(0, Math.ceil(segments[index].seconds - (safeElapsed - starts[index])))
  return { index, remaining }
}

export function hiitPhaseLabel(segment: HiitSegment): string {
  switch (segment.type) {
    case "warmup":
      return "Calentamiento"
    case "work":
      return "Trabajo"
    case "rest":
      return "Descanso"
    case "cooldown":
      return "Vuelta a la calma"
  }
}

export function formatHiitClock(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safe / 60)
  const remainder = safe % 60
  return `${minutes}:${String(remainder).padStart(2, "0")}`
}

export function formatHiitDuration(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safe / 60)
  const remainder = safe % 60
  if (minutes === 0) return `${remainder} s`
  if (remainder === 0) return `${minutes} min`
  return `${minutes} min ${remainder} s`
}
