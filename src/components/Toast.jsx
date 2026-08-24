import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import { useEffect } from 'react'

const TONES = {
  success: { style: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200', icon: CircleCheck },
  error: { style: 'border-rose-500/30 bg-rose-500/10 text-rose-200', icon: CircleAlert },
  info: { style: 'border-neutral-700 bg-neutral-800/80 text-neutral-300', icon: Info },
}

export default function Toast({ feedback, onDismiss }) {
  useEffect(() => {
    if (!feedback) return undefined
    const timer = setTimeout(onDismiss, 2600)
    return () => clearTimeout(timer)
  }, [feedback, onDismiss])

  if (!feedback) return null

  const { style, icon: Icon } = TONES[feedback.tone] || TONES.info

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm ${style}`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1">{feedback.message}</p>
    </div>
  )
}
