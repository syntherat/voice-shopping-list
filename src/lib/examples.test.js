import { describe, expect, it } from 'vitest'
import { EXAMPLES, getExamples } from './examples'
import { INTENTS } from './nlp/intents'
import { parseCommand } from './nlp/parser'

// The hint panel offers these as one-tap commands, so every one of them has to
// survive the parser.
describe('example commands', () => {
  for (const [locale, examples] of Object.entries(EXAMPLES)) {
    describe(locale, () => {
      it.each(examples)('parses %s', (text) => {
        const parsed = parseCommand(text, locale)
        expect(parsed.intent).not.toBe(INTENTS.UNKNOWN)

        if (parsed.intent === INTENTS.CLEAR) return
        if (parsed.intent === INTENTS.SEARCH) {
          expect(parsed.query || parsed.filters.tags.length).toBeTruthy()
          return
        }
        expect(parsed.items.length).toBeGreaterThan(0)
        expect(parsed.items[0].name).not.toBe('')
      })
    })
  }
})

describe('getExamples', () => {
  it('returns the list for a language tag', () => {
    expect(getExamples('hi-IN')).toBe(EXAMPLES.hi)
  })

  it('falls back to english for an unknown tag', () => {
    expect(getExamples('de-DE')).toBe(EXAMPLES.en)
  })
})
