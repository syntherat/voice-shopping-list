import en from './en'
import es from './es'
import fr from './fr'
import hi from './hi'

const byLengthDesc = (a, b) => b.length - a.length

const mergeLists = (primary = [], fallback = []) =>
  [...new Set([...primary, ...fallback])].sort(byLengthDesc)

const mergeMaps = (primary = {}, fallback = {}) => ({ ...fallback, ...primary })

// Non-English locales inherit the English lexicon as a fallback: people mix
// English product names and verbs into other languages all the time.
function combine(locale, fallback) {
  const intents = {}
  const keys = new Set([...Object.keys(locale.intents), ...Object.keys(fallback.intents || {})])
  for (const key of keys) {
    intents[key] = mergeLists(locale.intents[key], fallback.intents?.[key])
  }

  const priceGroup = (group) => ({
    prefix: mergeLists(locale.priceWords[group]?.prefix, fallback.priceWords?.[group]?.prefix),
    suffix: mergeLists(locale.priceWords[group]?.suffix, fallback.priceWords?.[group]?.suffix),
  })

  return {
    code: locale.code,
    intents,
    numberWords: mergeMaps(locale.numberWords, fallback.numberWords),
    quantityPhrases: mergeMaps(locale.quantityPhrases, fallback.quantityPhrases),
    units: mergeMaps(locale.units, fallback.units),
    tags: mergeMaps(locale.tags, fallback.tags),
    currencyWords: mergeMaps(locale.currencyWords, fallback.currencyWords),
    priceWords: {
      max: priceGroup('max'),
      min: priceGroup('min'),
      between: mergeLists(locale.priceWords.between, fallback.priceWords?.between),
    },
    rangeJoiners: mergeLists(locale.rangeJoiners, fallback.rangeJoiners),
    updateSeparators: mergeLists(locale.updateSeparators, fallback.updateSeparators),
    conjunctions: mergeLists(locale.conjunctions, fallback.conjunctions),
    connectors: mergeLists(locale.connectors, fallback.connectors),
    listPhrases: mergeLists(locale.listPhrases, fallback.listPhrases),
    fillers: mergeLists(locale.fillers, fallback.fillers),
    stopwords: mergeLists(locale.stopwords, fallback.stopwords),
  }
}

const EMPTY = { intents: {}, priceWords: {} }

const LOCALES = {
  en: combine(en, EMPTY),
  hi: combine(hi, en),
  es: combine(es, en),
  fr: combine(fr, en),
}

export function resolveLocale(tag = 'en-US') {
  const base = String(tag).toLowerCase().split('-')[0]
  return LOCALES[base] || LOCALES.en
}

export const SUPPORTED_LOCALES = Object.keys(LOCALES)
