---
name: tool-persistence
description: Use when adding or changing local persistence in a HOLENTIA tool (guardar datos, borrador autosave, snapshots/simulaciones, localStorage, claves holentia, borrar mis datos, draftKey, simulationsKey) — storage API, D/S/E patterns and privacy-doc checklist.
---

# Persistencia local de herramientas

Local-first: **solo `localStorage` en el navegador, sin backend ni red** (regla de privacidad de oro en `AGENTS.md`). API en `lib/storage.ts`.

## API (`lib/storage.ts`)

```ts
draftKey(slug)        // → `holentia:{slug}:draft:v1`
simulationsKey(slug)  // → `holentia:{slug}:simulations:v1`
storageGet<T>(key, fallback)   // JSON.parse seguro, fallback si falta/corrupto
storageSet(key, value)         // try/catch, devuelve boolean
storageRemove(key)
storageClearAll()              // borra todo con prefijo `holentia:`
```

`typeof window` guard incluido (SSR-safe). Claves con prefijo custom (ej. entradas) se construyen igual: `` `holentia:${slug}:entries:v1` ``.

## Patrones de persistencia (tipo E / D / S)

| Tipo | Cuándo | Cómo | Ejemplo |
|---|---|---|---|
| **E efímero** | Tests de autoevaluación | Sin guardar (o solo último resultado inmediato) | lenguajes-del-amor |
| **D draft** | Formularios/cálculos | Estado en hook; al cambiar inputs → `storageSet` con debounce ~500 ms + badge «Guardado local ✓» | presupuesto, calorías, corte-tarjeta |
| **S snapshots** | Listas guardables (simulaciones, entradas) | Array en `simulationsKey`, máx. 3, acciones Guardar/Eliminar | interés-compuesto, préstamo |

- Restauración: `useState` inicial con `storageGet(...)` dentro de `useEffect` de montaje (o lazy con window guard) para evitar hydration mismatch.
- Reset explícito: `storageRemove` + estado inicial; el reset NO debe romper el draft automático.

## Checklist al añadir persistencia

1. Usar `draftKey`/`simulationsKey` (o helper equivalente) — jamás strings crudos repetidos.
2. Registrar la clave en la tabla de `app/politica-cookies/page.tsx`.
3. Botón global «Borrar mis datos» (`components/common/clear-all-data`) funciona vía `storageClearAll()` — no hace falta nada extra si usas el prefijo `holentia:`.
4. FAQ de la herramienta: respuesta de privacidad mencionando `localStorage` y la clave.
5. Si cambia este proceso, actualizar esta skill + `design.md`/`architecture.md` en el mismo commit.
