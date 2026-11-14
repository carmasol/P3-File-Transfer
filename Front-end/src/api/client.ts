/** Client HTTP minimal pour le back-end NestJS. */

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BASE_URL = '/api'

export async function request<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = options

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  if (!response.ok) {
    let message = `Erreur ${response.status}`
    try {
      const data = (await response.json()) as { message?: string | string[] }
      if (data.message) {
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message
      }
    } catch {
      /* réponse non JSON */
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export async function requestBlob(path: string, options: RequestInit = {}): Promise<Blob> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'Téléchargement impossible')
  }
  return response.blob()
}

export function getToken(): string | null {
  return localStorage.getItem('datashare_token')
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem('datashare_token', token)
  } else {
    localStorage.removeItem('datashare_token')
  }
}
