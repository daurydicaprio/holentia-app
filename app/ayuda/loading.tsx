export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 lg:p-12 animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="flex justify-center mb-12">
          <div className="h-16 w-48 rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="text-center mb-12 space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="mx-auto h-10 w-72 max-w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="mx-auto h-5 w-56 rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-3xl p-8 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="h-11 w-11 rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="h-7 w-48 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-6 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
