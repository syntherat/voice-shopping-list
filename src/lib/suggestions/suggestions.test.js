import { describe, expect, it } from 'vitest'
import { getSuggestions } from './index'
import { getSeasonalProduce } from './seasonal'
import { suggestSubstitutes } from './substitutes'

const DAY = 24 * 60 * 60 * 1000
const NOW = new Date('2026-08-24T12:00:00Z').getTime()

const daysAgo = (days) => NOW - days * DAY
const purchase = (name, days) => ({ name, quantity: 1, unit: null, category: 'other', at: daysAgo(days) })
const item = (name) => ({ id: name, name, quantity: 1, unit: null, category: 'other', checked: false })
const names = (suggestions) => suggestions.map((suggestion) => suggestion.name)

describe('history suggestions', () => {
  it('suggests a repeat purchase that is due', () => {
    const history = [purchase('milk', 21), purchase('milk', 14), purchase('milk', 7)]
    const [suggestion] = getSuggestions({ history, now: NOW })
    expect(suggestion).toMatchObject({ name: 'milk', source: 'history' })
    expect(suggestion.reason).toBe('Usually every 7 days')
  })

  it('stays quiet while a repeat purchase is not due yet', () => {
    const history = [purchase('milk', 16), purchase('milk', 2)]
    expect(names(getSuggestions({ history, now: NOW }))).not.toContain('milk')
  })

  it('counts one shopping trip even when added several times that day', () => {
    const history = [purchase('milk', 0.1), purchase('milk', 0.2), purchase('milk', 0.3)]
    expect(names(getSuggestions({ history, now: NOW }))).not.toContain('milk')
  })

  it('falls back to a weak suggestion after a single purchase', () => {
    const [suggestion] = getSuggestions({ history: [purchase('rice', 10)], now: NOW })
    expect(suggestion).toMatchObject({ name: 'rice', reason: 'Bought before' })
  })

  it('never suggests something already on the list', () => {
    const history = [purchase('milk', 7), purchase('milk', 21)]
    const suggestions = getSuggestions({ items: [item('milk')], history, now: NOW })
    expect(names(suggestions)).not.toContain('milk')
  })

  it('matches the list entry across a plural difference', () => {
    const history = [purchase('apples', 7), purchase('apples', 21)]
    const suggestions = getSuggestions({ items: [item('apple')], history, now: NOW })
    expect(names(suggestions)).not.toContain('apples')
  })
})

describe('substitutes', () => {
  it('offers an alternative to a listed item', () => {
    const suggestions = suggestSubstitutes([item('milk')], { exclude: new Set() })
    expect(suggestions[0]).toMatchObject({ name: 'almond milk', reason: 'Instead of milk' })
  })

  it('reads the head noun of a longer name', () => {
    const suggestions = suggestSubstitutes([item('whole milk')], { exclude: new Set() })
    expect(suggestions[0].name).toBe('almond milk')
  })

  it('skips an alternative that is already on the list', () => {
    const suggestions = suggestSubstitutes([item('milk'), item('almond milk')], {
      exclude: new Set(['milk', 'almond milk']),
    })
    expect(names(suggestions)).toContain('oat milk')
  })

  it('returns nothing for an item with no known alternative', () => {
    expect(suggestSubstitutes([item('sparkplug')], { exclude: new Set() })).toEqual([])
  })
})

describe('seasonal suggestions', () => {
  it('picks the produce for the current month', () => {
    expect(getSeasonalProduce(NOW)).toContain('plums')
  })

  it('offers seasonal produce when there is no history', () => {
    const suggestions = getSuggestions({ now: NOW })
    expect(suggestions.every((suggestion) => suggestion.source === 'seasonal')).toBe(true)
    expect(names(suggestions)).toContain('peaches')
  })
})

describe('deal suggestions', () => {
  const catalog = [
    { id: 'a', name: 'coffee beans', brand: 'X', size: '1 kg', price: 10, salePrice: 5, category: 'beverages', tags: [] },
    { id: 'b', name: 'cookies', brand: 'X', size: '300 g', price: 4, salePrice: 3.6, category: 'snacks', tags: [] },
    { id: 'c', name: 'salt', brand: 'X', size: '1 kg', price: 2, category: 'pantry', tags: [] },
  ]

  it('offers only discounted products', () => {
    const suggestions = getSuggestions({ catalog, now: NOW })
    const deals = suggestions.filter((suggestion) => suggestion.source === 'deal')
    expect(names(deals)).toEqual(['coffee beans', 'cookies'])
  })

  it('shows the sale price in the reason', () => {
    const [deal] = getSuggestions({ catalog, now: NOW }).filter((s) => s.source === 'deal')
    expect(deal.reason).toBe('On sale · $5.00')
  })

  it('ranks a deal higher when the user has bought it before', () => {
    const history = [purchase('cookies', 1)]
    const suggestions = getSuggestions({ catalog, history, now: NOW })
    expect(suggestions[0].name).toBe('cookies')
  })

  it('skips a deal already on the list', () => {
    const suggestions = getSuggestions({ catalog, items: [item('coffee beans')], now: NOW })
    expect(names(suggestions)).not.toContain('coffee beans')
  })
})

describe('ranking', () => {
  it('puts a due repeat above a seasonal pick', () => {
    const history = [purchase('milk', 42), purchase('milk', 28), purchase('milk', 14)]
    expect(getSuggestions({ history, now: NOW })[0].name).toBe('milk')
  })

  it('drops anything the user dismissed', () => {
    const suggestions = getSuggestions({ dismissed: ['peaches'], now: NOW })
    expect(names(suggestions)).not.toContain('peaches')
  })

  it('lists each product once', () => {
    const history = [purchase('peaches', 7), purchase('peaches', 21)]
    const suggestions = getSuggestions({ history, now: NOW })
    expect(names(suggestions).filter((name) => name === 'peaches')).toHaveLength(1)
  })

  it('caps how many it returns', () => {
    const history = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((name) => purchase(name, 10))
    expect(getSuggestions({ history, now: NOW })).toHaveLength(5)
  })
})
