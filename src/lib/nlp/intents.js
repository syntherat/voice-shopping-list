export const INTENTS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  SEARCH: 'SEARCH',
  CLEAR: 'CLEAR',
  UNKNOWN: 'UNKNOWN',
}

// Checked in this order, so broader phrases sit below the ones they would swallow:
// "remove all items" has to reach CLEAR before REMOVE claims it.
export const INTENT_ORDER = [
  INTENTS.CLEAR,
  INTENTS.UPDATE_QUANTITY,
  INTENTS.SEARCH,
  INTENTS.REMOVE,
  INTENTS.ADD,
]
