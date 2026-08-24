import { Lightbulb } from 'lucide-react'
import { getExamples } from '../lib/examples'
import SectionHeading from './SectionHeading'

export default function CommandHints({ language, onPick }) {
  const examples = getExamples(language)

  return (
    <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface-raised p-4">
      <SectionHeading icon={Lightbulb}>Try saying</SectionHeading>

      <ul className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <li key={example}>
            <button
              type="button"
              onClick={() => onPick(example)}
              className="rounded-lg border border-border-subtle px-2.5 py-1.5 text-left text-sm text-neutral-400 transition-colors hover:border-neutral-600 hover:bg-neutral-800/50 hover:text-neutral-200"
            >
              {example}
            </button>
          </li>
        ))}
      </ul>

      <p className="text-xs text-neutral-600">Tap one to run it, or say it out loud.</p>
    </section>
  )
}
