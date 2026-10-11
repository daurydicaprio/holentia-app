"use client"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f8f9fa", color: "#212529" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.5rem" }}>Algo salió mal</h1>
          <p style={{ maxWidth: "28rem", color: "#495057", marginBottom: "1.5rem" }}>
            Ocurrió un error inesperado en HOLENTIA. Puedes intentar de nuevo.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "0.375rem",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  )
}
