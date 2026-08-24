import { useCallback, useEffect, useRef, useState } from 'react'
import {
  describeRecognitionError,
  getRecognitionConstructor,
  isSpeechSupported,
} from '../lib/speech'

export function useSpeechRecognition({ lang, onResult }) {
  const [supported] = useState(isSpeechSupported)
  const [listening, setListening] = useState(false)
  const [starting, setStarting] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  const activeRef = useRef(false)
  const onResultRef = useRef(onResult)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => () => recognitionRef.current?.abort(), [])

  const start = useCallback(() => {
    if (!supported || activeRef.current) return

    const Recognition = getRecognitionConstructor()
    const recognition = new Recognition()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setError(null)
      setStarting(false)
      setListening(true)
    }

    recognition.onresult = (event) => {
      let pending = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        const text = result[0].transcript.trim()
        if (result.isFinal) {
          if (text) onResultRef.current?.(text, result[0].confidence)
        } else {
          pending += result[0].transcript
        }
      }
      setInterim(pending)
    }

    recognition.onerror = (event) => {
      const message = describeRecognitionError(event.error)
      if (message) setError(message)
    }

    // Fires on both a clean finish and an error, so all teardown lives here.
    recognition.onend = () => {
      activeRef.current = false
      recognitionRef.current = null
      setStarting(false)
      setListening(false)
      setInterim('')
    }

    try {
      // The engine takes a moment to come up, and the browser may still be
      // asking for permission, so the button shows a starting state.
      setStarting(true)
      recognition.start()
      activeRef.current = true
      recognitionRef.current = recognition
    } catch {
      setStarting(false)
      setError('Could not start the microphone. Try again.')
    }
  }, [lang, supported])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const toggle = useCallback(() => {
    if (activeRef.current) stop()
    else start()
  }, [start, stop])

  const clearError = useCallback(() => setError(null), [])

  const status = listening ? 'listening' : starting ? 'starting' : 'idle'

  return { supported, status, listening, interim, error, start, stop, toggle, clearError }
}
