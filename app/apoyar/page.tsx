import Link from "next/link"
import { ArrowLeft, Heart, Coffee, Sparkles, Gift, Users, Rocket } from "lucide-react"
import Logo from "@/components/common/logo/logo"
import Footer from "@/components/common/footer/footer"
import MenuButton from "@/components/common/menu-button/menu-button"

export default function ApoyarPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 lg:p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
          >
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Volver</span>
          </Link>
          <MenuButton />
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/10 dark:bg-pink-400/5 blur-3xl rounded-full"></div>
            <Logo size="lg" />
          </div>
        </div>

        {/* Hero section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-2xl animate-pulse">
            <Heart className="h-10 w-10 text-white" fill="white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 dark:from-pink-400 dark:via-rose-400 dark:to-red-400 bg-clip-text text-transparent">
            Apoya a HOLENTIA
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tu apoyo nos ayuda a mantener <strong>HOLENTIA</strong> gratuita, sin anuncios y en constante mejora para
            todos.
          </p>
        </div>

        {/* Impact cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Sparkles,
              title: "100% Gratis",
              desc: "Mantenemos todas las herramientas gratuitas para todos",
              color: "from-blue-500 to-cyan-500",
              bg: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
              border: "border-blue-200/50 dark:border-blue-700/30",
            },
            {
              icon: Users,
              title: "Sin Anuncios",
              desc: "Tu experiencia sin interrupciones ni rastreo",
              color: "from-purple-500 to-pink-500",
              bg: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
              border: "border-purple-200/50 dark:border-purple-700/30",
            },
            {
              icon: Rocket,
              title: "Mejora Continua",
              desc: "Nuevas herramientas y funcionalidades cada mes",
              color: "from-orange-500 to-red-500",
              bg: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
              border: "border-orange-200/50 dark:border-orange-700/30",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${item.bg} border ${item.border} hover:shadow-xl transition-all duration-300`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              <div className="relative">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Donation options */}
        <div className="space-y-6 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">Formas de Contribuir</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* One-time */}
            <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <Coffee className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">Donación Única</h3>
                </div>
                <p className="text-green-800 dark:text-green-200 mb-6 leading-relaxed">
                  Invítanos un café y ayúdanos a seguir desarrollando nuevas herramientas para tu bienestar.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {["$3", "$5", "$10", "Otro"].map((amount) => (
                    <button
                      key={amount}
                      className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 font-semibold border-2 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 hover:scale-105 transition-all"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Hacer Donación
                </button>
              </div>
            </div>

            {/* Monthly */}
            <div className="group relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-2 border-pink-200 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-2xl transition-all duration-300">
              <div className="absolute -top-4 -right-4">
                <div className="px-4 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-full shadow-lg">
                  Popular
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-pink-900 dark:text-pink-100">Apoyo Mensual</h3>
                </div>
                <p className="text-pink-800 dark:text-pink-200 mb-6 leading-relaxed">
                  Conviértete en patrocinador y ayúdanos a planificar el futuro de HOLENTIA con confianza.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {["$2/mes", "$5/mes", "$10/mes", "Otro"].map((amount) => (
                    <button
                      key={amount}
                      className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-pink-700 dark:text-pink-300 font-semibold border-2 border-pink-300 dark:border-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/50 hover:scale-105 transition-all"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Ser Patrocinador
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative ways */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200/50 dark:border-indigo-700/30 mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-4 text-center">
              Otras Formas de Ayudar
            </h3>
            <p className="text-lg text-indigo-800 dark:text-indigo-200 mb-8 text-center max-w-2xl mx-auto">
              No todas las contribuciones son monetarias. Aquí hay otras maneras de apoyar el proyecto:
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: "Comparte", desc: "Recomienda HOLENTIA a amigos y familia" },
                { title: "Opina", desc: "Déjanos feedback para mejorar" },
                { title: "Contribuye", desc: "Sugiere nuevas herramientas" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/30"
                >
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">{item.title}</h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thank you section */}
        <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800">
          <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" fill="currentColor" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Gracias por tu Apoyo</h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Cada contribución, sin importar el monto, nos ayuda a mantener HOLENTIA funcionando y mejorando. Gracias por
            creer en nuestra misión de hacer el bienestar accesible para todos.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
