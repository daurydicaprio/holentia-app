# Backup local «Mis datos»

Página: `/mis-datos` · Lógica: `lib/data-export.ts` · Componente: `components/mis-datos/data-backup.tsx`.

## Formato

```json
{
  "app": "HOLENTIA",
  "version": 1,
  "exportedAt": "2026-10-24T12:00:00.000Z",
  "keys": {
    "holentia:calculadora-imc:draft:v1": "{\"weight\":\"70\"}"
  }
}
```

- Solo se exportan claves `holentia:*` y la clave legada `holentia-journal-entries`.
- El tema (`theme-preference`) y claves de otros sitios quedan fuera.
- Los valores son los strings crudos de `localStorage`; no se re-serializan.
- Límite de importación: **5 MB** de archivo y de contenido de claves.

## Importación

1. Se lee el archivo en el navegador con `file.text()`.
2. `parseImportPayload` valida app, versión, fecha, claves permitidas y tipos antes de escribir.
3. Se muestra una vista previa con número de claves y fecha de exportación.
4. Al confirmar, `applyImport` reemplaza las claves repetidas y conserva las demás.
5. Si el almacenamiento está lleno o bloqueado, se muestra un error y no se simula éxito.

No se crea ninguna clave nueva, no hay red y el archivo no se sube a ningún servidor.

## Privacidad

El backup puede contener salario, medidas, diarios, hábitos o respuestas de tests. El usuario decide dónde guardarlo. La política de cookies explica el flujo y enlaza a «Borrar mis datos» para eliminar todo.

## Verificación

`tests/data-export.test.mjs` cubre lectura selectiva, round-trip, rechazo de app/versión/claves/tipos, límite de 5 MB y merge sin borrar claves ajenas al backup.
