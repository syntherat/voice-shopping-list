import { MicOff } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CommandHints from './components/CommandHints'
import ErrorBanner from './components/ErrorBanner'
import HeaderControls from './components/HeaderControls'
import ManualInput from './components/ManualInput'
import MicButton from './components/MicButton'
import SearchResults from './components/SearchResults'
import ShoppingList from './components/ShoppingList'
import Suggestions from './components/Suggestions'
import Toast from './components/Toast'
import TranscriptPanel from './components/TranscriptPanel'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { effectivePrice, hasSearchCriteria, loadCatalog, searchCatalog } from './lib/catalog'
import { INTENTS } from './lib/nlp/intents'
import { parseCommands } from './lib/nlp/parser'
import { DEFAULT_LANGUAGE } from './lib/speech'
import { getSuggestions } from './lib/suggestions'
import { useShoppingList } from './store/useShoppingList'

const LANGUAGE_KEY = 'vsl.language'
const SPEECH_KEY = 'vsl.speech'

function describeResults({ results, error }) {
  if (error) return error
  if (!results.length) return 'No products matched that search'
  const [top] = results
  const count = `${results.length} ${results.length === 1 ? 'product' : 'products'}`
  return `Found ${count}. ${top.name} from ${top.brand}, ${effectivePrice(top).toFixed(2)} dollars`
}

export default function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE,
  )
  const [speechEnabled, setSpeechEnabled] = useState(
    () => localStorage.getItem(SPEECH_KEY) === 'on',
  )
  const [hintsOpen, setHintsOpen] = useState(false)
  const [lastCommand, setLastCommand] = useState(null)
  const [dismissed, setDismissed] = useState([])
  const [search, setSearch] = useState(null)
  const [catalog, setCatalog] = useState(null)
  const [state, dispatch] = useShoppingList()
  const searchToken = useRef(0)

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(SPEECH_KEY, speechEnabled ? 'on' : 'off')
  }, [speechEnabled])

  useEffect(() => {
    let active = true
    // Only powers the on-sale suggestions; a failure here is silent because
    // search reports its own catalog errors.
    loadCatalog()
      .then((data) => active && setCatalog(data))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const runSearch = useCallback(
    (parsed) => {
      if (!hasSearchCriteria(parsed)) {
        dispatch({ type: 'notify', tone: 'error', message: 'What are you looking for?' })
        return
      }

      const token = searchToken.current + 1
      searchToken.current = token
      setSearch({
        query: parsed.query,
        filters: parsed.filters,
        loading: true,
        results: [],
        error: null,
      })

      loadCatalog()
        .then((data) => {
          if (searchToken.current !== token) return
          setSearch((current) => ({
            ...current,
            loading: false,
            results: searchCatalog(data, parsed),
          }))
        })
        .catch(() => {
          if (searchToken.current !== token) return
          setSearch((current) => ({
            ...current,
            loading: false,
            error: 'Could not load the product catalogue. Check your connection.',
          }))
        })
    },
    [dispatch],
  )

  const handleCommand = useCallback(
    (text) => {
      const commands = parseCommands(text, language)
      setLastCommand({ text, commands })

      const searching = commands.find((command) => command.intent === INTENTS.SEARCH)
      const listChanges = commands.filter((command) => command.intent !== INTENTS.SEARCH)

      if (listChanges.length) dispatch({ type: 'commands', commands: listChanges })
      if (searching) runSearch(searching)
      else setSearch(null)
    },
    [dispatch, language, runSearch],
  )

  const { supported, status, listening, interim, error, toggle, clearError } =
    useSpeechRecognition({ lang: language, onResult: handleCommand })

  const { supported: speechSupported, speak, cancel } = useSpeechSynthesis({
    lang: language,
    enabled: speechEnabled,
  })

  // Never talk over the microphone, or the reply feeds straight back in.
  useEffect(() => {
    if (listening) cancel()
  }, [listening, cancel])

  useEffect(() => {
    if (state.feedback) speak(state.feedback.message)
  }, [state.feedback, speak])

  useEffect(() => {
    if (!search || search.loading) return
    speak(describeResults(search))
  }, [search, speak])

  const suggestions = useMemo(
    () => getSuggestions({ items: state.items, history: state.history, dismissed, catalog }),
    [state.items, state.history, dismissed, catalog],
  )

  const addByName = useCallback(
    (name) => {
      dispatch({
        type: 'command',
        command: { intent: INTENTS.ADD, items: [{ name, quantity: 1, unit: null }] },
      })
    },
    [dispatch],
  )

  const dismissSuggestion = useCallback((name) => {
    setDismissed((current) => [...current, name])
  }, [])

  const toggleSpeech = useCallback(() => setSpeechEnabled((current) => !current), [])
  const toggleHints = useCallback(() => setHintsOpen((current) => !current), [])
  const closeSearch = useCallback(() => setSearch(null), [])
  const dismissFeedback = useCallback(() => dispatch({ type: 'dismissFeedback' }), [dispatch])
  const handleToggle = useCallback((id) => dispatch({ type: 'toggle', id }), [dispatch])
  const handleRemove = useCallback((id) => dispatch({ type: 'remove', id }), [dispatch])
  const handleStep = useCallback((id, delta) => dispatch({ type: 'step', id, delta }), [dispatch])

  const showHints = hintsOpen || (!state.items.length && !search)

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 pt-8">
      <header className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-neutral-100">
          Voice Shopping List
        </h1>
        <HeaderControls
          language={language}
          onLanguageChange={setLanguage}
          languageDisabled={!supported}
          speechEnabled={speechEnabled}
          onToggleSpeech={toggleSpeech}
          speechSupported={speechSupported}
          hintsOpen={hintsOpen}
          onToggleHints={toggleHints}
        />
      </header>

      <div className="flex-1 space-y-4 pb-4">
        {!supported && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <MicOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Voice input needs Chrome, Edge or Safari. You can still type commands below.</p>
          </div>
        )}

        <ErrorBanner message={error} onDismiss={clearError} />
        <Toast feedback={state.feedback} onDismiss={dismissFeedback} />

        <TranscriptPanel
          listening={listening}
          interim={interim}
          lastCommand={lastCommand?.text}
        />

        <SearchResults search={search} onAdd={addByName} onClose={closeSearch} />

        <Suggestions
          suggestions={suggestions}
          onAdd={addByName}
          onDismiss={dismissSuggestion}
        />

        {showHints && <CommandHints language={language} onPick={handleCommand} />}

        <ShoppingList
          items={state.items}
          onToggle={handleToggle}
          onStep={handleStep}
          onRemove={handleRemove}
        />
      </div>

      <div className="sticky bottom-0 space-y-5 bg-surface/95 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur">
        <ManualInput onSubmit={handleCommand} />
        <div className="flex justify-center">
          <MicButton status={status} disabled={!supported} onClick={toggle} />
        </div>
      </div>
    </div>
  )
}
