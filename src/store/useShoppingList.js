import { useEffect, useReducer } from 'react'
import { initialState, listReducer } from './listReducer'

const STORAGE_KEY = 'vsl.list'

function readStoredState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed?.items)) return null
    return {
      items: parsed.items,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    }
  } catch {
    return null
  }
}

export function useShoppingList() {
  const [state, dispatch] = useReducer(listReducer, initialState, (base) => ({
    ...base,
    ...(readStoredState() || {}),
  }))

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, history: state.history }),
      )
    } catch {
      // Private mode or a full quota: the list still works for this session.
    }
  }, [state.items, state.history])

  return [state, dispatch]
}
