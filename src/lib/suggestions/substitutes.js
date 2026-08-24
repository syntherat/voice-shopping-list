import { matchKey } from '../itemKey'

const SUBSTITUTES = {
  milk: ['almond milk', 'oat milk', 'soy milk'],
  butter: ['margarine', 'olive oil'],
  cream: ['coconut cream', 'greek yogurt'],
  cheese: ['vegan cheese', 'paneer'],
  yogurt: ['curd', 'greek yogurt'],
  egg: ['tofu'],
  sugar: ['honey', 'jaggery', 'stevia'],
  bread: ['whole wheat bread', 'pita bread'],
  rice: ['quinoa', 'couscous'],
  pasta: ['noodles'],
  chicken: ['tofu', 'paneer'],
  beef: ['lentils', 'mushrooms'],
  potato: ['sweet potato'],
  coffee: ['green tea'],
  soda: ['sparkling water'],
  chip: ['popcorn'],
  chocolate: ['dark chocolate'],
}

// Recent items first, so the substitute relates to what was just said.
const RECENT_LIMIT = 3

function lookup(name) {
  const key = matchKey(name)
  if (SUBSTITUTES[key]) return SUBSTITUTES[key]
  const head = key.split(' ').at(-1)
  return SUBSTITUTES[head] || []
}

export function suggestSubstitutes(items, { exclude }) {
  const recent = items.slice(-RECENT_LIMIT).reverse()
  const suggestions = []

  recent.forEach((item, index) => {
    const alternative = lookup(item.name).find((name) => !exclude.has(matchKey(name)))
    if (!alternative) return
    suggestions.push({
      name: alternative,
      reason: `Instead of ${item.name}`,
      source: 'substitute',
      score: 1 - index * 0.2,
    })
  })

  return suggestions
}
