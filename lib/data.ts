import type { SectionData } from "@/types"

export const sectionsData: Record<string, SectionData> = {
  mente: {
    id: "mente",
    title: "Cultiva tu",
    highlightText: "mente",
    subtitle:
      "Tu mente también merece un espacio cada día. Escribe en el diario guiado y calma el ritmo con ejercicios de respiración; poco a poco ganas claridad, resiliencia y más calma en tu día a día.",
    text: "Cultiva claridad y resiliencia. Descubre herramientas para tu bienestar emocional y cognitivo.",
    metaDescription:
      "Diario guiado y respiración guiada (4-7-8, caja y calma) para ganar claridad y calmar la ansiedad. Herramientas gratuitas, sin registro y en tu navegador.",
    cards: [
      {
        id: "diario-guiado",
        title: "Diario Guiado",
        description: "Reflexiona sobre tu día y emociones.",
        slug: "diario-guiado",
        isAvailable: true,
        category: "mente",
        metaTitle: "Diario guiado para escribir emociones y gratitud",
        metaDescription:
          "Escribe cada día en tu diario guiado: qué sentiste, qué aprendiste y tu gratitud. Refuerza tu bienestar emocional, 100% privado en tu navegador. Gratis.",
      },
      {
        id: "seguimiento-habitos",
        title: "Seguimiento de Hábitos",
        description: "Crea hábitos y sigue tu racha día a día.",
        slug: "seguimiento-habitos",
        isAvailable: true,
        category: "mente",
        metaTitle: "Seguimiento de hábitos diario y rachas",
        metaDescription:
          "Crea hábitos, marca tu día y sigue tu racha semana a semana. Un tracker privado que se guarda en tu navegador, sin registro y gratis.",
      },
      {
        id: "tecnicas-respiracion",
        title: "Técnicas de Respiración",
        description: "Calma la ansiedad con ejercicios guiados.",
        slug: "tecnicas-respiracion",
        isAvailable: true,
        category: "mente",
        metaTitle: "Respiración guiada 4-7-8 para calmar la ansiedad",
        metaDescription:
          "Respiración guiada en tiempo real: técnica 4-7-8 para dormir, caja 4-4-4-4 para concentrarte y calma 4-6 para relajarte. Elige tus rondas.",
      },
      {
        id: "test-ansiedad",
        title: "Test de Ansiedad GAD-7",
        description: "Mide tu nivel de ansiedad en 2 minutos.",
        slug: "test-ansiedad",
        isAvailable: true,
        category: "mente",
        metaTitle: "Test de ansiedad GAD-7: mide tu nivel en 7 preguntas",
        metaDescription:
          "Cuestionario GAD-7 validado: 7 preguntas sobre tus últimas 2 semanas, puntaje 0–21 y orientación según tu nivel (mínima, leve, moderada o grave). Gratis.",
      },
      {
        id: "calculadora-sueno",
        title: "Calculadora del Sueño",
        description: "¿A qué hora acostarte para despertar bien?",
        slug: "calculadora-sueno",
        isAvailable: true,
        category: "mente",
        metaTitle: "Calculadora del sueño: ¿a qué hora debo dormir?",
        metaDescription:
          "Calcula a qué hora acostarte (o despertar) según los ciclos de sueño de 90 minutos: de 4 a 6 ciclos por noche, con hora recomendada. Gratis.",
      },
      {
        id: "test-calidad-sueno",
        title: "Test de Calidad del Sueño",
        description: "Puntúa tu descanso y recibe consejos a tu medida.",
        slug: "test-calidad-sueno",
        isAvailable: true,
        category: "mente",
        metaTitle: "Test de calidad del sueño: ¿cómo duermes?",
        metaDescription:
          "Evalúa tu sueño con 11 preguntas sobre duración, despertares, ronquidos, cafeína y hábitos. Puntuación 0–100, alertas y consejos personalizados. Gratis.",
      },
    ],
  },
  relaciones: {
    id: "relaciones",
    title: "Fortalece tus",
    highlightText: "relaciones",
    subtitle:
      "Las relaciones que importan se cuidan con intención. Descubre cómo das y recibes cariño con el test de los lenguajes del amor, entiende tus patrones con el test de apego y haz de la conversación un ritual con las 45 preguntas profundas y el diario para parejas.",
    text: "Fortalece tus relaciones. Herramientas para mejorar la comunicación, resolver conflictos y construir vínculos significativos.",
    metaDescription:
      "Test de lenguajes del amor, test de apego, preguntas profundas y diario para parejas. Herramientas gratuitas, sin registro y en tu navegador.",
    cards: [
      {
        id: "test-lenguajes-amor",
        title: "Test de lenguajes del amor",
        description: "Descubre cómo das y recibes amor.",
        slug: "test-lenguajes-amor",
        isAvailable: true,
        category: "relaciones",
        metaTitle: "Test de los 5 lenguajes del amor: ¿cuál es el tuyo?",
        metaDescription:
          "Descubre en 5 minutos cuál de los 5 lenguajes del amor es el tuyo: palabras, tiempo, regalos, actos o contacto físico. Con consejos para tu pareja.",
      },
      {
        id: "diario-parejas",
        title: "Diario para parejas",
        description: "Fortalece tu conexión diaria.",
        slug: "diario-parejas",
        isAvailable: true,
        category: "relaciones",
        metaTitle: "Diario para parejas: pregunta diaria para conectar",
        metaDescription:
          "Un ritual diario para parejas: una pregunta distinta cada día y un espacio para que ambos escriban su respuesta. Historial y racha, en tu navegador.",
      },
      {
        id: "test-apego",
        title: "Test de estilo de apego",
        description: "Entiende tus patrones relacionales.",
        slug: "test-apego",
        isAvailable: true,
        category: "relaciones",
        metaTitle: "Test de estilo de apego: ¿seguro, ansioso o evitativo?",
        metaDescription:
          "Descubre tu estilo de apego en 12 preguntas: seguro, ansioso, evitativo o temeroso. Entiende tus patrones en las relaciones y qué puedes hacer. Gratis.",
      },
      {
        id: "preguntas-profundas",
        title: "Preguntas profundas",
        description: "Generador de conversaciones significativas.",
        slug: "preguntas-profundas",
        isAvailable: true,
        category: "relaciones",
        metaTitle: "Preguntas profundas para parejas, familia y amigos",
        metaDescription:
          "45 preguntas profundas para conversaciones que valen: en pareja, con familia y amigos o contigo mismo/a. Mezcla, copia y túrnense para escuchar de verdad.",
      },
    ],
  },
  cuerpo: {
    id: "cuerpo",
    title: "Energiza tu",
    highlightText: "cuerpo",
    subtitle:
      "Tu energía empieza con pequeños cambios. Calcula tus calorías diarias, la hidratación que necesita tu cuerpo y tu índice de masa corporal, y convierte tus minutos de caminata en pasos con un objetivo propio: la ciencia del movimiento, sin mitos ni promesas vacías.",
    text: "Energiza tu cuerpo. Accede a rutinas, nutrición y consejos para un estilo de vida activo y un bienestar integral.",
    metaDescription:
      "Calculadora de calorías, proteína, hidratación, IMC y plan de pasos 5-10-20. Tus datos y resultados se quedan en tu navegador: gratis y sin registro.",
    cards: [
      {
        id: "calculadora-calorias",
        title: "Calculadora de Calorías",
        description: "Descubre tus calorías diarias.",
        slug: "calculadora-calorias",
        isAvailable: true,
        category: "cuerpo",
        metaTitle: "Calculadora de calorías diarias (Mifflin-St Jeor)",
        metaDescription:
          "Calcula tus calorías diarias (TDEE) con Mifflin-St Jeor y tu rango de proteína según tu objetivo. Déficit, mantenimiento o superávit. Gratis.",
      },
      {
        id: "calculadora-hidratacion",
        title: "Calculadora de Hidratación",
        description: "Asegura tu ingesta de agua.",
        slug: "calculadora-hidratacion",
        isAvailable: true,
        category: "cuerpo",
        metaTitle: "Calculadora de hidratación diaria (EFSA/NASEM)",
        metaDescription:
          "Calcula cuánta agua necesitas al día según tu peso, nivel de actividad y clima (35 ml/kg + ajustes EFSA/NASEM). Con plan de reparto por horas.",
      },
      {
        id: "calculadora-imc",
        title: "Calculadora de IMC",
        description: "Conoce tu rango saludable.",
        slug: "calculadora-imc",
        isAvailable: true,
        category: "cuerpo",
        metaTitle: "¿Cuál es mi IMC? Calculadora de índice de masa corporal",
        metaDescription:
          "Calcula tu IMC al instante: rango saludable según tu estatura, tu peso ideal y lo que el índice de masa corporal no puede decirte. En tu navegador.",
      },
      {
        id: "calculadora-proteina-diaria",
        title: "Calculadora de Proteína",
        description: "Cuánta proteína necesitas según tu peso y objetivo.",
        slug: "calculadora-proteina-diaria",
        isAvailable: true,
        category: "cuerpo",
        metaTitle: "Calculadora de proteína diaria: cuánta necesitas",
        metaDescription:
          "Calcula cuánta proteína necesitas al día según tu peso, actividad y objetivo: rango en gramos, reparto por comida y fuentes. Gratis y sin registro.",
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
        id: "pasos-al-dia",
        title: "Plan de Pasos 5-10-20",
        description: "Define tu objetivo y camina con propósito.",
        slug: "pasos-al-dia",
        isAvailable: true,
        category: "cuerpo",
        metaTitle: "¿Cuántos pasos al día? Plan 5-10-20 y beneficios",
        metaDescription:
          "Define tu objetivo de pasos, arma tu plan 5-10-20 de minutos y descubre los beneficios de cada nivel. La ciencia marca la diferencia en 6,000-8,000 pasos.",
      },
    ],
  },
  finanzas: {
    id: "finanzas",
    title: "Domina tus",
    highlightText: "finanzas",
    subtitle:
      "El control de tu dinero empieza hoy. Organiza tus gastos, descubre cuánto puede rendir tu ahorro, compara préstamos y tarjetas antes de firmar y entiende al detalle tu factura de luz. Cada paso te acerca a tus metas.",
    text: "Domina tus finanzas. Herramientas para presupuestar, invertir y alcanzar tus metas económicas.",
    metaDescription:
      "Presupuesto, interés compuesto, préstamos, tarjetas, combustible, factura eléctrica y aguinaldo. Calculadoras gratuitas en tu navegador.",
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
        description: "Simula el rendimiento de tus inversiones.",
        slug: "calculadora-interes-compuesto",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de interés compuesto y rendimiento",
        metaDescription:
          "Calcula el rendimiento de tus inversiones con interés compuesto: aportaciones, inflación, gráficos y comparación de escenarios. En tu navegador.",
      },
      {
        id: "planificador-ahorros",
        title: "Planificador de ahorros",
        description: "Cuándo llegas a tu meta y cuánto aportar.",
        slug: "planificador-ahorros",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Planificador de ahorros: cuándo llegas a tu meta",
        metaDescription:
          "Planifica tu meta de ahorro: cuánto aportar al mes o cuánto tardarás, con rendimiento anual e interés compuesto. Gratis y sin registro.",
      },
      {
        id: "planificador-compras",
        title: "Planificador de compras",
        description: "¿Comprar ya o esperar e invertir?",
        slug: "planificador-compras",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Planificador de compras: ¿comprar ya o esperar?",
        metaDescription:
          "Compara comprar hoy vs. esperar e invertir el dinero: mira cuánto te gana la paciencia en meses, con rendimiento anual. Gratis y sin registro.",
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
        description: "Suma café, delivery y demás gastos pequeños.",
        slug: "tracker-gastos-hormiga",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Tracker de gastos hormiga: cuánto gastas al año",
        metaDescription:
          "Registra café, delivery, snacks y otros gastos pequeños: mira cuánto suman al día, al mes y al año. Gratis y sin registro.",
      },
      {
        id: "calculadora-aguinaldo",
        title: "Calculadora de Aguinaldo",
        description: "Calcula tu doble sueldo de diciembre.",
        slug: "calculadora-aguinaldo",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de aguinaldo RD: doble sueldo 2026",
        metaDescription:
          "Calcula tu aguinaldo o doble sueldo de diciembre en RD: 1/12 del salario del año, proporcional a los meses trabajados, exento de ISR y TSS. Gratis.",
      },
      {
        id: "calculadora-sueldo-neto",
        title: "Calculadora de Sueldo Neto",
        description: "De bruto a neto: TSS, ISR y otros descuentos.",
        slug: "calculadora-sueldo-neto",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de sueldo neto RD 2026 (TSS e ISR)",
        metaDescription:
          "Calcula tu sueldo neto en RD al instante: descuentos de TSS (SFS y AFP) y retención de ISR con las tasas y topes vigentes en 2026. Sin registro.",
      },
      {
        id: "calculadora-prestaciones-laborales",
        title: "Calculadora de Prestaciones Laborales",
        description: "Tu liquidación: cesantía, preaviso y vacaciones.",
        slug: "calculadora-prestaciones-laborales",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de prestaciones laborales RD (cesantía)",
        metaDescription:
          "Estima tu liquidación en RD: cesantía, preaviso, vacaciones y salario de Navidad proporcional según el Código de Trabajo. Gratis y sin registro.",
      },
      {
        id: "calculadora-itbis",
        title: "Calculadora de ITBIS",
        description: "Agrega o quita el ITBIS de un precio.",
        slug: "calculadora-itbis",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de ITBIS 18% (agregar y quitar)",
        metaDescription:
          "Agrega o quita el ITBIS de un precio con la tasa general del 18% o la reducida del 16%: obtén base, impuesto y total al instante. Gratis.",
      },
      {
        id: "calculadora-certificado-financiero",
        title: "Certificado financiero",
        description: "Calcula intereses, retención y ganancia neta.",
        slug: "calculadora-certificado-financiero",
        isAvailable: true,
        category: "finanzas",
        metaTitle: "Calculadora de certificado financiero RD",
        metaDescription:
          "Calcula cuánto rinde tu certificado financiero o depósito a plazo fijo: intereses según tasa y plazo, retención del 10% y ganancia neta. Gratis.",
      },
    ],
  },
}
