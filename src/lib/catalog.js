import { matchKey } from './itemKey'

export const CATALOG_CURRENCY = 'USD'
export const SEARCH_LIMIT = 8

// Static reference rates. The catalog is priced in USD, so a spoken threshold
// like "under 200 rupees" is converted before it is compared.
const USD_PER_UNIT = { USD: 1, INR: 0.012, EUR: 1.09, GBP: 1.27 }

let pending = null

export function loadCatalog() {
  if (!pending) {
    pending = import('../data/catalog')
      .then((module) => module.default)
      .catch((error) => {
        pending = null
        throw error
      })
  }
  return pending
}

export function effectivePrice(product) {
  return product.salePrice ?? product.price
}

export function toCatalogPrice(amount, currency) {
  if (amount == null) return null
  return amount * (USD_PER_UNIT[currency] ?? 1)
}

function scoreProduct(product, queryKey) {
  if (!queryKey) return 1

  const nameKey = matchKey(product.name)
  if (nameKey === queryKey) return 100

  // Aliases carry the product's name in the other supported languages.
  const aliasKeys = (product.aliases || []).map(matchKey)
  if (aliasKeys.includes(queryKey)) return 95

  if (nameKey.startsWith(queryKey)) return 80
  if (nameKey.includes(queryKey)) return 65

  const haystack = new Set([
    ...nameKey.split(' '),
    ...aliasKeys.flatMap((alias) => alias.split(' ')),
    ...matchKey(product.brand).split(' '),
    matchKey(product.category),
    ...product.tags,
  ])
  const queryTokens = queryKey.split(' ')
  const overlap = queryTokens.filter((token) => haystack.has(token)).length
  if (overlap) return 20 + 30 * (overlap / queryTokens.length)

  return 0
}

export function searchCatalog(catalog, { query = '', filters = {} } = {}, limit = SEARCH_LIMIT) {
  const queryKey = matchKey(query)
  const tags = filters.tags || []
  const maxPrice = toCatalogPrice(filters.maxPrice, filters.currency)
  const minPrice = toCatalogPrice(filters.minPrice, filters.currency)

  const passesFilters = (product) => {
    const price = effectivePrice(product)
    if (maxPrice !== null && price > maxPrice) return false
    if (minPrice !== null && price < minPrice) return false
    return tags.every((tag) => product.tags.includes(tag))
  }

  return catalog
    .map((product) => ({ product, score: scoreProduct(product, queryKey) }))
    .filter(({ product, score }) => score > 0 && passesFilters(product))
    .sort((a, b) => b.score - a.score || effectivePrice(a.product) - effectivePrice(b.product))
    .slice(0, limit)
    .map(({ product }) => product)
}

// A search needs something to go on: a name, a tag, or a price bound.
export function hasSearchCriteria({ query, filters = {} }) {
  return Boolean(
    query || filters.tags?.length || filters.maxPrice !== null || filters.minPrice !== null,
  )
}
