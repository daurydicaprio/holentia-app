export type GlossaryCategoryId = "presupuesto" | "credito" | "tasas" | "inversion" | "economia" | "sistema"

export interface GlossaryCategory {
  id: GlossaryCategoryId
  label: string
}

export interface GlossaryTerm {
  term: string
  category: GlossaryCategoryId
  definition: string
  example?: string
  /** Herramienta relacionada: link interno (SEO + UX). */
  related?: { slug: string; label: string }
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  { id: "presupuesto", label: "Ahorro y presupuesto" },
  { id: "credito", label: "Crédito y deudas" },
  { id: "tasas", label: "Intereses e inflación" },
  { id: "inversion", label: "Inversiones" },
  { id: "economia", label: "Economía personal" },
  { id: "sistema", label: "Sistema financiero" },
]

const terms: GlossaryTerm[] = [
  // — Ahorro y presupuesto —
  {
    term: "Presupuesto",
    category: "presupuesto",
    definition:
      "Plan que decide en qué se destina cada peso de tus ingresos en un período. Asignarle un destino al dinero antes de gastarlo es la base para ahorrar sin esfuerzo.",
    example:
      "Si ganas $24,000 al mes y repartes $14,000 en gastos necesarios, $5,000 en gustos y $5,000 en ahorro, ese reparto es tu presupuesto.",
    related: { slug: "crear-presupuesto-personal", label: "Crear mi presupuesto" },
  },
  {
    term: "Gastos fijos y variables",
    category: "presupuesto",
    definition:
      "Los fijos se pagan casi igual cada mes (renta, servicios, cuotas); los variables cambian según tus decisiones (supermercado, salidas, transporte). El margen de mejora casi siempre está en los variables.",
  },
  {
    term: "Colchón de emergencia",
    category: "presupuesto",
    definition:
      "Ahorro reservado para imprevistos (pérdida de ingreso, médico, reparación) que evita endeudarte por sorpresas. Como referencia, se recomienda cubrir de 3 a 6 meses de gastos básicos.",
    related: { slug: "crear-presupuesto-personal", label: "Simular mi presupuesto" },
  },
  {
    term: "Punto de equilibrio",
    category: "presupuesto",
    definition:
      "El momento en que tus ingresos cubren exactamente tus gastos: no hay déficit ni sobrante. Es la línea base desde la que empieza a construirse el ahorro.",
  },
  {
    term: "Liquidez",
    category: "presupuesto",
    definition:
      "Qué tan rápido puedes convertir algo en dinero disponible sin perder valor. Una cuenta de ahorros es muy líquida; una propiedad o un plazo fijo largo, menos.",
  },
  {
    term: "Regla 50/30/20",
    category: "presupuesto",
    definition:
      "Guía simple para repartir el ingreso neto: 50% necesidades, 30% gustos y 20% ahorro o pago de deudas. Es un punto de partida, no una regla estricta.",
    example: "Con $24,000 netos: $12,000 necesidades, $7,200 gustos y $4,800 ahorro o deudas.",
    related: { slug: "crear-presupuesto-personal", label: "Aplicarla a mis números" },
  },
  {
    term: "Regla del 17%",
    category: "presupuesto",
    definition:
      "Guía sencilla para convertir el ahorro en hábito: si cada mes apartas cerca del 17% de tu sueldo, al final del año tendrás acumulado el equivalente a unos 2 sueldos.",
    example:
      "Con un sueldo de $24,000, el 17% son $4,080 al mes: en 12 meses tendrías cerca de $49,000, algo más de 2 sueldos.",
    related: { slug: "calculadora-interes-compuesto", label: "Ver cómo crece ese ahorro" },
  },

  // — Crédito y deudas —
  {
    term: "Capital (préstamo)",
    category: "credito",
    definition:
      "El dinero original que se presta, sin intereses. Cada amortización reduce este saldo hasta llegar a cero.",
    related: { slug: "calculadora-prestamo", label: "Simular un préstamo" },
  },
  {
    term: "Amortización",
    category: "credito",
    definition:
      "Proceso de pagar un préstamo en partes: cada cuota cubre los intereses del período y el resto baja el capital. La calculadora de préstamo muestra el detalle mes a mes en su tabla de amortización.",
    related: { slug: "calculadora-prestamo", label: "Ver la tabla de amortización" },
  },
  {
    term: "Cuota mensual",
    category: "credito",
    definition:
      "Pago periódico que combina intereses y una parte del capital hasta liquidar la deuda. Depende del monto, la tasa y el plazo elegidos.",
    related: { slug: "calculadora-prestamo", label: "Calcular mi cuota" },
  },
  {
    term: "Endeudamiento",
    category: "credito",
    definition:
      "Proporción entre tus deudas y tus ingresos. Como referencia habitual, se considera manejable que las cuotas no superen cerca del 35% de tus ingresos mensuales.",
  },
  {
    term: "Saldo mínimo",
    category: "credito",
    definition:
      "Pago mínimo que exige la tarjeta cada mes. Pagar solo eso mantiene la cuenta al día, pero el saldo restante sigue generando intereses: pagar el total es lo ideal.",
    related: { slug: "calculadora-interes-tarjeta", label: "Ver el costo de financiar" },
  },
  {
    term: "Fecha de corte y vencimiento",
    category: "credito",
    definition:
      "El corte cierra el resumen del mes y el vencimiento es la fecha límite de pago. Las compras hechas después del corte entran al siguiente ciclo.",
    related: { slug: "tarjeta-corte-vencimiento", label: "Descubrir mis fechas" },
  },
  {
    term: "Score crediticio",
    category: "credito",
    definition:
      "Número que resume tu historial de pagos y uso del crédito. Los prestamistas lo usan para estimar tu riesgo: puntajes más altos suelen acceder a mejores tasas.",
  },

  // — Intereses e inflación —
  {
    term: "Interés simple",
    category: "tasas",
    definition:
      "Se calcula solo sobre el capital inicial, siempre igual. En un crédito de $10,000 al 10% anual simple, cada año se generan $1,000 de intereses, sin acumular.",
    related: { slug: "calculadora-interes-compuesto", label: "Verlo en la calculadora" },
  },
  {
    term: "Interés compuesto",
    category: "tasas",
    definition:
      "Interés que se genera también sobre los intereses ya acumulados: el crecimiento se acelera con el tiempo. Es tu mejor aliado invirtiendo y tu peor enemigo endeudándote.",
    example:
      "$10,000 al 10% anual compuesto quedan en $11,000 el primer año y en $12,100 el segundo (no $12,000): el interés ganó intereses.",
    related: { slug: "calculadora-interes-compuesto", label: "Usar la calculadora" },
  },
  {
    term: "Tasa nominal",
    category: "tasas",
    definition:
      "Tasa anunciada por período (mensual o anual) sin considerar cómo se capitaliza. Suele llamarse TEM, TEA o TIN según el producto, y no siempre refleja lo que finalmente pagas o ganas.",
  },
  {
    term: "Tasa efectiva",
    category: "tasas",
    definition:
      "Tasa que ya incluye el efecto de la capitalización: el verdadero costo de un crédito o rendimiento de una inversión. Para comparar productos, mira siempre la efectiva (métricas como APR o CAT).",
  },
  {
    term: "Inflación",
    category: "tasas",
    definition:
      "Aumento generalizado y sostenido de los precios. Reduce el poder adquisitivo del dinero que queda quieto sin rendir.",
    example: "Con 5% de inflación anual, los mismos $1,000 compran cerca de 5% menos el próximo año.",
  },
  {
    term: "Poder adquisitivo",
    category: "tasas",
    definition:
      "La cantidad de bienes y servicios que puedes comprar con una suma de dinero. La inflación lo baja; un rendimiento por encima de la inflación lo conserva.",
  },
  {
    term: "Regla de 72",
    category: "tasas",
    definition:
      "Truco para estimar en cuántos años se duplica el dinero: divide 72 entre la tasa anual de rendimiento.",
    example: "Con un 8% anual: 72 ÷ 8 = 9 años para duplicar.",
    related: { slug: "calculadora-interes-compuesto", label: "Estimar mi duplicación" },
  },

  // — Inversiones —
  {
    term: "Horizonte de inversión",
    category: "inversion",
    definition:
      "Plazo que tienes hasta necesitar el dinero. A mayor horizonte, más puedes soportar caídas y buscar rendimientos mayores.",
  },
  {
    term: "Volatilidad",
    category: "inversion",
    definition:
      "Magnitud de las subidas y bajadas de precio de un activo. Alta volatilidad significa más riesgo y más movimientos en el corto plazo.",
  },
  {
    term: "Diversificación",
    category: "inversion",
    definition:
      "Repartir el dinero entre distintos activos, sectores o países para que el mal resultado de uno no arrastre todo el portafolio.",
  },
  {
    term: "Tolerancia al riesgo",
    category: "inversion",
    definition:
      "Hasta qué punto puedes y quieres soportar caídas sin entrar en pánico. Depende de tu personalidad y tu situación, no solo del monto.",
    related: { slug: "test-perfil-riesgo", label: "Hacer el test de perfil de riesgo" },
  },
  {
    term: "Retorno de inversión (ROI)",
    category: "inversion",
    definition:
      "Ganancia obtenida respecto a lo invertido, expresada en porcentaje: (ganancia ÷ inversión) × 100.",
    example: "Ganaste $1,500 sobre una inversión de $10,000: ROI = 15%.",
  },
  {
    term: "Acción (renta variable)",
    category: "inversion",
    definition:
      "Participación pequeña en la propiedad de una empresa. Su precio fluctúa según el mercado y su valor no está garantizado.",
  },
  {
    term: "Bono (renta fija)",
    category: "inversion",
    definition:
      "Préstamo que tú haces a un gobierno o empresa, que paga intereses periódicos y devuelve el capital al vencer. Generalmente es menos volátil que las acciones.",
  },
  {
    term: "Inversión periódica",
    category: "inversion",
    definition:
      "Aportar montos fijos con frecuencia constante en lugar de intentar adivinar el mejor momento: promedia el precio de compra y quita la presión del timing.",
    related: { slug: "calculadora-interes-compuesto", label: "Simular aportes periódicos" },
  },
  {
    term: "Mercado de valores",
    category: "inversion",
    definition:
      "Lugar (físico o electrónico) donde se emiten y negocian acciones, bonos y otros títulos. En el mercado primario la empresa o el gobierno emite y recauda; en el secundario los inversores se compran y venden entre sí. En República Dominicana opera la Bolsa de Valores (BVRD).",
  },
  {
    term: "Índice bursátil",
    category: "inversion",
    definition:
      "Medida del desempeño de un grupo de acciones que sirve como referente del mercado. Ejemplos: S&P 500 (grandes empresas de EE. UU.), Nasdaq Composite (tecnológicas) e IPC (México). Si tu inversión «bate al índice», ganó más que ese promedio.",
  },
  {
    term: "Fondo de inversión (fondo mutuo)",
    category: "inversion",
    definition:
      "Puesto de dinero de muchos inversores que un gestor invierte de forma conjunta en acciones, bonos u otros activos. Compras participaciones cuyo precio sube o baja según la cartera. En varios países se le llama fondo mutuo o fondo colectivo.",
    example: "Si la participación vale $100 y aportas $5,000, obtienes 50 participaciones del fondo.",
  },
  {
    term: "Fondo indexado",
    category: "inversion",
    definition:
      "Fondo que replica pasivamente un índice bursátil en lugar de elegir acciones una por una. Al seguir al mercado suele cobrar comisiones bajas y no depende de que un gestor «acierte». Puede cotizar en bolsa (entonces es un ETF) o suscribirse directamente.",
  },
  {
    term: "ETF (fondo cotizado)",
    category: "inversion",
    definition:
      "Siglas de Exchange Traded Fund: un fondo de inversión que cotiza en bolsa como si fuera una acción, así que puedes comprar y venderlo durante la jornada. Suele replicar un índice y destaca por sus comisiones bajas.",
    example: "Un ETF del S&P 500 te da en una sola compra exposición a las 500 empresas más grandes de Estados Unidos.",
  },
  {
    term: "AFI (Administradora de Fondos de Inversión)",
    category: "inversion",
    definition:
      "Empresa que administra fondos de inversión: junta los aportes de muchas personas, invierte ese dinero según las reglas del fondo y atiende los rescates. Está autorizada y vigilada por el regulador de valores de su país; es el gestor, no el fondo en sí.",
  },
  {
    term: "SAFI (Sociedad Administradora de Fondos de Inversión)",
    category: "inversion",
    definition:
      "Nombre legal que recibe la administradora de fondos de inversión en varios países de la región (por ejemplo, Argentina y Venezuela). Cumple la misma función que una AFI: operar y custodiar los fondos bajo supervisión del regulador.",
  },
  {
    term: "Casa de bolsa (bróker)",
    category: "inversion",
    definition:
      "Intermediario autorizado que ejecuta tus órdenes de compra y venta en la bolsa, custodia tus títulos y cobra una comisión por operación o un porcentaje del monto operado.",
  },
  {
    term: "Cartera de inversión (portafolio)",
    category: "inversion",
    definition:
      "Conjunto de activos que posees: acciones, bonos, fondos y efectivo. Se diseña según tu horizonte y tolerancia al riesgo, y se reequilibra de vez en cuando para volver a la proporción elegida.",
    example: "En una cartera 70/30, si las acciones suben mucho se venden unas para volver al 70%.",
  },
  {
    term: "Renta fija y renta variable",
    category: "inversion",
    definition:
      "Las dos grandes familias de inversión: la renta fija (bonos, plazos fijos) promete flujos conocidos y se mueve poco; la renta variable (acciones, ETFs de acciones) depende del negocio y fluctúa más. Más movimiento suele significar más riesgo y más potencial.",
  },
  {
    term: "Dividendo",
    category: "inversion",
    definition:
      "Parte de las utilidades que una empresa reparte entre sus accionistas, normalmente en efectivo. No está garantizado: la empresa puede reducirlo o suspenderlo.",
    example: "Quien tiene 100 acciones que pagan $2 por acción recibe $200 de dividendo.",
  },
  {
    term: "Depósito a plazo fijo",
    category: "inversion",
    definition:
      "Ahorro pactado con el banco: depositas un monto por un plazo definido (30, 90, 180 días) a tasa fija. El dinero queda inmovilizado hasta el vencimiento (retirarlo antes suele costar una penalidad) y entonces recibes capital más intereses. Es de bajo riesgo.",
    example: "$100,000 DOP a 90 días al 6% anual rinden cerca de $1,500 de intereses.",
  },
  {
    term: "Certificado de depósito",
    category: "inversion",
    definition:
      "Comprobante que emite un banco por tu depósito a plazo: fija monto, tasa y fecha de vencimiento. Es la familia del plazo fijo (en Colombia se llama CDT). Algunos son negociables, es decir, pueden venderse antes de vencer a un precio de mercado.",
  },
  {
    term: "CDT (Certificado de Depósito a Término)",
    category: "inversion",
    definition:
      "Nombre que recibe en Colombia el depósito a plazo fijo: compras un plazo en el banco a tasa fija y no retiras el dinero antes del vencimiento. Es uno de los instrumentos de menor riesgo para ahorrar con rendimiento.",
    example: "$1,000,000 COP a 90 días al 10% anual efectivo rinden cerca de $24,700 al vencer.",
  },
  {
    term: "CETES",
    category: "inversion",
    definition:
      "Certificados de la Tesorería de la Federación: títulos de deuda del Gobierno de México a corto plazo (28, 91, 182 o 360 días). Se compran con descuento y al vencer pagan su valor nominal; al respaldarlos el Estado se consideran de riesgo muy bajo. Cada país tiene títulos similares.",
    example: "Compras un Cete a 28 días por $980 y al vencimiento recibes $1,000.",
  },

  // — Economía personal —
  {
    term: "Tipo de cambio",
    category: "economia",
    definition:
      "Precio de una moneda frente a otra (por ejemplo, DOP/USD). Afecta el costo de lo que se compra en moneda extranjera y el valor de tus ahorros en dólares.",
  },
  {
    term: "Impuesto",
    category: "economia",
    definition:
      "Contribución obligatoria que financia al estado sobre ingresos, compras o ganancias. En un cálculo, los montos netos ya incluyen el impuesto que aplica.",
  },
  {
    term: "Comisión",
    category: "economia",
    definition:
      "Cargo por usar un servicio financiero (administración de fondos, transferencias, mantenimiento de cuenta). Se descuenta del rendimiento: compárala siempre entre productos.",
  },
  {
    term: "Ingreso pasivo",
    category: "economia",
    definition:
      "Ganancia que no exige trabajo activo constante: intereses, dividendos, rentas. Se construye con ahorro e inversión a largo plazo.",
  },

  // — Sistema financiero —
  {
    term: "BCRD (Banco Central de la República Dominicana)",
    category: "sistema",
    definition:
      "Es el banco central del país. Se encarga de la política monetaria, de regular el sistema financiero y de facilitar los pagos entre entidades. No es un banco comercial: no abres una cuenta de ahorro ahí ni resuelve reclamos de clientes.",
  },
  {
    term: "LBTR (Liquidación Bruta en Tiempo Real)",
    category: "sistema",
    definition:
      "Sistema de pagos del Banco Central que liquida transferencias entre bancos, una por una y en tiempo real. Es rápido, pero no equivale a que el dinero esté disponible al instante en la cuenta destino: depende de horarios, validaciones y del proceso de cada entidad.",
    example:
      "Si haces una transferencia interbancaria un domingo, el banco puede recibirla, pero la liquidación final espera al siguiente día operativo.",
  },
  {
    term: "24/7",
    category: "sistema",
    definition:
      "Disponibilidad continua las 24 horas, los 7 días de la semana. En servicios financieros suele referirse a la app o al canal digital, no a que todas las operaciones se acrediten de inmediato.",
    example:
      "Puedes consultar tu saldo 24/7, pero un préstamo o una transferencia interbancaria puede procesarse solo en horario laboral.",
  },
  {
    term: "Intermediación financiera",
    category: "sistema",
    definition:
      "Actividad por la que una entidad capta recursos del público (ahorros, depósitos) y los presta a otras personas o empresas. El banco gana con la diferencia entre lo que paga por esos recursos y lo que cobra por el crédito.",
    related: { slug: "calculadora-prestamo", label: "Ver el costo de un préstamo" },
  },
  {
    term: "Activos financieros",
    category: "sistema",
    definition:
      "Bienes y derechos con valor económico que tiene una entidad: efectivo en caja, inversiones, cartera de créditos, títulos y cuentas por cobrar. Son los recursos con los que opera y genera ingresos.",
  },
  {
    term: "Crecimiento interanual",
    category: "sistema",
    definition:
      "Comparación de un indicador económico con el mismo período del año anterior. Sirve para separar el crecimiento real del efecto estacional; un 12% interanual significa que el indicador subió 12% frente a hace un año.",
    example:
      "Si los activos de un banco pasaron de $100,000 a $112,000 entre diciembre de 2025 y diciembre de 2026, crecieron 12% interanual.",
  },
  {
    term: "Patrimonio (de una entidad financiera)",
    category: "sistema",
    definition:
      "Recursos propios de la entidad: capital aportado por los accionistas más reservas y utilidades acumuladas. Funciona como colchón para absorber pérdidas y respaldar la confianza de los depositantes.",
  },
  {
    term: "ROE (Return on Equity / Rentabilidad Patrimonial)",
    category: "sistema",
    definition:
      "Mide la ganancia neta en relación con el patrimonio: ganancia neta ÷ patrimonio × 100. Un ROE de 23.1% indica que por cada 100 de fondos propios se generaron 23.10 de ganancias en el período; es una señal de alta rentabilidad para los accionistas.",
  },
  {
    term: "ROA (Return on Assets / Rentabilidad sobre Activos)",
    category: "sistema",
    definition:
      "Mide cuán eficientemente una entidad usa sus activos para generar beneficios: ganancia neta ÷ activos totales × 100. Un ROA de 2.9% significa que por cada 100 de activos se generaron 2.90 de ganancia neta.",
  },
  {
    term: "Morosidad",
    category: "sistema",
    definition:
      "Porcentaje de la cartera de créditos que está en atraso o impago. Un 1.5% indica que de cada 100 pesos prestados, 1.50 están en problemas de pago: un riesgo de crédito bajo y saludable.",
  },
  {
    term: "Solvencia regulatoria",
    category: "sistema",
    definition:
      "Indicador de solidez que mide si el capital propio alcanza para absorber pérdidas imprevistas. La norma suele exigir un mínimo de 10% sobre los activos ponderados por riesgo; un 18.9% del sistema muestra un colchón amplio.",
    example:
      "Con 18.9% de solvencia, el sistema supera el mínimo de 10% y tiene margen para cubrir pérdidas antes de comprometer el capital.",
  },
  {
    term: "SB (Superintendencia de Bancos)",
    category: "sistema",
    definition:
      "Órgano regulador que supervisa a bancos, asociaciones de ahorro y préstamo y otras entidades del sistema financiero dominicano. Vigila el cumplimiento de las normas, la solidez y la transparencia; también recibe consultas y reclamos de usuarios.",
  },

]

/** Términos ordenados alfabéticamente (por categoría en la UI). */
export const GLOSSARY_TERMS: GlossaryTerm[] = [...terms].sort((a, b) => a.term.localeCompare(b.term, "es"))
