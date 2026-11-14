/**
 * Mode mock : simule le back-end NestJS tant que les endpoints réels ne
 * sont pas disponibles. Les données vivent en mémoire (perdues au
 * rechargement), ce qui permet de développer et tester le front.
 *
 * Désactivable avec VITE_USE_MOCK=false dans .env local.
 */
import type { ShareFile, ShareInfo, UploadResult, User } from './types'

export const MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

type MockFile = ShareFile & {
  password?: string
  content: string
}

const users = new Map<string, { id: string; email: string; password: string; name: string }>()
const tokens = new Map<string, string>() // token de session -> userId
const files = new Map<string, MockFile>() // shareToken -> fichier
const userFiles = new Map<string, Set<string>>() // userId -> shareTokens

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

const uuid = () => crypto.randomUUID()

const SESSION_KEY = 'datashare_mock_session'

function saveSession(userId: string | null) {
  if (userId) {
    localStorage.setItem(SESSION_KEY, userId)
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

function restoreSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

function newToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function addDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

function isExpired(file: MockFile): boolean {
  return new Date(file.expiresAt).getTime() < Date.now()
}

/** Crée quelques fichiers de démonstration pour un nouvel utilisateur. */
function seedFiles(userId: string): void {
  const samples: Array<Pick<MockFile, 'name' | 'mimeType' | 'sizeBytes' | 'expiresAt'>> = [
    {
      name: 'IMG_9210_123123123123123221.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 2.6 * 1024 * 1024,
      expiresAt: addDays(3),
    },
    {
      name: 'tempus.mp3',
      mimeType: 'audio/mpeg',
      sizeBytes: 3.1 * 1024 * 1024,
      expiresAt: addDays(7),
    },
    {
      name: 'vacances_amsterdam.mp4',
      mimeType: 'video/mp4',
      sizeBytes: 84.2 * 1024 * 1024,
      expiresAt: addDays(-3), // déjà expiré
    },
  ]

  for (const sample of samples) {
    const shareToken = newToken()
    files.set(shareToken, {
      id: uuid(),
      shareToken,
      ...sample,
      uploadedAt: new Date().toISOString(),
      status: 'active',
      hasPassword: false,
      content: SAMPLE_CONTENT,
    })
    userFiles.get(userId)?.add(shareToken)
  }
}

function toShareFile(file: MockFile): ShareFile {
  const { password: _password, content: _content, ...rest } = file
  return rest
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function mockLogin(email: string, password: string): Promise<{ token: string; user: User }> {
  await delay()
  const user = [...users.values()].find((u) => u.email === email)
  if (!user || user.password !== password) {
    throw new Error('Email ou mot de passe incorrect.')
  }
  const token = newToken()
  tokens.set(token, user.id)
  saveSession(user.id)
  return { token, user: { id: user.id, email: user.email, name: user.name } }
}

export async function mockRegister(email: string, password: string): Promise<{ token: string; user: User }> {
  await delay()
  if (password.length < 8) {
    throw new Error('Le mot de passe doit contenir au moins 8 caractères.')
  }
  if ([...users.values()].some((u) => u.email === email)) {
    throw new Error('Un compte existe déjà avec cet email.')
  }
  const id = uuid()
  const name = email.split('@')[0]
  const user = { id, email, password, name }
  users.set(id, user)
  userFiles.set(id, new Set())
  seedFiles(id)
  const token = newToken()
  tokens.set(token, id)
  saveSession(id)
  return { token, user: { id, email, name } }
}

export async function mockCurrentUser(): Promise<User | null> {
  await delay(150)
  const userId = restoreSession()
  if (!userId) return null
  const user = users.get(userId)
  if (!user) return null
  return { id: user.id, email: user.email, name: user.name }
}

export function mockLogout(): void {
  saveSession(null)
}

/* ------------------------------------------------------------------ */
/* Fichiers                                                            */
/* ------------------------------------------------------------------ */

const SAMPLE_CONTENT = 'Contenu de démonstration — DataShare (mode mock).'

export async function mockUpload(
  userId: string | null,
  file: File,
  options: { password?: string; expiresInDays: number },
): Promise<UploadResult> {
  await delay(700)
  if (file.size > 1024 * 1024 * 1024) {
    throw new Error('La taille des fichiers est limitée à 1 Go.')
  }

  const shareToken = newToken()
  const expiresAt = addDays(options.expiresInDays)
  const mockFile: MockFile = {
    id: uuid(),
    shareToken,
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    sizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
    expiresAt,
    status: 'active',
    hasPassword: Boolean(options.password),
    password: options.password,
    content: SAMPLE_CONTENT,
  }
  files.set(shareToken, mockFile)
  if (userId) {
    userFiles.get(userId)?.add(shareToken)
  }
  return { shareToken, shareUrl: `${window.location.origin}/share/${shareToken}`, expiresAt }
}

export async function mockListFiles(userId: string | null): Promise<ShareFile[]> {
  await delay(300)
  if (!userId) return []
  const tokensForUser = userFiles.get(userId) ?? new Set<string>()
  return [...tokensForUser]
    .map((token) => files.get(token))
    .filter((file): file is MockFile => Boolean(file))
    .map((file): ShareFile => ({ ...toShareFile(file), status: isExpired(file) ? 'expired' : 'active' }))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
}

export async function mockDeleteFile(userId: string | null, fileId: string): Promise<void> {
  await delay(300)
  if (!userId) return
  const tokensForUser = userFiles.get(userId)
  if (!tokensForUser) return
  for (const token of tokensForUser) {
    const file = files.get(token)
    if (file && file.id === fileId) {
      files.delete(token)
      tokensForUser.delete(token)
    }
  }
}

export async function mockShareInfo(token: string): Promise<ShareInfo> {
  await delay(300)
  const file = files.get(token)
  if (!file) {
    throw new Error('Ce fichier n\'existe pas ou n\'est plus disponible.')
  }
  return {
    name: file.name,
    sizeBytes: file.sizeBytes,
    expiresAt: file.expiresAt,
    expired: isExpired(file),
    requiresPassword: Boolean(file.password),
  }
}

export async function mockDownload(token: string, password?: string): Promise<Blob> {
  await delay(500)
  const file = files.get(token)
  if (!file || isExpired(file)) {
    throw new Error('Ce fichier n\'est plus disponible.')
  }
  if (file.password && file.password !== password) {
    throw new Error('Mot de passe incorrect.')
  }
  return new Blob([file.content], { type: file.mimeType })
}
