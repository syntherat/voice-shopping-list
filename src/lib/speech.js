export const LANGUAGES = [
  { code: 'en-US', label: 'English (US)', short: 'EN' },
  { code: 'en-IN', label: 'English (India)', short: 'EN-IN' },
  { code: 'hi-IN', label: 'हिन्दी', short: 'HI' },
  { code: 'es-ES', label: 'Español', short: 'ES' },
  { code: 'fr-FR', label: 'Français', short: 'FR' },
]

export const DEFAULT_LANGUAGE = 'en-US'

export function getRecognitionConstructor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function isSpeechSupported() {
  return getRecognitionConstructor() !== null
}

const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access is blocked. Allow it in your browser settings and try again.',
  'service-not-allowed': 'Speech service was denied by the browser. Check your site permissions.',
  'no-speech': "Didn't catch anything. Tap the mic and speak again.",
  'audio-capture': 'No microphone found. Connect one and reload the page.',
  network: 'Could not reach the speech service. Check your connection.',
  'language-not-supported': 'This language is not available for speech input in your browser.',
}

export function describeRecognitionError(code) {
  if (code === 'aborted') return null
  return ERROR_MESSAGES[code] || 'Speech recognition failed. Please try again.'
}
