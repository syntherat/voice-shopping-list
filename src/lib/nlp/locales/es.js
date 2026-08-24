export default {
  code: 'es',

  intents: {
    CLEAR: ['borra la lista', 'limpia la lista', 'vacia la lista', 'vacía la lista', 'borra todo', 'elimina todo'],
    REPLACE: ['reemplaza', 'reemplazar', 'sustituye', 'sustituir'],
    UPDATE_QUANTITY: ['cambia', 'cambiar', 'actualiza'],
    SEARCH: ['busca', 'buscar', 'encuentra', 'muestrame', 'muéstrame', 'enseñame', 'enséñame'],
    REMOVE: ['ya no necesito', 'no necesito', 'quita', 'quitar', 'elimina', 'borra', 'saca', 'retira'],
    ADD: [
      'quiero comprar', 'necesito comprar', 'agrega', 'agregar', 'añade',
      'anade', 'añadir', 'necesito', 'quiero', 'compra', 'comprar', 'dame', 'pon',
    ],
  },

  numberWords: {
    un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
    siete: 7, ocho: 8, nueve: 9, diez: 10, doce: 12, veinte: 20,
    medio: 0.5, media: 0.5,
  },

  quantityPhrases: {
    'media docena': { quantity: 6 },
    'una docena': { quantity: 1, unit: 'dozen' },
    'medio kilo': { quantity: 0.5, unit: 'kg' },
    'un par de': { quantity: 2 },
  },

  units: {
    kilo: 'kg', kilos: 'kg', gramo: 'g', gramos: 'g', litro: 'l', litros: 'l',
    botella: 'bottle', botellas: 'bottle', paquete: 'pack', paquetes: 'pack',
    caja: 'box', cajas: 'box', lata: 'can', latas: 'can',
    docena: 'dozen', docenas: 'dozen', bolsa: 'bag', bolsas: 'bag',
  },

  tags: {
    organico: 'organic', 'orgánico': 'organic', fresco: 'fresh',
    congelado: 'frozen', 'sin gluten': 'gluten-free',
    'sin azucar': 'sugar-free', 'sin azúcar': 'sugar-free',
  },

  currencyWords: { euro: 'EUR', euros: 'EUR', dolares: 'USD', 'dólares': 'USD' },

  priceWords: {
    max: { prefix: ['menos de', 'por debajo de', 'hasta', 'maximo', 'máximo'], suffix: ['o menos'] },
    min: { prefix: ['mas de', 'más de', 'por encima de', 'al menos'], suffix: ['o mas', 'o más'] },
    between: ['entre'],
  },

  // Where the item sits relative to the verb.
  objectPosition: 'after',

  rangeJoiners: ['y', 'a'],
  updateSeparators: ['a'],
  replaceSeparators: ['por', 'con'],
  conjunctions: ['y', 'e', 'tambien', 'también'],
  connectors: ['de', 'del'],

  listPhrases: [
    'a mi lista de compras', 'de mi lista de compras', 'a mi lista',
    'de mi lista', 'en mi lista', 'a la lista', 'de la lista', 'mi lista', 'la lista',
  ],

  fillers: ['por favor', 'porfavor'],

  stopwords: [
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
    'a', 'mi', 'me', 'y', 'algo', 'algunos', 'lista',
  ],
}
