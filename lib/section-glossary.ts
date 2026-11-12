import type { SectionType } from "@/types"

export const GLOSSARY_SECTIONS = ["cuerpo", "mente", "relaciones"] as const

export type GlossarySection = (typeof GLOSSARY_SECTIONS)[number]

export interface SectionGlossaryTerm {
  term: string
  /** Ancla estable para enlazar un concepto concreto desde una herramienta o guía. */
  slug: string
  definition: string
  example: string
  related?: readonly {
    slug: string
    label: string
  }[]
}

export interface SectionGlossaryContent {
  title: string
  intro: string
  disclaimer: string
  terms: readonly SectionGlossaryTerm[]
  sources: readonly {
    label: string
    href: string
  }[]
}

/**
 * Conceptos clave de los hubs que todavía no tienen glosario completo.
 *
 * La regla editorial es la misma que en finanzas: definición breve, un ejemplo
 * concreto y un siguiente paso real. Cuando una sección llegue a 15–20 términos,
 * este contenido puede pasar a `/glosario/[seccion]` sin reescribir el modelo.
 */
export const SECTION_GLOSSARY: Record<GlossarySection, SectionGlossaryContent> = {
  cuerpo: {
    title: "Conceptos clave de cuerpo",
    intro:
      "Siete términos que aparecen en las calculadoras de esta sección. Sirven para entender qué estás midiendo y cómo leer el resultado sin sacar conclusiones de más.",
    disclaimer:
      "Contenido educativo. No sustituye una evaluación médica, nutricional ni un plan de entrenamiento personalizado.",
    terms: [
      {
        term: "IMC (Índice de Masa Corporal)",
        slug: "imc",
        definition:
          "Relaciona tu peso con tu estatura para dar una referencia rápida del estado nutricional. No distingue grasa de músculo ni mide dónde está la grasa.",
        example:
          "Una persona de 70 kg y 1.75 m tiene un IMC de 22.9, dentro del rango de peso saludable.",
        related: [
          { slug: "calculadora-imc", label: "Calcular mi IMC" },
          { slug: "calculadora-grasa-corporal", label: "Medir grasa corporal" },
        ],
      },
      {
        term: "Grasa corporal",
        slug: "grasa-corporal",
        definition:
          "Es el porcentaje de tu peso que corresponde a grasa. Sirve para ver composición corporal, no solo el número de la balanza.",
        example:
          "Dos personas pueden pesar 70 kg: una con 15% de grasa y otra con 30%. El peso es el mismo, la composición no.",
        related: [{ slug: "calculadora-grasa-corporal", label: "Calcular mi grasa corporal" }],
      },
      {
        term: "Metabolismo basal",
        slug: "metabolismo-basal",
        definition:
          "Es la energía que tu cuerpo gasta en reposo para mantener funciones vitales como respirar o regular la temperatura.",
        example:
          "Si tu metabolismo basal es 1,500 kcal, eso gastas incluso en un día sin actividad; el movimiento y el ejercicio suman por encima.",
        related: [{ slug: "calculadora-calorias", label: "Calcular mis calorías" }],
      },
      {
        term: "Gasto energético total",
        slug: "gasto-energetico-total",
        definition:
          "Es la suma de tu metabolismo basal, la actividad diaria y el ejercicio. Es la referencia para saber cuántas calorías gastas.",
        example:
          "Un metabolismo basal de 1,500 kcal más 500 kcal de actividad dan un gasto total de 2,000 kcal.",
        related: [{ slug: "calculadora-calorias", label: "Ver mi gasto diario" }],
      },
      {
        term: "Déficit calórico",
        slug: "deficit-calorico",
        definition:
          "Es comer menos calorías de las que gastas. El cuerpo usa reservas para cubrir la diferencia; por eso se pierde peso.",
        example: "Si gastas 2,000 kcal y comes 1,700, el déficit es de 300 kcal al día.",
        related: [{ slug: "calculadora-calorias", label: "Calcular mi déficit" }],
      },
      {
        term: "Proteína diaria",
        slug: "proteina-diaria",
        definition:
          "Es la cantidad de proteína que necesitas al día para mantener músculo, saciedad y funciones básicas. Depende de tu peso y actividad.",
        example: "Una persona de 70 kg con 1.2 g/kg necesita 84 g de proteína al día.",
        related: [{ slug: "calculadora-proteina-diaria", label: "Calcular mi proteína" }],
      },
      {
        term: "Hidratación",
        slug: "hidratacion",
        definition:
          "Es el agua que repones para compensar lo que pierdes al respirar, sudar y orinar. No es solo beber agua: también cuenta lo que comes.",
        example:
          "Si pesas 70 kg y la referencia es 35 ml/kg, rondas 2.45 litros al día, ajustando por calor y ejercicio.",
        related: [{ slug: "calculadora-hidratacion", label: "Calcular mi hidratación" }],
      },
    ],
    sources: [
      { label: "OMS: alimentación saludable", href: "https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet" },
      { label: "OMS: obesidad y sobrepeso", href: "https://www.who.int/es/news-room/fact-sheets/detail/obesity-and-overweight" },
      { label: "CDC: IMC en adultos", href: "https://www.cdc.gov/bmi/adult-calculator/index.html" },
    ],
  },
  mente: {
    title: "Conceptos clave de mente",
    intro:
      "Términos que aparecen en los ejercicios y tests de esta sección. No son etiquetas para diagnosticarte: son herramientas para ponerle nombre a lo que sientes y decidir el siguiente paso.",
    disclaimer:
      "Contenido educativo. No sustituye una consulta psicológica o médica. Si estás en crisis o tienes pensamientos de hacerte daño, busca ayuda profesional o a una persona de confianza ahora.",
    terms: [
      {
        term: "Ansiedad",
        slug: "ansiedad",
        definition:
          "Es una respuesta normal ante una amenaza o incertidumbre: el cuerpo se activa para responder. Se vuelve un problema cuando aparece con mucha intensidad, dura mucho o te limita.",
        example:
          "Sentir el corazón acelerado antes de una entrevista es ansiedad normal; evitar todas las entrevistas por miedo ya es una señal para buscar apoyo.",
        related: [
          { slug: "test-ansiedad", label: "Hacer el test de ansiedad" },
          { slug: "tecnicas-respiracion", label: "Probar respiración guiada" },
        ],
      },
      {
        term: "Estrés",
        slug: "estres",
        definition:
          "Es la tensión que aparece cuando las demandas superan los recursos que sientes que tienes. Puede ser puntual o mantenerse en el tiempo.",
        example:
          "Una semana con entregas y poco sueño puede aumentar el estrés; si se repite todos los meses, conviene revisar carga y descanso.",
        related: [
          { slug: "tecnicas-respiracion", label: "Bajar el ritmo" },
          { slug: "calculadora-sueno", label: "Revisar mi sueño" },
        ],
      },
      {
        term: "Respiración 4-7-8",
        slug: "respiracion-4-7-8",
        definition:
          "Es un ejercicio de respiración con cuatro tiempos: inhalar 4, sostener 7 y exhalar 8. Busca bajar el ritmo y darle al cuerpo una señal de calma.",
        example:
          "Antes de dormir, prueba cuatro ciclos: inhalar 4 segundos, sostener 7 y exhalar 8. Si te marea, vuelve a tu respiración normal.",
        related: [{ slug: "tecnicas-respiracion", label: "Ver las técnicas" }],
      },
      {
        term: "Atención plena (mindfulness)",
        slug: "atencion-plena",
        definition:
          "Es prestar atención al momento presente sin juzgarlo. No es dejar la mente en blanco: es notar lo que pasa y volver con calma.",
        example:
          "Mientras lavas los platos, nota el agua, el sonido y la temperatura. Cuando la mente se vaya a otra parte, vuelve al plato.",
        related: [
          { slug: "diario-guiado", label: "Escribir en el diario" },
          { slug: "tecnicas-respiracion", label: "Practicar respiración" },
        ],
      },
      {
        term: "Rumiación",
        slug: "rumiacion",
        definition:
          "Es darle vueltas al mismo pensamiento una y otra vez, muchas veces sin llegar a una solución. Se siente como pensar mucho, pero te deja atrapado.",
        example:
          "Repasar durante horas una conversación incómoda sin decidir qué hacer es rumiación; escribir qué está en tu control puede cortar el círculo.",
        related: [{ slug: "diario-guiado", label: "Soltar el pensamiento" }],
      },
      {
        term: "Higiene del sueño",
        slug: "higiene-del-sueno",
        definition:
          "Son los hábitos que ayudan a dormir mejor: horarios estables, poca luz antes de acostarte y un ambiente fresco y oscuro.",
        example:
          "Acostarte y levantarte a la misma hora, incluso el fin de semana, suele ordenar el sueño más que intentar dormir más un solo día.",
        related: [
          { slug: "calculadora-sueno", label: "Calcular mi sueño" },
          { slug: "test-calidad-sueno", label: "Medir mi calidad de sueño" },
        ],
      },
      {
        term: "Hábito",
        slug: "habito",
        definition:
          "Es una conducta que se repite con poca fricción porque ya tiene un disparador y una recompensa. Se construye con repetición, no con fuerza de voluntad infinita.",
        example:
          "Dejar el diario junto a la cama y escribir tres líneas antes de dormir es más fácil de sostener que esperar a tener una hora libre.",
        related: [
          { slug: "seguimiento-habitos", label: "Seguir un hábito" },
          { slug: "diario-guiado", label: "Empezar con el diario" },
        ],
      },
    ],
    sources: [
      {
        label: "OMS: salud mental",
        href: "https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
      },
      {
        label: "NHS: trastorno de ansiedad generalizada",
        href: "https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder-gad/",
      },
      {
        label: "NHS: cómo dormir mejor",
        href: "https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/",
      },
    ],
  },
  relaciones: {
    title: "Conceptos clave de relaciones",
    intro:
      "Palabras que aparecen en los tests y diarios de esta sección. Sirven para conversar con más claridad, no para etiquetar a tu pareja ni justificar todo lo que pasa.",
    disclaimer:
      "Contenido educativo. No sustituye terapia de pareja, psicológica o médica. Si hay violencia, control o riesgo, busca ayuda profesional y protección.",
    terms: [
      {
        term: "Comunicación asertiva",
        slug: "comunicacion-asertiva",
        definition:
          "Es decir lo que necesitas con claridad y respeto, sin callarte ni atacar. Habla de hechos y de cómo te afectan, no de lo que la otra persona es.",
        example:
          "En vez de «nunca me escuchas», prueba «cuando hablo y miras el teléfono, siento que no te importa; ¿puedes dejarlo un momento?».",
        related: [
          { slug: "preguntas-profundas", label: "Abrir una conversación" },
          { slug: "diario-parejas", label: "Escribir en pareja" },
        ],
      },
      {
        term: "Límites",
        slug: "limites",
        definition:
          "Son las reglas que marcan hasta dónde estás dispuesto a llegar para cuidarte. No son castigos: son información sobre lo que necesitas.",
        example:
          "«Puedo hablar de esto, pero no quiero que me griten» es un límite; si se repite el grito, retirarte también es parte del límite.",
        related: [
          { slug: "test-apego", label: "Entender mi apego" },
          { slug: "diario-parejas", label: "Revisar el vínculo" },
        ],
      },
      {
        term: "Escucha activa",
        slug: "escucha-activa",
        definition:
          "Es escuchar para entender, no para preparar tu respuesta. Incluye mirar, preguntar y devolver lo que entendiste.",
        example:
          "Si tu pareja cuenta un día difícil, antes de dar consejos prueba: «Suena a que te sentiste solo. ¿Quieres que te escuche o que busquemos una solución?».",
        related: [{ slug: "preguntas-profundas", label: "Practicar con preguntas" }],
      },
      {
        term: "Apego",
        slug: "apego",
        definition:
          "Es la forma en que buscas seguridad y cercanía en tus vínculos. Puede ser seguro, ansioso o evitativo, y no es una condena: se puede trabajar.",
        example:
          "Si te angustia que no respondan un mensaje, puede haber un patrón de apego ansioso; notarlo te ayuda a pedir claridad en vez de suponer.",
        related: [{ slug: "test-apego", label: "Hacer el test de apego" }],
      },
      {
        term: "Lenguajes del amor",
        slug: "lenguajes-del-amor",
        definition:
          "Son formas distintas de expresar y recibir afecto: palabras, tiempo, detalles, actos de servicio y contacto físico. No todos valoran lo mismo.",
        example:
          "Tú puedes sentirte querido con tiempo de calidad, mientras tu pareja demuestra cariño con detalles. Si no lo hablan, ambos pueden sentir que el otro no se esfuerza.",
        related: [{ slug: "test-lenguajes-amor", label: "Descubrir mi lenguaje" }],
      },
      {
        term: "Conflicto",
        slug: "conflicto",
        definition:
          "Es una diferencia de necesidades, ideas o expectativas. No es sinónimo de pelea: puede resolverse mejor si se habla del problema y no de la persona.",
        example:
          "Discutir por quién lava los platos puede ser un conflicto de carga mental; separar tareas y acordar horarios ataca el problema, no al otro.",
        related: [{ slug: "diario-parejas", label: "Ordenar el conflicto" }],
      },
      {
        term: "Reciprocidad",
        slug: "reciprocidad",
        definition:
          "Es el equilibrio de dar y recibir en una relación. No tiene que ser exacto en cada momento, pero sí sentirse justo con el tiempo.",
        example:
          "Si una persona siempre organiza los planes y la otra solo aparece, la reciprocidad se resiente; hablarlo abre la puerta a repartir mejor.",
        related: [
          { slug: "diario-parejas", label: "Revisar el equilibrio" },
          { slug: "preguntas-profundas", label: "Conversar expectativas" },
        ],
      },
    ],
    sources: [
      { label: "APA: relaciones", href: "https://www.apa.org/topics/relationships" },
      { label: "APA: apego", href: "https://dictionary.apa.org/attachment" },
    ],
  },
}

export function isGlossarySection(section: string): section is GlossarySection {
  return (GLOSSARY_SECTIONS as readonly string[]).includes(section)
}

/** Devuelve el bloque de conceptos clave de un hub, o undefined si aún no tiene. */
export function getSectionGlossary(
  section: string,
): { section: GlossarySection; content: SectionGlossaryContent } | undefined {
  if (!isGlossarySection(section)) return undefined
  return { section, content: SECTION_GLOSSARY[section] }
}

/** Type guard útil para props de componentes que solo aceptan hubs con glosario. */
export type SectionWithGlossary = Extract<SectionType, GlossarySection>
