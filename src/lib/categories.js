import { matchKey } from './itemKey'

export const CATEGORIES = [
  { id: 'produce', label: 'Produce' },
  { id: 'dairy', label: 'Dairy & Eggs' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'meat', label: 'Meat & Seafood' },
  { id: 'pantry', label: 'Pantry' },
  { id: 'frozen', label: 'Frozen' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'household', label: 'Household' },
  { id: 'personal', label: 'Personal Care' },
  { id: 'other', label: 'Other' },
]

export const DEFAULT_CATEGORY = 'other'

const CATEGORY_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]))

const ITEM_CATEGORIES = {
  apple: 'produce', apples: 'produce', banana: 'produce', bananas: 'produce',
  orange: 'produce', oranges: 'produce', lemon: 'produce', lemons: 'produce',
  lime: 'produce', grapes: 'produce', mango: 'produce', mangoes: 'produce',
  strawberry: 'produce', strawberries: 'produce', blueberries: 'produce',
  watermelon: 'produce', pineapple: 'produce', pear: 'produce', peach: 'produce',
  avocado: 'produce', tomato: 'produce', tomatoes: 'produce', potato: 'produce',
  potatoes: 'produce', onion: 'produce', onions: 'produce', garlic: 'produce',
  ginger: 'produce', carrot: 'produce', carrots: 'produce', broccoli: 'produce',
  spinach: 'produce', lettuce: 'produce', cabbage: 'produce', cauliflower: 'produce',
  cucumber: 'produce', pepper: 'produce', peppers: 'produce', mushroom: 'produce',
  mushrooms: 'produce', celery: 'produce', corn: 'produce', peas: 'produce',
  beans: 'produce', coriander: 'produce', cilantro: 'produce', chilli: 'produce',
  herbs: 'produce', salad: 'produce', plum: 'produce', melon: 'produce',
  blackberry: 'produce', raspberry: 'produce', cherry: 'produce',
  sweetcorn: 'produce', courgette: 'produce', zucchini: 'produce',
  asparagus: 'produce', radish: 'produce', rhubarb: 'produce',
  watercress: 'produce', 'spring onion': 'produce', 'spring green': 'produce',
  'brussels sprout': 'produce', parsnip: 'produce', cranberry: 'produce',
  clementine: 'produce', pumpkin: 'produce', squash: 'produce', kale: 'produce',
  leek: 'produce', grapefruit: 'produce', pomegranate: 'produce',
  beetroot: 'produce', 'sweet potato': 'produce', 'green bean': 'produce',
  aubergine: 'produce', eggplant: 'produce', okra: 'produce', 'lady finger': 'produce',

  milk: 'dairy', butter: 'dairy', cheese: 'dairy', yogurt: 'dairy', yoghurt: 'dairy',
  cream: 'dairy', curd: 'dairy', paneer: 'dairy', egg: 'dairy', eggs: 'dairy',
  ghee: 'dairy', margarine: 'dairy', 'cream cheese': 'dairy', 'sour cream': 'dairy',
  'almond milk': 'dairy', 'soy milk': 'dairy', 'oat milk': 'dairy',
  'greek yogurt': 'dairy', 'coconut cream': 'dairy', 'vegan cheese': 'dairy',
  lassi: 'dairy', buttermilk: 'dairy', 'condensed milk': 'dairy',

  bread: 'bakery', bun: 'bakery', buns: 'bakery', bagel: 'bakery', bagels: 'bakery',
  croissant: 'bakery', croissants: 'bakery', muffin: 'bakery', muffins: 'bakery',
  cake: 'bakery', tortilla: 'bakery', tortillas: 'bakery', baguette: 'bakery',
  pastry: 'bakery', donut: 'bakery', doughnut: 'bakery', roll: 'bakery', rolls: 'bakery',

  chicken: 'meat', beef: 'meat', pork: 'meat', lamb: 'meat', mutton: 'meat',
  bacon: 'meat', sausage: 'meat', sausages: 'meat', ham: 'meat', turkey: 'meat',
  fish: 'meat', salmon: 'meat', tuna: 'meat', prawns: 'meat', shrimp: 'meat',
  mince: 'meat', steak: 'meat',

  rice: 'pantry', pasta: 'pantry', noodles: 'pantry', flour: 'pantry', sugar: 'pantry',
  salt: 'pantry', oil: 'pantry', 'olive oil': 'pantry', vinegar: 'pantry',
  honey: 'pantry', jam: 'pantry', 'peanut butter': 'pantry', cereal: 'pantry',
  oats: 'pantry', lentils: 'pantry', dal: 'pantry', chickpeas: 'pantry',
  spices: 'pantry', masala: 'pantry', turmeric: 'pantry', cumin: 'pantry',
  ketchup: 'pantry', mayonnaise: 'pantry', mustard: 'pantry', sauce: 'pantry',
  soup: 'pantry', stock: 'pantry', 'baking powder': 'pantry', yeast: 'pantry',
  quinoa: 'pantry', couscous: 'pantry', 'coconut milk': 'pantry',
  tofu: 'pantry', jaggery: 'pantry', gur: 'pantry', stevia: 'pantry',
  maggi: 'pantry', ramen: 'pantry', 'instant noodles': 'pantry',
  atta: 'pantry', maida: 'pantry', suji: 'pantry', rava: 'pantry',
  besan: 'pantry', poha: 'pantry', sabudana: 'pantry', upma: 'pantry',
  rajma: 'pantry', chana: 'pantry', 'chana dal': 'pantry', moong: 'pantry',
  'moong dal': 'pantry', 'toor dal': 'pantry', 'urad dal': 'pantry',
  jeera: 'pantry', haldi: 'pantry', dhania: 'pantry', 'garam masala': 'pantry',
  achar: 'pantry', pickle: 'pantry', 'idli batter': 'pantry', 'dosa batter': 'pantry',

  'ice cream': 'frozen', 'frozen pizza': 'frozen', 'frozen peas': 'frozen',
  'fish fingers': 'frozen', 'french fries': 'frozen',

  water: 'beverages', juice: 'beverages', coffee: 'beverages', tea: 'beverages',
  soda: 'beverages', cola: 'beverages', beer: 'beverages', wine: 'beverages',
  lemonade: 'beverages', smoothie: 'beverages', 'sparkling water': 'beverages',
  'orange juice': 'beverages', 'apple juice': 'beverages',

  chips: 'snacks', crisps: 'snacks', biscuits: 'snacks', cookies: 'snacks',
  chocolate: 'snacks', candy: 'snacks', sweets: 'snacks', nuts: 'snacks',
  almonds: 'snacks', cashews: 'snacks', popcorn: 'snacks', crackers: 'snacks',
  pretzels: 'snacks', granola: 'snacks', 'granola bars': 'snacks',
  kurkure: 'snacks', namkeen: 'snacks', bhujia: 'snacks', sev: 'snacks',
  papad: 'snacks', mathri: 'snacks', 'dark chocolate': 'snacks',
  wafers: 'snacks', 'protein bar': 'snacks',

  detergent: 'household', soap: 'household', 'dish soap': 'household',
  'washing powder': 'household', bleach: 'household', 'toilet paper': 'household',
  tissues: 'household', 'paper towels': 'household', 'bin bags': 'household',
  'trash bags': 'household', sponge: 'household', foil: 'household',
  'cling film': 'household', batteries: 'household', 'light bulb': 'household',
  candles: 'household',

  shampoo: 'personal', conditioner: 'personal', toothpaste: 'personal',
  toothbrush: 'personal', deodorant: 'personal', razor: 'personal',
  razors: 'personal', sunscreen: 'personal', moisturiser: 'personal',
  moisturizer: 'personal', lotion: 'personal', 'body wash': 'personal',
  'hand wash': 'personal', 'face wash': 'personal', vitamins: 'personal',
  painkillers: 'personal', plasters: 'personal', 'sanitary pads': 'personal',

  दूध: 'dairy', अंडे: 'dairy', पनीर: 'dairy', दही: 'dairy',
  ब्रेड: 'bakery', चावल: 'pantry', आटा: 'pantry', चीनी: 'pantry',
  नमक: 'pantry', तेल: 'pantry', सेब: 'produce', केला: 'produce',
  प्याज: 'produce', आलू: 'produce', टमाटर: 'produce', पानी: 'beverages',
  चाय: 'beverages',

  leche: 'dairy', huevos: 'dairy', queso: 'dairy', pan: 'bakery',
  arroz: 'pantry', manzanas: 'produce', 'plátanos': 'produce', agua: 'beverages',
  lait: 'dairy', oeufs: 'dairy', fromage: 'dairy', pommes: 'produce',
  riz: 'pantry', eau: 'beverages',
}

