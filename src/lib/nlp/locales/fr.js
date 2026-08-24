export default {
  code: 'fr',

  intents: {
    CLEAR: ['vide ma liste', 'efface la liste', 'efface ma liste', 'supprime tout', 'efface tout'],
    REPLACE: ['remplace', 'remplacer', 'echange', 'échange'],
    UPDATE_QUANTITY: ['change', 'modifie', 'mets a jour', 'mets à jour'],
    SEARCH: ['cherche', 'rechercher', 'recherche', 'trouve', 'montre moi', 'affiche'],
    REMOVE: ['je ne veux plus', 'enleve', 'enlève', 'supprime', 'retire', 'efface'],
    ADD: [
      'je veux acheter', 'il me faut', 'ajoute', 'ajouter', 'achete', 'achète',
      'acheter', 'prends', 'je veux', 'mets', 'met',
    ],
  },

  numberWords: {
    un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7,
    huit: 8, neuf: 9, dix: 10, douze: 12, vingt: 20, demi: 0.5,
  },

  quantityPhrases: {
    'une douzaine': { quantity: 1, unit: 'dozen' },
    'une demi douzaine': { quantity: 6 },
    'demi kilo': { quantity: 0.5, unit: 'kg' },
  },

  units: {
    kilo: 'kg', kilos: 'kg', gramme: 'g', grammes: 'g', litre: 'l', litres: 'l',
    bouteille: 'bottle', bouteilles: 'bottle', paquet: 'pack', paquets: 'pack',
    boite: 'box', 'boîte': 'box', boites: 'box', 'boîtes': 'box',
    douzaine: 'dozen', sachet: 'bag', sachets: 'bag',
    tranche: 'slice', tranches: 'slice',
  },

  tags: {
    bio: 'organic', frais: 'fresh', surgele: 'frozen', 'surgelé': 'frozen',
    'sans gluten': 'gluten-free', 'sans sucre': 'sugar-free',
  },

  currencyWords: { euro: 'EUR', euros: 'EUR' },

  priceWords: {
    max: { prefix: ['moins de', 'en dessous de', 'jusqua', 'sous', 'maximum'], suffix: ['ou moins'] },
    min: { prefix: ['plus de', 'au dessus de', 'au moins'], suffix: ['ou plus'] },
    between: ['entre'],
  },

  forwardReplace: [],
  reversedReplace: ['au lieu de', 'a la place de', 'à la place de'],

  // Where the item sits relative to the verb.
  objectPosition: 'after',

  rangeJoiners: ['et', 'a', 'à'],
  updateSeparators: ['a', 'à'],
  replaceSeparators: ['par', 'avec'],
  conjunctions: ['et', 'ainsi que'],
  connectors: ['de', 'des', 'du'],

  listPhrases: [
    'a ma liste de courses', 'à ma liste de courses', 'de ma liste de courses',
    'a ma liste', 'à ma liste', 'de ma liste', 'sur ma liste', 'ma liste', 'la liste',
  ],

  fillers: [
    'au lieu de ca', 'au lieu de ça', 'a sa place','sil vous plait', 'sil vous plaît', 'stp', 'svp'],

  stopwords: [
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'a', 'à', 'mon', 'ma',
    'mes', 'me', 'moi', 'et', 'liste',
  ],
}
