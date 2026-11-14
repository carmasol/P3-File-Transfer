import { createContext } from 'react'
import type { User } from '../api/types'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string) => Promise<User>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
