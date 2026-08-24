import { categorize } from '../lib/categories'
import { matchKey } from '../lib/itemKey'
import { INTENTS } from '../lib/nlp/intents'

const HISTORY_LIMIT = 200

export const initialState = { items: [], history: [], feedback: null, lastTouchedId: null }

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function describeItem({ name, quantity, unit }) {
  if (unit) return `${quantity} ${unit}${quantity === 1 ? '' : 's'} of ${name}`
  return quantity > 1 ? `${quantity} × ${name}` : name
}

function feedback(tone, message) {
  return { id: createId(), tone, message }
}

function createItem({ name, quantity, unit }) {
  const now = Date.now()
  return {
    id: createId(),
    name,
    quantity: quantity ?? 1,
    unit: unit ?? null,
    category: categorize(name),
    checked: false,
    addedAt: now,
    updatedAt: now,
  }
}

// Units only merge when they agree; "1 litre milk" and "2 bottles of milk"
// stay separate lines because they are not the same thing.
function findMergeTarget(items, incoming) {
  const key = matchKey(incoming.name)
  return items.find(
    (item) =>
      matchKey(item.name) === key &&
      (item.unit === incoming.unit || !item.unit || !incoming.unit),
  )
}

function findRemovalTarget(items, name) {
  const key = matchKey(name)
  return (
    items.find((item) => matchKey(item.name) === key) ||
    items.find((item) => matchKey(item.name).includes(key))
  )
}

function addItems(state, incoming) {
  const items = [...state.items]
  const historyEntries = []
  let lastTouchedId = state.lastTouchedId

  for (const entry of incoming) {
    const quantity = entry.quantity ?? 1
    const target = findMergeTarget(items, entry)

    if (target) {
      items[items.indexOf(target)] = {
        ...target,
        quantity: target.quantity + quantity,
        unit: target.unit || entry.unit || null,
        checked: false,
        updatedAt: Date.now(),
      }
      lastTouchedId = target.id
    } else {
      const created = createItem(entry)
      items.push(created)
      lastTouchedId = created.id
    }

    historyEntries.push({
      name: entry.name,
      quantity,
      unit: entry.unit ?? null,
      category: categorize(entry.name),
      at: Date.now(),
    })
  }

  const first = { ...incoming[0], quantity: incoming[0].quantity ?? 1 }
  const message =
    incoming.length === 1
      ? `Added ${describeItem(first)}`
      : `Added ${incoming.length} items`

  return {
    ...state,
    items,
    lastTouchedId,
    history: [...historyEntries, ...state.history].slice(0, HISTORY_LIMIT),
    feedback: feedback('success', message),
  }
}

function removeItems(state, incoming) {
  let items = [...state.items]
  const removed = []
  const missing = []

  for (const entry of incoming) {
    const target = findRemovalTarget(items, entry.name)
    if (target) {
      items = items.filter((item) => item.id !== target.id)
      removed.push(target.name)
    } else {
      missing.push(entry.name)
    }
  }

  if (!removed.length) {
    return {
      ...state,
      feedback: feedback('error', `${missing[0]} is not on your list`),
    }
  }

  const message = removed.length === 1 ? `Removed ${removed[0]}` : `Removed ${removed.length} items`
  return { ...state, items, feedback: feedback('success', message) }
}

function updateQuantity(state, incoming) {
  const entry = incoming[0]
  if (!entry || entry.quantity == null) {
    return { ...state, feedback: feedback('error', 'Tell me the new quantity') }
  }

  const target = entry.name
    ? findRemovalTarget(state.items, entry.name)
    : state.items.find((item) => item.id === state.lastTouchedId) ||
      state.items[state.items.length - 1]

  if (!target) {
    return {
      ...state,
      feedback: feedback('error', entry.name ? `${entry.name} is not on your list` : 'Nothing to update'),
    }
  }

  const items = state.items.map((item) =>
    item.id === target.id
      ? { ...item, quantity: entry.quantity, unit: entry.unit || item.unit, updatedAt: Date.now() }
      : item,
  )

  return {
    ...state,
    items,
    lastTouchedId: target.id,
    feedback: feedback('success', `${target.name} set to ${entry.quantity}`),
  }
}

export function applyCommand(state, command) {
  if (!command || command.intent === INTENTS.UNKNOWN) {
    return { ...state, feedback: feedback('error', "Sorry, I didn't catch a command in that") }
  }

  switch (command.intent) {
    case INTENTS.ADD:
      if (!command.items.length) {
        return { ...state, feedback: feedback('error', 'What would you like to add?') }
      }
      return addItems(state, command.items)

    case INTENTS.REMOVE:
      if (!command.items.length) {
        return { ...state, feedback: feedback('error', 'What would you like to remove?') }
      }
      return removeItems(state, command.items)

    case INTENTS.UPDATE_QUANTITY:
      return updateQuantity(state, command.items)

    case INTENTS.CLEAR:
      if (!state.items.length) {
        return { ...state, feedback: feedback('info', 'Your list is already empty') }
      }
      return { ...state, items: [], feedback: feedback('success', 'List cleared') }

    default:
      return state
  }
}

export function listReducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, feedback: null }

    case 'command':
      return applyCommand(state, action.command)

    case 'toggle':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, checked: !item.checked } : item,
        ),
      }

    case 'remove': {
      const target = state.items.find((item) => item.id === action.id)
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
        feedback: target ? feedback('success', `Removed ${target.name}`) : state.feedback,
      }
    }

    case 'step': {
      const items = state.items
        .map((item) =>
          item.id === action.id
            ? { ...item, quantity: item.quantity + action.delta, updatedAt: Date.now() }
            : item,
        )
        .filter((item) => item.quantity > 0)
      return { ...state, items }
    }

    case 'notify':
      return { ...state, feedback: feedback(action.tone, action.message) }

    case 'dismissFeedback':
      return { ...state, feedback: null }

    default:
      return state
  }
}
