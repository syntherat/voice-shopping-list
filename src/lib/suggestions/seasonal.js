import { matchKey } from '../itemKey'

// Northern-hemisphere produce calendar, keyed by month (1-12).
const SEASONAL_PRODUCE = {
  1: ['oranges', 'grapefruit', 'kale', 'leeks', 'cabbage', 'pomegranate'],
  2: ['oranges', 'lemons', 'broccoli', 'cauliflower', 'spinach', 'beetroot'],
  3: ['spring onions', 'spinach', 'leeks', 'rhubarb', 'carrots', 'purple sprouting broccoli'],
  4: ['asparagus', 'radishes', 'spring greens', 'rhubarb', 'new potatoes', 'watercress'],
  5: ['asparagus', 'strawberries', 'peas', 'lettuce', 'cucumber', 'spring onions'],
  6: ['strawberries', 'cherries', 'peas', 'courgettes', 'tomatoes', 'lettuce'],
  7: ['raspberries', 'blueberries', 'tomatoes', 'courgettes', 'sweetcorn', 'peaches'],
  8: ['peaches', 'plums', 'sweetcorn', 'tomatoes', 'blackberries', 'melon'],
  9: ['apples', 'pears', 'plums', 'blackberries', 'sweetcorn', 'squash'],
  10: ['pumpkin', 'apples', 'squash', 'mushrooms', 'parsnips', 'pears'],
  11: ['brussels sprouts', 'parsnips', 'squash', 'cranberries', 'leeks', 'mushrooms'],
  12: ['brussels sprouts', 'cranberries', 'cabbage', 'parsnips', 'clementines', 'potatoes'],
}

export function getSeasonalProduce(now) {
  return SEASONAL_PRODUCE[new Date(now).getMonth() + 1] || []
}

export function suggestSeasonal({ now, exclude }) {
  return getSeasonalProduce(now)
    .filter((name) => !exclude.has(matchKey(name)))
    .map((name) => ({ name, reason: 'In season now', source: 'seasonal', score: 0.5 }))
}
