import { TriangleAlert, X } from 'lucide-react'

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-0.5 text-red-300/70 transition-colors hover:bg-red-500/10 hover:text-red-200"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
