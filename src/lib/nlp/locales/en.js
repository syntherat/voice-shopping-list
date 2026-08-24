export default {
  code: 'en',

  intents: {
    CLEAR: [
      'clear my list', 'clear the list', 'clear my shopping list', 'clear list',
      'clear everything', 'clear all', 'empty my list', 'empty the list',
      'start over', 'start again', 'delete everything', 'remove everything',
      'remove all items', 'delete all items', 'remove all', 'delete all',
    ],
    REPLACE: ['replace', 'swap out', 'swap', 'switch out', 'switch', 'substitute'],
    UPDATE_QUANTITY: ['change', 'update', 'make it', 'set'],
    SEARCH: [
      'search for', 'search', 'find me', 'find', 'look for', 'look up',
      'show me', 'do you have', 'is there',
    ],
    REMOVE: [
      'remove', 'delete', 'take off', 'take out', 'cross off', 'get rid of',
      'drop', 'i dont need', 'i do not need', 'no longer need', 'dont need',
    ],
    ADD: [
      'add', 'i need to buy', 'i have to buy', 'i want to buy', 'i need',
      'i want', 'i would like', 'id like', 'we need', 'put', 'buy',
      'get me', 'pick up', 'grab', 'include', 'append', 'order', 'get',
      // Bare verbs so any subject works: "my friend wants", "she needs".
      'wants', 'want', 'needs', 'need',
    ],
  },

  numberWords: {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
    eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15,
    twenty: 20, thirty: 30, fifty: 50, hundred: 100, half: 0.5,
  },

  quantityPhrases: {
    'a dozen': { quantity: 1, unit: 'dozen' },
    'one dozen': { quantity: 1, unit: 'dozen' },
    'half a dozen': { quantity: 6 },
    'half dozen': { quantity: 6 },
    'a couple of': { quantity: 2 },
    'a couple': { quantity: 2 },
    'a pair of': { quantity: 2 },
    'a few': { quantity: 3 },
    'half a kilo': { quantity: 0.5, unit: 'kg' },
    'half kilo': { quantity: 0.5, unit: 'kg' },
    'quarter kilo': { quantity: 0.25, unit: 'kg' },
    'half a litre': { quantity: 0.5, unit: 'l' },
    'half a liter': { quantity: 0.5, unit: 'l' },
  },

  units: {
    bottle: 'bottle', bottles: 'bottle',
    can: 'can', cans: 'can',
    pack: 'pack', packs: 'pack', packet: 'packet', packets: 'packet',
    box: 'box', boxes: 'box',
    bag: 'bag', bags: 'bag',
    jar: 'jar', jars: 'jar',
    tin: 'tin', tins: 'tin',
    carton: 'carton', cartons: 'carton',
    loaf: 'loaf', loaves: 'loaf',
    bunch: 'bunch', bunches: 'bunch',
    piece: 'piece', pieces: 'piece',
    slice: 'slice', slices: 'slice',
    cup: 'cup', cups: 'cup',
    dozen: 'dozen', dozens: 'dozen',
    kg: 'kg', kilo: 'kg', kilos: 'kg', kilogram: 'kg', kilograms: 'kg',
    g: 'g', gm: 'g', gram: 'g', grams: 'g',
    l: 'l', litre: 'l', litres: 'l', liter: 'l', liters: 'l',
    ml: 'ml', millilitre: 'ml', millilitres: 'ml',
    lb: 'lb', lbs: 'lb', pound: 'lb', pounds: 'lb',
    oz: 'oz', ounce: 'oz', ounces: 'oz',
  },

  tags: {
    organic: 'organic',
    'gluten free': 'gluten-free',
    'sugar free': 'sugar-free',
    'fat free': 'fat-free',
    'low fat': 'low-fat',
    'whole grain': 'whole-grain',
    'whole wheat': 'whole-wheat',
    unsalted: 'unsalted',
    vegan: 'vegan',
    diet: 'diet',
    fresh: 'fresh',
    frozen: 'frozen',
  },

  currencyWords: {
    dollar: 'USD', dollars: 'USD', bucks: 'USD', usd: 'USD',
    rupee: 'INR', rupees: 'INR', rs: 'INR', inr: 'INR',
    euro: 'EUR', euros: 'EUR', eur: 'EUR',
    pound: 'GBP', pounds: 'GBP', gbp: 'GBP',
  },

  priceWords: {
    max: {
      prefix: [
        'under', 'below', 'less than', 'cheaper than', 'within', 'up to',
        'no more than', 'not more than', 'at most', 'max', 'maximum',
      ],
      suffix: ['or less', 'or cheaper'],
    },
    min: {
      prefix: ['over', 'above', 'more than', 'at least', 'starting at', 'minimum'],
      suffix: ['or more'],
    },
    between: ['between', 'from'],
  },

  forwardReplace: [],
  reversedReplace: ['instead of', 'in place of', 'rather than'],

  // Where the item sits relative to the verb.
  objectPosition: 'after',

  rangeJoiners: ['and', 'to'],
  updateSeparators: ['to'],
  replaceSeparators: ['with', 'for', 'into', 'by', 'to'],
  conjunctions: ['and', 'plus', 'as well as', 'along with'],
  connectors: ['of'],

  listPhrases: [
    'to my shopping list', 'from my shopping list', 'on my shopping list',
    'to the shopping list', 'from the shopping list', 'to my list',
    'from my list', 'on my list', 'in my list', 'to the list', 'from the list',
    'on the list', 'my shopping list', 'the shopping list', 'shopping list',
    'my list', 'the list',
  ],

  fillers: [
    'instead of that', 'in its place', 'in place of that', 'in that place',
    'please', 'can you', 'could you', 'would you', 'i think', 'for me',
    'right now', 'as well', 'also', 'okay', 'ok',
  ],

  stopwords: [
    'the', 'a', 'an', 'some', 'any', 'my', 'me', 'more', 'it', 'that', 'this',
    'to', 'from', 'on', 'for', 'in', 'of', 'and', 'please', 'list', 'items',
    'item', 'we', 'i', 'those', 'these', 'one', 'ones',
  ],
}
