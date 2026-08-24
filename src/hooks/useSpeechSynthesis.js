import { useCallback, useEffect, useState } from 'react'

const isSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function useSpeechSynthesis({ lang, enabled }) {
  const [supported] = useState(isSupported)

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
  }, [supported])

  useEffect(() => cancel, [cancel])

  const speak = useCallback(
    (text) => {
      if (!supported || !enabled || !text) return
      // Replaces anything still being spoken so confirmations cannot queue up.
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    },
    [enabled, lang, supported],
  )

  return { supported, speak, cancel }
}
