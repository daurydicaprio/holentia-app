# HOLENTIA

HOLENTIA es una aplicación web moderna que ofrece herramientas para el bienestar integral en cuatro áreas clave: mente, relaciones, cuerpo y finanzas. Incluye calculadoras, simuladores, test interactivos y más, con una interfaz intuitiva y adaptable a diferentes dispositivos.

## Visión General

HOLENTIA busca proporcionar recursos accesibles para mejorar el bienestar integral de las personas a través de herramientas digitales prácticas y fáciles de usar. La aplicación está diseñada con un enfoque en la experiencia de usuario, accesibilidad y rendimiento.

## Estructura del Proyecto

El proyecto está organizado siguiendo la estructura de Next.js App Router:

```
holentia/
├── app/                      # Directorio principal de Next.js App Router
│   ├── mente/                # Página de la sección mente
│   ├── relaciones/           # Página de la sección relaciones
│   ├── cuerpo/               # Página de la sección cuerpo
│   ├── finanzas/             # Página de la sección finanzas
│   ├── [herramienta]/        # Páginas individuales para cada herramienta
│   ├── que-es-holentia/      # Página informativa sobre Holentia
│   ├── aviso-legal/          # Página con el aviso legal
│   ├── politica-cookies/     # Página con la política de cookies
│   ├── ayuda/                # Centro de ayuda con FAQs
│   ├── apoyar/               # Página de donaciones y apoyo
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página principal (home)
├── components/               # Componentes reutilizables
│   ├── common/               # Componentes comunes
│   │   ├── header/           # Componentes de encabezado
│   │   ├── footer/           # Componente de pie de página
│   │   ├── logo/             # Componente de logo con efectos
│   │   ├── mobile-fab/       # Botón flotante para móviles
│   │   ├── menu-button/      # Botón de menú desplegable
│   │   ├── scroll-to-top/    # Botón para volver arriba
│   │   └── tab-swipe-navigation/ # Navegación por gestos para pestañas
│   ├── sections/             # Componentes específicos por sección
│   │   ├── section-header.tsx # Encabezado de sección
│   │   ├── section-tabs.tsx   # Pestañas de navegación entre secciones
│   │   ├── section-swipe-navigation.tsx # Navegación por gestos
│   │   ├── tool-card.tsx      # Tarjeta de herramienta
│   │   └── tools-grid.tsx     # Cuadrícula de herramientas
│   ├── tools/                # Componentes específicos de herramientas
│   │   ├── budget-simulator/  # Simulador de presupuesto
│   │   ├── compound-interest/ # Calculadora de interés compuesto
│   │   ├── loan-calculator/   # Calculadora de préstamos
│   │   ├── guided-journal/    # Diario guiado (Mente)
│   │   ├── love-languages-test/ # Test de lenguajes del amor (Relaciones)
│   │   └── hydration-calculator/ # Calculadora de hidratación (Cuerpo)
│   ├── ui/                   # Componentes de interfaz (botones, tarjetas, etc.)
│   └── tool-page-client.tsx  # Componente base para páginas de herramientas
├── hooks/                    # Custom hooks
│   ├── use-budget-simulator.ts    # Lógica para el simulador de presupuesto
│   ├── use-compound-interest-calculator.ts # Lógica para calculadora de interés compuesto
│   ├── use-haptic-feedback.ts     # Hook para feedback háptico
│   ├── use-loan-calculator.ts     # Lógica para calculadora de préstamos
│   └── use-media-query.ts         # Hook para consultas de medios
├── lib/                      # Utilidades y funciones
│   ├── data.ts               # Datos de secciones y herramientas
│   └── utils.ts              # Funciones de utilidad
├── types/                    # Definiciones de tipos
│   └── index.ts              # Tipos principales
└── public/                   # Archivos estáticos
```

## Características Principales

- **Diseño Responsive**: Adaptado para dispositivos móviles y escritorio
- **Modo Oscuro**: Activación automática según preferencias del sistema
- **Estructura Modular**: Organización por secciones y herramientas
- **URLs Amigables**: Rutas simples y descriptivas
- **Efecto Aura**: Efecto visual detrás del logo según la sección
- **Feedback Háptico**: Vibraciones sutiles en acciones en dispositivos móviles
- **Navegación por Gestos**: Deslizar para cambiar entre secciones y pestañas en móviles
- **Animaciones y Transiciones**: Efectos visuales para mejorar la experiencia de usuario
- **Tarjetas Interactivas**: Efectos 3D y animaciones en tarjetas de herramientas
- **Adaptación Contextual**: Colores y estilos adaptados según la sección actual
- **Formateo Numérico**: Visualización de números con separadores de miles para mejor legibilidad
- **Guardado de Simulaciones**: Capacidad para guardar y comparar diferentes escenarios en calculadoras
- **Optimización Táctil**: Mejoras específicas para la interacción en dispositivos táctiles
- **Privacidad Total**: No se recopilan datos personales, todo se procesa localmente
- **Diseño Minimalista**: Interfaz limpia, moderna y atractiva con gradientes sutiles

