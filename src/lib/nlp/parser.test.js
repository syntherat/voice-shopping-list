import { describe, expect, it } from 'vitest'
import { INTENTS } from './intents'
import { normalize, parseCommand, parseCommands } from './parser'

const firstItem = (text, locale) => parseCommand(text, locale).items[0]

describe('normalize', () => {
  it('lowercases and drops punctuation', () => {
    expect(normalize('Add Milk!')).toBe('add milk')
  })

  it('keeps apostrophised words as one token', () => {
    expect(normalize("I don't need bread")).toBe('i dont need bread')
  })

  it('separates a unit stuck to its number', () => {
    expect(normalize('2kg rice')).toBe('2 kg rice')
  })

  it('preserves decimals and currency symbols', () => {
    expect(normalize('under $5.50.')).toBe('under $5.50')
  })

  it('converts devanagari digits', () => {
    expect(normalize('२ सेब')).toBe('2 सेब')
  })
})

describe('add intent', () => {
  it('handles a plain add', () => {
    expect(parseCommand('add milk')).toMatchObject({
      intent: INTENTS.ADD,
      items: [{ name: 'milk', quantity: 1, unit: null }],
    })
  })

  it.each([
    ['i need apples', 'apples'],
    ['I want to buy bananas', 'bananas'],
    ['add bananas to my list', 'bananas'],
    ['put rice on my shopping list', 'rice'],
    ['can you grab some butter please', 'butter'],
    ['pick up coffee', 'coffee'],
  ])('understands %s', (text, name) => {
    const result = parseCommand(text)
    expect(result.intent).toBe(INTENTS.ADD)
    expect(result.items[0].name).toBe(name)
  })

  it('treats a bare item as an add with lower confidence', () => {
    const result = parseCommand('milk')
    expect(result.intent).toBe(INTENTS.ADD)
    expect(result.items[0].name).toBe('milk')
    expect(result.confidence).toBeLessThan(0.9)
  })

  it('keeps qualifiers as part of the item name', () => {
    expect(firstItem('add organic whole milk').name).toBe('organic whole milk')
  })

  it('reports low confidence when no item is named', () => {
    const result = parseCommand('add')
    expect(result.items).toHaveLength(0)
    expect(result.confidence).toBeLessThan(0.5)
  })

  it('returns unknown for empty input', () => {
    expect(parseCommand('  ')).toMatchObject({ intent: INTENTS.UNKNOWN, confidence: 0 })
  })
})

describe('quantities and units', () => {
  it.each([
    ['add 2 bottles of water', { name: 'water', quantity: 2, unit: 'bottle' }],
    ['buy 5 oranges', { name: 'oranges', quantity: 5, unit: null }],
    ['add three packs of biscuits', { name: 'biscuits', quantity: 3, unit: 'pack' }],
    ['2kg rice', { name: 'rice', quantity: 2, unit: 'kg' }],
    ['add a dozen eggs', { name: 'eggs', quantity: 1, unit: 'dozen' }],
    ['get me half a dozen eggs', { name: 'eggs', quantity: 6, unit: null }],
    ['add half a kilo of rice', { name: 'rice', quantity: 0.5, unit: 'kg' }],
    ['i need a couple of lemons', { name: 'lemons', quantity: 2, unit: null }],
    ['add 1.5 litres of juice', { name: 'juice', quantity: 1.5, unit: 'l' }],
  ])('parses %s', (text, expected) => {
    expect(firstItem(text)).toEqual(expected)
  })

  it('defaults to a quantity of one', () => {
    expect(firstItem('add bread').quantity).toBe(1)
  })
})

describe('multiple items', () => {
  it('splits on commas and conjunctions', () => {
    const result = parseCommand('add milk, eggs and bread')
    expect(result.items.map((item) => item.name)).toEqual(['milk', 'eggs', 'bread'])
  })

  it('keeps a quantity with each item', () => {
    const result = parseCommand('add 2 bottles of water and 5 oranges')
    expect(result.items).toEqual([
      { name: 'water', quantity: 2, unit: 'bottle' },
      { name: 'oranges', quantity: 5, unit: null },
    ])
  })
})

