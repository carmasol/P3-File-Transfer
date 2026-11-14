/** Helpers de formatage. */

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 o'
  const units = ['o', 'Ko', 'Mo', 'Go']
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  )
  const value = bytes / 1024 ** index
  const rounded = index === 0 ? value : Math.round(value * 10) / 10
  return `${rounded.toLocaleString('fr-FR')} ${units[index]}`
}

export function formatExpiry(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expiré'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (days >= 1) {
    return `Expire dans ${days} jour${days > 1 ? 's' : ''}`
  }
  if (hours >= 1) {
    return `Expire dans ${hours} heure${hours > 1 ? 's' : ''}`
  }
  return 'Expire bientôt'
}

export function truncateMiddle(text: string, max = 28): string {
  if (text.length <= max) return text
  const half = Math.floor((max - 1) / 2)
  return `${text.slice(0, half)}…${text.slice(-half)}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
