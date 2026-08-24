const singular = (word) =>
  word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word

// Loose key so "apples" and "Apple" refer to the same product.
export function matchKey(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(singular)
    .join(' ')
}
