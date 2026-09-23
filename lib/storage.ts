"use client"

// Almacén local-first de Holentia.
// Todo vive en el navegador del usuario bajo claves `holentia:*`.
// Sin backend, sin tracking, sin envíos de red.

const PREFIX = "holentia:"

export function draftKey(slug: string): string {
  return `${PREFIX}${slug}:draft:v1`
}

export function simulationsKey(slug: string): string {
  return `${PREFIX}${slug}:simulations:v1`
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

/** Lee JSON de forma segura. Devuelve `fallback` si no existe o está corrupto. */
export function storageGet<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/**
 * Guarda JSON de forma segura.
 * Devuelve `false` si el almacenamiento está lleno o bloqueado (modo privado).
 */
export function storageSet(key: string, value: unknown): boolean {
  if (!canUseStorage()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function storageRemove(key: string): void {
  if (!canUseStorage()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignorar: no hay nada que el usuario pueda hacer
  }
}

/** Borra TODOS los datos de Holentia en este navegador. */
export function storageClearAll(): void {
  if (!canUseStorage()) return
  try {
    const doomed: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && key.startsWith(PREFIX)) doomed.push(key)
    }
    // Clave legada del diario (v0, sin namespacing)
    if (window.localStorage.getItem("holentia-journal-entries")) {
      doomed.push("holentia-journal-entries")
    }
    doomed.forEach((key) => window.localStorage.removeItem(key))
  } catch {
    // ignorar
  }
}
