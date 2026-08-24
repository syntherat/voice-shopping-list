import { describe, expect, it } from 'vitest'
import { categorize, getCategory } from './categories'

describe('categorize', () => {
  it.each([
    ['milk', 'dairy'],
    ['eggs', 'dairy'],
    ['bread', 'bakery'],
    ['bananas', 'produce'],
    ['chicken', 'meat'],
    ['rice', 'pantry'],
    ['toothpaste', 'personal'],
    ['detergent', 'household'],
  ])('puts %s in %s', (name, category) => {
    expect(categorize(name)).toBe(category)
  })

  it('matches on a word inside a longer name', () => {
    expect(categorize('organic whole milk')).toBe('dairy')
    expect(categorize('chicken breast')).toBe('meat')
  })

  it('prefers the longer phrase', () => {
    expect(categorize('orange juice')).toBe('beverages')
    expect(categorize('orange')).toBe('produce')
  })

  it('lets a frozen modifier win over the base item', () => {
    expect(categorize('frozen peas')).toBe('frozen')
    expect(categorize('peas')).toBe('produce')
  })

  it('falls back to keyword rules for unlisted products', () => {
    expect(categorize('mango juice')).toBe('beverages')
    expect(categorize('herbal shampoo')).toBe('personal')
  })

  it('categorizes common non-english items', () => {
    expect(categorize('दूध')).toBe('dairy')
    expect(categorize('leche')).toBe('dairy')
  })

  it('falls back to other', () => {
    expect(categorize('sparkplug')).toBe('other')
    expect(categorize('')).toBe('other')
  })

  it('always resolves a category record', () => {
    expect(getCategory('dairy').label).toBe('Dairy & Eggs')
    expect(getCategory('nope').id).toBe('other')
  })
})

describe('hindi item names', () => {
  it.each([
    ['मैगी', 'pantry'],
    ['कुरकुरे', 'snacks'],
    ['दूध', 'dairy'],
    ['बादाम दूध', 'dairy'],
    ['ब्रेड', 'bakery'],
    ['मुर्गी', 'meat'],
    ['गाजर', 'produce'],
    ['शैम्पू', 'personal'],
    ['चाय', 'beverages'],
  ])('puts %s in %s', (name, category) => {
    expect(categorize(name)).toBe(category)
  })
})
