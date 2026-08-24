import { effectivePrice } from '../catalog'
import { matchKey } from '../itemKey'

const DEAL_LIMIT = 3

const discount = (product) => 1 - effectivePrice(product) / product.price

export function suggestDeals(catalog, { exclude, history }) {
  const bought = new Set(history.map((entry) => matchKey(entry.name)))

  return catalog
    .filter((product) => product.salePrice && !exclude.has(matchKey(product.name)))
    .map((product) => ({
      name: product.name,
      reason: `On sale · $${product.salePrice.toFixed(2)}`,
      source: 'deal',
      // A discount on something they actually buy beats a steeper discount on
      // something they have never bought.
      score: bought.has(matchKey(product.name)) ? 1 : Math.min(0.4 + discount(product), 0.9),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, DEAL_LIMIT)
}
