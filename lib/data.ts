import type { SectionData } from "@/types"

export const sectionsData: Record<string, SectionData> = {
  mente: {
    id: "mente",
    title: "Cultiva tu",
    highlightText: "mente",
    subtitle:
      "Diario guiado y técnicas de reflexión para desarrollar claridad, resiliencia emocional y equilibrio. Gratuitas, sin registro y en tu navegador.",
    text: "Cultiva claridad y resiliencia. Descubre herramientas para tu bienestar emocional y cognitivo.",
    intro:
      "La sección de Mente reúne herramientas gratuitas para tu bienestar emocional y cognitivo. La primera disponible es el diario guiado, que te ayuda a ordenar tus pensamientos en 3 pasos: qué sentiste, qué aprendiste y una gratitud. Todas funcionan en tu navegador, sin cuenta ni datos personales.",
    faq: [
      {
        question: "¿Qué herramientas hay en la sección de Mente?",
        answer:
          "El diario guiado de emociones está disponible hoy. Próximamente llegarán meditación mindfulness, visualización positiva, seguimiento de hábitos, ejercicios de gratitud, técnicas de respiración, mapas mentales y afirmaciones diarias.",
      },
      {
        question: "¿Necesito crear una cuenta para usar las herramientas de Mente?",
        answer:
          "No. Todas las herramientas funcionan directamente en tu navegador y tus entradas o datos se guardan solo en tu dispositivo (almacenamiento local). No hay registro ni servidores.",
      },
      {
        question: "¿Son gratuitas las herramientas de bienestar mental?",
        answer:
          "Sí, todas las herramientas de HOLENTIA son gratuitas y sin publicidad. Puedes usar el diario guiado cuantas veces quieras.",
      },
    ],
    cards: [
      {
        id: "diario-guiado",
        title: "Diario Guiado",
        description: "Reflexiona sobre tu día y emociones.",
        slug: "diario-guiado",
        isAvailable: true,
        category: "mente",
        metaTitle: "Diario guiado de emociones",
        metaDescription:
          "Escribe una entrada guiada en 3 pasos: qué sentiste, qué aprendiste y tu gratitud del día. Reflexión personal que queda en tu navegador. Gratis.",
      },
      {
        id: "meditacion-mindfulness",
        title: "Meditación Mindfulness",
        description: "Calma tu mente y reduce el estrés.",
        slug: "meditacion-mindfulness",
        isAvailable: false,
        category: "mente",
      },
      {
        id: "visualizacion-positiva",
        title: "Visualización Positiva",
        description: "Manifiesta tus metas y enfoque.",
        slug: "visualizacion-positiva",
        isAvailable: false,
        category: "mente",
      },
      {
        id: "seguimiento-habitos",
        title: "Seguimiento de Hábitos",
        description: "Construye rutinas mentales positivas.",
        slug: "seguimiento-habitos",
        isAvailable: false,
        category: "mente",
      },
      {
        id: "ejercicios-gratitud",
        title: "Ejercicios de Gratitud",
        description: "Fomenta una perspectiva optimista.",
        slug: "ejercicios-gratitud",
        isAvailable: false,
        category: "mente",
      },
      {
        id: "tecnicas-respiracion",
        title: "Técnicas de Respiración",
        description: "Controla la ansiedad al instante.",
        slug: "tecnicas-respiracion",
        isAvailable: false,
        category: "mente",
      },
      {
        id: "mapas-mentales",
        title: "Mapas Mentales",
        description: "Organiza ideas y potencia la creatividad.",
        slug: "mapas-mentales",
        isAvailable: false,
        category: "mente",
      },
      {
        id: "afirmaciones-diarias",
        title: "Afirmaciones Diarias",
        description: "Refuerza tu autoestima y confianza.",
        slug: "afirmaciones-diarias",
        isAvailable: false,
        category: "mente",
      },
    ],
  },
  relaciones: {
    id: "relaciones",
    title: "Fortalece tus",
    highlightText: "relaciones",
    subtitle:
      "Test del lenguaje del amor y guías para comunicarte mejor, resolver conflictos y construir vínculos más profundos. Gratis y sin cuenta.",
    text: "Fortalece tus relaciones. Herramientas para mejorar la comunicación, resolver conflictos y construir vínculos significativos.",
    intro:
      "La sección de Relaciones te ayuda a mejorar tus vínculos con personas pareja, familia o amistades. El test de los 5 lenguajes del amor te muestra cómo das y recibes afecto; las guías próximas cubren comunicación asertiva, resolución de conflictos y empatía. Todo es privado y funciona en tu navegador.",
    faq: [
      {
        question: "¿Qué es el test de los 5 lenguajes del amor?",
        answer:
          "Es un cuestionario rápido que identifica cuál de los cinco lenguajes (palabras de afirmación, tiempo de calidad, regalos, actos de servicio y contacto físico) prefieres para expresar y recibir amor. Ayuda a parejas y amistades a entenderse mejor.",
      },
      {
        question: "¿El test es confidencial?",
        answer:
          "Sí. Se responde y se calcula en tu dispositivo; no hay cuenta, ni servidor, ni envío de datos. Solo tú ves tu resultado.",
      },
      {
        question: "¿Qué otras herramientas habrá en Relaciones?",
        answer:
          "Próximamente: guía de comunicación asertiva, resolución de conflictos, diario para parejas, test de apego, límites saludables, preguntas profundas y ejercicios de empatía.",
      },
    ],
    cards: [
      {
        id: "test-lenguajes-amor",
        title: "Test de lenguajes del amor",
        description: "Descubre cómo das y recibes amor.",
        slug: "test-lenguajes-amor",
        isAvailable: true,
        category: "relaciones",
        metaTitle: "Test de los 5 lenguajes del amor",
        metaDescription:
          "Descubre cómo das y recibes amor con el test de los 5 lenguajes. Preguntas rápidas para parejas y reflexión personal. Gratis y sin registro.",
      },
      {
        id: "comunicacion-asertiva",
        title: "Guía de comunicación asertiva",
        description: "Aprende a expresarte con claridad.",
        slug: "comunicacion-asertiva",
        isAvailable: false,
        category: "relaciones",
      },
      {
        id: "resolucion-conflictos",
        title: "Resolución de conflictos",
        description: "Técnicas para resolver desacuerdos.",
        slug: "resolucion-conflictos",
        isAvailable: false,
        category: "relaciones",
      },
      {
        id: "diario-parejas",
        title: "Diario para parejas",
        description: "Fortalece tu conexión diaria.",
        slug: "diario-parejas",
        isAvailable: false,
        category: "relaciones",
      },
      {
        id: "test-apego",
        title: "Test de estilo de apego",
        description: "Entiende tus patrones relacionales.",
        slug: "test-apego",
        isAvailable: false,
        category: "relaciones",
      },
      {
        id: "limites-saludables",
        title: "Establecer límites saludables",
        description: "Aprende a cuidar tu espacio personal.",
        slug: "limites-saludables",
        isAvailable: false,
        category: "relaciones",
      },
      {
        id: "preguntas-profundas",
        title: "Preguntas profundas",
        description: "Generador de conversaciones significativas.",
        slug: "preguntas-profundas",
        isAvailable: false,
        category: "relaciones",
      },
      {
        id: "ejercicios-empatia",
        title: "Ejercicios de empatía",
        description: "Desarrolla tu inteligencia emocional.",
        slug: "ejercicios-empatia",
        isAvailable: false,
        category: "relaciones",
      },
    ],
  },
  cuerpo: {
    id: "cuerpo",
    title: "Energiza tu",
    highlightText: "cuerpo",
    subtitle:
      "Calculadoras de calorías e hidratación y rutinas para un estilo de vida activo y saludable. Gratuitas, en tu navegador y sin registro.",
    text: "Energiza tu cuerpo. Accede a rutinas, nutrición y consejos para un estilo de vida activo y un bienestar integral.",
    intro:
      "La sección de Cuerpo reúne calculadoras de salud física basadas en fórmulas reconocidas: calorías diarias con el método de Mifflin-St Jeor e hidratación con la fórmula de Watson ajustada a tu peso, actividad y clima. Rutinas de ejercicio y nutrición llegarán próximamente.",
    faq: [
      {
        question: "¿Cómo calcula la calculadora de calorías mis necesidades?",
        answer:
          "Usa la fórmula de Mifflin-St Jeor para estimar tu gasto basal (TMB) según sexo, edad, peso y altura, y lo multiplica por tu nivel de actividad. Luego muestra el mantenimiento y ajustes de déficit o superávit según tu objetivo.",
      },
      {
        question: "¿Qué fórmula usa la calculadora de hidratación?",
        answer:
          "La fórmula de Watson: estima tu requerimiento diario de agua por peso y lo ajusta según nivel de actividad física y clima caliente, devolviendo el total en litros y vasos.",
      },
      {
        question: "¿Los resultados reemplazan a un nutricionista?",
        answer:
          "No. Son estimaciones educativas para orientarte. Para decisiones de salud, consulta a un profesional.",
      },
    ],
    cards: [
      {
        id: "calculadora-calorias",
        title: "Calculadora de Calorías",
        description: "Descubre tus calorías diarias.",
        slug: "calculadora-calorias",
        isAvailable: true,
        category: "cuerpo",
        metaTitle: "Calculadora de calorías diarias",
        metaDescription:
          "Calcula tu gasto basal (TMB), calorías diarias y déficit o superávit según tu objetivo. Fórmula de Mifflin-St Jeor, en español y sin registro.",
      },
      {
        id: "calculadora-hidratacion",
        title: "Calculadora Hidratación",
        description: "Asegura tu ingesta de agua.",
        slug: "calculadora-hidratacion",
        isAvailable: true,
        category: "cuerpo",
        metaTitle: "Calculadora de hidratación diaria",
        metaDescription:
          "Calcula cuánta agua necesitas al día según tu peso, nivel de actividad y clima (fórmula de Watson ajustada). Resultado inmediato en tu navegador.",
      },
      {
        id: "rutinas-hiit",
        title: "Rutinas HIIT",
        description: "Entrenamientos cortos y efectivos.",
        slug: "rutinas-hiit",
        isAvailable: false,
        category: "cuerpo",
      },
      {
        id: "planificador-comidas",
        title: "Planificador de Comidas",
        description: "Organiza tu nutrición semanal.",
        slug: "planificador-comidas",
        isAvailable: false,
        category: "cuerpo",
      },
      {
        id: "yoga-principiantes",
        title: "Yoga para Principiantes",
        description: "Mejora flexibilidad y relajación.",
        slug: "yoga-principiantes",
        isAvailable: false,
        category: "cuerpo",
      },
      {
        id: "monitor-pasos",
        title: "Monitor de Pasos",
        description: "Registra tu actividad diaria.",
        slug: "monitor-pasos",
        isAvailable: false,
        category: "cuerpo",
      },
      {
        id: "recetario-saludable",
        title: "Recetario Saludable",
        description: "Ideas nutritivas y fáciles.",
        slug: "recetario-saludable",
        isAvailable: false,
        category: "cuerpo",
      },
      {
        id: "retos-fitness",
        title: "Retos Fitness",
        description: "Motívate con desafíos semanales.",
        slug: "retos-fitness",
        isAvailable: false,
        category: "cuerpo",
      },
      {
        id: "guia-estiramientos",
        title: "Guía de Estiramientos",
        description: "Previene lesiones y mejora movilidad.",
        slug: "guia-estiramientos",
        isAvailable: false,
        category: "cuerpo",
      },
    ],
  },
  finanzas: {
    id: "finanzas",
    title: "Domina tus",
    highlightText: "finanzas",
    subtitle:
      "Presupuesto, interés compuesto, préstamos, tarjetas y consumo eléctrico. Calculadoras gratuitas para administrar tu dinero sin registro.",
    text: "Domina tus finanzas. Herramientas para presupuestar, invertir y alcanzar tus metas económicas.",
    intro:
      "La sección de Finanzas concentra las calculadoras más usadas del sitio: presupuesto personal con regla 50/30/20, interés compuesto con aportaciones e inflación, cuotas de préstamo con tabla de amortización, corte y vencimiento de tarjeta, gasto de combustible, factura eléctrica, perfil de riesgo y un glosario con más de 100 términos explicados con ejemplos. Todos los cálculos ocurren en tu navegador.",
    faq: [
      {
        question: "¿Qué calculadora financiera elijo?",
        answer:
          "Si organizas ingresos y gastos, usa el presupuesto personal. Para simular el crecimiento de ahorros, la de interés compuesto. Para un crédito o tarjeta, la calculadora de préstamo o la de interés de tarjeta. El glosario resuelve dudas de términos.",
      },
      {
        question: "¿Los resultados son asesoría financiera?",
        answer:
          "No, son estimaciones educativas para que decidas con más información. Para decisiones importantes, consulta a un asesor financiero certificado.",
      },
      {
        question: "¿Mis datos financieros salen de mi dispositivo?",
        answer:
          "No. No hay backend ni analytics: los montos se procesan y guardan en el almacenamiento local de tu navegador, y puedes borrarlos con «Borrar mis datos».",
      },
    ],
    cards: [
      {
        id: "crear-presupuesto-personal",
        title: "Crear presupuesto personal",
        description: "Gestiona ingresos y gastos fácilmente.",
        slug: "crear-presupuesto-personal",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Presupuesto personal: ingresos y gastos",
        metaDescription:
          "Organiza tus ingresos y gastos, aplica la regla 50/30/20 y detecta gastos hormiga con proyecciones de ahorro a 6 y 12 meses. Gratis, sin registro.",
      },
      {
        id: "calculadora-interes-compuesto",
        title: "Calculadora interés compuesto",
        description: "Visualiza el crecimiento de ahorros.",
        slug: "calculadora-interes-compuesto",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de interés compuesto",
        metaDescription:
          "Simula el crecimiento de tus ahorros con aportaciones e inflación: gráfico, tabla de amortización y comparativa de escenarios. Sin registro.",
      },
      {
        id: "planificador-ahorros",
        title: "Planificador de ahorros",
        description: "Define objetivos y cómo alcanzarlos.",
        slug: "planificador-ahorros",
        isAvailable: false,
        category: "finanzas",
      },
      {
        id: "calculadora-prestamo",
        title: "Calculadora de préstamo",
        description: "Cuota, interés total y tabla de amortización.",
        slug: "calculadora-prestamo",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de préstamo personal",
        metaDescription:
          "Calcula la cuota mensual de tu préstamo, el interés total y el costo real con tabla de amortización y simulaciones guardadas localmente.",
      },
      {
        id: "calculadora-consumo-electrico",
        title: "Calculadora consumo eléctrico",
        description: "Estima tu factura por kWh y ahorra.",
        slug: "calculadora-consumo-electrico",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de consumo eléctrico",
        metaDescription:
          "Estima tu factura mensual de luz en pesos por consumo en kWh (tarifa residencial). Compara escenarios y descubre cómo bajar tu consumo.",
      },
      {
        id: "calculadora-gasto-combustible",
        title: "Calculadora gasto combustible",
        description: "Estima tu gasto de gasolina por día, mes y año.",
        slug: "calculadora-gasto-combustible",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de gasto de combustible",
        metaDescription:
          "Calcula cuánto gastas en gasolina por día, mes y año según precio por galón, consumo y distancia. Incluye tips de ahorro. Gratis y privada.",
      },
      {
        id: "tarjeta-corte-vencimiento",
        title: "Corte y vencimiento tarjeta",
        description: "Planea tus compras y pagos.",
        slug: "tarjeta-corte-vencimiento",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Corte y vencimiento de tarjeta",
        metaDescription:
          "Calcula tu día de corte, vencimiento y los días de cortesía entre compras para planear pagos y evitar intereses de la tarjeta de crédito.",
      },
      {
        id: "calculadora-interes-tarjeta",
        title: "Calculadora interés tarjeta",
        description: "Descubre cuánto te cuesta financiar.",
        slug: "calculadora-interes-tarjeta",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de interés de tarjeta",
        metaDescription:
          "Descubre el costo mensual de financiar el saldo de tu tarjeta: interés, pago mínimo y cuánto pagarás si solo abonas el mínimo. En pesos.",
      },
      {
        id: "test-perfil-riesgo",
        title: "Test de perfil de riesgo",
        description: "Descubre tu nivel para invertir.",
        slug: "test-perfil-riesgo",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Test de perfil de riesgo para invertir",
        metaDescription:
          "Responde preguntas y descubre tu perfil de riesgo (conservador, neutral o agresivo) con orientación de portafolio. Test gratuito y privado.",
      },
      {
        id: "comparador-prestamos",
        title: "Comparador Préstamos",
        description: "Analiza opciones de financiación.",
        slug: "comparador-prestamos",
        isAvailable: false,
        category: "finanzas",
      },
      {
        id: "glosario-financiero",
        title: "Glosario Financiero",
        description: "Términos de ahorro, crédito, intereses e inversiones explicados con ejemplos.",
        slug: "glosario-financiero",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Glosario financiero: ahorro, crédito e inversión",
        metaDescription:
          "Más de 100 términos de finanzas personales explicados con lenguaje claro y ejemplos: ahorro, crédito, intereses e inversiones. Gratis y en español.",
      },
      {
        id: "tracker-gastos-hormiga",
        title: "Tracker Gastos Hormiga",
        description: "Identifica pequeños gastos.",
        slug: "tracker-gastos-hormiga",
        isAvailable: false,
        category: "finanzas",
      },
    ],
  },
}
