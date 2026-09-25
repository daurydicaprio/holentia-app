"use client"

import { useEffect, useState } from "react"

interface LevelDef {
  n: number
  /** Título corto: solo "Nivel N" (el nombre del perfil va en el copy, no en el título). */
  name: string
  /** Título del perfil para el héroe: frase suelta y capitalizada (sin "Eres"/artículos). */
  profileName: string
  /** Descripción breve de qué es este perfil (héroe). */
  blurb: string
  short: string
  desc: string
  danger?: boolean
}

export const LEVELS: LevelDef[] = [
  {
    n: 1,
    name: "Nivel 1",
    profileName: "Conservador",
    blurb:
      "Priorizas no perder: buscas rendimiento estable y predecible, con riesgo bajo y tu dinero siempre disponible.",
    short: "Certificados, mercado de valores local y AFI",
    desc:
      "Perfil conservador: poco riesgo con certificados de depósito, mercado de valores local y AFI (fondos de inversión, en pesos o dólares). Le gana a la inflación — históricamente estos instrumentos logran entre 7% y 8% de rendimiento anual — y es factible desde montos pequeños. Es donde la mayoría debe empezar y donde mucha gente se queda, sin perder.",
    danger: false,
  },
  {
    n: 2,
    name: "Nivel 2",
    profileName: "Inversor en crecimiento",
    blurb:
      "Buscas crecer a largo plazo sin vigilar el mercado cada día: confías en la diversificación más que en elegir empresas.",
    short: "ETF y fondos indexados (EE.UU. / mundial)",
    desc:
      "Perfil en crecimiento: bolsa de EE.UU. y del mundo vía ETF o fondos indexados, sin elegir acciones una por una. Diversificación global y más que suficiente para hacer crecer patrimonio a largo plazo.",
    danger: false,
  },
  {
    n: 3,
    name: "Nivel 3",
    profileName: "Buscador de oportunidades",
    blurb:
      "Te gusta elegir tus propias empresas y dedicas tiempo real a estudiar el mercado antes de comprar.",
    short: "Empresas concretas, con conocimiento",
    desc:
      "Perfil de oportunidades: comprar acciones de empresas específicas exige leer mercados y noticias. Dedica al menos un año de estudio antes de subir; si tu capital es pequeño, 7–10 empresas como máximo.",
    danger: false,
  },
  {
    n: 4,
    name: "Nivel 4",
    profileName: "Inversor apalancado",
    blurb: "Buscas resultados rápidos con dinero prestado: el riesgo de perder más de lo invertido es real.",
    short: "Margen, forex, CFD",
    desc: "Puedes perder más de lo invertido. No lo necesitas para crecer patrimonio. En Holentia no lo recomendamos.",
    danger: true,
  },
  {
    n: 5,
    name: "Nivel 5",
    profileName: "Jugador de derivados",
    blurb: "Operas productos de riesgo extremo donde la mayoría de participantes pierde a largo plazo.",
    short: "Opciones, futuros, apalancado extremo",
    desc: "Riesgo extremo, casi siempre pierdes a largo plazo. Solo lo regulado, sin prisa y a largo plazo construye riqueza. En Holentia no lo recomendamos.",
    danger: true,
  },
]

const RISK_COLORS = ["#2e7d32", "#43a047", "#66bb6a", "#e53935", "#b71c1c"]
/** Color de los niveles inactivos: opacos/grises, en claro y oscuro. */
const INACTIVE_GRAY = "#9ca3af"

interface RiskLevelsGraphicProps {
  /** Nivel real del usuario: siempre en color, con glow y parpadeo. */
  activeLevel: number
  /** Nivel seleccionado (clic): toma su color original. */
  selectedLevel: number
  onSelect: (n: number) => void
}

/** Arco tipo velocímetro con los 5 niveles; el activo brilla, el seleccionado toma color. */
export function RiskLevelsGraphic({ activeLevel, selectedLevel, onSelect }: RiskLevelsGraphicProps) {
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
        {/* arco base: continuo, fino, une los 5 puntos */}
        <path
          d={`M ${points[0].x} ${points[0].y} A ${r} ${r} 0 0 1 ${points[4].x} ${points[4].y}`}
          fill="none"
          stroke="currentColor"
          className="text-gray-300 dark:text-gray-600"
          strokeWidth="2"
        />
        {/* progreso hasta el nivel del usuario */}
        <path
          d={`M ${points[0].x} ${points[0].y} A ${r} ${r} 0 0 1 ${active.x} ${active.y}`}
          fill="none"
          stroke={active.color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {points.map((p) => {
          const isActive = p.n === activeLevel
          const isColored = isActive || p.n === selectedLevel
          return (
            <g
              key={p.n}
              className="cursor-pointer"
              data-interactive="true"
              onClick={() => onSelect(p.n)}
              role="button"
              tabIndex={0}
              aria-label={`Nivel ${p.n}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(p.n)
                }
              }}
            >
              {isActive && (
                <circle cx={p.x} cy={p.y} r={16} fill={p.color} opacity={0.25}>
                  <animate attributeName="r" values="14;21;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0.08;0.35" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? 12 : 9}
                fill={isColored ? p.color : INACTIVE_GRAY}
                stroke={isActive ? "#fff" : "transparent"}
                strokeWidth={isActive ? 1.5 : 0}
                className="drop-shadow transition-colors"
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
                {isActive && (
                  <animate attributeName="opacity" values="1;0.55;1" dur="2s" repeatCount="indefinite" />
                )}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
