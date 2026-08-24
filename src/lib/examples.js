const EXAMPLES = {
  en: [
    'Add two bottles of milk',
    'I need apples and bread',
    'Remove milk from my list',
    'Replace milk with almond milk',
    'Find organic apples under $5',
    'Change apples to 3',
    'Clear my list',
  ],
  hi: [
    'दो सेब जोड़ो',
    'मुझे दूध चाहिए',
    'ब्रेड हटा दो',
    'चावल 500 रुपये से कम ढूंढो',
    'लिस्ट साफ करो',
  ],
  es: [
    'Agrega dos botellas de leche',
    'Necesito pan y huevos',
    'Quita la leche de mi lista',
    'Reemplaza la leche por leche de almendras',
    'Busca manzanas menos de 5 dolares',
    'Borra la lista',
  ],
  fr: [
    'Ajoute deux bouteilles de lait',
    'Il me faut du pain',
    'Enlève le lait de ma liste',
    'Remplace le pain par des croissants',
    'Cherche des pommes moins de 5 euros',
    'Efface la liste',
  ],
}

export function getExamples(tag = 'en-US') {
  return EXAMPLES[String(tag).toLowerCase().split('-')[0]] || EXAMPLES.en
}

export { EXAMPLES }
