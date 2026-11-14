import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Callout } from '../components/Callout'
import { Input } from '../components/Form'
import {
  AlertIcon,
  DownloadIcon,
  FileIcon,
} from '../components/icons'
import { downloadSharedFile, getShareInfo } from '../api/files'
import type { ShareInfo } from '../api/types'
import { formatBytes, formatExpiry } from '../lib/format'
import './download.css'

type Phase = 'loading' | 'ready' | 'expired' | 'notfound'

export function Download() {
  const { token = '' } = useParams<{ token: string }>()

  const [phase, setPhase] = useState<Phase>('loading')
  const [info, setInfo] = useState<ShareInfo | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getShareInfo(token)
      .then((data) => {
        if (cancelled) return
        setInfo(data)
        setPhase(data.expired ? 'expired' : 'ready')
      })
      .catch(() => {
        if (cancelled) return
        setError("Ce fichier n'existe pas ou n'est plus disponible.")
        setPhase('notfound')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const handleDownload = async () => {
    if (!info) return
    setBusy(true)
    setError('')
    setPasswordError(false)
    try {
      const blob = await downloadSharedFile(token, password || undefined)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = info.name
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Téléchargement impossible.'
      if (message.toLowerCase().includes('mot de passe')) {
        setPasswordError(true)
      } else {
        setError(message)
        if (message.toLowerCase().includes('plus disponible')) {
          setPhase('expired')
        }
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-gradient">
      <Header />

      <main className="app-gradient__body download">
        <section className="card download__card" aria-labelledby="download-title">
          <h1 className="card__title" id="download-title">
            Télécharger un fichier
          </h1>

          {phase === 'loading' && <p className="download__loading">Chargement…</p>}

          {phase === 'notfound' && (
            <Callout tone="error">{error || "Ce fichier n'est plus disponible."}</Callout>
          )}

          {info && phase !== 'loading' && phase !== 'notfound' && (
            <>
              <div className="download__file">
                <span className="download__file-icon">
                  <FileIcon size={18} />
                </span>
                <span className="download__file-meta">
                  <span className="download__file-name" title={info.name}>
                    {info.name}
                  </span>
                  <span className="download__file-size">
                    {formatBytes(info.sizeBytes)}
                  </span>
                </span>
              </div>

              {phase === 'expired' ? (
                <Callout tone="error">
                  Ce fichier n'est plus disponible, il a expiré.
                </Callout>
              ) : (
                <>
                  <Callout tone="info">{formatExpiry(info.expiresAt)}</Callout>

                  {info.requiresPassword && (
                    <Input
                      id="share-password"
                      label="Mot de passe"
                      type="password"
                      placeholder="Saisissez le mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void handleDownload()
                      }}
                    />
                  )}

                  {passwordError && (
                    <Callout tone="error">
                      Mot de passe incorrect. Vérification du mot de passe…
                    </Callout>
                  )}
                  {error && !passwordError && (
                    <Callout tone="error">
                      <AlertIcon size={13} /> {error}
                    </Callout>
                  )}

                  <div className="card__footer">
                    <Button
                      block
                      icon={<DownloadIcon size={15} />}
                      disabled={info.requiresPassword && password.length === 0}
                      loading={busy}
                      onClick={handleDownload}
                    >
                      Télécharger
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="copyright">Copyright DataShare® 2025</footer>
    </div>
  )
}
