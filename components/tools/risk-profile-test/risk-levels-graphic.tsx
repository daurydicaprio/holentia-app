"use client"

interface LevelDef {
  n: number
  name: string
  short: string
  desc: string
  danger?: boolean
}

export const LEVELS: LevelDef[] = [
  {
    n: 1,
    name: "Nivel 1 · Conservador",
    short: "Certificados, mercado de valores local y AFI",
    desc:
      "Poco riesgo: certificados de depósito, mercado de valores local y AFI (fondos de inversión, en pesos o dólares). Le gana a la inflación y es factible desde montos pequeños. Es donde la mayoría debe empezar y donde mucha gente se queda — sin perder.",
    danger: false,
  },
  {
    n: 2,
    name: "Nivel 2 · Crecimiento",
    short: "ETF y fondos indexados (EE.UU. / mundial)",
    desc:
      "Bolsa de EE.UU. y del mundo vía ETF o fondos indexados: diversificación global sin elegir acciones una por una. Más que suficiente para hacer crecer patrimonio a largo plazo.",
    danger: false,
  },
  {
    n: 3,
    name: "Nivel 3 · Acciones individuales",
    short: "Empresas concretas, con conocimiento",
    desc:
      "Comprar acciones de empresas específicas. Exige leer mercados y noticias: dedica al menos un año de estudio antes de subir. Si tu capital es pequeño, 7–10 empresas como máximo.",
    danger: false,
  },
  {
    n: 4,
    name: "Nivel 4 · Apalancado y forex",
    short: "Margen, forex, CFD",
    desc:
      "Puedes perder más de lo invertido. No lo necesitas para crecer patrimonio. En Holentia no lo recomendamos.",
    danger: true,
  },
  {
    n: 5,
    name: "Nivel 5 · Derivados y cripto apalancada",
    short: "Opciones, futuros, apalancado extremo",
    desc:
      "Riesgo extremo, casi siempre pierdes a largo plazo. Solo lo regulado, sin prisa y a largo plazo construye riqueza. En Holentia no lo recomendamos.",
    danger: true,
  },
]

const RISK_COLORS = ["#2e7d32", "#43a047", "#66bb6a", "#e53935", "#b71c1c"]

/** Arco tipo velocímetro con los 5 niveles; el nivel activo se resalta. */
export function RiskLevelsGraphic({ activeLevel }: { activeLevel: number }) {
  // 5 puntos en un arco de ~180° (izq = nivel 1, der = nivel 5)
  const cx = 160
  const cy = 130
  const r = 96
  const points = LEVELS.map((lvl, i) => {
    const angle = Math.PI + (i / 4) * Math.PI // π → 2π
    return {
      n: lvl.n,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      danger: !!lvl.danger,
      color: RISK_COLORS[i],
    }
  })

  const active = points.find((p) => p.n === activeLevel) ?? points[0]

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 320 170" className="w-full max-w-sm" role="img" aria-label={`Nivel activo: ${activeLevel}`}>
        {/* arco base */}
        <path
          d={`M ${points[0].x} ${points[0].y} A ${r} ${r} 0 0 1 ${points[4].x} ${points[4].y}`}
          fill="none"
          stroke="currentColor"
          className="text-gray-300 dark:text-gray-600"
          strokeWidth="3"
          strokeDasharray="6 5"
        />
        {/* línea activa hasta el nivel */}
        <path
          d={`M ${points[0].x} ${points[0].y} A ${r} ${r} 0 0 1 ${active.x} ${active.y}`}
          fill="none"
          stroke={active.color}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {points.map((p) => {
          const isActive = p.n === activeLevel
          return (
            <g key={p.n}>
              {isActive && (
                <circle cx={p.x} cy={p.y} r={16} fill={p.color} opacity={0.25}>
                  <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? 13 : 10}
                fill={p.color}
                stroke={isActive ? "#fff" : "transparent"}
                strokeWidth={isActive ? 3 : 0}
                className="drop-shadow"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize={isActive ? 13 : 11}
                fontWeight={isActive ? 700 : 500}
                fill="#fff"
              >
                {p.n}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
