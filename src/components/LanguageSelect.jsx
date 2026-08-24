import { LANGUAGES } from '../lib/speech'

export default function LanguageSelect({ value, onChange, disabled }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Recognition language</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-emerald-500 disabled:opacity-40"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  )
}