describe('remove intent', () => {
  it.each([
    ['remove milk from my list', 'milk'],
    ['delete the bread', 'bread'],
    ["i don't need eggs", 'eggs'],
    ['take off sugar', 'sugar'],
  ])('understands %s', (text, name) => {
    const result = parseCommand(text)
    expect(result.intent).toBe(INTENTS.REMOVE)
    expect(result.items[0].name).toBe(name)
  })
})

describe('clear intent', () => {
  it.each(['clear my list', 'empty the list', 'start over', 'remove all items'])(
    'understands %s',
    (text) => {
      expect(parseCommand(text).intent).toBe(INTENTS.CLEAR)
    },
  )
})

describe('quantity updates', () => {
  it('reads the new quantity after the separator', () => {
    expect(parseCommand('change milk to 3')).toMatchObject({
      intent: INTENTS.UPDATE_QUANTITY,
      items: [{ name: 'milk', quantity: 3, unit: null }],
    })
  })

  it('keeps the unit when one is given', () => {
    expect(firstItem('update rice to 2 kg')).toEqual({ name: 'rice', quantity: 2, unit: 'kg' })
  })

  it('leaves the name empty when the item is implied', () => {
    expect(firstItem('make it 5')).toEqual({ name: '', quantity: 5, unit: null })
  })
})

describe('search intent', () => {
  it('extracts the query and a tag', () => {
    expect(parseCommand('find me organic apples')).toMatchObject({
      intent: INTENTS.SEARCH,
      query: 'apples',
      filters: { tags: ['organic'], maxPrice: null },
    })
  })

  it('reads a price ceiling with a currency symbol', () => {
    expect(parseCommand('find toothpaste under $5')).toMatchObject({
      query: 'toothpaste',
      filters: { maxPrice: 5, currency: 'USD' },
    })
  })

  it('reads a price ceiling written as words', () => {
    expect(parseCommand('search for shampoo less than 200 rupees')).toMatchObject({
      query: 'shampoo',
      filters: { maxPrice: 200, currency: 'INR' },
    })
  })

  it('reads a price floor', () => {
    expect(parseCommand('find cheese above 10 dollars').filters).toMatchObject({
      minPrice: 10,
      maxPrice: null,
    })
  })

  it('reads a price range', () => {
    expect(parseCommand('show me apples between 2 and 5 dollars')).toMatchObject({
      query: 'apples',
      filters: { minPrice: 2, maxPrice: 5, currency: 'USD' },
    })
  })

  it('does not swallow the item when it follows the amount', () => {
    expect(parseCommand('find bread under 3').query).toBe('bread')
  })
})

describe('hindi', () => {
  it.each([
    ['दूध जोड़ो', 'दूध'],
    ['मुझे सेब चाहिए', 'सेब'],
    ['ब्रेड डाल दो', 'ब्रेड'],
  ])('adds from %s', (text, name) => {
    const result = parseCommand(text, 'hi-IN')
    expect(result.intent).toBe(INTENTS.ADD)
    expect(result.items[0].name).toBe(name)
  })

  it('reads a hindi quantity', () => {
    expect(firstItem('दो सेब जोड़ो', 'hi-IN')).toEqual({ name: 'सेब', quantity: 2, unit: null })
  })

  it('reads a hindi unit', () => {
    expect(firstItem('एक किलो चावल जोड़ो', 'hi-IN')).toEqual({
      name: 'चावल',
      quantity: 1,
      unit: 'kg',
    })
  })

  it('removes an item', () => {
    const result = parseCommand('दूध हटा दो', 'hi-IN')
    expect(result.intent).toBe(INTENTS.REMOVE)
    expect(result.items[0].name).toBe('दूध')
  })

  it('reads a price limit written after the amount', () => {
    expect(parseCommand('चावल 100 रुपये से कम ढूंढो', 'hi-IN')).toMatchObject({
      intent: INTENTS.SEARCH,
      query: 'चावल',
      filters: { maxPrice: 100, currency: 'INR' },
    })
  })

  it('still understands an english command', () => {
    expect(parseCommand('add milk', 'hi-IN').items[0].name).toBe('milk')
  })
})

