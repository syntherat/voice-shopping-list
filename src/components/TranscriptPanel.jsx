import { Mic } from 'lucide-react'

export default function TranscriptPanel({ listening, interim, lastCommand }) {
  const showInterim = listening && interim.length > 0

  return (
    <div
      className={`min-h-28 rounded-2xl border bg-surface-raised p-4 transition-colors ${
        listening ? 'border-emerald-500/40' : 'border-border-subtle'
      }`}
    >
      {showInterim ? (
        <p className="text-lg leading-relaxed text-neutral-300">
          {interim}
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-emerald-400 align-middle" />
        </p>
      ) : lastCommand ? (
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Heard</p>
          <p className="text-lg leading-relaxed text-neutral-100">{lastCommand}</p>
        </div>
      ) : listening ? (
        <div className="flex items-center gap-2 text-sm text-emerald-300">
          <Mic className="h-4 w-4 animate-pulse" aria-hidden="true" />
          Listening…
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-neutral-500">
          Say something like &ldquo;add two bottles of milk&rdquo; or &ldquo;remove bread from my
          list&rdquo;.
        </p>
      )}
    </div>
  )
}
