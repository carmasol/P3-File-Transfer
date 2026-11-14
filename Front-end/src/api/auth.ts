import { request, setToken } from './client'
import { MOCK, mockCurrentUser, mockLogin, mockLogout, mockRegister } from './mock'
import type { User } from './types'

type AuthResponse = { token: string; user: User }

export async function login(email: string, password: string): Promise<User> {
  if (MOCK) {
    const { user } = await mockLogin(email, password)
    return user
  }
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    json: { email, password },
  })
  setToken(data.token)
  return data.user
}

export async function register(email: string, password: string): Promise<User> {
  if (MOCK) {
    const { user } = await mockRegister(email, password)
    return user
  }
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    json: { email, password },
  })
  setToken(data.token)
  return data.user
}

export async function currentUser(): Promise<User | null> {
  if (MOCK) {
    return mockCurrentUser()
  }
  if (!localStorage.getItem('datashare_token')) return null
  try {
    return await request<User>('/auth/me')
  } catch {
    setToken(null)
    return null
  }
}

export function logout(): void {
  if (MOCK) {
    mockLogout()
    return
  }
  setToken(null)
}
