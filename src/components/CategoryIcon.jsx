import {
  Beef,
  Carrot,
  Cookie,
  Croissant,
  CupSoda,
  Droplets,
  Milk,
  ShoppingBasket,
  Snowflake,
  SprayCan,
  Wheat,
} from 'lucide-react'

// Icons live here rather than in lib/categories so the category data stays
// plain data, importable by tests without pulling in React.
const CATEGORY_ICONS = {
  produce: Carrot,
  dairy: Milk,
  bakery: Croissant,
  meat: Beef,
  pantry: Wheat,
  frozen: Snowflake,
  beverages: CupSoda,
  snacks: Cookie,
  household: SprayCan,
  personal: Droplets,
  other: ShoppingBasket,
}

export default function CategoryIcon({ category, className = 'h-4 w-4' }) {
  const Icon = CATEGORY_ICONS[category] || ShoppingBasket
  return <Icon className={className} aria-hidden="true" />
}
