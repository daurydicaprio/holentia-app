# HOLENTIA

HOLENTIA es una aplicación web moderna que ofrece herramientas para el bienestar integral: mente, cuerpo y finanzas. Incluye calculadoras, simuladores, planificadores y más.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

\`\`\`
holentia/
├── app/                      # Directorio principal de Next.js App Router
│   ├── mente/                # Página de la sección mente
│   ├── cuerpo/               # Página de la sección cuerpo
│   ├── finanzas/             # Página de la sección finanzas
│   ├── [herramienta]/        # Páginas individuales para cada herramienta
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página principal (home)
├── components/               # Componentes reutilizables
│   ├── common/               # Componentes comunes (header, footer, logo)
│   ├── sections/             # Componentes específicos por sección
│   ├── ui/                   # Componentes de interfaz (botones, tarjetas, etc.)
│   └── tool-page-client.tsx  # Componente base para páginas de herramientas
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
- **Feedback Háptico**: Vibraciones sutiles en acciones en dispositivos móviles
- **Navegación por Gestos**: Deslizar para cambiar entre secciones en móviles

## Tecnologías Utilizadas

- **Next.js**: Framework React con App Router
- **TypeScript**: Para tipado estático
- **Tailwind CSS**: Para estilos
- **next-themes**: Para gestionar el modo oscuro
- **Framer Motion**: Para animaciones suaves
- **Lucide React**: Para iconografía consistente

## Secciones

La aplicación está dividida en tres secciones principales, cada una con su paleta de colores distintiva:

1. **Mente** (Azul: `#1976d2`, `#0d47a1`): Herramientas para el bienestar mental y emocional
2. **Cuerpo** (Ámbar: `#ffa000`, `#e65100`): Herramientas para la salud física y actividad
3. **Finanzas** (Verde: `#388e3c`, `#1b5e20`): Herramientas para la gestión financiera y económica

## Herramientas Implementadas

Actualmente, las siguientes herramientas están disponibles:

- **Finanzas**:
  - Crear presupuesto personal
  - Calculadora de interés compuesto
  - Calculadora de préstamo

## Directrices de Adaptación de Herramientas

Para adaptar herramientas existentes (HTML, CSS, JavaScript) a HOLENTIA, se deben seguir estas pautas:

### Estructura de Código

1. **Separación de Responsabilidades**:
   - Lógica de negocio (cálculos)
   - Interfaz de usuario (componentes React)
   - Estilos (Tailwind CSS)

2. **Organización de Archivos**:
   - Componente principal en `app/[herramienta]/page.tsx`
   - Subcomponentes específicos en carpetas dentro de `components`
   - Hooks personalizados en `hooks/` si es necesario

### Adaptación Visual

1. **Colores y Tema**:
   - Usar los colores correspondientes a la sección (mente, cuerpo, finanzas)
   - Implementar compatibilidad con modo oscuro/claro
   - Mantener coherencia con el sistema de diseño de HOLENTIA

2. **Responsividad**:
   - Diseño específico para móvil y escritorio
   - En móvil, usar sistema de pestañas/tabs para mejorar la usabilidad
   - En escritorio, aprovechar el espacio adicional para visualizaciones expandidas

### Versión Móvil con Pestañas

Para herramientas complejas, la versión móvil debe implementarse con un sistema de pestañas que:

1. **Divida la Funcionalidad**:
   - Organice el contenido en pestañas lógicas (entrada, resultados, gráficos, etc.)
   - Simplifique la interfaz mostrando sólo lo necesario en cada momento

2. **Mantenga la Coherencia**:
   - Use el mismo esquema de colores que la versión de escritorio
   - Preserve toda la funcionalidad esencial, aunque reorganizada
   - Conserve el mismo estilo visual y de interacción

3. **Optimice para la Interacción Táctil**:
   - Botones y elementos interactivos de tamaño adecuado
   - Espaciado suficiente entre elementos para evitar errores táctiles
   - Feedback visual y háptico al interactuar

### Implementación Técnica

1. **Uso de Custom Hooks**:
   - Separar la lógica de la interfaz
   - Facilitar la reutilización y el testing
   - Mantener los componentes limpios y enfocados en la UI

2. **Componentes de Presentación**:
   - Crear componentes pequeños y reutilizables
   - Utilizar props para configurar comportamientos
   - Implementar patrones de composición para mayor flexibilidad

3. **Gestión de Estado**:
   - Utilizar React Context o props drilling según complejidad
   - Considerar herramientas como Zustand para estado más complejo
   - Mantener el estado cerca de donde se utiliza

## Cómo Agregar Nuevas Herramientas

Para agregar una nueva herramienta:

1. **Actualizar Datos**:
   - Modificar `lib/data.ts` para incluir la nueva herramienta
   - Cambiar `isAvailable` a `true` cuando la herramienta esté lista

2. **Crear Archivos**:
   - Añadir página en `app/[nombre-herramienta]/page.tsx`
   - Crear componentes necesarios en la carpeta correspondiente
   - Implementar hooks personalizados si son necesarios

3. **Implementar Funcionalidad**:
   - Convertir el código existente a componentes React
   - Adaptar estilos según la sección correspondiente
   - Asegurar que funciona correctamente en modo oscuro

4. **Optimizar para Móvil**:
   - Implementar sistema de pestañas para la versión móvil
   - Asegurar que todos los elementos son accesibles
   - Probar en diferentes tamaños de pantalla

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
