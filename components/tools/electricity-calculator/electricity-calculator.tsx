"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Zap, Trash2, Info } from "lucide-react"
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

  // Autoguardado con debounce 500ms
  useEffect(() => {
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
    return isNaN(n) || n < 0 ? 0 : n
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

  return (
    <div className="space-y-6">
      {/* Entrada */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#388e3c] dark:text-[#81c784] mb-2">
          Estima tu factura eléctrica
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Escribe tu consumo en kWh y ve de antemano un aproximado, igual que tu factura.
        </p>

        <label className="block text-sm font-medium mb-2">Consumo estimado (kWh)</label>
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

        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={kwh}
          onChange={(e) => setKwhInput(e.target.value)}
          className="w-full mt-4"
          aria-label="Consumo en kWh"
          data-interactive="true"
        />

        <div className="flex flex-wrap gap-2 mt-4">
          {[100, 200, 300, 445, 700].map((v) => (
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

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {savedFlash ? "Guardado local ✓" : "Se guarda solo en tu navegador"}
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

      {/* Resultado réplica factura */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-12 w-12 text-[#388e3c] dark:text-[#81c784]" />
          </div>
          <h3 className="text-xl font-bold text-center mb-1">Cálculo de la factura</h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Tarifa actual subsidiada · Cargo fijo RD$ {CARGO_FIJO.toFixed(2)} base
          </p>
          {result.sinTramos && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200 text-center">
              Desde 700 kWh no aplica subsidio por tramos: se usa la tasa más alta
              (RD$ {TRAMO3_PRECIO.toFixed(2)}) al total del consumo.
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">Cargo fijo</span>
              <span className="font-semibold">{formatRD(CARGO_FIJO)}</span>
            </div>
            {!result.sinTramos && (
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  {result.t1kwh.toLocaleString("es-DO")} kWh x RD$ {TRAMO1_PRECIO.toFixed(2)}
                </span>
                <span className="font-semibold">{formatRD(result.t1)}</span>
              </div>
            )}
            {result.t2kwh > 0 && (
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  {result.t2kwh.toLocaleString("es-DO")} kWh x RD$ {TRAMO2_PRECIO.toFixed(2)}
                </span>
                <span className="font-semibold">{formatRD(result.t2)}</span>
              </div>
            )}
            {result.t3kwh > 0 && (
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  {result.t3kwh.toLocaleString("es-DO")} kWh x RD$ {TRAMO3_PRECIO.toFixed(2)}
                </span>
                <span className="font-semibold">{formatRD(result.t3)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)" }}>
            <div className="text-sm opacity-90 mb-1">Valor total a pagar en RD$</div>
            <div className="text-3xl font-bold">{formatRD(result.total)}</div>
            <div className="text-sm opacity-90 mt-2">
              Promedio {formatRD(result.promedio)} por kWh · {kwh.toLocaleString("es-DO")} kWh
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {result.sinTramos
                  ? "Subsidio del gobierno (no aplica desde 700 kWh)"
                  : `Gobierno te subsidia (aprox. ${SUBSIDY_PCT_REF}% ref.)`}
              </div>
              <div className="text-lg font-bold text-[#388e3c] dark:text-[#81c784]">{formatRD(result.subsidio)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Importe sin subsidio (estimado)
              </div>
              <div className="text-lg font-bold">{formatRD(result.sinSubsidio)}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 mt-4">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#388e3c]" />
            <span>
              Estimación con tarifa subsidiada actual. El monto del subsidio puede variar más o menos
              RD$ 100, ya que depende de los picos de generación y de tu consumo del mes
              (ref. facturas 397–445 kWh: 44.6–45.5%). Desde 700 kWh no hay subsidio por tramos.
              No incluye mora, reconexión ni otros cargos. Todo se calcula y guarda solo en tu navegador.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
