/** Types partagés entre l'API et les pages. */

export type User = {
  id: string
  email: string
  name?: string
}

/** Fichier visible dans « Mon espace ». */
export type ShareFile = {
  id: string
  name: string
  mimeType: string
  sizeBytes: number
  uploadedAt: string
  expiresAt: string
  status: 'active' | 'expired'
  hasPassword: boolean
  shareToken: string
}

/** Métadonnées publiques d'un fichier partagé (page de téléchargement). */
export type ShareInfo = {
  name: string
  sizeBytes: number
  expiresAt: string
  expired: boolean
  requiresPassword: boolean
}

export type UploadResult = {
  shareToken: string
  shareUrl: string
  expiresAt: string
}
