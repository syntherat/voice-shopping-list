import { matchKey } from '../itemKey'

const DAY = 24 * 60 * 60 * 1000
const MIN_INTERVAL_DAYS = 1
const DUE_THRESHOLD = 0.8
const COLD_START_DAYS = 3

// Repeat purchases are counted per day, not per command: adding milk three
// times in one session is one shopping trip, not three.
function groupPurchases(history) {
  const groups = new Map()

  for (const entry of history) {
    if (!entry?.name || !entry.at) continue
    const key = matchKey(entry.name)
    const group = groups.get(key) || { name: entry.name, days: new Set(), lastAt: 0 }
    group.days.add(Math.floor(entry.at / DAY))
    group.lastAt = Math.max(group.lastAt, entry.at)
    groups.set(key, group)
  }

  return groups
}

export function suggestFromHistory(history, { now, exclude }) {
  const suggestions = []

  for (const [key, group] of groupPurchases(history)) {
    if (exclude.has(key)) continue

    const daysSince = (now - group.lastAt) / DAY
    const days = [...group.days].sort((a, b) => a - b)

    if (days.length >= 2) {
      const span = days[days.length - 1] - days[0]
      const interval = Math.max(span / (days.length - 1), MIN_INTERVAL_DAYS)
      if (daysSince < interval * DUE_THRESHOLD) continue

      suggestions.push({
        name: group.name,
        reason: `Usually every ${Math.round(interval)} days`,
        source: 'history',
        score: Math.min(daysSince / interval, 2) / 2,
      })
      continue
    }

    if (daysSince >= COLD_START_DAYS) {
      suggestions.push({
        name: group.name,
        reason: 'Bought before',
        source: 'history',
        score: 0.3,
      })
    }
  }

  return suggestions
}
