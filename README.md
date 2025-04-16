# HOLENTIA

HOLENTIA es una aplicación web moderna que ofrece herramientas para el bienestar integral: mente, cuerpo y finanzas. Incluye calculadoras, simuladores, planificadores y más.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

\`\`\`
holentia/
├── app/                      # Directorio principal de Next.js App Router
│   ├── [section]/            # Rutas dinámicas para secciones (mente, cuerpo, finanzas)
│   ├── [section]/[tool]/     # Rutas dinámicas para herramientas específicas
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página principal (home)
├── components/               # Componentes reutilizables
│   ├── common/               # Componentes comunes (header, footer, logo)
│   └── sections/             # Componentes específicos por sección
├── hooks/                    # Custom hooks
├── lib/                      # Utilidades y funciones
├── styles/                   # Estilos globales
├── types/                    # Definiciones de tipos
└── public/                   # Archivos estáticos
\`\`\`

## Características

- **Diseño Responsive**: Adaptado para dispositivos móviles y escritorio
- **Modo Oscuro**: Activación automática según preferencias del sistema
- **Estructura Modular**: Organización por secciones y herramientas
- **URLs Amigables**: Rutas simples y descriptivas
- **Efecto Aura**: Efecto visual detrás del logo según la sección
- **Modal de Bienvenida**: Mensaje introductorio en la primera visita

## Tecnologías Utilizadas

- **Next.js**: Framework React con App Router
- **TypeScript**: Para tipado estático
- **Tailwind CSS**: Para estilos
- **next-themes**: Para gestionar el modo oscuro
- **Framer Motion**: Para animaciones suaves

## Secciones

La aplicación está dividida en tres secciones principales:

1. **Mente**: Herramientas para el bienestar mental y emocional
2. **Cuerpo**: Herramientas para la salud física y actividad
3. **Finanzas**: Herramientas para la gestión financiera y económica

## Herramientas Implementadas

Actualmente, las siguientes herramientas están disponibles:

- **Finanzas**:
  - Crear presupuesto personal
  - Calculadora de interés compuesto
  - Calculadora de préstamo

## Cómo Agregar Nuevas Herramientas

Para agregar una nueva herramienta:

1. Actualiza el archivo `lib/data.ts` con la información de la herramienta
2. Crea los componentes específicos en la carpeta correspondiente
3. Implementa la lógica de la herramienta

## Desarrollo

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en modo producción
npm start
