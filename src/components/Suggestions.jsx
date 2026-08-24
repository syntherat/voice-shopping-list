import { ArrowLeftRight, CalendarDays, Repeat, Sparkles, Tag, X } from 'lucide-react'
import SectionHeading from './SectionHeading'

const SOURCE_ICONS = {
  history: Repeat,
  substitute: ArrowLeftRight,
  deal: Tag,
  seasonal: CalendarDays,
}

// The icon carries where a suggestion came from, so the reason line does not
// have to repeat it.
const SOURCE_TONES = {
  history: 'text-emerald-400',
  substitute: 'text-sky-400',
  deal: 'text-amber-400',
  seasonal: 'text-violet-400',
}

export default function Suggestions({ suggestions, onAdd, onDismiss }) {
  if (!suggestions.length) return null

  return (
    <section className="space-y-2">
      <SectionHeading icon={Sparkles}>Suggestions</SectionHeading>

      <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {suggestions.map((suggestion) => {
          const Icon = SOURCE_ICONS[suggestion.source] || Sparkles
          return (
            <li key={suggestion.key} className="shrink-0">
              <div className="flex items-stretch overflow-hidden rounded-xl border border-border-subtle bg-surface-raised transition-colors hover:border-neutral-700">
                <button
                  type="button"
                  onClick={() => onAdd(suggestion.name)}
                  aria-label={`Add ${suggestion.name}`}
                  className="flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-neutral-800"
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${SOURCE_TONES[suggestion.source] || 'text-neutral-500'}`}
                    aria-hidden="true"
                  />
                  <span className="block">
                    <span className="block text-sm text-neutral-100">{suggestion.name}</span>
                    <span className="block text-xs text-neutral-500">{suggestion.reason}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDismiss(suggestion.name)}
                  aria-label={`Dismiss ${suggestion.name}`}
                  className="flex items-center border-l border-border-subtle px-2 text-neutral-600 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
