import { ArrowUp } from 'lucide-react'
import { useState } from 'react'

export default function ManualInput({ onSubmit }) {
  const [value, setValue] = useState('')
  const empty = value.trim().length === 0

  const handleSubmit = (event) => {
    event.preventDefault()
    if (empty) return
    onSubmit(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Or type a command"
        aria-label="Type a command"
        className="w-full rounded-xl border border-border-subtle bg-surface-raised py-2.5 pl-4 pr-12 text-sm text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-emerald-500"
      />
      <button
        type="submit"
        disabled={empty}
        aria-label="Send command"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-neutral-100 disabled:opacity-40 disabled:hover:bg-neutral-800"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}
