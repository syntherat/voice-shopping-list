import { Loader2, Mic, Square } from 'lucide-react'

const LABELS = {
  idle: 'Tap to speak',
  starting: 'Starting microphone…',
  listening: 'Listening — tap to stop',
}

function Glyph({ status }) {
  if (status === 'starting') return <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
  if (status === 'listening') return <Square className="h-6 w-6 fill-current" aria-hidden="true" />
  return <Mic className="h-7 w-7" aria-hidden="true" />
}

export default function MicButton({ status, disabled, onClick }) {
  const listening = status === 'listening'

  return (
    <div className="relative flex flex-col items-center gap-3">
      {listening && (
        <span className="absolute top-0 h-20 w-20 animate-ping rounded-full bg-emerald-500/30" />
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={listening ? 'Stop listening' : 'Start listening'}
        aria-pressed={listening}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
          listening
            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40'
            : 'bg-emerald-600 hover:bg-emerald-500'
        }`}
      >
        <Glyph status={status} />
      </button>
      <p className="text-xs text-neutral-500">{disabled ? 'Voice unavailable' : LABELS[status]}</p>
    </div>
  )
}
