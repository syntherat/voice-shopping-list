import { Check, Minus, Plus, Trash2 } from 'lucide-react'

export default function ItemRow({ item, onToggle, onStep, onRemove }) {
  return (
    <li className="group flex items-center gap-3 py-2.5">
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        role="checkbox"
        aria-checked={item.checked}
        aria-label={`Mark ${item.name} as ${item.checked ? 'not bought' : 'bought'}`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          item.checked
            ? 'border-emerald-500 bg-emerald-500 text-neutral-950'
            : 'border-neutral-600 hover:border-neutral-400'
        }`}
      >
        {item.checked && <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden="true" />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[15px] transition-colors ${
            item.checked ? 'text-neutral-600 line-through' : 'text-neutral-100'
          }`}
        >
          {item.name}
        </p>
        {item.unit && <p className="text-xs text-neutral-500">{item.unit}</p>}
      </div>

      <div className="flex items-center gap-0.5 rounded-lg bg-neutral-800/60 p-0.5">
        <button
          type="button"
          onClick={() => onStep(item.id, -1)}
          aria-label={`Decrease ${item.name}`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-100"
        >
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <span className="min-w-6 text-center text-sm tabular-nums text-neutral-200">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onStep(item.id, 1)}
          aria-label={`Increase ${item.name}`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-100"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
        className="shrink-0 rounded-md p-1.5 text-neutral-700 transition-colors hover:bg-rose-500/10 hover:text-rose-400 focus-visible:text-rose-400 group-hover:text-neutral-500"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  )
}
