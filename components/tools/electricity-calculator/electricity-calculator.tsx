"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Trash2, Info, Zap } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { draftKey, storageGet, storageSet, storageRemove } from "@/lib/storage"

// Tarifa residencial RD actual subsidiada — réplica factura usuario.
// Cargo fijo base fija, tramos 0-200 / 201-300 / 301+.
// El subsidio aplica hasta 700 kWh: desde 700 kWh se aplica la tasa más
// alta (tramo 3) al total del consumo.
const CARGO_FIJO = 127.83
const TRAMO1_LIMITE = 200
const TRAMO1_PRECIO = 6.17
const TRAMO2_LIMITE = 100
const TRAMO2_PRECIO = 8.71
const TRAMO3_PRECIO = 13.04
const UMBRAL_SIN_TRAMOS = 700
// Subsidio estimado global ref. facturas 397 kWh 45.47% / 438 kWh 45.02% / 445 kWh 44.65%.
const SUBSIDY_FACTOR = 0.819
const SUBSIDY_PCT_REF = 45.0

const DRAFT_KEY = draftKey("calculadora-consumo-electrico")

function formatRD(value: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function ElectricityCalculator() {
  const { triggerHapticFeedback } = useHapticFeedback()
  const [kwhInput, setKwhInput] = useState<string>("")
  const [savedFlash, setSavedFlash] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cargar borrador local (Tipo D, 1 slot, silencioso)
  useEffect(() => {
    const parsed = storageGet<{ kwh?: string }>(DRAFT_KEY, {})
    if (typeof parsed.kwh === "string") setKwhInput(parsed.kwh)
  }, [])

  // Autoguardado con debounce 500ms (se salta el primer render)
  const firstSave = useRef(true)
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (storageSet(DRAFT_KEY, { kwh: kwhInput })) {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 1500)
      }
    }, 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [kwhInput])

  const kwh = useMemo(() => {
    const n = Number.parseFloat(kwhInput)
    return isNaN(n) || n < 0 ? 0 : Math.floor(n)
  }, [kwhInput])

  const result = useMemo(() => {
    if (!kwhInput.trim() || kwh <= 0) return null
    // Desde 700 kWh no hay tramos: tasa más alta al total del consumo.
    const sinTramos = kwh >= UMBRAL_SIN_TRAMOS
    const t1kwh = sinTramos ? 0 : Math.min(kwh, TRAMO1_LIMITE)
    const t2kwh = sinTramos ? 0 : Math.min(Math.max(kwh - TRAMO1_LIMITE, 0), TRAMO2_LIMITE)
    const t3kwh = sinTramos ? kwh : Math.max(kwh - TRAMO1_LIMITE - TRAMO2_LIMITE, 0)
    const t1 = t1kwh * TRAMO1_PRECIO
    const t2 = t2kwh * TRAMO2_PRECIO
    const t3 = t3kwh * TRAMO3_PRECIO
    const total = CARGO_FIJO + t1 + t2 + t3
    // Sin tramos no hay subsidio: el total ya es a tasa plena.
    const subsidio = sinTramos ? 0 : total * SUBSIDY_FACTOR
    const sinSubsidio = sinTramos ? total : total + subsidio
    return { t1kwh, t2kwh, t3kwh, t1, t2, t3, total, subsidio, sinSubsidio, promedio: total / kwh, sinTramos }
  }, [kwh, kwhInput])

  const setQuick = (value: number) => {
    setKwhInput(String(value))
    triggerHapticFeedback("light")
  }

  const clearData = () => {
    setKwhInput("")
    storageRemove(DRAFT_KEY)
    triggerHapticFeedback("medium")
  }

  const rows = result
    ? result.sinTramos
      ? [{ label: `${result.t3kwh.toLocaleString("es-DO")} kWh x RD$ ${TRAMO3_PRECIO.toFixed(2)} (tasa plena)`, value: result.t3 }]
      : [
          { label: `${result.t1kwh.toLocaleString("es-DO")} kWh x RD$ ${TRAMO1_PRECIO.toFixed(2)}`, value: result.t1 },
          ...(result.t2kwh > 0
            ? [{ label: `${result.t2kwh.toLocaleString("es-DO")} kWh x RD$ ${TRAMO2_PRECIO.toFixed(2)}`, value: result.t2 }]
            : []),
          ...(result.t3kwh > 0
            ? [{ label: `${result.t3kwh.toLocaleString("es-DO")} kWh x RD$ ${TRAMO3_PRECIO.toFixed(2)}`, value: result.t3 }]
            : []),
        ]
    : []

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Controles */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-fit">
        <h2 className="text-xl font-bold mb-1">Tu consumo</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Mueve el medidor y mira tu factura al instante.</p>

        <div className="text-center mb-2">
          <span className="text-5xl font-bold text-[#388e3c] dark:text-[#81c784]">
            {kwh > 0 ? kwh.toLocaleString("es-DO") : "—"}
          </span>
          <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">kWh del mes</span>
        </div>

        <input
          type="range"
          min={0}
          max={1000}
          step={5}
          value={Math.min(kwh, 1000)}
          onChange={(e) => setKwhInput(e.target.value)}
          className="w-full mt-2"
          aria-label="Consumo en kWh"
          data-interactive="true"
        />

        <label className="block text-sm font-medium mt-4 mb-2">O escribe el número exacto</label>
        <input
          type="number"
          min={0}
          inputMode="decimal"
          value={kwhInput}
          onChange={(e) => setKwhInput(e.target.value)}
          placeholder="Ej: 445"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#388e3c] focus:border-transparent"
          data-interactive="true"
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {[150, 300, 445, 700].map((v) => (
            <button
              key={v}
              onClick={() => setQuick(v)}
              className="px-3 py-1.5 text-sm rounded-md bg-[#388e3c]/10 hover:bg-[#388e3c]/20 text-[#388e3c] dark:text-[#81c784] font-medium transition-colors"
              data-interactive="true"
            >
              {v} kWh
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local ✓" : "Se guarda en tu navegador"}
          </span>
          <button
            onClick={clearData}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 transition-colors"
            data-interactive="true"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Borrar mis datos
          </button>
        </div>
      </div>

      {/* La factura */}
      <div className="lg:col-span-3">
        {!result ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg text-center text-gray-500 dark:text-gray-400 h-full flex flex-col items-center justify-center">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-medium">Mueve el medidor</p>
            <p className="text-sm mt-1">y aquí aparece tu factura estimada.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-gray-900/80 dark:border-gray-100/20">
            <div className="bg-sky-200 dark:bg-sky-900/60 px-4 py-2 text-center font-bold tracking-wide text-sm">
              CALCULO DE LA FACTURA
            </div>
            <div className="p-5 sm:p-6 font-mono text-sm tabular-nums">
              <div className="flex justify-between py-1.5">
                <span>Cargo fijo</span>
                <span>RD$ {CARGO_FIJO.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3" />
              <div className="text-gray-500 dark:text-gray-400 text-xs mb-2">Energía</div>
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between py-1.5 gap-3">
                  <span className="truncate">{row.label}</span>
                  <span className="whitespace-nowrap">RD$ {row.value.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3" />
              <div className="flex justify-between py-1.5 font-sans font-semibold">
                <span>Promedio por kWh</span>
                <span>{formatRD(result.promedio)}</span>
              </div>
              <div className="flex justify-between py-1 font-sans text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {result.sinTramos
                    ? "Sin subsidio desde 700 kWh"
                    : `Subsidio gobierno (aprox. ${SUBSIDY_PCT_REF}%)`}
                </span>
                <span>{formatRD(result.subsidio)}</span>
              </div>
              <div className="flex justify-between py-1 font-sans text-xs text-gray-500 dark:text-gray-400">
                <span>Importe sin subsidio (est.)</span>
                <span>{formatRD(result.sinSubsidio)}</span>
              </div>
            </div>
            <div className="bg-yellow-300 dark:bg-yellow-500/90 px-5 sm:px-6 py-4 flex justify-between items-center gap-3 font-bold text-gray-900 tabular-nums">
              <span className="text-sm leading-tight">
                VALOR TOTAL
                <br />
                A PAGAR EN RD$
              </span>
              <span className="text-2xl sm:text-3xl whitespace-nowrap">{formatRD(result.total)}</span>
            </div>
            <div className="px-5 py-3 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
              <span>
                Estimación con tarifa subsidiada. Puede variar ±RD$ 100 por picos de generación y tu consumo. No
                incluye mora ni reconexión. Todo queda en tu navegador.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
