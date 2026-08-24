// Hindi puts the verb last, so intent phrases are matched anywhere in the
// utterance rather than only at the start.
export default {
  code: 'hi',

  intents: {
    CLEAR: ['लिस्ट साफ करो', 'सूची साफ करो', 'लिस्ट खाली करो', 'सब हटा दो', 'सब कुछ हटा दो', 'सारा हटा दो'],
    UPDATE_QUANTITY: ['बदल दो', 'बदलो'],
    SEARCH: ['ढूंढो', 'ढूंढ दो', 'खोजो', 'दिखाओ', 'सर्च करो'],
    REMOVE: ['नहीं चाहिए', 'हटा दो', 'हटाओ', 'निकाल दो', 'निकालो', 'मिटा दो', 'डिलीट करो'],
    ADD: ['जोड़ दो', 'जोड़ो', 'डाल दो', 'डालो', 'ऐड करो', 'खरीदना है', 'लेना है', 'लाना है', 'चाहिए'],
  },

  numberWords: {
    एक: 1, दो: 2, तीन: 3, चार: 4, पांच: 5, पाँच: 5, छह: 6, छे: 6,
    सात: 7, आठ: 8, नौ: 9, दस: 10, बारह: 12, आधा: 0.5,
  },

  quantityPhrases: {
    'आधा किलो': { quantity: 0.5, unit: 'kg' },
    'एक दर्जन': { quantity: 1, unit: 'dozen' },
    'आधा दर्जन': { quantity: 6 },
  },

  units: {
    किलो: 'kg', किलोग्राम: 'kg', ग्राम: 'g', लीटर: 'l', मिलीलीटर: 'ml',
    बोतल: 'bottle', पैकेट: 'packet', डिब्बा: 'box', डिब्बे: 'box',
    दर्जन: 'dozen', टुकड़ा: 'piece', टुकड़े: 'piece',
  },

  tags: { 'ऑर्गेनिक': 'organic', 'ताजा': 'fresh', 'ताज़ा': 'fresh' },

  currencyWords: { 'रुपये': 'INR', 'रुपए': 'INR', 'रुपया': 'INR', 'रु': 'INR' },

  priceWords: {
    max: { prefix: [], suffix: ['से कम', 'से नीचे', 'के अंदर', 'तक'] },
    min: { prefix: [], suffix: ['से ज्यादा', 'से अधिक', 'से ऊपर'] },
    between: [],
  },

  rangeJoiners: ['और'],
  updateSeparators: [],
  conjunctions: ['और'],
  connectors: [],

  listPhrases: [
    'मेरी शॉपिंग लिस्ट में', 'मेरी लिस्ट में', 'मेरी सूची में', 'मेरी लिस्ट से',
    'लिस्ट में', 'सूची में', 'लिस्ट से', 'सूची से',
  ],

  fillers: ['प्लीज', 'कृपया', 'जरा', 'ज़रा'],

  stopwords: [
    'मुझे', 'मेरी', 'मेरा', 'में', 'से', 'का', 'के', 'की', 'को', 'है', 'हैं',
    'और', 'कुछ', 'थोड़ा', 'कर',
  ],
}
