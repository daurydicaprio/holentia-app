---
name: guia-voz
description: Use when writing or editing HOLENTIA guides in Spanish (tono relajado, sencillo, ejemplos, cercano, sin AI slop) — voz, ritmo, ejemplos, CTAs y checklist antes de publicar.
---

# Voz de las guías HOLENTIA

Esta skill define cómo suenan las guías. El proceso está en `create-guide`; aquí está el tono.

## Lector

Una persona en República Dominicana, probablemente desde el celular, que quiere resolver algo concreto: entender su sueldo, medir su grasa corporal, calcular un aguinaldo. No es experta en finanzas ni en salud. No necesita que la impresionemos. Necesita que le expliquemos bien y que no la tratemos como si fuera tonta.

Escríbele a esa persona, no a un jurado.

## Voz

- **Tuteo directo.** «Tu sueldo», «mira», «haz la cuenta». Nada de «el usuario» ni «usted» distante.
- **Frases cortas y variables.** Alterna frases de una línea con otras más largas. Si todo suena igual, se nota.
- **Lenguaje cotidiano.** «Plata» está bien en un ejemplo; «remuneración bruta» se explica la primera vez. No uses jerga para sonar experto.
- **Ejemplos con números.** RD$40,000, 80 kg, 180 cm, una quincena, un recibo de luz. Lo abstracto se olvida.
- **Límites claros.** «Esto es una estimación», «si tienes una condición médica, habla con un profesional», «las tasas de 2027 todavía no están publicadas». La honestidad también es tono.
- **Cercanía sin paternalismo.** No regañes, no des lecciones morales, no prometas milagros.
- **Humor ligero, nunca a costa del lector.** Un comentario seco está bien; un chiste forzado, no.

## Ritmo y estructura

- Abre con una situación real o una pregunta concreta. No con una definición de diccionario.
- Cada H2 debe resolver una parte del problema. Si un H2 no aporta, sobra.
- Párrafos de 2–4 líneas. Si son más largos, divide.
- Una idea por párrafo. Si hay dos, probablemente son dos párrafos.
- Usa tablas para rangos, tasas y comparaciones. No para esconder texto.
- Cierra con un paso siguiente útil, no con un resumen que repite todo.

## Lo que evitamos

- **Contraste vacío:** «No es solo una calculadora, es una herramienta para...». Di qué hace y ya.
- **Cierre dramático:** «Eso es lo que realmente importa». Si no añade un dato, sobra.
- **Tríadas decorativas:** «claro, simple y poderoso». Elige una.
- **Guiones largos por costumbre.** Un guion puede servir; cinco en un párrafo, no.
- **Negritas en cada línea.** Si todo es importante, nada lo es.
- **Muletillas:** «en el mundo actual», «es importante destacar», «sin lugar a dudas», «en resumen», «en conclusión».
- **Promesas:** «vas a perder grasa», «te vas a ahorrar miles», «garantizado».
- **Falsa experiencia:** «cuando yo tenía 20 años...» si no es cierto. No inventes anécdotas.
- **Relleno:** párrafos que podrían estar en cualquier guía de cualquier tema.

## Ejemplos

### Sueldo neto

**Suena a robot:**
> En el competitivo mundo laboral actual, comprender la diferencia entre el salario bruto y el neto resulta fundamental para una adecuada planificación financiera.

**Suena a persona:**
> Si te ofrecen RD$80,000 brutos, no te están diciendo cuánto te va a llegar. Primero sale la seguridad social y después el ISR. La diferencia puede ser de varios miles de pesos al mes.

**Cierre vacío:**
> En conclusión, el sueldo neto es un concepto clave que todo trabajador debe dominar.

**Cierre útil:**
> Revisa tu volante: si el SFS y la AFP no coinciden con tu salario, pregunta en recursos humanos. Y si quieres ver tu caso con tus números, usa la calculadora.

### Grasa corporal

**Suena a robot:**
> La composición corporal es un indicador multifactorial que trasciende el paradigma del peso corporal tradicional.

**Suena a persona:**
> La balanza te dice cuánto pesas, no de qué estás hecho. Dos personas de 70 kg pueden tener composiciones muy distintas. La grasa corporal ayuda a ver esa diferencia, siempre que la midas con cuidado.

**Cierre vacío:**
> En definitiva, medir tu grasa corporal es una decisión inteligente para tu bienestar integral.

**Cierre útil:**
> Mide siempre a la misma hora y con la misma cinta. Lo que importa es la tendencia de varias semanas, no el número de un martes cualquiera. Si quieres una estimación rápida, usa la calculadora.

## CTAs

El CTA es una recomendación, no un anuncio.

- Mal: «¡No esperes más! ¡Haz clic aquí y transforma tu vida!».
- Bien: «Si quieres ver cómo queda tu salario después de TSS e ISR, usa la calculadora de sueldo neto».
- Mal: «Descubre el secreto que los bancos no quieren que sepas».
- Bien: «Si tu empleador te paga por quincena, revisa cómo se prorratea el ISR en la guía de aguinaldo».

Un CTA contextual va después de explicar el problema. El CTA final va al cierre, con la herramienta principal y una o dos relacionadas.

## Convenciones de español dominicano

- `RD$` para montos; `pesos` cuando el contexto ya está claro.
- `celular`, `computadora`, `navegador`; evitar regionalismos de otros países.
- `tú`, no `vos` ni `usted`.
- `quincena`, `colmo`, `concho` solo si el ejemplo lo pide; no fuerces el slang.
- Fechas: `20 de octubre de 2026`.
- Números: `RD$40,000`; decimales con coma cuando haga falta (`16,1 %`).
- Porcentajes: `15%` sin espacio en tablas; `16,1 %` en prosa si se lee mejor.

## Checklist antes de publicar

- [ ] ¿Se lo diría así a un amigo?
- [ ] ¿Hay al menos un ejemplo concreto con números o una situación real?
- [ ] ¿Cada sección añade algo nuevo?
- [ ] ¿Las fuentes sostienen las afirmaciones?
- [ ] ¿Los límites están claros (estimación, tasas pendientes, no es diagnóstico)?
- [ ] ¿El CTA aparece cuando el lector ya entendió el problema?
- [ ] ¿El cierre da un paso siguiente, no un resumen?
- [ ] ¿Pasé el texto por `humanizer` sin perder datos?
- [ ] ¿Leí en voz alta y cambié lo que sonaba a robot?

## Handoff

1. Borrador con esta voz.
2. Verificación de datos y fuentes.
3. Pase de `humanizer`.
4. Validación con `pnpm guides:check`.
5. Revisión final con `create-guide`.
