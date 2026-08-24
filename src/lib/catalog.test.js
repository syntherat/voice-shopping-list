import { describe, expect, it } from 'vitest'
import catalog from '../data/catalog'
import { effectivePrice, hasSearchCriteria, searchCatalog, toCatalogPrice } from './catalog'
import { parseCommand } from './nlp/parser'

const search = (text) => searchCatalog(catalog, parseCommand(text))
const names = (results) => results.map((product) => product.name)

describe('catalog data', () => {
  it('gives every product the fields the UI renders', () => {
    for (const product of catalog) {
      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        brand: expect.any(String),
        size: expect.any(String),
        price: expect.any(Number),
        category: expect.any(String),
        tags: expect.any(Array),
      })
    }
  })

  it('uses unique ids', () => {
    expect(new Set(catalog.map((product) => product.id)).size).toBe(catalog.length)
  })

  it('never prices a sale above the normal price', () => {
    for (const product of catalog.filter((entry) => entry.salePrice)) {
      expect(product.salePrice).toBeLessThan(product.price)
    }
  })
})

describe('price helpers', () => {
  it('prefers a sale price', () => {
    expect(effectivePrice({ price: 5, salePrice: 3 })).toBe(3)
    expect(effectivePrice({ price: 5 })).toBe(5)
  })

  it('converts a spoken threshold into catalog currency', () => {
    expect(toCatalogPrice(200, 'INR')).toBeCloseTo(2.4)
    expect(toCatalogPrice(5, 'USD')).toBe(5)
    expect(toCatalogPrice(5, null)).toBe(5)
    expect(toCatalogPrice(null, 'USD')).toBeNull()
  })
})

describe('searching', () => {
  it('ranks an exact name match first', () => {
    expect(search('find toothpaste')[0].name).toBe('toothpaste')
  })

  it('finds products by a word inside the name', () => {
    expect(names(search('find milk'))).toContain('almond milk')
  })

  it('matches on brand', () => {
    const results = search('find brightwell')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((product) => product.brand === 'Brightwell')).toBe(true)
  })

  it('applies a tag filter', () => {
    const results = search('find me organic apples')
    expect(results.every((product) => product.tags.includes('organic'))).toBe(true)
    expect(names(results)).toContain('organic apples')
  })

  it('applies a price ceiling', () => {
    const results = search('find toothpaste under $4')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((product) => effectivePrice(product) <= 4)).toBe(true)
  })

  it('compares the sale price against the ceiling', () => {
    const results = search('find whitening toothpaste under $4')
    expect(names(results)).toContain('whitening toothpaste')
  })

  it('converts a rupee ceiling before filtering', () => {
    const results = search('find rice under 400 rupees')
    expect(results.every((product) => effectivePrice(product) <= 6)).toBe(true)
  })

  it('applies a price floor', () => {
    const results = search('find cheese above 5 dollars')
    expect(results.every((product) => effectivePrice(product) >= 5)).toBe(true)
  })

  it('combines a tag and a price bound', () => {
    const results = search('find organic produce under $5')
    expect(results.every((product) => product.tags.includes('organic'))).toBe(true)
    expect(results.every((product) => effectivePrice(product) <= 5)).toBe(true)
  })

  it('returns nothing for an unstocked product', () => {
    expect(search('find caviar')).toEqual([])
  })

  it('caps the number of results', () => {
    expect(search('find fresh').length).toBeLessThanOrEqual(8)
  })
})

describe('hasSearchCriteria', () => {
  it.each([
    ['find apples', true],
    ['find organic', true],
    ['find something under $5', true],
  ])('accepts %s', (text, expected) => {
    expect(hasSearchCriteria(parseCommand(text))).toBe(expected)
  })

  it('rejects a search with nothing to go on', () => {
    expect(hasSearchCriteria(parseCommand('find'))).toBe(false)
  })
})

describe('cross-language search', () => {
  it.each([
    ['चावल ढूंढो', 'white rice', 'hi-IN'],
    ['दूध ढूंढो', 'whole milk', 'hi-IN'],
    ['busca leche', 'whole milk', 'es-ES'],
    ['cherche du pain', 'white bread', 'fr-FR'],
    ['busca huevos', 'eggs', 'es-ES'],
  ])('%s finds %s', (text, expected, locale) => {
    const results = searchCatalog(catalog, parseCommand(text, locale))
    expect(results[0].name).toBe(expected)
  })

  it('still applies a price bound to an aliased search', () => {
    const results = searchCatalog(catalog, parseCommand('चावल 500 रुपये से कम ढूंढो', 'hi-IN'))
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((product) => effectivePrice(product) <= 6)).toBe(true)
  })
})
