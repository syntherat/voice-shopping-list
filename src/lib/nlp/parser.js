import { INTENTS, INTENT_ORDER } from './intents'
import { resolveLocale } from './locales'

const CURRENCY_SYMBOLS = { $: 'USD', '₹': 'INR', '€': 'EUR', '£': 'GBP' }
const DEVANAGARI_DIGITS = '०१२३४५६७८९'
const AMOUNT = '(?:([$₹€£])\\s*)?(\\d+(?:\\.\\d+)?)'

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const alternation = (phrases) => phrases.map(escapeRegExp).join('|')

export function normalize(text) {
  if (typeof text !== 'string') return ''
  return text
    .toLowerCase()
    .replace(/['’‘]/g, '')
    .replace(/[०-९]/g, (digit) => String(DEVANAGARI_DIGITS.indexOf(digit)))
    // \p{M} keeps Devanagari vowel signs attached to their consonant.
    .replace(/[^\p{L}\p{M}\p{N}\s,.$₹€£]/gu, ' ')
    // A dot survives only between digits, so "$5.50." keeps the decimal point.
    .replace(/(?<!\d)\.|\.(?!\d)/g, ' ')
    .replace(/(\d)(\p{L})/gu, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

function phraseRegExp(phrase, flags = 'u') {
  return new RegExp('(^|\\s)' + escapeRegExp(phrase) + '(?=\\s|,|$)', flags)
}

function stripPhrase(text, phrase) {
  if (!phraseRegExp(phrase).test(text)) return null
  return text.replace(phraseRegExp(phrase, 'gu'), '$1').replace(/\s+/g, ' ').trim()
}

function stripAll(text, phrases) {
  let out = text
  for (const phrase of phrases) {
    out = out.replace(phraseRegExp(phrase, 'gu'), '$1')
  }
  return out.replace(/\s+/g, ' ').trim()
}

function matchIntent(text, locale) {
  for (const intent of INTENT_ORDER) {
    for (const phrase of locale.intents[intent] || []) {
      const rest = stripPhrase(text, phrase)
      if (rest !== null) return { intent, rest }
    }
  }
  return null
}

function splitSegments(text, locale) {
  if (!locale.conjunctions.length) {
    return text.split(',').map((part) => part.trim()).filter(Boolean)
  }
  const pattern = new RegExp('\\s*,\\s*|\\s+(?:' + alternation(locale.conjunctions) + ')\\s+', 'u')
  return text.split(pattern).map((part) => part.trim()).filter(Boolean)
}

function cleanName(text, locale) {
  const tokens = text.split(' ').filter(Boolean)
  const isNoise = (token) => locale.stopwords.includes(token) || locale.connectors.includes(token)
  while (tokens.length && isNoise(tokens[0])) tokens.shift()
  while (tokens.length && isNoise(tokens[tokens.length - 1])) tokens.pop()
  return tokens.join(' ')
}

function extractQuantityAndUnit(segment, locale) {
  const tokens = segment.split(' ').filter(Boolean)
  let quantity = null
  let unit = null
  let index = -1
  let consumed = 0

  for (let i = 0; i < tokens.length && index === -1; i += 1) {
    for (let size = 3; size >= 2; size -= 1) {
      const phrase = tokens.slice(i, i + size).join(' ')
      const match = locale.quantityPhrases[phrase]
      if (match) {
        quantity = match.quantity
        unit = match.unit || null
        index = i
        consumed = size
        break
      }
    }
    if (index !== -1) break

    const token = tokens[i]
    if (/^\d+(?:\.\d+)?$/.test(token)) {
      quantity = Number.parseFloat(token)
    } else if (locale.numberWords[token] != null) {
      quantity = locale.numberWords[token]
    } else {
      continue
    }
    index = i
    consumed = 1
  }

  if (index === -1) return { quantity: null, unit: null, rest: segment }

  const before = tokens.slice(0, index)
  const after = tokens.slice(index + consumed)

  if (!unit && after.length && locale.units[after[0]]) {
    unit = locale.units[after[0]]
    after.shift()
  }
  if (after.length && locale.connectors.includes(after[0])) after.shift()

  return { quantity, unit, rest: [...before, ...after].join(' ').trim() }
}

function extractPriceFilters(text, locale) {
  const result = { minPrice: null, maxPrice: null, currency: null, rest: text }

  const setCurrency = (symbol, word) => {
    if (result.currency) return
    if (symbol) result.currency = CURRENCY_SYMBOLS[symbol] || null
    else if (word) result.currency = locale.currencyWords[word] || null
  }

  // Only a currency word gets swallowed with the amount, so "under 5 apples"
  // keeps "apples" in the query.
  const keepTrailing = (word) => (word && !locale.currencyWords[word] ? ' ' + word + ' ' : ' ')

  const applyBound = (phrases, position, assign) => {
    if (!phrases.length) return
    const source =
      position === 'prefix'
        ? '(^|\\s)(?:' + alternation(phrases) + ')\\s*' + AMOUNT + '(?:\\s+([\\p{L}\\p{M}]+))?'
        : '(^|\\s)' + AMOUNT + '(?:\\s+([\\p{L}\\p{M}]+))?\\s+(?:' + alternation(phrases) + ')'
    result.rest = result.rest.replace(
      new RegExp(source, 'u'),
      (full, lead, symbol, value, word) => {
        assign(Number.parseFloat(value))
        setCurrency(symbol, word)
        return lead + keepTrailing(word)
      },
    )
  }

  if (locale.priceWords.between.length && locale.rangeJoiners.length) {
    const source =
      '(^|\\s)(?:' + alternation(locale.priceWords.between) + ')\\s*' + AMOUNT +
      '(?:\\s+([\\p{L}\\p{M}]+))?\\s*(?:' + alternation(locale.rangeJoiners) + ')\\s*' + AMOUNT +
      '(?:\\s+([\\p{L}\\p{M}]+))?'
    result.rest = result.rest.replace(
      new RegExp(source, 'u'),
      (full, lead, lowSymbol, low, lowWord, highSymbol, high, highWord) => {
        result.minPrice = Number.parseFloat(low)
        result.maxPrice = Number.parseFloat(high)
        setCurrency(lowSymbol || highSymbol, lowWord || highWord)
        return lead + keepTrailing(highWord)
      },
    )
  }

  if (result.maxPrice === null) {
    applyBound(locale.priceWords.max.prefix, 'prefix', (value) => { result.maxPrice = value })
  }
  if (result.maxPrice === null) {
    applyBound(locale.priceWords.max.suffix, 'suffix', (value) => { result.maxPrice = value })
  }
  if (result.minPrice === null) {
    applyBound(locale.priceWords.min.prefix, 'prefix', (value) => { result.minPrice = value })
  }
  if (result.minPrice === null) {
    applyBound(locale.priceWords.min.suffix, 'suffix', (value) => { result.minPrice = value })
  }

  result.rest = result.rest.replace(/\s+/g, ' ').trim()
  return result
}

function extractTags(text, locale) {
  const tags = []
  let rest = text
  const phrases = Object.keys(locale.tags).sort((a, b) => b.length - a.length)
  for (const phrase of phrases) {
    if (!phraseRegExp(phrase).test(rest)) continue
    tags.push(locale.tags[phrase])
    rest = rest.replace(phraseRegExp(phrase, 'gu'), '$1')
  }
  return { tags: [...new Set(tags)], rest: rest.replace(/\s+/g, ' ').trim() }
}

function buildItems(segments, locale) {
  const items = []
  for (const segment of segments) {
    const { quantity, unit, rest } = extractQuantityAndUnit(segment, locale)
    const name = cleanName(rest, locale)
    if (!name) continue
    items.push({ name, quantity: quantity == null ? 1 : quantity, unit })
  }
  return items
}

function buildUpdate(rest, locale) {
  for (const separator of locale.updateSeparators) {
    const match = rest.match(new RegExp('^(.*)\\s' + escapeRegExp(separator) + '\\s(.+)$', 'u'))
    if (!match) continue
    const { quantity, unit } = extractQuantityAndUnit(match[2], locale)
    if (quantity == null) continue
    return [{ name: cleanName(match[1], locale), quantity, unit }]
  }

  const { quantity, unit, rest: remainder } = extractQuantityAndUnit(rest, locale)
  if (quantity == null) return []
  return [{ name: cleanName(remainder, locale), quantity, unit }]
}

export function parseCommand(input, localeTag = 'en-US') {
  const locale = resolveLocale(localeTag)
  const raw = typeof input === 'string' ? input : ''
  const normalized = normalize(raw)

  const result = {
    intent: INTENTS.UNKNOWN,
    items: [],
    query: null,
    filters: { minPrice: null, maxPrice: null, currency: null, tags: [] },
    confidence: 0,
    locale: locale.code,
    raw,
    normalized,
  }

  if (!normalized) return result

  const match = matchIntent(normalized, locale)
  const intent = match ? match.intent : INTENTS.ADD
  const explicit = Boolean(match)

  let rest = match ? match.rest : normalized
  rest = stripAll(rest, locale.fillers)
  rest = stripAll(rest, locale.listPhrases)

  if (intent === INTENTS.CLEAR) {
    return { ...result, intent, confidence: 0.95 }
  }

  if (intent === INTENTS.SEARCH) {
    const priced = extractPriceFilters(rest, locale)
    const tagged = extractTags(priced.rest, locale)
    const query = cleanName(tagged.rest, locale)
    return {
      ...result,
      intent,
      query,
      filters: {
        minPrice: priced.minPrice,
        maxPrice: priced.maxPrice,
        currency: priced.currency,
        tags: tagged.tags,
      },
      confidence: query || tagged.tags.length ? 0.9 : 0.35,
    }
  }

  if (intent === INTENTS.UPDATE_QUANTITY) {
    const items = buildUpdate(rest, locale)
    return { ...result, intent, items, confidence: items.length ? 0.9 : 0.3 }
  }

  const items = buildItems(splitSegments(rest, locale), locale)
  let confidence = explicit ? 0.9 : 0.5
  if (!items.length) confidence = 0.25

  return { ...result, intent, items, confidence }
}

export { INTENTS }
