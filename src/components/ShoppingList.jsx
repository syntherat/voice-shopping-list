import { ListChecks, ShoppingBasket } from 'lucide-react'
import { CATEGORIES } from '../lib/categories'
import CategoryIcon from './CategoryIcon'
import ItemRow from './ItemRow'
import SectionHeading from './SectionHeading'

function groupByCategory(items) {
  return CATEGORIES.map((category) => ({
    ...category,
    items: items.filter((item) => item.category === category.id),
  })).filter((group) => group.items.length > 0)
}

export default function ShoppingList({ items, onToggle, onStep, onRemove }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-subtle px-4 py-10 text-center">
        <ShoppingBasket className="h-7 w-7 text-neutral-700" aria-hidden="true" />
        <p className="mt-3 text-sm text-neutral-500">Your list is empty.</p>
        <p className="mt-1 text-sm text-neutral-600">Say &ldquo;add milk&rdquo; to start.</p>
      </div>
    )
  }

  const groups = groupByCategory(items)
  const checked = items.filter((item) => item.checked).length

  return (
    <section className="space-y-5">
      <SectionHeading
        icon={ListChecks}
        trailing={
          <span className="shrink-0 text-xs tabular-nums text-neutral-600">
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {checked > 0 && ` · ${checked} done`}
          </span>
        }
      >
        Your list
      </SectionHeading>

      {groups.map((group) => (
        <div key={group.id}>
          <div className="flex items-center gap-2 border-b border-border-subtle pb-1.5 text-neutral-500">
            <CategoryIcon category={group.id} className="h-3.5 w-3.5" />
            <h3 className="text-xs font-medium uppercase tracking-wide">{group.label}</h3>
          </div>
          <ul className="divide-y divide-neutral-800/60">
            {group.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={onToggle}
                onStep={onStep}
                onRemove={onRemove}
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
