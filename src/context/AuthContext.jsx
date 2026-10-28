import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'
import { getStoredToken, setStoredToken } from '../api/client'

const AuthContext = createContext(null)

// The JWT itself carries { sub: userId, role, iat, exp } (see backend JwtService), but rather
// than decode it client-side we keep the small set of fields we actually need — userId,
// fullName, role — in sessionStorage alongside the token, set once at login/register time.
// This keeps the user session alive during the active tab lifecycle without persisting it across
// browser restarts, which is a safer default for a finance app than keeping JWTs in localStorage.
const PROFILE_STORAGE_KEY = 'lipaharaka_profile'

function loadStoredProfile() {
  try {
    const raw = window.sessionStorage.getItem(PROFILE_STORAGE_KEY) ?? window.localStorage.getItem(PROFILE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getStoredToken() ? loadStoredProfile() : null))
  const [loading, setLoading] = useState(false)

  const persistSession = useCallback((authResponse) => {
    const { accessToken, userId, fullName, role } = authResponse
    setStoredToken(accessToken)
    const profile = { userId, fullName, role }

    try {
      window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
      window.localStorage.removeItem(PROFILE_STORAGE_KEY)
    } catch {
      // Ignore storage failures; the app should still function with in-memory auth.
    }

    setUser(profile)
  }, [])

  const login = useCallback(
    async (phoneNumber, password) => {
      setLoading(true)
      try {
        const res = await authApi.login({ phoneNumber, password })
        persistSession(res)
        return res
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const register = useCallback(
    async ({ phoneNumber, fullName, password, otpCode }) => {
      setLoading(true)
      try {
        const res = await authApi.register({ phoneNumber, fullName, password, otpCode })
        persistSession(res)
        return res
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    setStoredToken(null)
    try {
      window.sessionStorage.removeItem(PROFILE_STORAGE_KEY)
      window.localStorage.removeItem(PROFILE_STORAGE_KEY)
    } catch {
      // Ignore storage cleanup errors.
    }
    setUser(null)
  }, [])

  // If a 401 clears the token elsewhere (see the response interceptor in api/client.js),
  // pick that up on the next render so the UI reflects the logged-out state.
  useEffect(() => {
    if (!getStoredToken() && user) {
      setUser(null)
    }
  }, [user])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