// Plurals are unpredictable in the table above, so every key is also indexed
// by its singular form. That way "peaches" finds "peach" and "grape" finds
// "grapes" without listing both spellings by hand.
const SINGULAR_INDEX = {}
for (const [key, value] of Object.entries(ITEM_CATEGORIES)) {
  const singular = matchKey(key)
  if (!(singular in SINGULAR_INDEX)) SINGULAR_INDEX[singular] = value
}

function lookup(phrase) {
  return ITEM_CATEGORIES[phrase] || SINGULAR_INDEX[matchKey(phrase)] || null
}

// Checked before the lookup table so "frozen peas" beats "peas".
const PREFIX_RULES = [
  { test: /\bfrozen\b/, category: 'frozen' },
  { test: /\bice cream\b/, category: 'frozen' },
]

// Checked after the lookup table, for products it does not list by name.
const KEYWORD_RULES = [
  { test: /\b(juice|soda|water|tea|coffee|drink|cola|beer|wine)\b/, category: 'beverages' },
  { test: /\b(shampoo|soap|toothpaste|deodorant|razor|lotion|cream wash)\b/, category: 'personal' },
  { test: /\b(detergent|cleaner|wipes|tissue|tissues|towels|bags|bulb)\b/, category: 'household' },
  { test: /\b(bread|bun|roll|cake|pastry)\b/, category: 'bakery' },
  { test: /\b(chips|biscuit|biscuits|cookie|cookies|chocolate|snack|snacks)\b/, category: 'snacks' },
  { test: /\b(chicken|fish|meat|mutton|beef|pork)\b/, category: 'meat' },
  { test: /\b(milk|cheese|yogurt|yoghurt|butter)\b/, category: 'dairy' },
  { test: /\b(sauce|masala|powder|flour|oil|spice|spices)\b/, category: 'pantry' },
]

export function categorize(name) {
  const text = String(name || '').toLowerCase().trim()
  if (!text) return DEFAULT_CATEGORY

  for (const rule of PREFIX_RULES) {
    if (rule.test.test(text)) return rule.category
  }

  const direct = lookup(text)
  if (direct) return direct

  // Scanned right to left because the head noun comes last: "mango juice" is
  // a drink, not produce.
  const tokens = text.split(/\s+/)
  for (let size = 2; size >= 1; size -= 1) {
    for (let i = tokens.length - size; i >= 0; i -= 1) {
      const found = lookup(tokens.slice(i, i + size).join(' '))
      if (found) return found
    }
  }

  for (const rule of KEYWORD_RULES) {
    if (rule.test.test(text)) return rule.category
  }

  return DEFAULT_CATEGORY
}

export function getCategory(id) {
  return CATEGORY_BY_ID.get(id) || CATEGORY_BY_ID.get(DEFAULT_CATEGORY)
}
