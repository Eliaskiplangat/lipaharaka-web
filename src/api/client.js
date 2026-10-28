import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_STORAGE_KEY = 'lipaharaka_access_token'

function getSafeStorage() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function getStoredToken() {
  const storage = getSafeStorage()
  if (!storage) return null

  return storage.getItem(TOKEN_STORAGE_KEY) ?? window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? null
}

export function setStoredToken(token) {
  const storage = getSafeStorage()

  try {
    if (token) {
      if (storage) storage.setItem(TOKEN_STORAGE_KEY, token)
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      return
    }

    if (storage) storage.removeItem(TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // Ignore storage errors; the app should still work without persistence.
  }
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const envelope = error.response?.data
    const message = envelope?.error?.message || error.message || 'Something went wrong. Please try again.'
    const violations = envelope?.error?.violations || []
    const wrapped = new Error(message)
    wrapped.status = error.response?.status
    wrapped.code = envelope?.error?.code
    wrapped.violations = violations
    if (wrapped.status === 401) {
      setStoredToken(null)
    }
    return Promise.reject(wrapped)
  },
)