## Tecnologías Utilizadas

- **Next.js 15.2.8**: Framework React con App Router
- **TypeScript**: Para tipado estático
- **Tailwind CSS**: Para estilos
- **next-themes**: Para gestionar el modo oscuro
- **Framer Motion**: Para animaciones suaves
- **Lucide React**: Para iconografía consistente
- **Chart.js**: Para visualizaciones de datos en herramientas financieras

## Secciones

La aplicación está dividida en cuatro secciones principales, cada una con su paleta de colores distintiva:

1. **Mente** (Azul: `#1976d2`, `#0d47a1`): Herramientas para el bienestar mental y emocional
2. **Relaciones** (Violeta: `#7c3aed`, `#5b21b6`): Herramientas para mejorar vínculos interpersonales
3. **Cuerpo** (Ámbar: `#ffa000`, `#e65100`): Herramientas para la salud física y actividad
4. **Finanzas** (Verde: `#388e3c`, `#1b5e20`): Herramientas para la gestión financiera y económica

## Herramientas Implementadas

### Mente
- **Diario Guiado**: Herramienta de reflexión diaria con preguntas estructuradas para el autoconocimiento y bienestar emocional

### Relaciones
- **Test de Lenguajes del Amor**: Test interactivo para descubrir tu lenguaje del amor principal y mejorar tus relaciones

### Cuerpo
- **Calculadora de Hidratación**: Calcula tu ingesta diaria de agua recomendada según tu peso, actividad y clima

### Finanzas
- **Crear presupuesto personal**: Herramienta para gestionar ingresos y gastos con visualización de datos
- **Calculadora de interés compuesto**: Visualización del crecimiento de ahorros con capacidad para guardar y comparar simulaciones
- **Calculadora de préstamo**: Estrategia para eliminar deudas con capacidad para guardar y comparar simulaciones

## Páginas Informativas

- **Home**: Página de inicio con introducción elegante y acceso directo a las secciones
- **¿Qué es Holentia?**: Información detallada sobre la misión, valores y características de la plataforma con diseño atractivo y moderno
- **Aviso Legal**: Términos de uso, propiedad intelectual y responsabilidades con presentación clara y profesional
- **Política de Cookies**: Explicación detallada del uso mínimo de cookies y compromiso con la privacidad
- **Ayuda**: Centro de ayuda con FAQs interactivos y guías de usuario
- **Apoyar**: Página de donaciones con opciones para contribuir al proyecto

## Directrices de Diseño

### Paleta de Colores

Cada sección tiene su propia paleta de colores:

- **Mente**:
  - Principal: `#1976d2`
  - Oscuro: `#0d47a1`

- **Relaciones**:
  - Principal: `#7c3aed`
  - Oscuro: `#5b21b6`

- **Cuerpo**:
  - Principal: `#ffa000`
  - Oscuro: `#e65100`

- **Finanzas**:
  - Principal: `#388e3c`
  - Oscuro: `#1b5e20`

### Componentes UI

#### Tarjetas
- Bordes redondeados, efectos de vidrio y sombras sutiles
- Animaciones de hover con elevación
- Gradientes sutiles para profundidad visual

#### Botones
- Colores según sección, con feedback táctil
- Efectos de hover y active states
- Gradientes para botones destacados

#### Tipografía
- Jerarquía clara con tamaños consistentes
- Uso de text-balance y text-pretty para mejor legibilidad
- Gradientes de texto para títulos destacados

## Privacidad y Datos

**HOLENTIA no recopila, almacena ni procesa información personal de los usuarios.** Todos los datos se procesan localmente en el dispositivo del usuario:

- No utilizamos cookies de seguimiento o análisis
- No compartimos información con terceros
- No creamos perfiles de usuario
- Los datos de herramientas se guardan solo en localStorage del navegador
- No hay servidores backend que almacenen información personal
- Solo usamos cookies técnicas esenciales (preferencias de tema)

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en modo producción
npm start
```

## Contribución

Para contribuir al proyecto:

1. Seguir las directrices de estilo y estructura
2. Mantener la separación de lógica e interfaz
3. Asegurar compatibilidad con modo oscuro
4. Optimizar para dispositivos móviles y escritorio
5. Implementar feedback háptico en interacciones importantes
6. Probar en diferentes navegadores y dispositivos
7. Añadir atributo `data-interactive="true"` a elementos interactivos
8. Respetar la privacidad del usuario: no añadir tracking ni recopilación de datos
9. Mantener diseño minimalista y coherente con la esencia de la aplicación
10. Usar gradientes sutiles y efectos visuales con moderación

## Licencia

Este proyecto es propiedad de Daury DiCaprio. Todos los derechos reservados.

---

**Última actualización**: Diciembre 2024
