export type GlossaryCategoryId = "presupuesto" | "credito" | "tasas" | "inversion" | "economia"

export interface GlossaryCategory {
  id: GlossaryCategoryId
  label: string
}

export interface GlossaryTerm {
  term: string
  category: GlossaryCategoryId
  definition: string
  example?: string
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  { id: "presupuesto", label: "Ahorro y presupuesto" },
  { id: "credito", label: "Crédito y deudas" },
  { id: "tasas", label: "Intereses e inflación" },
  { id: "inversion", label: "Inversiones" },
  { id: "economia", label: "Economía personal" },
]

const terms: GlossaryTerm[] = [
  // — Ahorro y presupuesto —
  {
    term: "Presupuesto",
    category: "presupuesto",
    definition:
      "Plan que decide en qué se destina cada peso de tus ingresos en un período. Asignarle un destino al dinero antes de gastarlo es la base para ahorrar sin esfuerzo.",
    example:
      "Si ganas $40,000 al mes y repartes $22,000 en gastos necesarios, $8,000 en gustos y $10,000 en ahorro, ese reparto es tu presupuesto.",
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
    example: "Con $40,000 netos: $20,000 necesidades, $12,000 gustos y $8,000 ahorro o deudas.",
  },

  // — Crédito y deudas —
  {
    term: "Capital (préstamo)",
    category: "credito",
    definition:
      "El dinero original que se presta, sin intereses. Cada amortización reduce este saldo hasta llegar a cero.",
  },
  {
    term: "Amortización",
    category: "credito",
    definition:
      "Proceso de pagar un préstamo en partes: cada cuota cubre los intereses del período y el resto baja el capital. La calculadora de préstamo muestra el detalle mes a mes en su tabla de amortización.",
  },
  {
    term: "Cuota mensual",
    category: "credito",
    definition:
      "Pago periódico que combina intereses y una parte del capital hasta liquidar la deuda. Depende del monto, la tasa y el plazo elegidos.",
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
  },
  {
    term: "Fecha de corte y vencimiento",
    category: "credito",
    definition:
      "El corte cierra el resumen del mes y el vencimiento es la fecha límite de pago. Las compras hechas después del corte entran al siguiente ciclo. Herramienta relacionada: corte y vencimiento de tarjeta.",
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
  },
  {
    term: "Interés compuesto",
    category: "tasas",
    definition:
      "Interés que se genera también sobre los intereses ya acumulados: el crecimiento se acelera con el tiempo. Es tu mejor aliado invirtiendo y tu peor enemigo endeudándote.",
    example:
      "$10,000 al 10% anual compuesto quedan en $11,000 el primer año y en $12,100 el segundo (no $12,000): el interés ganó intereses.",
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
      "Hasta qué punto puedes y quieres soportar caídas sin entrar en pánico. Depende de tu personalidad y tu situación, no solo del monto. Herramienta relacionada: test de perfil de riesgo.",
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
]

/** Términos ordenados alfabéticamente (por categoría en la UI). */
export const GLOSSARY_TERMS: GlossaryTerm[] = [...terms].sort((a, b) => a.term.localeCompare(b.term, "es"))
