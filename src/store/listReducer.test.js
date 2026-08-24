import { describe, expect, it } from 'vitest'
import { matchKey } from '../lib/itemKey'
import { parseCommand } from '../lib/nlp/parser'
import { applyCommand, initialState, listReducer } from './listReducer'

const run = (state, text, locale = 'en-US') => applyCommand(state, parseCommand(text, locale))

const runAll = (texts) => texts.reduce((state, text) => run(state, text), initialState)

const names = (state) => state.items.map((item) => item.name)

describe('matchKey', () => {
  it('ignores case, spacing and a trailing plural', () => {
    expect(matchKey('  Apples ')).toBe(matchKey('apple'))
  })

  it('keeps words that merely end in double s', () => {
    expect(matchKey('glass')).toBe('glass')
  })
})

describe('adding', () => {
  it('adds an item with its category', () => {
    const state = run(initialState, 'add milk')
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({ name: 'milk', quantity: 1, category: 'dairy' })
  })

  it('adds every item in a multi-item command', () => {
    const state = run(initialState, 'add milk, eggs and bread')
    expect(names(state)).toEqual(['milk', 'eggs', 'bread'])
  })

  it('merges a repeat into the existing quantity', () => {
    const state = runAll(['add 2 apples', 'add 3 apples'])
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(5)
  })

  it('merges across a plural difference', () => {
    const state = runAll(['add apples', 'add an apple'])
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(2)
  })

  it('adopts a unit when the first add had none', () => {
    const state = runAll(['add milk', 'add 2 bottles of milk'])
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({ quantity: 3, unit: 'bottle' })
  })

  it('keeps conflicting units on separate lines', () => {
    const state = runAll(['add 2 bottles of milk', 'add 1 litre of milk'])
    expect(state.items).toHaveLength(2)
  })

  it('records every add in history', () => {
    const state = runAll(['add milk', 'add 2 apples'])
    expect(state.history).toHaveLength(2)
    expect(state.history[0]).toMatchObject({ name: 'apples', quantity: 2, category: 'produce' })
  })

  it('confirms what was added', () => {
    expect(run(initialState, 'add 2 bottles of water').feedback).toMatchObject({
      tone: 'success',
      message: 'Added 2 bottles of water',
    })
  })
})

describe('removing', () => {
  it('removes a matching item', () => {
    const state = run(runAll(['add milk', 'add bread']), 'remove milk')
    expect(names(state)).toEqual(['bread'])
  })

  it('matches across a plural difference', () => {
    const state = run(runAll(['add apples']), 'remove apple')
    expect(state.items).toHaveLength(0)
  })

  it('reports an item that is not on the list', () => {
    const before = runAll(['add milk'])
    const after = run(before, 'remove bread')
    expect(after.items).toHaveLength(1)
    expect(after.feedback).toMatchObject({ tone: 'error', message: 'bread is not on your list' })
  })
})

describe('clearing', () => {
  it('empties the list but keeps history', () => {
    const state = run(runAll(['add milk', 'add bread']), 'clear my list')
    expect(state.items).toHaveLength(0)
    expect(state.history).toHaveLength(2)
  })

  it('says so when there is nothing to clear', () => {
    expect(run(initialState, 'clear my list').feedback.tone).toBe('info')
  })
})

describe('quantity updates', () => {
  it('sets a named item to the new quantity', () => {
    const state = run(runAll(['add 2 apples']), 'change apples to 5')
    expect(state.items[0].quantity).toBe(5)
  })

  it('targets the most recent item when none is named', () => {
    const state = run(runAll(['add milk', 'add bread']), 'make it 4')
    const bread = state.items.find((item) => item.name === 'bread')
    expect(bread.quantity).toBe(4)
  })

  it('reports an unknown item', () => {
    expect(run(runAll(['add milk']), 'change bread to 3').feedback.tone).toBe('error')
  })
})

describe('unrecognised commands', () => {
  it('rejects an empty command', () => {
    expect(run(initialState, '   ')).toMatchObject({
      items: [],
      feedback: { tone: 'error' },
    })
  })

  it('rejects an add with no item named', () => {
    expect(run(initialState, 'add').feedback).toMatchObject({
      tone: 'error',
      message: 'What would you like to add?',
    })
  })

  it('leaves the list untouched for a search', () => {
    const before = runAll(['add milk'])
    const after = run(before, 'find organic apples')
    expect(after.items).toEqual(before.items)
  })
})

describe('non-english commands', () => {
  it('adds from hindi', () => {
    const state = run(initialState, 'दो सेब जोड़ो', 'hi-IN')
    expect(state.items[0]).toMatchObject({ name: 'सेब', quantity: 2, category: 'produce' })
  })

  it('adds from spanish', () => {
    const state = run(initialState, 'agrega leche', 'es-ES')
    expect(state.items[0]).toMatchObject({ name: 'leche', category: 'dairy' })
  })
})

describe('direct list actions', () => {
  const seeded = runAll(['add 2 apples', 'add bread'])

  it('toggles an item', () => {
    const state = listReducer(seeded, { type: 'toggle', id: seeded.items[0].id })
    expect(state.items[0].checked).toBe(true)
  })

  it('steps a quantity up', () => {
    const state = listReducer(seeded, { type: 'step', id: seeded.items[0].id, delta: 1 })
    expect(state.items[0].quantity).toBe(3)
  })

  it('drops an item stepped down to zero', () => {
    const bread = seeded.items.find((item) => item.name === 'bread')
    const state = listReducer(seeded, { type: 'step', id: bread.id, delta: -1 })
    expect(names(state)).toEqual(['apples'])
  })

  it('removes by id', () => {
    const state = listReducer(seeded, { type: 'remove', id: seeded.items[0].id })
    expect(names(state)).toEqual(['bread'])
  })

  it('dismisses feedback', () => {
    expect(listReducer(seeded, { type: 'dismissFeedback' }).feedback).toBeNull()
  })
})
