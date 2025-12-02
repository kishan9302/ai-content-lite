// Simple safe localStorage helpers for storing JSON
export function safeGetJSON<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch (err) {
    // Parsing may fail if data is corrupted
    console.error('safeGetJSON parse error', err)
    return null
  }
}

export function safeSetJSON<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('safeSetJSON error', err)
  }
}
