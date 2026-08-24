import { matchKey } from '../itemKey'
import { suggestDeals } from './deals'
import { suggestFromHistory } from './history'
import { suggestSeasonal } from './seasonal'
import { suggestSubstitutes } from './substitutes'

export const SUGGESTION_LIMIT = 5

// What the user actually buys outranks a substitute, which outranks a
// generic seasonal pick.
const SOURCE_WEIGHT = { history: 1, substitute: 0.7, deal: 0.6, seasonal: 0.55 }

export function getSuggestions({
  items = [],
  history = [],
  dismissed = [],
  catalog = null,
  now = Date.now(),
} = {}) {
  const exclude = new Set([
    ...items.map((item) => matchKey(item.name)),
    ...dismissed.map(matchKey),
  ])

  const candidates = [
    ...suggestFromHistory(history, { now, exclude }),
    ...suggestSubstitutes(items, { exclude }),
    ...(catalog ? suggestDeals(catalog, { exclude, history }) : []),
    ...suggestSeasonal({ now, exclude }),
  ]

  const best = new Map()
  for (const candidate of candidates) {
    const key = matchKey(candidate.name)
    const ranked = { ...candidate, key, rank: candidate.score * SOURCE_WEIGHT[candidate.source] }
    const existing = best.get(key)
    if (!existing || existing.rank < ranked.rank) best.set(key, ranked)
  }

  return [...best.values()].sort((a, b) => b.rank - a.rank).slice(0, SUGGESTION_LIMIT)
}
