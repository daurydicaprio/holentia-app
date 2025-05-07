# HOLENTIA

HOLENTIA es una aplicación web moderna que ofrece herramientas para el bienestar integral en tres áreas clave: mente, cuerpo y finanzas. Incluye calculadoras, simuladores, planificadores y más, con una interfaz intuitiva y adaptable a diferentes dispositivos.

![HOLENTIA Logo](https://via.placeholder.com/800x400?text=HOLENTIA)

## Visión General

HOLENTIA busca proporcionar recursos accesibles para mejorar el bienestar integral de las personas a través de herramientas digitales prácticas y fáciles de usar. La aplicación está diseñada con un enfoque en la experiencia de usuario, accesibilidad y rendimiento.

## Estructura del Proyecto

El proyecto está organizado siguiendo la estructura de Next.js App Router:

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
│   │   ├── header/           # Componentes de encabezado (desktop y mobile)
│   │   ├── footer/           # Componente de pie de página
│   │   ├── logo/             # Componente de logo con efectos
│   │   ├── mobile-fab/       # Botón flotante para móviles
│   │   ├── scroll-to-top/    # Botón para volver arriba
│   │   ├── tab-swipe-navigation/ # Navegación por gestos para pestañas
│   │   └── welcome-modal/    # Modal de bienvenida
│   ├── sections/             # Componentes específicos por sección
│   │   ├── section-header.tsx # Encabezado de sección
│   │   ├── section-tabs.tsx   # Pestañas de navegación entre secciones
│   │   ├── section-swipe-navigation.tsx # Navegación por gestos
│   │   ├── tool-card.tsx      # Tarjeta de herramienta
│   │   └── tools-grid.tsx     # Cuadrícula de herramientas
│   ├── tools/                # Componentes específicos de herramientas
│   │   ├── budget-simulator/  # Simulador de presupuesto
│   │   ├── compound-interest/ # Calculadora de interés compuesto
│   │   └── loan-calculator/   # Calculadora de préstamos
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
\`\`\`

## Características Principales

- **Diseño Responsive**: Adaptado para dispositivos móviles y escritorio
- **Modo Oscuro**: Activación automática según preferencias del sistema
- **Estructura Modular**: Organización por secciones y herramientas
- **URLs Amigables**: Rutas simples y descriptivas
- **Efecto Aura**: Efecto visual detrás del logo según la sección
- **Modal de Bienvenida**: Mensaje introductorio en la primera visita
- **Feedback Háptico**: Vibraciones sutiles en acciones en dispositivos móviles
- **Navegación por Gestos**: Deslizar para cambiar entre secciones y pestañas en móviles
- **Animaciones y Transiciones**: Efectos visuales para mejorar la experiencia de usuario
- **Tarjetas Interactivas**: Efectos 3D y animaciones en tarjetas de herramientas
- **Adaptación Contextual**: Colores y estilos adaptados según la sección actual
- **Formateo Numérico**: Visualización de números con separadores de miles para mejor legibilidad
- **Guardado de Simulaciones**: Capacidad para guardar y comparar diferentes escenarios en calculadoras
- **Optimización Táctil**: Mejoras específicas para la interacción en dispositivos táctiles

## Tecnologías Utilizadas

- **Next.js**: Framework React con App Router
- **TypeScript**: Para tipado estático
- **Tailwind CSS**: Para estilos
- **next-themes**: Para gestionar el modo oscuro
- **Framer Motion**: Para animaciones suaves
- **Lucide React**: Para iconografía consistente
- **Chart.js**: Para visualizaciones de datos en herramientas financieras

## Secciones

La aplicación está dividida en tres secciones principales, cada una con su paleta de colores distintiva:

1. **Mente** (Azul: `#1976d2`, `#0d47a1`): Herramientas para el bienestar mental y emocional
2. **Cuerpo** (Ámbar: `#ffa000`, `#e65100`): Herramientas para la salud física y actividad
3. **Finanzas** (Verde: `#388e3c`, `#1b5e20`): Herramientas para la gestión financiera y económica

## Herramientas Implementadas

Actualmente, las siguientes herramientas están disponibles:

- **Finanzas**:
  - **Crear presupuesto personal**: Herramienta para gestionar ingresos y gastos
  - **Calculadora de interés compuesto**: Visualización del crecimiento de ahorros con capacidad para guardar simulaciones
  - **Calculadora de préstamo**: Estrategia para eliminar deudas con capacidad para guardar simulaciones

### Calculadora de Interés Compuesto

La calculadora de interés compuesto permite a los usuarios:

- Calcular el crecimiento de sus inversiones a lo largo del tiempo
- Visualizar el impacto del interés compuesto mediante gráficos
- Ajustar parámetros como depósito inicial, aportaciones periódicas, tasa de interés, etc.
- Considerar el impacto de la inflación en los resultados
- Guardar hasta 3 simulaciones diferentes para comparar escenarios
- Personalizar el nombre de cada simulación guardada
- Ver detalles como balance final, ganancia neta, aportes totales y rendimiento

### Calculadora de Préstamos

La calculadora de préstamos permite a los usuarios:

- Calcular pagos mensuales, intereses totales y tiempo de pago
- Visualizar la amortización del préstamo mediante tablas y gráficos
- Ajustar parámetros como monto del préstamo, tasa de interés, plazo, etc.
- Guardar hasta 3 simulaciones diferentes para comparar escenarios
- Personalizar el nombre de cada simulación guardada

### Simulador de Presupuesto Personal

El simulador de presupuesto personal permite a los usuarios:

- Crear un presupuesto detallado con ingresos y gastos
- Categorizar conceptos para mejor organización
- Visualizar el balance y distribución del presupuesto
- Recibir consejos personalizados basados en su situación financiera

## Directrices de Diseño

### Paleta de Colores

Cada sección tiene su propia paleta de colores:

- **Mente**:
  - Principal: `#1976d2`
  - Oscuro: `#0d47a1`
  - Texto: `#ffffff` (claro), `#e0e0e0` (oscuro)
  - Fondo de vidrio: `rgba(25, 118, 210, 0.4)` (claro), `rgba(25, 118, 210, 0.2)` (oscuro)

- **Cuerpo**:
  - Principal: `#ffa000`
  - Oscuro: `#e65100`
  - Texto: `#212121` (claro), `#e0e0e0` (oscuro)
  - Fondo de vidrio: `rgba(255, 160, 0, 0.4)` (claro), `rgba(255, 160, 0, 0.2)` (oscuro)

- **Finanzas**:
  - Principal: `#388e3c`
  - Oscuro: `#1b5e20`
  - Texto: `#ffffff` (claro), `#e0e0e0` (oscuro)
  - Fondo de vidrio: `rgba(56, 142, 60, 0.4)` (claro), `rgba(56, 142, 60, 0.2)` (oscuro)

### Componentes UI

#### Tarjetas

- **Bordes redondeados**: `16px`
- **Padding**: `1.75rem`
- **Efecto de vidrio**: `backdrop-filter: blur(20px)`
- **Sombras**: 
  - Normal: `0 12px 28px rgba(0, 0, 0, 0.1)`
  - Hover: `0 15px 35px rgba(0, 0, 0, 0.08)`
- **Animaciones**:
  - Hover: Elevación y ligero aumento de escala
  - Efecto 3D en tarjetas disponibles

#### Botones

- **Principales**: Color según sección, texto blanco
- **Secundarios**: Fondo gris claro/oscuro según tema
- **Iconos**: Tamaño consistente, con efectos de hover
- **Feedback**: Reducción de escala al presionar (active:scale-90)

#### Tipografía

- **Títulos**: 
  - Principal: `1.5rem - 2rem`, negrita
  - Secciones: `1.25rem - 1.5rem`, semi-negrita
  - Tarjetas: `1.125rem`, semi-negrita
- **Texto**: 
  - Normal: `0.875rem - 1rem`
  - Pequeño: `0.75rem - 0.8rem`
- **Espaciado de líneas**: `1.4` para mejor legibilidad

### Adaptación Móvil

Para herramientas complejas, la versión móvil implementa un sistema de pestañas que:

1. **Divide la Funcionalidad**:
   - Organiza el contenido en pestañas lógicas (entrada, resultados, gráficos, simulaciones, etc.)
   - Simplifica la interfaz mostrando sólo lo necesario en cada momento

2. **Mantiene la Coherencia**:
   - Usa el mismo esquema de colores que la versión de escritorio
   - Preserva toda la funcionalidad esencial, aunque reorganizada

3. **Optimiza para la Interacción Táctil**:
   - Botones y elementos interactivos de tamaño adecuado (mínimo 44px)
   - Espaciado suficiente entre elementos para evitar errores táctiles
   - Feedback visual y háptico al interactuar
   - Atributo `data-interactive="true"` en elementos interactivos para mejorar la navegación por gestos

### Navegación por Gestos

La aplicación implementa un sistema de navegación por gestos que:

1. **Facilita la Navegación entre Secciones**:
   - Permite deslizar horizontalmente para cambiar entre las secciones principales (mente, cuerpo, finanzas)
   - Proporciona feedback visual durante el deslizamiento

2. **Optimiza la Navegación en Herramientas**:
   - Desactiva la navegación por gestos entre secciones cuando se está en una herramienta
   - Implementa navegación por gestos entre pestañas dentro de las herramientas
   - Detecta elementos interactivos para evitar conflictos con sliders y otros controles

3. **Mejora la Experiencia Móvil**:
   - Proporciona una alternativa intuitiva a la navegación por botones
   - Mantiene coherencia con patrones de diseño móvil modernos

## Patrones de Implementación

### Custom Hooks

Se utilizan hooks personalizados para separar la lógica de la interfaz:

- **useHapticFeedback**: Proporciona feedback táctil en dispositivos móviles
- **useMediaQuery**: Detecta el tamaño de pantalla para adaptación responsive
- **useBudgetSimulator**: Lógica para el simulador de presupuesto
- **useCompoundInterestCalculator**: Lógica para la calculadora de interés compuesto, incluyendo guardado de simulaciones
- **useLoanCalculator**: Lógica para la calculadora de préstamos, incluyendo guardado de simulaciones

### Componentes Contextuales

Los componentes adaptan su apariencia según el contexto:

- **Logo**: Cambia el aura según la sección
- **Header**: Adapta colores y estructura según la página y dispositivo
- **Tarjetas**: Ajustan colores y estilos según la sección y disponibilidad

### Navegación

- **Desktop**: Pestañas en la parte superior y menú desplegable
- **Mobile**: Navegación por gestos entre secciones y menú hamburguesa
- **Herramientas**: Botón de retorno a sección y navegación contextual
- **Pestañas en Móvil**: Sistema de pestañas con navegación por gestos para herramientas complejas

### Formateo Numérico

- **Separadores de Miles**: Visualización de números con comas para mejor legibilidad
- **Formateo en Tiempo Real**: Actualización del formato mientras el usuario escribe
- **Consistencia**: Aplicado en todos los campos numéricos relevantes

## Cómo Añadir Nuevas Herramientas

Para añadir una nueva herramienta:

1. **Actualizar Datos**:
   - Modificar `lib/data.ts` para incluir la nueva herramienta
   - Cambiar `isAvailable` a `true` cuando la herramienta esté lista

2. **Crear Archivos**:
   - Añadir página en `app/[nombre-herramienta]/page.tsx`
   - Crear componentes necesarios en `components/tools/[nombre-herramienta]/`
   - Implementar hooks personalizados si son necesarios en `hooks/use-[nombre-herramienta].ts`

3. **Implementar Funcionalidad**:
   - Seguir el patrón de separación de lógica (hooks) e interfaz (componentes)
   - Adaptar estilos según la sección correspondiente
   - Asegurar que funciona correctamente en modo oscuro

4. **Optimizar para Móvil**:
   - Implementar sistema de pestañas para la versión móvil
   - Asegurar que todos los elementos son accesibles
   - Probar en diferentes tamaños de pantalla
   - Añadir atributo `data-interactive="true"` a elementos interactivos

## Directrices de Adaptación de Herramientas

Para adaptar herramientas existentes (HTML, CSS, JavaScript) a HOLENTIA, se deben seguir estas pautas:

### Estructura de Código

1. **Separación de Responsabilidades**:
   - Lógica de negocio (hooks personalizados)
   - Interfaz de usuario (componentes React)
   - Estilos (Tailwind CSS)

2. **Organización de Archivos**:
   - Componente principal en `app/[herramienta]/page.tsx`
   - Subcomponentes específicos en carpetas dentro de `components/tools/[herramienta]/`
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
   - Organice el contenido en pestañas lógicas (entrada, resultados, gráficos, simulaciones, etc.)
   - Simplifique la interfaz mostrando sólo lo necesario en cada momento

2. **Mantenga la Coherencia**:
   - Use el mismo esquema de colores que la versión de escritorio
   - Preserve toda la funcionalidad esencial, aunque reorganizada
   - Conserve el mismo estilo visual y de interacción

3. **Optimice para la Interacción Táctil**:
   - Botones y elementos interactivos de tamaño adecuado
   - Espaciado suficiente entre elementos para evitar errores táctiles
   - Feedback visual y háptico al interactuar
   - Atributos `data-interactive="true"` en elementos interactivos

## Mejoras Implementadas

- **Navegación por Gestos Mejorada**: Optimización para evitar conflictos con elementos interactivos
- **Formateo Numérico**: Implementación de separadores de miles en campos numéricos
- **Guardado de Simulaciones**: Capacidad para guardar y comparar diferentes escenarios en calculadoras
- **Optimización Táctil**: Mejoras específicas para la interacción en dispositivos táctiles
- **Accesibilidad Mejorada**: Etiquetas ARIA y mejoras para lectores de pantalla

## Mejoras Planificadas

- **Gráficos al simulador de presupuesto**: Visualizaciones para mejor comprensión
- **Función de exportar presupuesto**: Permitir guardar y compartir presupuestos
- **Sistema de metas financieras**: Seguimiento de objetivos económicos
- **Mejoras de accesibilidad**: Optimización para lectores de pantalla y navegación por teclado
- **Gráficos a la calculadora de préstamos**: Visualización de amortización
- **Función de guardar presupuesto**: Persistencia de datos
- **Tema personalizable**: Opciones de personalización visual
- **Modo de alto contraste**: Mejora de accesibilidad
- **Exportación de datos**: Permitir exportar simulaciones en formatos como CSV o PDF
- **Presets de inversión**: Configuraciones predefinidas para diferentes tipos de inversión
- **Notificaciones**: Sistema de notificaciones para acciones importantes

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
\`\`\`

## Contribución

Para contribuir al proyecto:

1. Seguir las directrices de estilo y estructura
2. Mantener la separación de lógica e interfaz
3. Asegurar compatibilidad con modo oscuro
4. Optimizar para dispositivos móviles y escritorio
5. Implementar feedback háptico en interacciones importantes
6. Probar en diferentes navegadores y dispositivos
7. Añadir atributo `data-interactive="true"` a elementos interactivos

## Licencia

Este proyecto es propiedad de Daury DiCaprio. Todos los derechos reservados.
