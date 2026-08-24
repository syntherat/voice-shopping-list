import { CircleHelp, Volume2, VolumeX } from 'lucide-react'
import LanguageSelect from './LanguageSelect'

function IconButton({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
        active
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-border-subtle text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
      }`}
    >
      {children}
    </button>
  )
}

export default function HeaderControls({
  language,
  onLanguageChange,
  languageDisabled,
  speechEnabled,
  onToggleSpeech,
  speechSupported,
  hintsOpen,
  onToggleHints,
}) {
  return (
    <div className="flex items-center gap-2">
      <IconButton label="Show example commands" active={hintsOpen} onClick={onToggleHints}>
        <CircleHelp className="h-4 w-4" aria-hidden="true" />
      </IconButton>

      {speechSupported && (
        <IconButton
          label={speechEnabled ? 'Turn spoken replies off' : 'Turn spoken replies on'}
          active={speechEnabled}
          onClick={onToggleSpeech}
        >
          {speechEnabled ? (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          )}
        </IconButton>
      )}

      <LanguageSelect value={language} onChange={onLanguageChange} disabled={languageDisabled} />
    </div>
  )
}
