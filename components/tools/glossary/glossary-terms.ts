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
  // Ahorro y presupuesto
  {
    term: "Presupuesto",
    category: "presupuesto",
    definition:
      "Es el plan que le pone nombre a cada peso de tu ingreso antes de que se vaya. Cuando decides cuánto va a renta, comida, gustos y ahorro, ya estás haciendo un presupuesto.",
    example:
      "Si ganas RD$24,000 al mes y repartes RD$14,000 en gastos necesarios, RD$5,000 en gustos y RD$5,000 en ahorro, ese reparto es tu presupuesto.",
    related: { slug: "crear-presupuesto-personal", label: "Crear mi presupuesto" },
  },
  {
    term: "Gastos fijos y variables",
    category: "presupuesto",
    definition:
      "Los fijos se repiten casi igual cada mes, como la renta o el internet. Los variables cambian según lo que decides, como el supermercado o las salidas. Ahí suele estar el margen para ajustar.",
    example:
      "Si tu renta es RD$12,000 y el supermercado cambia entre RD$8,000 y RD$11,000, el primero es un gasto fijo y el segundo, variable.",
  },
  {
    term: "Fondo de emergencia (colchón)",
    category: "presupuesto",
    definition:
      "Es dinero disponible que apartas solo para imprevistos: una reparación, una consulta médica o quedarte sin ingreso. La referencia habitual es cubrir de 3 a 6 meses de gastos básicos.",
    example:
      "Si tus gastos fijos son RD$30,000 al mes, un fondo de 3 a 6 meses equivale a RD$90,000–RD$180,000 en una cuenta disponible.",
    related: { slug: "crear-presupuesto-personal", label: "Simular mi presupuesto" },
  },
  {
    term: "Punto de equilibrio",
    category: "presupuesto",
    definition:
      "Es el punto en que tus ingresos alcanzan justo para cubrir tus gastos. No sobra ni falta. A partir de ahí empieza el ahorro.",
    example: "Si ganas RD$30,000 y tus gastos suman RD$30,000, estás en equilibrio.",
  },
  {
    term: "Liquidez",
    category: "presupuesto",
    definition:
      "Es la rapidez con la que puedes convertir algo en efectivo sin perder valor. Una cuenta de ahorro es líquida; una casa tarda meses en venderse.",
    example:
      "Tener RD$20,000 en una cuenta disponible te deja cubrir una emergencia hoy. Vender un inmueble puede tomar semanas.",
  },
  {
    term: "Regla 50/30/20",
    category: "presupuesto",
    definition:
      "Reparte tu ingreso neto en tres bloques: 50% necesidades, 30% gustos y 20% ahorro o deudas. Es una guía para empezar, no una ley.",
    example: "Con RD$24,000 netos: RD$12,000 necesidades, RD$7,200 gustos y RD$4,800 ahorro o deudas.",
    related: { slug: "crear-presupuesto-personal", label: "Aplicarla a mis números" },
  },
  {
    term: "Regla del 17%",
    category: "presupuesto",
    definition:
      "Si apartas cerca del 17% de tu sueldo cada mes, al año acumulas alrededor de dos sueldos. Sirve para convertir el ahorro en una costumbre.",
    example:
      "Con un sueldo de RD$24,000, el 17% son RD$4,080 al mes: en 12 meses tendrías cerca de RD$49,000, algo más de 2 sueldos.",
    related: { slug: "calculadora-interes-compuesto", label: "Ver cómo crece ese ahorro" },
  },
  {
    term: "Finanzas personales",
    category: "presupuesto",
    definition:
      "Son las decisiones de dinero de una persona o una familia: cuánto entra, cuánto sale, cuánto se ahorra y cuánto se invierte. El objetivo es cumplir metas y aguantar imprevistos.",
    example:
      "Organizar tu sueldo, crear un fondo de emergencia y decidir cuánto destinar a una meta son decisiones de finanzas personales.",
    related: { slug: "crear-presupuesto-personal", label: "Ordenar mis finanzas" },
  },
  {
    term: "Flujo de efectivo",
    category: "presupuesto",
    definition:
      "Es el registro de lo que entra y lo que sale en un período. Si entra más de lo que sale, el flujo es positivo; si sale más, es negativo.",
    example:
      "Si ganas RD$50,000 y gastas RD$38,000, tu flujo de efectivo del mes es RD$12,000 positivo.",
    related: { slug: "crear-presupuesto-personal", label: "Ver mi flujo mensual" },
  },
  {
    term: "Educación financiera",
    category: "presupuesto",
    definition:
      "Son los conocimientos y hábitos que te ayudan a decidir mejor con tu dinero: presupuesto, crédito, ahorro, inversión y riesgo.",
    example:
      "Saber si un préstamo tiene tasa fija o variable antes de firmar es educación financiera.",
  },
  {
    term: "Costo de oportunidad",
    category: "presupuesto",
    definition:
      "Es lo que dejas de ganar o de hacer cuando eliges una opción en lugar de otra. No siempre aparece en la cuenta, pero existe.",
    example:
      "Si usas RD$100,000 en un teléfono, el costo de oportunidad incluye el 10% anual que podrías haber ganado invirtiéndolos.",
    related: { slug: "calculadora-interes-compuesto", label: "Comparar con invertir" },
  },

  // Crédito y deudas
  {
    term: "Capital (préstamo)",
    category: "credito",
    definition:
      "Es el dinero que te prestan, sin contar los intereses. Cada pago reduce ese capital hasta llegar a cero.",
    example:
      "Si pides RD$200,000 y ya pagaste RD$50,000 de capital, todavía debes RD$150,000, más los intereses del período.",
    related: { slug: "calculadora-prestamo", label: "Simular un préstamo" },
  },
  {
    term: "Amortización",
    category: "credito",
    definition:
      "Es el proceso de pagar una deuda en partes. Cada cuota cubre los intereses del período y el resto baja el capital.",
    example:
      "En un préstamo de RD$100,000 a 12 meses, la primera cuota paga los intereses del mes y una parte del capital; la última deja el saldo en cero.",
    related: { slug: "calculadora-prestamo", label: "Ver la tabla de amortización" },
  },
  {
    term: "Cuota mensual",
    category: "credito",
    definition:
      "Es el pago que haces cada mes para liquidar el préstamo. Incluye intereses y una parte del capital, y depende del monto, la tasa y el plazo.",
    example: "Un préstamo de RD$100,000 al 24% a 12 meses tiene una cuota cercana a RD$9,456.",
    related: { slug: "calculadora-prestamo", label: "Calcular mi cuota" },
  },
  {
    term: "Endeudamiento",
    category: "credito",
    definition:
      "Es la relación entre tus deudas y tus ingresos. Como referencia, se suele considerar manejable que las cuotas no pasen de cerca del 35% de tu ingreso mensual.",
    example: "Si ganas RD$40,000 y tus cuotas suman RD$14,000, tu endeudamiento es 35%.",
  },
  {
    term: "Saldo mínimo",
    category: "credito",
    definition:
      "Es el pago más pequeño que exige la tarjeta cada mes. Pagar solo eso mantiene la cuenta al día, pero el resto sigue generando intereses.",
    example:
      "Si debes RD$20,000 y pagas solo el mínimo, el saldo que queda sigue generando intereses. Pagar el total evita ese costo.",
    related: { slug: "calculadora-interes-tarjeta", label: "Ver el costo de financiar" },
  },
  {
    term: "Fecha de corte y vencimiento",
    category: "credito",
    definition:
      "El corte cierra el resumen del mes. El vencimiento es la fecha límite para pagar. Lo que compras después del corte entra al siguiente ciclo.",
    example:
      "Si tu corte es el día 20 y compras el 21, esa compra aparece en el resumen del mes siguiente.",
    related: { slug: "tarjeta-corte-vencimiento", label: "Descubrir mis fechas" },
  },
  {
    term: "Score crediticio",
    category: "credito",
    definition:
      "Es un número que resume tu historial de pagos y uso del crédito. Los prestamistas lo usan para estimar tu riesgo; un puntaje más alto suele abrir mejores tasas.",
    example:
      "Pagar a tiempo y usar una parte baja de tu límite suele ayudar a subir el score con los meses.",
  },

  // Intereses e inflación
  {
    term: "Interés simple",
    category: "tasas",
    definition:
      "Se calcula solo sobre el capital inicial. No se acumula sobre los intereses anteriores, así que el monto crece igual cada período.",
    example: "RD$10,000 al 10% anual simple generan RD$1,000 de interés cada año.",
    related: { slug: "calculadora-interes-compuesto", label: "Verlo en la calculadora" },
  },
  {
    term: "Interés compuesto",
    category: "tasas",
    definition:
      "Se calcula sobre el capital y también sobre los intereses que ya ganaste. Por eso crece más rápido con el tiempo.",
    example:
      "RD$10,000 al 10% anual compuesto quedan en RD$11,000 el primer año y en RD$12,100 el segundo (no RD$12,000): el interés ganó intereses.",
    related: { slug: "calculadora-interes-compuesto", label: "Usar la calculadora" },
  },
  {
    term: "Tasa nominal",
    category: "tasas",
    definition:
      "Es la tasa que se anuncia, sin considerar cómo se capitaliza. Puede ser mensual o anual, y no siempre refleja lo que terminas pagando o ganando.",
    example:
      "Un préstamo anunciado al 24% nominal puede costar más si los intereses se capitalizan cada mes.",
  },
  {
    term: "Tasa efectiva",
    category: "tasas",
    definition:
      "Es la tasa que ya incluye el efecto de la capitalización. Sirve para comparar créditos o inversiones que se anuncian de formas distintas.",
    example:
      "Una tasa nominal de 24% con capitalización mensual equivale a una efectiva anual cercana a 26.8%.",
  },
  {
    term: "Inflación",
    category: "tasas",
    definition:
      "Es el aumento general de los precios con el tiempo. Hace que el mismo dinero compre menos.",
    example: "Con 5% de inflación anual, los mismos RD$1,000 compran cerca de 5% menos el próximo año.",
  },
  {
    term: "Poder adquisitivo",
    category: "tasas",
    definition:
      "Es cuánto puedes comprar con tu dinero. La inflación lo reduce; un rendimiento por encima de la inflación lo protege.",
    example:
      "Con RD$1,000 y 5% de inflación, el próximo año necesitas cerca de RD$1,050 para comprar lo mismo.",
  },
  {
    term: "Regla de 72",
    category: "tasas",
    definition:
      "Es un atajo para estimar en cuántos años se duplica una inversión: divide 72 entre la tasa anual.",
    example: "Con un 8% anual: 72 ÷ 8 = 9 años para duplicar.",
    related: { slug: "calculadora-interes-compuesto", label: "Estimar mi duplicación" },
  },
  {
    term: "Valor del dinero en el tiempo",
    category: "tasas",
    definition:
      "Un peso hoy vale más que un peso mañana. Puedes invertirlo para que genere rendimiento, y la inflación le quita poder de compra mientras esperas.",
    example:
      "RD$10,000 hoy al 10% se convierten en RD$11,000 en un año. Cobrar los mismos RD$10,000 dentro de un año no te deja igual.",
    related: { slug: "calculadora-interes-compuesto", label: "Ver el efecto del tiempo" },
  },
  {
    term: "Tasa de interés real",
    category: "tasas",
    definition:
      "Es lo que ganas o pagas después de restar la inflación. Una forma rápida de estimarla es tasa nominal menos inflación; la fórmula exacta es (1 + nominal) ÷ (1 + inflación) − 1.",
    example: "Si una inversión paga 9% y la inflación es 4%, la tasa real ronda el 5%.",
    related: { slug: "calculadora-interes-compuesto", label: "Comparar con la inflación" },
  },

  // Inversiones
  {
    term: "Horizonte de inversión",
    category: "inversion",
    definition:
      "Es el tiempo que puedes dejar el dinero invertido antes de necesitarlo. A más años, más margen para aguantar caídas.",
    example:
      "Si ahorras para la universidad de un hijo en 10 años, tienes más horizonte que si juntas para un viaje del próximo mes.",
  },
  {
    term: "Volatilidad",
    category: "inversion",
    definition:
      "Es cuánto sube y baja el precio de un activo. Más volatilidad significa movimientos más bruscos y más incertidumbre en el corto plazo.",
    example:
      "Una acción puede subir y bajar varios por ciento en un día; un certificado a plazo mantiene su tasa hasta vencer.",
  },
  {
    term: "Diversificación",
    category: "inversion",
    definition:
      "Es repartir el dinero entre activos, sectores o países distintos. Si uno cae, los otros pueden amortiguar el golpe.",
    example:
      "Si tienes todo en una sola acción y esa empresa cae, tu cartera cae con ella. Con varios activos, el efecto se reparte.",
  },
  {
    term: "Tolerancia al riesgo",
    category: "inversion",
    definition:
      "Es cuánto puedes y quieres aguantar una caída sin vender por pánico. Depende de tu situación y de tu forma de ser.",
    example:
      "Si una caída de 20% te quita el sueño, tu tolerancia es baja aunque tengas un horizonte largo.",
    related: { slug: "test-perfil-riesgo", label: "Hacer el test de perfil de riesgo" },
  },
  {
    term: "Retorno de inversión (ROI)",
    category: "inversion",
    definition:
      "Es la ganancia que obtienes frente a lo que invertiste, en porcentaje: (ganancia ÷ inversión) × 100.",
    example: "Ganaste RD$1,500 sobre una inversión de RD$10,000: ROI = 15%.",
  },
  {
    term: "Acción (renta variable)",
    category: "inversion",
    definition:
      "Es una parte de la propiedad de una empresa. Su precio cambia según el mercado y no está garantizado.",
    example:
      "Si compras 10 acciones a US$50, inviertes US$500. Si el precio sube a US$60, valen US$600 antes de comisiones.",
  },
  {
    term: "Bono (renta fija)",
    category: "inversion",
    definition:
      "Es un préstamo que tú haces a un gobierno o una empresa. Recibes intereses periódicos y, al vencer, te devuelven el capital.",
    example:
      "Compras un bono de RD$10,000 al 8% anual y recibes RD$800 al año hasta que venza.",
  },
  {
    term: "Inversión periódica",
    category: "inversion",
    definition:
      "Es aportar un monto fijo con frecuencia, en lugar de intentar adivinar el mejor momento. Así promedias el precio de compra.",
    example:
      "Aportar RD$5,000 cada mes durante 12 meses invierte RD$60,000, sin importar si el mercado subió o bajó.",
    related: { slug: "calculadora-interes-compuesto", label: "Simular aportes periódicos" },
  },
  {
    term: "Mercado de valores",
    category: "inversion",
    definition:
      "Es el lugar, físico o electrónico, donde se compran y venden acciones, bonos y otros títulos. En República Dominicana opera la Bolsa de Valores (BVRD).",
    example:
      "Una empresa emite acciones en el mercado primario; luego los inversionistas las negocian entre sí en el secundario.",
  },
  {
    term: "Índice bursátil",
    category: "inversion",
    definition:
      "Es una medida del desempeño de un grupo de acciones. Sirve como referencia para saber si una inversión lo hizo mejor o peor que el mercado.",
    example:
      "El S&P 500 agrupa a 500 empresas grandes de EE. UU. Si tu fondo sube 8% y el índice 10%, quedó por debajo.",
  },
  {
    term: "Fondo de inversión (fondo mutuo)",
    category: "inversion",
    definition:
      "Junta el dinero de muchas personas y un gestor lo invierte en acciones, bonos u otros activos. Compras participaciones cuyo precio sube o baja.",
    example: "Si la participación vale RD$100 y aportas RD$5,000, obtienes 50 participaciones del fondo.",
  },
  {
    term: "Fondo indexado",
    category: "inversion",
    definition:
      "Replica un índice en lugar de elegir acciones una por una. Suele cobrar comisiones bajas y no depende de que un gestor acierte.",
    example:
      "Un fondo indexado al S&P 500 compra las 500 empresas del índice en proporción similar.",
  },
  {
    term: "ETF (fondo cotizado)",
    category: "inversion",
    definition:
      "Es un fondo que cotiza en bolsa como una acción. Puedes comprarlo y venderlo durante la jornada, y suele replicar un índice.",
    example:
      "Un ETF del S&P 500 te da en una sola compra exposición a las 500 empresas más grandes de Estados Unidos.",
  },
  {
    term: "AFI (Administradora de Fondos de Inversión)",
    category: "inversion",
    definition:
      "Es la empresa que administra fondos de inversión. Reúne el dinero de muchas personas, lo invierte según las reglas del fondo y atiende los rescates.",
    example: "Una AFI administra un fondo de renta fija y cobra una comisión por gestionarlo.",
  },
  {
    term: "SAFI (Sociedad Administradora de Fondos de Inversión)",
    category: "inversion",
    definition:
      "Es el nombre legal de la administradora de fondos en varios países de la región, como Argentina y Venezuela. Cumple la misma función que una AFI.",
    example:
      "Una SAFI autorizada opera un fondo de inversión bajo supervisión del regulador local.",
  },
  {
    term: "Casa de bolsa (bróker)",
    category: "inversion",
    definition:
      "Es el intermediario autorizado que ejecuta tus órdenes de compra y venta en la bolsa. Custodia tus títulos y cobra una comisión.",
    example:
      "Si quieres comprar acciones, abres cuenta en una casa de bolsa y pagas su comisión por operación.",
  },
  {
    term: "Cartera de inversión (portafolio)",
    category: "inversion",
    definition:
      "Es el conjunto de activos que tienes: acciones, bonos, fondos y efectivo. Se arma según tu horizonte y tu tolerancia al riesgo.",
    example:
      "En una cartera 70/30, si las acciones suben mucho se venden unas para volver al 70%.",
  },
  {
    term: "Renta fija",
    category: "inversion",
    definition:
      "Son instrumentos donde conoces el rendimiento y el plazo de antemano. Suelen moverse menos que las acciones, aunque no están libres de riesgo.",
    example:
      "Un certificado a plazo o un bono del Banco Central es renta fija: sabes cuánto pagará y cuándo vence.",
  },
  {
    term: "Renta variable",
    category: "inversion",
    definition:
      "Son inversiones cuyo rendimiento no está garantizado y cambia con el mercado. Las acciones y los ETFs de acciones son los ejemplos más comunes.",
    example:
      "Si compras una acción a US$50 y cae a US$40, pierdes 20% en el papel hasta que vendas.",
  },
  {
    term: "Dividendo",
    category: "inversion",
    definition:
      "Es la parte de las utilidades que una empresa reparte entre sus accionistas, normalmente en efectivo. No está garantizado.",
    example: "Quien tiene 100 acciones que pagan US$2 por acción recibe US$200 de dividendo.",
  },
  {
    term: "Depósito a plazo fijo",
    category: "inversion",
    definition:
      "Es un ahorro que pactas con el banco por un plazo y una tasa fija. El dinero queda inmovilizado hasta el vencimiento; retirarlo antes suele costar una penalidad.",
    example:
      "RD$100,000 DOP a 90 días al 6% anual rinden cerca de RD$1,500 de intereses.",
  },
  {
    term: "Certificado de depósito",
    category: "inversion",
    definition:
      "Es el comprobante de un depósito a plazo. Fija monto, tasa y vencimiento. Algunos se pueden vender antes de vencer.",
    example:
      "Si depositas RD$50,000 a 180 días al 7%, el certificado deja claros el monto, la tasa y la fecha de pago.",
  },
  {
    term: "CDT (Certificado de Depósito a Término)",
    category: "inversion",
    definition:
      "Es el nombre que recibe el depósito a plazo fijo en Colombia. Compras un plazo en el banco a tasa fija y no retiras antes del vencimiento.",
    example:
      "$1,000,000 COP a 90 días al 10% anual efectivo rinden cerca de $24,700 al vencer.",
  },
  {
    term: "CETES",
    category: "inversion",
    definition:
      "Son títulos de deuda del Gobierno de México a corto plazo. Se compran con descuento y al vencer pagan su valor nominal.",
    example: "Compras un Cete a 28 días por $980 y al vencimiento recibes $1,000.",
  },
  {
    term: "Riesgo y rentabilidad",
    category: "inversion",
    definition:
      "Es la relación entre lo que puedes perder y lo que esperas ganar. Por lo general, una inversión con más riesgo ofrece más rentabilidad esperada, pero no te garantiza ganar.",
    example:
      "Un plazo fijo suele rendir menos que una acción, pero su precio no baila todos los días.",
    related: { slug: "test-perfil-riesgo", label: "Medir mi tolerancia" },
  },
  {
    term: "Inversiones",
    category: "inversion",
    definition:
      "Es la rama de las finanzas que pone dinero en activos con la expectativa de obtener un rendimiento futuro. Siempre hay algún riesgo.",
    example:
      "Comprar acciones, bonos o un certificado de depósito son formas de invertir.",
    related: { slug: "calculadora-interes-compuesto", label: "Simular una inversión" },
  },
  {
    term: "Swing trading (dobleces)",
    category: "inversion",
    definition:
      "Es un estilo de trading que busca capturar movimientos de precio de días o semanas. Exige tiempo, disciplina y aceptar pérdidas; no es lo mismo que invertir a largo plazo.",
    example:
      "Compras una acción antes de un reporte trimestral y la vendes días después si el mercado reacciona como esperabas.",
  },

  // Economía personal
  {
    term: "Tipo de cambio",
    category: "economia",
    definition:
      "Es el precio de una moneda frente a otra. Afecta lo que pagas por productos importados y lo que valen tus ahorros en otra moneda.",
    example:
      "Un producto de US$100 cuesta más pesos cuando el dólar sube; tus ahorros en dólares valen más en pesos.",
  },
  {
    term: "Impuesto",
    category: "economia",
    definition:
      "Es una contribución obligatoria que financia al Estado. Puede aplicarse sobre ingresos, compras o ganancias.",
    example: "El ITBIS es un impuesto que pagas al comprar bienes y servicios gravados.",
  },
  {
    term: "Comisión",
    category: "economia",
    definition:
      "Es el cargo por usar un servicio financiero, como una transferencia, una cuenta o un fondo. Se descuenta del rendimiento.",
    example: "Si un fondo rinde 8% y cobra 1% de comisión, tu rendimiento neto ronda 7%.",
  },
  {
    term: "Ingreso pasivo",
    category: "economia",
    definition:
      "Es dinero que entra sin que tengas que trabajar activamente todo el tiempo. Intereses, dividendos y rentas son ejemplos.",
    example: "Si un depósito paga RD$500 al mes de intereses, ese es un ingreso pasivo.",
  },
  {
    term: "Finanzas",
    category: "economia",
    definition:
      "Es el área que estudia cómo se administra el dinero: ingresos, gastos, ahorro, deuda, inversión y riesgo.",
    example:
      "Hacer un presupuesto y decidir si inviertes o pagas una deuda son decisiones financieras.",
  },
  {
    term: "Finanzas corporativas",
    category: "economia",
    definition:
      "Son las decisiones de dinero de una empresa: cómo consigue capital, en qué invierte y cómo reparte sus ganancias.",
    example:
      "Una empresa evalúa comprar una máquina con deuda o con caja; esa es una decisión de finanzas corporativas.",
  },
  {
    term: "Finanzas públicas",
    category: "economia",
    definition:
      "Son las decisiones de dinero del Estado: cómo recauda impuestos y cómo distribuye esos recursos en el presupuesto.",
    example: "El presupuesto nacional asigna dinero a salud, educación e infraestructura.",
  },
  {
    term: "Finanzas internacionales",
    category: "economia",
    definition:
      "Estudian los flujos de capital, el comercio y el tipo de cambio entre países.",
    example:
      "Una empresa dominicana que importa insumos paga en dólares y asume el riesgo del tipo de cambio.",
  },
  {
    term: "Economía básica",
    category: "economia",
    definition:
      "Estudia cómo las personas y la sociedad usan recursos limitados para satisfacer necesidades.",
    example:
      "La oferta y la demanda de café explican por qué el precio sube cuando hay escasez.",
  },
  {
    term: "Microeconomía",
    category: "economia",
    definition:
      "Estudia decisiones de personas, familias y empresas, y cómo interactúan en los mercados.",
    example: "El precio del combustible afecta el costo de una flota de entregas.",
  },
  {
    term: "Macroeconomía",
    category: "economia",
    definition:
      "Estudia la economía en conjunto: crecimiento, inflación, empleo, tasas y comercio.",
    example: "Una subida de la tasa del BCRD puede enfriar el crédito y la inflación.",
  },
  {
    term: "PIB (Producto Interno Bruto)",
    category: "economia",
    definition:
      "Es el valor de todos los bienes y servicios finales que produce un país en un período. Sirve para medir el tamaño y el ritmo de la economía.",
    example:
      "Si el PIB crece 5% interanual, la economía produjo 5% más que en el mismo período del año anterior.",
  },
  {
    term: "Tasa de Política Monetaria (TPM)",
    category: "economia",
    definition:
      "Es la tasa de referencia que fija el Banco Central para orientar el costo del crédito y controlar la inflación. Cuando sube, el dinero suele encarecerse.",
    example:
      "Si el BCRD sube la TPM, los préstamos y las tarjetas pueden encarecerse con el tiempo.",
  },

  // Sistema financiero
  {
    term: "BCRD (Banco Central de la República Dominicana)",
    category: "sistema",
    definition:
      "Es el banco central del país. Se encarga de la política monetaria, de regular el sistema financiero y de facilitar los pagos entre entidades. No es un banco comercial.",
    example:
      "No abres una cuenta de ahorro en el BCRD; para eso vas a un banco comercial. El BCRD fija la política monetaria.",
  },
  {
    term: "LBTR (Liquidación Bruta en Tiempo Real)",
    category: "sistema",
    definition:
      "Es el canal por donde viaja el dinero de un banco a otro y se liquida en el Banco Central. Es rápido, pero no siempre significa que el dinero esté disponible al instante.",
    example:
      "Transfieres RD$5,000 a un amigo en otro banco un viernes por la noche. Aunque el sistema se llame «tiempo real», el dinero puede reflejarse horas después o hasta el lunes por los procesos de compensación.",
  },
  {
    term: "24/7",
    category: "sistema",
    definition:
      "Significa disponible las 24 horas, los 7 días. En banca suele referirse a la app o al canal digital, no a que toda operación se acredite de inmediato.",
    example:
      "Puedes consultar tu saldo 24/7, pero un préstamo o una transferencia interbancaria puede procesarse solo en horario laboral.",
  },
  {
    term: "Plataforma de Pagos Instantáneos (24/7)",
    category: "sistema",
    definition:
      "Es un sistema que busca acreditar fondos entre entidades en segundos, sin esperar al siguiente día operativo. Es distinto de que una app esté disponible 24/7: aquí cambia la liquidación del pago.",
    example:
      "Pagas RD$500 a un vendedor un domingo a las 3:00 a. m. y el dinero llega a su cuenta en segundos, en lugar de esperar al lunes.",
  },
  {
    term: "Intermediación financiera",
    category: "sistema",
    definition:
      "Es la actividad en la que una entidad capta ahorros y los presta a otras personas o empresas. Gana con la diferencia entre lo que paga y lo que cobra.",
    example:
      "El banco paga 5% anual por un depósito y presta ese dinero al 12%; la diferencia bruta de 7% es su margen, antes de costos y morosidad.",
    related: { slug: "calculadora-prestamo", label: "Ver el costo de un préstamo" },
  },
  {
    term: "Activos financieros",
    category: "sistema",
    definition:
      "Son los bienes y derechos con valor económico de una entidad: efectivo, inversiones, cartera de créditos y cuentas por cobrar.",
    example:
      "Un banco con RD$1,000,000 prestados en hipotecas tiene ese monto como activo: es dinero que le deben y que le generará intereses.",
  },
  {
    term: "Crecimiento interanual",
    category: "sistema",
    definition:
      "Compara un indicador con el mismo período del año anterior. Sirve para ver si el crecimiento es real o solo un efecto de la temporada.",
    example:
      "Si los activos de un banco pasaron de $100,000 a $112,000 entre diciembre de 2025 y diciembre de 2026, crecieron 12% interanual.",
  },
  {
    term: "Patrimonio (activos menos deudas)",
    category: "sistema",
    definition:
      "Es lo que realmente te pertenece después de restar tus deudas. En un banco son el capital, las reservas y las utilidades acumuladas; en tus finanzas, tus bienes menos tus pasivos.",
    example:
      "Si una casa vale RD$5,000,000 y debes RD$3,000,000, tu patrimonio en esa propiedad es RD$2,000,000.",
  },
  {
    term: "ROE (Return on Equity / Rentabilidad Patrimonial)",
    category: "sistema",
    definition:
      "Mide la ganancia neta frente al patrimonio: ganancia ÷ patrimonio × 100. Un ROE alto indica que la entidad genera buena rentabilidad con el dinero de los socios.",
    example:
      "Inviertes RD$100,000 de tu propio dinero en un negocio y al año ganas RD$20,000 netos: tu ROE es 20%.",
  },
  {
    term: "ROA (Return on Assets / Rentabilidad sobre Activos)",
    category: "sistema",
    definition:
      "Mide la ganancia neta frente a los activos totales: ganancia ÷ activos × 100. Un ROA alto indica que la entidad usa bien sus recursos para generar beneficios.",
    example:
      "Compras un vehículo de RD$1,000,000 para trabajar y te deja RD$50,000 libres al año: tu ROA es 5%.",
  },
  {
    term: "Morosidad",
    category: "sistema",
    definition:
      "Es el porcentaje de la cartera de créditos que está atrasada o impaga. Mide el riesgo de crédito.",
    example:
      "Si 100 personas tomaron un préstamo y 1.5 están atrasadas en sus cuotas, la morosidad es 1.5%.",
  },
  {
    term: "Solvencia regulatoria",
    category: "sistema",
    definition:
      "Es la capacidad de una entidad para absorber pérdidas con su propio capital. La norma suele exigir un mínimo de 10% sobre los activos ponderados por riesgo.",
    example:
      "Si la ley exige RD$10 de capital por cada RD$100 prestados y el banco tiene RD$18.90, está altamente protegido ante impagos.",
  },
  {
    term: "SB (Superintendencia de Bancos)",
    category: "sistema",
    definition:
      "Es el regulador que supervisa a bancos y otras entidades financieras en República Dominicana. Vigila el cumplimiento de las normas y atiende consultas y reclamos.",
    example:
      "Si tienes un problema con un banco y no lo resuelve, puedes acudir a la SB.",
  },
]

/** Términos ordenados alfabéticamente (por categoría en la UI). */
export const GLOSSARY_TERMS: GlossaryTerm[] = [...terms].sort((a, b) => a.term.localeCompare(b.term, "es"))
