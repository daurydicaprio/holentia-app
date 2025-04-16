"use client"

import { useState, useEffect } from "react"

export function BudgetTips() {
  const [activePage, setActivePage] = useState(0)

  // Rotar consejos automáticamente cada 40 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePage((prev) => (prev + 1) % 2)
    }, 40000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-[#a4c3a2]/30 to-[#6a9c77]/20 dark:from-[#a4c3a2]/20 dark:to-[#6a9c77]/10 rounded-lg p-4 border border-[#6a9c77]/30 dark:border-[#6a9c77]/20 shadow-sm mb-5">
        <h3 className="text-[#1e3a2b] dark:text-[#6a9c77] font-medium text-sm mb-2">
          Aprende a construir tu propio presupuesto
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs">Obtén tu plantilla de Excel o Google Sheet gratis</p>
        <div className="text-[#388e3c] dark:text-[#6a9c77] font-medium text-xs mt-2">Acceder ahora →</div>
      </div>

      <h2 className="text-base font-medium text-[#1e3a2b] dark:text-[#6a9c77] mb-3">Consejos financieros</h2>

      <div className="relative">
        {/* Página 1 */}
        <div
          className={`space-y-3 transition-opacity duration-500 ${activePage === 0 ? "opacity-100" : "opacity-0 hidden"}`}
        >
          <div className="bg-[#1e3a2b] dark:bg-[#1e3a2b]/80 rounded-lg p-4 shadow-md border border-[#a4c3a2]/30 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-1">Identifica gastos hormiga</h3>
            <p className="text-gray-100/90 text-xs">
              Los pequeños gastos diarios suman más de lo que piensas. Registra todos tus gastos durante un mes para
              identificarlos y reducirlos.
            </p>
          </div>

          <div className="bg-[#1e3a2b] dark:bg-[#1e3a2b]/80 rounded-lg p-4 shadow-md border border-[#a4c3a2]/30 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-1">Metas de ahorro claras</h3>
            <p className="text-gray-100/90 text-xs">
              Define objetivos específicos y realistas con plazos determinados. Por ejemplo: ahorrar $5,000 en 6 meses
              para un viaje.
            </p>
          </div>

          <div className="bg-[#1e3a2b] dark:bg-[#1e3a2b]/80 rounded-lg p-4 shadow-md border border-[#a4c3a2]/30 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-1">Revisa suscripciones</h3>
            <p className="text-gray-100/90 text-xs">
              Cancela los servicios que no utilizas regularmente y evalúa si realmente necesitas todos los que mantienes
              activos.
            </p>
          </div>
        </div>

        {/* Página 2 */}
        <div
          className={`space-y-3 transition-opacity duration-500 ${activePage === 1 ? "opacity-100" : "opacity-0 hidden"}`}
        >
          <div className="bg-[#1e3a2b] dark:bg-[#1e3a2b]/80 rounded-lg p-4 shadow-md border border-[#a4c3a2]/30 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-1">Prioriza deudas</h3>
            <p className="text-gray-100/90 text-xs">
              Paga primero las deudas con mayor tasa de interés mientras mantienes los pagos mínimos en las demás para
              ahorrar dinero a largo plazo.
            </p>
          </div>

          <div className="bg-[#1e3a2b] dark:bg-[#1e3a2b]/80 rounded-lg p-4 shadow-md border border-[#a4c3a2]/30 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-1">Automatiza tus ahorros</h3>
            <p className="text-gray-100/90 text-xs">
              Configura transferencias automáticas a tu cuenta de ahorros el día que recibes tu sueldo para asegurar que
              ahorras antes de gastar.
            </p>
          </div>

          <div className="bg-[#1e3a2b] dark:bg-[#1e3a2b]/80 rounded-lg p-4 shadow-md border border-[#a4c3a2]/30 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-1">Regla 50/30/20</h3>
            <p className="text-gray-100/90 text-xs">
              Destina el 50% de tus ingresos a necesidades, 30% a deseos y 20% a ahorro y pago de deudas para mantener
              un presupuesto equilibrado.
            </p>
          </div>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-3">
        <button
          onClick={() => setActivePage(0)}
          className={`w-2 h-2 rounded-full transition-all ${activePage === 0 ? "bg-[#1e3a2b] scale-125" : "bg-[#1e3a2b]/30"}`}
          aria-label="Página 1"
        />
        <button
          onClick={() => setActivePage(1)}
          className={`w-2 h-2 rounded-full transition-all ${activePage === 1 ? "bg-[#1e3a2b] scale-125" : "bg-[#1e3a2b]/30"}`}
          aria-label="Página 2"
        />
      </div>
    </div>
  )
}