describe('spanish', () => {
  it.each([
    ['agrega leche', 'leche'],
    ['quiero comprar plátanos', 'plátanos'],
    ['necesito pan', 'pan'],
  ])('adds from %s', (text, name) => {
    const result = parseCommand(text, 'es-ES')
    expect(result.intent).toBe(INTENTS.ADD)
    expect(result.items[0].name).toBe(name)
  })

  it('reads quantity and unit', () => {
    expect(firstItem('agrega dos botellas de agua', 'es-ES')).toEqual({
      name: 'agua',
      quantity: 2,
      unit: 'bottle',
    })
  })

  it('removes an item', () => {
    expect(parseCommand('quita la leche de mi lista', 'es-ES')).toMatchObject({
      intent: INTENTS.REMOVE,
      items: [{ name: 'leche' }],
    })
  })
})

describe('french', () => {
  it.each([
    ['ajoute du pain', 'pain'],
    ['il me faut des pommes', 'pommes'],
    ['je veux acheter du fromage', 'fromage'],
  ])('adds from %s', (text, name) => {
    const result = parseCommand(text, 'fr-FR')
    expect(result.intent).toBe(INTENTS.ADD)
    expect(result.items[0].name).toBe(name)
  })

  it('reads quantity and unit', () => {
    expect(firstItem('ajoute trois bouteilles de lait', 'fr-FR')).toEqual({
      name: 'lait',
      quantity: 3,
      unit: 'bottle',
    })
  })

  it('removes an item', () => {
    expect(parseCommand('enlève le lait de ma liste', 'fr-FR').intent).toBe(INTENTS.REMOVE)
  })
})

describe('replacing an item', () => {
  it.each([
    ['replace milk with almond milk', 'milk', 'almond milk'],
    ['swap maggi for kurkure', 'maggi', 'kurkure'],
    ['change a maggi to kurkure', 'maggi', 'kurkure'],
    ['can you change the bread to croissants', 'bread', 'croissants'],
    ['substitute butter with olive oil', 'butter', 'olive oil'],
  ])('reads %s', (text, target, name) => {
    const result = parseCommand(text)
    expect(result.intent).toBe(INTENTS.REPLACE)
    expect(result.target).toBe(target)
    expect(result.items[0].name).toBe(name)
  })

  it('leaves the quantity unset when none is spoken', () => {
    expect(firstItem('replace milk with oat milk').quantity).toBeNull()
  })

  it('keeps a spoken quantity and unit', () => {
    expect(firstItem('replace milk with 2 bottles of oat milk')).toEqual({
      name: 'oat milk',
      quantity: 2,
      unit: 'bottle',
    })
  })

  it('still reads a quantity change as an update', () => {
    expect(parseCommand('change milk to 3').intent).toBe(INTENTS.UPDATE_QUANTITY)
  })

  it('reports low confidence when only one side is given', () => {
    const result = parseCommand('replace milk')
    expect(result.intent).toBe(INTENTS.REPLACE)
    expect(result.confidence).toBeLessThan(0.5)
  })

  it('replaces in spanish', () => {
    expect(parseCommand('reemplaza la leche por leche de almendras', 'es-ES')).toMatchObject({
      intent: INTENTS.REPLACE,
      target: 'leche',
      items: [{ name: 'leche de almendras' }],
    })
  })

  it('replaces in french', () => {
    expect(parseCommand('remplace le pain par des croissants', 'fr-FR')).toMatchObject({
      intent: INTENTS.REPLACE,
      target: 'pain',
      items: [{ name: 'croissants' }],
    })
  })
})

describe('subjects and preamble', () => {
  it.each([
    ['my friend wants 10 kurkure', 'kurkure', 10],
    ['she needs 2 bottles of water', 'water', 2],
    ['we want 3 apples', 'apples', 3],
    ['my mum needs bread', 'bread', 1],
    ['can you please add 5 oranges for me', 'oranges', 5],
  ])('strips the subject in %s', (text, name, quantity) => {
    const item = firstItem(text)
    expect(item.name).toBe(name)
    expect(item.quantity).toBe(quantity)
  })

  it('keeps the leading words when nothing follows the quantity', () => {
    expect(firstItem('add rice 2 kg')).toEqual({ name: 'rice', quantity: 2, unit: 'kg' })
  })

  it('does not mistake a removal for an addition', () => {
    expect(parseCommand("i don't need eggs").intent).toBe(INTENTS.REMOVE)
  })
})

