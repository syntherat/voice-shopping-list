import { Loader2, Plus, Search, SearchX, Tag, TriangleAlert, X } from 'lucide-react'
import { effectivePrice } from '../lib/catalog'
import SectionHeading from './SectionHeading'

const price = (value) => `$${value.toFixed(2)}`

function describeSearch({ query, filters }) {
  const parts = [...filters.tags]
  if (query) parts.push(query)
  if (filters.minPrice !== null && filters.maxPrice !== null) {
    parts.push(`${filters.minPrice}–${filters.maxPrice}`)
  } else if (filters.maxPrice !== null) {
    parts.push(`under ${filters.maxPrice}`)
  } else if (filters.minPrice !== null) {
    parts.push(`over ${filters.minPrice}`)
  }
  return parts.join(' · ')
}

function ResultRow({ product, onAdd }) {
  const onSale = product.salePrice != null

  return (
    <li className="flex items-center gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[15px] text-neutral-100">{product.name}</p>
          {onSale && (
            <span className="flex shrink-0 items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-300">
              <Tag className="h-2.5 w-2.5" aria-hidden="true" />
              Sale
            </span>
          )}
        </div>
        <p className="truncate text-xs text-neutral-500">
          {product.brand} · {product.size}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={`text-sm tabular-nums ${onSale ? 'text-emerald-400' : 'text-neutral-300'}`}
        >
          {price(effectivePrice(product))}
        </p>
        {onSale && (
          <p className="text-xs tabular-nums text-neutral-600 line-through">
            {price(product.price)}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onAdd(product.name)}
        aria-label={`Add ${product.name}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 transition-colors hover:bg-emerald-600 hover:text-white"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  )
}

export default function SearchResults({ search, onAdd, onClose }) {
  if (!search) return null

  return (
    <section className="space-y-2 rounded-2xl border border-border-subtle bg-surface-raised p-4">
      <SectionHeading
        icon={Search}
        trailing={
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search results"
            className="shrink-0 rounded-md p-0.5 text-neutral-600 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        }
      >
        {describeSearch(search) || 'Search'}
      </SectionHeading>

      {search.loading && (
        <div className="flex items-center gap-2 py-6 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" aria-hidden="true" />
          Searching products…
        </div>
      )}

      {search.error && (
        <div className="flex items-start gap-2 py-4 text-sm text-rose-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{search.error}</p>
        </div>
      )}

      {!search.loading &&
        !search.error &&
        (search.results.length ? (
          <ul className="divide-y divide-neutral-800/60">
            {search.results.map((product) => (
              <ResultRow key={product.id} product={product} onAdd={onAdd} />
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-2 py-4 text-sm text-neutral-500">
            <SearchX className="h-4 w-4 shrink-0" aria-hidden="true" />
            No products matched that search.
          </div>
        ))}
    </section>
  )
}
