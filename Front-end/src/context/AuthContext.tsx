import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { User } from '../api/types'
import { AuthContext } from './authTypes'
import type { AuthContextValue } from './authTypes'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    authApi
      .currentUser()
      .then((u) => {
        if (!cancelled) setUser(u)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const u = await authApi.login(email, password)
        setUser(u)
        return u
      },
      signUp: async (email, password) => {
        const u = await authApi.register(email, password)
        setUser(u)
        return u
      },
      signOut: () => {
        authApi.logout()
        setUser(null)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