describe('compound commands', () => {
  const intents = (text, locale) => parseCommands(text, locale).map((command) => command.intent)

  it('splits a removal and an addition', () => {
    const [remove, add] = parseCommands('remove milk and add almond milk')
    expect(remove).toMatchObject({ intent: INTENTS.REMOVE, items: [{ name: 'milk' }] })
    expect(add).toMatchObject({ intent: INTENTS.ADD, items: [{ name: 'almond milk' }] })
  })

  it.each([
    'can you remove milk and in its place add almond milk',
    'can you remove milk and instead of that add almond milk',
  ])('handles %s', (text) => {
    const commands = parseCommands(text)
    expect(commands.map((command) => command.intent)).toEqual([INTENTS.REMOVE, INTENTS.ADD])
    expect(commands[0].items[0].name).toBe('milk')
    expect(commands[1].items[0].name).toBe('almond milk')
  })

  it('keeps a single multi-item add as one command', () => {
    expect(intents('add milk, eggs and bread')).toEqual([INTENTS.ADD])
    expect(parseCommands('add milk, eggs and bread')[0].items).toHaveLength(3)
  })

  it('keeps a quantity list as one command', () => {
    expect(intents('add 2 bottles of water and 5 oranges')).toEqual([INTENTS.ADD])
  })

  it('handles three clauses', () => {
    expect(intents('add bread and remove milk and clear my list')).toEqual([
      INTENTS.ADD,
      INTENTS.REMOVE,
      INTENTS.CLEAR,
    ])
  })

  it('splits a verb-final language after the verb', () => {
    const commands = parseCommands('दूध हटाओ और ब्रेड जोड़ो', 'hi-IN')
    expect(commands.map((command) => command.intent)).toEqual([INTENTS.REMOVE, INTENTS.ADD])
    expect(commands[0].items[0].name).toBe('दूध')
    expect(commands[1].items[0].name).toBe('ब्रेड')
  })

  it('returns a single command for a single instruction', () => {
    expect(parseCommands('add milk')).toHaveLength(1)
  })

  it('never returns an empty list', () => {
    expect(parseCommands('   ')).toHaveLength(1)
  })
})

describe('instead-of wording', () => {
  it.each([
    ['add almond milk instead of milk', 'milk', 'almond milk'],
    ['instead of milk add almond milk', 'milk', 'almond milk'],
    ['get oat milk rather than milk', 'milk', 'oat milk'],
  ])('reads %s as a swap', (text, target, name) => {
    const [command] = parseCommands(text)
    expect(command.intent).toBe(INTENTS.REPLACE)
    expect(command.target).toBe(target)
    expect(command.items[0].name).toBe(name)
  })

  it('does not fire on a plain add', () => {
    expect(parseCommand('add almond milk').intent).toBe(INTENTS.ADD)
  })
})

describe('hindi swaps', () => {
  it.each([
    ['मैगी की जगह कुरकुरे डाल दो', 'मैगी', 'कुरकुरे'],
    ['मैगी की जगह कुरकुरे', 'मैगी', 'कुरकुरे'],
    ['मैगी के बदले कुरकुरे जोड़ो', 'मैगी', 'कुरकुरे'],
    ['मैगी को कुरकुरे से बदल दो', 'मैगी', 'कुरकुरे'],
    ['दूध को बादाम दूध से बदलो', 'दूध', 'बादाम दूध'],
  ])('reads %s', (text, target, name) => {
    const [command] = parseCommands(text, 'hi-IN')
    expect(command.intent).toBe(INTENTS.REPLACE)
    expect(command.target).toBe(target)
    expect(command.items[0].name).toBe(name)
  })

  it('leaves the quantity unset so the old one carries over', () => {
    const [command] = parseCommands('मैगी की जगह कुरकुरे', 'hi-IN')
    expect(command.items[0].quantity).toBeNull()
  })

  it('reads a hindi quantity change', () => {
    expect(parseCommand('दूध 3 कर दो', 'hi-IN')).toMatchObject({
      intent: INTENTS.UPDATE_QUANTITY,
      items: [{ name: 'दूध', quantity: 3 }],
    })
  })

  it('does not mistake a plain hindi add for a swap', () => {
    expect(parseCommand('दो सेब जोड़ो', 'hi-IN').intent).toBe(INTENTS.ADD)
  })

  it('still accepts the english phrasing in hindi mode', () => {
    expect(parseCommand('replace milk with almond milk', 'hi-IN')).toMatchObject({
      intent: INTENTS.REPLACE,
      target: 'milk',
    })
  })
})
