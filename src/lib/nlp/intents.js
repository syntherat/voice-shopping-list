export const INTENTS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  SEARCH: 'SEARCH',
  CLEAR: 'CLEAR',
  UNKNOWN: 'UNKNOWN',
}

// Checked in this order, so broader phrases sit below the ones they would
// swallow: "remove all items" has to reach CLEAR before REMOVE claims it, and
// "swap X for Y" has to reach REPLACE before ADD treats it as an item name.
export const INTENT_ORDER = [
  INTENTS.CLEAR,
  INTENTS.REPLACE,
  INTENTS.UPDATE_QUANTITY,
  INTENTS.SEARCH,
  INTENTS.REMOVE,
  INTENTS.ADD,
]
